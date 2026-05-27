# Ying Blog

Ying Blog 是一个长期维护的双语项目站、文档与项目展示基线。当前仓库已经具备 Vite+、Vue、TypeScript、SSG、Markdown 内容、双语路由和纯静态输出的应用基础。

## 已实现状态

- 已配置 Vite、Vue、TypeScript 和 vite-ssg。
- 已实现 `/zh/` 与 `/en/` 两个并列语言根。
- 已实现文章、文档、项目、关于、taxonomy、Markdown 内容页和 404 页面。
- Markdown 内容通过集中内容注册表生成，并校验 frontmatter、taxonomy、双语配对和已批准的 Markdown affordance。
- 静态构建会输出 sitemap、RSS、robots 和 404 页面。
- 最终站点支持纯静态部署。

## 文档

项目文档集中在 `docs/`，只记录已经实现的能力和必须遵守的规则：

- `docs/architecture.md`：当前 Vite+ 静态站点架构、内容注册表、渲染和静态输出。
- `docs/content-workflow.md`：Markdown 内容目录、frontmatter、双语配对和验证工作流。
- `docs/implemented-features.md`：当前已经实现的站点功能和工程能力。
- `docs/rules.md`：分支、内容、技术、样式、开源和验证规则。

未实现能力不写入仓库公开文档。

Agent 和项目协作规则保留在：

- `AGENTS.md`

## 分支边界

- `main` 是项目站分支，用于项目文章、项目文档、开发规则和共享代码。
- `fy-blog` 是个人站内容分支，用于个人 profile、个人 about、个人 taxonomy 和个人文章内容。
- 个人内容不直接进入 `main`。
- 两个分支都必须保持 Vite+、Vue、TypeScript、SSG、Markdown、双语路由和纯静态部署约束。

## 本地运行

使用 `.node-version` 中声明的 Node 版本。当前 package metadata 要求 Node `>=24` 和 npm `11.15.0`。

```bash
npm ci
npm run dev
npm run ci
```

常用脚本：

```bash
npm run content:generate
npm run check
npm run test
npm run build
npm run preview
```

`npm run build` 是生产静态站构建命令，会运行 `vite-ssg build`，生成 `sitemap.xml`、`rss.xml`、`robots.txt` 和 `404.html`，随后验证静态输出。不要用原始 `vp build` 或 `vite build` 替代该项目脚本。

`npm run content:generate` 会写入 `src/generated/content.ts`；不要手动编辑生成文件。`npm run ci` 是完整本地门禁：check、test、build。

## 配置入口

- Markdown 内容：`src/content/`
- 站点级文案、URL、语言默认值和验证配置：`src/config/site.ts`
- 首页/profile 数据与社交链接：`src/config/profile.ts`
- 项目卡片：`src/config/projects.ts`
- 分类和标签词表：`src/config/taxonomy.ts`

部署相关环境变量见 `.env.example`。`SITE_URL` 和 `BASE_PATH` 会同时影响 Vite 资源路径、canonical URL、RSS、sitemap 和 robots 输出；`GOOGLE_SITE_VERIFICATION` 和 `BING_SITE_VERIFICATION` 用于输出搜索引擎站点验证 meta。

`main` 分支通过 GitHub Pages 发布到 `https://yingblog.fengying.xin/`，对应 `SITE_URL=https://yingblog.fengying.xin` 和 `BASE_PATH=/`。

## 内容维护

Markdown 内容位于 `src/content/{zh,en}/{posts,docs,about}/`。中文和英文内容必须成对维护，路径、slug、date、updated、featured、order、section、categories 和 tags 保持一致。

内容注册表由 `scripts/content/generate-content.ts` 生成，开发服务器会监听内容和配置变化并自动刷新注册表。Markdown 当前支持 Callout、Tabs、CardGrid、StepList、Badge、代码块和 Mermaid 图表，不允许任意 Vue 组件标签或未批准 directive。RSS 是单一双语 feed，包含 Posts、Docs 和两个本地化 Projects 索引，不包含 About 或单个 Project。

## 维护

做结构性决策前，先阅读 `AGENTS.md` 和 `docs/`。其中记录的决策是项目约束，不应在每次任务中重新讨论。
