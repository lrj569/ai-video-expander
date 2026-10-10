export function isCheckoutConfigured(
  site: { implementationStatus: string },
  api: { baseUrl: string; appId: string },
): boolean {
  if (!['target-state-development', 'verified-public'].includes(site.implementationStatus)
    || !api.appId || api.appId === 'template-app') return false;
  try {
    const url = new URL(api.baseUrl);
    return ['https:', 'http:'].includes(url.protocol)
      && !/(^|\.)example\.(com|net|org)$|\.invalid$/i.test(url.hostname);
  } catch {
    return false;
  }
}
