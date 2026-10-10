import type { APIRoute } from 'astro';
import sitemap from '@/lib/sitemap';

const xml = (value: unknown) => String(value ?? '').replace(/[<>&"']/g, char => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char]!);

export const GET: APIRoute = async () => {
  const entries = await sitemap();
  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.map(entry =>
    `<url><loc>${xml(entry.url)}</loc>${entry.lastModified ? `<lastmod>${xml(entry.lastModified instanceof Date ? entry.lastModified.toISOString() : entry.lastModified)}</lastmod>` : ''}</url>`
  ).join('')}</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=3600' } });
};
