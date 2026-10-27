/* Static contract checks only: no network, login, checkout or production proof. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const config = read('website-config.js');
assert.match(config, /pricing:\s*generatedPricing/);
assert.match(config, /export const siteConfig = generatedSite/);
const api = read('lib/api.ts');
assert.match(api, /\/api\/pay\/anyway/);
assert.doesNotMatch(api, /\/api\/pay\/stripe/);
assert.match(api, /headers: getHeaders\(\),\s*body: JSON.stringify\(\{\s*price_id: priceId,/);
const section = read('components/PricingSection.tsx');
assert.match(section, /credits: selectedPlan.credits/);
assert.doesNotMatch(section, /buttonText\.match/);
assert.match(section, /heading\?: string/);
assert.match(section, /description\?: string/);
assert.match(section, /md:grid-cols-3/);
assert.match(section, /if \(!checkoutConfigured\) return/);
assert.match(section, /disabled=\{!checkoutConfigured/);
const readinessModule = { exports: {} };
vm.runInNewContext(ts.transpileModule(read('lib/checkout-readiness.ts'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, { exports: readinessModule.exports, URL });
const ready = readinessModule.exports.isCheckoutConfigured;
assert.equal(ready({ implementationStatus: 'template-unconfigured' }, { baseUrl: 'https://api.real-site.test', appId: 'configured-app' }), false);
assert.equal(ready({ implementationStatus: 'verified-public' }, { baseUrl: 'https://api.example.com', appId: 'configured-app' }), false);
assert.equal(ready({ implementationStatus: 'verified-public' }, { baseUrl: 'https://api.real-site.test', appId: 'template-app' }), false);
assert.equal(ready({ implementationStatus: 'verified-public' }, { baseUrl: 'https://api.real-site.test', appId: 'configured-app' }), true);
assert.equal(ready({ implementationStatus: 'target-state-development' }, { baseUrl: 'https://api.real-site.test', appId: 'configured-app' }), true);
for (const implementationStatus of ['implemented', 'planning', '', 'unknown']) {
  assert.equal(ready({ implementationStatus }, { baseUrl: 'https://api.real-site.test', appId: 'configured-app' }), false);
}
const faq = read('src/components/page-views/pricing/PricingFAQ.tsx');
const page = read('src/components/page-views/pricing/PricingView.tsx');
assert.match(faq, /import \{ pricingFaqItems \} from '@\/lib\/pricing-faq'/);
assert.match(page, /import \{ pricingFaqSchema \} from '@\/lib\/pricing-faq'/);
assert.ok(fs.existsSync(path.join(root, 'src/pages/llms.txt.ts')));
assert.ok(!fs.existsSync(path.join(root, 'public/llms.txt')));
assert.match(read('src/lib/llms.ts'), /llmsPolicies/);
assert.doesNotMatch(read('src/lib/llms.ts'), /pending verification|This template is not/);
assert.doesNotMatch(page, /'Product'|'Offer'|InStock|unitText: 'month'/);
assert.doesNotMatch(faq, /480p|720p|monthly subscriptions|Visa/);

const pricing = JSON.parse(read('configs/generated-pricing.json'));
const faqModule = { exports: {} };
vm.runInNewContext(ts.transpileModule(read('lib/pricing-faq.ts'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, {
  exports: faqModule.exports,
  require: (specifier) => {
    assert.equal(specifier, '@/website-config');
    return { pricingConfig: pricing };
  },
});
const sharedFaq = faqModule.exports;
assert.equal(sharedFaq.pricingFaqItems.length, 5);
assert.equal(sharedFaq.pricingFaqSchema.mainEntity.length, 5);
assert.deepEqual(
  JSON.parse(JSON.stringify(sharedFaq.pricingFaqSchema.mainEntity)),
  JSON.parse(JSON.stringify(sharedFaq.pricingFaqItems.map(({ question, answer }) => ({
    '@type': 'Question', name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })))),
);
assert.equal(pricing.currency, 'USD');
assert.equal(pricing.purchaseType, 'one-time');
assert.equal(pricing.creditsExpire, false);
for (const plan of pricing.oneTimePlans) {
  assert.equal(plan.priceId, plan.key);
  assert.equal(typeof plan.credits, 'number');
  assert.ok(Number.isInteger(plan.credits) && plan.credits > 0);
  assert.ok(Number.isFinite(plan.priceAmount) && plan.priceAmount > 0);
}
const site = JSON.parse(read('configs/generated-site.json'));
assert.ok(site.name && site.slug && site.toolPath);
assert.equal(typeof site.canonicalUrl, 'string');
// Development runs without a domain (canonicalUrl ''); every other profile needs a clean HTTPS origin,
// the same rule the builder's site contract bridge applies.
if (!(site.implementationStatus === 'target-state-development' && site.canonicalUrl === '')) {
  const origin = new URL(site.canonicalUrl);
  assert.equal(origin.protocol, 'https:');
  assert.ok(origin.hostname && !origin.username && !origin.password);
  assert.ok(origin.pathname === '/' && !origin.search && !origin.hash);
}
const llmsModule = { exports: {} };
const profile = JSON.parse(read('configs/generated-public-profile.json'));
const policies = JSON.parse(read('src/config/page-policies.json')).policies;
let currentProfile = profile;
vm.runInNewContext(ts.transpileModule(read('src/lib/llms.ts'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, {
  exports: llmsModule.exports,
  require: (specifier) => specifier === '@/website-config'
    ? { get publicProfileConfig() { return currentProfile; } }
    : { llmsPolicies: policies.filter(policy => policy.llms && policy.robots.index) },
});
// Identity only when nothing is verified: no placeholder or status wording in any state.
for (const implementationStatus of ['template-unconfigured', 'target-state-development', 'verified-public']) {
  currentProfile = { ...profile, implementationStatus };
  const content = llmsModule.exports.buildLlmsTxt();
  assert.match(content, new RegExp(`^# ${profile.name}`));
  assert.doesNotMatch(content, /pending verification|not a verified|## Product|## Pricing/);
}
// Verified pages and capabilities appear in development as well; unverified ones never do.
const verifiedPages = [
  { path: '/', title: 'Home', description: 'Public entry.', usage: 'Open the tool and follow the steps.', status: 'verified', evidence: 'fixture' },
  { path: '/pricing', title: 'Pricing', description: 'Credit packs.', usage: 'Compare packs and choose one.', status: 'verified', evidence: 'fixture' },
  { path: '/profile', title: 'Profile', description: 'Private.', usage: 'Private.', status: 'verified', evidence: 'fixture' },
  { path: '/invented', title: 'Missing', description: 'Missing.', usage: 'Missing.', status: 'verified', evidence: 'fixture' },
  { path: '/blog', title: 'Unverified blog', description: 'Not ready.', usage: 'Not ready.', status: 'planned', evidence: '' },
];
for (const implementationStatus of ['target-state-development', 'verified-public']) {
  currentProfile = {
    ...profile, implementationStatus, canonicalUrl: '',
    pages: verifiedPages,
    capabilities: [
      { text: 'Verified object capability', status: 'verified', evidence: 'fixture' },
      { text: 'Do not assert planned capability', status: 'planned', evidence: '' },
    ],
  };
  const publicLlms = llmsModule.exports.buildLlmsTxt();
  assert.match(publicLlms, /## Product/);
  assert.match(publicLlms, /\[Home\]\(\/\): Public entry\./);
  assert.match(publicLlms, /\[Pricing\]\(\/pricing\)/);
  assert.match(publicLlms, /Open the tool and follow the steps\./);
  assert.match(publicLlms, /Verified object capability/);
  assert.doesNotMatch(publicLlms, /\/profile|\/invented|Unverified blog|planned capability|Allow:|Disallow:/);
}
console.log('Pricing template static contract checks passed.');
