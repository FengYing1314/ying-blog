import type { LocalizedText } from "../types/content";

export interface FriendLink {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  url: string;
  avatar?: string;
}

export const friendsAreExamples = true;

export const friendLinks: readonly FriendLink[] = [
  {
    id: "mountain-notes",
    name: { zh: "山间笔记", en: "Mountain Notes" },
    description: {
      zh: "记录技术实践，也收藏生活中的小事。",
      en: "Notes on technical practice and the little things in life.",
    },
    url: "https://shanjian.example/",
    avatar: "/images/friends/mountain.webp",
  },
  {
    id: "code-corner",
    name: { zh: "码间小站", en: "Code Corner" },
    description: {
      zh: "从代码到日常，慢慢整理自己的想法。",
      en: "Sorting through ideas, from code to everyday life.",
    },
    url: "https://majian.example/",
    avatar: "/images/friends/cat.webp",
  },
  {
    id: "starry-journal",
    name: { zh: "星河手札", en: "Starry Journal" },
    description: {
      zh: "分享阅读、摄影和一路上的见闻。",
      en: "Reading, photography, and discoveries along the way.",
    },
    url: "https://xinghe.example/",
    avatar: "/images/friends/stars.webp",
  },
  {
    id: "forest-echoes",
    name: { zh: "林间回声", en: "Forest Echoes" },
    description: {
      zh: "关于设计、写作，以及有趣的小项目。",
      en: "Design, writing, and interesting little projects.",
    },
    url: "https://linjian.example/",
    avatar: "/images/friends/forest.webp",
  },
  {
    id: "slow-writing",
    name: { zh: "慢慢写", en: "Slow Writing" },
    description: {
      zh: "不急着写完，先把值得记下的留下。",
      en: "Taking time to write down the things worth keeping.",
    },
    url: "https://manman.example/",
    avatar: "/images/friends/journal.webp",
  },
  {
    id: "collected-moments",
    name: { zh: "拾光日志", en: "Collected Moments" },
    description: {
      zh: "一点开发记录，一点生活碎片。",
      en: "A few development notes and fragments of everyday life.",
    },
    url: "https://shiguang.example/",
    avatar: "/images/friends/sea.webp",
  },
];
