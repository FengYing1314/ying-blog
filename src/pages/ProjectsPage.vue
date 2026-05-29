<template>
  <div class="page projects-page shell-inner">
    <header class="page-header">
      <p class="eyebrow">{{ locale === "zh" ? "项目" : "Projects" }}</p>
      <h1>{{ page?.title }}</h1>
      <p>{{ page?.description }}</p>
      <div class="page-summary" :aria-label="locale === 'zh' ? '项目统计' : 'Project summary'">
        <span>{{ featuredCountLabel }}</span>
        <span>{{ stackCountLabel }}</span>
        <span>{{ externalCountLabel }}</span>
      </div>
    </header>

    <section
      class="project-filter-panel"
      :aria-label="locale === 'zh' ? '项目分组' : 'Project groups'"
    >
      <RouterLink
        v-for="group in projectGroups"
        :key="group.slug"
        :to="localizedPath(locale, `categories/${group.slug}`)"
      >
        <span>{{ group.label }}</span>
        <strong>{{ group.count }}</strong>
      </RouterLink>
    </section>

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
import { categories } from "../config/taxonomy";
import { getListingPage, getProjectCards } from "../lib/content";
import { localizedPath } from "../lib/paths";
import { usePageSeo } from "../lib/seo";
import type { Locale } from "../types/content";

const props = defineProps<{
  locale: Locale;
}>();

const page = computed(() => getListingPage(`/${props.locale}/projects/`));
const projectCards = computed(() => getProjectCards());
const featuredCountLabel = computed(() => {
  const count = projectCards.value.filter((project) => project.featured).length;
  return props.locale === "zh" ? `${count} 个精选项目` : `${count} featured`;
});
const stackCountLabel = computed(() => {
  const count = new Set(projectCards.value.flatMap((project) => project.stack)).size;
  return props.locale === "zh" ? `${count} 项技术栈` : `${count} stack items`;
});
const externalCountLabel = computed(() => {
  const count = projectCards.value.filter((project) => project.url || project.repository).length;
  return props.locale === "zh" ? `${count} 个外链项目` : `${count} with external links`;
});
const projectGroups = computed(() =>
  categories
    .map((category) => ({
      slug: category.slug,
      label: category.label[props.locale],
      count: projectCards.value.filter((project) => project.categories.includes(category.slug))
        .length,
    }))
    .filter((group) => group.count > 0),
);

usePageSeo(() => ({
  title: page.value?.title ?? "Projects",
  description: page.value?.description ?? "",
  path: `/${props.locale}/projects/`,
  locale: props.locale,
  type: "projects",
  alternatePath: page.value?.counterpartPath,
}));
</script>
