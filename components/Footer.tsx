import Link from '@/src/compat/link';
import { Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FriendLink } from '../lib/server-api';
import { siteConfig, contactConfig, publicNavigation, brandConfig } from '@/website-config';

interface FooterProps {
  friendlyLinks?: FriendLink[];
}

export function Footer({ friendlyLinks = [] }: FooterProps) {
  const [year, setYear] = useState('');
  useEffect(() => { setYear(String(new Date().getFullYear())); }, []);

  return (
    <footer className="bg-background px-6 py-16 text-muted-foreground sm:px-8">
      <div className="mx-auto max-w-7xl">
        {friendlyLinks.length > 0 && (
          <div className="mb-10 border-b border-border pb-8">
            <div className="mb-4 text-[13px] font-medium">Partner sites</div>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {friendlyLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] hover:text-foreground hover:underline"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <Link href="/" title={`Return to the ${siteConfig.name} homepage`} className="mb-4 inline-flex items-center gap-2 text-foreground">
              <img src={brandConfig.logoRaster.src} width="32" height="32" alt="" className="rounded-[7px]" />
              <span className="text-[15px] font-medium">{siteConfig.name}</span>
            </Link>
            <p className="max-w-sm text-[13px] leading-5">
              {siteConfig.description}
            </p>
            {contactConfig.supportEmail && <a
              href={`mailto:${contactConfig.supportEmail}`}
              title="Email AI Video Expander support"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm text-foreground hover:bg-accent"
            >
              <Mail className="h-4 w-4" />
              {contactConfig.supportEmail}
            </a>}
          </div>

          <div>
            <div className="mb-3 text-[13px] font-medium text-foreground">Navigation</div>
            <ul className="space-y-2">
              {publicNavigation.map(({ href, label, title }) => (
                <li key={href}><Link href={href} title={title} className="text-[13px] hover:text-foreground">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-3 text-[13px] font-medium text-foreground">Legal</div>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-[13px] hover:text-foreground">Terms</Link></li>
              <li><Link href="/privacy" className="text-[13px] hover:text-foreground">Privacy</Link></li>
              <li><Link href="/refund" className="text-[13px] hover:text-foreground">Refund</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-[12px]">
          © <span data-current-year>{year}</span> {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
