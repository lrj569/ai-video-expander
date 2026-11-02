# Astro 项目开发技术规范

本文是 `nest-template-astro` 的工程约束。它只定义渲染、交互、索引、性能和验证边界，不定义页面文案、文章章节、搜索意图、Schema 内容或营销结论。

SSR 数据所有权、客户端水合等级、缓存和首屏性能的详细规则见 `docs/astro-ssr-performance-standard.md`。两份规范同时生效；本文负责路由与 SEO 总边界，专项规范负责加载位置与性能实现。

具体页面的文案、模块顺序、关键词、事实与结构化数据，必须来自该页面单独提供的 SEO 开发文档。没有对应业务需求时，不得预建 Guide、How-to、What-is、Review、Compare 或其他假设页面。

## 1. 页面与内容边界

- 可索引页面的标题、首屏正文和主要内部链接必须存在于 Astro/服务端输出的 HTML 中。
- React 只承担需要状态、事件或浏览器 API 的叶子交互，例如生成器、上传、认证、积分、购买和弹窗。
- 制作模块必须是独立 Island。普通页面内容修改不得进入生成器逻辑，生成器状态也不得决定 SEO 正文是否输出。
- 新页面先创建真实路由，再在 `src/config/page-policies.json` 登记技术策略。禁止为“可能以后会有”的页面预留公开路由。
- 页面文案变更不要求迁移到统一内容模型；通过 `contentWatch` 监控现有页面与正文组件即可。

## 2. PagePolicy

每个 `src/pages` 路由必须登记：

- 路径和路由源文件；
- 页面类别；
- `prerender`、SSR 或 endpoint；
- `index/follow`；
- sitemap 来源；
- 是否列入 `llms.txt`；
- 影响该页面公开内容的文件和配置字段；
- 明确排除的样式、测试、类型和制作模块文件。

默认技术策略：

| 页面类别 | Robots | Sitemap | llms.txt |
| --- | --- | --- | --- |
| 已批准的公共页面 | `index,follow` | 是 | 是 |
| Profile、Legal、支付状态 | `noindex,follow` | 否 | 否 |
| SSO、404、分享状态 | `noindex,nofollow` | 否 | 否 |
| API、后台、系统 endpoint | 不作为内容页 | 否 | 否 |

`noindex` 页面不能同时被 `robots.txt` 阻止，否则搜索引擎无法读取 noindex。认证与 `private, no-store` 承担隐私保护，不使用 robots 作为访问控制。

## 3. Astro 与 Islands

- 公共页面优先预渲染；依赖 CMS、请求参数、账户或状态的页面使用 SSR。
- Header 账户区可以 `client:load` 并跨页面持久化；静态 Logo、导航、Footer 和正文不得因此整页水合。
- 首屏立即可操作的 Island 才使用 `client:load`；非首屏交互优先 `client:visible`，低优先级交互使用 `client:idle`。
- Profile、支付状态、SSO 和分享状态页面必须 SSR，并返回 `Cache-Control: private, no-store`。
- 新增 Island 前同时遵守 `docs/astro-islands-architecture.md` 的账户状态所有权约定。

## 4. Sitemap 与 lastmod

`src/generated/content-metadata.json` 保存可索引入口页的内容哈希和稳定更新时间。

- `npm run sync:content-metadata` 对 `contentWatch` 文件和 `configWatch` 字段计算 SHA-256。
- 指纹变化时只更新受影响路由的 UTC 时间；无变化时保留原日期。
- `predev` 与 `prebuild` 自动同步；`verify:content-metadata` 只读验证。
- CMS 文章使用 CMS `updated_time`；博客索引优先使用最新文章更新时间。
- sitemap 不输出 `priority` 或 `changefreq`，也不在请求时使用当前时间伪造更新。
- 新增可索引页面时必须登记准确的监控文件，否则 `verify:standards` 失败。

首页监控明确排除 `components/generator-common/**`、生成 API、上传/模型/积分状态、样式、测试和类型文件。只修改制作模块不会改变首页 `lastmod`；修改非制作正文、TDK、Schema 或主要链接才会改变。

## 5. llms.txt

`/llms.txt` 由 Astro endpoint 生成，数据来源为主工程桥接的 `configs/generated-public-profile.json`、`generated-pricing.json` 经 `website-config.js` 导出，以及 PagePolicy：

- `websiteConfig.publicProfile` 提供经过确认的名称、用途、能力和公开页面；`project` 保留工程兼容字段；
- 公开内容与开发/发布阶段分开：身份信息可输出，有本地或实际来源证据的真实公开页面与能力可列入；未配置阶段不输出占位或“待验证”状态说明，不把本地证据写成已上线证明。资料与收录规则以主工程 `docs/workflows/llms-public-content.md` 为权威；
- PagePolicy 只提供真实存在且允许索引的公开链接；
- Legal、Profile、支付、SSO、分享状态、API 和不存在的页面不得列入；
- 克隆模板后必须用经过确认的产品事实替换项目说明，不得由模板推断产品能力；
- 不再维护 `public/llms.txt` 第二份清单。

## 6. LCP 与样式加载

- 不加载阻塞首屏的远程字体；使用系统字体或由 Astro 管理的自托管字体。各项目自行选字体，通过 `src/styles/project-fonts.ts` 的模块导入接入一次；该入口不预设统一字体。
- `build.inlineStylesheets: 'auto'` 只内联小型关键样式，共享 CSS 保持可缓存。
- 单个客户端 JavaScript chunk 的未压缩体积不得超过 500 KiB；`npm run verify:chunks` 在生产构建后执行硬性校验，禁止通过调高 Vite 告警阈值规避。
- PDF、媒体处理等重型浏览器依赖必须在实际操作触发时动态加载，并优先直接引用所需底层模块，避免打包未使用的兼容封装。
- 每页只确定一个 LCP 候选。首屏主图必须有尺寸、响应式资源、`fetchpriority="high"`，且不能 lazy-load。
- Logo、图标、非首屏媒体和非关键字体不得高优先级预载。
- 首屏以下重型区域可以使用 `.below-fold-content` 的 `content-visibility`，不得用于首屏核心内容。
- 动画只使用 transform/opacity，不能延迟标题或主要正文出现。
- 生产目标为 p75：LCP 不高于 2.5 秒、INP 不高于 200 毫秒、CLS 不高于 0.1。构建和本地 Lighthouse 不等于线上 CWV 证据。

## 7. 新页面接入流程

1. 根据真实需求创建 Astro 路由，不预建假设页面。
2. 按单独 SEO 开发文档实现内容；本规范不补充或改写其文案。
3. 在 PagePolicy 登记渲染、robots、sitemap、llms 和监控范围。
4. 确保公共正文服务端可见，只水合交互叶子。
5. 运行 `npm run sync:content-metadata`。
6. 依次运行 `npm run check`、`npm run verify:islands`、`npm run build`、`npm run verify:routes`；最后一项同时检查客户端 chunk 预算。

## 8. 验收边界

- 首页价格模块必须使用锁定 H2、描述和共享 PricingSection，紧邻首页 FAQ 之前；当前模板没有首页 FAQ，项目实施时按其 SEO 文档补齐，不得自行预建。
- 公共价格来自主工程，不在模板手改。购买请求把套餐 code（模板 priceId/key）作为 price_id 发到 /api/pay/anyway，由后端查询商品记录；积分记录读取数值 credits，不解析按钮字符串。价格区购买交互、禁用条件和接口连通性不作开发门禁；购买按钮不使用 disabled，保留原登录、请求和错误处理，进行中在请求层避免重复提交。支付配置和真实交易在部署阶段处理；合同细则以主工程 `docs/workflows/pricing-template-contract.md` 为权威。
- 可见 Pricing FAQ 与 FAQPage schema 共用 lib/pricing-faq.ts，禁止维护第二份回答或保留旧订阅、分辨率、支付卡种承诺。

- `check` 与规范脚本证明源码、类型和静态契约。
- `build` 与 `verify:routes` 证明构建产物和本地路由契约。
- 真实认证、账户数据、生成、支付、CMS、Vercel、线上 CWV、收录和排名必须在相应环境单独验证。
- 不得把本地通过描述为生产、支付、索引或排名已经通过。
