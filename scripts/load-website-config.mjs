import { readFileSync } from 'node:fs';

// Resolve generated JSON for Node verifiers without bundler-specific JSON imports.
export async function loadWebsiteConfig() {
  const configUrl = new URL('../website-config.js', import.meta.url);
  let source = readFileSync(configUrl, 'utf8');
  source = source.replace(/import (\w+) from '(\.\/configs\/[^']+\.json)';/g, (_, name, path) =>
    `const ${name} = ${readFileSync(new URL(path, configUrl), 'utf8')};`);
  return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
}
