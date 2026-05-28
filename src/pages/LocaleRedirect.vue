<template>
  <section class="root-choice shell-inner">
    <h1>Ying Blog</h1>
    <p>Choose a language to continue.</p>
    <div class="choice-actions">
      <RouterLink :to="localizedPath('zh')">中文</RouterLink>
      <RouterLink :to="localizedPath('en')">English</RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { localizedPath } from "../lib/paths";
import { usePageSeo } from "../lib/seo";
import { siteConfig } from "../config/site";

const router = useRouter();

onMounted(() => {
  const language = navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
  void router.replace(localizedPath(language));
});

usePageSeo({
  title: siteConfig.name.zh,
  description: siteConfig.description.zh,
  path: "/",
  locale: "zh",
  type: "home",
  alternatePath: "/en/",
});
</script>
