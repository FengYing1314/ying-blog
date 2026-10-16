import vue from "@vitejs/plugin-vue";
import path from "node:path";
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
          const watched = ["src/content", "src/config"];
          server.watcher.add(
            watched.map((directory) => path.resolve(server.config.root, directory)),
          );
          let pendingGeneration = Promise.resolve();
          const updateContent = (changedPath: string) => {
            if (
              changedPath.includes("/src/content/") ||
              changedPath.includes("\\src\\content\\") ||
              changedPath.includes("/src/config/") ||
              changedPath.includes("\\src\\config\\")
            ) {
              // 串行生成，避免连续文件事件让旧结果覆盖新结果。
              pendingGeneration = pendingGeneration
                .then(async () => {
                  await generateContent(server.config.root);
                })
                .catch((error: unknown) => {
                  server.config.logger.error(
                    `[content-registry] ${error instanceof Error ? error.message : String(error)}`,
                  );
                });
            }
          };
          for (const event of ["add", "change", "unlink"] as const) {
            server.watcher.on(event, updateContent);
          }
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
