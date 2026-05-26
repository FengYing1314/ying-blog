---
locale: zh
slug: guide/getting-started
title: 项目开发基线
description: Ying Blog 当前已经落地的技术基线、目录职责和本地开发入口。
date: 2026-05-23
categories:
  - engineering
tags:
  - vue
  - typescript
  - ssg
  - content-system
featured: true
order: 1
section: guide
---

# 项目开发基线

Ying Blog 当前是一个 Vite+、Vue、TypeScript、vite-ssg 和 Markdown 组成的纯静态内容站。仓库的主线目标不是搭建通用平台，而是维护一个可公开、可复用、可验证的项目站基础。

## 项目定位

`main` 分支服务项目站，内容应围绕 Ying Blog 本身：

- 项目实现记录。
- 开发规则和维护说明。
- 静态站、内容系统和双语维护经验。
- 可作为公开仓库基线的示例内容。

个人站内容放在 `fy-blog` 分支维护，不直接进入 `main`。

## 技术基线

:::: card-grid
::: card Vite+
使用 Vite+ 脚本组织开发、检查、测试、构建和预览。
:::

::: card Vue + TypeScript
页面、组件、路由和内容类型都使用 Vue 与 TypeScript 实现。
:::

::: card vite-ssg
生产构建通过 SSG 输出静态 HTML，并保留客户端增强能力。
:::

::: card Markdown
Posts、Docs 和 About 使用 Markdown 作为内容来源。
:::
::::

## 目录职责

| 目录              | 职责                                       |
| ----------------- | ------------------------------------------ |
| `src/content/`    | 站内 Posts、Docs 和 About 的 Markdown 内容 |
| `src/config/`     | 站点、profile、taxonomy 和项目卡片配置     |
| `src/components/` | 导航、卡片、目录、内容渲染等可复用组件     |
| `src/pages/`      | 首页、列表页、详情页、taxonomy 和 404 页面 |
| `src/lib/`        | 路径、SEO、内容查询和 URL 工具             |
| `scripts/`        | 内容生成、静态资源生成和静态输出验证       |
| `docs/`           | 仓库公开维护文档，只记录已实现能力和规则   |

## 本地开发入口

```bash
npm run dev
npm run content:generate
npm run check
npm run test
npm run build
npm run ci
npm run preview
```

`npm run content:generate` 会生成 `src/generated/content.ts`。这个文件由脚本维护，不手动编辑。

`npm run ci` 是完整本地门禁，会依次运行格式与类型检查、测试和静态构建验证。

## 已实现输出

构建后会生成：

- `/zh/` 与 `/en/` 双语路由。
- 首页、文章、文档、项目、关于、taxonomy 和 404 页面。
- 每个 Markdown 内容页的静态 HTML。
- `sitemap.xml`、`rss.xml`、`robots.txt` 和 `404.html`。

::: callout note
这个站点必须保持纯静态部署能力。没有明确项目决策时，不引入 CMS、评论、分析、搜索、草稿、生成社交图或项目详情页。
:::
