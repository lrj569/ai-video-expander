# Astro Islands 模板架构约定

本文记录 `nest-template-astro` 的可复用实现边界。它是项目内的维护契约，不替代真实登录、支付和生产环境验收。

路由、索引、sitemap、`llms.txt`、LCP 和页面接入的总规范见 `docs/astro-project-development-standard.md`。

## 页面边界

| 页面或区域 | 渲染方式 | 客户端职责 |
|---|---|---|
| Header Logo 与桌面导航 | Astro 静态 HTML | 无 |
| Header 账户、积分与移动菜单 | `client:load` + `transition:persist` | 唯一账户驱动、登录、积分、移动菜单 |
| 首页 Hero、Footer | 静态 HTML | 无 |
| 首页与 Pricing 套餐区 | 独立 `client:load` 岛 | 登录判断与发起购买 |
| Pricing FAQ | `client:idle` | 展开/收起 |
| Profile | SSR 外壳 + `client:load` | 私有数据与账户操作 |
| Blog、法律页、分享页正文 | 服务端 HTML | 仅给追踪或目录等局部能力水合 |

公开页面不能为了 Footer、正文、SEO 内容或桌面导航而挂整页 `client:load`。新增交互时优先创建叶子岛；静态内容继续由 Astro 或服务端 React 输出。

## 账户与积分所有权

- `src/components/HeaderControls.tsx` 是全项目唯一使用 `driveUserState` 的入口。
- `lib/providers/UserProvider.tsx` 只负责 Clerk 到业务后端的会话同步、可见性/焦点监听和兜底轮询。
- `lib/providers/user-store.ts` 是跨 React root 的账户快照所有者。
- 页面岛只调用 `useUserInfo()`，不得再挂第二个 `UserProvider`。
- Profile 的作品、账单、积分流水属于页面私有数据；账户摘要来自全局 store。

`user-store.ts` 必须持续满足：

- `useSyncExternalStore` 的 SSR 快照稳定；
- 相同用户只有一个进行中的用户信息请求；
- 强制刷新绕过新鲜度，但不绕过并发去重；
- 缓存键包含 Clerk user ID；
- 切换账号时旧响应不能覆盖新账号；
- 请求失败保留仍可信的旧积分；
- 登出清理业务 token、内存快照和当前用户 session 缓存。

## 刷新策略

- 登录同步成功后立即强制刷新账户摘要。
- 生成成功后调用 `refreshUserInfo()`，不要等待轮询。
- 支付回跳页会主动刷新；但页面参数和本地 `paymentInfo` 不是支付成功证据，生产项目仍应接入后端订单确认。
- 兜底轮询周期为 60 秒，页面不可见时不发请求。
- 页面重新可见或窗口重新聚焦时，只有数据已过期才刷新。

## 缓存与隐私

- `/profile` 与 `/sso-callback` 必须返回 `Cache-Control: private, no-store`。
- 公开页面保持预渲染或可公开缓存，不因 Header 登录按钮改成整页动态渲染。
- 账户 session 缓存只用于减少切页空白，后端响应仍是最终事实。
- 不得把 Clerk secret、业务 token、账户对象或支付凭据写入公开 HTML、URL、日志或静态资源。

## 新页面接入

1. 先决定页面是公开内容、混合页还是私有账户页。
2. 公开正文和 SEO 内容写入 `.astro` 或服务端组件。
3. 只有需要事件、浏览器 API 或实时状态的叶子组件使用客户端指令。
4. 需要账户摘要时直接调用 `useUserInfo()`；不要新增 Provider 或直接请求 `api.user.getUserInfo()`。
5. 私有页面设置 `prerender = false` 和 `private, no-store`。
6. 生成、购买、兑换确认后主动刷新账户摘要。
7. 运行 `npm run check`、`npm run verify:islands`、`npm run build` 和 `npm run verify:routes`。

## 验收分层

- `npm run check`：类型与 Astro 源码层。
- `npm run verify:islands`：模板架构守卫，不证明真实网络行为。
- `npm run build` + `npm run verify:routes`：构建产物与路由层。
- 本地浏览器：未登录骨架、菜单、响应式和请求次数。
- 真实账号：登录同步、跨页积分一致、账号切换和登出清理。
- 生产环境：Clerk 域、API、支付确认、缓存响应头、性能与 CDN 行为。

构建成功不能替代真实账号、真实支付或生产验证。
