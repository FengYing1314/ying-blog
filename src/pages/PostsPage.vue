<template>
  <div class="page listing-page shell-inner">
    <header class="page-header">
      <p class="eyebrow">{{ locale === "zh" ? "文章" : "Posts" }}</p>
      <h1>{{ page?.title }}</h1>
      <p>{{ page?.description }}</p>
    </header>
    <div class="list-stack">
      <ContentCard v-for="post in posts" :key="post.id" :entry="post" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ContentCard from "../components/ContentCard.vue";
import { getListingPage, getPosts } from "../lib/content";
import { usePageSeo } from "../lib/seo";
import type { Locale } from "../types/content";

const props = defineProps<{
  locale: Locale;
}>();

const page = computed(() => getListingPage(`/${props.locale}/posts/`));
const posts = computed(() => getPosts(props.locale));

usePageSeo(() => ({
  title: page.value?.title ?? "Posts",
  description: page.value?.description ?? "",
  path: `/${props.locale}/posts/`,
  locale: props.locale,
  type: "listing",
  alternatePath: page.value?.counterpartPath,
}));
</script>
