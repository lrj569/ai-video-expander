'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { $isLoadedStore } from '@clerk/astro/client';
import { useUser, useClerk } from '@/src/compat/clerk';
import UserProfileMenu from '../nav/user-profile-menu';
import { Button } from '../../components/ui/button';

const signInOptions = {
  oauthFlow: 'popup',
  fallbackRedirectUrl: '/',
  signUpFallbackRedirectUrl: '/',
} as const;

export default function AuthButton() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { openSignIn } = useClerk();
  const clerkReady = useSyncExternalStore($isLoadedStore.listen, $isLoadedStore.get, () => false);
  const ready = isLoaded && clerkReady;
  const [loginRequested, setLoginRequested] = useState(false);

  useEffect(() => {
    if (!ready || !loginRequested) return;

    setLoginRequested(false);
    if (!isSignedIn) openSignIn(signInOptions);
  }, [ready, loginRequested, isSignedIn, openSignIn]);

  if (isSignedIn && user) return <UserProfileMenu user={user} />;

  return (
    <Button
      type="button"
      variant="default"
      className="cursor-pointer bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90"
      aria-busy={loginRequested}
      onClick={() => {
        if (ready) openSignIn(signInOptions);
        else setLoginRequested(true);
      }}
    >
      Login
    </Button>
  );
}
