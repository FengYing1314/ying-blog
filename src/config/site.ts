import type { Locale, LocalizedText } from "../types/content";

const defaultSiteUrl = "https://yingblog.fengying.xin";
const defaultBasePath = "/";

export const locales = ["zh", "en"] as const satisfies readonly Locale[];

export const defaultLocale = "zh" satisfies Locale;

export const siteConfig = {
  name: {
    zh: "Ying Blog",
    en: "Ying Blog",
  },
  description: {
    zh: "Ying Blog 是一个基于 Vite+、Vue、TypeScript、SSG 与 Markdown 的双语静态内容站基线，覆盖文章、文档、项目展示与长期维护规则。",
    en: "Ying Blog is a bilingual static content site baseline built with Vite+, Vue, TypeScript, SSG, and Markdown for posts, docs, projects, and long-term maintenance notes.",
  },
  author: "Ying",
  url: normalizeSiteUrl(readPublicEnv("SITE_URL", defaultSiteUrl)),
  basePath: normalizeBasePath(readPublicEnv("BASE_PATH", defaultBasePath)),
  trailingSlash: true,
  seo: {
    title: {
      zh: "Ying Blog - 双语静态内容站基线",
      en: "Ying Blog - Bilingual Static Site Baseline",
    },
    titleSuffix: "Ying Blog",
    identityType: "Organization",
    image: "/og-default.svg",
    imageAlt: {
      zh: "Ying Blog 双语静态内容站基线封面图",
      en: "Ying Blog bilingual static content site baseline cover image",
    },
    imageWidth: 1200,
    imageHeight: 630,
    sameAs: ["https://github.com/FengYing1314/Ying-blog"],
  },
  ai: {
    policy: "allow",
    llmsTextPath: "/llms.txt",
    llmsFullTextPath: "/llms-full.txt",
  },
  verification: {
    google: readPublicEnv("GOOGLE_SITE_VERIFICATION", ""),
    bing: readPublicEnv("BING_SITE_VERIFICATION", ""),
  },
  analytics: {
    provider: "",
    id: "",
  },
  pagefind: {
    enabled: false,
    mountPath: "/pagefind/",
  },
} as const;

function readPublicEnv(name: string, fallback: string) {
  const viteEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  const processEnv = (
    globalThis as typeof globalThis & {
      process?: { env?: Record<string, string | undefined> };
    }
  ).process?.env;
  const value = processEnv?.[name] ?? processEnv?.[`VITE_${name}`] ?? viteEnv?.[`VITE_${name}`];
  return value?.trim() ? value.trim() : fallback;
}

function normalizeSiteUrl(value: string) {
  return value.replace(/\/+$/, "");
}

function normalizeBasePath(value: string) {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "/") {
    return "/";
  }

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

export const uiText = {
  nav: {
    home: { zh: "首页", en: "Home" },
    posts: { zh: "文章", en: "Posts" },
    docs: { zh: "文档", en: "Docs" },
    projects: { zh: "项目", en: "Projects" },
    about: { zh: "关于", en: "About" },
  },
  listing: {
    latest: { zh: "最新内容", en: "Latest" },
    featured: { zh: "精选内容", en: "Featured" },
    posts: { zh: "全部文章", en: "All Posts" },
    docs: { zh: "文档目录", en: "Docs Index" },
    projects: { zh: "项目展示", en: "Projects" },
    taxonomy: { zh: "分类与标签", en: "Categories and Tags" },
  },
  actions: {
    copy: { zh: "复制代码", en: "Copy code" },
    copied: { zh: "已复制", en: "Copied" },
    theme: { zh: "切换主题", en: "Toggle theme" },
    menu: { zh: "打开导航", en: "Open navigation" },
    close: { zh: "关闭导航", en: "Close navigation" },
    language: { zh: "切换语言", en: "Change language" },
    skip: { zh: "跳到正文", en: "Skip to content" },
  },
  pager: {
    previous: { zh: "上一篇", en: "Previous" },
    next: { zh: "下一篇", en: "Next" },
  },
} satisfies Record<string, Record<string, LocalizedText>>;
