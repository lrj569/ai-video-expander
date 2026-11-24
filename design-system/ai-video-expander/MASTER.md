# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** AI Video Expander
**Generated:** 2026-11-24 11:16:44
**Category:** Photography Studio

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#18181B` | `--color-primary` |
| On Primary | `#FFFFFF` | `--color-on-primary` |
| Secondary | `#27272A` | `--color-secondary` |
| On Secondary | `#FFFFFF` | `--color-on-secondary` |
| Accent/CTA | `#F8FAFC` | `--color-accent` |
| On Accent/CTA | `#0F172A` | `--color-on-accent` |
| Background | `#000000` | `--color-background` |
| Foreground | `#FAFAFA` | `--color-foreground` |
| Card | `#0C0C0C` | `--color-card` |
| Card Foreground | `#FAFAFA` | `--color-card-foreground` |
| Muted | `#181818` | `--color-muted` |
| Muted Foreground | `#94A3B8` | `--color-muted-foreground` |
| Border | `#3F3F46` | `--color-border` |
| Destructive | `#EF4444` | `--color-destructive` |
| On Destructive | `#000000` | `--color-on-destructive` |
| Ring | `#FFFFFF` | `--color-ring` |

**Color Notes:** Pure black + white contrast

### Typography

- **Heading Font:** Archivo
- **Body Font:** Space Grotesk
- **Mood:** minimal, portfolio, designer, creative, clean, artistic
- **Google Fonts:** [Archivo + Space Grotesk](https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap)

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
```

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #F8FAFC;
  color: #0F172A;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #FAFAFA;
  border: 2px solid #18181B;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: #000000;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #18181B;
  outline: none;
  box-shadow: 0 0 0 3px #18181B20;
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Motion-Driven

**Keywords:** Animation-heavy, microinteractions, smooth transitions, scroll effects, parallax, entrance anim, page transitions

**Best For:** Portfolio sites, storytelling platforms, interactive experiences, entertainment apps, creative, SaaS

**Key Effects:** Scroll anim (Intersection Observer), hover (300-400ms), entrance, parallax (3-5 layers), page transitions

### Page Pattern

**Pattern Name:** Scroll-Triggered Storytelling

- **Conversion Strategy:** Keep the narrative understandable without scroll-driven effects. Use progress indicator. Mobile: simplify animations. Keep DOM reading order complete; disable parallax and scroll-scrub under reduced motion. Pause scroll animation when offscreen or hidden and render each chapter in its final readable state under reduced motion.
- **CTA Placement:** End of each chapter (mini) + Final climax CTA
- **Section Order:** Intro hook > Chapter 1 (problem) > Chapter 2 (journey) > Chapter 3 (solution) > Climax CTA

---

## Anti-Patterns (Do NOT Use)

- ❌ Heavy text
- ❌ Poor image showcase

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile

# AI Video Expander 设计系统

## 项目个性简报

- identity: 像修片工作室的编辑台。原片、画幅和留白都是直观的操作对象；用胶片预览和印刷质感建立身份。
- audienceTemperament: 创作者和编辑会先扫描工作台和样片，再查比例、导出条件及配置。
- motionPersonality: 画幅状态切换、缩略图入场与按钮反馈清晰可见。指针只在 Hero 媒体框边缘产生微小视差，表单与文字保持稳定。减少动态模式保持同等操作功能。
- mediaStyle: 真实摄影质感，稳定机位和可辨主体，用前后构图关系解释扩框。教程按可重复动作展示。
- subjectDomain: 城市运动、手作、产品、室内访谈与实景商拍。

## 最终 Tokens

| Token | Value | Role |
| --- | --- | --- |
| background | #080F1B | 深墨蓝工作底色，三页共用 |
| foreground | #EAF5FF | 冰白正文和标题 |
| card | #101C2D | 表单、卡片、交互背景 |
| muted | #142339 | 低重心容器、分隔 |
| muted-foreground | #AABBD0 | 副标题和帮助文字 |
| border | #2B435E | 显示卡面和输入边界 |
| primary | #72EADB | 冰青主操作与推荐边界 |
| primary-foreground | #071B22 | 冰青包含的可读文字 |
| primary-hover | #A1FFF0 | 悬停和按下的状态梯度 |
| ring | #79F3E3 | 可辨的键盘焦点 |
| accent | #17353D | 推荐档与选择的轻色底 |
| radius | 14px | 轻度圆角框架 |
| display | Instrument Serif, weight 400 | 大标题；Hero 约 74–82px，移动约 44px，行高 1.0 |
| body | Instrument Sans Variable, weights 400–700 | 阅读、表单和小按钮；正文 16–18px，行高 1.55 |
| content max | 1216px | 三页共享边距节奏，手机首层边距 16px |

ui-ux-pro-max 查询 `video editing SaaS editorial studio` 返回 Motion-Driven 和 Scroll-Triggered Storytelling，采用连续叙事、保全原生阅读顺序和从交互弱化到静态的方案。推荐纯黑白配色及 Archivo/Space Grotesk 调整为深蓝视频工作台和有角色差别的正文/标题。Hero 按已冻结结构执行。冰青可见于 Home 主提交、Guide 工具链接和 Pricing 推荐档；选中项有边框/轮廓，状态不单靠色相。

## 动效和空间

常用状态反馈 150–240ms，主体转场约 360ms，结果画面不随光标拖拽。桌面 Hover 和 focus 都能辨认；按下反馈和键盘操作完整。无悬停设备直达控件。关闭非必要位移、自动播放和视差时保留海报和同一操作深度。桌面 1440、较矮桌面 1280×720 和手机 390 检查自然分行与点击区。

- 字体落地: @fontsource/instrument-serif@5.3.0（400 Regular）、@fontsource-variable/instrument-sans@5.3.0（400–700），统一从 src/styles/project-fonts.ts 引入拉丁子集。
用户调整：深墨蓝与冰青取代暖纸色，Hero 用几何网格、雾蓝高光和 Instrument Sans 字形表达未来感。