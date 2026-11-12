const context = 'https://schema.org';
const breadcrumbs = new Map([['/guide', 'Guide'], ['/pricing', 'Pricing']]);
const reservedHost = /(^|\.)(example\.(com|net|org)|localhost|local|test|example|invalid|vercel\.app)$/i;

/**
 * Only an explicitly configured public HTTPS origin can become a canonical schema URL.
 * @param {string} value
 */
export function publicStructuredDataOrigin(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    return '';
  }
  if (
    url.protocol !== 'https:' || url.pathname !== '/' ||
    url.search || url.hash || url.username || url.password || url.port ||
    !url.hostname.includes('.') || url.hostname.endsWith('.') ||
    /^\d+(?:\.\d+){3}$/.test(url.hostname) || reservedHost.test(url.hostname)
  ) return '';
  return url.origin;
}

/**
 * Assemble shared nodes. Tests can supply a fixture origin directly.
 * @param {string} origin
 * @param {string} path
 * @param {string} name
 */
export function siteStructuredData(origin, path, name) {
  if (!origin) return [];
  if (path === '/') {
    return [{ '@context': context, '@type': 'WebSite', name, url: origin }];
  }
  const label = breadcrumbs.get(path);
  if (!label) return [];
  return [{
    '@context': context,
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: origin },
      { '@type': 'ListItem', position: 2, name: label, item: `${origin}${path}` },
    ],
  }];
}

/** @param {Record<string, unknown>} data */
export function serializeStructuredData(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
