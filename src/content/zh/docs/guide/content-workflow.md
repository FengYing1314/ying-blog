---
locale: zh
slug: guide/content-workflow
title: 内容与分支规则
description: Ying Blog 当前项目站和个人站分支的内容边界、生成规则和验证要求。
date: 2026-05-23
categories:
  - engineering
tags:
  - content-system
  - i18n
  - ssg
  - typescript
featured: false
order: 2
section: guide
---

# 内容与分支规则

Ying Blog 使用同一套代码基础维护项目站和个人站。两个站点通过分支隔离内容，但都必须保持 Vite+、Vue、TypeScript、SSG、Markdown 和纯静态部署约束。

## 分支边界

:::: steps
::: step main
`main` 是项目站分支，用于项目文章、项目文档、开发规则和共享代码。
:::

::: step fy-blog
`fy-blog` 是个人站内容分支，用于个人 profile、个人 about、个人 taxonomy 和个人文章内容。
:::

::: step 内容隔离
个人内容不直接进入 `main`；项目站内容也不污染 `fy-blog` 的个人发布目标。
:::
::::

## 内容入口

当前 Markdown 内容入口只有三类：

| 类型  | 目录示例                | 说明                         |
| ----- | ----------------------- | ---------------------------- |
| Posts | `src/content/zh/posts/` | 项目实现记录、长文和技术笔记 |
| Docs  | `src/content/zh/docs/`  | 项目开发说明和维护规则       |
| About | `src/content/zh/about/` | 站点或作者介绍               |

Projects 当前由 `src/config/projects.ts` 配置驱动，以卡片形式展示，不生成 Markdown 详情页。

## 双语配对

`/zh/` 和 `/en/` 是并列语言根。Posts、Docs 和 About 的公开 Markdown 内容必须双语配对。

配对内容必须保持这些 frontmatter 字段一致：

- `slug`
- `date`
- `updated`
- `featured`
- `order`
- `section`
- `categories`
- `tags`

文字可以自然本地化，但结构和 metadata 不能漂移。

## 内容生成

`npm run content:generate` 会读取 Markdown、渲染 HTML，并生成 `src/generated/content.ts`。生成过程会检查：

:::: card-grid
::: card Frontmatter
必填字段、内容类型、slug 形状和日期格式。
:::

::: card Taxonomy
分类和标签必须来自集中 taxonomy 配置。
:::

::: card Markdown
只允许已批准的 directive，不允许任意 Vue 组件标签。
:::

::: card 配对
缺失语言配对或 metadata 漂移会让生成失败。
:::
::::

## Markdown 规则

当前允许的 Markdown affordance：

:badge[Callout] :badge[Tabs] :badge[CardGrid] :badge[StepList] :badge[Badge]

每页只能有一个 `#` 标题，标题不能跳级。代码块、表格和链接都应保持可静态渲染；客户端交互只能增强阅读体验，不能成为内容可读性的前提。

## 验证要求

修改内容或 taxonomy 后运行：

```bash
npm run content:generate
npm run check
```

合并或发布前运行：

```bash
npm run ci
```

`npm run ci` 会覆盖内容生成、格式检查、类型检查、测试和静态输出验证。
