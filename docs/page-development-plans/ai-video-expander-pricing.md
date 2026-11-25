---
title: "AI Video Expander Pricing Copy Replacement Document"
keyword: "AI Video Expander Pricing"
site_slug: "ai-video-expander"
pricing_slug: "ai-video-expander-pricing"
page: "pricing"
route: "/pricing"
backend_pricing_handoff: "pending"
serp_report: "serp-report/ai-video-expander-pricing-serp-report.md"
serp_report_sha256: "88c96549eb33772a91696568ffd2383f3add073e5f4daa8fde761cf60eb75b29"
website_plan: "docs/website-specs/ai-video-expander.md"
website_plan_sha256: "66aa81e6a8dcfdc53eac31006e0a38a1d18d12cdebae3b10818f9eb8be92e2b1"
homepage_doc: "docs/page-development-plans/ai-video-expander-home.md"
homepage_doc_sha256: "028bff9edb9911b64f7c87fc14fb5253e4376d28cff74549e0a572b7c71628ec"
template_snapshot: "audits/nest-template-pricing-structure-snapshot.json"
template_snapshot_sha256: "644d5634e242ecd5491d028926a51ef533334cbd171cabe6e6ff00c5b04580c3"
pricing_config: "config/pricing.json"
pricing_config_sha256: "65c2aa8bdceec9bec602044d1a35b79de5e613f915a4ea073469b78e86f73bd1"
document_version: "1.0.0"
word_count_contract: "1.0.0"
last_updated: "2026-11-24"
---

# AI Video Expander Pricing Copy Replacement Document

<!-- content-word-count:start -->
## Content word count

**Customer-visible English words:** 186
<!-- content-word-count:end -->

<!-- tdk:start -->
## SEO Metadata (TDK)

**Title:** AI Video Expander Pricing | One-Time Credit Packs

**Description:** Compare AI Video Expander pricing for three one-time credit packs. See how many credits each pack includes, what it costs, and how long credits last.

**Keywords:** AI Video Expander Pricing, video expansion credit packs, one-time AI video credits

**Open Graph Title:** AI Video Expander Pricing | One-Time Credit Packs

**Open Graph Description:** Compare AI Video Expander pricing for three one-time credit packs. See how many credits each pack includes, what it costs, and how long credits last.

**Twitter Title:** AI Video Expander Pricing | One-Time Credit Packs

**Twitter Description:** Compare AI Video Expander pricing for three one-time credit packs. See how many credits each pack includes, what it costs, and how long credits last.
<!-- tdk:end -->

## Implementation contract

Replace the route metadata, add one H1 and subtitle above the existing card grid, and populate the seven existing FAQ text slots and five FAQ items. Preserve the current grid, purchase and account handling, the support-link destination contract, and the shared footer. Keep the visible questions and answers and FAQPage mainEntity in sync. Continue to source Home and Pricing card data from the same frozen configuration. Backend pricing verification remains pending.

<!-- relevance-brief
The exact purchase query and commercial questions in the Pricing SERP support a distinct price page. The page gives shoppers the pack prices, quantities, one-time terms and credit expiry in one place. Title and H1 identify AI Video Expander and the purchase task. FAQ headings use specific English billing questions. The selected US market matches the USD cards. Home owns the product workflow and Guide owns the tutorial. Description, visible copy and structured data use the same offer scope. Support is the existing destination, and no price per expansion or backend status appears in visible copy.
-->

<!-- customer-copy:start -->
## Visible Pricing Header Replacement

# AI Video Expander Pricing

**Subtitle:** Compare pack prices, included credits, and purchase terms.

## Copy Replacement Map

| Target component | Existing slot | Replacement English copy |
|---|---|---|
| `PricingSection.tsx` | New H1 above existing grid | Use the exact visible H1 above |
| `PricingSection.tsx` | New subtitle above existing grid | Use the exact visible subtitle above |
| `PricingFAQ.tsx` | Eyebrow | `Credits and billing` |
| `PricingFAQ.tsx` | H2 | `Pricing Questions` |
| `PricingFAQ.tsx` | Intro | `Find out how to choose a pack, what you pay for, and when you can use your credits.` |
| `PricingFAQ.tsx` | Desktop support prompt | `Still have a billing question?` |
| `PricingFAQ.tsx` | Support card title | `Billing Support` |
| `PricingFAQ.tsx` | Support card body | `Ask us about a credit pack or a purchase.` |
| `PricingFAQ.tsx` | Contact link label | `Contact support` |

## Visible FAQ Replacement

### Q1: Is a credit pack a one-time purchase?
Each pack is a one-time purchase. You choose a pack and pay the price shown on its card.

### Q2: How many credits come with each pack?
The packs include 280, 1,000, or 2,000 credits. The price on each card covers the full pack.

### Q3: Do purchased credits expire?
Purchased credits never expire. You can save unused credits for a future project.

### Q4: Which credit pack should I choose?
The 280-credit pack has the lowest upfront price. To buy more credits at once, compare the 1,000- and 2,000-credit packs by total price and credits included.

### Q5: Who can I contact about a credit purchase?
Use Contact support below. Include the pack you selected and the date of purchase so we can look into it.
<!-- customer-copy:end -->

<!-- json-ld:start -->
## JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": [
    "WebPage",
    "FAQPage"
  ],
  "name": "AI Video Expander Pricing | One-Time Credit Packs",
  "description": "Compare AI Video Expander pricing for three one-time credit packs. See how many credits each pack includes, what it costs, and how long credits last.",
  "inLanguage": "en-US",
  "keywords": [
    "AI Video Expander Pricing",
    "video expansion credit packs",
    "one-time AI video credits"
  ],
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is a credit pack a one-time purchase?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Each pack is a one-time purchase. You choose a pack and pay the price shown on its card."
      }
    },
    {
      "@type": "Question",
      "name": "How many credits come with each pack?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The packs include 280, 1,000, or 2,000 credits. The price on each card covers the full pack."
      }
    },
    {
      "@type": "Question",
      "name": "Do purchased credits expire?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Purchased credits never expire. You can save unused credits for a future project."
      }
    },
    {
      "@type": "Question",
      "name": "Which credit pack should I choose?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The 280-credit pack has the lowest upfront price. To buy more credits at once, compare the 1,000- and 2,000-credit packs by total price and credits included."
      }
    },
    {
      "@type": "Question",
      "name": "Who can I contact about a credit purchase?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use Contact support below. Include the pack you selected and the date of purchase so we can look into it."
      }
    }
  ]
}
```
<!-- json-ld:end -->

## Locked template surfaces

- Preserve `pricingConfig.oneTimePlans` and all fields including `priceId`, as well as card count, order, names, amounts, credits, feature lists and action labels.
- Keep the existing card grid, two-column/sticky FAQ layout, accordion behavior, support card, Footer and existing `className` values. The only structural addition is the H1/subtitle container before the card grid.
- Keep checkout, account, loading and local-storage behavior as supplied by the Astro template. The checkout binding is `/api/pay/anyway` with `price_id` from the configured package code.

## Backend pricing handoff

**Status:** pending

Generation credit costs are 4 credits per second at 480p, 6 at 768p, and 12 at 1080p. Free access, refunds, taxes, payment methods and commercial rights still require confirmation. Disable stale Product or Offer schema in the implementation. Once price and checkout are verified, produce any Product or Offer representation from a single runtime source. Confirm backend code mapping, displayed currency and amount, and credit delivery before releasing.

## Validation handoff for the original pricing snapshot

- Deterministic validation: PASS, 186 document-supplied customer words
- Template lock validation: PASS, all ten template snapshot files
- Copy audit: PASS, independently reviewed by Codex GPT-6 (seo-content), /root/home_review, task 01a20b8b-bb18-7880-a261-ad0d1ff779bc.
  - “Is a credit pack a one-time purchase?” now asks about the confirmed purchase cadence and matches its FAQPage entry.
  - “The 200-credit pack has the lowest upfront price. To buy more credits at once, compare the 650- and 1,200-credit packs by total price and credits included.” matches the frozen pack amounts without estimating usage and matches its FAQPage entry.
- Backend pricing verification: pending
