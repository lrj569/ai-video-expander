---
title: "AI Video Expander Home Page Development Document"
keyword: "AI Video Expander"
slug: "ai-video-expander"
page: "home"
route: "/"
serp_report: "serp-report/ai-video-expander-serp-report.md"
serp_report_sha256: "9dd873159c001d68496b6ecbe625b6f8e21f2ff8528508751e1ef6ccf8ba9cfd"
website_plan: "docs/website-specs/ai-video-expander.md"
website_plan_sha256: "66aa81e6a8dcfdc53eac31006e0a38a1d18d12cdebae3b10818f9eb8be92e2b1"
authoring_mode: "target-state-development"
product_facts: "none"
product_facts_sha256: "none"
authoring_task_id: "01a20b87-0e27-7822-8155-6fbf90f500e8"
authoring_manifest: "audits/codex-seo-authoring-manifest.json"
document_version: "1.18.0"
authoring_engine: "codex-current-window"
pricing: "include"
pricing_config: "config/pricing.json"
pricing_config_sha256: "3c160fea5ffe7114ca85be7056c51c61f9d1ae9af7d8a050ebd302b849d13417"
pricing_contract: "1.0.0"
word_count_contract: "1.0.0"
application_name: "AI Video Expander"
why_choose: "omit"
why_choose_omission_reason: "The plan does not establish a site-specific differentiator beyond the adopted reframe scope."
last_updated: "2026-11-24"
---

# AI Video Expander Home Page Development Document

<!-- content-word-count:start -->
## Content word count

**Customer-visible English words:** 952
<!-- content-word-count:end -->

<!-- tdk:start -->
## SEO Metadata (TDK)

**Title:** AI Video Expander | Change Aspect Ratios Without Cropping

**Description:** AI Video Expander fills the edges of source clips up to 10 seconds for a new aspect ratio. Export up to 720p vertical and 1080p landscape or square.

**Keywords:** AI Video Expander, AI video outpainting, expand video without cropping, change video aspect ratio
<!-- tdk:end -->

<!-- search-presentation-brief:start -->
## Search presentation brief

| Field | Exact copy | Role and source basis | Claim boundary |
|---|---|---|---|
| Title | AI Video Expander | Change Aspect Ratios Without Cropping | plan §1.2 and §2 identify spatial reframing with contained source composition | The original clip fits inside the target canvas |
| H1 | AI Video Expander for Reframing Without Cropping | plan §1.2 and §2, same tool and core result | Expanded picture area and source fit |
| Subtitle | Fill the space around your original video to fit a new aspect ratio. Expand source clips up to 10 seconds and export up to 720p vertical and 1080p landscape or square. | plan §1.2 and SERP §4 bind the reframe mode to source duration and orientation-specific limits | Clip limit refers to input; resolution differs by orientation |
| Description | AI Video Expander fills the edges of source clips up to 10 seconds for a new aspect ratio. Export up to 720p vertical and 1080p landscape or square. | plan §1.2 and SERP §4 use the same scope in search | The vertical ceiling and landscape/square ceiling remain separate |
<!-- search-presentation-brief:end -->

## Internal implementation contract

- Customer-copy language: English.
- Canonical route: `/`.
- Copy lock: implement TDK and all text inside customer-copy verbatim.
- JSON-LD lock: implement the validated JSON-LD block verbatim in initial server HTML.
- The working form includes video upload, selection of target ratio, orientation-filtered resolution, 5- or 10-second output request and a required edge prompt. Bind the sample to the visible form only on Try it. The tool uses a centered source rectangle that fits within the output frame. It shows validation feedback beside the affected input.
- Freeze the Hero blueprint against this document after ValidateDocuments.
- Keep live generation proof and deployment separate from the local tool interface.

## Implementation Handoff

| Module | Required section ID | Heading contract | CTA label and target |
|---|---|---|---|
| Hero | `hero` | AI Video Expander for Reframing Without Cropping | The working form sits inside the Hero at #tool. The form starts the task directly, so a second jump button is omitted. |
| What Is | `what-is` | What Is AI Video Expander? | No section action. |
| Key Features | `key-features` | What AI Video Expander Lets You Control | Each locked feature action points to #tool. |
| How to Use | `how-to-use` | How to Use AI Video Expander | AI Video Expander guide → /guide |
| Use Cases | `use-cases` | Where to Use AI Video Expander | No section action. |
| Pricing | `pricing` | AI Video Expander Pricing | View pricing → /pricing. Reuse PricingSection with the frozen data. |
| FAQ | `faq` | AI Video Expander FAQ | No section action. |
| Final CTA | `final-cta` | Reframe Your Clip with AI Video Expander | Expand your video → #tool |

## Feature hierarchy

| Exact feature heading | Role | User outcome | Capability source | Distinct value | Claim boundary | Presentation emphasis |
|---|---|---|---|---|---|---|
| Choose the Shape of Your Video | primary | A clip framed for a specific destination | plan §2; SERP §4 | A clip framed for a specific destination | Six target ratios in the reframe mode | Core result |
| Keep the Whole Source Frame | primary | A new layout that includes the full source frame | plan §2; SERP §4 | A new layout that includes the full source frame | Centered source placement is an explicit tool rule | Core result |
| Describe What Belongs at the Edges | support | Control over the appearance of the added area | plan §2; SERP §4 | Control over the appearance of the added area | The prompt describes the generated edges | Supporting setting |
| Set the Output Resolution | support | An export sized for its intended placement | plan §2; SERP §4 | An export sized for its intended placement | 1080p is restricted to landscape and square | Supporting setting |

<!-- what-is-brief:start -->
## What Is brief

| Field | Decision |
|---|---|
| Entity definition | AI Video Expander is a web tool for reframing an existing video. |
| Core focus | Spatial outpainting, original composition, and purposeful new picture space. No version comparison applies to the task query. |
| User meaning | The clip can fit a different output shape and leave room for its new use. |
| Source and boundary | Plan §2 and SERP §4, scoped to spatial reframing in Ray 3.2. |
| Module allocation | Define outpainting here; separate shape, placement, edge direction and export choice in Features. |
<!-- what-is-brief:end -->

<!-- faq-brief:start -->
## FAQ brief

| Question | User need | Question basis | Answer source and boundary | Distinct value | Order reason | Claim boundary |
|---|---|---|---|---|---|---|
| Does expanding a video make it longer? | 范围选择 | observed, SERP §5 | plan §1.3 and SERP §4 | 区分空间与续写 | 先判断是否为需要的工具 | Feedback limited to the adopted reframe workflow |
| What happens to black bars in my original clip? | 来源准备 | observed, SERP §5 rank 9 | plan §1.3 and SERP §4 | 解释源片像素边界 | 确定素材处理方式 | Feedback limited to the adopted reframe workflow |
| Can I expand a clip longer than 10 seconds? | 时长适配 | inferred, plan §1.2 | plan §1.3 and SERP §4 | 提供长素材处理 | 在了解扩框后处理素材 | Feedback limited to the adopted reframe workflow |
| Which aspect ratios support 1080p? | 输出画质 | inferred, plan §1.2 | plan §1.3 and SERP §4 | 对应竖屏上限 | 在素材问题后处理导出条件 | Feedback limited to the adopted reframe workflow |
| Can AI recover what was outside the original shot? | 事实可信度 | inferred, plan §1.3 | plan §1.3 and SERP §4 | 区分生成与恢复 | 将事实边界留给评估场景 | Feedback limited to the adopted reframe workflow |
<!-- faq-brief:end -->

<!-- relevance-brief
工具页将画幅扩展与时长续写分开，并用同一表单交代允许的源片时长和按比例变化的画质。首页着重判断和动手、指南解释操作、价格页负责购买。各字段及结构化数据使用同一个产品名、英语和真实范围，价格使用冻结 USD 套餐。Guide 和 Pricing 的内链语义分别对应教程及套餐。
-->

<!-- customer-copy:start -->

<!-- module:hero:start -->
## Hero

# AI Video Expander for Reframing Without Cropping

**Subtitle:** Fill the space around your original video to fit a new aspect ratio. Expand source clips up to 10 seconds and export up to 720p vertical and 1080p landscape or square.
<!-- module:hero:end -->

<!-- module:what-is:start -->
## What Is

## What Is AI Video Expander?

**Description:** AI Video Expander is a video editing tool that uses AI to make an existing clip fit a different frame.

It uses video outpainting, a way of creating new picture area beyond the edges of a clip. The source remains the basis of the composition. You can choose a frame shape for where the clip will be shown and give the added area its own purpose, from continuing a background to leaving room for graphics.
<!-- module:what-is:end -->

<!-- module:key-features:start -->
## Key Features

## What AI Video Expander Lets You Control

**Description:** Set the shape, guide the new edges and choose a resolution that fits the finished video.

### Choose the Shape of Your Video

Give the same footage a shape that fits where it will play. Choose 9:16 or 3:4 for a vertical layout, 1:1 for a square frame, or 4:3, 16:9, or 21:9 for a horizontal layout. The tool generates scenery in the uncovered area of the new frame.

**CTA:** Expand to a New Ratio -> #tool

### Keep the Whole Source Frame

The tool fits the full source frame inside the new canvas before extending it. If a landscape shot includes two people standing far apart, the full image stays in the layout when you make a tall version. This can make the original footage occupy a smaller share of the new frame.

**CTA:** Reframe the Whole Clip -> #tool

### Describe What Belongs at the Edges

Use the prompt to describe what should appear outside the clip. Name a surface, the direction of the light, or an area to leave visually quiet. When you plan to add a headline later, ask for a plain backdrop in the part of the frame where the headline will sit.

**CTA:** Guide the New Background -> #tool

### Set the Output Resolution

Choose the resolution after you pick a ratio. The 360p setting can serve as a draft, while 540p and 720p are available for any supported ratio. Choose 1080p for a supported landscape or square frame when the placement calls for a higher-resolution file.

**CTA:** Choose an Output Resolution -> #tool
<!-- module:key-features:end -->

<!-- module:how-to-use:start -->
## How to Use

## How to Use AI Video Expander

**Description:** Start with a source clip and export a new version for the frame you need. The [AI Video Expander guide](/guide) covers the controls and common upload issues.

1. ### Step 1: Upload a Source Video
   Add the short clip you want to reframe. To use one shot from a longer edit, export that shot on its own before uploading.
2. ### Step 2: Set the Frame and Expand
   Set the target ratio, resolution and output length. Describe what should fill the new space, then expand and preview the clip.
3. ### Step 3: Download and Save the Video
   Download the finished MP4 and save it alongside the source so you can use each version for its own placement.
<!-- module:how-to-use:end -->

<!-- module:use-cases:start -->
## Use Cases

## Where to Use AI Video Expander

**Description:** Rework existing footage for a vertical social post, a product ad or a landscape edit.

### Turn a Wide Shot into a Vertical Post

A creator with both speakers framed in a landscape interview can fit that shot into a vertical canvas. Expanding the area above and below the source gives the finished Reel or Short room for captions away from the two faces.

### Make Room for a Product Headline

When a close product shot fills a square frame, expand it to a horizontal layout with a plain backdrop continuing beside the item. The added space gives you a place for a headline or call to action in your editor without putting text across the product.

### Give Portrait Footage a Landscape Frame

A portrait clip with a main subject in the center can be hard to place between wide shots in a video. Expand the scene on either side so the footage has a background that fills more of a landscape layout.
<!-- module:use-cases:end -->

<!-- module:pricing:start -->
## Pricing

## AI Video Expander Pricing

**Description:** Buy credits in a one-time purchase. Your credits never expire.

| Price | Credits | Billing | Validity |
|---|---|---|---|
| US$9.90 | 200 | One-time | Never expire |
| US$29.90 | 650 | One-time | Never expire |
| US$49.90 | 1,200 | One-time | Never expire |

[View pricing](/pricing)
<!-- module:pricing:end -->

<!-- module:faq:start -->
## FAQ

## AI Video Expander FAQ

**Description:** Learn how frame expansion handles existing borders, longer clips and output quality.

### Does expanding a video make it longer?

Frame expansion adds space around the picture. If you need the action to continue after the last frame, look for a tool that generates a video continuation.

### What happens to black bars in my original clip?

Black bars already baked into the source are inside its saved frame. For an expansion that starts at the edge of the actual picture, prepare a source file with the bars removed before uploading.

### Can I expand a clip longer than 10 seconds?

Work with segments of 10 seconds or less. Cut a longer shot into sections before uploading, then reassemble the expanded sections in your editor. Use matching ratios and settings for clips you plan to join.

### Which aspect ratios support 1080p?

Square and landscape outputs support 1080p. For 9:16 and 3:4 vertical outputs, the highest setting is 720p. Select the ratio first so the quality choices match where you plan to use the clip.

### Can AI recover what was outside the original shot?

The added area is newly generated. It can suggest a plausible continuation of the scene, but use the original footage if you need an accurate record of what was actually there.
<!-- module:faq:end -->

<!-- module:final-cta:start -->
## Final CTA

## Reframe Your Clip with AI Video Expander

Bring a clip that needs more room and choose the format you want to fill.

**Primary CTA:** Expand your video -> #tool
<!-- module:final-cta:end -->

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
  "name": "AI Video Expander | Change Aspect Ratios Without Cropping",
  "description": "AI Video Expander fills the edges of source clips up to 10 seconds for a new aspect ratio. Export up to 720p vertical and 1080p landscape or square.",
  "inLanguage": "en-US",
  "keywords": [
    "AI Video Expander",
    "AI video outpainting",
    "expand video without cropping",
    "change video aspect ratio"
  ],
  "about": {
    "@type": [
      "SoftwareApplication",
      "WebApplication"
    ],
    "name": "AI Video Expander",
    "description": "AI Video Expander fills the edges of source clips up to 10 seconds for a new aspect ratio. Export up to 720p vertical and 1080p landscape or square.",
    "applicationCategory": "MultimediaApplication",
    "applicationSubCategory": "AI Video Expander",
    "operatingSystem": "Web",
    "featureList": [
      "Choose the Shape of Your Video",
      "Keep the Whole Source Frame",
      "Describe What Belongs at the Edges",
      "Set the Output Resolution"
    ]
  },
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Does expanding a video make it longer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Frame expansion adds space around the picture. If you need the action to continue after the last frame, look for a tool that generates a video continuation."
      }
    },
    {
      "@type": "Question",
      "name": "What happens to black bars in my original clip?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Black bars already baked into the source are inside its saved frame. For an expansion that starts at the edge of the actual picture, prepare a source file with the bars removed before uploading."
      }
    },
    {
      "@type": "Question",
      "name": "Can I expand a clip longer than 10 seconds?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Work with segments of 10 seconds or less. Cut a longer shot into sections before uploading, then reassemble the expanded sections in your editor. Use matching ratios and settings for clips you plan to join."
      }
    },
    {
      "@type": "Question",
      "name": "Which aspect ratios support 1080p?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Square and landscape outputs support 1080p. For 9:16 and 3:4 vertical outputs, the highest setting is 720p. Select the ratio first so the quality choices match where you plan to use the clip."
      }
    },
    {
      "@type": "Question",
      "name": "Can AI recover what was outside the original shot?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The added area is newly generated. It can suggest a plausible continuation of the scene, but use the original footage if you need an accurate record of what was actually there."
      }
    }
  ]
}
```
<!-- json-ld:end -->

## Evidence matrix

| Module | Claim or copy boundary | Source path and section | Status |
|---|---|---|---|
| Hero | Use the adopted spatial-reframe scope. | docs/website-specs/ai-video-expander.md §1–3; SERP §4 | development-commitment |
| What Is | Use the adopted spatial-reframe scope. | docs/website-specs/ai-video-expander.md §1–3; SERP §4 | development-commitment |
| Key Features | Use the adopted spatial-reframe scope. | docs/website-specs/ai-video-expander.md §1–3; SERP §4 | development-commitment |
| How to Use | Use the adopted spatial-reframe scope. | docs/website-specs/ai-video-expander.md §1–3; SERP §4 | development-commitment |
| Use Cases | Use the adopted spatial-reframe scope. | docs/website-specs/ai-video-expander.md §1–3; SERP §4 | development-commitment |
| Pricing | Use configured credits, purchase and validity. | config/pricing.json and audits/pricing-resolution.json | user-confirmed-commercial-contract |
| FAQ | Use the adopted spatial-reframe scope. | docs/website-specs/ai-video-expander.md §1–3; SERP §4 | development-commitment |
| Final CTA | Use the adopted spatial-reframe scope. | docs/website-specs/ai-video-expander.md §1–3; SERP §4 | development-commitment |

## Key Feature evidence register

| Exact feature heading | Capability source | Evidence state | Development requirement | Claim boundary |
|---|---|---|---|---|
| Choose the Shape of Your Video | https://docs.agents.lumalabs.ai/guides/videos/reframing/ | official-live | development-commitment | Six target ratios in the reframe mode |
| Keep the Whole Source Frame | https://docs.agents.lumalabs.ai/guides/videos/reframing/ | official-live | development-commitment | Centered source placement is an explicit tool rule |
| Describe What Belongs at the Edges | https://docs.agents.lumalabs.ai/guides/videos/reframing/ | official-live | development-commitment | The prompt describes the generated edges |
| Set the Output Resolution | https://docs.agents.lumalabs.ai/guides/videos/reframing/ | official-live | development-commitment | 1080p is restricted to landscape and square |

## Validation handoff

- Run the deterministic Home validator and the independent editorial gate against this revision.
