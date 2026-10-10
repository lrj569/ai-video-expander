import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));

const stableJson = (value) => {
  if (Array.isArray(value)) return value.map(stableJson);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableJson(value[key])]));
  }
  return value;
};

const selectConfig = (config, selector) => {
  const parts = selector.split('.');
  let value = config;
  for (const part of parts) value = value?.[part];
  return value;
};

async function loadWebsiteConfig(root) {
  const configPath = join(root, 'website-config.js');
  let source = readFileSync(configPath, 'utf8');
  source = source.replace(/import (\w+) from '(\.\/configs\/[^']+\.json)';/g, (_, name, path) =>
    `const ${name} = ${readFileSync(resolve(root, path), 'utf8')};`);
  const encoded = Buffer.from(source).toString('base64');
  const module = await import(`data:text/javascript;base64,${encoded}`);
  return module.websiteConfig;
}

export async function computeFingerprints({ root = projectRoot, readFile = readFileSync } = {}) {
  const registry = JSON.parse(readFile(join(root, 'src/config/page-policies.json'), 'utf8'));
  const websiteConfig = await loadWebsiteConfig(root);
  const fingerprints = {};

  for (const policy of registry.policies.filter((entry) => ['manifest', 'cms-index'].includes(entry.sitemap))) {
    const hash = createHash('sha256');
    hash.update(`policy:${policy.path}\n`);
    for (const relativePath of policy.contentWatch) {
      const absolutePath = join(root, relativePath);
      if (!existsSync(absolutePath)) throw new Error(`${policy.path} watches missing file: ${relativePath}`);
      hash.update(`file:${relativePath}\n`);
      hash.update(readFile(absolutePath, 'utf8').replaceAll('\r\n', '\n'));
    }
    for (const selector of policy.configWatch) {
      hash.update(`config:${selector}\n`);
      hash.update(JSON.stringify(stableJson(selectConfig(websiteConfig, selector))));
    }
    fingerprints[policy.path] = hash.digest('hex');
  }

  return fingerprints;
}

export function mergeManifest(previous, fingerprints, now = new Date()) {
  const previousPaths = Object.keys(previous?.pages ?? {}).sort();
  const nextPaths = Object.keys(fingerprints).sort();
  const hasChanges = previousPaths.length !== nextPaths.length
    || nextPaths.some((path, index) => previousPaths[index] !== path || previous?.pages?.[path]?.fingerprint !== fingerprints[path]);
  const generatedAt = !hasChanges && previous?.generatedAt ? previous.generatedAt : now.toISOString();
  const pages = {};
  for (const [path, fingerprint] of Object.entries(fingerprints)) {
    const old = previous?.pages?.[path];
    pages[path] = {
      fingerprint,
      lastModified: old?.fingerprint === fingerprint && old.lastModified ? old.lastModified : generatedAt,
    };
  }
  return { version: 1, generatedAt, pages };
}

export async function syncManifest({ root = projectRoot, now = new Date() } = {}) {
  const target = join(root, 'src/generated/content-metadata.json');
  const previous = existsSync(target) ? JSON.parse(readFileSync(target, 'utf8')) : undefined;
  const fingerprints = await computeFingerprints({ root });
  const next = mergeManifest(previous, fingerprints, now);
  const serialized = `${JSON.stringify(next, null, 2)}\n`;
  if (!existsSync(target) || readFileSync(target, 'utf8') !== serialized) writeFileSync(target, serialized);
  return next;
}

export async function verifyManifest({ root = projectRoot } = {}) {
  const target = join(root, 'src/generated/content-metadata.json');
  if (!existsSync(target)) throw new Error('content metadata manifest is missing; run npm run sync:content-metadata');
  const manifest = JSON.parse(readFileSync(target, 'utf8'));
  const fingerprints = await computeFingerprints({ root });
  const failures = [];
  for (const [path, fingerprint] of Object.entries(fingerprints)) {
    if (!manifest.pages?.[path]) failures.push(`manifest is missing ${path}`);
    else if (manifest.pages[path].fingerprint !== fingerprint) failures.push(`${path} content fingerprint is stale`);
    if (!manifest.pages?.[path]?.lastModified || Number.isNaN(Date.parse(manifest.pages[path].lastModified))) {
      failures.push(`${path} has an invalid lastModified value`);
    }
  }
  for (const path of Object.keys(manifest.pages ?? {})) {
    if (!(path in fingerprints)) failures.push(`manifest contains unregistered route ${path}`);
  }
  if (failures.length) throw new Error(`${failures.join('\n')}\nRun npm run sync:content-metadata.`);
  return manifest;
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  const checkOnly = process.argv.includes('--check');
  try {
    if (checkOnly) {
      await verifyManifest();
      console.log('Content metadata manifest is current.');
    } else {
      const manifest = await syncManifest();
      console.log(`Content metadata synchronized for ${Object.keys(manifest.pages).length} routes.`);
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
