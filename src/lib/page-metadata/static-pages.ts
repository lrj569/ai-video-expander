import type { Metadata } from '@/src/compat/metadata';
import { SITE_NAME, getPageTdk, siteUrl, websiteConfig } from '@/website-config';
import { getPagePolicy } from '@/src/lib/page-policy';

export function buildStaticMetadata(path: string): Metadata {
  const tdk = getPageTdk(path);
  const policy = getPagePolicy(path);
  if (!policy) throw new Error(`Missing PagePolicy for ${path}`);
  const canonical = `${websiteConfig.canonical.url}${path === '/' ? '' : path}`;
  return {
    title: tdk.title,
    description: tdk.description,
    keywords: tdk.keywords,
    robots: { index: policy.robots.index, follow: policy.robots.follow },
    alternates: { canonical },
    openGraph: {
      title: tdk.title,
      description: tdk.description,
      url: canonical,
      siteName: SITE_NAME,
      images: [{ url: `${siteUrl}/share-img.png`, width: 1200, height: 630, alt: SITE_NAME }],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: SITE_NAME,
      title: tdk.title,
      description: tdk.description,
      images: [`${siteUrl}/share-img.png`],
    },
  };
}
