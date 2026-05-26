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
      zh: "记录软件、工具和网站开发里的想法与实践。",
      en: "Notes from building software, tools, and websites.",
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
  {
    slug: "personal",
    label: { zh: "个人记录", en: "Personal Notes" },
    description: {
      zh: "关于个人主页、生活片段和长期记录的内容。",
      en: "Personal homepage notes, life fragments, and long-term records.",
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
      zh: "多语言内容与写作结构。",
      en: "Multilingual content and writing structure.",
    },
  },
  {
    slug: "content-system",
    label: { zh: "内容系统", en: "Content System" },
    description: {
      zh: "内容组织、Markdown 和站点写作体验。",
      en: "Content organization, Markdown, and site writing experience.",
    },
  },
  {
    slug: "typescript",
    label: { zh: "TypeScript", en: "TypeScript" },
    description: { zh: "TypeScript 工程实践。", en: "TypeScript engineering practices." },
  },
  {
    slug: "javascript",
    label: { zh: "JavaScript", en: "JavaScript" },
    description: { zh: "JavaScript 项目和工具。", en: "JavaScript projects and tools." },
  },
  {
    slug: "python",
    label: { zh: "Python", en: "Python" },
    description: { zh: "Python 插件和工具。", en: "Python plugins and tools." },
  },
  {
    slug: "csharp",
    label: { zh: "C#", en: "C#" },
    description: { zh: "C# 与 .NET 项目。", en: "C# and .NET projects." },
  },
  {
    slug: "dotnet",
    label: { zh: ".NET", en: ".NET" },
    description: { zh: ".NET 应用和库。", en: ".NET applications and libraries." },
  },
  {
    slug: "ai",
    label: { zh: "AI", en: "AI" },
    description: { zh: "人工智能相关工具和实验。", en: "AI-related tools and experiments." },
  },
  {
    slug: "api",
    label: { zh: "API", en: "API" },
    description: { zh: "API 服务、代理和集成。", en: "API services, proxies, and integrations." },
  },
  {
    slug: "bot",
    label: { zh: "Bot", en: "Bot" },
    description: {
      zh: "Bot、插件和自动化互动。",
      en: "Bots, plugins, and automation interactions.",
    },
  },
  {
    slug: "plugin",
    label: { zh: "插件", en: "Plugin" },
    description: { zh: "插件开发和扩展能力。", en: "Plugin development and extension points." },
  },
  {
    slug: "websocket",
    label: { zh: "WebSocket", en: "WebSocket" },
    description: {
      zh: "WebSocket 连接与实时联动。",
      en: "WebSocket connections and real-time integrations.",
    },
  },
  {
    slug: "tooling",
    label: { zh: "工具", en: "Tooling" },
    description: {
      zh: "个人工具、辅助脚本和工程效率。",
      en: "Personal tools, helper scripts, and engineering workflow.",
    },
  },
  {
    slug: "personal",
    label: { zh: "个人介绍", en: "Personal" },
    description: { zh: "个人介绍与主页信息。", en: "Personal introductions and homepage notes." },
  },
  {
    slug: "openwrt",
    label: { zh: "OpenWrt", en: "OpenWrt" },
    description: {
      zh: "OpenWrt、ImmortalWrt 与路由器折腾记录。",
      en: "OpenWrt, ImmortalWrt, and router notes.",
    },
  },
  {
    slug: "networking",
    label: { zh: "网络", en: "Networking" },
    description: {
      zh: "家庭网络、DNS 和网络设备配置。",
      en: "Home networking, DNS, and network device setup.",
    },
  },
] as const satisfies readonly TaxonomyTerm[];

export const taxonomy = {
  categories,
  tags,
} as const;
