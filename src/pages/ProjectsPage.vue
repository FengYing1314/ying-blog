<template>
  <div class="page projects-page shell-inner">
    <header class="page-header">
      <p class="eyebrow">{{ locale === "zh" ? "项目" : "Projects" }}</p>
      <h1>{{ page?.title }}</h1>
      <p>{{ page?.description }}</p>
    </header>

    <div class="project-grid">
      <ProjectCard
        v-for="project in projectCards"
        :key="project.slug"
        :locale="locale"
        :project="project"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ProjectCard from "../components/ProjectCard.vue";
import { getListingPage, getProjectCards } from "../lib/content";
import { usePageSeo } from "../lib/seo";
import type { Locale } from "../types/content";

const props = defineProps<{
  locale: Locale;
}>();

const page = computed(() => getListingPage(`/${props.locale}/projects/`));
const projectCards = computed(() => getProjectCards());

usePageSeo(() => ({
  title: page.value?.title ?? "Projects",
  description: page.value?.description ?? "",
  path: `/${props.locale}/projects/`,
  locale: props.locale,
  type: "projects",
  alternatePath: page.value?.counterpartPath,
}));
</script>
