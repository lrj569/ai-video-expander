# Astro migration record

## Scope

Source project: `D:\项目\池源\模板\nest-template`

Astro copy: `D:\项目\池源\模板\nest-template-astro`

The source project was copied without `.git`, `.next`, `.next-dev`, `node_modules`, or `tsconfig.tsbuildinfo`. All migration changes were made only in the Astro copy.

## Baseline

- Source Git worktree was clean.
- Source route-like files: 23 Next page/layout/SEO files.
- Files importing `next/*` or `@clerk/nextjs`: 29.
- Source `npx tsc --noEmit` was already failing because `components/profile/PayLogDialog.tsx` was a zero-byte non-module.
- No pre-migration `next build` was run because project instructions require explicit authorization for that command.
- No pre-migration production screenshots, authenticated session, payment, or performance A/B baseline was available.

## Implemented migration

- Replaced Next scripts and dependencies with Astro 7, React integration, Clerk Astro, and the Vercel adapter.
- Added Astro file routes under `src/pages/`.
- Added `output: 'server'`, Vercel server middleware mode, Clerk middleware, and a temporary `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` compatibility mapping.
- Preserved reusable React components and moved former page views to `src/components/page-views/`.
- Added compatibility modules for former Next Link, Image, Navigation, Dynamic, Script, and Metadata imports.
- Added a persistent navigation island using Astro client routing; interactive page bodies hydrate only where required.
- Moved global CSS to `src/styles/globals.css` and retained the existing dark design tokens and visible component markup.
- Recreated robots and sitemap as Astro endpoints.
- Removed Next App Router source files, Next configuration, Next environment declarations, Next dependencies, and the stale Yarn lock.
- Restored the previously empty `PayLogDialog.tsx` from the corresponding implemented template component so the preserved profile payment-history entry remains functional at source level.

## Route model

| Route | Rendering | Interaction |
| --- | --- | --- |
| `/` | prerendered | React island |
| `/pricing` | prerendered | React island |
| `/terms`, `/privacy`, `/refund` | prerendered | static React render |
| `/payment-success`, `/payment-failed` | SSR | private payment status |
| `/404` | prerendered | static React render |
| `/profile` | SSR | React island |
| `/sso-callback` | SSR | React island |
| Blog route sources | Dormant | retained under `src/dormant/blog-routes`; no public route or CMS request by default |
| `/share/[id]` | SSR | server HTML |
| `/robots.txt`, `/sitemap.xml`, `/llms.txt` | SSR endpoint | none |

## Local evidence

- `npm install`: completed.
- `npm run check`: passed with 0 errors. Astro reported 53 non-blocking hints inherited mainly from deprecated React/Radix types and unused variables.
- `npm run build`: passed. Nine routes were prerendered and the Vercel server function was bundled.
- The former 532.2 KiB `html2pdf.js` compatibility chunk was removed. Invoice export now loads `html2canvas` and `jsPDF` directly only when requested; the largest client chunk is 388.3 KiB and the build no longer reports a 500 kB warning.
- `npm run verify:routes`: checks route sources, removal of Next dependencies/source files, title/canonical output in representative prerendered HTML, and the 500 KiB client JavaScript chunk budget.
- Local HTTP smoke test: `/`, `/pricing`, `/terms`, `/privacy`, `/refund`, `/payment-success?session_id=test`, `/payment-failed`, `/profile`, `/sso-callback`, `/robots.txt`, and `/sitemap.xml` returned 200; an unknown route returned 404.
- Local browser check: homepage and pricing rendered with the existing dark layout, navigation, pricing cards, FAQ, footer, and anonymous Login state. Initial hydration errors found during this check were fixed by stabilizing client-only dynamic rendering and moving JSON-LD out of hydrated React trees. After reload, no new hydration errors were emitted; the remaining warning only states that Clerk is using development keys.

## Not verified

- Vercel preview or production deployment.
- Real Clerk sign-in, SSO callback, navigation-state persistence, avatar, or credit refresh.
- Authenticated profile API behavior.
- Real generation requests or media processing.
- Payment creation, success/failure/cancel callbacks, invoices, duplicate callbacks, or webhook handling.
- Live CMS blog/share records and CMS failure behavior.
- Production indexing, rich results, Search Console, or sitemap submission.
- Same-environment performance A/B measurements.

These items require deployment URLs, valid test credentials, live API/CMS availability, or authorized payment/generation tests. A successful local build does not establish them.
