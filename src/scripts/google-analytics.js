// Measurement owner: AI Video Expander. GA4 measures public page visits.
// The tag loads asynchronously on public page entry, outside page rendering.
const measurementId = 'G-QC436MCYB3';
const disableKey = `ga-disable-${measurementId}`;
const publicPaths = new Set(['/', '/guide', '/pricing']);

let initialized = false;
let pageReferrer = document.referrer ? new URL(document.referrer) : null;

function isPublicPage(url) {
  return url.origin === location.origin && publicPaths.has(url.pathname.replace(/\/$/, '') || '/');
}

function analyticsUrl(url) {
  return `${url.origin}${url.pathname}`;
}

function hasPrivateParameters(url) {
  return url?.origin === location.origin && [...url.searchParams.keys()].some(key =>
    /^(?:token|id_token|access_token|refresh_token|__clerk.*)$/i.test(key));
}

function applyAnalytics(url, title, referrer, initialize = true) {
  const active = isPublicPage(url) && !hasPrivateParameters(url) && !hasPrivateParameters(referrer);
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
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    ...page,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  const script = document.createElement('script');
  script.async = true;
  script.referrerPolicy = 'no-referrer';
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.append(script);
}

function syncPage() {
  applyAnalytics(new URL(location.href), document.title, pageReferrer);
}

document.addEventListener('astro:before-swap', ({ to, from, newDocument }) => {
  // Set the destination before Astro changes browser history. GA4 owns history pageviews.
  pageReferrer = from;
  applyAnalytics(to, newDocument.title, pageReferrer, false);
});
window.addEventListener('popstate', () => applyAnalytics(new URL(location.href), document.title, null, false), true);
document.addEventListener('astro:page-load', syncPage);
syncPage();
