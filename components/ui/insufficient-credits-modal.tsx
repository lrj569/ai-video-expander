'use client';

import { X } from 'lucide-react';
import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";

interface InsufficientCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredCredits?: number;
  currentCredits?: number;
  returnFocus?: HTMLElement;
}

export function InsufficientCreditsModal({
  isOpen,
  onClose,
  requiredCredits,
  currentCredits,
  returnFocus,
}: InsufficientCreditsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto" onCloseAutoFocus={returnFocus ? event => {
        event.preventDefault();
        returnFocus.focus({ preventScroll: true });
      } : undefined}>
        <DialogHeader>
          <DialogTitle className="text-center">Insufficient Credits</DialogTitle>
        </DialogHeader>
        <div className="text-center py-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Not enough credits
          </h3>
          <DialogDescription className="text-muted-foreground mb-6">
            {requiredCredits !== undefined && <>You need at least {requiredCredits.toLocaleString('en-US', { maximumFractionDigits: 6 })} credit{requiredCredits === 1 ? '' : 's'} to generate. </>}
            {currentCredits !== undefined && <>You currently have {currentCredits.toLocaleString('en-US', { maximumFractionDigits: 6 })} credit{currentCredits === 1 ? '' : 's'}. </>}
            Purchase more credits to continue.
          </DialogDescription>
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                onClose();
                window.open('/pricing', '_blank');
              }}
            >
              Buy Credits
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

