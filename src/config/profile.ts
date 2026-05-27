import type { LocalizedText } from "../types/content";
import { avatarImageUrl } from "./site";
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
  name: "枫莹",
  avatar: avatarImageUrl,
  status: {
    zh: "いつか一人で去る",
    en: "いつか一人で去る",
  },
  role: {
    zh: "个人开发者 / 学生",
    en: "Personal developer / student",
  },
  location: {
    zh: "China / OOM-WG",
    en: "China / OOM-WG",
  },
  intro: {
    zh: "这里是枫莹的小窝，留一点折腾过的东西，也留一点自己想写的话。",
    en: "This is Fengying's small home, with a few things I have tinkered with and a few words I wanted to keep.",
  },
  focus: [
    { zh: "C# / Python / TypeScript", en: "C# / Python / TypeScript" },
    { zh: "网站与工具开发", en: "Web and tool development" },
    { zh: "AI / OpenWrt / VR", en: "AI / OpenWrt / VR" },
  ],
  socialLinks: [
    {
      kind: "github",
      label: { zh: "GitHub", en: "GitHub" },
      description: { zh: "代码与项目记录", en: "Code and project notes" },
      href: "https://github.com/FengYing1314/",
    },
    {
      kind: "mail",
      label: { zh: "Email", en: "Email" },
      description: { zh: "联系与交流", en: "Contact and conversation" },
      href: "mailto:admin@fengying.space",
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
      label: { zh: "最近随笔", en: "Recent note" },
      description: {
        zh: "有些东西先留下来，以后回头还能找到。",
        en: "Some things are worth keeping so I can find them again later.",
      },
      href: "docs/guide/getting-started",
    },
    {
      label: { zh: "项目记录", en: "Project notes" },
      description: {
        zh: "做过、还在用，或者以后还想继续完善的小项目。",
        en: "Small projects I have made, still use, or may keep improving.",
      },
      href: "projects",
    },
    {
      label: { zh: "折腾记录", en: "Tinkering notes" },
      description: {
        zh: "路由器、网站、AI 工具，还有一些试过的新东西。",
        en: "Routers, websites, AI tools, and a few new things I have tried.",
      },
      href: "posts",
    },
  ] satisfies ProfileAchievement[],
  contributionAreas: [
    {
      label: { zh: "写作状态", en: "Writing state" },
      value: { zh: "慢慢补", en: "Slowly adding" },
      description: {
        zh: "想起来一点就写一点，不急着一次写完。",
        en: "Adding a little when I remember it, without rushing.",
      },
      score: 78,
    },
    {
      label: { zh: "主要语言", en: "Main languages" },
      value: { zh: "C# / Python / TS", en: "C# / Python / TS" },
      description: {
        zh: "平时会接触这些，也会写一些网页和小工具。",
        en: "Languages I often touch while making websites and small tools.",
      },
      score: 76,
    },
    {
      label: { zh: "最近在折腾", en: "Recent interests" },
      value: { zh: "AI / OpenWrt / VR", en: "AI / OpenWrt / VR" },
      description: {
        zh: "看到有意思的新东西，就会先试试看。",
        en: "When something looks interesting, I usually try it first.",
      },
      score: 70,
    },
  ] satisfies ContributionArea[],
  links: [
    {
      label: { zh: "关于我", en: "About" },
      href: "about",
    },
    {
      label: { zh: "项目展示", en: "Projects" },
      href: "projects",
    },
  ] satisfies ProfileLink[],
} as const;
