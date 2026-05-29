import type { ProjectCard } from "../types/content";

export const projects = [
  {
    slug: "ying-blog",
    title: {
      zh: "Ying Blog",
      en: "Ying Blog",
    },
    description: {
      zh: "使用 Vite+、Vue、TypeScript、SSG 和 Markdown 构建的双语项目站基础。",
      en: "A bilingual project-site baseline built with Vite+, Vue, TypeScript, SSG, and Markdown.",
    },
    categories: ["showcase", "engineering"],
    tags: ["vue", "typescript", "ssg", "i18n", "content-system"],
    status: {
      zh: "基础版本",
      en: "Foundation release",
    },
    period: {
      zh: "2026 至今",
      en: "2026 to present",
    },
    role: {
      zh: "站点架构与内容系统",
      en: "Site architecture and content system",
    },
    stack: ["Vite+", "Vue", "TypeScript", "vite-ssg", "Markdown"],
    highlights: [
      {
        zh: "以内容注册表统一路由、SEO、RSS 和 sitemap。",
        en: "Unifies routes, SEO, RSS, and sitemap through the content registry.",
      },
      {
        zh: "保持 /zh/ 与 /en/ 双语根并列生成。",
        en: "Keeps /zh/ and /en/ as peer generated locale roots.",
      },
    ],
    order: 1,
    repository: "",
    url: "",
    featured: true,
  },
  {
    slug: "content-registry",
    title: {
      zh: "内容注册表实验",
      en: "Content Registry Experiment",
    },
    description: {
      zh: "把路由、SEO、RSS、sitemap 和导航统一到同一份规范化内容数据。",
      en: "A shared normalized source for routes, SEO, RSS, sitemap, and navigation.",
    },
    categories: ["engineering", "writing"],
    tags: ["content-system", "typescript", "i18n"],
    status: {
      zh: "进行中",
      en: "In progress",
    },
    period: {
      zh: "2026",
      en: "2026",
    },
    role: {
      zh: "构建期数据建模",
      en: "Build-time data modeling",
    },
    stack: ["TypeScript", "Markdown", "RSS", "Sitemap"],
    highlights: [
      {
        zh: "把 Markdown、taxonomy 和项目配置汇总为单一静态数据源。",
        en: "Combines Markdown, taxonomy, and project config into one static data source.",
      },
      {
        zh: "构建前校验双语配对、taxonomy slug 和安全链接。",
        en: "Validates bilingual pairs, taxonomy slugs, and safe links before builds.",
      },
    ],
    order: 2,
    repository: "",
    url: "",
    featured: true,
  },
] as const satisfies readonly ProjectCard[];
