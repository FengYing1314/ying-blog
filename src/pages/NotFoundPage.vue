<template>
  <section class="page shell-inner not-found-page">
    <p class="eyebrow">404</p>
    <h1>{{ copy.title }}</h1>
    <p>{{ copy.description }}</p>
    <div class="not-found-actions" :aria-label="copy.actionsLabel">
      <RouterLink class="primary-link" :to="localizedPath(locale)">
        <Home :size="17" aria-hidden="true" />
        <span>{{ copy.home }}</span>
      </RouterLink>
      <RouterLink class="secondary-link" :to="localizedPath(locale, 'docs')">
        <BookOpen :size="17" aria-hidden="true" />
        <span>{{ copy.docs }}</span>
      </RouterLink>
      <RouterLink class="secondary-link" :to="localizedPath(locale, 'posts')">
        <FileText :size="17" aria-hidden="true" />
        <span>{{ copy.posts }}</span>
      </RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { BookOpen, FileText, Home } from "@lucide/vue";
import { localeFromPath, localizedPath } from "../lib/paths";
import { usePageSeo } from "../lib/seo";

const route = useRoute();
const locale = computed(() => localeFromPath(route.path));
const copy = computed(() =>
  locale.value === "zh"
    ? {
        title: "页面未找到",
        description: "这个地址不存在，或者对应页面还没有生成。",
        actionsLabel: "可返回的页面",
        home: "返回首页",
        docs: "查看文档",
        posts: "阅读文章",
      }
    : {
        title: "Page not found",
        description: "This address does not exist, or the page has not been generated.",
        actionsLabel: "Available destinations",
        home: "Return home",
        docs: "View docs",
        posts: "Read posts",
      },
);

usePageSeo(() => ({
  title: copy.value.title,
  description: copy.value.description,
  path: route.path === "/404/" ? "/404/" : route.path,
  locale: locale.value,
  type: "not-found",
}));
</script>
