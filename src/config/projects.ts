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
    repository: "",
    url: "",
    featured: true,
  },
] as const satisfies readonly ProjectCard[];
