import { ViteSSG } from "vite-ssg";
import App from "./App.vue";
import { siteConfig } from "./config/site";
import { registry } from "./lib/content";
import { routes } from "./router/routes";
import "./styles/index.css";

export const createApp = ViteSSG(App, {
  base: siteConfig.basePath,
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }

    if (to.hash) {
      return {
        el: to.hash,
        top: 84,
      };
    }

    return {
      top: 0,
    };
  },
});

export function includedRoutes() {
  return [...registry.routes, "/404/"];
}
