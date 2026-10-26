import { clerkMiddleware } from '@clerk/astro/server';
import { defineMiddleware } from 'astro:middleware';

const authenticate = clerkMiddleware();
const publicIndexes = new Set(['/llms.txt', '/robots.txt', '/sitemap.xml']);

export const onRequest = defineMiddleware((context, next) => {
  // Public discovery endpoints must work without provisioning authentication.
  if (publicIndexes.has(context.url.pathname)) return next();
  return authenticate(context, next);
});
