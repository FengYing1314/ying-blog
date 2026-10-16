import type { LocalizedText } from "../types/content";

export interface FriendLink {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  url: string;
  avatar?: string;
}

export const friendsAreExamples = false;

export const friendLinks: readonly FriendLink[] = [
  {
    id: "catinst",
    name: { zh: "Catinst", en: "Catinst" },
    description: {
      zh: "Snownight 的 GitHub 主页和公开代码仓库。",
      en: "Snownight's GitHub profile and public repositories.",
    },
    url: "https://github.com/Catinst",
    avatar: "https://avatars.githubusercontent.com/u/120306967?v=4",
  },
  {
    id: "ryobunoki",
    name: { zh: "Ryobunoki", en: "Ryobunoki" },
    description: {
      zh: "Ryobunoki 的 GitHub 主页和公开代码仓库。",
      en: "Ryobunoki's GitHub profile and public repositories.",
    },
    url: "https://github.com/Ryobunoki",
    avatar: "https://avatars.githubusercontent.com/u/75173327?v=4",
  },
  {
    id: "yumeyuka",
    name: { zh: "梦璃酱的小作坊", en: "Yumeyuka's Workshop" },
    description: {
      zh: "分享个人记录、文章与笔记的小作坊。",
      en: "A little workshop for personal writing and notes.",
    },
    url: "https://yumeyuka.moe/",
    avatar:
      "https://mintcdn.com/yume/nCrJ8tBzHs9f6Wuj/logo/logo.png?fit=max&auto=format&n=nCrJ8tBzHs9f6Wuj&q=85&s=2056c1274fe1443e9180d6ca7cf3614e",
  },
  {
    id: "shirorren",
    name: { zh: "白彩恋", en: "ShIroRRen" },
    description: {
      zh: "白彩恋的个人站点，分享日常记录与开发项目。",
      en: "ShIroRRen's personal site for everyday notes and development projects.",
    },
    url: "https://shiror.ren/",
    avatar: "https://avatars.githubusercontent.com/u/169267914?v=4",
  },
  {
    id: "yuban11451",
    name: { zh: "御坂11451", en: "Yuban11451" },
    description: {
      zh: "思考、判断、行动。",
      en: "Think, judge, act.",
    },
    url: "https://yuban11451.github.io/",
    avatar: "https://yuban11451.github.io/img/avatar_hu_7e8a1d1a7fd826b.png",
  },
  {
    id: "skyhome",
    name: { zh: "skyhome.studio", en: "skyhome.studio" },
    description: {
      zh: "一个朋友的网站。",
      en: "A friend's website.",
    },
    url: "https://www.skyhome.studio/",
  },
];
