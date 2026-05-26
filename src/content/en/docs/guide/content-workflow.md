---
locale: en
slug: guide/content-workflow
title: Content And Branch Rules
description: Content boundaries, generation rules, and verification requirements for the Ying Blog project and personal-site branches.
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

# Content And Branch Rules

Ying Blog uses one codebase for the project site and the personal site. The two sites isolate content by branch, but both must keep the Vite+, Vue, TypeScript, SSG, Markdown, and pure-static deployment constraints.

## Branch Boundaries

:::: steps
::: step main
`main` is the project-site branch for project articles, project docs, development rules, and shared code.
:::

::: step fy-blog
`fy-blog` is the personal-site content branch for personal profile data, personal about content, personal taxonomy, and personal articles.
:::

::: step Content isolation
Personal content does not go directly into `main`; project-site content should not pollute the personal publishing target on `fy-blog`.
:::
::::

## Content Entry Points

The current Markdown content entry points are only:

| Type  | Example directory       | Purpose                                         |
| ----- | ----------------------- | ----------------------------------------------- |
| Posts | `src/content/en/posts/` | Project implementation notes, essays, and notes |
| Docs  | `src/content/en/docs/`  | Project development notes and maintenance rules |
| About | `src/content/en/about/` | Site or author information                      |

Projects are currently configured in `src/config/projects.ts`, shown as cards, and do not generate Markdown detail pages.

## Bilingual Pairs

`/zh/` and `/en/` are peer locale roots. Public Markdown content in Posts, Docs, and About must be paired across both languages.

Paired content must keep these frontmatter fields aligned:

- `slug`
- `date`
- `updated`
- `featured`
- `order`
- `section`
- `categories`
- `tags`

Body text can be naturally localized, but structure and metadata must not drift.

## Content Generation

`npm run content:generate` reads Markdown, renders HTML, and writes `src/generated/content.ts`. Generation checks:

:::: card-grid
::: card Frontmatter
Required fields, content type, slug shape, and date format.
:::

::: card Taxonomy
Categories and tags must come from the centralized taxonomy config.
:::

::: card Markdown
Only approved directives are allowed. Arbitrary Vue component tags are not allowed.
:::

::: card Pairing
Missing locale pairs or metadata drift fail generation.
:::
::::

## Markdown Rules

The approved Markdown affordances are:

:badge[Callout] :badge[Tabs] :badge[CardGrid] :badge[StepList] :badge[Badge]

Each page must have exactly one `#` heading, and headings must not skip levels. Code blocks, tables, and links should stay statically renderable; client-side interaction may enhance reading, but it cannot be required for content readability.

## Verification Requirements

After changing content or taxonomy, run:

```bash
npm run content:generate
npm run check
```

Before merging or publishing, run:

```bash
npm run ci
```

`npm run ci` covers content generation, formatting, type checks, tests, and static output verification.
