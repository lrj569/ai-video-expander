import registry from '@/src/config/page-policies.json';

export type PageRendering = 'prerender' | 'ssr' | 'endpoint';
export type SitemapMode = 'manifest' | 'cms-index' | 'cms-items' | 'none';

export interface PagePolicy {
  path: string;
  routeFile: string;
  category: string;
  rendering: PageRendering;
  robots: { index: boolean; follow: boolean };
  sitemap: SitemapMode;
  llms: boolean;
  llmsLabel?: string;
  llmsDescription?: string;
  contentWatch: string[];
  configWatch: string[];
  contentIgnore?: string[];
}

export const pagePolicies = registry.policies as PagePolicy[];

function matchesPolicyPath(pattern: string, pathname: string): boolean {
  if (!pattern.includes('[')) return pattern === pathname;
  const expression = pattern
    .split('/')
    .map((segment) => segment.startsWith('[') && segment.endsWith(']') ? '[^/]+' : segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('/');
  return new RegExp(`^${expression}$`).test(pathname);
}

export function getPagePolicy(pathname: string): PagePolicy | undefined {
  return pagePolicies.find((policy) => matchesPolicyPath(policy.path, pathname));
}

export const sitemapPolicies = pagePolicies.filter((policy) => policy.sitemap !== 'none');
export const llmsPolicies = pagePolicies.filter((policy) => policy.llms && policy.robots.index);
