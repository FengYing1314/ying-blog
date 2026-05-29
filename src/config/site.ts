import type { Locale, LocalizedText } from "../types/content";

const defaultSiteUrl = "https://blog.fengying.xin";
const defaultBasePath = "/";
export const avatarImageUrl =
  "https://image.fengying.xin/Image%20hosting/%E6%96%AF%E5%8D%A1%E8%92%82%E5%A4%B4%E5%83%8Fdart.png";

export const locales = ["zh", "en"] as const satisfies readonly Locale[];

export const defaultLocale = "zh" satisfies Locale;

export const siteConfig = {
  name: {
    zh: "枫莹の小窝",
    en: "Fengying's Nook",
  },
  description: {
    zh: "枫莹的双语个人博客、技术笔记与项目展示站点。",
    en: "Fengying's bilingual personal blog, technical notes, and project showcase.",
  },
  author: "枫莹",
  icon: avatarImageUrl,
  url: normalizeSiteUrl(readPublicEnv("SITE_URL", defaultSiteUrl)),
  basePath: normalizeBasePath(readPublicEnv("BASE_PATH", defaultBasePath)),
  trailingSlash: true,
  seo: {
    title: {
      zh: "枫莹の小窝 - 双语个人博客",
      en: "Fengying's Nook - Bilingual Personal Blog",
    },
    titleSuffix: "枫莹の小窝",
    identityType: "Person",
    image: "/og-default.png",
    imageAlt: {
      zh: "枫莹の小窝双语个人博客分享图",
      en: "Fengying's Nook bilingual personal blog share image",
    },
    imageWidth: 1200,
    imageHeight: 630,
    sameAs: ["https://github.com/FengYing1314/", "https://www.fengying.xin/"],
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
    docs: { zh: "随笔", en: "Notes" },
    projects: { zh: "项目", en: "Projects" },
    about: { zh: "关于", en: "About" },
  },
  listing: {
    latest: { zh: "最新内容", en: "Latest" },
    featured: { zh: "精选内容", en: "Featured" },
    posts: { zh: "全部文章", en: "All Posts" },
    docs: { zh: "全部随笔", en: "All Notes" },
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
