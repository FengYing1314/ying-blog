<template>
  <section class="root-choice shell-inner">
    <h1>{{ siteConfig.name.zh }}</h1>
    <p>选择语言继续 / Choose a language to continue.</p>
    <div class="choice-actions">
      <RouterLink :to="localizedPath('zh')">中文</RouterLink>
      <RouterLink :to="localizedPath('en')">English</RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { siteConfig } from "../config/site";
import { localizedPath } from "../lib/paths";

const router = useRouter();

onMounted(() => {
  const language = navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
  void router.replace(localizedPath(language));
});
</script>
