<template>
  <aside
    v-if="headings.length"
    class="toc-nav"
    :aria-label="locale === 'zh' ? '本页目录' : 'Table of contents'"
  >
    <button
      v-if="collapsible"
      class="toc-toggle"
      type="button"
      :aria-expanded="expanded"
      :aria-controls="tocPanelId"
      @click="expanded = !expanded"
    >
      <span>{{ locale === "zh" ? "本页目录" : "On this page" }}</span>
      <ChevronDown :size="17" aria-hidden="true" />
    </button>
    <p v-else class="sidebar-label">{{ locale === "zh" ? "本页目录" : "On this page" }}</p>
    <nav :id="tocPanelId" :hidden="collapsible && !expanded">
      <a
        v-for="heading in headings"
        :key="heading.id"
        :href="`#${heading.id}`"
        :class="[`level-${heading.level}`, { active: activeId === heading.id }]"
        :aria-current="activeId === heading.id ? 'location' : undefined"
        @click="handleLinkClick"
      >
        {{ heading.title }}
      </a>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from "vue";
import { ChevronDown } from "@lucide/vue";
import type { Heading, Locale } from "../types/content";

const props = defineProps<{
  headings: Heading[];
  locale: Locale;
  collapsible?: boolean;
}>();

const activeId = ref(props.headings[0]?.id ?? "");
const expanded = ref(false);
let observer: IntersectionObserver | undefined;
const tocPanelId = useId();
const collapsible = computed(() => props.collapsible ?? false);

onMounted(() => {
  void observeHeadings();
});

watch(
  () => props.headings.map((heading) => heading.id).join("|"),
  () => {
    void observeHeadings();
  },
  { flush: "post" },
);

onBeforeUnmount(() => {
  observer?.disconnect();
});

async function observeHeadings() {
  await nextTick();
  observer?.disconnect();
  activeId.value = props.headings[0]?.id ?? "";

  if (!("IntersectionObserver" in window)) {
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (visible?.target.id) {
        activeId.value = visible.target.id;
      }
    },
    {
      rootMargin: "-96px 0px -70% 0px",
      threshold: [0, 1],
    },
  );

  props.headings.forEach((heading) => {
    const element = document.getElementById(heading.id);
    if (element) {
      observer?.observe(element);
    }
  });
}

function handleLinkClick() {
  if (collapsible.value) {
    expanded.value = false;
  }
}
</script>
