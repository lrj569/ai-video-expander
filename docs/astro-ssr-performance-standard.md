# Astro SSR、Islands 与首屏性能开发规范

本文定义 `nest-template-astro` 的渲染所有权、数据加载位置、客户端水合等级和首屏性能门禁。它适用于新增页面、组件、接口调用、认证、支付、媒体和第三方脚本变更。

本文不定义页面文案或视觉风格。路由、SEO 与索引规则继续以 `docs/astro-project-development-standard.md` 为准；账户状态共享以 `docs/astro-islands-architecture.md` 为准。

## 1. 默认架构

默认采用 **服务端 HTML + 最小 React Islands**：

- 用户在禁用 JavaScript 时，仍应看到公共页面的标题、首屏说明、主要内容、价格信息和主要链接。
- Astro 负责路由、HTML、metadata、结构化数据、公共数据读取和缓存响应头。
- React 只负责必须依赖状态、事件或浏览器 API 的交互叶子。
- 不得因为一个按钮、弹框、菜单或轮播而水合整个页面。
- 不得在客户端重新请求服务端已经取得、且在本次页面生命周期内不会变化的数据。

## 2. 路由渲染决策

按以下顺序选择渲染方式：

1. 内容在构建时可确定，且不依赖用户、Cookie、请求头或动态参数：使用 `prerender = true`。
2. 内容依赖路径参数、实时后端数据或请求上下文，但仍应出现在原始 HTML：使用 SSR。
3. 内容依赖登录账户或包含隐私数据：使用 SSR，并返回 `Cache-Control: private, no-store`。
4. 只有交互状态依赖浏览器：页面继续预渲染或 SSR，只把该交互拆成 Island。

| 类型 | 服务端职责 | 客户端职责 | 缓存 |
| --- | --- | --- | --- |
| 公共营销、Pricing、Legal | 输出完整 HTML、metadata、JSON-LD | 必需的局部交互 | 优先预渲染 |
| 公共动态内容 | 获取并校验数据，输出可抓取正文 | 筛选、展开等交互 | 明确设置 CDN 缓存和失效策略 |
| Profile、账户、支付状态 | 校验请求边界，输出安全外壳 | 账户数据、操作和刷新 | `private, no-store` |
| SSO 回调 | 设置安全响应头和回调外壳 | Clerk 回调流程 | `private, no-store` |
| Endpoint | 生成确定性的文本、XML 或 JSON | 无 | 按数据时效显式设置 |

禁止为了使用 React 组件而把本可预渲染的公开页面改成 SSR。`output: 'server'` 只表示部署模式，不代表每个页面都应按请求渲染。

## 3. 服务端加载与客户端加载边界

### 必须在 Astro、构建期或服务端完成

- title、description、canonical、robots、Open Graph、Twitter 和 JSON-LD。
- H1、首屏核心文案、价格事实、FAQ 正文和主要内部链接。
- 使用服务端密钥、私有 token 或可信后端凭据的请求。
- 路由参数校验、404 判定、重定向和缓存响应头。
- 公共 CMS 内容的首次读取，以及与 metadata 共用的数据。
- 稳定的数据清洗、排序和聚合。

SSR 页面同一份数据只能由路由层获取一次，再通过 props 传给 metadata、静态视图或 Island。禁止 metadata、页面组件和客户端 `useEffect` 各自重复请求同一资源。

独立服务端请求没有依赖关系时使用 `Promise.all` 并行；有依赖关系、速率限制或失败语义不同时保持串行。所有外部请求必须有明确的空状态、错误状态和超时边界，不能让非关键请求无限阻塞首屏 HTML。

### 只在客户端完成

- 点击、键盘、拖拽、弹框、菜单和表单的瞬时状态。
- `window`、`document`、Clipboard、File、Canvas、MediaRecorder 等浏览器 API。
- 文件选择、上传进度、生成进度和需要实时刷新的任务状态。
- Clerk 登录弹框、账户菜单、积分实时刷新和支付发起动作。
- 进入视口后才需要的播放器、轮播、目录高亮等增强行为。

客户端不得持有服务端 secret，不得把私有 token 写进 HTML、URL、日志或 `PUBLIC_` 环境变量。SEO 正文不得等到 `useEffect` 请求结束后才出现。

## 4. Island 与水合指令

| 指令 | 允许场景 | 默认限制 |
| --- | --- | --- |
| `client:load` | 首屏立即需要的登录、生成或购买操作 | 每个首屏都要说明为何不能延后 |
| `client:visible` | 首屏以下、进入视口才交互的模块 | 非首屏组件的默认选择 |
| `client:idle` | FAQ、低优先级增强和非关键控件 | 不得承担首屏关键操作 |
| `client:media` | 只在特定断点需要的复杂交互 | 静态内容仍由服务端输出 |
| `client:only` | 默认禁止 | 仅无法 SSR 的第三方浏览器组件可例外，并记录原因和 fallback |

约束：

- 公开页面禁止把完整 Page/View 入口作为 `client:load` Island。
- 一个交互职责对应一个尽可能小的 Island；静态父容器、标题和说明留在 `.astro`。
- Header 账户区可以立即水合，但不能让 Logo、桌面导航和 Footer 一起进入 React root。
- Island props 必须可序列化，不传函数、请求对象、数据库连接或完整账户对象。
- 避免嵌套多个拥有相同状态的数据 Provider；账户摘要继续由共享 user store 统一拥有。

## 5. 首屏加载性能

### HTML 与 JavaScript

- 首屏语义内容必须随 HTML 返回，不显示等待 JavaScript 的空白骨架。
- 新依赖不得默认进入公共页面初始 bundle；编辑器、PDF、FFmpeg、图像处理等重型能力必须在用户触发后动态导入。
- 单个客户端 chunk 未压缩不得超过 500 KiB，由 `npm run verify:chunks` 强制检查。
- 修改首屏 Island 时，必须比较生产构建前后的初始客户端资源；无业务理由不得增加超过 10%。该比例是回归门禁，不是线上性能结论。
- 不得通过提高 chunk 告警阈值、合并 chunk 或隐藏报告来绕过预算。

### LCP 与媒体

- 每个页面只指定一个预期 LCP 候选。
- 首屏主图提供确定的宽高或 `aspect-ratio`，使用响应式尺寸；确认是 LCP 时才设置 `fetchpriority="high"`，且不得 lazy-load。
- 非首屏图片使用懒加载；视频默认 poster 优先、`preload="none"`，进入视口或用户操作后才加载媒体源。
- 不预加载 Logo、图标、非首屏视频或不确定会使用的资源。
- 禁止首屏自动下载多个高分辨率视频或把 base64 大资源写入 HTML/CSS。

### CSS、字体与稳定性

- 禁止阻塞首屏的远程字体；优先系统字体或 Astro 管理的自托管字体。
- 首屏元素必须预留空间；图片、视频、广告位和异步组件不得造成明显布局跳动。
- 动画仅使用 `transform` 和 `opacity`，并尊重 `prefers-reduced-motion`。
- `.below-fold-content` 的 `content-visibility` 仅用于首屏以下，不得隐藏 LCP、H1 或主要 CTA。
- 第三方脚本默认不接入；确有业务需要时记录所有者、用途、加载时机、同意机制和性能影响，并在用户同意前避免加载非必要追踪。

## 6. 请求、缓存与失败策略

- 公开预渲染页面不在请求时重复获取稳定配置。
- 可公开缓存的 SSR/endpoint 必须显式声明 `public`、`s-maxage` 与合适的 `stale-while-revalidate`；没有经过业务确认时不得自行添加长缓存。
- 私有账户、支付和 SSO 响应必须 `private, no-store`，也不得被 Service Worker 或 CDN 公共缓存。
- 同一请求内复用结果；客户端实时刷新使用进行中 Promise 去重、用户隔离和过期时间。
- 非关键模块失败不能阻止标题、正文和主要操作返回；失败状态必须可理解且不能伪装成成功。

## 7. 开发与验收流程

每次新增或修改页面时记录以下决策：

1. 路由是 prerender、SSR 还是 endpoint，理由是什么。
2. 首屏 HTML 必须包含哪些内容。
3. 哪些数据在服务端获取，哪些数据只能在客户端获取。
4. 使用了哪些 Island 指令，为什么不能更晚水合。
5. LCP 候选是什么，图片/视频如何加载。
6. 页面缓存和隐私策略是什么。
7. 构建前后首屏客户端资源是否回归。

最低验证命令：

```bash
npm run check
npm run verify:islands
npm run build
npm run verify:routes
```

对关键页面还要检查生产构建的原始 HTML：核心内容、metadata 和结构化数据必须在未执行客户端 JavaScript前存在。使用浏览器确认首屏无明显布局跳动、非首屏媒体未提前加载、交互岛按预期水合。

生产目标为 p75 LCP 不高于 2.5 秒、INP 不高于 200 毫秒、CLS 不高于 0.1。源码检查、构建和本地 Lighthouse 只能证明对应层级，不能代替 Vercel 生产环境、真实网络或 CrUX/RUM 数据。
