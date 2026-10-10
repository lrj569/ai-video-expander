import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const failures = [];
const requiredRoutes = [
  'src/pages/index.astro',
  'src/pages/pricing.astro',
  'src/pages/profile.astro',
  'src/pages/sso-callback.astro',
  'src/pages/payment-success.astro',
  'src/pages/payment-failed.astro',
  'src/pages/terms.astro',
  'src/pages/privacy.astro',
  'src/pages/refund.astro',
  'src/pages/blog/index.astro',
  'src/pages/blog/[slug].astro',
  'src/pages/share/[id].astro',
  'src/pages/404.astro',
  'src/pages/robots.txt.ts',
  'src/pages/sitemap.xml.ts',
  'src/pages/llms.txt.ts',
];

for (const route of requiredRoutes) {
  if (!existsSync(join(projectRoot, route))) failures.push(`missing route source: ${route}`);
}

const walk = (directory) => existsSync(directory)
  ? readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? walk(path) : [path];
    })
  : [];

const legacyFiles = walk(join(projectRoot, 'app'));
if (legacyFiles.length) {
  failures.push(`legacy app files remain: ${legacyFiles.map(path => relative(projectRoot, path)).join(', ')}`);
}

const packageJson = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf8'));
const policyRegistry = JSON.parse(readFileSync(join(projectRoot, 'src/config/page-policies.json'), 'utf8'));
const pricing = JSON.parse(readFileSync(join(projectRoot, 'configs/generated-pricing.json'), 'utf8'));
if (packageJson.dependencies?.next) failures.push('next dependency still present');
if (packageJson.dependencies?.['@clerk/nextjs']) failures.push('@clerk/nextjs dependency still present');
if (packageJson.scripts?.build !== 'astro build') failures.push('build script is not astro build');

for (const [route, file] of [
  ['/', 'dist/client/index.html'],
  ['/pricing', 'dist/client/pricing/index.html'],
  ['/terms', 'dist/client/terms/index.html'],
  ['/privacy', 'dist/client/privacy/index.html'],
  ['/refund', 'dist/client/refund/index.html'],
]) {
  const output = join(projectRoot, file);
  if (!existsSync(output)) {
    failures.push(`missing prerendered output for ${route}: ${file}`);
    continue;
  }
  const html = readFileSync(output, 'utf8');
  if (route === '/' || route === '/pricing') {
    for (const plan of pricing.oneTimePlans) {
      if (!html.includes(plan.price) || !html.includes(plan.title)) {
        failures.push(`shared pricing is not server-rendered for ${route}: ${plan.key}`);
      }
    }
  }
  if (route === '/pricing') {
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .map(match => JSON.parse(match[1]));
    const faq = schemas.find(schema => schema['@type'] === 'FAQPage');
    if (faq?.mainEntity?.length !== 5) failures.push('Pricing FAQ schema must contain the five shared questions');
    for (const question of faq?.mainEntity ?? []) {
      if (!html.includes(question.name)) failures.push(`FAQ question missing in server HTML: ${question.name}`);
    }
  }
  if (!/<title>[^<]+<\/title>/.test(html)) failures.push(`missing title in ${route}`);
  if (!/<link rel="canonical" href="[^"]+"/.test(html)) failures.push(`missing canonical in ${route}`);
  const policy = policyRegistry.policies.find(entry => entry.path === route);
  const expectedRobots = policy?.robots.index
    ? `index, ${policy.robots.follow ? 'follow' : 'nofollow'}`
    : `noindex, ${policy?.robots.follow ? 'follow' : 'nofollow'}`;
  if (policy && !html.includes(`<meta name="robots" content="${expectedRobots}`)) {
    failures.push(`robots output does not match PagePolicy for ${route}`);
  }
  if (policy?.robots.index && !html.includes('rel="describedby"')) {
    failures.push(`indexable route is missing llms.txt discovery link: ${route}`);
  }
  if (/fonts\.(googleapis|gstatic)\.com|Source Code Pro/.test(html)) {
    failures.push(`render-blocking remote font remains in ${route}`);
  }
}

if (existsSync(join(projectRoot, 'dist/client/referral'))) failures.push('deleted /referral route remains in build output');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Astro source and output verification passed for ${requiredRoutes.length} route files.`);
