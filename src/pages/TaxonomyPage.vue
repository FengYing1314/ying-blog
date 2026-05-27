<template>
  <div v-if="page" class="page listing-page shell-inner">
    <header class="page-header">
      <p class="eyebrow">{{ taxonomyLabel }}</p>
      <h1>{{ page.title }}</h1>
      <p>{{ page.description }}</p>
      <div class="page-summary" :aria-label="page.locale === 'zh' ? '页面统计' : 'Page summary'">
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

    <div v-if="entries.length" class="taxonomy-entry-groups">
      <section
        v-for="group in entryGroups"
        :key="group.type"
        class="taxonomy-entry-group"
        :aria-labelledby="`taxonomy-${page.id}-${group.type}`"
      >
        <div class="section-heading taxonomy-section-heading">
          <h2 :id="`taxonomy-${page.id}-${group.type}`">{{ group.label }}</h2>
          <span>{{ group.entries.length }}</span>
        </div>
        <div class="list-stack dense-list-stack">
          <ContentCard v-for="entry in group.entries" :key="entry.id" :entry="entry" />
        </div>
      </section>
    </div>
    <section v-else class="empty-state">
      <h2>{{ page.locale === "zh" ? "暂时没有内容" : "No content yet" }}</h2>
      <p>
        {{
          page.locale === "zh"
            ? "这个分类或标签目前只用于项目，暂时没有关联的文章或随笔。"
            : "This category or tag is currently used by projects and has no linked posts or notes."
        }}
      </p>
    </section>

    <div v-if="projectCards.length" class="taxonomy-projects">
      <div class="section-heading taxonomy-section-heading">
        <h2>{{ page.locale === "zh" ? "相关项目" : "Related Projects" }}</h2>
        <RouterLink :to="localizedPath(page.locale, 'projects')">
          {{ page.locale === "zh" ? "查看全部项目" : "View all projects" }}
        </RouterLink>
      </div>
      <div class="project-grid">
        <ProjectCard
          v-for="project in projectCards"
          :key="project.slug"
          :locale="page.locale"
          :project="project"
        />
      </div>
    </div>

    <nav
      class="taxonomy-return"
      :aria-label="page.locale === 'zh' ? '继续浏览' : 'Continue browsing'"
    >
      <RouterLink class="secondary-link" :to="localizedPath(page.locale, 'posts')">
        {{ page.locale === "zh" ? "全部文章" : "All posts" }}
      </RouterLink>
      <RouterLink class="secondary-link" :to="localizedPath(page.locale, 'docs')">
        {{ page.locale === "zh" ? "随笔目录" : "Notes index" }}
      </RouterLink>
    </nav>
  </div>
  <NotFoundPage v-else />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { FileText, FolderKanban } from "@lucide/vue";
import ContentCard from "../components/ContentCard.vue";
import ProjectCard from "../components/ProjectCard.vue";
import { registry, getTaxonomyEntries, getTaxonomyProjects } from "../lib/content";
import { localizedPath } from "../lib/paths";
import { usePageSeo } from "../lib/seo";
import type { ContentEntry } from "../types/content";
import NotFoundPage from "./NotFoundPage.vue";

const props = defineProps<{
  pageId: string;
}>();

const page = computed(() =>
  registry.taxonomyPages.find((candidate) => candidate.id === props.pageId),
);
const entries = computed(() => (page.value ? getTaxonomyEntries(page.value) : []));
const projectCards = computed(() => (page.value ? getTaxonomyProjects(page.value) : []));
const entryGroups = computed(() => {
  if (!page.value) {
    return [];
  }

  const groups: Array<{ type: ContentEntry["type"]; label: string; entries: ContentEntry[] }> = [
    {
      type: "posts",
      label: page.value.locale === "zh" ? "文章" : "Posts",
      entries: [],
    },
    {
      type: "docs",
      label: page.value.locale === "zh" ? "随笔" : "Notes",
      entries: [],
    },
    {
      type: "about",
      label: page.value.locale === "zh" ? "关于" : "About",
      entries: [],
    },
  ];

  for (const entry of entries.value) {
    groups.find((group) => group.type === entry.type)?.entries.push(entry);
  }

  return groups.filter((group) => group.entries.length > 0);
});
const entryCountLabel = computed(() => {
  const count = entries.value.length;
  return page.value?.locale === "zh" ? `${count} 篇内容` : `${count} entries`;
});
const projectCountLabel = computed(() => {
  const count = projectCards.value.length;
  return page.value?.locale === "zh" ? `${count} 个项目` : `${count} projects`;
});
const taxonomyLabel = computed(() => {
  if (!page.value) {
    return "";
  }

  if (page.value.taxonomyType === "categories") {
    return page.value.locale === "zh" ? "分类" : "Category";
  }

  return page.value.locale === "zh" ? "标签" : "Tag";
});

usePageSeo(() => {
  if (!page.value) {
    return undefined;
  }

  return {
    title: page.value.title,
    description: page.value.description,
    path: page.value.path,
    locale: page.value.locale,
    type: "taxonomy",
    alternatePath: page.value.counterpartPath,
  };
});
</script>
