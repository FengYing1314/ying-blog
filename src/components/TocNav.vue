<template>
  <aside
    v-if="headings.length"
    class="toc-nav"
    :aria-label="locale === 'zh' ? '本页目录' : 'Table of contents'"
  >
    <p class="sidebar-label">{{ locale === "zh" ? "本页目录" : "On this page" }}</p>
    <nav>
      <a
        v-for="heading in headings"
        :key="heading.id"
        :href="`#${heading.id}`"
        :class="[`level-${heading.level}`, { active: activeId === heading.id }]"
        :aria-current="activeId === heading.id ? 'location' : undefined"
      >
        {{ heading.title }}
      </a>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { Heading, Locale } from "../types/content";

const props = defineProps<{
  headings: Heading[];
  locale: Locale;
}>();

const activeId = ref(props.headings[0]?.id ?? "");
let observer: IntersectionObserver | undefined;

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
</script>
