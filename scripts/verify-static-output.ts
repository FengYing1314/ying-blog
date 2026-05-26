import { readFile } from "node:fs/promises";
import path from "node:path";
import { siteConfig } from "../src/config/site.ts";
import { contentRegistry } from "../src/generated/content.ts";
import { absoluteFileUrl, absoluteUrl, withBasePath } from "../src/lib/paths.ts";
import type { Locale } from "../src/types/content.ts";

const distDir = path.join(process.cwd(), "dist");
const pages = [
  ...contentRegistry.listingPages.map((page) => ({
    path: page.path,
    locale: page.locale,
    title: page.title,
    description: page.description,
  })),
  ...contentRegistry.entries.map((entry) => ({
    path: entry.path,
    locale: entry.locale,
    title: entry.title,
    description: entry.description,
  })),
  ...contentRegistry.taxonomyPages.map((page) => ({
    path: page.path,
    locale: page.locale,
    title: page.title,
    description: page.description,
  })),
];

for (const page of pages) {
  const html = await readFile(routeHtmlPath(page.path), "utf8");
  const expectedTitle =
    page.title === siteConfig.name[page.locale]
      ? page.title
      : `${page.title} | ${siteConfig.name[page.locale]}`;
  assertIncludes(html, `<html lang="${htmlLang(page.locale)}"`, page.path, "localized html lang");
  assertIncludes(html, `<title>${escapeHtml(expectedTitle)}</title>`, page.path, "page title");
  assertIncludes(
    html,
    `name="description" content="${escapeHtml(page.description)}"`,
    page.path,
    "description meta",
  );
  assertIncludes(
    html,
    `rel="canonical" href="${escapeHtml(absoluteUrl(page.path))}"`,
    page.path,
    "canonical link",
  );
  assertIncludes(
    html,
    `property="og:title" content="${escapeHtml(expectedTitle)}"`,
    page.path,
    "Open Graph title",
  );
  assertIncludes(
    html,
    `property="og:description" content="${escapeHtml(page.description)}"`,
    page.path,
    "Open Graph description",
  );
  assertIncludes(html, 'type="application/ld+json"', page.path, "JSON-LD script");
}

const staticNotFoundHtml = await readFile(path.join(distDir, "404.html"), "utf8");
assertIncludes(staticNotFoundHtml, "<title>页面未找到 | Ying Blog</title>", "/404/", "404 title");
assertIncludes(staticNotFoundHtml, 'name="robots" content="noindex"', "/404/", "404 noindex");
assertIncludes(staticNotFoundHtml, 'rel="canonical"', "/404/", "404 canonical link");

const rootHtml = await readFile(path.join(distDir, "index.html"), "utf8");
assertIncludes(rootHtml, `href="${escapeHtml(withBasePath("/favicon.svg"))}"`, "/", "favicon path");

const zhHomeHtml = await readFile(routeHtmlPath("/zh/"), "utf8");
assertIncludes(zhHomeHtml, `href="${escapeHtml(withBasePath("/rss.xml"))}"`, "/zh/", "RSS link");
assertIncludes(
  zhHomeHtml,
  `href="${escapeHtml(withBasePath("/zh/categories/engineering/"))}"`,
  "/zh/",
  "base-aware taxonomy link",
);
assertIncludes(
  zhHomeHtml,
  `href="${escapeHtml(withBasePath("/zh/tags/vue/"))}"`,
  "/zh/",
  "base-aware tag link",
);

const zhProjectsHtml = await readFile(routeHtmlPath("/zh/projects/"), "utf8");
assertIncludes(
  zhProjectsHtml,
  `href="${escapeHtml(withBasePath("/zh/categories/showcase/"))}"`,
  "/zh/projects/",
  "base-aware project category link",
);

const sitemapXml = await readFile(path.join(distDir, "sitemap.xml"), "utf8");
const publicPages = [
  ...contentRegistry.listingPages,
  ...contentRegistry.entries,
  ...contentRegistry.taxonomyPages,
];
for (const page of publicPages) {
  assertIncludes(
    sitemapXml,
    `<loc>${escapeXml(absoluteUrl(page.path))}</loc>`,
    page.path,
    "sitemap loc",
  );
  assertIncludes(
    sitemapXml,
    `href="${escapeXml(absoluteUrl(page.counterpartPath))}"`,
    page.path,
    "sitemap alternate link",
  );
}

const rssXml = await readFile(path.join(distDir, "rss.xml"), "utf8");
assertIncludes(rssXml, escapeXml(absoluteUrl("/en/")), "/rss.xml", "feed site URL");
for (const item of contentRegistry.rssItems) {
  assertIncludes(rssXml, escapeXml(absoluteUrl(item.path)), item.path, "RSS item link");
  assertIncludes(
    rssXml,
    escapeXml(`[${item.locale}] ${item.title}`),
    item.path,
    "RSS locale title",
  );
}
const projectRssPaths = contentRegistry.rssItems
  .filter((item) => item.type === "projects")
  .map((item) => item.path)
  .sort();
if (JSON.stringify(projectRssPaths) !== JSON.stringify(["/en/projects/", "/zh/projects/"])) {
  throw new Error(
    `RSS projects must only include localized project indexes: ${projectRssPaths.join(", ")}`,
  );
}

const robotsTxt = await readFile(path.join(distDir, "robots.txt"), "utf8");
assertIncludes(robotsTxt, "User-agent: *", "/robots.txt", "robots user agent");
assertIncludes(
  robotsTxt,
  `Sitemap: ${absoluteFileUrl("/sitemap.xml")}`,
  "/robots.txt",
  "robots sitemap URL",
);

function routeHtmlPath(routePath: string) {
  const segments = routePath
    .replace(/^\/|\/$/g, "")
    .split("/")
    .filter(Boolean);
  return path.join(distDir, ...segments, "index.html");
}

function htmlLang(locale: Locale) {
  return locale === "zh" ? "zh-CN" : "en";
}

function assertIncludes(html: string, expected: string, pagePath: string, label: string) {
  if (!html.includes(expected)) {
    throw new Error(`${pagePath} is missing ${label}: ${expected}`);
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "'",
    };
    return entities[char];
  });
}

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (char) => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;",
    };
    return entities[char];
  });
}
