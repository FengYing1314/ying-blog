<template>
  <div class="page home-page shell-inner">
    <section class="home-hero">
      <div class="home-intro">
        <p class="eyebrow">{{ locale === "zh" ? "项目站" : "Project Site" }}</p>
        <h1>{{ profile.name }}</h1>
        <p>{{ profile.intro[locale] }}</p>
        <div class="home-actions" :aria-label="locale === 'zh' ? '主页入口' : 'Home actions'">
          <RouterLink class="primary-link" :to="localizedPath(locale, 'posts')">
            <FileText :size="17" aria-hidden="true" />
            <span>{{ locale === "zh" ? "阅读文章" : "Read posts" }}</span>
          </RouterLink>
          <RouterLink class="secondary-link" :to="localizedPath(locale, 'docs')">
            <BookOpen :size="17" aria-hidden="true" />
            <span>{{ locale === "zh" ? "浏览文档" : "Browse docs" }}</span>
          </RouterLink>
        </div>
      </div>

      <aside
        class="profile-card home-profile-card"
        :aria-label="locale === 'zh' ? '项目概览' : 'Project profile'"
      >
        <div class="profile-card-top">
          <div class="profile-avatar" aria-hidden="true">Y</div>
          <div>
            <p class="profile-name">{{ profile.name }}</p>
            <p class="profile-role">{{ profile.role[locale] }}</p>
          </div>
        </div>
        <p class="profile-status">
          <span aria-hidden="true"></span>
          {{ profile.status[locale] }}
        </p>
        <p class="profile-location">
          <MapPin :size="16" aria-hidden="true" />
          <span>{{ profile.location[locale] }}</span>
        </p>
        <div class="profile-focus">
          <span v-for="item in profile.focus" :key="item.en">{{ item[locale] }}</span>
        </div>
        <div class="profile-links">
          <RouterLink
            v-for="link in profile.links"
            :key="link.href"
            class="profile-link"
            :to="localizedPath(locale, link.href)"
          >
            <Sparkles :size="16" aria-hidden="true" />
            <span>{{ link.label[locale] }}</span>
            <ArrowRight :size="15" aria-hidden="true" />
          </RouterLink>
        </div>
      </aside>
    </section>

    <section class="home-overview" :aria-label="locale === 'zh' ? '站点概览' : 'Site overview'">
      <div class="home-overview-main">
        <div class="profile-summary-grid home-stat-grid">
          <RouterLink class="profile-summary-card" :to="localizedPath(locale, 'posts')">
            <FileText :size="18" aria-hidden="true" />
            <strong>{{ postCount }}</strong>
            <span>{{ locale === "zh" ? "文章" : "Posts" }}</span>
          </RouterLink>
          <RouterLink class="profile-summary-card" :to="localizedPath(locale, 'docs')">
            <BookOpen :size="18" aria-hidden="true" />
            <strong>{{ docCount }}</strong>
            <span>{{ locale === "zh" ? "文档" : "Docs" }}</span>
          </RouterLink>
          <RouterLink class="profile-summary-card" :to="localizedPath(locale, 'projects')">
            <FolderKanban :size="18" aria-hidden="true" />
            <strong>{{ projectCount }}</strong>
            <span>{{ locale === "zh" ? "项目" : "Projects" }}</span>
          </RouterLink>
          <a class="profile-summary-card" href="#home-achievements">
            <Trophy :size="18" aria-hidden="true" />
            <strong>{{ profile.achievements.length }}</strong>
            <span>{{ locale === "zh" ? "成就" : "Achievements" }}</span>
          </a>
        </div>

        <div class="home-update-panel">
          <div class="home-update-header">
            <span>{{ locale === "zh" ? "最近更新" : "Latest updates" }}</span>
            <RouterLink :to="localizedPath(locale, 'posts')">
              {{ locale === "zh" ? "全部文章" : "All posts" }}
            </RouterLink>
          </div>
          <div class="home-update-grid">
            <RouterLink
              v-for="entry in overviewEntries"
              :key="entry.id"
              class="home-update-link"
              :to="entry.path"
            >
              <span class="content-type-pill">{{ contentTypeLabel(entry.type) }}</span>
              <strong>{{ entry.title }}</strong>
              <small>{{ entry.description }}</small>
              <ArrowRight :size="15" aria-hidden="true" />
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="social-dock" :aria-label="locale === 'zh' ? '社交链接' : 'Social links'">
        <a
          v-for="link in socialLinks"
          :key="link.kind"
          class="social-link"
          :href="link.href"
          :target="isExternalHref(link.href) ? '_blank' : undefined"
          :rel="isExternalHref(link.href) ? 'noopener noreferrer' : undefined"
        >
          <component :is="socialIcon(link.kind)" :size="18" aria-hidden="true" />
          <span>
            <strong>{{ link.label[locale] }}</strong>
            <small>{{ link.description[locale] }}</small>
          </span>
          <ArrowUpRight v-if="isExternalHref(link.href)" :size="15" aria-hidden="true" />
          <ArrowRight v-else :size="15" aria-hidden="true" />
        </a>
        <RouterLink class="social-link" :to="localizedPath(locale, 'docs/guide/content-workflow')">
          <BookOpen :size="18" aria-hidden="true" />
          <span>
            <strong>{{ locale === "zh" ? "开发规则" : "Development rules" }}</strong>
            <small>{{ locale === "zh" ? "查看内容与分支规则" : "Content and branch rules" }}</small>
          </span>
          <ArrowRight :size="15" aria-hidden="true" />
        </RouterLink>
      </div>
    </section>

    <section id="home-achievements" class="section-band home-achievements">
      <div class="section-heading">
        <div>
          <h2>{{ locale === "zh" ? "贡献与成就" : "Contributions and Achievements" }}</h2>
          <p>
            {{
              locale === "zh"
                ? "用可验证的内容、项目和维护规则呈现当前实现。"
                : "A compact view of implemented content, projects, and maintenance rules."
            }}
          </p>
        </div>
        <RouterLink :to="localizedPath(locale, 'projects')">{{
          locale === "zh" ? "查看项目" : "View projects"
        }}</RouterLink>
      </div>
      <div class="achievement-grid">
        <RouterLink
          v-for="achievement in achievements"
          :key="achievement.href"
          class="achievement-card"
          :to="achievement.to"
        >
          <span class="achievement-icon">
            <Trophy :size="18" aria-hidden="true" />
          </span>
          <span>
            <strong>{{ achievement.label[locale] }}</strong>
            <small>{{ achievement.description[locale] }}</small>
          </span>
          <ArrowRight :size="16" aria-hidden="true" />
        </RouterLink>
      </div>
    </section>

    <section class="section-band contribution-section">
      <div class="section-heading">
        <div>
          <h2>{{ locale === "zh" ? "贡献轨迹" : "Contribution Tracks" }}</h2>
          <p>
            {{
              locale === "zh"
                ? "每条轨迹都对应当前站点已经落地的能力。"
                : "Each track maps to capabilities already implemented in the site."
            }}
          </p>
        </div>
      </div>
      <div class="contribution-grid">
        <article
          v-for="area in profile.contributionAreas"
          :key="area.label.en"
          class="contribution-card"
          :style="contributionStyle(area.score)"
        >
          <div>
            <p>{{ area.label[locale] }}</p>
            <strong>{{ area.value[locale] }}</strong>
          </div>
          <span class="contribution-meter" aria-hidden="true"><span /></span>
          <small>{{ area.description[locale] }}</small>
        </article>
      </div>
    </section>

    <section class="section-band">
      <div class="section-heading">
        <h2>{{ uiText.listing.featured[locale] }}</h2>
        <RouterLink :to="localizedPath(locale, 'posts')">{{
          locale === "zh" ? "查看文章" : "View posts"
        }}</RouterLink>
      </div>
      <div class="content-grid">
        <ContentCard v-for="entry in featured" :key="entry.id" :entry="entry" />
      </div>
    </section>

    <section class="section-band two-column">
      <div>
        <div class="section-heading">
          <h2>{{ uiText.listing.latest[locale] }}</h2>
        </div>
        <div class="list-stack">
          <ContentCard v-for="entry in latest" :key="entry.id" :entry="entry" />
        </div>
      </div>
      <aside class="taxonomy-panel">
        <h2>{{ uiText.listing.taxonomy[locale] }}</h2>
        <div class="taxonomy-group">
          <h3>{{ locale === "zh" ? "分类" : "Categories" }}</h3>
          <RouterLink
            v-for="term in categories"
            :key="term.slug"
            :to="localizedPath(locale, `categories/${term.slug}`)"
          >
            {{ term.label[locale] }}
          </RouterLink>
        </div>
        <div class="taxonomy-group">
          <h3>{{ locale === "zh" ? "标签" : "Tags" }}</h3>
          <RouterLink
            v-for="term in tags"
            :key="term.slug"
            :to="localizedPath(locale, `tags/${term.slug}`)"
          >
            #{{ term.label[locale] }}
          </RouterLink>
        </div>
      </aside>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  FileText,
  FolderKanban,
  GitBranch,
  Link as LinkIcon,
  Mail,
  MapPin,
  Rss,
  Sparkles,
  Trophy,
} from "@lucide/vue";
import ContentCard from "../components/ContentCard.vue";
import { profile, type SocialLinkKind } from "../config/profile";
import { siteConfig, uiText } from "../config/site";
import { categories, tags } from "../config/taxonomy";
import {
  getDocs,
  getFeaturedEntries,
  getLatestEntries,
  getListingPage,
  getPosts,
  getProjectCards,
} from "../lib/content";
import { localizedPath } from "../lib/paths";
import { usePageSeo } from "../lib/seo";
import { sanitizeHref } from "../lib/urls";
import type { Locale } from "../types/content";

const props = defineProps<{
  locale: Locale;
}>();

const page = computed(() => getListingPage(`/${props.locale}/`));
const featured = computed(() => getFeaturedEntries(props.locale));
const latest = computed(() => getLatestEntries(props.locale));
const overviewEntries = computed(() => latest.value.slice(0, 2));
const postCount = computed(() => getPosts(props.locale).length);
const docCount = computed(() => getDocs(props.locale).length);
const projectCount = computed(() => getProjectCards().length);
type ResolvedSocialLink = (typeof profile.socialLinks)[number] & { href: string };
const socialLinks = computed<ResolvedSocialLink[]>(() => {
  const links: ResolvedSocialLink[] = [];
  for (const link of profile.socialLinks) {
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
const achievements = computed(() =>
  profile.achievements.map((achievement) => ({
    ...achievement,
    to: localizedPath(props.locale, achievement.href),
  })),
);

function socialIcon(kind: SocialLinkKind) {
  return socialIcons[kind] ?? LinkIcon;
}

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function contributionStyle(score: number) {
  return { "--contribution-score": `${Math.max(0, Math.min(score, 100))}%` };
}

function contentTypeLabel(type: "posts" | "docs" | "about") {
  if (type === "posts") {
    return props.locale === "zh" ? "文章" : "Post";
  }
  if (type === "docs") {
    return props.locale === "zh" ? "文档" : "Doc";
  }
  return props.locale === "zh" ? "关于" : "About";
}

usePageSeo(() => ({
  title: page.value?.title ?? siteConfig.name[props.locale],
  description: page.value?.description ?? siteConfig.description[props.locale],
  path: `/${props.locale}/`,
  locale: props.locale,
  type: "home",
  alternatePath: page.value?.counterpartPath,
}));
</script>
