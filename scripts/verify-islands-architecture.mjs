import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const failures = [];
const sourceRoots = ['src', 'components', 'lib'];
const sourceExtensions = new Set(['.astro', '.ts', '.tsx']);

function walk(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const sourceFiles = sourceRoots
  .flatMap((root) => walk(join(projectRoot, root)))
  .filter((file) => sourceExtensions.has(extname(file)));

const sources = sourceFiles.map((file) => ({
  file,
  relativePath: relative(projectRoot, file).replaceAll('\\', '/'),
  content: readFileSync(file, 'utf8'),
}));

const accountDrivers = sources.filter(({ content }) => content.includes('<AppProviders driveUserState>'));
if (accountDrivers.length !== 1 || accountDrivers[0]?.relativePath !== 'src/components/HeaderControls.tsx') {
  failures.push(`expected one account driver in HeaderControls.tsx, found: ${accountDrivers.map(({ relativePath }) => relativePath).join(', ') || 'none'}`);
}

const directUserInfoRequests = sources.filter(({ content }) => content.includes('api.user.getUserInfo()'));
if (directUserInfoRequests.length !== 1 || directUserInfoRequests[0]?.relativePath !== 'lib/providers/user-store.ts') {
  failures.push(`user info requests must be owned by user-store.ts, found: ${directUserInfoRequests.map(({ relativePath }) => relativePath).join(', ') || 'none'}`);
}

for (const route of ['src/pages/index.astro', 'src/pages/pricing.astro']) {
  const content = readFileSync(join(projectRoot, route), 'utf8');
  if (/Entry\s+client:load/.test(content)) failures.push(`${route} hydrates a whole page entry`);
  if (!content.includes('<Footer />')) failures.push(`${route} does not render the footer statically`);
}

const header = readFileSync(join(projectRoot, 'src/components/SiteHeader.astro'), 'utf8');
if (!header.includes('<nav')) failures.push('SiteHeader.astro is missing static navigation markup');
if (!header.includes('client:load') || !header.includes('transition:persist="account-controls"')) {
  failures.push('account controls must load immediately and persist across Astro route transitions');
}

for (const route of ['src/pages/profile.astro', 'src/pages/sso-callback.astro']) {
  const content = readFileSync(join(projectRoot, route), 'utf8');
  if (!content.includes("Cache-Control', 'private, no-store")) {
    failures.push(`${route} is missing private, no-store cache protection`);
  }
}

const store = readFileSync(join(projectRoot, 'lib/providers/user-store.ts'), 'utf8');
for (const required of ['inFlightPromise', 'lastFetchedAt', 'activeUserId', 'useSyncExternalStore', 'sessionStorage']) {
  if (!store.includes(required)) failures.push(`user store is missing required contract: ${required}`);
}

const driver = readFileSync(join(projectRoot, 'lib/providers/UserProvider.tsx'), 'utf8');
for (const required of ['visibilitychange', "document.visibilityState !== 'visible'", "window.addEventListener('focus'", 'POLL_INTERVAL_MS = 60_000']) {
  if (!driver.includes(required)) failures.push(`account driver is missing lifecycle guard: ${required}`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Astro islands architecture verification passed.');
