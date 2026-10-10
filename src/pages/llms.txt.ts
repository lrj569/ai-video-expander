import type { APIRoute } from 'astro';
import { buildLlmsTxt } from '@/src/lib/llms';

export const GET: APIRoute = () => new Response(buildLlmsTxt(), {
  headers: {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=3600',
  },
});
