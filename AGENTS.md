# AGENTS.md

This file defines project-level instructions for agents working in this repository.

## Project Role

This repository is the governance and development baseline for a long-term personal blog, documentation, and project showcase site. The current baseline is a working Vite+ powered static content site with seed/template content on the main branch, not a VitePress project.

## Current Phase

The project has moved past governance-only initialization into the static site application foundation. Application code, dependencies, and frontend implementation now exist, but the main repository remains governance- and development-template-first. Personal blog content imports belong on dedicated branches. Application changes must keep the Vite+ static deployment constraints intact and avoid adding non-approved platform features such as CMS, comments, analytics, or search unless explicitly requested.

## Technical Direction

- Use Vite+ directly as the project toolchain direction.
- Do not introduce VitePress.
- Application work should preserve Vue, TypeScript, SSG, and Markdown content.
- The final site must support pure static deployment.
- Prefer official capabilities and mature ecosystem packages.
- Avoid over-engineering, complex architecture, or unnecessary dependencies.

## Product Constraints

- The site is a blog, documentation, and project showcase hybrid.
- The visual style should be Mintlify-inspired: modern, calm, readable, and clean.
- Do not copy Mintlify implementation details or exact visual identity.
- Chinese and English are first-class languages.
- Use `/zh/` and `/en/` as peer locale roots.
- Content must stay strongly consistent across languages.

## Content Constraints

- Product content areas are Posts, Docs, Projects, and About.
- Markdown content entry types are currently Posts, Docs, and About; Projects are configuration-driven.
- Projects are configuration-driven cards in the first implementation phase, not detail pages.
- There is no draft workflow in the current implementation; unfinished content should not be committed.
- Main-branch content should stay suitable as seed/template content; personal blog content belongs on a dedicated branch unless explicitly requested.
- Use multi-category and multi-tag taxonomy.
- RSS is currently a single bilingual feed for the whole site, and Projects should contribute only the project index page.

## Engineering Constraints

- Keep every implementation phase buildable and verifiable.
- Prefer clear directory boundaries over clever abstractions.
- Keep components small, low-state, reusable, and easy to remove.
- Use CSS variables and plain CSS before considering a styling framework.
- Markdown may use only approved build-time directives and content affordances.
- Do not add search, comments, analytics, CMS, project detail pages, drafts, or generated social images unless explicitly requested.

## Collaboration Rules

- Inspect the existing tree before making changes.
- Do not overwrite or revert user changes unless explicitly requested.
- Before broad changes, use a sub-agent when it can independently verify architecture, documentation, or implementation quality. Use `gpt-5.4` or `gpt-5.5` with `xhigh` reasoning when selecting a model explicitly.
- Keep final responses concise and include verification results.
- When reviewing, lead with concrete issues and file references.

## Verification Rules

For governance changes:

- Confirm the expected files exist.
- Confirm Git status and commit result.
- If local agent memory exists, keep it local-only and do not require it for repository verification.

For application changes:

- Run type checks and build checks when available.
- Run focused tests for changed behavior.
- If the change affects frontend UI, verify it in a browser when practical.

<!-- pensieve:instructions:start -->
## How To Use Pensieve

Use `.pensieve/` as the first source of architectural intent.

- `maxims/` are active engineering rules.
- `decisions/` are active project decisions.
- `knowledge/` explains boundary maps and debugging paths.
- `pipelines/` gives executable workflows.

Use these project pipelines directly when trigger words match; do not rediscover them through skills first.

- Commit requests (`commit`, `git commit`): use `.pensieve/pipelines/run-when-committing.md`. Check staged diff, decide whether reusable insight should be captured, then make atomic commits.
- Refactor requests (`refactor`, `large refactor`, `split code`): use `.pensieve/pipelines/run-when-refactoring.md`. Confirm the real problem, fix upstream data authority first, split large work into 2-3 user-visible steps, delete old paths when new paths work, and avoid compatibility/fallback branches.
- Review requests (`review`, `code review`, `inspect code`): use `.pensieve/pipelines/run-when-reviewing-code.md`. Start from git history and changed hot spots, verify candidate issues, and report only high-signal findings with evidence and file locations.
<!-- pensieve:instructions:end -->
