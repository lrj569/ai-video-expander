'use client';

import { useUser, useClerk } from '@/src/compat/clerk';
import UserProfileMenu from '../nav/user-profile-menu';
import { Button } from '../../components/ui/button';

function AuthLoading() {
  return (
    <span role="status" className="inline-flex h-11 items-center rounded-full border border-primary bg-primary px-6 py-2 text-sm font-medium tracking-[-0.14px] text-primary-foreground">
      Login<span className="sr-only">: checking session</span>
    </span>
  );
}

export default function AuthButton() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { openSignIn } = useClerk();

  if (!isLoaded) {
    return <AuthLoading />;
  }

  // Signed-in: never fall through to the Login button (user may lag one frame).
  if (isSignedIn) {
    if (!user) {
      return <AuthLoading />;
    }
    return <UserProfileMenu user={user} />;
  }

  const handleLoginClick = () => {
    requestAnimationFrame(() => {
      openSignIn({
        oauthFlow: 'popup',
        fallbackRedirectUrl: '/',
        signUpFallbackRedirectUrl: '/',
      });
    });
  };

  return (
    <Button
      variant="default"
      className="cursor-pointer bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90"
      onClick={handleLoginClick}
    >
      Login
    </Button>
  );
}
