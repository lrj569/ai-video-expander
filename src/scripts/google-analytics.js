// Measurement owner: AI Video Expander. GA4 measures public page visits.
// The tag loads asynchronously after analytics consent, outside page rendering.
const measurementId = 'G-QC436MCYB3';
const consentKey = 'ga4-analytics-consent';
const disableKey = `ga-disable-${measurementId}`;
const publicPaths = new Set(['/', '/guide', '/pricing']);
const denied = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
};

let consent = null;
let initialized = false;
let pageReferrer = document.referrer ? new URL(document.referrer) : null;
try { consent = localStorage.getItem(consentKey); } catch { /* Keep the choice in this tab. */ }

function isPublicPage(url) {
  return url.origin === location.origin && publicPaths.has(url.pathname.replace(/\/$/, '') || '/');
}

function analyticsUrl(url) {
  return `${url.origin}${url.pathname}`;
}

function applyAnalytics(url, title, referrer, initialize = true) {
  const active = consent === 'granted' && isPublicPage(url);
  window[disableKey] = !active;
  if (!active) return;

  const page = {
    page_location: analyticsUrl(url),
    page_title: title,
    page_referrer: referrer && (referrer.origin !== location.origin || isPublicPage(referrer)) ? analyticsUrl(referrer) : '',
  };
  if (initialized) {
    window.gtag('set', page);
    return;
  }
  if (!initialize) return;

  initialized = true;
  window.dataLayer ||= [];
  window.gtag ||= function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', denied);
  window.gtag('consent', 'update', { analytics_storage: 'granted' });
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { ...page, allow_google_signals: false, allow_ad_personalization_signals: false });

  const script = document.createElement('script');
  script.async = true;
  script.referrerPolicy = 'no-referrer';
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.append(script);
}

function setConsent(value) {
  consent = value;
  try { localStorage.setItem(consentKey, value); } catch { /* Keep the choice in this tab. */ }
  window[disableKey] = value !== 'granted' || !isPublicPage(new URL(location.href));
  if (initialized) window.gtag('consent', 'update', { analytics_storage: value });
  syncPage();
}

function consentButton(text, value) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  Object.assign(button.style, {
    minHeight: '44px', padding: '4px 10px', border: '1px solid var(--border)',
    borderRadius: '6px', cursor: 'pointer',
    background: value === 'granted' ? 'var(--primary)' : 'var(--background)',
    color: value === 'granted' ? 'var(--primary-foreground)' : 'var(--foreground)',
  });
  button.addEventListener('click', () => setConsent(value));
  return button;
}

function renderConsent(url) {
  document.getElementById('analytics-consent')?.remove();
  const privacyPage = url.pathname.replace(/\/$/, '') === '/privacy';
  if (!privacyPage && (consent || !isPublicPage(url))) return;

  const controls = document.createElement('aside');
  controls.id = 'analytics-consent';
  controls.setAttribute('aria-label', 'Analytics preferences');
  Object.assign(controls.style, {
    position: 'fixed', insetInlineStart: '12px', insetBlockEnd: '12px', zIndex: '40',
    width: 'min(380px, calc(100% - 24px))', padding: '12px', borderRadius: '10px',
    border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--foreground)',
    boxShadow: '0 6px 24px #0004', fontSize: '14px',
  });
  const description = document.createElement('p');
  description.textContent = privacyPage && consent
    ? `Analytics is ${consent === 'granted' ? 'enabled' : 'disabled'}.`
    : 'Allow analytics to help us understand how visitors use this site?';
  const actions = document.createElement('div');
  Object.assign(actions.style, { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' });
  if (consent !== 'granted') actions.append(consentButton('Allow analytics', 'granted'));
  if (consent !== 'denied') actions.append(consentButton(consent ? 'Disable analytics' : 'Decline', 'denied'));
  if (!privacyPage) {
    const link = document.createElement('a');
    link.href = '/privacy';
    link.textContent = 'Privacy';
    link.style.textDecoration = 'underline';
    actions.append(link);
  }
  controls.append(description, actions);
  document.body.append(controls);
}

function syncPage() {
  const url = new URL(location.href);
  applyAnalytics(url, document.title, pageReferrer);
  renderConsent(url);
}

document.addEventListener('astro:before-swap', ({ to, from, newDocument }) => {
  // Set the destination before Astro changes browser history. GA4 owns history pageviews.
  pageReferrer = from;
  applyAnalytics(to, newDocument.title, pageReferrer, false);
});
window.addEventListener('popstate', () => applyAnalytics(new URL(location.href), document.title, null, false), true);
document.addEventListener('astro:page-load', syncPage);
syncPage();
