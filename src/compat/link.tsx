import type { AnchorHTMLAttributes, ReactNode } from 'react';

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string | { pathname?: string; query?: Record<string, string> };
  children?: ReactNode;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
};

export default function Link({ href, prefetch: _prefetch, replace: _replace, scroll: _scroll, ...props }: Props) {
  const url = typeof href === 'string'
    ? href
    : `${href.pathname ?? '/'}${href.query ? `?${new URLSearchParams(href.query)}` : ''}`;
  return <a {...props} href={url} />;
}
