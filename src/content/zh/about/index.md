---
locale: zh
slug: index
title: 关于
description: 关于 Ying Blog 项目站的定位、内容范围和维护原则。
date: 2026-05-23
categories:
  - writing
tags:
  - content-system
  - i18n
featured: false
order: 1
---

# 关于

Ying Blog 的 `main` 分支是项目站，定位介于博客、文档和项目展示之间。它优先记录当前静态站实现、开发规则、内容边界和项目归档。

## 内容范围

站点目前包含四类内容：Posts、Docs、Projects 和 About。Posts 适合项目实现记录和技术笔记，Docs 适合项目开发说明和维护规则，Projects 以配置驱动卡片展示，当前不生成详情页。

## 维护原则

中文和英文内容都是一等公民。新增内容必须同时提供两个语言版本，并保持 slug、分类、标签和 SEO 意图一致。个人 profile、个人 about、个人 taxonomy 和个人文章内容放在 `fy-blog` 分支维护，不直接进入 `main`。
