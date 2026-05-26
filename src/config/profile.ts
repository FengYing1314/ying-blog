import type { LocalizedText } from "../types/content";
import { withBasePath } from "../lib/paths";

export interface ProfileLink {
  label: LocalizedText;
  href: string;
}

export type SocialLinkKind = "github" | "mail" | "rss" | "linkedin";

export interface SocialLink {
  kind: SocialLinkKind;
  label: LocalizedText;
  description: LocalizedText;
  href: string;
}

export interface ProfileAchievement {
  label: LocalizedText;
  description: LocalizedText;
  href: string;
}

export interface ContributionArea {
  label: LocalizedText;
  value: LocalizedText;
  description: LocalizedText;
  score: number;
}

export const profile = {
  name: "Ying Blog",
  status: {
    zh: "项目站基线",
    en: "Actively maintained",
  },
  role: {
    zh: "双语静态站 / 项目开发记录",
    en: "Bilingual static site / project notes",
  },
  location: {
    zh: "Vite+、Vue、TypeScript、SSG、Markdown",
    en: "Vite+, Vue, TypeScript, SSG, Markdown",
  },
  intro: {
    zh: "这里是 Ying Blog 项目站：记录静态内容系统、双语路由、内容注册表和纯静态部署的实现边界。",
    en: "This is the Ying Blog project site: implementation notes for the static content system, bilingual routing, content registry, and pure static deployment.",
  },
  focus: [
    { zh: "Vue / TypeScript", en: "Vue / TypeScript" },
    { zh: "静态内容系统", en: "Static content systems" },
    { zh: "双语项目文档", en: "Bilingual project docs" },
  ],
  socialLinks: [
    {
      kind: "github",
      label: { zh: "GitHub", en: "GitHub" },
      description: { zh: "代码与项目记录", en: "Code and project notes" },
      href: "https://github.com/",
    },
    {
      kind: "mail",
      label: { zh: "Email", en: "Email" },
      description: { zh: "项目维护联系", en: "Project maintenance contact" },
      href: "mailto:hello@ying-blog.example.com",
    },
    {
      kind: "rss",
      label: { zh: "RSS", en: "RSS" },
      description: { zh: "订阅全部内容更新", en: "Subscribe to site updates" },
      href: withBasePath("/rss.xml"),
    },
  ] satisfies SocialLink[],
  achievements: [
    {
      label: { zh: "双语静态站基线", en: "Bilingual static baseline" },
      description: {
        zh: "站点以纯静态输出、双语路由和可维护内容注册表为核心。",
        en: "Pure static output, bilingual routes, and a maintainable content registry.",
      },
      href: "docs/guide/getting-started",
    },
    {
      label: { zh: "内容与分支规则", en: "Content and branch rules" },
      description: {
        zh: "记录 Markdown、taxonomy、双语配对和分支隔离边界。",
        en: "Rules for Markdown, taxonomy, bilingual pairs, and branch isolation.",
      },
      href: "docs/guide/content-workflow",
    },
    {
      label: { zh: "项目展示集合", en: "Project showcase set" },
      description: {
        zh: "用配置驱动项目卡片，保持轻量、可替换、可长期扩展。",
        en: "Configuration-driven project cards that stay light and extensible.",
      },
      href: "projects",
    },
  ] satisfies ProfileAchievement[],
  contributionAreas: [
    {
      label: { zh: "内容系统", en: "Content system" },
      value: { zh: "路由 / SEO / RSS", en: "Routes / SEO / RSS" },
      description: {
        zh: "把页面、元数据和订阅源绑定到同一份构建期数据。",
        en: "Keeps pages, metadata, and feeds tied to one build-time source.",
      },
      score: 86,
    },
    {
      label: { zh: "工程记录", en: "Engineering notes" },
      value: { zh: "文章 / 文档", en: "Posts / Docs" },
      description: {
        zh: "以可复查的笔记保存架构选择、发布流程和实践细节。",
        en: "Stores architecture choices, release flow, and implementation details.",
      },
      score: 72,
    },
    {
      label: { zh: "长期维护", en: "Long-term upkeep" },
      value: { zh: "双语一致", en: "Bilingual parity" },
      description: {
        zh: "中文和英文共享结构、路由和内容维护规则。",
        en: "Chinese and English share structure, routes, and maintenance rules.",
      },
      score: 78,
    },
  ] satisfies ContributionArea[],
  links: [
    {
      label: { zh: "关于项目", en: "About" },
      href: "about",
    },
    {
      label: { zh: "项目展示", en: "Projects" },
      href: "projects",
    },
  ] satisfies ProfileLink[],
} as const;
