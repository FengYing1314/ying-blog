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
- 内容生成会校验 frontmatter、双语配对、taxonomy slug 和 Markdown affordance。
- `src/generated/content.ts` 是生成文件，不需要手动维护。

## 页面与导航

- 已实现首页、文章列表、文档列表、项目索引、关于页、内容详情页、taxonomy 页面和 404 页面。
- 已实现顶部导航、语言切换、主题切换、移动导航、文章目录、上一篇/下一篇链接。
- 已实现代码高亮和代码复制按钮。
- 已实现暗色模式。

## Markdown Affordance

构建期 Markdown renderer 当前支持：

- Callout。
- Tabs。
- CardGrid。
- StepList。
- Badge。

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
