import { useEffect, useRef, useState } from 'react';
import { $clerkStore } from '@clerk/astro/client';
import { api } from '@/lib/api';
import { getReadyAccount, useUserInfo } from '@/lib/providers/user-store';
import { InsufficientCreditsModal } from '@/components/ui/insufficient-credits-modal';
import { reframeCreditCheck, reframeCreditShortfall, type CreditCheck, type CreditShortfall } from '@/src/lib/reframe-account';

export default function ReframeAccount() {
  const anchor = useRef<HTMLSpanElement>(null);
  const [dialog, setDialog] = useState<{ open: boolean; details: CreditShortfall } | null>(null);
  const { refreshUserInfo } = useUserInfo();

  useEffect(() => {
    const workspace = anchor.current?.closest('expander-workspace');
    if (!workspace) return;
    const lifecycle = new AbortController();
    const { signal } = lifecycle;

    function check(event: Event) {
      event.preventDefault();
      const { detail } = event as CustomEvent<CreditCheck>;
      void verify(detail);
    }

    async function verify({ requiredCredits, returnFocus, resolve, reject }: CreditCheck) {
      try {
        const clerk = $clerkStore.get();
        if (!clerk) throw new Error('Sign-in is currently unavailable. Try again later.');
        if (!clerk.user) {
          clerk.openSignIn({ oauthFlow: 'popup' });
          resolve(null);
          return;
        }
        if (getReadyAccount()?.id !== clerk.user.id || !api.auth.isTokenValid()) {
          throw new Error('Your account is still connecting. Try again in a moment.');
        }

        const accountId = clerk.user.id;
        await refreshUserInfo();
        if (signal.aborted) return resolve(null);
        const account = getReadyAccount();
        const currentCredits = account?.info?.total_credits;
        if (account?.id !== accountId || typeof currentCredits !== 'number' || !Number.isFinite(currentCredits)) {
          throw new Error('We could not verify your credit balance. Try again.');
        }
        if (currentCredits < requiredCredits) {
          setDialog({ open: true, details: { requiredCredits, currentCredits, returnFocus } });
          resolve(null);
          return;
        }
        resolve(accountId);
      } catch (error) {
        reject(error instanceof Error ? error : new Error('We could not verify your credit balance. Try again.'));
      }
    }

    workspace.addEventListener(reframeCreditCheck, check, { signal });
    workspace.addEventListener(reframeCreditShortfall, event => {
      setDialog({ open: true, details: (event as CustomEvent<CreditShortfall>).detail });
    }, { signal });
    return () => lifecycle.abort();
  }, [refreshUserInfo]);

  return (
    <>
      <span ref={anchor} hidden />
      <InsufficientCreditsModal
        isOpen={dialog?.open ?? false}
        requiredCredits={dialog?.details.requiredCredits}
        currentCredits={dialog?.details.currentCredits}
        returnFocus={dialog?.details.returnFocus}
        onClose={() => setDialog(previous => previous && { ...previous, open: false })}
      />
    </>
  );
}
