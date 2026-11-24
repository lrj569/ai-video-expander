import source from '../../../../docs/page-development-plans/ai-video-expander-home.md?raw';
import { normalizeLockedCopy } from '@/src/lib/locked-copy';
import { SITE_NAME, websiteConfig } from '@/website-config';

const document = normalizeLockedCopy(source);

function between(sourceText: string, start: string, end: string): string {
  const [, after] = sourceText.split(start);
  if (!after?.includes(end)) {
    throw new Error(`Missing locked homepage boundary: ${start}`);
  }
  return after.split(end)[0].trim();
}

function requiredMatch(sourceText: string, pattern: RegExp): string {
  const value = sourceText.match(pattern)?.[1]?.trim();
  if (!value) {
    throw new Error(`Missing locked homepage field: ${pattern.source}`);
  }
  return value;
}

function label(sourceText: string, name: string): string {
  return requiredMatch(sourceText, new RegExp(`^\\*\\*${name}:\\*\\* (.+)$`, 'm'));
}

function moduleCopy(name: string): string {
  const customerCopy = between(document, '<!-- customer-copy:start -->', '<!-- customer-copy:end -->');
  const section = between(customerCopy, `<!-- module:${name}:start -->`, `<!-- module:${name}:end -->`);
  return section.slice(section.indexOf('\n') + 1).trim();
}

function sectionHeading(sourceText: string): string {
  return requiredMatch(sourceText, /^## (.+)$/m);
}

function parsedAction(value: string) {
  const [text, href] = value.split(' -> ');
  if (!text || !href) {
    throw new Error(`Invalid locked homepage action: ${value}`);
  }
  return { text, href };
}

function sectionItems(sourceText: string) {
  return [...sourceText.matchAll(/^### (.+)\n([\s\S]*?)(?=^### |(?![\s\S]))/gm)].map(([, title, text]) => {
    const [body, action] = text.trim().split(/^\*\*CTA:\*\* /m);
    return { title, body: body.trim(), action: action ? parsedAction(action.trim()) : null };
  });
}

function linkedSentence(value: string) {
  const match = /\[([^\]]+)\]\(([^)]+)\)/.exec(value);
  if (!match) {
    throw new Error('Missing locked homepage Guide link');
  }
  return {
    before: value.slice(0, match.index),
    linkText: match[1],
    href: match[2],
    after: value.slice(match.index + match[0].length),
  };
}

const tdk = between(document, '<!-- tdk:start -->', '<!-- tdk:end -->');
const title = label(tdk, 'Title');
const description = label(tdk, 'Description');
const keywords = label(tdk, 'Keywords');
const json = between(document, '<!-- json-ld:start -->', '<!-- json-ld:end -->');
export const structuredData = [JSON.parse(requiredMatch(json, /```json\n([\s\S]+?)\n```/)) as Record<string, unknown>];

export const metadata = {
  title,
  description,
  keywords,
  openGraph: {
    title,
    description,
    siteName: SITE_NAME,
    locale: 'en_US',
    type: 'website',
    images: [{
      url: `${websiteConfig.canonical.url}/share-img.png`,
      width: 1200,
      height: 630,
      alt: SITE_NAME,
    }],
  },
  twitter: { title, description, card: 'summary_large_image' },
};

const hero = moduleCopy('hero');
const definition = moduleCopy('what-is');
const features = moduleCopy('key-features');
const tutorial = moduleCopy('how-to-use');
const cases = moduleCopy('use-cases');
const pricing = moduleCopy('pricing');
const faq = moduleCopy('faq');
const final = moduleCopy('final-cta');

export const homeCopy = {
  hero: {
    title: requiredMatch(hero, /^# (.+)$/m),
    subtitle: label(hero, 'Subtitle'),
  },
  definition: {
    title: sectionHeading(definition),
    description: label(definition, 'Description'),
    body: requiredMatch(definition, /^\*\*Description:\*\* .+\n\n([\s\S]+)$/m),
  },
  features: {
    title: sectionHeading(features),
    description: label(features, 'Description'),
    items: sectionItems(features),
  },
  tutorial: {
    title: sectionHeading(tutorial),
    description: linkedSentence(label(tutorial, 'Description')),
    items: sectionItems(tutorial.replace(/^\d+\. ### /gm, '### ')),
  },
  cases: {
    title: sectionHeading(cases),
    description: label(cases, 'Description'),
    items: sectionItems(cases),
  },
  pricing: {
    title: sectionHeading(pricing),
    description: label(pricing, 'Description'),
    link: linkedSentence(requiredMatch(pricing, /^(\[[^\]]+\]\([^)]+\))$/m)),
  },
  faq: {
    title: sectionHeading(faq),
    description: label(faq, 'Description'),
    items: sectionItems(faq),
  },
  final: {
    title: sectionHeading(final),
    body: requiredMatch(final, /^## .+\n\n(.+)$/m),
    action: parsedAction(label(final, 'Primary CTA')),
  },
};
