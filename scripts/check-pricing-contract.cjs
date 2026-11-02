/* Canonical source: builder scripts/check-pricing-contract.cjs; publish an identical copy in the template.
 * Local source and mocked contracts only; no network, login, checkout or production proof.
 * Usage: node scripts/check-pricing-contract.cjs [target-directory]
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const ts = require(require.resolve('typescript', { paths: [root] }));
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

function parsed(source) {
  const file = ts.createSourceFile('PricingContract.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  assert.equal(file.parseDiagnostics.length, 0, 'contract source must parse');
  return file;
}

function nodes(node, predicate) {
  const matches = [];
  function visit(current) {
    if (predicate(current)) matches.push(current);
    ts.forEachChild(current, visit);
  }
  visit(node);
  return matches;
}

function unwrapped(node) {
  while (node && ts.isParenthesizedExpression(node)) node = node.expression;
  return node;
}

function identifier(node, name) {
  node = unwrapped(node);
  return !!node && ts.isIdentifier(node) && node.text === name;
}

function property(node, owner, name) {
  node = unwrapped(node);
  return !!node && ts.isPropertyAccessExpression(node) && identifier(node.expression, owner) && node.name.text === name;
}

function negated(node, check) {
  node = unwrapped(node);
  return !!node && ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.ExclamationToken && check(node.operand);
}

function attribute(node, name) {
  return node.attributes.properties.find(item => ts.isJsxAttribute(item) && item.name.getText() === name);
}

function assertNamedImport(source, moduleName, importedName) {
  const file = parsed(source);
  const imports = nodes(file, ts.isImportDeclaration).filter(node => node.moduleSpecifier.text === moduleName);
  const specifiers = imports.flatMap(node => {
    const bindings = node.importClause?.namedBindings;
    return bindings && ts.isNamedImports(bindings) ? [...bindings.elements] : [];
  });
  assert.ok(specifiers.some(item => item.name.text === importedName &&
    (!item.propertyName || item.propertyName.text === importedName)),
  `${importedName} must remain a named import from ${moduleName}`);
}

function assertVisibleElement(opening) {
  for (const attr of opening.attributes.properties) {
    if (!ts.isJsxAttribute(attr)) continue;
    const name = attr.name.getText();
    assert.notEqual(name, 'hidden', 'checkout feedback cannot have a hidden attribute');
    if (name === 'aria-hidden') {
      assert.equal(attr.initializer?.getText(), '{false}', 'checkout feedback cannot be aria-hidden');
    }
    if (name === 'className') {
      assert.ok(attr.initializer && ts.isStringLiteral(attr.initializer), 'feedback visibility classes must be inspectable literals');
      assert.doesNotMatch(attr.initializer.text, /(?:^|\s|:)(?:hidden|invisible|sr-only|opacity-0)(?:\s|$)/,
        'checkout feedback cannot be visually hidden');
    }
    if (name === 'style') {
      assert.doesNotMatch(attr.initializer?.getText() || '', /(?:display\s*:\s*['"]none|visibility\s*:\s*['"]hidden|opacity\s*:\s*0\b)/,
        'checkout feedback cannot be hidden by inline styles');
    }
  }
}

function inspectCheckoutContract(source) {
  const file = parsed(source);
  const callbacks = nodes(file, node => ts.isVariableDeclaration(node) && identifier(node.name, 'handleUpgradeClick'));
  assert.equal(callbacks.length, 1, 'inspect exactly the real handleUpgradeClick callback');
  const callback = callbacks[0].initializer;
  assert.ok(callback && ts.isArrowFunction(callback) && ts.isBlock(callback.body), 'checkout callback must have an inspectable body');
  const guard = callback.body.statements[0];
  assert.ok(guard && ts.isIfStatement(guard), 'readiness guard must be the first callback statement');
  assert.ok(negated(guard.expression, node => identifier(node, 'checkoutConfigured')), 'first branch must guard !checkoutConfigured');
  assert.ok(ts.isBlock(guard.thenStatement) && !guard.elseStatement, 'readiness branch must be an explicit early-return block');
  const statements = [...guard.thenStatement.statements];
  assert.equal(statements.length, 2, 'unconfigured branch must show feedback and immediately return');
  const message = statements[0];
  assert.ok(ts.isExpressionStatement(message) && ts.isCallExpression(message.expression) &&
    identifier(message.expression.expression, 'setCheckoutMessage'), 'first guard action must set the feedback state');
  const messageCall = message.expression;
  assert.equal(messageCall.arguments.length, 1);
  assert.ok(ts.isStringLiteral(messageCall.arguments[0]) && messageCall.arguments[0].text.trim(), 'unconfigured feedback must be a nonempty message');
  assert.ok(ts.isReturnStatement(statements[1]) && !statements[1].expression, 'unconfigured branch must return before any request');

  const buttons = nodes(file, node => ts.isJsxOpeningElement(node) && identifier(node.tagName, 'Button') && attribute(node, 'onClick'));
  assert.equal(buttons.length, 1, 'inspect the actual purchase button');
  const button = buttons[0];
  const click = attribute(button, 'onClick').initializer?.expression;
  assert.ok(click && ts.isArrowFunction(click), 'purchase button must use the real callback');
  const calls = nodes(click.body, node => ts.isCallExpression(node) && identifier(node.expression, 'handleUpgradeClick'));
  assert.equal(calls.length, 1);
  assert.ok(property(calls[0].arguments[0], 'plan', 'priceId') && property(calls[0].arguments[1], 'plan', 'key'),
    'purchase action must preserve plan priceId/key mapping');
  const disabled = attribute(button, 'disabled')?.initializer?.expression;
  assert.ok(disabled && ts.isBinaryExpression(unwrapped(disabled)) &&
    unwrapped(disabled).operatorToken.kind === ts.SyntaxKind.BarBarToken,
  'purchase button must retain loading and missing-price guards');
  const terms = [unwrapped(disabled).left, unwrapped(disabled).right].map(unwrapped);
  assert.equal(terms.length, 2);
  assert.ok(terms.some(node => ts.isBinaryExpression(node) &&
    node.operatorToken.kind === ts.SyntaxKind.EqualsEqualsEqualsToken && identifier(node.left, 'loadingPlan') && property(node.right, 'plan', 'key')),
  'button must disable the in-flight plan');
  assert.ok(terms.some(node => negated(node, operand => property(operand, 'plan', 'priceId'))),
    'button must disable missing priceId');

  const feedback = nodes(file, node => ts.isJsxElement(node) &&
    node.openingElement.tagName.getText() === 'p' && attribute(node.openingElement, 'role')?.initializer?.text === 'alert');
  assert.equal(feedback.length, 2, 'both regular and hideSection renders must expose feedback');
  for (const element of feedback) {
    assert.ok(element.children.some(child => ts.isJsxExpression(child) && identifier(child.expression, 'checkoutMessage')),
      'visible feedback must render the actual message state');
    const condition = element.parent;
    assert.ok(ts.isBinaryExpression(condition) && condition.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken &&
      identifier(condition.left, 'checkoutMessage') && condition.right === element,
    'feedback must be controlled by its own nonempty message state');
    for (let ancestor = element; ancestor; ancestor = ancestor.parent) {
      if (ts.isJsxElement(ancestor)) assertVisibleElement(ancestor.openingElement);
      if (ts.isBinaryExpression(ancestor)) {
        assert.ok(ancestor === condition, 'feedback cannot be hidden by an additional conditional expression');
      }
      if (ts.isReturnStatement(ancestor)) break;
    }
  }
  return { file, callback, guard, messageCall, disabled };
}

async function exerciseCheckoutCallback(source, plans) {
  const contract = inspectCheckoutContract(source);
  const chosen = plans[1] || plans[0];
  assert.ok(chosen, 'checkout fixtures require an existing configured pack');
  for (const scenario of [
    { name: 'unconfigured', configured: false, signedIn: true },
    { name: 'signed-out', configured: true, signedIn: false },
    { name: 'configured-signed-in', configured: true, signedIn: true },
  ]) {
    const messages = [], loading = [], calls = [], writes = [], auth = [], alerts = [];
    const sandbox = {
      checkoutConfigured: scenario.configured, isSignedIn: scenario.signedIn,
      user: scenario.signedIn ? { id: 'local-contract-user' } : null,
      pricingPlans: plans,
      setCheckoutMessage: message => messages.push(message),
      setLoadingPlan: key => loading.push(key),
      openSignIn: () => auth.push('sign-in'),
      alert: message => alerts.push(message), console: { error: () => {} },
      localStorage: { setItem: (key, value) => writes.push({ key, value: JSON.parse(value) }) },
      window: { location: { href: '' } },
      api: { payment: { createPaypalSession: async priceId => {
        calls.push(priceId);
        return { data: { url: 'https://checkout.local.test/mock-session' } };
      } } },
    };
    const code = ts.transpileModule(`globalThis.contractCallback = ${contract.callback.getText(contract.file)};`, {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
    }).outputText;
    vm.runInNewContext(code, sandbox);
    await sandbox.contractCallback(chosen.priceId, chosen.key);
    assert.equal(alerts.length, 0, `${scenario.name}: no unexpected alert`);
    if (!scenario.configured) {
      assert.equal(messages.length, 1);
      assert.ok(typeof messages[0] === 'string' && messages[0].trim(), 'unconfigured click must show nonempty feedback');
      assert.equal(calls.length, 0); assert.equal(auth.length, 0);
      assert.equal(writes.length, 0); assert.equal(loading.length, 0);
      assert.equal(sandbox.window.location.href, '');
    } else if (!scenario.signedIn) {
      assert.equal(auth.length, 1); assert.equal(calls.length, 0);
      assert.equal(writes.length, 0); assert.equal(loading.length, 0);
      assert.equal(sandbox.window.location.href, '');
    } else {
      assert.deepEqual(calls, [chosen.priceId], 'configured click must call the mock payment boundary exactly once with priceId');
      assert.deepEqual(loading, [chosen.key]); assert.equal(auth.length, 0);
      assert.equal(writes.length, 1); assert.equal(writes[0].key, 'paymentInfo');
      assert.equal(writes[0].value.planKey, chosen.key);
      assert.equal(writes[0].value.price, chosen.price);
      assert.equal(writes[0].value.credits, chosen.credits);
      assert.equal(typeof writes[0].value.credits, 'number');
      assert.equal(writes[0].value.planTitle, chosen.title);
      assert.equal(sandbox.window.location.href, 'https://checkout.local.test/mock-session');
    }
  }
  // Exercise the real disabled expression without React or network.
  for (const configured of [false, true]) {
    for (const fixture of [
      { loadingPlan: null, plan: chosen, expected: false },
      { loadingPlan: chosen.key, plan: chosen, expected: true },
      { loadingPlan: null, plan: { ...chosen, priceId: '' }, expected: true },
    ]) {
      const result = vm.runInNewContext(contract.disabled.getText(contract.file), {
        checkoutConfigured: configured, loadingPlan: fixture.loadingPlan, plan: fixture.plan,
      });
      assert.equal(result, fixture.expected, 'only in-flight or missing-price conditions disable purchasing');
    }
  }
  return { callbackScenarios: 3, buttonTruthTableCases: 6 };
}

function replacedNode(source, node, replacement) {
  return source.slice(0, node.getStart()) + replacement + source.slice(node.end);
}

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
const checkoutContract = inspectCheckoutContract(section);
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
assertNamedImport(faq, '@/lib/pricing-faq', 'pricingFaqItems');
assertNamedImport(page, '@/lib/pricing-faq', 'pricingFaqSchema');
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
  currentProfile = { ...profile, implementationStatus, pages: [], capabilities: [] };
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

async function checkCheckoutBehaviorAndMutations() {
  const mocks = await exerciseCheckoutCallback(section, pricing.oneTimePlans);
  const edit = (node, replacement) => replacedNode(section, node, replacement);
  const mutations = [
    ['removed readiness guard', edit(checkoutContract.guard, '')],
    ['inverted readiness guard', edit(checkoutContract.guard.expression, 'checkoutConfigured')],
    ['hidden feedback', section.replaceAll('role="alert"', 'role="alert" hidden')],
    ['empty feedback message', edit(checkoutContract.messageCall.arguments[0], "''")],
    ['request before readiness guard', section.slice(0, checkoutContract.guard.getStart()) +
      'await api.payment.createPaypalSession(priceId);\n' + section.slice(checkoutContract.guard.getStart())],
    ['missing early return', edit(checkoutContract.guard.thenStatement.statements[1], '')],
    ['missing in-flight disable', edit(checkoutContract.disabled, '!plan.priceId')],
    ['missing priceId disable', edit(checkoutContract.disabled, 'loadingPlan === plan.key')],
    ['feedback state omitted from markup', section.replaceAll('{checkoutMessage}', "{''}")],
    ['configuration disables purchase button', edit(checkoutContract.disabled, '!checkoutConfigured || loadingPlan === plan.key || !plan.priceId')],
  ];
  for (const [name, mutated] of mutations) {
    assert.notEqual(mutated, section, `${name}: mutation must change actual component source`);
    parsed(mutated); // Rejection must enforce the contract, not merely reject invalid syntax.
    await assert.rejects(() => exerciseCheckoutCallback(mutated, pricing.oneTimePlans), undefined,
      `${name}: contract checker must reject the unsafe mutation`);
  }
  console.log(JSON.stringify({
    status: 'PASS', scope: 'local source and mock contracts; no real authentication, checkout, payment, credits or production proof',
    ...mocks, unsafeMutationsRejected: mutations.length,
    publicRoutesCovered: policies.filter(policy => policy.category === 'public' && policy.robots.index).map(policy => policy.path),
    readinessCases: 9, identityOnlyFixtures: 3, verifiedContentFixtures: 2,
    privateAndPlannedFilteringFixtures: 2,
  }, null, 2));
}
checkCheckoutBehaviorAndMutations().catch(error => { console.error(error); process.exitCode = 1; });
