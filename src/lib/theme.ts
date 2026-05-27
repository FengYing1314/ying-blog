import { ref } from "vue";

type Theme = "light" | "dark";

const storageKey = "ying-theme";
const theme = ref<Theme>("light");

function readDocumentTheme(): Theme {
  if (typeof document === "undefined") {
    return theme.value;
  }

  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function applyTheme(nextTheme: Theme) {
  theme.value = nextTheme;

  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = nextTheme;
  }

  if (typeof localStorage !== "undefined") {
    localStorage.setItem(storageKey, nextTheme);
  }
}

function syncTheme() {
  theme.value = readDocumentTheme();
}

function toggleTheme() {
  applyTheme(theme.value === "dark" ? "light" : "dark");
}

export function useTheme() {
  return {
    theme,
    syncTheme,
    toggleTheme,
  };
}
