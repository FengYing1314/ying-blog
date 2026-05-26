# 项目规则

## 分支规则

- `main` 是项目站分支，用于项目文章、项目文档、开源基础和共享代码。
- `fy-blog` 是个人站内容分支，用于个人 profile、个人 about、个人 taxonomy 和个人文章内容。
- 个人内容不直接进入 `main`。
- 项目站内容不应污染 `fy-blog` 的个人发布目标。
- 两个分支都必须保持 Vite+、Vue、TypeScript、SSG、Markdown、双语路由和纯静态部署约束。

## 内容规则

- `/zh/` 和 `/en/` 是并列语言根。
- Posts、Docs 和 About 的公开 Markdown 内容必须保持双语配对。
- 配对内容必须保持相同 slug、内容类型、路由形状、date、updated、featured、order、section、categories 和 tags。
- 文字可以自然本地化，结构不能漂移。
- 不提交未完成草稿、私人笔记、本地路径链接或不可公开资源。
- Projects 当前只做配置驱动卡片，不生成详情页。
- RSS 是单一双语 `rss.xml`，Projects 只贡献本地化项目索引页。

## Markdown 规则

- 每页使用一个 `#` 标题。
- 不跳级使用标题。
- 文件名使用 kebab-case。
- 链接文字应有描述性。
- 只使用已批准的 Markdown directive。
- 不允许在 Markdown 中使用任意 Vue 组件标签。
- 不支持的 directive、不安全链接、未知 taxonomy slug 或破坏双语 metadata 的内容必须使生成失败。

## 技术规则

- 使用 Vite+，不引入 VitePress。
- 使用 Vue、TypeScript、vite-ssg 和 Markdown。
- 输出必须可纯静态部署。
- 样式使用 CSS variables 和普通 CSS。
- 只有依赖能解决当前具体问题时才添加。
- 没有明确项目决策前，不引入 CMS、评论、分析、搜索、项目详情页、draft 工作流或生成社交图。

## 样式规则

- 视觉方向是安静、清晰、适合阅读，不复制 Mintlify。
- 暗色模式是一等设计路径。
- 组件应小、显式、低状态、可复用、易删除。
- 轻量环境效果必须尊重 reduced-motion，不能阻挡文本选择、链接或键盘导航。

## 命令规则

使用 `.node-version` 中的 Node 版本。

常用命令：

```bash
npm run dev
npm run content:generate
npm run check
npm run test
npm run build
npm run ci
npm run preview
```

规则：

- 修改内容或 taxonomy 后运行 `npm run content:generate`。
- 提交前至少运行 `npm run check`。
- 发布或合并前运行 `npm run ci`。
- 生产式本地预览先运行 `npm run build`，再运行 `npm run preview`。
- 不要用原始 `vp build` 或 `vite build` 替代 `npm run build`。

## 开源规则

- 根目录没有 `LICENSE` 前，不接受外部贡献。
- `package.json` 的 `private: true` 只表示不发布 npm 包，不阻止 GitHub 源码公开。
- 公开接受贡献时，必须补齐最终 `license`、`repository`、`homepage` 和 `bugs` metadata。
- 安全漏洞不要通过公开 issue 报告。
