<template>
  <div class="page docs-index shell-inner">
    <DocSidebar :locale="locale" />
    <section class="docs-index-main">
      <header class="page-header">
        <p class="eyebrow">{{ locale === "zh" ? "文档" : "Docs" }}</p>
        <h1>{{ page?.title }}</h1>
        <p>{{ page?.description }}</p>
      </header>
      <div class="content-grid">
        <ContentCard v-for="doc in docs" :key="doc.id" :entry="doc" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ContentCard from "../components/ContentCard.vue";
import DocSidebar from "../components/DocSidebar.vue";
import { getDocs, getListingPage } from "../lib/content";
import { usePageSeo } from "../lib/seo";
import type { Locale } from "../types/content";

const props = defineProps<{
  locale: Locale;
}>();

const page = computed(() => getListingPage(`/${props.locale}/docs/`));
const docs = computed(() => getDocs(props.locale));

usePageSeo(() => ({
  title: page.value?.title ?? "Docs",
  description: page.value?.description ?? "",
  path: `/${props.locale}/docs/`,
  locale: props.locale,
  type: "listing",
  alternatePath: page.value?.counterpartPath,
}));
</script>
