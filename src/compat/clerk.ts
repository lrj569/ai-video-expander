import { useSyncExternalStore } from 'react';
import { $clerkStore, $userStore } from '@clerk/astro/client';

export type UserResource = NonNullable<ReturnType<typeof $userStore.get>>;
export {
  AuthenticateWithRedirectCallback,
  GoogleOneTap,
  SignIn,
  SignInButton,
  SignUp,
  SignUpButton,
  useAuth,
} from '@clerk/astro/react';

export function useUser() {
  const user = useSyncExternalStore($userStore.listen, $userStore.get, () => undefined);
  return { user: user as UserResource, isLoaded: user !== undefined, isSignedIn: Boolean(user) };
}

export function useClerk() {
  const clerk = useSyncExternalStore($clerkStore.listen, $clerkStore.get, () => null);
  const fallback: NonNullable<ReturnType<typeof $clerkStore.get>> = {
    openSignIn: async () => undefined,
    openSignUp: async () => undefined,
    signOut: async () => undefined,
  } as unknown as NonNullable<ReturnType<typeof $clerkStore.get>>;
  return clerk ?? fallback;
}
