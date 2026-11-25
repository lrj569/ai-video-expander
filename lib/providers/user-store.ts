import { useSyncExternalStore } from 'react';
import { api } from '../api';

export interface UserInfo {
  uuid: string;
  email: string;
  from_login: string;
  nickname: string;
  avatar?: string;
  free_limit: number;
  remaining_limit: number;
  total_limit: number;
  use_limit: number;
  vip_last_time: number;
  level: number;
  created_at: number;
  updated_at: number;
  status: number;
  id: number;
  total_credits: number;
  free_times: number;
}

type UserSnapshot = {
  userId: string | null;
  userInfo: UserInfo | null;
  isLoadingUserInfo: boolean;
  sessionReady: boolean;
  lastFetchedAt: number;
};

const CACHE_PREFIX = 'account_snapshot:';
export const USER_INFO_MAX_AGE_MS = 60_000;

const serverSnapshot: UserSnapshot = {
  userId: null,
  userInfo: null,
  isLoadingUserInfo: false,
  sessionReady: false,
  lastFetchedAt: 0,
};

let snapshot: UserSnapshot = serverSnapshot;
let activeUserId: string | null = null;
let inFlightPromise: Promise<void> | null = null;
let inFlightUserId: string | null = null;
const listeners = new Set<() => void>();

function emit(next: UserSnapshot) {
  if (
    next.userId === snapshot.userId &&
    next.userInfo === snapshot.userInfo &&
    next.isLoadingUserInfo === snapshot.isLoadingUserInfo &&
    next.sessionReady === snapshot.sessionReady &&
    next.lastFetchedAt === snapshot.lastFetchedAt
  ) return;

  snapshot = next;
  listeners.forEach((listener) => listener());
}

function cacheKey(userId: string) {
  return `${CACHE_PREFIX}${userId}`;
}

function readCachedSnapshot(userId: string): Pick<UserSnapshot, 'userInfo' | 'lastFetchedAt'> | null {
  if (typeof sessionStorage === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(cacheKey(userId));
    if (!raw) return null;
    const cached = JSON.parse(raw) as { userInfo?: UserInfo; lastFetchedAt?: number };
    if (!cached.userInfo || typeof cached.lastFetchedAt !== 'number') return null;
    return { userInfo: cached.userInfo, lastFetchedAt: cached.lastFetchedAt };
  } catch {
    return null;
  }
}

function writeCachedSnapshot(userId: string, userInfo: UserInfo, lastFetchedAt: number) {
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.setItem(cacheKey(userId), JSON.stringify({ userInfo, lastFetchedAt }));
  } catch {
    // Storage is an optional performance hint.
  }
}

function removeCachedSnapshot(userId: string | null) {
  if (!userId || typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.removeItem(cacheKey(userId));
  } catch {
    // Ignore unavailable browser storage.
  }
}

function normalizeUserInfo(data: Omit<UserInfo, 'total_credits' | 'free_times'> & Partial<Pick<UserInfo, 'total_credits' | 'free_times'>>): UserInfo {
  return {
    ...data,
    total_credits: data.free_limit + data.remaining_limit,
    free_times: typeof data.free_times === 'number' ? data.free_times : 0,
  };
}

export function setActiveUser(userId: string | null) {
  if (activeUserId === userId) return;

  const previousUserId = activeUserId;
  activeUserId = userId;
  inFlightPromise = null;
  inFlightUserId = null;

  if (!userId) {
    removeCachedSnapshot(previousUserId);
    emit(serverSnapshot);
    return;
  }

  const cached = readCachedSnapshot(userId);
  emit({
    userId,
    userInfo: cached?.userInfo ?? null,
    isLoadingUserInfo: !cached?.userInfo,
    sessionReady: false,
    lastFetchedAt: cached?.lastFetchedAt ?? 0,
  });
}

export function markUserSessionReady(userId: string) {
  if (activeUserId === userId) emit({ ...snapshot, sessionReady: true });
}

export function isUserInfoStale(maxAgeMs = USER_INFO_MAX_AGE_MS) {
  return !snapshot.lastFetchedAt || Date.now() - snapshot.lastFetchedAt >= maxAgeMs;
}

export async function refreshUserInfo(options: { force?: boolean; showLoading?: boolean } = {}) {
  const userId = activeUserId;
  if (!userId || !api.auth.isTokenValid()) return;

  if (inFlightPromise && inFlightUserId === userId) return inFlightPromise;
  if (!options.force && !isUserInfoStale()) return;

  if (options.showLoading && !snapshot.userInfo) {
    emit({ ...snapshot, isLoadingUserInfo: true });
  }

  let request!: Promise<void>;
  request = (async () => {
    try {
      const result = await api.user.getUserInfo();
      if (activeUserId !== userId) return;
      if (result.code !== 200 || !result.data) {
        throw new Error(result.msg || 'User info response did not contain data');
      }

      const userInfo = normalizeUserInfo(result.data);
      const lastFetchedAt = Date.now();
      writeCachedSnapshot(userId, userInfo, lastFetchedAt);
      emit({ ...snapshot, userInfo, isLoadingUserInfo: false, lastFetchedAt });
    } catch (error) {
      if (activeUserId === userId) emit({ ...snapshot, isLoadingUserInfo: false });
      throw error;
    } finally {
      if (inFlightPromise === request) {
        inFlightPromise = null;
        inFlightUserId = null;
      }
    }
  })();

  inFlightPromise = request;
  inFlightUserId = userId;
  return request;
}

export function clearUserState() {
  const userId = activeUserId;
  activeUserId = null;
  inFlightPromise = null;
  inFlightUserId = null;
  removeCachedSnapshot(userId);
  api.auth.clearTokens();
  emit(serverSnapshot);
}

function forceRefreshUserInfo() {
  return refreshUserInfo({ force: true, showLoading: true });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getReadyAccount() {
  return snapshot.sessionReady ? { id: snapshot.userId, info: snapshot.userInfo } : null;
}

export function useUserInfo() {
  const current = useSyncExternalStore(subscribe, () => snapshot, () => serverSnapshot);
  return {
    userInfo: current.userInfo,
    readyUserId: current.sessionReady ? current.userId : null,
    isLoadingUserInfo: current.isLoadingUserInfo,
    refreshUserInfo: forceRefreshUserInfo,
    clearUserState,
  };
}
