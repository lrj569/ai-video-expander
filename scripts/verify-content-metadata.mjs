import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { computeFingerprints, mergeManifest, projectRoot, verifyManifest } from './content-metadata.mjs';

await verifyManifest();

const registry = JSON.parse(readFileSync(join(projectRoot, 'src/config/page-policies.json'), 'utf8'));
for (const policy of registry.policies) {
  assert.equal(
    policy.contentWatch.some((path) => path.startsWith('components/generator-common/') || path.startsWith('src/entries/generator/')),
    false,
    `${policy.path} must not fingerprint the generator/production module`,
  );
}

const baseline = await computeFingerprints();
const withHeroChange = await computeFingerprints({
  readFile(file, encoding) {
    const content = readFileSync(file, encoding);
    return file === join(projectRoot, 'components/home/Hero.tsx') ? `${content}\n// content-change-probe` : content;
  },
});
assert.notEqual(withHeroChange['/'], baseline['/'], 'homepage content change must update the homepage fingerprint');
assert.equal(withHeroChange['/pricing'], baseline['/pricing'], 'homepage-only content must not update pricing');

const withGeneratorChange = await computeFingerprints({
  readFile(file, encoding) {
    return readFileSync(file, encoding);
  },
});
assert.deepEqual(withGeneratorChange, baseline, 'generator files are outside all public page contentWatch lists');

const first = mergeManifest(undefined, baseline, new Date('2026-01-01T00:00:00.000Z'));
const second = mergeManifest(first, baseline, new Date('2026-02-01T00:00:00.000Z'));
for (const path of Object.keys(baseline)) {
  assert.equal(second.pages[path].lastModified, first.pages[path].lastModified, `${path} lastModified must be stable without content changes`);
}
assert.equal(second.generatedAt, first.generatedAt, 'unchanged synchronization must not rewrite the manifest timestamp');

const changedFingerprints = { ...baseline, '/': `${baseline['/']}-changed` };
const third = mergeManifest(first, changedFingerprints, new Date('2026-03-01T00:00:00.000Z'));
assert.equal(third.pages['/'].lastModified, '2026-03-01T00:00:00.000Z', 'changed homepage content must update homepage lastModified');
for (const path of Object.keys(baseline).filter((path) => path !== '/')) {
  assert.equal(third.pages[path].lastModified, first.pages[path].lastModified, `${path} must keep its date when only homepage content changes`);
}

console.log('Content metadata behavior verification passed.');
