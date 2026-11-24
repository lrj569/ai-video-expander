---
title: "AI Video Expander Guide Page Development Document"
keyword: "How to Use AI Video Expander"
site_slug: "ai-video-expander"
guide_slug: "how-to-use-ai-video-expander"
page: "guide"
route: "/guide"
serp_report: "serp-report/how-to-use-ai-video-expander-serp-report.md"
serp_report_sha256: "5bda76ac4a905a672d1412dda43a3ca241bbfa3cd3e857c9f818ff4d06389c7c"
website_plan: "docs/website-specs/ai-video-expander.md"
website_plan_sha256: "66aa81e6a8dcfdc53eac31006e0a38a1d18d12cdebae3b10818f9eb8be92e2b1"
homepage_doc: "docs/page-development-plans/ai-video-expander-home.md"
homepage_doc_sha256: "2bbf36ed7468f47d0329929e09a17551bf4d08f7f0c774c862e5efe37c744c2a"
authoring_task_id: "01a20b87-0e27-7822-8155-6fbf90f500e8"
authoring_engine: "codex-current-window"
authoring_manifest: "audits/codex-seo-guide-authoring-manifest.json"
document_version: "1.5.0"
product_type: "video"
word_count_contract: "1.0.0"
last_updated: "2026-11-24"
---

# AI Video Expander Guide Page Development Document

<!-- content-word-count:start -->
## Content word count

**Customer-visible English words:** 1767
<!-- content-word-count:end -->

<!-- tdk:start -->
## SEO Metadata (TDK)

**Title:** How to Use AI Video Expander: Reframing Guide

**Description:** Learn how to use AI Video Expander to fit a clip into a new frame. Choose an aspect ratio and export quality, guide the fill, and save the finished MP4.

**Keywords:** How to Use AI Video Expander, how to expand a video with AI, video reframing tutorial
<!-- tdk:end -->

## Internal implementation contract

- Customer copy language: English.
- Canonical route: `/guide`.
- Copy lock: implement the TDK, customer-copy and JSON-LD blocks verbatim.
- Primary CTA: `/#tool`.
- Page ownership: reframing tutorial, workflow decisions, preparation and troubleshooting.
- Publication gate: implement and verify the supported controls, source-file behavior and MP4 download before release.
- Media: each case has one distinct starting clip and one final video, presented separately next to it. The media JSON must copy each locked prompt verbatim. Copy prompt copies the visible prompt. Try it takes the source video and the case's exact target ratio into `/#tool`; the visible prompt goes into Fill prompt. Ratios in order: 9:16, 16:9, 1:1, 3:4, 21:9.

## Implementation Handoff

| Module | Required section ID | Heading contract | CTA |
| --- | --- | --- | --- |
| Hero | `guide-hero` | Only H1 | Open AI Video Expander → /#tool and Start the tutorial → #quick-start |
| Quick Start | `quick-start` | H2 with locked content | None |
| Choose Your Starting Workflow | `starting-workflow` | H2 with locked content | None |
| Prepare Your Inputs | `prepare-inputs` | H2 with locked content | None |
| Configure the Sequence | `configure-sequence` | H2 with locked content | None |
| Generate the Video | `generate-video` | H2 with locked content | None |
| Download and Save | `download-save` | H2 with locked content | None |
| Continue or Edit | `continue-edit` | H2 with locked content | None |
| Prompt Examples | `prompt-examples` | H2 with locked content | None |
| Troubleshooting | `troubleshooting` | H2 with locked content | None |
| FAQ | `faq` | H2 with locked content | None |
| Final CTA | `final-cta` | H2 | Expand a video → /#tool |

<!-- relevance-brief
Earlier tutorial results give upload-to-export steps. This guide adds orientation-specific export choices and tells readers how to inspect generated areas, including already encoded bars and moving edges. Its English title, headings and steps focus on the current tool and are different from the Home task and Pricing intent. The SEO description and JSON-LD mirror the task and visible steps, with site navigation back to the actual tool anchor. Provider-only limits are excluded from claims unless adopted in the plan.
-->

<!-- customer-copy:start -->
<!-- module:hero:start -->
# How to Use AI Video Expander: A Step-by-Step Guide

**Subtitle:** Upload a source video, select a target frame, and describe the areas you want to fill. Follow the steps below to preview and save an MP4.

**Primary CTA:** Open AI Video Expander -> /#tool

**Secondary CTA:** Start the tutorial -> #quick-start
<!-- module:hero:end -->

<!-- module:quick-start:start -->
## Quick Start

### Step 1: Choose the new frame

Decide where the clip will run. Pick 9:16 for a vertical layout, 1:1 for a square layout, or 16:9 for widescreen.

### Step 2: Upload a source video

Open AI Video Expander and upload one video up to 10 seconds long. If you need only part of a longer take, trim it to that section before uploading.

### Step 3: Choose your settings and describe the fill

Set the target ratio, output resolution and duration. In **Fill prompt**, describe what should appear around the original frame, such as the continuation of a wall, sky or floor.

### Step 4: Generate and inspect the expanded clip

Select **Expand**. Once the output is ready, watch it all the way through and check where the original frame meets the new areas.

### Step 5: Download the MP4

Download the finished MP4 and save it to the device or project folder where you'll use it.
<!-- module:quick-start:end -->

<!-- module:starting-workflow:start -->
## Choose Your Starting Workflow

### Fit a wide clip into a vertical layout

Start with a landscape clip where multiple subjects or a moving subject need to stay in view. A 9:16 canvas gives the source extra room above and below.

### Fit a portrait clip into widescreen

Use a portrait clip for a 16:9 layout when you want to keep the subject's full height. Check that the background gives you something sensible to continue on both sides.

### Make a square product clip

Start with a clip where the product already has clear margins. In a 1:1 frame, the added area can carry the same surface or background around the product.

### Leave room for a caption or title

Choose a shot with an uncluttered surface near the edge, such as sky above a subject or a plain wall beside them. The new area can serve as space for lettering you add in your editor.

### Reframe footage for a wide sequence

Use a 16:9 or narrower source clip that needs to sit alongside 21:9 shots. Start with a steady shot so you can check how the new side areas behave through the cut.
<!-- module:starting-workflow:end -->

<!-- module:prepare-inputs:start -->
## Prepare Your Inputs

### Select a single shot

Use one source video with a continuous shot. If the source contains several cuts, pull out the shot you want to reframe so you can describe one background and inspect one set of edges.

### Trim the source to 10 seconds or less

Trim a longer take to the section you need before uploading. Include enough time around the key action to see how it moves near the new areas.

### Remove any baked-in black bars

When black bars are already part of the video, crop them out in your editor before uploading. Check the source afterward so the crop removes only the bars.

### Check the edges of the source

Watch for a hand, face, sign or horizon crossing the outside edge of the source. If a detail leaves the frame, choose a section where more of it is visible. New areas are generated and may depict a different version of what was outside the shot.
<!-- module:prepare-inputs:end -->

<!-- module:configure-sequence:start -->
## Configure the Sequence

### Set the aspect ratio

Choose 9:16 or 3:4 for portrait, 1:1 for square, or 4:3, 16:9 or 21:9 for landscape. Use the shape of the actual layout the clip will go into.

### Choose an output resolution

Portrait outputs support 360p, 540p and 720p. Square and landscape outputs also support 1080p. Choose the highest available setting you need for the project.

### Set the output duration

Select a 5-second or 10-second output. The source video must be 10 seconds or shorter. Treat output duration as the length of the reframing result and check that the action you need is in the exported clip.

### Fill the new areas

In **Fill prompt**, name the surface or scene that should extend past the original frame. Mention details that matter, such as the line of the horizon, the color of a wall or where a clear area should sit.

### Check where the source sits

The original frame fits inside the target canvas. For a wide source on a taller target, picture extra space at the top and bottom. For a portrait source on a wider target, look for extra space at both sides.
<!-- module:configure-sequence:end -->

<!-- module:generate-video:start -->
## Generate the Video

### Check the input and settings

Confirm you've selected the intended clip, the destination aspect ratio and the desired resolution and duration. Read the fill description once and remove any request to replace a subject already in the frame.

### Select Expand

Start generation after the source and required settings are in place. If a field shows an error, correct that field before retrying.

### Watch the finished result

Play the result through the full shot. Look for lines that jump across the original boundary, unexpected objects at the edge, or textures that flicker as the camera moves.
<!-- module:generate-video:end -->

<!-- module:download-save:start -->
## Download and Save

Download the finished MP4 to the location where you'll edit or publish it. Keep the source video as a separate file if you need multiple exports from the same shot.
<!-- module:download-save:end -->

<!-- module:continue-edit:start -->
## Continue or Edit

### Adjust the expanded edges

Return to the same source clip if you want another fill. Narrow the description to the visible issue, such as a doorway that should continue straight or a quiet area for a caption.

### Make a version for a second layout

Start again from the original clip, choose the second destination ratio, and update the fill description for the edges that will change. Save the new output separately so you can identify each layout.
<!-- module:continue-edit:end -->

<!-- module:prompt-examples:start -->
## Prompt Examples

### Frame a bicycle trick for a vertical cut

**Starting material:** A landscape clip of a rider in a teal jacket on a cream BMX at a red clay skatepark.

**Prompt:** Ten seconds in a vertical frame. A rider in a teal jacket pops the front wheel of a cream BMX over a low red clay bank, then rolls away along the ramp. The camera stays locked at wheel height. Keep the whole bicycle across the middle of the image, with pale evening sky above and scuffed red clay leading up from the lower edge.

### Widen a ceramic studio shot

**Starting material:** A portrait clip of a potter in an ochre apron shaping a pale blue bowl.

**Prompt:** Ten seconds in a widescreen frame. Clay folds inward as a potter in an ochre apron shapes a pale blue bowl on a spinning wheel. Hold a steady waist-high shot. The potter and bowl stay in the middle as teal shelves, stacked ceramic cups and a sunlit workbench extend the room on either side.

### Make a square coffee product clip

**Starting material:** A landscape clip of a matte plum coffee bag, a tan scoop and an oat-colored tabletop.

**Prompt:** Ten seconds in a square tabletop shot. A tan scoop tips a few coffee beans beside a matte plum coffee bag and settles on the table. The camera holds at a low three-quarter angle. Continue the warm oat-colored tabletop below the bag and the softly lit plaster backdrop above it, leaving clear space around the packaging.

### Leave room above a climbing shot

**Starting material:** A landscape clip of a climber in a rust jacket on pale sandstone with a cobalt rope.

**Prompt:** Ten seconds in a tall portrait shot. A climber in a rust jacket catches a ledge on pale sandstone, then takes one measured step upward as a cobalt rope tightens below. Film from a stationary side angle. Show the entire climber and the rock around them, with quiet sunlit sandstone extending above the handhold.

### Carry a night street across a wider frame

**Starting material:** A landscape clip of a silver delivery bicycle with a red crate on a wet street.

**Prompt:** Ten seconds in an ultrawide street shot. A silver delivery bicycle with a red crate rolls through an amber shop-window reflection and stops at a curb. The camera stays level and stationary. Keep the bicycle near the middle as wet paving and warm shop windows continue across both sides of the frame.
<!-- module:prompt-examples:end -->

<!-- module:troubleshooting:start -->
## Troubleshooting

### The source video is rejected

A source longer than 10 seconds exceeds the input limit. Trim the source to 10 seconds or less in your editor and upload the trimmed file.

### 1080p is unavailable

The vertical ratios, 9:16 and 3:4, support up to 720p. Select 720p for portrait, or use a square or landscape ratio if your delivery layout allows it.

### Black bars remain inside the frame

Bars already encoded in the source sit within the original picture. Remove those bars from the source in your editor, then expand the clean clip.

### The new edge flickers during a pan

A moving background can expose different details in successive frames. Try a steadier part of the source or a target ratio closer to the original. Review the motion again after generating.

### New objects appear where you need empty space

The fill description may leave room for the model to add details. Describe a specific plain surface, such as an evenly lit wall with room above the subject, and check that the resulting area suits your text.
<!-- module:troubleshooting:end -->

<!-- module:faq:start -->
## FAQ

### Q1: Can I use a clip I filmed myself?

Yes. Upload one source video up to 10 seconds long.

### Q2: What does the fill prompt control?

It describes what should appear in the added areas around the original frame.

### Q3: How can I keep everyone in a landscape shot when I make it vertical?

Choose a portrait ratio and use a source that already includes everyone you want to keep. The original frame fits inside the new canvas.

### Q4: Can I make the clip longer by filling its edges?

Edge fill changes the view around the original frame. Adding action after the last frame is a separate video extension task.

### Q5: What if the source is longer than 10 seconds?

Trim it down or select individual sections in your editor before uploading one clip at a time.

### Q6: What resolution should I choose for a vertical post?

Choose up to 720p for 9:16 or 3:4. The available lower options are 540p and 360p.

### Q7: Can the tool recover a detail that was cut out of the source?

The tool generates a possible scene around the original video. Use the original recording if you need to recover a real detail from outside the current frame.

### Q8: What do I save after expansion?

Save the completed MP4. Keep the source video on hand to create another layout from the original shot.
<!-- module:faq:end -->

<!-- module:final-cta:start -->
## Fit Your Clip to a New Frame

Select the video you want to reframe and decide where you'll use the finished clip.

**Primary CTA:** Expand a video -> /#tool
<!-- module:final-cta:end -->
<!-- customer-copy:end -->

<!-- json-ld:start -->
## JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": [
    "WebPage",
    "TechArticle",
    "FAQPage"
  ],
  "name": "How to Use AI Video Expander: Reframing Guide",
  "description": "Learn how to use AI Video Expander to fit a clip into a new frame. Choose an aspect ratio and export quality, guide the fill, and save the finished MP4.",
  "inLanguage": "en-US",
  "keywords": [
    "How to Use AI Video Expander",
    "how to expand a video with AI",
    "video reframing tutorial"
  ],
  "about": {
    "@type": [
      "SoftwareApplication",
      "WebApplication"
    ],
    "name": "AI Video Expander",
    "description": "Learn how to use AI Video Expander to fit a clip into a new frame. Choose an aspect ratio and export quality, guide the fill, and save the finished MP4.",
    "applicationCategory": "MultimediaApplication",
    "applicationSubCategory": "AI Video Expander",
    "operatingSystem": "Web"
  },
  "hasPart": {
    "@type": "ItemList",
    "name": "AI Video Expander Quick Start",
    "numberOfItems": 5,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Choose the new frame"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Upload a source video"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Choose your settings and describe the fill"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Generate and inspect the expanded clip"
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "Download the MP4"
      }
    ]
  },
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can I use a clip I filmed myself?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Upload one source video up to 10 seconds long."
      }
    },
    {
      "@type": "Question",
      "name": "What does the fill prompt control?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It describes what should appear in the added areas around the original frame."
      }
    },
    {
      "@type": "Question",
      "name": "How can I keep everyone in a landscape shot when I make it vertical?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Choose a portrait ratio and use a source that already includes everyone you want to keep. The original frame fits inside the new canvas."
      }
    },
    {
      "@type": "Question",
      "name": "Can I make the clip longer by filling its edges?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Edge fill changes the view around the original frame. Adding action after the last frame is a separate video extension task."
      }
    },
    {
      "@type": "Question",
      "name": "What if the source is longer than 10 seconds?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Trim it down or select individual sections in your editor before uploading one clip at a time."
      }
    },
    {
      "@type": "Question",
      "name": "What resolution should I choose for a vertical post?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Choose up to 720p for 9:16 or 3:4. The available lower options are 540p and 360p."
      }
    },
    {
      "@type": "Question",
      "name": "Can the tool recover a detail that was cut out of the source?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The tool generates a possible scene around the original video. Use the original recording if you need to recover a real detail from outside the current frame."
      }
    },
    {
      "@type": "Question",
      "name": "What do I save after expansion?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Save the completed MP4. Keep the source video on hand to create another layout from the original shot."
      }
    }
  ]
}
```
<!-- json-ld:end -->

## Evidence matrix

| Module | Claim or copy boundary | Source path and section | Status |
| --- | --- | --- | --- |
| Hero | Source-led reframing workflow. Plan and homepage own capability promises. | Guide SERP §4 and §6, website plan §1.2 and §2, Home how-to-use | development-commitment |
| Quick Start | Source-led reframing workflow. Plan and homepage own capability promises. | Guide SERP §4 and §6, website plan §1.2 and §2, Home how-to-use | development-commitment |
| Choose Your Starting Workflow | Source-led reframing workflow. Plan and homepage own capability promises. | Guide SERP §4 and §6, website plan §1.2 and §2, Home how-to-use | development-commitment |
| Prepare Your Inputs | Source-led reframing workflow. Plan and homepage own capability promises. | Guide SERP §4 and §6, website plan §1.2 and §2, Home how-to-use | development-commitment |
| Configure the Sequence | Source-led reframing workflow. Plan and homepage own capability promises. | Guide SERP §4 and §6, website plan §1.2 and §2, Home how-to-use | development-commitment |
| Generate the Video | Source-led reframing workflow. Plan and homepage own capability promises. | Guide SERP §4 and §6, website plan §1.2 and §2, Home how-to-use | development-commitment |
| Download and Save | Download the completed MP4. | Guide SERP §4 and §6, website plan §1.2 and §2, Home how-to-use | development-commitment |
| Continue or Edit | Source-led reframing workflow. Plan and homepage own capability promises. | Guide SERP §4 and §6, website plan §1.2 and §2, Home how-to-use | development-commitment |
| Prompt Examples | Outpainting tasks and phrasing use distinct supported target ratios. | Guide SERP §4 and §6, website plan §1.2 and §2, Home how-to-use | development-commitment |
| Troubleshooting | Source-led reframing workflow. Plan and homepage own capability promises. | Guide SERP §4 and §6, website plan §1.2 and §2, Home how-to-use | development-commitment |
| FAQ | Source-led reframing workflow. Plan and homepage own capability promises. | Guide SERP §4 and §6, website plan §1.2 and §2, Home how-to-use | development-commitment |
| Final CTA | Source-led reframing workflow. Plan and homepage own capability promises. | Guide SERP §4 and §6, website plan §1.2 and §2, Home how-to-use | development-commitment |

## Workflow evidence register

| Exact workflow or setting | Source | Evidence state | Claim boundary |
| --- | --- | --- | --- |
| Source clip, contained geometry, Fill prompt | Guide SERP §4 and website plan §2 | development-commitment | One source video up to 10 seconds, fit whole source in target frame |
| Aspect ratios and quality | Guide SERP §4 and website plan §1.2 | development-commitment | 9:16 and 3:4 up to 720p, square and landscape up to 1080p |
| Output length | Guide SERP §4 | development-commitment | 5 or 10 seconds are output options |
| Expand and download | Guide SERP §4 and Home how-to-use | development-commitment | Wait for the resulting MP4, then inspect and download |
| Preview and adjust from source | Guide SERP §6 and website plan §2 | development-commitment | Correct settings or branch from original footage |

## Validation handoff

- Deterministic validator: recorded in the authoring manifest.
- Tutorial quality audit: recorded in the authoring manifest.
- Humanization audit: recorded in the authoring manifest.
