<template>
  <div class="page listing-page shell-inner">
    <header class="page-header">
      <p class="eyebrow">{{ locale === "zh" ? "文章" : "Posts" }}</p>
      <h1>{{ page?.title }}</h1>
      <p>{{ page?.description }}</p>
      <div class="page-summary" :aria-label="locale === 'zh' ? '文章统计' : 'Post summary'">
        <span>{{ postCountLabel }}</span>
        <span>{{ readingTimeLabel }}</span>
        <span>{{ yearCountLabel }}</span>
      </div>
    </header>
    <div class="two-column posts-archive-layout">
      <div class="list-stack">
        <ContentCard
          v-for="post in posts"
          :id="`posts-${post.date.slice(0, 4)}`"
          :key="post.id"
          :entry="post"
        />
        <section v-if="posts.length === 0" class="empty-state">
          <h2>{{ locale === "zh" ? "暂无文章" : "No posts yet" }}</h2>
          <p>
            {{
              locale === "zh"
                ? "当前语言下还没有发布文章，可以先浏览文档或项目。"
                : "There are no published posts in this language yet. Browse docs or projects instead."
            }}
          </p>
        </section>
      </div>
      <aside class="taxonomy-panel posts-archive-panel">
        <h2>{{ locale === "zh" ? "归档入口" : "Archive" }}</h2>
        <div class="taxonomy-group">
          <h3>{{ locale === "zh" ? "年份" : "Years" }}</h3>
          <a v-for="year in years" :key="year.year" :href="`#posts-${year.year}`">
            {{ year.year }}
            <span>{{ year.count }}</span>
          </a>
        </div>
        <div class="taxonomy-group">
          <h3>{{ locale === "zh" ? "分类" : "Categories" }}</h3>
          <RouterLink :to="localizedPath(locale, 'categories')">
            {{ locale === "zh" ? "全部分类" : "All categories" }}
          </RouterLink>
          <RouterLink
            v-for="term in categoryTerms"
            :key="term.slug"
            :to="localizedPath(locale, `categories/${term.slug}`)"
          >
            {{ term.label[locale] }}
          </RouterLink>
        </div>
        <div class="taxonomy-group">
          <h3>{{ locale === "zh" ? "标签" : "Tags" }}</h3>
          <RouterLink :to="localizedPath(locale, 'tags')">
            {{ locale === "zh" ? "全部标签" : "All tags" }}
          </RouterLink>
          <RouterLink
            v-for="term in tagTerms"
            :key="term.slug"
            :to="localizedPath(locale, `tags/${term.slug}`)"
          >
            #{{ term.label[locale] }}
          </RouterLink>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ContentCard from "../components/ContentCard.vue";
import { categories, tags } from "../config/taxonomy";
import { getListingPage, getPosts } from "../lib/content";
import { localizedPath } from "../lib/paths";
import { usePageSeo } from "../lib/seo";
import type { Locale } from "../types/content";

const props = defineProps<{
  locale: Locale;
}>();

const page = computed(() => getListingPage(`/${props.locale}/posts/`));
const posts = computed(() => getPosts(props.locale));
const years = computed(() => {
  const counts = new Map<string, number>();
  for (const post of posts.value) {
    const year = post.date.slice(0, 4);
    counts.set(year, (counts.get(year) ?? 0) + 1);
  }

  return Array.from(counts.entries()).map(([year, count]) => ({ year, count }));
});
const categoryTerms = computed(() => {
  const used = new Set(posts.value.flatMap((post) => post.categories));
  return categories.filter((term) => used.has(term.slug));
});
const tagTerms = computed(() => {
  const used = new Set(posts.value.flatMap((post) => post.tags));
  return tags.filter((term) => used.has(term.slug));
});
const postCountLabel = computed(() => {
  const count = posts.value.length;
  return props.locale === "zh" ? `${count} 篇文章` : `${count} posts`;
});
const readingTimeLabel = computed(() => {
  const minutes = posts.value.reduce((sum, post) => sum + post.readingTime, 0);
  return props.locale === "zh" ? `约 ${minutes} 分钟` : `${minutes} min total`;
});
const yearCountLabel = computed(() => {
  const count = years.value.length;
  return props.locale === "zh" ? `${count} 个年份` : `${count} years`;
});

usePageSeo(() => ({
  title: page.value?.title ?? "Posts",
  description: page.value?.description ?? "",
  path: `/${props.locale}/posts/`,
  locale: props.locale,
  type: "listing",
  alternatePath: page.value?.counterpartPath,
}));
</script>
