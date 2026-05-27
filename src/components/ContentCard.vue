<template>
  <article class="content-card">
    <div class="content-card-meta">
      <span class="content-type-pill">{{ typeLabel }}</span>
      <span class="content-card-detail">
        <time :datetime="entry.date">{{ entry.date }}</time>
        <span aria-hidden="true">·</span>
        <span>{{ readingTimeLabel }}</span>
      </span>
    </div>
    <h2>
      <RouterLink :to="entry.path">{{ entry.title }}</RouterLink>
    </h2>
    <p>{{ entry.description }}</p>
    <TaxonomyLinks :entry="entry" compact />
    <RouterLink
      class="content-card-link"
      :to="entry.path"
      :aria-label="`${readLabel}: ${entry.title}`"
    >
      <span>{{ readLabel }}</span>
      <ArrowRight :size="16" aria-hidden="true" />
    </RouterLink>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ArrowRight } from "@lucide/vue";
import TaxonomyLinks from "./TaxonomyLinks.vue";
import type { ContentEntry } from "../types/content";

const props = defineProps<{
  entry: ContentEntry;
}>();

const typeLabel = computed(() => {
  if (props.entry.type === "posts") {
    return props.entry.locale === "zh" ? "文章" : "Post";
  }
  if (props.entry.type === "docs") {
    return props.entry.locale === "zh" ? "随笔" : "Note";
  }
  return props.entry.locale === "zh" ? "关于" : "About";
});

const readLabel = computed(() => (props.entry.locale === "zh" ? "阅读" : "Read"));
const readingTimeLabel = computed(() =>
  props.entry.locale === "zh"
    ? `${props.entry.readingTime} 分钟`
    : `${props.entry.readingTime} min`,
);
</script>
