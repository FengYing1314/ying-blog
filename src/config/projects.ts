import type { ProjectCard } from "../types/content";

export const projects = [
  {
    slug: "fengying-blog",
    title: {
      zh: "枫莹の小窝",
      en: "Fengying's Nook",
    },
    description: {
      zh: "现在你看到的这个小窝，还在慢慢整理中。",
      en: "The small home you are reading now, still being slowly tidied up.",
    },
    categories: ["showcase", "engineering"],
    tags: ["vue", "typescript", "ssg", "i18n", "content-system"],
    status: {
      zh: "个人站",
      en: "Personal site",
    },
    period: {
      zh: "2026 至今",
      en: "2026 to present",
    },
    role: {
      zh: "个人站维护与内容整理",
      en: "Personal site maintenance and content curation",
    },
    stack: ["Vite+", "Vue", "TypeScript", "vite-ssg", "Markdown"],
    highlights: [
      {
        zh: "保留 /zh/ 与 /en/ 双语根，统一文章、随笔、项目和 taxonomy 页面。",
        en: "Keeps /zh/ and /en/ as peer roots across posts, notes, projects, and taxonomy pages.",
      },
      {
        zh: "使用内容注册表生成路由、SEO、RSS、sitemap 和 LLM 抓取入口。",
        en: "Uses the content registry to generate routes, SEO, RSS, sitemap, and LLM entry points.",
      },
    ],
    order: 1,
    repository: "https://github.com/FengYing1314/Blog",
    url: "https://blog.fengying.xin",
    featured: true,
  },
  {
    slug: "grok-api-proxy",
    title: {
      zh: "grok-api-proxy",
      en: "grok-api-proxy",
    },
    description: {
      zh: "官方 Grok API 中转部署项目。",
      en: "A deployment project for proxying the official Grok API.",
    },
    categories: ["engineering", "showcase"],
    tags: ["javascript", "ai", "api"],
    status: {
      zh: "51 stars / 97 forks",
      en: "51 stars / 97 forks",
    },
    period: {
      zh: "2024 至今",
      en: "2024 to present",
    },
    role: {
      zh: "部署与接口转发整理",
      en: "Deployment and API proxy setup",
    },
    stack: ["JavaScript", "API", "AI"],
    highlights: [
      {
        zh: "围绕官方 Grok API 的代理部署流程做项目化整理。",
        en: "Packages deployment flow around the official Grok API proxy use case.",
      },
      {
        zh: "作为个人 AI 工具链折腾记录的一部分保留。",
        en: "Kept as part of the personal AI tooling notes.",
      },
    ],
    order: 2,
    repository: "https://github.com/FengYing1314/grok-api-proxy",
    url: "",
    featured: true,
  },
  {
    slug: "astrbot-plugin-repetition",
    title: {
      zh: "astrbot_plugin_repetition",
      en: "astrbot_plugin_repetition",
    },
    description: {
      zh: "AstrBot 复读相关插件，用来处理群聊里的复读互动。",
      en: "An AstrBot plugin for repetition-style chat interactions.",
    },
    categories: ["engineering", "showcase"],
    tags: ["python", "bot", "plugin"],
    status: {
      zh: "已归档 / 12 stars",
      en: "Archived / 12 stars",
    },
    period: {
      zh: "2024",
      en: "2024",
    },
    role: {
      zh: "插件功能实现与归档维护",
      en: "Plugin implementation and archive maintenance",
    },
    stack: ["Python", "AstrBot", "Bot"],
    highlights: [
      {
        zh: "围绕群聊复读互动实现 AstrBot 插件。",
        en: "Implements an AstrBot plugin around repetition-style group chat interactions.",
      },
      {
        zh: "作为早期聊天机器人插件项目归档展示。",
        en: "Archived as an early chat bot plugin project.",
      },
    ],
    order: 3,
    repository: "https://github.com/FengYing1314/astrbot_plugin_repetition",
    url: "",
    featured: true,
  },
  {
    slug: "astrbot-plugin-token-auto",
    title: {
      zh: "astrbot_plugin_token_auto",
      en: "astrbot_plugin_token_auto",
    },
    description: {
      zh: "AstrBot Token 自动处理插件，主要用来减少重复操作。",
      en: "An AstrBot plugin for handling tokens and reducing repeated manual steps.",
    },
    categories: ["engineering", "showcase"],
    tags: ["python", "bot", "plugin"],
    status: {
      zh: "已归档 / 10 stars",
      en: "Archived / 10 stars",
    },
    period: {
      zh: "2024",
      en: "2024",
    },
    role: {
      zh: "插件功能实现与归档维护",
      en: "Plugin implementation and archive maintenance",
    },
    stack: ["Python", "AstrBot", "Bot"],
    highlights: [
      {
        zh: "减少 Token 相关重复操作，整理成 AstrBot 插件。",
        en: "Reduces repeated token-related operations through an AstrBot plugin.",
      },
      {
        zh: "保留为个人 Bot 插件系列的一部分。",
        en: "Kept as part of the personal bot plugin series.",
      },
    ],
    order: 4,
    repository: "https://github.com/FengYing1314/astrbot_plugin_token_auto",
    url: "",
    featured: false,
  },
  {
    slug: "astrbot-plugin-sign",
    title: {
      zh: "astrbot_plugin_sign",
      en: "astrbot_plugin_sign",
    },
    description: {
      zh: "AstrBot 签到相关插件，记录一次小功能的实现。",
      en: "An AstrBot sign-in plugin, kept as a small feature implementation record.",
    },
    categories: ["engineering", "showcase"],
    tags: ["python", "bot", "plugin"],
    status: {
      zh: "已归档 / 9 stars",
      en: "Archived / 9 stars",
    },
    period: {
      zh: "2024",
      en: "2024",
    },
    role: {
      zh: "插件功能实现与归档维护",
      en: "Plugin implementation and archive maintenance",
    },
    stack: ["Python", "AstrBot", "Bot"],
    highlights: [
      {
        zh: "实现签到相关的小功能并归档记录。",
        en: "Implements and archives a small sign-in related feature.",
      },
      {
        zh: "用于记录聊天机器人插件的轻量实践。",
        en: "Documents a lightweight chat bot plugin practice.",
      },
    ],
    order: 5,
    repository: "https://github.com/FengYing1314/astrbot_plugin_sign",
    url: "",
    featured: false,
  },
  {
    slug: "astrbot-plugin-originium-seal",
    title: {
      zh: "astrbot_plugin_OriginiumSeal",
      en: "astrbot_plugin_OriginiumSeal",
    },
    description: {
      zh: "AstrBot 小插件，围绕拍一拍、头像效果和随机禁言做互动玩法。",
      en: "A small AstrBot plugin around poke detection, avatar effects, and random mute interactions.",
    },
    categories: ["engineering", "showcase"],
    tags: ["python", "bot", "plugin"],
    status: {
      zh: "8 stars",
      en: "8 stars",
    },
    period: {
      zh: "2024",
      en: "2024",
    },
    role: {
      zh: "互动玩法插件实现",
      en: "Interactive plugin implementation",
    },
    stack: ["Python", "AstrBot", "Bot"],
    highlights: [
      {
        zh: "围绕拍一拍、头像效果和随机禁言做群聊互动。",
        en: "Builds group chat interactions around poke detection, avatar effects, and random mute.",
      },
      {
        zh: "以项目卡片形式保留实现记录。",
        en: "Keeps the implementation notes as a project card.",
      },
    ],
    order: 6,
    repository: "https://github.com/FengYing1314/astrbot_plugin_OriginiumSeal",
    url: "",
    featured: false,
  },
  {
    slug: "openclaw-plugin-dg-lab",
    title: {
      zh: "openclaw-plugin-dg-lab",
      en: "openclaw-plugin-dg-lab",
    },
    description: {
      zh: "OpenClaw 与 DG-Lab 通过 WebSocket 联动的 TypeScript 插件。",
      en: "A TypeScript plugin connecting OpenClaw and DG-Lab through WebSocket.",
    },
    categories: ["engineering", "showcase"],
    tags: ["typescript", "websocket", "plugin"],
    status: {
      zh: "6 stars",
      en: "6 stars",
    },
    period: {
      zh: "2025",
      en: "2025",
    },
    role: {
      zh: "联动插件实现",
      en: "Integration plugin implementation",
    },
    stack: ["TypeScript", "WebSocket", "OpenClaw", "DG-Lab"],
    highlights: [
      {
        zh: "通过 WebSocket 串联 OpenClaw 与 DG-Lab。",
        en: "Connects OpenClaw and DG-Lab through WebSocket.",
      },
      {
        zh: "作为 TypeScript 插件实践归档。",
        en: "Archived as a TypeScript plugin practice.",
      },
    ],
    order: 7,
    repository: "https://github.com/FengYing1314/openclaw-plugin-dg-lab",
    url: "",
    featured: false,
  },
  {
    slug: "nekohub",
    title: {
      zh: "NekoHub",
      en: "NekoHub",
    },
    description: {
      zh: "C# 方向项目系列，从图床开始，后来慢慢扩展到更多工具。",
      en: "A C# project line that started from image hosting and slowly expanded into more tools.",
    },
    categories: ["engineering", "showcase"],
    tags: ["csharp", "dotnet", "tooling"],
    status: {
      zh: "技术项目",
      en: "Technical project",
    },
    period: {
      zh: "2025 至今",
      en: "2025 to present",
    },
    role: {
      zh: "C# 工具与文档整理",
      en: "C# tooling and docs curation",
    },
    stack: ["C#", ".NET", "Tooling"],
    highlights: [
      {
        zh: "从图床开始整理一组 C# 方向工具项目。",
        en: "Organizes a set of C# tool projects that started from image hosting.",
      },
      {
        zh: "项目文档保留在独立 docs 站点。",
        en: "Keeps project docs on a dedicated docs site.",
      },
    ],
    order: 8,
    repository: "https://github.com/FengYing1314/NekoHub",
    url: "https://docs.nekohub.fengying.xin/",
    featured: false,
  },
] as const satisfies readonly ProjectCard[];
