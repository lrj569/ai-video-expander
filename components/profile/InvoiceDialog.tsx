'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from '@radix-ui/react-icons';
import { useUser } from '@/src/compat/clerk';
import { PayLogItem } from './types';
import { formatTimestamp } from './utils';
import { useToast } from '@/components/ui/toast-provider';
import InvoiceTemplate from '@/components/InvoiceTemplate';
import { siteConfig, contactConfig } from '@/website-config';

interface InvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payLogId: number | null;
  payLogList: PayLogItem[];
}

export function InvoiceDialog({ open, onOpenChange, payLogId, payLogList }: InvoiceDialogProps) {
  const { user } = useUser();
  const toast = useToast();
  const [invoiceType, setInvoiceType] = useState<'personal' | 'business'>('personal');
  const [companyName, setCompanyName] = useState('');
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);

  const handleCreateInvoice = async () => {
    if (!payLogId) {
      toast.error('Please select a payment record');
      return;
    }
    if (invoiceType === 'business' && !companyName.trim()) {
      toast.error('Please enter company name for business invoice');
      return;
    }

    setIsCreatingInvoice(true);
    try {
      const payLogItem = payLogList.find((item: PayLogItem) => item.id === payLogId);
      if (!payLogItem) {
        throw new Error('Payment record not found');
      }

      const priceValue = parseFloat((payLogItem.amount / 100).toString()) || 0;
      const invoiceNumber = `${siteConfig.slug.toUpperCase()}-${new Date().getFullYear()}-${payLogItem.id}`;
      const data = {
        invoiceNumber,
        dateOfIssue: formatTimestamp(payLogItem.created_at),
        companyName: siteConfig.name,
        companyEmailAddress: contactConfig.supportEmail,
        customerName: user?.fullName || user?.username || 'Customer',
        customerEmail: user?.primaryEmailAddress?.emailAddress || 'customer@example.com',
        customerCompanyName: invoiceType === 'business' ? companyName.trim() : '',
        description: `Purchase Credits for Video Generation Service`,
        quantity: 1,
        unitPrice: priceValue,
        amount: priceValue,
        subtotal: priceValue,
        total: priceValue,
        amountPaid: priceValue,
        notes: `Payment received in full on ${formatTimestamp(payLogItem.created_at)}. Thank you for your business!`
      };

      setInvoiceData(data);
      setShowInvoicePreview(true);

      setTimeout(() => {
        generateInvoicePDF(invoiceNumber);
      }, 300);
    } catch (error) {
      console.error('Failed to generate invoice:', error);
      toast.error('Failed to generate invoice');
      setShowInvoicePreview(false);
      setInvoiceData(null);
    } finally {
      setIsCreatingInvoice(false);
    }
  };

  const generateInvoicePDF = async (invoiceNumber: string) => {
    try {
      const invoiceElement = document.querySelector('.invoice-template') as HTMLElement;
      if (!invoiceElement) {
        throw new Error('Invoice template not found');
      }

      // Keep the PDF stack out of the profile island until the user requests an invoice.
      // Importing html2pdf.js adds a large compatibility wrapper; using its two underlying
      // libraries directly preserves the output while keeping every emitted chunk below budget.
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);

      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc: Document) => {
          // Strip stylesheets so html2canvas does not parse unsupported oklch() from globals.css.
          clonedDoc
            .querySelectorAll('style, link[rel="stylesheet"]')
            .forEach((el) => el.remove());
        },
      });

      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imageRatio = canvas.width / canvas.height;
      const pageRatio = pageWidth / pageHeight;
      let imageWidth = pageWidth;
      let imageHeight = pageHeight;

      if (imageRatio > pageRatio) {
        imageHeight = pageWidth / imageRatio;
      } else {
        imageWidth = pageHeight * imageRatio;
      }

      const imageX = (pageWidth - imageWidth) / 2;
      const imageY = (pageHeight - imageHeight) / 2;
      const imageData = canvas.toDataURL('image/jpeg', 0.98);

      pdf.addImage(imageData, 'JPEG', imageX, imageY, imageWidth, imageHeight, undefined, 'FAST');
      pdf.save(`invoice-${invoiceNumber}.pdf`);

      toast.success('Invoice generated and downloaded successfully!');
      handleClose();
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setShowInvoicePreview(false);
      setInvoiceData(null);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setInvoiceType('personal');
    setCompanyName('');
    setInvoiceData(null);
    setShowInvoicePreview(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-card-foreground">Create Invoice</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Choose invoice type and generate your invoice.
            </DialogDescription>
          </DialogHeader>

          <div className="flex border-b border-border mt-6">
            <button
              onClick={() => setInvoiceType('personal')}
              className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${invoiceType === 'personal'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-card-foreground'
                }`}
              disabled={isCreatingInvoice}
            >
              Personal Invoice
            </button>
            <button
              onClick={() => setInvoiceType('business')}
              className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${invoiceType === 'business'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-card-foreground'
                }`}
              disabled={isCreatingInvoice}
            >
              Business Invoice
            </button>
          </div>

          {invoiceType === 'business' ? (
            <div className="mt-6">
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter your company name"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                disabled={isCreatingInvoice}
              />
            </div>
          ) : (
            <div className="mt-6 p-3 bg-muted/50 rounded-lg text-center text-sm text-muted-foreground">
              Personal Invoice: Click Create Invoice to download.
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isCreatingInvoice}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateInvoice} disabled={isCreatingInvoice} className="flex items-center gap-2">
              {isCreatingInvoice ? (
                <>
                  <ReloadIcon className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Invoice'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {invoiceData && (
        <InvoiceTemplate data={invoiceData} isVisible={showInvoicePreview} />
      )}
    </>
  );
}

