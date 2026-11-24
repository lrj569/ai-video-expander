# SERP 调研报告 - AI Video Expander

## 1. 调研背景

- 主关键词：AI Video Expander
- 目标市场 / 语言：美国 / 英语。设备和系统为 unspecified。
- 调研状态：live。观察于 2026-11-24。Serper API 为同步采集；本次未命中缓存，消耗 1 credit，美元成本 unavailable。
- 观察时间为本机接收响应，任务编号为本地快照 UUID，分别为 `local-response-receipt-not-provider-crawl-time` 和 `local-snapshot-id-not-provider-task`。
- 原始请求：`q=AI Video Expander, gl=us, hl=en, num=10, page=1`。

```serp-context
{"keyword":"AI Video Expander","location_code":2840,"language_code":"en","device":"unspecified","os":"unspecified","task_id":"local-0c0ffd7a-81b4-4d75-8113-2be3c9a32a7c","observed_at":"2026-11-24T03:09:34.900923+00:00"}
```

## 2. SERP 搜索意图总结

主意图为对现有视频扩框，生成原画幅周围的内容以适配新比例。强相邻意图为在时间轴上继续生成；混合意图页面会同时写两者。现有附件中的两类任务有对应的排名信号，优先做跨平台复用和保留构图所需的空间扩展。该顺序基于本次查询和需求任务，不推断流量占比。

## 3. 观察到的结果

本次第一页返回 10 条自然结果，单一 SERP 快照。第 1–4 条标题或摘要对应扩框，第 5 条混合，第 6–8 和 10 条聚焦时间续写，第 9 条是补边问题。下表保留实际打开的 H1 与用途观察。PAA 问及 AI 能否扩视频、免费 extender、ChatGPT 放大和免费比例扩展。相关搜索含 AI video outpainting、AI expand video online free 及时间续写、具名工具。热度、难度和搜索量均 unavailable。

## 4. 官方能力证据

| 能力 | 第一方来源 | 可观察证据 | 证据状态 | 产品状态 | 用户价值 / 限制 |
| --- | --- | --- | --- | --- | --- |
| Ray 3.2 视频扩框 | https://docs.agents.lumalabs.ai/guides/videos/reframing/ | 单段素材，目标画幅支持 9:16、3:4、1:1、4:3、16:9、21:9；新区域提示词 1–6,000 字符；支持明确原片矩形 | official-live | 已发布 API | 适配横竖和方形；可以显式保持原片完整位于目标画幅内 |
| Ray 3.2 画质和输入 | https://docs.agents.lumalabs.ai/guides/videos/reframing/ | 源片最多 10 秒；竖画幅最多 720p；横版和方形可至 1080p；输出档位 5 或 10 秒，输出 MP4 | official-live | 已发布 API | 画质与目标比例关联；输入和输出时长为不同字段，不声称任意长度 |
| PixVerse Video Expand | https://docs.platform.pixverse.ai/video-expand-45751712e0 | MP4、MOV、WebM，源片上限 30 秒和 50 MB，720p 或 1080p，公开示例采用 16:9 | official-live | 已发布 API | 较长源片备选；公开正文未明确提供等效的原片位置和提示词操作 |
| PixVerse V6 时间续写 | https://docs.platform.pixverse.ai/video-extend-43051216e0 | 1–15 秒新增片段；输入上限 30 秒、50 MB，总时长上限 40 秒 | official-live | 已发布 API | 能延续动作；不解决目标画幅的空间填充 |

## 5. Top 10 Hero 文案综合

| 自然排名 | URL | 页码 | 页面类型 | 观察到的 H1 或标题 | 辅助文案方式 | 价值重点 | 是否为可比落地页 | 限制 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | https://videoexpander.ai/ | 1 | 独立工具 | AI Video Expander | 在上传区前说明补边与比例 | 裁切替代和黑边处理 | 是 | 页面正文可读，操作未测试 |
| 2 | https://magichour.ai/products/ai-video-expander | 1 | 工具页 | Free AI Video Expander | 短副标题解释比例和裁切 | 帧扩展与跨格式工作流 | 是 | 页面正文可读，操作未测试 |
| 3 | https://wink.ai/video-expander | 1 | 工具页 | Expand Video to Any Aspect Ratio with AI | 以平台比例不同的问题切入 | 横竖转制 | 是 | 页面正文可读，操作未测试 |
| 4 | https://www.veed.io/tools/ai-background-expand | 1 | 编辑器落地页 | AI Background Expand | 先说明背景扩展再进入上传 | 补齐周围背景 | 是 | 页面正文可读，操作未测试 |
| 5 | https://www.vidpexai.com/ai-video-extender | 1 | 工具落地页 | AI Video Extender — Extend Video Length Free | 长段解释时间延长、扩画和改比例 | 首先强调加长 | 是，混合意图 | 页面正文可读，操作未测试 |
| 6 | https://app.pixverse.ai/mini-apps/video-expand | 1 | 工具子页 | AI Video Extender - Lengthening Clips And Extending | 叙述镜头提前结束的处境 | 延续现有动作 | 否，时间任务 | 页面正文可读，操作未测试 |
| 7 | https://pexo.ai/tools/ai-video-extender | 1 | 工具页 | AI Video Extender | 说明从现有片尾继续生成 | 基于片尾加新镜头 | 否，时间任务 | 页面正文可读，操作未测试 |
| 8 | https://kaze.ai/ai-video-extender | 1 | 工具页 | AI Video Extender | 描述现有生成片段如何做长 | 增加素材时长 | 否，时间任务 | 页面正文可读，操作未测试 |
| 9 | https://www.reddit.com/r/videography/comments/1in96rl/expanding_video_borders_with_ai/ | 1 | 论坛 | Expanding Video Borders with AI? | 原帖描述拉远取景后出现黑边 | 扩框填补黑边 | 否，讨论 | 页面正文可读，操作未测试 |
| 10 | https://melies.co/ai-video-extender | 1 | 工具页 | AI Video Extender | 介绍从片段结束后继续拍 | 片尾续写 | 否，时间任务 | 页面正文可读，操作未测试 |

**Serper 快照观察**　前四条的标题或摘要共同指向生成原框之外的像素与改比例。时间续写有独立的任务词和多个结果。免费相关问句只体现疑问存在。

**可读页面观察**　独立工具与 Magic Hour 直接呈现上传，Wink、VEED 用 CTA 引入。时间续写工具的标题经常用 Extender，正文以片尾、延长或继续动作开篇。

**本站判断**　横竖比例、完整原画布和生成区是用户可以直接看见的区别。以素材复用为主，提示词用来指引新区域；时长续写只作为范围区分。

## 6. 跨结果模式与缺口

需要将成品比例与源素材限制在上传前交代。原有画面之外属于生成内容，不能许诺恢复真实的历史细节。以可确认的比例和输入条件说明范围，不照搬竞品免费、速度、报价和效果主张。

## 7. 关键词与页面影响

`/` 承接 AI Video Expander、AI video outpainting 和已有素材改画幅；`/guide` 承接 How to Use AI Video Expander；`/pricing` 承接 AI Video Expander Pricing。后两项使用各自的查询继续验证。时间续写、超分辨率和具名竞品导航查询不作为首发目标。

## 8. 证据限制

单市场、单时间快照，未做额外设备排名对照或需求测量。公开页面可读性和营销声明不证明效果。未运行候选模型，不推导本站免费额度、价格结算或模型可用承诺。

## 9. 来源日志

| 来源 | 来源类型 | 观察时间 | 用途 | 备注 |
| --- | --- | --- | --- | --- |
| Serper Google Search 首次快照 | 搜索 API | 2026-11-24T03:09:34.900923+00:00 | 排名、PAA、相关搜索 | 美国英语，设备未指定 |
| 第 5 节各结果 | 公开网页 | 2026-11-24 | 检查标题、首屏和任务 | 无提交或业务测试 |
| 第 4 节模型文档 | 第一方资料 | 2026-11-24 | 参数、流程和适用范围 | 仅用于确定目标范围 |
