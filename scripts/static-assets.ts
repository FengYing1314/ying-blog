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
await writeFile(path.join(distDir, "llms.txt"), renderLlmsText(false));
await writeFile(path.join(distDir, "llms-full.txt"), renderLlmsText(true));
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
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(defaultAlternateUrl(page))}" />`,
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
  const feedImage = absoluteFileUrl(siteConfig.seo.image);
  const feed = new Feed({
    title: siteConfig.name.en,
    description: siteConfig.description.en,
    id: absoluteUrl("/en/"),
    link: absoluteUrl("/en/"),
    language: "en",
    image: feedImage,
    favicon: feedImage,
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
  const allowedAgents = [
    "*",
    "Googlebot",
    "Bingbot",
    "DuckDuckBot",
    "Baiduspider",
    "YandexBot",
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-SearchBot",
    "PerplexityBot",
    "CCBot",
    "Google-Extended",
  ];

  return [
    ...allowedAgents.flatMap((agent) => [`User-agent: ${agent}`, "Allow: /", ""]),
    `Sitemap: ${absoluteFileUrl("/sitemap.xml")}`,
    "",
  ].join("\n");
}

function renderLlmsText(full: boolean) {
  const sections = [
    "# Ying Blog",
    "",
    siteConfig.description.en,
    "",
    "Ying Blog is a bilingual static site baseline for posts, docs, project cards, and pure static deployment notes.",
    "",
    "## Site Metadata",
    "",
    `- Canonical site: ${siteConfig.url}`,
    `- Sitemap: ${absoluteFileUrl("/sitemap.xml")}`,
    `- RSS: ${absoluteFileUrl("/rss.xml")}`,
    `- Preferred languages: zh-CN and en`,
    `- AI crawler policy: ${siteConfig.ai.policy}`,
    "",
    "## Primary Entry Points",
    "",
    ...contentRegistry.listingPages.map(
      (page) => `- ${page.title} (${page.locale}): ${absoluteUrl(page.path)} - ${page.description}`,
    ),
    "",
    "## Content Index",
    "",
    ...contentRegistry.entries.map(
      (entry) =>
        `- ${entry.title} (${entry.locale}, ${entry.type}, ${entry.date}): ${absoluteUrl(entry.path)} - ${entry.description}`,
    ),
  ];

  if (full) {
    sections.push(
      "",
      "## Taxonomy Pages",
      "",
      ...contentRegistry.taxonomyPages.map(
        (page) =>
          `- ${page.title} (${page.locale}, ${page.taxonomyType}): ${absoluteUrl(page.path)} - ${page.description}`,
      ),
      "",
      "## Project Cards",
      "",
      ...contentRegistry.projects.map(
        (project) =>
          `- ${project.title.en}: ${project.description.en} Categories: ${project.categories.join(", ")}. Tags: ${project.tags.join(", ")}.`,
      ),
    );
  }

  sections.push("");
  return sections.join("\n");
}

function hreflang(locale: Locale) {
  return locale === "zh" ? "zh-CN" : "en";
}

function defaultAlternateUrl(page: { path: string; alternatePath: string; locale: Locale }) {
  return page.locale === "zh" ? absoluteUrl(page.path) : absoluteUrl(page.alternatePath);
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
