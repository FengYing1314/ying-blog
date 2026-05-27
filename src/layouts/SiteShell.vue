<template>
  <div class="site-shell">
    <PointerAura />
    <a class="skip-link" href="#main">{{ uiText.actions.skip[locale] }}</a>
    <SiteHeader />
    <main id="main" class="site-main">
      <slot />
    </main>
    <footer class="site-footer">
      <div class="shell-inner footer-inner">
        <span>{{ siteConfig.name[locale] }}</span>
        <span>{{
          locale === "zh"
            ? "个人记录、技术笔记与项目展示。"
            : "Personal records, technical notes, and projects."
        }}</span>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import PointerAura from "../components/PointerAura.vue";
import SiteHeader from "../components/SiteHeader.vue";
import { siteConfig, uiText } from "../config/site";
import { localeFromPath } from "../lib/paths";

const route = useRoute();
const locale = computed(() => localeFromPath(route.path));
</script>
