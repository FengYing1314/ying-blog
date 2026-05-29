<template>
  <div v-if="page" class="page listing-page taxonomy-index-page shell-inner">
    <header class="page-header">
      <p class="eyebrow">{{ taxonomyLabel }}</p>
      <h1>{{ page.title }}</h1>
      <p>{{ page.description }}</p>
      <div class="page-summary" :aria-label="page.locale === 'zh' ? '页面统计' : 'Page summary'">
        <span>
          <Tags :size="15" aria-hidden="true" />
          {{ termCountLabel }}
        </span>
        <span>
          <FileText :size="15" aria-hidden="true" />
          {{ entryCountLabel }}
        </span>
        <span>
          <FolderKanban :size="15" aria-hidden="true" />
          {{ projectCountLabel }}
        </span>
      </div>
    </header>

    <div class="taxonomy-index-grid">
      <RouterLink
        v-for="term in termCards"
        :key="term.slug"
        class="taxonomy-index-card"
        :to="term.path"
      >
        <span class="taxonomy-index-card-top">
          <span class="content-type-pill">{{ term.kindLabel }}</span>
          <span>{{ term.totalLabel }}</span>
        </span>
        <strong>{{ term.title }}</strong>
        <small>{{ term.description }}</small>
        <span class="taxonomy-index-card-meta">
          <span>{{ term.entryLabel }}</span>
          <span>{{ term.projectLabel }}</span>
        </span>
      </RouterLink>
    </div>

    <nav
      class="taxonomy-return"
      :aria-label="page.locale === 'zh' ? '继续浏览' : 'Continue browsing'"
    >
      <RouterLink class="secondary-link" :to="localizedPath(page.locale, 'posts')">
        {{ page.locale === "zh" ? "全部文章" : "All posts" }}
      </RouterLink>
      <RouterLink class="secondary-link" :to="localizedPath(page.locale, 'docs')">
        {{ page.locale === "zh" ? "文档目录" : "Docs index" }}
      </RouterLink>
      <RouterLink class="secondary-link" :to="localizedPath(page.locale, 'projects')">
        {{ page.locale === "zh" ? "项目展示" : "Projects" }}
      </RouterLink>
    </nav>
  </div>
  <NotFoundPage v-else />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { FileText, FolderKanban, Tags } from "@lucide/vue";
import { categories, tags } from "../config/taxonomy";
import { getTaxonomyIndexTerms, registry } from "../lib/content";
import { localizedPath } from "../lib/paths";
import { usePageSeo } from "../lib/seo";
import type { TaxonomyPage } from "../types/content";
import NotFoundPage from "./NotFoundPage.vue";

const props = defineProps<{
  pageId: string;
}>();

const page = computed(() =>
  registry.taxonomyIndexPages.find((candidate) => candidate.id === props.pageId),
);
const terms = computed(() => (page.value ? getTaxonomyIndexTerms(page.value) : []));
const termConfig = computed(() => (page.value?.taxonomyType === "categories" ? categories : tags));
const totalEntries = computed(() =>
  terms.value.reduce((sum, term) => sum + term.entryIds.length, 0),
);
const totalProjects = computed(() =>
  terms.value.reduce((sum, term) => sum + term.projectSlugs.length, 0),
);
const termCards = computed(() => {
  const currentPage = page.value;
  if (!currentPage) {
    return [];
  }

  return terms.value.map((term) => {
    const config = termConfig.value.find((candidate) => candidate.slug === term.slug);
    return {
      ...term,
      kindLabel:
        currentPage.taxonomyType === "categories"
          ? currentPage.locale === "zh"
            ? "分类"
            : "Category"
          : currentPage.locale === "zh"
            ? "标签"
            : "Tag",
      description: config?.description[currentPage.locale] ?? term.description,
      totalLabel: countLabel(term.entryIds.length + term.projectSlugs.length, currentPage.locale),
      entryLabel: entryLabel(term, currentPage.locale),
      projectLabel: projectLabel(term, currentPage.locale),
    };
  });
});
const taxonomyLabel = computed(() => {
  if (!page.value) {
    return "";
  }

  return page.value.taxonomyType === "categories"
    ? page.value.locale === "zh"
      ? "分类总览"
      : "Category index"
    : page.value.locale === "zh"
      ? "标签总览"
      : "Tag index";
});
const termCountLabel = computed(() => {
  const count = terms.value.length;
  return page.value?.locale === "zh" ? `${count} 个入口` : `${count} terms`;
});
const entryCountLabel = computed(() => {
  const count = totalEntries.value;
  return page.value?.locale === "zh" ? `${count} 篇内容` : `${count} entries`;
});
const projectCountLabel = computed(() => {
  const count = totalProjects.value;
  return page.value?.locale === "zh" ? `${count} 个项目` : `${count} projects`;
});

function countLabel(count: number, locale: "zh" | "en") {
  return locale === "zh" ? `${count} 项` : `${count} items`;
}

function entryLabel(term: TaxonomyPage, locale: "zh" | "en") {
  return locale === "zh" ? `${term.entryIds.length} 篇内容` : `${term.entryIds.length} entries`;
}

function projectLabel(term: TaxonomyPage, locale: "zh" | "en") {
  return locale === "zh"
    ? `${term.projectSlugs.length} 个项目`
    : `${term.projectSlugs.length} projects`;
}

usePageSeo(() => {
  if (!page.value) {
    return undefined;
  }

  return {
    title: page.value.title,
    description: page.value.description,
    path: page.value.path,
    locale: page.value.locale,
    type: "taxonomy-index",
    alternatePath: page.value.counterpartPath,
  };
});
</script>
