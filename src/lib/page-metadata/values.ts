export function pageCanonical(origin: string, path: string, explicit?: string | URL | null): string {
  const value = explicit == null ? '' : String(explicit).trim();
  if (value) return value;
  const base = origin.trim().replace(/\/+$/, '');
  return base ? `${base}${path === '/' ? '' : path}` : path;
}

type SocialImage = string | URL | {
  url?: string | URL;
  width?: number | string;
  height?: number | string;
  type?: string;
  alt?: string;
};

function dimension(value?: number | string): string | undefined {
  if (value === undefined || (typeof value === 'string' && !value.trim())) return undefined;
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? String(number) : undefined;
}

/** HTML meta content is textual even when upstream image dimensions are numeric. */
export function socialImageValues(image: SocialImage | undefined, fallback: string) {
  const details = image && typeof image === 'object' && !(image instanceof URL) ? image : undefined;
  const url = details?.url ?? (typeof image === 'string' || image instanceof URL ? image : fallback);
  return {
    url: String(url || fallback),
    width: dimension(details?.width),
    height: dimension(details?.height),
    type: details?.type,
    alt: details?.alt,
  };
}
