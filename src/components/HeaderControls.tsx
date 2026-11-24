'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { publicNavigation } from '@/website-config';
import Link from '@/src/compat/link';
import AppProviders from './AppProviders';
import NavAuthIsland from '@/components/nav/nav-auth-island';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';



function Controls() {
  const [open, setOpen] = useState(false);

  return (
    <div className="ml-auto flex flex-shrink-0 items-center gap-2">
      <div className="hidden lg:flex" data-site-auth>
        <NavAuthIsland variant="desktop" />
      </div>
      <div className="flex lg:hidden" data-site-auth>
        <NavAuthIsland variant="mobile" />
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="secondary" size="icon" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] bg-background sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav className="mt-6 flex flex-col gap-4" aria-label="Mobile navigation">
            {publicNavigation.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-2 text-left text-sm font-medium tracking-[-0.14px] text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function HeaderControls() {
  return (
    <AppProviders driveUserState>
      <Controls />
    </AppProviders>
  );
}
