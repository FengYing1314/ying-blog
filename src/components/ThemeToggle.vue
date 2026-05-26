<template>
  <button
    class="icon-button"
    type="button"
    :aria-label="uiText.actions.theme[locale]"
    :aria-pressed="theme === 'dark'"
    :title="uiText.actions.theme[locale]"
    @click="toggleTheme"
  >
    <Sun v-if="theme === 'dark'" :size="18" aria-hidden="true" />
    <Moon v-else :size="18" aria-hidden="true" />
  </button>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Moon, Sun } from "@lucide/vue";
import { uiText } from "../config/site";
import type { Locale } from "../types/content";

defineProps<{
  locale: Locale;
}>();

const theme = ref<"light" | "dark">("light");

onMounted(() => {
  const current = document.documentElement.dataset.theme;
  theme.value = current === "dark" ? "dark" : "light";
});

function toggleTheme() {
  theme.value = theme.value === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = theme.value;
  localStorage.setItem("ying-theme", theme.value);
}
</script>
