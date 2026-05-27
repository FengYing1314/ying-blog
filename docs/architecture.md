# 项目架构

本项目是一个 Vite+、Vue、TypeScript、vite-ssg 和 Markdown 构建的纯静态双语站点，不是 VitePress 项目。站点用于长期维护个人博客、文档和项目展示，当前主分支保留可复用的项目站基线与 seed/template 内容。

## 运行时边界

- `src/main.ts` 使用 `ViteSSG` 创建应用，并通过 `includedRoutes()` 输出需要静态生成的路由。
- `src/router/routes.ts` 从内容注册表生成内容页和 taxonomy 页路由，同时显式声明首页、列表页、项目页、根路径重定向和 404。
- `src/layouts/SiteShell.vue` 提供站点框架，页面组件位于 `src/pages/`，可复用组件位于 `src/components/`。
- `src/styles/` 使用 CSS variables 和普通 CSS 管理基础样式、布局、Markdown、动效、滚动条和主题。

## 内容注册表

内容注册表是站点的中心数据源。`scripts/content/generate-content.ts` 会读取 `src/content/` 和 `src/config/`，生成 `src/generated/content.ts`。

生成后的注册表供以下能力使用：

- Vue Router 静态路由。
- 首页、列表页、内容页、项目页和 taxonomy 页数据。
- 语言对应页路径。
- 页面 SEO、canonical URL、Open Graph 和 JSON-LD。
- RSS、sitemap 和 robots 输出。
- 内容测试与静态输出验证。

`src/generated/content.ts` 是生成文件，不手动编辑。Vite 配置加载时会先生成内容注册表，并在开发服务器中监听 `src/content/**/*.md` 和 `src/config/**/*.ts`，相关文件变化后自动重新生成内容注册表。

## 配置入口

- `src/config/site.ts`：站点名称、描述、作者、默认语言、URL、base path、搜索引擎验证值和 UI 文案。
- `src/config/profile.ts`：首页/profile 数据与社交链接。
- `src/config/projects.ts`：配置驱动的项目卡片。
- `src/config/taxonomy.ts`：集中维护的分类和标签词表。

Projects 当前只生成本地化项目索引和项目卡片，不生成项目详情页。

## Markdown 渲染

Markdown 在构建期渲染为 HTML，并在客户端做少量渐进增强。

- 普通 Markdown、表格、链接和标题由 `markdown-it` 处理。
- `h2` 与 `h3` 会生成目录数据。
- 代码块使用 Shiki 高亮，并在客户端提供复制按钮。
- `mermaid` fence 会输出图表容器，客户端按当前主题渲染 Mermaid，并提供复制源码、缩放、适应宽度、重置和放大查看。
- Tabs 在客户端增强为可访问的 tablist。

Markdown 文件不允许任意 HTML 或任意 Vue 组件标签。允许的内容 affordance 见 `docs/content-workflow.md`。

## 静态输出

生产构建必须使用 `npm run build`。该命令会：

- 执行 `vite-ssg build`。
- 生成 `sitemap.xml`、`rss.xml`、`robots.txt`。
- 复制静态 `404.html`。
- 运行 `scripts/verify-static-output.ts` 验证代表性 HTML metadata、base-aware 链接、RSS、sitemap、robots 和 404 输出。

Sitemap 覆盖列表页、内容页和 taxonomy 页。RSS 是单一双语 feed，条目来自 Posts、Docs 和两个本地化 Projects 索引，不包含 About 或单个 Project。

`SITE_URL` 和 `BASE_PATH` 会影响资源路径、canonical URL、RSS、sitemap 和 robots 输出。`GOOGLE_SITE_VERIFICATION` 和 `BING_SITE_VERIFICATION` 会输出搜索引擎站点验证 meta。GitHub Pages workflow 在 `main` 分支上使用 `SITE_URL=https://yingblog.fengying.xin` 和 `BASE_PATH=/` 发布到自定义域名。
