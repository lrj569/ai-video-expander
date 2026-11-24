---
title: "AI Video Expander 网站 SEO 开发规划"
keyword: "AI Video Expander"
slug: "ai-video-expander"
source_report: "serp-report/ai-video-expander-serp-report.md"
source_evidence: "research/serper-serp-evidence.json"
target_market: "US / English"
planning_mode: "v1-fixed-three-page"
positioning_interface: "product-task-v1"
choice_reasons_interface: "evidence-led-v1"
capability_contract: "target-state-development"
publication_gate: "implementation-verification-required"
tool_product_brief: "none"
tool_product_brief_sha256: "none"
version: 0.1.0
workflow_version: 1.18.0
tool_category: "AI Video Expander"
keyword_kind: "task"
product_type: "video"
evidence_contract: "scoped-evidence-v2"
hero_capability_contract: "field-roles-v3"
review_model: "claude-opus-5-5"
last_updated: 2026-11-24
---

# AI Video Expander 网站 SEO 开发规划

## 1. 网站定位

- **网站类型：** 独立英文 SaaS 工具站，面向美国英语搜索。
- **网站是什么：** AI Video Expander。上传已有短片后生成新的边缘，输出可适配新用途的视频。
- **服务人群：** 社媒创作者、跨平台运营、品牌广告与商品视频剪辑人员。
- **核心用户需求：** 让同一段源片适应另一个画幅，留出主体周围的空间。
- **核心定位：** 画幅扩展与背景补边。输入原片、目标比例和用于新区域的描述，输出扩展过的片段。
- **核心用户任务：** 为不同发布位置重用素材，把原画面作为新画布的一部分。

### 1.1 用户选择理由

保留原片画幅是跨平台重用时的实际需求。首页展示完整源片如何嵌入目标画布，减少用户猜测会裁掉哪些画面。引导词用于描述外沿，便于规划字幕和广告留白。现有证据无法建立独家优势，省略独立 Why Choose。

### 1.2 搜索与首屏功能表达

| 卖点取舍 | 能力主题 | 事实类型 | 必写事实 | 适用范围 | 用户任务与结果 | Serper 观察 | 本站选择依据 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 主选 | 目标画幅扩框 | capability | Generate new video around the original frame to fit a new aspect ratio | 型号=Ray 3.2；模式=视频扩框；档位=不分档 | 保留已有片段并生成额外画幅 | SERP §5：第 1–4 条标题或摘要集中于画幅、改比例或补背景 | 改变画面空间直接解决跨平台复用和留白任务 |
| 备选 | 新区域画面指引 | capability | Describe what to generate in the new frame area | 型号=Ray 3.2；模式=视频扩框；档位=不分档 | 描述留白或延续的背景以引导新增区域 | SERP §5：第 2 条强调改比例与为字幕留出空间 | 文字能影响新增背景，用户必须先理解工具可以改变画幅 |

| 规格维度 | 选择判定 | 能力主题 | 规格事实 | 用户选择依据 |
| --- | --- | --- | --- | --- |
| output-resolution | hero-required | 目标画幅扩框 | up to 720p vertical and 1080p landscape or square | 竖屏、方形和横屏导出受不同上限影响 |
| clip-duration | hero-required | 目标画幅扩框 | source clips up to 10 seconds | 现有素材长度决定能否直接上传或需要分段 |
| output-duration-choice | detail | 目标画幅扩框 | 5 or 10 seconds of output video | 用于提交选择，在表单和指南解释，不能写成新增时长 |
| aspect-ratio | detail | 目标画幅扩框 | 9:16 vertical, 3:4 portrait, 1:1 square, 4:3 landscape, 16:9 widescreen, or 21:9 ultrawide | 首页工具选项和场景具体列出；四字段表达新画幅用途 |
 
| 字段 | 用户需要立即理解的内容 | 必须绑定的功能锚点 | 事实类型 | 必写事实 | 用户可见结果 | 信息分工 | 组合关系 | 组合依据 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Title | 一眼识别改画幅工具 | 目标画幅扩框 | capability | Generate new video around the original frame to fit a new aspect ratio | 新比例的扩框视频 | 核心能力及成品范围 | single | Ray 3.2 视频扩框模式。https://docs.agents.lumalabs.ai/guides/videos/reframing/ |
| H1 | 知道能扩展原画幅 | 目标画幅扩框 | capability | Generate new video around the original frame to fit a new aspect ratio | 新比例的扩框视频 | 核心类别和用户成品 | single | Ray 3.2 视频扩框模式。https://docs.agents.lumalabs.ai/guides/videos/reframing/ |
| Subtitle | 理解生成区、输入时长和画质上限 | 目标画幅扩框；目标画幅扩框；目标画幅扩框 | capability；numeric-spec；numeric-spec | Generate new video around the original frame to fit a new aspect ratio；source clips up to 10 seconds；up to 720p vertical and 1080p landscape or square | 新比例的扩框视频 | 适用素材及输出范围 | joint | Ray 3.2 视频扩框模式。同一请求中的源片上限和按目标比例区分的画质上限。https://docs.agents.lumalabs.ai/guides/videos/reframing/ |
| Description | 在搜索结果明白可处理的素材和输出 | 目标画幅扩框；目标画幅扩框；目标画幅扩框 | capability；numeric-spec；numeric-spec | Generate new video around the original frame to fit a new aspect ratio；source clips up to 10 seconds；up to 720p vertical and 1080p landscape or square | 新比例的扩框视频 | 与副标题覆盖同一组事实 | joint | Ray 3.2 视频扩框模式。同一请求中的源片上限和按目标比例区分的画质上限。https://docs.agents.lumalabs.ai/guides/videos/reframing/ |

### 1.3 内部证据与发布限制

| 能力 | 来源与适用范围 | 发布前验证项 | 不得扩展的声明 |
| --- | --- | --- | --- |
| 源片留在画布里 | https://docs.agents.lumalabs.ai/guides/videos/reframing/ 的 source_position | 使用适配矩形，实测输出中原片边缘、时间和质量 | 避免承诺恢复原先没有拍摄的真实信息 |
| 画幅与质量 | https://docs.agents.lumalabs.ai/guides/videos/reframing/ 的 reframe 模式 | 横、竖、方形分别送测；核对输入上限和输出 | 竖屏 1080p、任意时长、无条件输出相同时长 |
| 继续片尾 | https://docs.platform.pixverse.ai/video-extend-43051216e0 | 首发范围排除 | 时间续写能力或跨模式组合 |
| PixVerse Video Expand | https://docs.platform.pixverse.ai/video-expand-45751712e0；最长 30 秒、50 MB、MP4/MOV/WebM | 同任务备选。Ray 3.2 的显式原片矩形和新区域提示词优先，因为完整保留构图与标题留白是主要任务 | PixVerse 可接受更长源片；未观察到同等显式指引和位置字段，本站不采纳其 30 秒上限 |
| 商业政策 | 主工程冻结的通用套餐和政策 | 核验账号、积分扣减及付款回传 | 未证实的免费额度、次数、退款、支付方式和商用权利 |

## 2. 首页能力覆盖

| 能力主题 | 证据来源 | 证据状态 | 首页角色 | 开发要求 | 声明边界 | 本站能力依据 | 适用范围 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 目标画幅扩框 | https://docs.agents.lumalabs.ai/guides/videos/reframing/ | official-live | key-feature | development-commitment | Generate new video around the original frame to fit a new aspect ratio；source clips up to 10 seconds；up to 720p vertical and 1080p landscape or square；5 or 10 seconds of output video；9:16 vertical, 3:4 portrait, 1:1 square, 4:3 landscape, 16:9 widescreen, or 21:9 ultrawide。提交时显式设置适配矩形；选档随目标比例约束。 | 任务词采用已发布扩框模式，满足原片复用和尺寸转换 | 型号=Ray 3.2；模式=视频扩框；档位=不分档 |
| 新区域画面指引 | https://docs.agents.lumalabs.ai/guides/videos/reframing/ | official-live | key-feature | development-commitment | Describe what to generate in the new frame area；填写新画布区域的文字说明，模式要求提示词 1–6,000 字符。生成内容属于目标区域。 | 已发布提示词控制可满足字幕留白、背景构图和广告复用需求。 | 型号=Ray 3.2；模式=视频扩框；档位=不分档 |
| 原片完整构图 | https://docs.agents.lumalabs.ai/guides/videos/reframing/ | official-live | key-feature | development-commitment | 把原画作为完整矩形适配目标画布；不把裁切框默认当作全画面。 | 采用 source_position 明确居中适配 | 型号=Ray 3.2；模式=视频扩框；档位=不分档 |
| 按画幅选择输出质量 | https://docs.agents.lumalabs.ai/guides/videos/reframing/ | official-live | key-feature | development-commitment | 竖版最高 720p，横版与方形最高 1080p，选项按比例变化。 | 采用第一方文档中可组合的画幅和质量 | 型号=Ray 3.2；模式=视频扩框；档位=不分档 |
| 继续片尾 | https://docs.platform.pixverse.ai/video-extend-43051216e0 | official-live | exclude | exclude | 时间续写是单独工作流。 | 发现相邻意图，用 FAQ 区分 | 型号=PixVerse V6；模式=延长时长；档位=不分档 |

| 能力或建议 | 适用范围 | 判断类型 | 证据引用 | 用户任务 | 可表达的功能特色 |
| --- | --- | --- | --- | --- | --- |
| 扩展到目标画幅 | 型号=Ray 3.2；模式=视频扩框；档位=不分档 | source-fact | SERP §4；https://docs.agents.lumalabs.ai/guides/videos/reframing/ | 一段素材跨平台复用 | 围绕原片扩展画布 |
| 控制新区域的内容 | 型号=Ray 3.2；模式=视频扩框；档位=不分档 | source-fact | SERP §4；https://docs.agents.lumalabs.ai/guides/videos/reframing/ | 为字幕或标题腾出空间 | 通过描述指导新增边缘 |

## 3. 关键词词群规划

### 意图证据表

| 证据 ID | 查询词 | 证据范围 | 信号类型 | 数值或观察 | 来源 | 市场与语言 | 观察时间 | 目标 URL | 限制 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Q1 | AI Video Expander | exact | organic | 第 1–4 条对应画幅扩展，第 5–8 和 10 有时长意图 | SERP §3、§5 | US / en | 2026-11-24 | / | 无需求量 |
| Q2 | AI video outpainting | proxy | related-search | 相关搜索返回画幅扩展语义及免费问句 | SERP §3 | US / en | 2026-11-24 | none | 联想不等于需求强度 |
| Q3 | AI Video Expander Pricing | qualitative | inferred | 用价格页核对套餐与积分 | SERP §7 | US / en | 2026-11-24 | /pricing | 由独立价格报告验证 |
| Q4 | How to Use AI Video Expander | qualitative | inferred | 用教程解释视频选择、配置和检查 | SERP §7 | US / en | 2026-11-24 | /guide | 由独立教程报告验证 |

### 3.1 词群总表

| 词群 | 搜索意图 | 代表关键词 | 热度值 | 热度指标与来源 | 市场 / 日期 | 开发优先级 | 目标 URL |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 画幅扩展 | 扩框、改比例 | AI Video Expander | unavailable | 无需求量来源 | US / 2026-11-24 | 首发 | / |
| 购买前评估 | 套餐和积分 | AI Video Expander Pricing | unavailable | 无需求量来源 | US / 2026-11-24 | 首发 | /pricing |
| 操作教程 | 开始和排错 | How to Use AI Video Expander | unavailable | 无需求量来源 | US / 2026-11-24 | 首发 | /guide |

### 3.2 完整关键词映射

| 关键词 | 发现来源 | 词群 | 搜索意图 | 热度值 | 热度指标与来源 | 市场 / 日期 | 开发优先级 | 目标 URL | 规划边界 | 需求证据状态 | 需求证据引用 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AI Video Expander | 精确查询 | 画幅扩展 | 工具发现 | unavailable | 无需求量来源 | US / 2026-11-24 | 首发 | / | 核心任务为扩大画幅 | observed-exact | Q1 |
| AI video outpainting | Serper 相关搜索 | 画幅扩展 | 工具发现 | unavailable | 无需求量来源 | US / 2026-11-24 | 首发 | / | 保持同一首页 | proxy-supported | Q2 |
| AI expand video online free | Serper 相关搜索 | 画幅扩展 | 试用调查 | unavailable | 无需求量来源 | US / 2026-11-24 | 首发 | / | 只解释可核实的使用条件 | proxy-supported | Q2 |
| AI Video Expander Pricing | 价格页任务 | 购买前评估 | 价格 | unavailable | 无需求量来源 | US / 2026-11-24 | 首发 | /pricing | 套餐和积分归价格页 | inferred | Q3 |
| How to Use AI Video Expander | 教程页任务 | 操作教程 | 使用帮助 | unavailable | 无需求量来源 | US / 2026-11-24 | 首发 | /guide | 工作过程和故障归教程页 | inferred | Q4 |

### 3.3 固定 V1 页面分配

| 首发 URL | 固定页面角色 | 所有搜索意图 | 主关键词 | 支持词群 | 与其他两页的边界 |
| --- | --- | --- | --- | --- | --- |
| / | 首页与工作工具入口 | 工具发现、生成及试用调查 | AI Video Expander | 扩画与视频补边 | 只摘要操作和套餐 |
| /pricing | 价格页 | 套餐、计费和积分 | AI Video Expander Pricing | 购买前评估 | 解释权威套餐和已确认商业事实 |
| /guide | 用户指南 | 操作方法、场景、排错 | How to Use AI Video Expander | 工作流与教程 | 用实际控件完成任务 |

### 3.4 覆盖决策

| 模块 | 内容数量 | 必要任务或问题 | 主要展开信息 | 依据与取舍 |
| --- | --- | --- | --- | --- |
| key-features | 4 | 改目标比例；原片完整适配；指导新增区域；选择输出清晰度 | 画布比例决定输出形状，矩形位置决定原片边界，提示词决定新增区域方向，实际比例决定画质档位 | SERP §4 的同一模式支持四种独立的用户决策，按操作分工避免重复 |
| use-cases | 3 | 转竖版社媒；商品广告留出标题空间；把窄画幅改成横版 | 横向人物原片适配竖屏；中心主体旁留白；竖拍素材补出左右环境 | §1 人群和 SERP §5 的不同任务，按可见输出差异组织 |
| faq | 5 | 扩框与续写区别；黑边；可用片长；画质与画幅关系；原框之外能恢复什么 | 说明限制和用户决策，分别放边界 FAQ | SERP §3–5 及 §1.3。现有黑边是否被处理需验证；只说明原片区域与新增区域的区别 |

- 首发保留画幅、教程和套餐三组。时长续写、超分辨率和具名工具搜索无对应目标页。

## 4. URL 与搜索意图架构

### 4.1 首发 URL

| URL | 页面角色 | 主导搜索意图 | 主关键词 | 支持词群 | 是否可索引 | 与其他页面的边界 |
| --- | --- | --- | --- | --- | --- | --- |
| / | 工具入口 | 扩框 | AI Video Expander | 视频补边 | 是 | 以直接任务为先 |
| /pricing | 价格页 | 选择套餐 | AI Video Expander Pricing | 套餐与积分说明 | 是 | 解释购买和套餐 |
| /guide | 教程页 | 学习操作 | How to Use AI Video Expander | 设置和排错 | 是 | 解释素材和流程 |

### 4.2 固定 V1 页面集合

首发页面为 `/`、`/pricing` 和 `/guide`。

### 4.3 关键词蚕食检查

| 潜在冲突 | 风险 | 解决方式 |
| --- | --- | --- |
| 首页与教程 | 相同工具名 | 首页工作台承接直接扩框，教程做步骤和排查 |
| 首页与套餐 | 两处显示定价 | 首页提供概览，价格页解释套餐组成 |
 
## 5. 网站拓扑与内链网络

### 5.1 首发拓扑

`/` ⇄ `/guide`；`/` ⇄ `/pricing`。

### 5.2 导航

首页、Guide、Pricing 使用模板公开导航。保留页脚原有底部导航。

### 5.3 上下文内链

| 来源 URL | 目标 URL | 链接目的 | 建议锚文本方向 | 放置位置 |
| --- | --- | --- | --- | --- |
| / | /guide | 阅读检查与操作 | Video expansion guide | How to use |
| / | /pricing | 了解购买选项 | View pricing | 现有 pricing 导航 |
| /guide | /#tool | 返回工具 | Expand a video | Quick start 和最终 CTA |
| /pricing | / | 返回工具 | AI Video Expander | 站点主导航 |

## 6. 修订记录

| 版本 | 日期 | 变更 |
| --- | --- | --- |
| 0.1.0 | 2026-11-24 | 基于新案例的精确查询、首方视频模式和用户意图确定三页 |
