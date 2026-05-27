# CLAUDE.md

Claude agents should treat `AGENTS.md` as the canonical project instruction file for this repository. Read `AGENTS.md`, `README.md`, and `docs/` before structural work.

Current project constraints:

- The project has moved past governance-only initialization into a Vite+ static site application foundation.
- Preserve Vue, TypeScript, SSG, Markdown content, and pure-static deployment constraints.
- Do not introduce VitePress.
- Keep `/zh/` and `/en/` as peer locale roots with structurally consistent paired content.
- Do not add CMS, comments, analytics, search, or project detail pages unless explicitly approved.
- Public project documentation lives in `docs/` and records implemented features plus rules only.
- Personal blog content imports belong on dedicated branches unless the project owner explicitly requests otherwise.

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
