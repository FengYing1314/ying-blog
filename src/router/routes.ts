import type { RouteRecordRaw } from "vue-router";
import { locales } from "../config/site";
import { registry } from "../lib/content";
import HomePage from "../pages/HomePage.vue";
import NotFoundPage from "../pages/NotFoundPage.vue";

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
      component: () => import("../pages/PostsPage.vue"),
      props: { locale },
      meta: {
        locale,
        counterpartPath: `/${locale === "zh" ? "en" : "zh"}/posts/`,
      },
    },
    {
      path: `/${locale}/docs/`,
      name: `docs-${locale}`,
      component: () => import("../pages/DocsPage.vue"),
      props: { locale },
      meta: {
        locale,
        counterpartPath: `/${locale === "zh" ? "en" : "zh"}/docs/`,
      },
    },
    {
      path: `/${locale}/projects/`,
      name: `projects-${locale}`,
      component: () => import("../pages/ProjectsPage.vue"),
      props: { locale },
      meta: {
        locale,
        counterpartPath: `/${locale === "zh" ? "en" : "zh"}/projects/`,
      },
    },
    {
      path: `/${locale}/links/`,
      name: `links-${locale}`,
      component: () => import("../pages/LinksPage.vue"),
      props: { locale },
      meta: {
        locale,
        counterpartPath: `/${locale === "zh" ? "en" : "zh"}/links/`,
      },
    },
  ]),
  ...registry.entries.map((entry) => ({
    path: entry.path,
    name: entry.id,
    component: () => import("../pages/ContentPage.vue"),
    props: {
      entryId: entry.id,
    },
    meta: {
      locale: entry.locale,
      counterpartPath: entry.counterpartPath,
    },
  })),
  ...registry.taxonomyIndexPages.map((page) => ({
    path: page.path,
    name: page.id,
    component: () => import("../pages/TaxonomyIndexPage.vue"),
    props: {
      pageId: page.id,
    },
    meta: {
      locale: page.locale,
      counterpartPath: page.counterpartPath,
    },
  })),
  ...registry.taxonomyPages.map((page) => ({
    path: page.path,
    name: page.id,
    component: () => import("../pages/TaxonomyPage.vue"),
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
