# 内容工作流

本项目的公开 Markdown 内容位于 `src/content/`，并按语言和内容类型分目录维护。

## 目录形状

```text
src/content/
  zh/
    posts/
    docs/
    about/
  en/
    posts/
    docs/
    about/
```

当前 Markdown 内容类型只有 `posts`、`docs` 和 `about`。Projects 由 `src/config/projects.ts` 配置驱动，不在 `src/content/` 中创建 Markdown 详情页。

## 双语配对

每个公开 Markdown 条目都必须同时存在中文和英文版本。配对内容必须保持以下字段完全一致：

- `slug`
- `date`
- `updated`
- `featured`
- `order`
- `section`
- `categories`
- `tags`

标题、描述和正文可以自然本地化，但内容结构不应漂移。生成脚本会校验缺失翻译、重复翻译和配对 metadata 不一致。

## Frontmatter

每个 Markdown 文件使用严格 frontmatter：

```yaml
---
locale: zh
slug: guide/getting-started
title: 标题
description: 简短描述
date: 2026-05-27
updated: 2026-05-27
categories:
  - engineering
tags:
  - vue
featured: false
order: 100
section: Guide
---
```

规则：

- 必填字段是 `locale`、`slug`、`title`、`description`、`date`、`categories` 和 `tags`。
- 可选字段是 `updated`、`featured`、`order` 和 `section`。
- `locale` 必须匹配所在语言目录。
- `slug` 必须匹配文件路径去掉 `.md` 后的相对路径。
- slug 使用小写 kebab-case，可用 `/` 表示 docs 嵌套路径。
- posts 不能使用嵌套 slug。
- about 只能使用 `slug: index`。
- `categories` 和 `tags` 只能使用 `src/config/taxonomy.ts` 中已经配置的 slug。
- frontmatter 之外的未知字段会使生成失败。

## Markdown 规则

- 每页必须有且只有一个 `#` 标题。
- 标题层级不能跳级。
- 文件名使用 kebab-case。
- 链接文字应有描述性，链接 URL 必须安全。
- 不提交草稿、私人笔记、本地路径链接或不可公开资源。

构建期允许的 Markdown affordance：

- `::: callout note|info|success|warning`
- `::: tabs` 与 `::: tab 标题`
- `::: card-grid` 与 `::: card 标题 | 链接`
- `::: steps` 或 `::: step-list`，以及 `::: step 标题`
- `:badge[文本]`
- fenced code block，使用 Shiki 高亮
- `mermaid` fenced code block

表格会自动包裹为横向滚动容器，`h2` 和 `h3` 会生成目录锚点。

不允许在 Markdown 中使用任意 Vue 组件标签或未批准 directive。

## 生成与验证

修改 Markdown、taxonomy、项目配置或站点配置后运行：

```bash
npm run content:generate
```

提交前至少运行：

```bash
npm run check
```

发布或合并前运行：

```bash
npm run ci
```

这些命令会重新生成 `src/generated/content.ts`，并检查内容配对、taxonomy、Markdown affordance、类型、测试和静态输出。
