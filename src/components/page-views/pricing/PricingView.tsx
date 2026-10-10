import { pricingFaqSchema } from '@/lib/pricing-faq';
import { Metadata } from '@/src/compat/metadata';
import { Footer } from '@/components/Footer';
import PricingSection from '@/components/PricingSection';
import PricingFAQ from './PricingFAQ';
import { SITE_NAME, siteUrl, websiteConfig, getPageTdk } from '@/website-config';

const tdk = getPageTdk('/pricing');

// SEO metadata
export const metadata: Metadata = {
  title: tdk.title,
  description: tdk.description,
  keywords: tdk.keywords,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: `${websiteConfig.canonical.url}/pricing`,
  },
  openGraph: {
    title: tdk.title,
    description: tdk.description,
    url: `${websiteConfig.canonical.url}/pricing`,
    siteName: SITE_NAME,
    images: [
      {
        url: `${siteUrl}/share-img.png`,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} Pricing Plans`,
      },
    ],
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

// Only emit supported page facts, not invented product offers.
export const pricingSchemaData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: tdk.title,
  description: tdk.description,
  url: `${siteUrl}/pricing`,
};
export const faqSchemaData = pricingFaqSchema;

export default function PricingPage() {
  return <><PricingSection /><PricingFAQ /><Footer /></>;
}

