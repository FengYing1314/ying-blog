import { copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { Feed } from "feed";
import { siteConfig } from "../src/config/site.ts";
import { contentRegistry as generatedContentRegistry } from "../src/generated/content.ts";
import { absoluteFileUrl, absoluteUrl } from "../src/lib/paths.ts";
import type { ContentRegistry, Locale } from "../src/types/content.ts";

const distDir = path.join(process.cwd(), "dist");
const contentRegistry: ContentRegistry = generatedContentRegistry;
const buildDate = localDateString();

await mkdir(distDir, { recursive: true });
await writeFile(path.join(distDir, "sitemap.xml"), renderSitemap());
await writeFile(path.join(distDir, "rss.xml"), renderRss());
await writeFile(path.join(distDir, "robots.txt"), renderRobots());
await copyFile(path.join(distDir, "404", "index.html"), path.join(distDir, "404.html"));

function renderSitemap() {
  const pages = [
    ...contentRegistry.listingPages.map((page) => ({
      path: page.path,
      alternatePath: page.counterpartPath,
      locale: page.locale,
      lastmod: buildDate,
    })),
    ...contentRegistry.entries.map((entry) => ({
      path: entry.path,
      alternatePath: entry.counterpartPath,
      locale: entry.locale,
      lastmod: entry.updated ?? entry.date,
    })),
    ...contentRegistry.taxonomyPages.map((page) => ({
      path: page.path,
      alternatePath: page.counterpartPath,
      locale: page.locale,
      lastmod: buildDate,
    })),
  ];

  const urls = pages
    .map((page) => {
      const opposite = page.locale === "zh" ? "en" : "zh-CN";
      return [
        "  <url>",
        `    <loc>${escapeXml(absoluteUrl(page.path))}</loc>`,
        `    <lastmod>${page.lastmod}</lastmod>`,
        `    <xhtml:link rel="alternate" hreflang="${hreflang(page.locale)}" href="${escapeXml(absoluteUrl(page.path))}" />`,
        `    <xhtml:link rel="alternate" hreflang="${opposite}" href="${escapeXml(absoluteUrl(page.alternatePath))}" />`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    urls,
    "</urlset>",
    "",
  ].join("\n");
}

function renderRss() {
  const feed = new Feed({
    title: siteConfig.name.en,
    description: siteConfig.description.en,
    id: absoluteUrl("/en/"),
    link: absoluteUrl("/en/"),
    language: "en",
    image: absoluteFileUrl("/favicon.svg"),
    favicon: absoluteFileUrl("/favicon.svg"),
    copyright: `Copyright ${new Date().getFullYear()} ${siteConfig.author}`,
    updated: new Date(contentRegistry.generatedAt),
  });

  for (const item of contentRegistry.rssItems) {
    feed.addItem({
      id: absoluteUrl(item.path),
      link: absoluteUrl(item.path),
      title: `[${item.locale}] ${item.title}`,
      description: item.description,
      date: new Date(item.date),
    });
  }

  return feed.rss2();
}

function renderRobots() {
  return ["User-agent: *", "Allow: /", "", `Sitemap: ${absoluteFileUrl("/sitemap.xml")}`, ""].join(
    "\n",
  );
}

function hreflang(locale: Locale) {
  return locale === "zh" ? "zh-CN" : "en";
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

function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}
