import type { RouteRecordRaw } from "vue-router";
import { registry } from "../lib/content";
import { locales } from "../config/site";
import ContentPage from "../pages/ContentPage.vue";
import DocsPage from "../pages/DocsPage.vue";
import HomePage from "../pages/HomePage.vue";
import NotFoundPage from "../pages/NotFoundPage.vue";
import PostsPage from "../pages/PostsPage.vue";
import ProjectsPage from "../pages/ProjectsPage.vue";
import TaxonomyPage from "../pages/TaxonomyPage.vue";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "root",
    component: HomePage,
    props: { locale: "zh" },
    meta: {
      locale: "zh",
      counterpartPath: "/en/",
    },
  },
  ...locales.flatMap((locale) => [
    {
      path: `/${locale}/`,
      name: `home-${locale}`,
      component: HomePage,
      props: { locale },
      meta: {
        locale,
        counterpartPath: `/${locale === "zh" ? "en" : "zh"}/`,
      },
    },
    {
      path: `/${locale}/posts/`,
      name: `posts-${locale}`,
      component: PostsPage,
      props: { locale },
      meta: {
        locale,
        counterpartPath: `/${locale === "zh" ? "en" : "zh"}/posts/`,
      },
    },
    {
      path: `/${locale}/docs/`,
      name: `docs-${locale}`,
      component: DocsPage,
      props: { locale },
      meta: {
        locale,
        counterpartPath: `/${locale === "zh" ? "en" : "zh"}/docs/`,
      },
    },
    {
      path: `/${locale}/projects/`,
      name: `projects-${locale}`,
      component: ProjectsPage,
      props: { locale },
      meta: {
        locale,
        counterpartPath: `/${locale === "zh" ? "en" : "zh"}/projects/`,
      },
    },
  ]),
  ...registry.entries.map((entry) => ({
    path: entry.path,
    name: entry.id,
    component: ContentPage,
    props: {
      entryId: entry.id,
    },
    meta: {
      locale: entry.locale,
      counterpartPath: entry.counterpartPath,
    },
  })),
  ...registry.taxonomyPages.map((page) => ({
    path: page.path,
    name: page.id,
    component: TaxonomyPage,
    props: {
      pageId: page.id,
    },
    meta: {
      locale: page.locale,
      counterpartPath: page.counterpartPath,
    },
  })),
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFoundPage,
  },
];
