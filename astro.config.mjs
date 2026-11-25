import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import clerk from '@clerk/astro';
import { apiConfig, siteUrl } from './website-config.js';
import { publicStructuredDataOrigin } from './src/lib/site-structured-data.mjs';

try {
  process.loadEnvFile('.env');
} catch {
  // Deployment providers inject environment variables directly.
}

if (!process.env.PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
  process.env.PUBLIC_CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
}

if (process.env.VERCEL_ENV === 'production' && !publicStructuredDataOrigin(siteUrl)) {
  throw new Error('Set the official HTTPS canonicalUrl before a production build.');
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

const googleAnalytics = {
  name: 'google-analytics',
  hooks: {
    'astro:config:setup': ({ injectScript }) => {
      injectScript('page', "import '/src/scripts/google-analytics.js';");
    },
  },
};

export default defineConfig({
  site: siteUrl || undefined,
  output: 'server',
  build: { inlineStylesheets: 'auto' },
  server: { port: 3000 },
  devToolbar: { enabled: false },
  adapter: vercel({ middlewareMode: 'server' }),
  integrations: [authIntegration, react(), googleAnalytics],
  vite: {
    server: {
      proxy: {
        '^/api/': {
          target: apiConfig.baseUrl,
          changeOrigin: true,
          configure(proxy) {
            // Match the credentials behavior of the production cross-origin fetch.
            proxy.on('proxyReq', (request) => request.removeHeader('cookie'));
            proxy.on('proxyRes', (response) => { delete response.headers['set-cookie']; });
          },
        },
      },
    },
    ssr: {
      noExternal: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
    },
  },
});
