<template>
  <div class="taxonomy-links" :class="{ compact }">
    <RouterLink
      v-for="category in categoryTerms"
      :key="category.slug"
      :to="localizedPath(entry.locale, `categories/${category.slug}`)"
    >
      {{ category.label[entry.locale] }}
    </RouterLink>
    <RouterLink
      v-for="tag in tagTerms"
      :key="tag.slug"
      :to="localizedPath(entry.locale, `tags/${tag.slug}`)"
    >
      #{{ tag.label[entry.locale] }}
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { categories, tags } from "../config/taxonomy";
import { localizedPath } from "../lib/paths";
import type { ContentEntry } from "../types/content";

const props = defineProps<{
  entry: ContentEntry;
  compact?: boolean;
}>();

const categoryTerms = computed(() =>
  categories.filter((term) => props.entry.categories.includes(term.slug)),
);
const tagTerms = computed(() => tags.filter((term) => props.entry.tags.includes(term.slug)));
</script>
