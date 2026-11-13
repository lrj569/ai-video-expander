'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useAuth, useClerk, useUser } from '@/src/compat/clerk';
import { useToast } from '@/components/ui/toast-provider';
import { VoucherToast } from '@/components/ui/voucher-toast';
import { api } from '../api';
import {
  clearUserState,
  isUserInfoStale,
  markUserSessionReady,
  refreshUserInfo,
  setActiveUser,
  useUserInfo,
} from './user-store';

const IVCODE_CACHE_KEY = 'pending_ivcode';
const POLL_INTERVAL_MS = 60_000;
let syncPromise: Promise<void> | null = null;
let syncPromiseUserId: string | null = null;
let syncedUserId: string | null = null;

function readInviteCode() {
  try {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get('i') || params.get('ivcode');
    if (fromUrl) localStorage.setItem(IVCODE_CACHE_KEY, fromUrl);
    return fromUrl || localStorage.getItem(IVCODE_CACHE_KEY);
  } catch {
    return null;
  }
}

function clearInviteCode() {
  try {
    localStorage.removeItem(IVCODE_CACHE_KEY);
  } catch {
    // Browser storage is optional.
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const { user, isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();
  const { signOut } = useClerk();
  const { userInfo } = useUserInfo();
  const { error: showErrorToast } = useToast();
  const [voucherCount, setVoucherCount] = useState(0);
  const [showVoucherToast, setShowVoucherToast] = useState(false);
  const voucherShownForUser = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !user?.id) {
      clearUserState();
      syncPromise = null;
      syncPromiseUserId = null;
      syncedUserId = null;
      return;
    }

    const userId = user.id;
    setActiveUser(userId);
    if (syncedUserId === userId && api.auth.isTokenValid()) return;
    if (syncPromise && syncPromiseUserId === userId) return;

    let request!: Promise<void>;
    request = (async () => {
      try {
        const email = user.primaryEmailAddress?.emailAddress;
        if (!email) throw new Error('Signed-in account does not have a primary email address');

        const clerkToken = await getToken();
        if (!clerkToken) throw new Error('Unable to obtain a valid sign-in token');

        const inviteCode = readInviteCode();
        const response = await api.auth.syncUser({
          uuid: userId,
          email,
          nickname: user.fullName || undefined,
          avatar: user.imageUrl || undefined,
          from_login: 'google',
          token: clerkToken,
          ivcode: inviteCode || undefined,
        });

        if (!response || response.code !== 200 || !response.data?.access_token) {
          throw new Error(response?.message || response?.msg || 'Account synchronization failed');
        }

        if (inviteCode) clearInviteCode();
        syncedUserId = userId;
        markUserSessionReady(userId);
        await refreshUserInfo({ force: true, showLoading: true });
      } catch (error) {
        if (syncPromiseUserId !== userId) return;
        if (syncedUserId === userId) syncedUserId = null;
        const message = error instanceof Error ? error.message : 'Account synchronization failed';
        clearUserState();
        showErrorToast(`${message}. Please sign in again.`);
        await signOut();
      } finally {
        if (syncPromise === request) {
          syncPromise = null;
          syncPromiseUserId = null;
        }
      }
    })();

    syncPromise = request;
    syncPromiseUserId = userId;
  }, [getToken, isLoaded, isSignedIn, showErrorToast, signOut, user]);

  useEffect(() => {
    if (!isSignedIn || !user?.id) return;

    const refreshIfNeeded = () => {
      if (document.visibilityState !== 'visible' || !isUserInfoStale()) return;
      void refreshUserInfo().catch((error) => {
        console.error('Background user refresh failed:', error);
      });
    };

    const intervalId = window.setInterval(refreshIfNeeded, POLL_INTERVAL_MS);
    document.addEventListener('visibilitychange', refreshIfNeeded);
    window.addEventListener('focus', refreshIfNeeded);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', refreshIfNeeded);
      window.removeEventListener('focus', refreshIfNeeded);
    };
  }, [isSignedIn, user?.id]);

  useEffect(() => {
    if (!user?.id || !userInfo || voucherShownForUser.current === user.id) return;
    if (userInfo.level <= 0 && userInfo.free_times > 0) {
      voucherShownForUser.current = user.id;
      setVoucherCount(userInfo.free_times);
      setShowVoucherToast(true);
    }
  }, [user?.id, userInfo]);

  return (
    <>
      {children}
      {showVoucherToast && (
        <VoucherToast count={voucherCount} onClose={() => setShowVoucherToast(false)} />
      )}
    </>
  );
}

export { useUserInfo } from './user-store';
export type { UserInfo } from './user-store';
