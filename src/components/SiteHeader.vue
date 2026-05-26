<template>
  <header class="site-header">
    <div class="shell-inner header-inner">
      <RouterLink class="brand" :to="localizedPath(locale)">
        <span class="brand-mark">Y</span>
        <span>Ying Blog</span>
      </RouterLink>

      <nav class="desktop-nav" :aria-label="locale === 'zh' ? '主导航' : 'Primary'">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :class="{ active: isNavItemActive(item) }"
          :aria-current="isNavItemActive(item) ? 'location' : undefined"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="header-actions">
        <RouterLink
          class="icon-button language-button"
          :to="languageTarget"
          :aria-label="languageLabel"
          :title="languageLabel"
        >
          <Languages :size="18" aria-hidden="true" />
          <span>{{ languageCode }}</span>
        </RouterLink>
        <ThemeToggle :locale="locale" />
        <button
          ref="menuButton"
          class="icon-button mobile-menu-button"
          type="button"
          :aria-label="uiText.actions.menu[locale]"
          :aria-controls="drawerId"
          :aria-expanded="open"
          @click="openDrawer"
        >
          <Menu :size="20" aria-hidden="true" />
        </button>
      </div>
    </div>

    <Transition name="drawer-fade">
      <div
        :id="drawerId"
        v-if="open"
        class="mobile-drawer"
        role="dialog"
        aria-modal="true"
        :aria-label="uiText.actions.menu[locale]"
        @click.self="closeDrawer"
        @keydown.esc.window="closeDrawer"
      >
        <div
          :id="drawerPanelId"
          ref="drawerPanel"
          class="mobile-drawer-panel"
          @keydown="trapDrawerFocus"
        >
          <div class="mobile-drawer-header">
            <RouterLink class="brand" :to="localizedPath(locale)" @click="closeDrawer">
              <span class="brand-mark">Y</span>
              <span>Ying Blog</span>
            </RouterLink>
            <button
              ref="closeButton"
              class="icon-button"
              type="button"
              :aria-label="uiText.actions.close[locale]"
              @click="closeDrawer"
            >
              <X :size="20" aria-hidden="true" />
            </button>
          </div>
          <nav class="mobile-nav" :aria-label="locale === 'zh' ? '移动端主导航' : 'Mobile primary'">
            <RouterLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              :class="{ active: isNavItemActive(item) }"
              :aria-current="isNavItemActive(item) ? 'location' : undefined"
              @click="closeDrawer"
            >
              {{ item.label }}
            </RouterLink>
          </nav>
          <div
            class="mobile-drawer-tools"
            :aria-label="locale === 'zh' ? '显示设置' : 'Display settings'"
          >
            <RouterLink class="mobile-tool-link" :to="languageTarget" @click="closeDrawer">
              <Languages :size="18" aria-hidden="true" />
              <span>{{ languageLabel }}</span>
            </RouterLink>
            <div class="mobile-tool-row">
              <ThemeToggle :locale="locale" />
              <span>{{ uiText.actions.theme[locale] }}</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { Languages, Menu, X } from "@lucide/vue";
import { uiText } from "../config/site";
import { localeFromPath, localizedPath } from "../lib/paths";
import ThemeToggle from "./ThemeToggle.vue";

const route = useRoute();
const open = ref(false);
const menuButton = ref<HTMLButtonElement | null>(null);
const closeButton = ref<HTMLButtonElement | null>(null);
const drawerPanel = ref<HTMLDivElement | null>(null);
const lastFocusedElement = ref<HTMLElement | null>(null);
const locale = computed(() => localeFromPath(route.path));
const drawerId = "mobile-navigation-drawer";
const drawerPanelId = "mobile-navigation-panel";

type NavSection = "home" | "posts" | "docs" | "projects" | "about";
interface NavItem {
  section: NavSection;
  path: string;
  label: string;
}

const navItems = computed<NavItem[]>(() => [
  { section: "home", path: localizedPath(locale.value), label: uiText.nav.home[locale.value] },
  {
    section: "posts",
    path: localizedPath(locale.value, "posts"),
    label: uiText.nav.posts[locale.value],
  },
  {
    section: "docs",
    path: localizedPath(locale.value, "docs"),
    label: uiText.nav.docs[locale.value],
  },
  {
    section: "projects",
    path: localizedPath(locale.value, "projects"),
    label: uiText.nav.projects[locale.value],
  },
  {
    section: "about",
    path: localizedPath(locale.value, "about"),
    label: uiText.nav.about[locale.value],
  },
]);

const languageTarget = computed(() => {
  const target = route.meta.counterpartPath;
  return typeof target === "string" ? target : localizedPath(locale.value === "zh" ? "en" : "zh");
});
const targetLocale = computed(() => (locale.value === "zh" ? "en" : "zh"));
const languageCode = computed(() => (targetLocale.value === "zh" ? "中" : "EN"));
const languageLabel = computed(() =>
  locale.value === "zh" ? "切换到 English" : "Switch to Chinese",
);

function normalizeRoutePath(path: string) {
  return path.endsWith("/") ? path : `${path}/`;
}

function isNavItemActive(item: NavItem) {
  const currentPath = normalizeRoutePath(route.path);

  if (item.section === "home") {
    return currentPath === localizedPath(locale.value);
  }

  return currentPath.startsWith(localizedPath(locale.value, item.section));
}

function openDrawer() {
  if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
    lastFocusedElement.value = document.activeElement;
  } else {
    lastFocusedElement.value = menuButton.value;
  }

  open.value = true;
}

function closeDrawer() {
  open.value = false;
}

function trapDrawerFocus(event: KeyboardEvent) {
  if (!open.value || event.key !== "Tab" || !drawerPanel.value) {
    return;
  }

  const focusableElements = Array.from(
    drawerPanel.value.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => element.offsetParent !== null);

  const firstElement = focusableElements[0];
  const lastElement = focusableElements.at(-1);

  if (!firstElement || !lastElement || typeof document === "undefined") {
    return;
  }

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

watch(
  () => route.fullPath,
  () => {
    lastFocusedElement.value = null;
    open.value = false;
  },
);

watch(open, async (isOpen) => {
  if (typeof document === "undefined") {
    return;
  }

  document.body.classList.toggle("drawer-open", isOpen);

  await nextTick();

  if (isOpen) {
    closeButton.value?.focus();
    return;
  }

  const restoreTarget = lastFocusedElement.value;
  lastFocusedElement.value = null;
  if (restoreTarget?.isConnected) {
    restoreTarget.focus();
  }
});

onBeforeUnmount(() => {
  if (typeof document !== "undefined") {
    document.body.classList.remove("drawer-open");
  }
});
</script>
