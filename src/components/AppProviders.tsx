import type { ReactNode } from 'react';
import { AuthModalProvider } from '@/components/auth/auth-modal-provider';
import { ToastProvider } from '@/components/ui/toast-provider';
import { UserProvider } from '@/lib/providers';

export default function AppProviders({
  children,
  driveUserState = false,
}: {
  children: ReactNode;
  driveUserState?: boolean;
}) {
  const content = <AuthModalProvider>{children}</AuthModalProvider>;

  return (
    <ToastProvider>
      {driveUserState ? <UserProvider>{content}</UserProvider> : content}
    </ToastProvider>
  );
}
