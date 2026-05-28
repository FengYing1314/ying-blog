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
import { onMounted } from "vue";
import { Moon, Sun } from "@lucide/vue";
import { uiText } from "../config/site";
import { useTheme } from "../lib/theme";
import type { Locale } from "../types/content";

defineProps<{
  locale: Locale;
}>();

const { theme, syncTheme, toggleTheme } = useTheme();

onMounted(() => {
  syncTheme();
});
</script>
