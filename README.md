# Astro SaaS Template

从 `nest-template` 复制并迁移到 Astro 7 的 SaaS 模板。迁移保留原有深色视觉、React 交互组件、Clerk 登录、用户积分、支付回跳、CMS 博客、分享页和 SEO 配置。

## 技术栈

本模板现承接主工程共享价格桥接：主工程生成 configs/generated-pricing.json、generated-site.json、generated-public-profile.json，website-config.js 统一导出；不要在目标项目手动改套餐。oneTimePlans.priceId 为 product_id，支付路径为 /api/pay/anyway，JSON 参数与认证保持原样。模板未配置 API 时禁用购买按钮。

首页复用 PricingSection，可传锁定 heading/description；项目有首页 FAQ 时价格区必须紧邻其上方。/pricing 的五项 FAQ 与 schema 使用同一来源。/llms.txt 是 Astro endpoint，不维护 public/llms.txt；只有 verified-public 才输出确认过的公开说明，PagePolicy 过滤不存在/不可索引页面。

迁移验收命令增加 node scripts/check-pricing-contract.cjs。构建与路由通过不代表真实认证、支付、部署验证。

- Astro 7，`output: 'server'`
- React 19 islands
- TypeScript
- Tailwind CSS 4
- Clerk Astro
- Vercel adapter

## 开发命令

```bash
npm install
npm run dev
npm run check
npm run sync:content-metadata
npm run verify:standards
npm run verify:islands
npm run build
npm run preview
npm run verify:routes
```

`npm run check` 执行 Astro、TypeScript 和项目技术规范校验。`predev`、`prebuild` 会自动同步稳定的 sitemap 内容指纹。`npm run build` 产出 Vercel SSR 部署结构。开发服务器端口默认是 3000；若被占用，以 Astro 实际打印的地址为准。

## 目录

```text
src/
  components/
    page-views/       从 Next 页面迁移出的 React 视图
    AppProviders.tsx  Toast 与认证弹窗的局部 Provider 边界
    SiteHeader.astro  静态 Logo 与桌面导航
    HeaderControls.tsx 唯一持久化账户/积分岛和移动菜单
  compat/             Next Link/Image/Navigation/Dynamic 的过渡兼容层
  entries/            需要水合的页面入口
  layouts/            Astro HTML、SEO 与公共导航布局
  pages/              Astro 文件路由与服务端端点
  styles/             全局 Tailwind 样式
components/           原有共享 React 组件
lib/                  API、CMS、状态与业务工具
public/               静态资源
website-config.js     站点、API、价格、TDK 与 sitemap 的配置源
src/config/page-policies.json 真实路由的渲染、索引、sitemap 与 llms.txt 策略
```

旧 `app/` Next App Router 源文件、`next.config.ts`、`next-env.d.ts` 和 Next 依赖已移除。

## 渲染边界

- 预渲染：`/`、`/pricing`、`/terms`、`/privacy`、`/refund`、`/404`。
- SSR：`/profile`、支付状态、`/sso-callback`、`/blog`、`/blog/[slug]`、`/share/[id]`。
- Endpoint：`/robots.txt`、`/sitemap.xml`、`/llms.txt`。
- React islands：账户控件、首页/价格交互、profile、支付成功与 SSO 回调；Logo、桌面导航、Hero、Footer 和公开正文保持服务端 HTML。
- 公共标题、description、canonical、robots、Open Graph 和 Twitter 标签由 `src/layouts/BaseLayout.astro` 输出到原始 HTML。

## Islands 与账户状态

- `HeaderControls.tsx` 是唯一账户驱动，使用 `client:load` 和 `transition:persist`。
- `lib/providers/user-store.ts` 通过 `useSyncExternalStore` 向独立 React roots 发布同一份账户/积分快照。
- 用户信息请求具备并发 Promise 去重、60 秒新鲜度、用户 ID 隔离和迟到响应隔离。
- 页面隐藏时停止兜底刷新；重新可见或聚焦时仅在数据过期后刷新。
- Profile 复用全局账户摘要，只单独请求作品、账单等页面私有数据。
- `/profile`、支付状态、`/sso-callback` 和分享状态返回 `Cache-Control: private, no-store`。

新增页面前先阅读 `docs/astro-project-development-standard.md`；新增交互岛还需阅读 `docs/astro-islands-architecture.md`。

## 配置

先修改 `website-config.js`：

- `canonical.url`
- `api.baseUrl` 与 `api.appId`
- `contact.supportEmail`
- `project`
- `pageTdk`
- `pricing.oneTimePlans`

`astro.config.mjs` 的 `site` 自动读取 canonical 域名。真实页面还必须登记到 `src/config/page-policies.json`，不要维护第二份 sitemap 或 `llms.txt` 页面清单。

环境变量沿用旧项目的 Clerk 配置。迁移层会把 `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` 映射到 Astro 使用的 `PUBLIC_CLERK_PUBLISHABLE_KEY`；新项目建议直接配置 `PUBLIC_CLERK_PUBLISHABLE_KEY`，服务端密钥不要使用 `PUBLIC_` 前缀。

## 部署

`vercel.json` 已将 Framework 和构建命令切换为 Astro。Vercel 项目还需要确认：

- Node 版本满足 `>=22.12.0`
- Build Command 为 `npm run build`
- Framework Preset 为 Astro
- Clerk、API 与支付相关环境变量完整
- 深层 URL 可直接打开和刷新

## 验收边界

本地类型检查和生产构建只证明源代码与构建层通过。真实 Clerk 账号、积分刷新、生成请求、支付回跳、CMS 线上数据、Vercel 预览部署和性能 A/B 需要在有凭据及部署地址的环境中另行验证。详见 `docs/astro-migration-record.md`。
