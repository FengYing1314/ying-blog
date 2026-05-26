# 贡献指南

枫莹の小窝是一个纯静态 Vite+ 个人站，使用 Vue、TypeScript、SSG 和 Markdown 内容。所有改动都应保持小范围、可构建，并遵守 `AGENTS.md` 与 `docs/` 中的项目规则。

## 本地设置

```bash
npm ci
npm run dev
```

使用 `.node-version` 中声明的 Node 版本。

## 贡献前置规则

仓库根目录存在 `LICENSE` 文件前，不应接受外部贡献。没有明确许可证时，复用条款和贡献条款都不够清晰。

## 验证

提交 pull request 前运行完整本地门禁：

```bash
npm run ci
```

该命令会运行内容生成、格式/lint 检查、类型检查、测试和静态 SSG 构建验证。

## 内容规则

- Posts、Docs 和 About 内容需要同时添加 `/zh/` 与 `/en/` Markdown 文件。
- 配对内容的 slug、date、updated、featured、order、categories、tags 和 docs section 必须保持一致。
- 只能使用集中配置的 taxonomy slug。
- 只能使用已批准的 Markdown affordance：Callout、Tabs、CardGrid、StepList 和 Badge。
- 不提交未完成草稿内容。

## 分支边界

- `main` 是项目站分支，保留项目文章、项目文档、开发规则和可复用静态站基础。
- `fy-blog` 是个人站内容分支，维护个人 profile、个人 about、个人 taxonomy 和个人文章内容。
- 两个分支都必须保持 Vite+、Vue、TypeScript、SSG、Markdown 和纯静态部署约束。
- 个人内容不直接进入 `main`；项目站内容不应污染 `fy-blog` 的个人发布目标。

## 范围边界

Projects 当前只做配置驱动卡片。没有明确项目决策时，不要添加项目详情页、CMS、评论、分析、搜索、draft 工作流或生成社交图。

## Pull Request

- 保持 PR 小而聚焦。
- 相关时说明路由、SEO、RSS、sitemap、taxonomy 或静态输出影响。
- 使用 pull request 模板中的检查清单。
- 不包含 secrets、私人笔记、未发布个人内容或本地路径链接。
