# Project Instructions

## Astro Engineering Standard

- Before adding or changing any route, metadata, Island, crawler rule, sitemap behavior, or performance behavior, read `docs/astro-project-development-standard.md`.
- Before changing SSR data loading, client hydration, caching, media loading, third-party scripts, or above-the-fold behavior, read `docs/astro-ssr-performance-standard.md`.
- Before adding or changing a React island or shared account state, read `docs/astro-islands-architecture.md`.
- Default to server-rendered HTML plus the smallest possible React islands. Decide and document what loads on the server and what loads in the browser before implementation.
- Public SEO content must not depend on client-side fetching. Do not fetch the same route data separately for metadata, HTML, and hydration.
- The standard defines technical boundaries only. Never invent, summarize, reorganize, or rewrite page copy; page-specific content must follow the SEO development document supplied for that page.
- Register every real route in `src/config/page-policies.json`. Do not create speculative Guide, How-to, What-is, Review, Compare, or other SEO routes.
- Changes limited to the generator/production module must not update the homepage sitemap timestamp.

## Design System

- Before making any UI, page, layout, component, navigation, footer, pricing, card, form, modal, or visual style change, read `desgin.md` first.
- Treat `desgin.md` as the source of truth for visual direction.
- Follow its Framer-inspired dark marketing style: near-black canvas, oversized white display type, tight negative tracking, white/charcoal pill CTAs, charcoal cards, scarce blue signal accents, and gradient spotlight cards only as individual cards.
- Do not introduce unrelated visual themes such as orange Retool controls, editorial cream layouts, small-radius dashboard surfaces, full-page gradients, or blue CTA fills unless explicitly requested.
- For new reusable UI, prefer updating shared components and design tokens so pages inherit the template style consistently.

## Frontend Development

Skill stack when building or editing pages / layouts / sections / UI (load before writing code):

| Layer | Skill / file | When |
|-------|----------------|------|
| Brand tokens | `desgin.md` | Always for visual work |
| Frontend engineering & taste | `.codex/skills/design-taste-frontend-v1/SKILL.md` | Always for visible frontend markup or styles |
| Page style / layout craft | `.codex/skills/gpt-taste/SKILL.md` | **Must** for page-level style development (hero, sections, spacing, grids, AIDA structure) |

- Do not skip `design-taste-frontend-v1` or `gpt-taste` for “small” UI/page style changes if markup or styles are touched.
- `desgin.md` wins on brand direction (colors, CTAs, Framer dark marketing look). `design-taste-frontend-v1` and `gpt-taste` constrain engineering and page craft; when they conflict with `desgin.md`, follow `desgin.md`.

## Verification

- For small copy, image, or navigation configuration changes, only run static checks or state that no build was run.
- For type, interface, route, or core component logic changes, run the lightest useful check first, or ask whether a full build is needed.
- For route, policy, metadata, or core logic changes, run `npm run check` and the relevant targeted verifier.
- Run `npm run build` when implementation acceptance requires build and route evidence; never treat it as production verification.
- For above-the-fold or hydration changes, compare production-build client resources against the previous baseline and investigate regressions above 10%; this is a regression gate, not proof of production CWV.
