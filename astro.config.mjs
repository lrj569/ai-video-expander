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

process.env.PUBLIC_CLERK_PUBLISHABLE_KEY ??=
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default defineConfig({
  site: siteUrl,
  output: 'server',
  build: { inlineStylesheets: 'auto' },
  server: { port: 3000 },
  adapter: vercel({ middlewareMode: 'server' }),
  integrations: [clerk(), react()],
  vite: {
    ssr: {
      noExternal: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
    },
  },
});
