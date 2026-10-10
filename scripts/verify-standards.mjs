import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifyManifest } from './content-metadata.mjs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const registry = JSON.parse(readFileSync(join(root, 'src/config/page-policies.json'), 'utf8'));
const failures = [];

const requiredStandards = [
  'docs/astro-project-development-standard.md',
  'docs/astro-ssr-performance-standard.md',
  'docs/astro-islands-architecture.md',
];
for (const standard of requiredStandards) {
  if (!existsSync(join(root, standard))) failures.push(`missing required engineering standard: ${standard}`);
}

const agentsSource = readFileSync(join(root, 'AGENTS.md'), 'utf8');
for (const standard of requiredStandards) {
  if (!agentsSource.includes(standard)) failures.push(`AGENTS.md must reference ${standard}`);
}

const walk = (directory) => existsSync(directory)
  ? readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? walk(path) : [path];
    })
  : [];

const normalize = (path) => relative(root, path).replaceAll('\\', '/');
const pageSources = walk(join(root, 'src/pages'))
  .filter((file) => ['.astro', '.ts'].includes(extname(file)))
  .map(normalize)
  .sort();
const registeredSources = registry.policies.map((policy) => policy.routeFile).sort();

for (const file of pageSources.filter((file) => file.endsWith('.astro'))) {
  const source = readFileSync(join(root, file), 'utf8');
  if (source.includes('client:only')) failures.push(`${file} uses client:only without an approved exception`);
}

for (const file of pageSources) {
  if (!registeredSources.includes(file)) failures.push(`route is missing PagePolicy: ${file}`);
}
for (const file of registeredSources) {
  if (!pageSources.includes(file)) failures.push(`PagePolicy points to a missing route: ${file}`);
}

const seenPaths = new Set();
for (const policy of registry.policies) {
  if (seenPaths.has(policy.path)) failures.push(`duplicate PagePolicy path: ${policy.path}`);
  seenPaths.add(policy.path);
  if (!policy.robots.index && policy.sitemap !== 'none') failures.push(`${policy.path} is noindex but included in sitemap`);
  if (!policy.robots.index && policy.llms) failures.push(`${policy.path} is noindex but included in llms.txt`);
  if (policy.llms && !policy.llmsLabel) failures.push(`${policy.path} needs llmsLabel`);
  if (policy.category !== 'system' && !policy.contentWatch.length) failures.push(`${policy.path} needs contentWatch files`);
  for (const watched of policy.contentWatch) {
    if (!existsSync(join(root, watched))) failures.push(`${policy.path} watches missing file: ${watched}`);
  }

  const source = existsSync(join(root, policy.routeFile)) ? readFileSync(join(root, policy.routeFile), 'utf8') : '';
  if (policy.rendering === 'prerender' && !source.includes('export const prerender = true')) {
    failures.push(`${policy.path} must be prerendered`);
  }
  if (policy.rendering === 'ssr' && !source.includes('export const prerender = false')) {
    failures.push(`${policy.path} must use SSR`);
  }
}

for (const route of ['/profile', '/payment-success', '/payment-failed', '/sso-callback', '/share/[id]']) {
  const policy = registry.policies.find((entry) => entry.path === route);
  if (!policy) continue;
  const source = readFileSync(join(root, policy.routeFile), 'utf8');
  if (!source.includes("Cache-Control', 'private, no-store")) failures.push(`${route} is missing private, no-store`);
}

const robots = readFileSync(join(root, 'src/pages/robots.txt.ts'), 'utf8');
if (robots.includes("'/profile/'")) failures.push('robots.txt must not block /profile/ because crawlers need to see noindex');

const baseLayout = readFileSync(join(root, 'src/layouts/BaseLayout.astro'), 'utf8');
if (!baseLayout.includes('rel="describedby"')) failures.push('BaseLayout is missing the llms.txt describedby link');
for (const blocked of ['fonts.googleapis.com', 'fonts.gstatic.com', 'Source Code Pro']) {
  if (baseLayout.includes(blocked)) failures.push(`BaseLayout contains render-blocking font reference: ${blocked}`);
}

const homepage = readFileSync(join(root, 'src/pages/index.astro'), 'utf8');
const globalStyles = readFileSync(join(root, 'src/styles/globals.css'), 'utf8');
if (!homepage.includes('client:visible')) failures.push('below-fold homepage interaction must use client:visible');
if (!homepage.includes('below-fold-content') || !globalStyles.includes('content-visibility: auto')) {
  failures.push('below-fold content-visibility safeguard is missing');
}

const astroConfig = readFileSync(join(root, 'astro.config.mjs'), 'utf8');
if (!astroConfig.includes('site: siteUrl')) failures.push('Astro site must use website-config canonical URL');
if (!astroConfig.includes("inlineStylesheets: 'auto'")) failures.push('Astro must keep minimal automatic stylesheet inlining');

if (existsSync(join(root, 'app'))) failures.push('legacy app directory must not exist');
if (existsSync(join(root, 'src/pages/referral.astro'))) failures.push('/referral route must not exist');
if (existsSync(join(root, 'public/llms.txt'))) failures.push('public/llms.txt must be generated by the Astro endpoint instead');

const configSource = readFileSync(join(root, 'website-config.js'), 'utf8');
const configModule = await import('./load-website-config.mjs').then(module => module.loadWebsiteConfig());
const { websiteConfig } = configModule;
const llmsPages = registry.policies.filter((policy) => policy.llms && policy.robots.index);
const llmsPreview = [
  websiteConfig.project.name,
  websiteConfig.project.purpose,
  websiteConfig.project.overview,
  ...websiteConfig.project.capabilities,
  ...websiteConfig.project.workflows,
  ...websiteConfig.project.audience,
  ...websiteConfig.project.limitations,
  ...llmsPages.map((policy) => `${websiteConfig.canonical.url}${policy.path === '/' ? '' : policy.path}`),
  `${websiteConfig.canonical.url}/sitemap.xml`,
].join('\n');
if (/InfiniteTalk/i.test(llmsPreview)) failures.push('generated llms.txt contains stale InfiniteTalk content');
for (const privatePath of ['/profile', '/terms', '/privacy', '/refund', '/payment-success', '/payment-failed', '/sso-callback']) {
  if (llmsPages.some((policy) => policy.path === privatePath)) failures.push(`llms.txt exposes excluded route ${privatePath}`);
}

try {
  await verifyManifest();
} catch (error) {
  failures.push(error instanceof Error ? error.message : String(error));
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Astro project standards verification passed for ${registry.policies.length} registered routes.`);
