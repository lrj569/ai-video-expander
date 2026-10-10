import { publicProfileConfig, pricingConfig } from '@/website-config';
import { llmsPolicies } from '@/src/lib/page-policy';

interface PublicProfile {
  name: string;
  description: string;
  canonicalUrl: string;
  implementationStatus: string;
  pages: { path: string; title?: string; label?: string; description: string; status?: string; evidence?: string }[];
  capabilities: (string | { text: string; status: string; evidence: string })[];
}

export function buildLlmsTxt(): string {
  const profile = publicProfileConfig as PublicProfile;
  if (profile.implementationStatus !== 'verified-public') {
    return `# ${profile.name}\n\n> Public product documentation is pending verification.\n\nThis template is not a verified public product. No product capabilities or checkout availability are asserted here.\n`;
  }
  const publicPages = profile.pages.filter(page => page.status === 'verified' && page.evidence &&
    llmsPolicies.some(policy => policy.path === page.path && policy.robots.index));
  const links = publicPages.map(page =>
    `- [${page.title ?? page.label ?? page.path}](${profile.canonicalUrl}${page.path === '/' ? '' : page.path}): ${page.description}`);
  const pricing = pricingConfig.oneTimePlans.map(plan =>
    `- ${plan.credits.toLocaleString('en-US')} credits: ${plan.price}.`);
  return [
    `# ${profile.name}`, '', `> ${profile.description}`, '',
    '## Verified capabilities', '',
    ...profile.capabilities.filter(capability => typeof capability === 'string' ||
      (capability.status === 'verified' && capability.evidence))
      .map(capability => `- ${typeof capability === 'string' ? capability : capability.text}`), '',
    '## Pricing', '', `Prices are in ${pricingConfig.currency}. Credit packs are one-time purchases; purchased credits never expire.`,
    ...pricing, '', '## Public pages', '', ...links, '',
    '## Limits', '', 'Generation credit costs, refunds, taxes and supported payment methods must be checked in the applicable public terms or checkout. No fixed output count is implied.', '',
  ].join('\n');
}
