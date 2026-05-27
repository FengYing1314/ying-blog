# 已实现功能

## 站点基础

- 使用 Vite+ 作为工具链方向。
- 使用 Vue 和 TypeScript 构建前端。
- 使用 vite-ssg 生成纯静态页面。
- 支持 `/zh/` 与 `/en/` 两个并列语言根。
- 支持静态部署到 Cloudflare Pages、Vercel、Netlify、GitHub Pages 或其他静态托管平台。

## 内容系统

- Markdown 内容来源位于 `src/content/`。
- 已实现 `posts`、`docs` 和 `about` 三类 Markdown 内容入口。
- Projects 以 `src/config/projects.ts` 中的配置驱动卡片展示。
- 集中内容注册表会生成路由、首页聚合、taxonomy 数据、SEO 数据、RSS 数据和 sitemap 数据。
- 内容生成会校验 frontmatter、路径 slug、双语配对、taxonomy slug、Markdown affordance 和标题层级。
- `src/generated/content.ts` 是生成文件，不需要手动维护。
- 开发服务器会监听 `src/content/**/*.md` 和 `src/config/**/*.ts`，相关变更后自动重新生成内容注册表。

## 页面与导航

- 已实现首页、文章列表、文档列表、项目索引、关于页、内容详情页、taxonomy 页面和 404 页面。
- 已实现顶部导航、语言切换、主题切换、移动导航、文章目录、上一篇/下一篇链接。
- 已实现代码高亮和代码复制按钮。
- 已实现 Mermaid 图表渲染、源码复制、缩放、适应宽度、重置和放大查看。
- 已实现暗色模式。

## Markdown Affordance

构建期 Markdown renderer 当前支持：

- Callout。
- Tabs。
- CardGrid。
- StepList。
- Badge。
- Mermaid fenced code block。

Markdown 使用 directive 语法，不使用 Vue 组件标签。

## 静态输出

`npm run build` 会执行：

- `vite-ssg build`。
- 生成 `sitemap.xml`。
- 生成 `rss.xml`。
- 生成 `robots.txt`。
- 生成 `404.html`。
- 运行静态输出验证脚本。

静态验证器会检查代表性 HTML metadata、404 输出、favicon 路径、base-aware 链接、sitemap 条目、RSS item、项目索引 feed 规则和 robots sitemap URL。

RSS 是单一双语 feed，包含 Posts、Docs 和两个本地化 Projects 索引，不包含 About 或单个 Project。

## 部署与环境

- `.env.example` 记录 `SITE_URL`、`BASE_PATH`、`GOOGLE_SITE_VERIFICATION` 和 `BING_SITE_VERIFICATION`。
- `SITE_URL` 和 `BASE_PATH` 同时影响 Vite 资源路径、canonical URL、RSS、sitemap 和 robots 输出。
- `GOOGLE_SITE_VERIFICATION` 和 `BING_SITE_VERIFICATION` 可输出搜索引擎站点验证 meta。
- `main` 分支已有 GitHub Pages workflow，会构建 `dist` 并发布到 `https://yingblog.fengying.xin/`。
- `public/CNAME` 已配置自定义域名 `yingblog.fengying.xin`。

## 仓库协作文件

仓库已经包含：

- GitHub Actions CI。
- Issue templates。
- Pull request template。
- Dependabot 配置。
- 贡献指南。
- 安全政策。
- 行为准则。
- 支持说明。
