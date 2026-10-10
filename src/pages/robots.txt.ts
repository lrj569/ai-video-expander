import type { APIRoute } from 'astro';
import { siteUrl } from '@/website-config';

const AI_BOTS = ['GPTBot', 'ChatGPT-User', 'OAI-SearchBot', 'anthropic-ai', 'ClaudeBot', 'Claude-Web', 'Google-Extended', 'PerplexityBot', 'CCBot', 'Bytespider', 'Applebot-Extended'];

export const GET: APIRoute = () => {
  const groups = [
    { agents: ['*'], allow: ['/', '/llms.txt'], disallow: ['/api/', '/admin/'] },
    { agents: AI_BOTS, allow: ['/', '/llms.txt'], disallow: ['/api/', '/admin/'] },
  ];
  const lines = groups.flatMap(group => [
    ...group.agents.map(agent => `User-agent: ${agent}`),
    ...group.allow.map(path => `Allow: ${path}`),
    ...group.disallow.map(path => `Disallow: ${path}`),
    '',
  ]);
  lines.push(`Sitemap: ${siteUrl}/sitemap.xml`, `Host: ${siteUrl}`);
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
