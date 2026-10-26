import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import clerk from '@clerk/astro';
import { siteUrl } from './website-config.js';

try {
  process.loadEnvFile('.env');
} catch {
  // Deployment providers inject environment variables directly.
}

if (!process.env.PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
  process.env.PUBLIC_CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
}

// Keep Clerk's virtual modules and deployment integration, while public-page
// hydration remains available when authentication has not been configured.
const authIntegration = clerk();
const authSetup = authIntegration.hooks['astro:config:setup'];
authIntegration.hooks['astro:config:setup'] = options => authSetup({
  ...options,
  injectScript: (...args) => {
    if (/^pk_(test|live)_/.test(process.env.PUBLIC_CLERK_PUBLISHABLE_KEY || '')) options.injectScript(...args);
  },
});

export default defineConfig({
  site: siteUrl || undefined,
  output: 'server',
  build: { inlineStylesheets: 'auto' },
  server: { port: 3000 },
  devToolbar: { enabled: false },
  adapter: vercel({ middlewareMode: 'server' }),
  integrations: [authIntegration, react()],
  vite: {
    ssr: {
      noExternal: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
    },
  },
});
