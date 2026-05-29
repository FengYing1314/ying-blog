<template>
  <div v-if="entry" class="page content-page shell-inner" :class="`content-${entry.type}`">
    <DocSidebar v-if="entry.type === 'docs'" :locale="entry.locale" :active-id="entry.id" />

    <article class="reading-column">
      <div class="reading-progress" aria-hidden="true"><span /></div>
      <header class="content-header">
        <nav class="breadcrumb" :aria-label="entry.locale === 'zh' ? '面包屑' : 'Breadcrumb'">
          <RouterLink :to="localizedPath(entry.locale)">
            {{ entry.locale === "zh" ? "首页" : "Home" }}
          </RouterLink>
          <span aria-hidden="true">/</span>
          <RouterLink :to="sectionPath">
            {{ sectionLabel }}
          </RouterLink>
        </nav>
        <RouterLink class="content-return-link" :to="sectionPath">
          <ArrowLeft :size="16" aria-hidden="true" />
          <span>{{ returnLabel }}</span>
        </RouterLink>
        <p class="eyebrow">{{ label }}</p>
        <h1>{{ entry.title }}</h1>
        <p>{{ entry.description }}</p>
        <figure v-if="entry.image" class="content-cover">
          <img :src="entry.image" :alt="entry.imageAlt ?? entry.title" />
        </figure>
        <div class="content-meta">
          <span>
            {{ entry.locale === "zh" ? "发布" : "Published" }}
            <time :datetime="entry.date">{{ entry.date }}</time>
          </span>
          <span v-if="entry.updated">
            {{ entry.locale === "zh" ? "更新" : "Updated" }}
            <time :datetime="entry.updated">{{ entry.updated }}</time>
          </span>
          <span>{{ readingTimeLabel }}</span>
        </div>
        <TaxonomyLinks :entry="entry" />
      </header>

      <TocNav
        class="toc-nav-inline"
        :headings="entry.headings"
        :locale="entry.locale"
        collapsible
      />

      <MarkdownContent :html="entry.html" :locale="entry.locale" />

      <nav
        v-if="pager.previous || pager.next"
        class="pager"
        :aria-label="entry.locale === 'zh' ? '分页' : 'Pagination'"
      >
        <RouterLink v-if="pager.previous" :to="pager.previous.path" class="pager-link previous">
          <span>{{ uiText.pager.previous[entry.locale] }}</span>
          <strong>{{ pager.previous.title }}</strong>
        </RouterLink>
        <RouterLink v-if="pager.next" :to="pager.next.path" class="pager-link next">
          <span>{{ uiText.pager.next[entry.locale] }}</span>
          <strong>{{ pager.next.title }}</strong>
        </RouterLink>
      </nav>

      <section v-if="relatedEntries.length" class="related-content">
        <div class="section-heading taxonomy-section-heading">
          <h2>{{ entry.locale === "zh" ? "相关内容" : "Related content" }}</h2>
          <RouterLink :to="primaryCategoryPath">
            {{ entry.locale === "zh" ? "同分类" : "Same category" }}
          </RouterLink>
        </div>
        <div class="content-grid">
          <ContentCard v-for="related in relatedEntries" :key="related.id" :entry="related" />
        </div>
      </section>
    </article>

    <TocNav class="toc-nav-aside" :headings="entry.headings" :locale="entry.locale" />
  </div>
  <NotFoundPage v-else />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ArrowLeft } from "@lucide/vue";
import ContentCard from "../components/ContentCard.vue";
import DocSidebar from "../components/DocSidebar.vue";
import MarkdownContent from "../components/MarkdownContent.vue";
import TaxonomyLinks from "../components/TaxonomyLinks.vue";
import TocNav from "../components/TocNav.vue";
import { uiText } from "../config/site";
import { getEntryById, getPager, getRelatedEntries } from "../lib/content";
import { localizedPath } from "../lib/paths";
import { usePageSeo } from "../lib/seo";
import NotFoundPage from "./NotFoundPage.vue";

const props = defineProps<{
  entryId: string;
}>();

const entry = computed(() => getEntryById(props.entryId));
const pager = computed(() =>
  entry.value ? getPager(entry.value) : { previous: undefined, next: undefined },
);
const relatedEntries = computed(() => (entry.value ? getRelatedEntries(entry.value) : []));
const sectionPath = computed(() => {
  if (!entry.value) {
    return "/zh/";
  }

  return entry.value.type === "about"
    ? localizedPath(entry.value.locale)
    : localizedPath(entry.value.locale, entry.value.type);
});
const primaryCategoryPath = computed(() => {
  if (!entry.value) {
    return "/zh/categories/";
  }

  return entry.value.categories[0]
    ? localizedPath(entry.value.locale, `categories/${entry.value.categories[0]}`)
    : localizedPath(entry.value.locale, "categories");
});
const label = computed(() => {
  if (!entry.value) {
    return "";
  }
  if (entry.value.type === "posts") {
    return entry.value.locale === "zh" ? "文章" : "Post";
  }
  if (entry.value.type === "docs") {
    return entry.value.locale === "zh" ? "随笔" : "Note";
  }
  return entry.value.locale === "zh" ? "关于" : "About";
});
const sectionLabel = computed(() => {
  if (!entry.value) {
    return "";
  }
  if (entry.value.type === "posts") {
    return entry.value.locale === "zh" ? "文章" : "Posts";
  }
  if (entry.value.type === "docs") {
    return entry.value.locale === "zh" ? "文档" : "Docs";
  }
  return entry.value.locale === "zh" ? "关于" : "About";
});
const returnLabel = computed(() => {
  if (!entry.value) {
    return "";
  }
  if (entry.value.type === "posts") {
    return entry.value.locale === "zh" ? "返回文章列表" : "Back to posts";
  }
  if (entry.value.type === "docs") {
    return entry.value.locale === "zh" ? "返回文档目录" : "Back to docs";
  }
  return entry.value.locale === "zh" ? "返回首页" : "Back home";
});
const readingTimeLabel = computed(() => {
  if (!entry.value) {
    return "";
  }

  return entry.value.locale === "zh"
    ? `${entry.value.readingTime} 分钟阅读`
    : `${entry.value.readingTime} min read`;
});

usePageSeo(() => {
  if (!entry.value) {
    return undefined;
  }

  return {
    title: entry.value.seoTitle ?? entry.value.title,
    description: entry.value.description,
    path: entry.value.path,
    locale: entry.value.locale,
    type: entry.value.type,
    alternatePath: entry.value.counterpartPath,
    date: entry.value.date,
    updated: entry.value.updated,
    image: entry.value.image,
    imageAlt: entry.value.imageAlt,
  };
});
</script>
