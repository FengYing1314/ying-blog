<template>
  <aside class="doc-sidebar" :aria-label="locale === 'zh' ? '随笔目录' : 'Notes directory'">
    <p class="sidebar-label">{{ locale === "zh" ? "随笔目录" : "Notes" }}</p>
    <nav>
      <RouterLink
        class="doc-sidebar-index"
        :to="localizedPath(locale, 'docs')"
        :class="{ active: !activeId }"
      >
        {{ uiText.listing.docs[locale] }}
      </RouterLink>

      <section v-for="group in docGroups" :key="group.section" class="doc-sidebar-group">
        <p class="doc-sidebar-section">{{ group.title }}</p>
        <RouterLink
          v-for="doc in group.docs"
          :key="doc.id"
          :to="doc.path"
          :class="{ active: doc.id === activeId }"
        >
          {{ doc.title }}
        </RouterLink>
      </section>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { uiText } from "../config/site";
import { getDocs } from "../lib/content";
import { localizedPath } from "../lib/paths";
import type { Locale } from "../types/content";

const props = defineProps<{
  locale: Locale;
  activeId?: string;
}>();

const sectionLabels: Record<string, Record<Locale, string>> = {
  guide: {
    zh: "随笔",
    en: "Notes",
  },
};

const docGroups = computed(() => {
  const groups = new Map<string, ReturnType<typeof getDocs>>();
  for (const doc of getDocs(props.locale)) {
    const section = doc.section ?? "guide";
    groups.set(section, [...(groups.get(section) ?? []), doc]);
  }

  return Array.from(groups.entries()).map(([section, docs]) => ({
    section,
    title: sectionLabels[section]?.[props.locale] ?? section,
    docs,
  }));
});
</script>
