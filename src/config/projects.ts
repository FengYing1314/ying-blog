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
    repository: "https://github.com/FengYing1314/NekoHub",
    url: "https://docs.nekohub.fengying.xin/",
    featured: false,
  },
] as const satisfies readonly ProjectCard[];
