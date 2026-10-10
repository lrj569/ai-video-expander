import { useEffect, useState } from 'react';

export function usePathname(): string {
  const [pathname, setPathname] = useState('/');
  useEffect(() => {
    const sync = () => setPathname(window.location.pathname);
    sync();
    document.addEventListener('astro:page-load', sync);
    window.addEventListener('popstate', sync);
    return () => {
      document.removeEventListener('astro:page-load', sync);
      window.removeEventListener('popstate', sync);
    };
  }, []);
  return pathname;
}

export function useSearchParams(): URLSearchParams {
  const [search, setSearch] = useState('');
  useEffect(() => setSearch(window.location.search), []);
  return new URLSearchParams(search);
}

export function useRouter() {
  return {
    push(url: string) { window.location.assign(url); },
    replace(url: string) { window.location.replace(url); },
    refresh() { window.location.reload(); },
    back() { window.history.back(); },
    forward() { window.history.forward(); },
    prefetch(_url: string) { return Promise.resolve(); },
  };
}

export function notFound(): never {
  throw new Error('ASTRO_NOT_FOUND');
}
