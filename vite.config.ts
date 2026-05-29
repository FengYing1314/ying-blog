import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import type { ViteDevServer } from "vite";
import { siteConfig } from "./src/config/site.ts";
import { generateContent } from "./scripts/content/generate-content.ts";

function chunkGroup(id: string) {
  const normalizedId = id.replace(/\\/g, "/");
  if (
    normalizedId.includes("/node_modules/vue/") ||
    normalizedId.includes("/node_modules/vue-router/") ||
    normalizedId.includes("/node_modules/@vue/") ||
    normalizedId.includes("/node_modules/@unhead/")
  ) {
    return "vendor-vue";
  }
}

export default defineConfig(async () => {
  process.env.VITE_SITE_URL ??= process.env.SITE_URL ?? siteConfig.url;
  process.env.VITE_BASE_PATH ??= process.env.BASE_PATH ?? siteConfig.basePath;
  process.env.VITE_GOOGLE_SITE_VERIFICATION ??=
    process.env.GOOGLE_SITE_VERIFICATION ?? siteConfig.verification.google;
  process.env.VITE_BING_SITE_VERIFICATION ??=
    process.env.BING_SITE_VERIFICATION ?? siteConfig.verification.bing;

  await generateContent();

  return {
    base: siteConfig.basePath,
    resolve: {
      alias: {
        mermaid: "mermaid/dist/mermaid.esm.min.mjs",
      },
    },
    plugins: [
      vue(),
      {
        name: "ying-content-registry",
        configureServer(server: ViteDevServer) {
          const watched = ["src/content/**/*.md", "src/config/**/*.ts"];
          watched.forEach((pattern) => server.watcher.add(pattern));
          server.watcher.on("change", async (changedPath: string) => {
            if (
              changedPath.includes("/src/content/") ||
              changedPath.includes("\\src\\content\\") ||
              changedPath.includes("/src/config/") ||
              changedPath.includes("\\src\\config\\")
            ) {
              await generateContent();
            }
          });
        },
      },
    ],
    ssgOptions: {
      script: "async",
    },
    build: {
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          manualChunks: chunkGroup,
        },
      },
    },
  };
});
