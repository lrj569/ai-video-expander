import { lazy, Suspense, useEffect, useState, type ComponentProps, type ComponentType, type ReactNode } from 'react';

export default function dynamic<T extends ComponentType<any>>(
  loader: () => Promise<{ default: T }>,
  options: { ssr?: boolean; loading?: () => ReactNode } = {},
): T {
  const Lazy = lazy(loader);
  if (options.ssr === false) {
    const ClientOnly = (props: ComponentProps<T>) => {
      const [mounted, setMounted] = useState(false);
      useEffect(() => setMounted(true), []);
      if (!mounted) return options.loading?.() ?? null;
      return <Suspense fallback={options.loading?.() ?? null}><Lazy {...props} /></Suspense>;
    };
    return ClientOnly as T;
  }
  const Dynamic = (props: ComponentProps<T>) => {
    return <Suspense fallback={options.loading?.() ?? null}><Lazy {...props} /></Suspense>;
  };
  return Dynamic as T;
}
