import type { LocalizedText } from "../types/content";

export interface TaxonomyTerm {
  slug: string;
  label: LocalizedText;
  description: LocalizedText;
}

export const categories = [
  {
    slug: "engineering",
    label: { zh: "工程实践", en: "Engineering" },
    description: {
      zh: "关于构建、维护和交付软件系统的内容。",
      en: "Notes on building, maintaining, and shipping software systems.",
    },
  },
  {
    slug: "writing",
    label: { zh: "写作与知识", en: "Writing" },
    description: {
      zh: "关于长期写作、知识组织和内容系统的内容。",
      en: "Long-form writing, knowledge organization, and content systems.",
    },
  },
  {
    slug: "showcase",
    label: { zh: "项目展示", en: "Showcase" },
    description: {
      zh: "项目、作品和公开实验。",
      en: "Projects, work samples, and public experiments.",
    },
  },
] as const satisfies readonly TaxonomyTerm[];

export const tags = [
  {
    slug: "vue",
    label: { zh: "Vue", en: "Vue" },
    description: { zh: "Vue 相关实现与经验。", en: "Vue implementation notes and experience." },
  },
  {
    slug: "ssg",
    label: { zh: "静态生成", en: "SSG" },
    description: {
      zh: "静态站点生成与纯静态部署。",
      en: "Static-site generation and static deployment.",
    },
  },
  {
    slug: "i18n",
    label: { zh: "双语内容", en: "Bilingual Content" },
    description: {
      zh: "多语言内容结构与维护。",
      en: "Multilingual content structure and maintenance.",
    },
  },
  {
    slug: "content-system",
    label: { zh: "内容系统", en: "Content System" },
    description: {
      zh: "内容建模、注册表和 Markdown 工作流。",
      en: "Content modeling, registries, and Markdown workflows.",
    },
  },
  {
    slug: "typescript",
    label: { zh: "TypeScript", en: "TypeScript" },
    description: { zh: "TypeScript 工程实践。", en: "TypeScript engineering practices." },
  },
] as const satisfies readonly TaxonomyTerm[];

export const taxonomy = {
  categories,
  tags,
} as const;
