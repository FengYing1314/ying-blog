<template>
  <article class="project-card">
    <div class="project-card-header">
      <div class="project-title-row">
        <FolderKanban :size="18" aria-hidden="true" />
        <h2>{{ project.title[locale] }}</h2>
      </div>
      <span>{{ project.status[locale] }}</span>
    </div>
    <p>{{ project.description[locale] }}</p>
    <dl class="project-facts">
      <div>
        <dt>{{ locale === "zh" ? "时间" : "Period" }}</dt>
        <dd>{{ project.period[locale] }}</dd>
      </div>
      <div>
        <dt>{{ locale === "zh" ? "角色" : "Role" }}</dt>
        <dd>{{ project.role[locale] }}</dd>
      </div>
    </dl>
    <div class="project-stack" :aria-label="locale === 'zh' ? '技术栈' : 'Tech stack'">
      <span v-for="item in project.stack" :key="item">{{ item }}</span>
    </div>
    <ul class="project-highlights">
      <li v-for="highlight in project.highlights" :key="highlight.en">
        {{ highlight[locale] }}
      </li>
    </ul>
    <p v-if="!hasExternalLinks" class="project-link-state">
      {{ locale === "zh" ? "当前以站内分类归档展示" : "Currently archived through site taxonomy" }}
    </p>
    <div class="taxonomy-links compact project-category-links">
      <RouterLink
        v-for="category in project.categories"
        :key="category"
        :to="localizedPath(locale, `categories/${category}`)"
      >
        {{ categoryLabel(category) }}
      </RouterLink>
    </div>
    <div class="taxonomy-links compact">
      <RouterLink v-for="tag in project.tags" :key="tag" :to="localizedPath(locale, `tags/${tag}`)"
        >#{{ tagLabel(tag) }}</RouterLink
      >
    </div>
    <div class="project-actions">
      <a v-if="projectUrl" :href="projectUrl" target="_blank" rel="noopener noreferrer">
        <ArrowUpRight :size="16" aria-hidden="true" />
        <span>{{ locale === "zh" ? "站点" : "Website" }}</span>
      </a>
      <a v-if="repositoryUrl" :href="repositoryUrl" target="_blank" rel="noopener noreferrer">
        <GitBranch :size="16" aria-hidden="true" />
        <span>{{ locale === "zh" ? "仓库" : "Repository" }}</span>
      </a>
      <RouterLink
        v-if="primaryCategory"
        :to="localizedPath(locale, `categories/${primaryCategory}`)"
      >
        <Layers :size="16" aria-hidden="true" />
        <span>{{ locale === "zh" ? "相关内容" : "Related content" }}</span>
      </RouterLink>
      <RouterLink v-else :to="localizedPath(locale, 'projects')">
        <Layers :size="16" aria-hidden="true" />
        <span>{{ locale === "zh" ? "项目索引" : "Project index" }}</span>
      </RouterLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ArrowUpRight, FolderKanban, GitBranch, Layers } from "@lucide/vue";
import { computed } from "vue";
import { categories, tags } from "../config/taxonomy";
import { localizedPath } from "../lib/paths";
import { sanitizeHref } from "../lib/urls";
import type { Locale, ProjectCard } from "../types/content";

const props = defineProps<{
  locale: Locale;
  project: ProjectCard;
}>();

const projectUrl = computed(() => sanitizeHref(props.project.url));
const repositoryUrl = computed(() => sanitizeHref(props.project.repository));
const primaryCategory = computed(() => props.project.categories[0]);
const hasExternalLinks = computed(() => Boolean(projectUrl.value || repositoryUrl.value));

function tagLabel(slug: string) {
  return tags.find((term) => term.slug === slug)?.label[props.locale] ?? slug;
}

function categoryLabel(slug: string) {
  return categories.find((term) => term.slug === slug)?.label[props.locale] ?? slug;
}
</script>
