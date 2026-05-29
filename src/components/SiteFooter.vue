<template>
  <footer class="site-footer">
    <div class="shell-inner footer-inner">
      <div class="footer-brand">
        <RouterLink class="brand" :to="localizedPath(locale)">
          <span class="brand-mark">Y</span>
          <span class="brand-name">Ying Blog</span>
        </RouterLink>
        <p>{{ siteConfig.description[locale] }}</p>
      </div>

      <nav class="footer-nav" :aria-label="locale === 'zh' ? '页脚主导航' : 'Footer primary'">
        <RouterLink v-for="item in navItems" :key="item.path" :to="item.path">
          {{ item.label }}
        </RouterLink>
      </nav>

      <div
        class="footer-links"
        :aria-label="locale === 'zh' ? '订阅与社交链接' : 'Subscribe and social links'"
      >
        <a :href="rssPath">
          <Rss :size="16" aria-hidden="true" />
          <span>RSS</span>
        </a>
        <a
          v-for="link in socialLinks"
          :key="link.href"
          :href="link.href"
          :target="isExternalHref(link.href) ? '_blank' : undefined"
          :rel="isExternalHref(link.href) ? 'noopener noreferrer' : undefined"
        >
          <component :is="socialIcon(link.kind)" :size="16" aria-hidden="true" />
          <span>{{ link.label[locale] }}</span>
        </a>
      </div>

      <p class="footer-copy">
        {{ locale === "zh" ? "版权" : "Copyright" }} © {{ year }} {{ siteConfig.author }}.
        {{ locale === "zh" ? "纯静态、双语、内容优先。" : "Static, bilingual, and content-first." }}
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { GitBranch, Link as LinkIcon, Mail, Rss } from "@lucide/vue";
import { profile, type SocialLinkKind } from "../config/profile";
import { siteConfig, uiText } from "../config/site";
import { localizedPath, withBasePath } from "../lib/paths";
import { sanitizeHref } from "../lib/urls";
import type { Locale } from "../types/content";

const props = defineProps<{
  locale: Locale;
}>();

type ResolvedSocialLink = (typeof profile.socialLinks)[number] & { href: string };

const year = new Date().getFullYear();
const rssPath = withBasePath("/rss.xml");
const navItems = computed(() => [
  { path: localizedPath(props.locale), label: uiText.nav.home[props.locale] },
  { path: localizedPath(props.locale, "posts"), label: uiText.nav.posts[props.locale] },
  { path: localizedPath(props.locale, "docs"), label: uiText.nav.docs[props.locale] },
  { path: localizedPath(props.locale, "projects"), label: uiText.nav.projects[props.locale] },
  { path: localizedPath(props.locale, "about"), label: uiText.nav.about[props.locale] },
]);
const socialLinks = computed<ResolvedSocialLink[]>(() => {
  const links: ResolvedSocialLink[] = [];
  for (const link of profile.socialLinks) {
    if (link.kind === "rss") {
      continue;
    }

    const href = sanitizeHref(link.href);
    if (href) {
      links.push({ ...link, href });
    }
  }
  return links;
});
const socialIcons = {
  github: GitBranch,
  mail: Mail,
  rss: Rss,
  linkedin: LinkIcon,
} as const;

function socialIcon(kind: SocialLinkKind) {
  return socialIcons[kind] ?? LinkIcon;
}

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}
</script>
