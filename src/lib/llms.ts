import { publicProfileConfig } from '@/website-config';
import { llmsPolicies } from '@/src/lib/page-policy';

interface PublicProfile {
  name: string;
  description: string;
  canonicalUrl: string;
  pages: { path: string; title: string; description: string; usage: string; status: string; evidence: string }[];
  capabilities: { text: string; status: string; evidence: string }[];
}

// Public content evidence is separate from internal business/release readiness.
export function buildLlmsTxt(): string {
  const profile = publicProfileConfig as PublicProfile;
  // Without a configured domain (development stage) links are relative, e.g. /guide.
  const origin = profile.canonicalUrl.trim().replace(/\/$/, '');
  const hasDomain = origin !== '';
  const validDomain = !hasDomain || !/(?:example\.(?:com|net|org)|\.invalid)(?:$|\/)/i.test(origin);
  const pages = (profile.pages ?? []).filter(page => validDomain &&
    page.status === 'verified' && page.evidence &&
    llmsPolicies.some(policy => policy.path === page.path && policy.robots.index));
  const descriptions = (profile.capabilities ?? []).filter(capability =>
    typeof capability === 'object' && capability.status === 'verified' && capability.evidence)
    .map(capability => capability.text);
  const lines = [`# ${profile.name}`, '', `> ${profile.description}`, ''];
  if (descriptions.length) lines.push(...descriptions, '');
  if (pages.length) {
    lines.push('## Product', '');
    for (const page of pages) {
      lines.push(`- [${page.title}](${hasDomain ? origin : ''}${page.path}): ${page.description}`);
      lines.push(`  ${page.usage}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}
