<template>
  <div v-if="entry" class="page content-page shell-inner" :class="`content-${entry.type}`">
    <DocSidebar v-if="entry.type === 'docs'" :locale="entry.locale" :active-id="entry.id" />

    <article class="reading-column">
      <header class="content-header">
        <p class="eyebrow">{{ label }}</p>
        <h1>{{ entry.title }}</h1>
        <p>{{ entry.description }}</p>
        <div class="content-meta">
          <time :datetime="entry.date">{{ entry.date }}</time>
          <span>{{ entry.readingTime }} min</span>
        </div>
        <TaxonomyLinks :entry="entry" />
      </header>

      <TocNav class="toc-nav-inline" :headings="entry.headings" :locale="entry.locale" />

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
    </article>

    <TocNav class="toc-nav-aside" :headings="entry.headings" :locale="entry.locale" />
  </div>
  <NotFoundPage v-else />
</template>

<script setup lang="ts">
import { computed } from "vue";
import DocSidebar from "../components/DocSidebar.vue";
import MarkdownContent from "../components/MarkdownContent.vue";
import TaxonomyLinks from "../components/TaxonomyLinks.vue";
import TocNav from "../components/TocNav.vue";
import { uiText } from "../config/site";
import { getEntryById, getPager } from "../lib/content";
import { usePageSeo } from "../lib/seo";
import NotFoundPage from "./NotFoundPage.vue";

const props = defineProps<{
  entryId: string;
}>();

const entry = computed(() => getEntryById(props.entryId));
const pager = computed(() =>
  entry.value ? getPager(entry.value) : { previous: undefined, next: undefined },
);
const label = computed(() => {
  if (!entry.value) {
    return "";
  }
  if (entry.value.type === "posts") {
    return entry.value.locale === "zh" ? "文章" : "Post";
  }
  if (entry.value.type === "docs") {
    return entry.value.locale === "zh" ? "文档" : "Doc";
  }
  return entry.value.locale === "zh" ? "关于" : "About";
});

usePageSeo(() => {
  if (!entry.value) {
    return undefined;
  }

  return {
    title: entry.value.title,
    description: entry.value.description,
    path: entry.value.path,
    locale: entry.value.locale,
    type: entry.value.type,
    alternatePath: entry.value.counterpartPath,
    date: entry.value.date,
  };
});
</script>
