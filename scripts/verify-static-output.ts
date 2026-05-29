import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { siteConfig } from "../src/config/site.ts";
import { contentRegistry } from "../src/generated/content.ts";
import { absoluteFileUrl, absoluteUrl, withBasePath } from "../src/lib/paths.ts";
import type {
  ContentEntry,
  ListingPage,
  Locale,
  PageType,
  TaxonomyIndexPage,
  TaxonomyPage,
} from "../src/types/content.ts";

const distDir = path.join(process.cwd(), "dist");
const assetsDir = path.join(distDir, "assets");
const defaultImage = absoluteFileUrl(siteConfig.seo.image);
const assetBudgets = {
  initialJs: 180 * 1024,
  maxJs: 700 * 1024,
  mermaidJsTotal: 3_300 * 1024,
  css: 80 * 1024,
} as const;

interface PageCheck {
  path: string;
  canonicalPath?: string;
  locale: Locale;
  title: string;
  description: string;
  type: PageType;
  counterpartPath?: string;
  date?: string;
  updated?: string;
  image?: string;
}

const rootPage: PageCheck = {
  path: "/",
  canonicalPath: "/zh/",
  locale: "zh" as const,
  title: siteConfig.name.zh,
  description: siteConfig.description.zh,
  type: "home" as const,
  counterpartPath: "/en/",
};
const listingPages = contentRegistry.listingPages as readonly ListingPage[];
const entries = contentRegistry.entries as readonly ContentEntry[];
const taxonomyIndexPages = contentRegistry.taxonomyIndexPages as readonly TaxonomyIndexPage[];
const taxonomyPages = contentRegistry.taxonomyPages as readonly TaxonomyPage[];
const pages: PageCheck[] = [
  rootPage,
  ...listingPages.map((page) => ({
    path: page.path,
    locale: page.locale,
    title: page.title,
    description: page.description,
    type: page.type,
    counterpartPath: page.counterpartPath,
  })),
  ...entries.map((entry) => ({
    path: entry.path,
    locale: entry.locale,
    title: entry.seoTitle ?? entry.title,
    description: entry.description,
    type: entry.type,
    counterpartPath: entry.counterpartPath,
    date: entry.date,
    updated: entry.updated,
    image: entry.image,
  })),
  ...taxonomyIndexPages.map((page) => ({
    path: page.path,
    locale: page.locale,
    title: page.title,
    description: page.description,
    type: page.type,
    counterpartPath: page.counterpartPath,
  })),
  ...taxonomyPages.map((page) => ({
    path: page.path,
    locale: page.locale,
    title: page.title,
    description: page.description,
    type: page.type,
    counterpartPath: page.counterpartPath,
  })),
];

for (const page of pages) {
  const html = await readFile(routeHtmlPath(page.path), "utf8");
  const expectedTitle = pageTitle(page.title, page.locale);
  const canonicalPath = page.canonicalPath ?? page.path;
  const canonical = absoluteUrl(canonicalPath);
  const image = "image" in page && page.image ? absoluteFileUrl(page.image) : defaultImage;

  assertIncludes(html, `<html lang="${htmlLang(page.locale)}"`, page.path, "localized html lang");
  assertIncludes(html, `<title>${escapeHtml(expectedTitle)}</title>`, page.path, "page title");
  assertTitleQuality(expectedTitle, page.path);
  assertIncludes(
    html,
    `name="description" content="${escapeHtml(page.description)}"`,
    page.path,
    "description meta",
  );
  assertDescriptionQuality(page.description, page.path);
  assertIncludes(
    html,
    `rel="canonical" href="${escapeHtml(canonical)}"`,
    page.path,
    "canonical link",
  );
  assertIncludes(
    html,
    `rel="alternate" hreflang="${htmlLang(page.locale)}" href="${escapeHtml(canonical)}"`,
    page.path,
    "self hreflang link",
  );
  assertIncludes(
    html,
    `rel="alternate" hreflang="x-default"`,
    page.path,
    "x-default hreflang link",
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
  assertIncludes(
    html,
    `property="og:url" content="${escapeHtml(canonical)}"`,
    page.path,
    "Open Graph URL",
  );
  assertIncludes(
    html,
    `property="og:site_name" content="${escapeHtml(siteConfig.name[page.locale])}"`,
    page.path,
    "Open Graph site name",
  );
  assertIncludes(
    html,
    `property="og:image" content="${escapeHtml(image)}"`,
    page.path,
    "Open Graph image",
  );
  assertIncludes(
    html,
    `name="twitter:image" content="${escapeHtml(image)}"`,
    page.path,
    "Twitter image",
  );
  assertIncludes(html, 'type="application/ld+json"', page.path, "JSON-LD script");
  assertJsonLdScriptCount(html, page.path);
  assertJsonLd(html, page, canonical);
  assertImagesHaveAlt(html, page.path);
}

const staticNotFoundHtml = await readFile(path.join(distDir, "404.html"), "utf8");
assertIncludes(staticNotFoundHtml, "<title>页面未找到 | Ying Blog</title>", "/404/", "404 title");
assertIncludes(staticNotFoundHtml, 'name="robots" content="noindex"', "/404/", "404 noindex");
assertIncludes(staticNotFoundHtml, 'rel="canonical"', "/404/", "404 canonical link");
assertIncludes(staticNotFoundHtml, 'property="og:image"', "/404/", "404 Open Graph image");
assertImagesHaveAlt(staticNotFoundHtml, "/404/");

const rootHtml = await readFile(path.join(distDir, "index.html"), "utf8");
assertIncludes(rootHtml, `href="${escapeHtml(withBasePath("/favicon.svg"))}"`, "/", "favicon path");
assertIncludes(rootHtml, `href="${escapeHtml(withBasePath("/zh/"))}"`, "/", "root zh link");
assertIncludes(rootHtml, `href="${escapeHtml(withBasePath("/en/"))}"`, "/", "root en link");
assertIncludes(
  rootHtml,
  `rel="canonical" href="${escapeHtml(absoluteUrl("/zh/"))}"`,
  "/",
  "root canonical alias",
);
assertNotIncludes(
  rootHtml,
  `rel="canonical" href="${escapeHtml(absoluteUrl("/"))}"`,
  "/",
  "root canonical URL",
);

const zhHomeHtml = await readFile(routeHtmlPath("/zh/"), "utf8");
assertIncludes(zhHomeHtml, `href="${escapeHtml(withBasePath("/rss.xml"))}"`, "/zh/", "RSS link");
assertIncludes(
  zhHomeHtml,
  `href="${escapeHtml(withBasePath("/zh/categories/"))}"`,
  "/zh/",
  "base-aware category index link",
);
assertIncludes(
  zhHomeHtml,
  `href="${escapeHtml(withBasePath("/zh/tags/"))}"`,
  "/zh/",
  "base-aware tag index link",
);
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
assertIncludes(zhProjectsHtml, "技术栈", "/zh/projects/", "project stack label");
assertIncludes(zhProjectsHtml, "站点架构与内容系统", "/zh/projects/", "project role");

const zhPostsHtml = await readFile(routeHtmlPath("/zh/posts/"), "utf8");
assertIncludes(zhPostsHtml, "归档入口", "/zh/posts/", "post archive panel");
assertIncludes(zhPostsHtml, `href="#posts-2026"`, "/zh/posts/", "post year archive anchor");

const zhCategoriesHtml = await readFile(routeHtmlPath("/zh/categories/"), "utf8");
assertIncludes(
  zhCategoriesHtml,
  `href="${escapeHtml(withBasePath("/zh/categories/engineering/"))}"`,
  "/zh/categories/",
  "category index term link",
);
assertIncludes(
  zhCategoriesHtml,
  `href="${escapeHtml(withBasePath("/zh/projects/"))}"`,
  "/zh/categories/",
  "category index project return link",
);
const enTagsHtml = await readFile(routeHtmlPath("/en/tags/"), "utf8");
assertIncludes(
  enTagsHtml,
  `href="${escapeHtml(withBasePath("/en/tags/vue/"))}"`,
  "/en/tags/",
  "tag index term link",
);

const zhPostHtml = await readFile(routeHtmlPath("/zh/posts/building-this-site/"), "utf8");
assertIncludes(zhPostHtml, 'class="breadcrumb"', "/zh/posts/building-this-site/", "breadcrumb");
assertIncludes(zhPostHtml, "返回文章列表", "/zh/posts/building-this-site/", "content return link");
assertIncludes(
  zhPostHtml,
  'class="reading-progress"',
  "/zh/posts/building-this-site/",
  "reading progress",
);
assertIncludes(zhPostHtml, "相关内容", "/zh/posts/building-this-site/", "related content");

const sitemapXml = await readFile(path.join(distDir, "sitemap.xml"), "utf8");
assertNoExampleDomain(sitemapXml, "/sitemap.xml");
const publicPages = [...listingPages, ...entries, ...taxonomyIndexPages, ...taxonomyPages];
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
  assertIncludes(sitemapXml, 'hreflang="x-default"', page.path, "sitemap x-default link");
}
assertNotIncludes(sitemapXml, "<loc>https://ying-blog.example.com", "/sitemap.xml", "example URL");
assertNotIncludes(
  sitemapXml,
  `<loc>${escapeXml(absoluteUrl("/"))}</loc>`,
  "/sitemap.xml",
  "root loc",
);
assertNotIncludes(sitemapXml, "/404/", "/sitemap.xml", "404 route");
assertNotIncludes(sitemapXml, "/projects/ying-blog/", "/sitemap.xml", "project detail route");

const rssXml = await readFile(path.join(distDir, "rss.xml"), "utf8");
assertNoExampleDomain(rssXml, "/rss.xml");
assertIncludes(rssXml, escapeXml(absoluteUrl("/en/")), "/rss.xml", "feed site URL");
assertIncludes(rssXml, escapeXml(defaultImage), "/rss.xml", "feed image");
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
for (const agent of ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot"]) {
  assertIncludes(robotsTxt, `User-agent: ${agent}`, "/robots.txt", `${agent} rule`);
}
assertIncludes(
  robotsTxt,
  `Sitemap: ${absoluteFileUrl("/sitemap.xml")}`,
  "/robots.txt",
  "robots sitemap URL",
);
assertNoExampleDomain(robotsTxt, "/robots.txt");

const llmsTxt = await readFile(path.join(distDir, "llms.txt"), "utf8");
const llmsFullTxt = await readFile(path.join(distDir, "llms-full.txt"), "utf8");
for (const [label, value] of [
  ["/llms.txt", llmsTxt],
  ["/llms-full.txt", llmsFullTxt],
] as const) {
  assertIncludes(value, "# Ying Blog", label, "LLM title");
  assertIncludes(value, absoluteFileUrl("/sitemap.xml"), label, "LLM sitemap link");
  assertIncludes(value, absoluteFileUrl("/rss.xml"), label, "LLM RSS link");
  assertIncludes(value, absoluteUrl("/zh/"), label, "LLM zh home link");
  assertIncludes(value, absoluteUrl("/en/"), label, "LLM en home link");
  assertIncludes(value, absoluteUrl("/zh/categories/"), label, "LLM zh categories link");
  assertIncludes(value, absoluteUrl("/en/tags/"), label, "LLM en tags link");
  assertNoExampleDomain(value, label);
  assertNotIncludes(value, "G:/", label, "local path");
  assertNotIncludes(value, "C:/", label, "local path");
}
await assertDefaultShareImage();
await assertAssetBudgets();

function routeHtmlPath(routePath: string) {
  if (routePath === "/") {
    return path.join(distDir, "index.html");
  }

  const segments = routePath
    .replace(/^\/|\/$/g, "")
    .split("/")
    .filter(Boolean);
  return path.join(distDir, ...segments, "index.html");
}

function htmlLang(locale: Locale) {
  return locale === "zh" ? "zh-CN" : "en";
}

function pageTitle(title: string, locale: Locale) {
  return title === siteConfig.name[locale]
    ? siteConfig.seo.title[locale]
    : `${title} | ${siteConfig.name[locale]}`;
}

function assertJsonLd(
  html: string,
  page: { path: string; title: string; description: string; type: PageType; locale: Locale },
  canonical: string,
) {
  const match = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(html);
  if (!match) {
    throw new Error(`${page.path} is missing parseable JSON-LD script`);
  }

  const parsed = JSON.parse(unescapeHtml(match[1]));
  const graph = Array.isArray(parsed["@graph"]) ? parsed["@graph"] : [];
  const pageNode = graph.find((node) => {
    const type = node?.["@type"];
    if (Array.isArray(type)) {
      return type.includes(expectedSchemaType(page.type));
    }
    return type === expectedSchemaType(page.type);
  });

  if (!pageNode) {
    throw new Error(`${page.path} JSON-LD is missing ${expectedSchemaType(page.type)} node`);
  }
  if (pageNode.description !== page.description) {
    throw new Error(`${page.path} JSON-LD has unexpected description`);
  }
  if (pageNode.url !== canonical) {
    throw new Error(`${page.path} JSON-LD has unexpected URL`);
  }
  if (!pageNode.image) {
    throw new Error(`${page.path} JSON-LD is missing image`);
  }
}

function assertJsonLdScriptCount(html: string, pagePath: string) {
  const count = html.match(/<script type="application\/ld\+json">/g)?.length ?? 0;
  if (count !== 1) {
    throw new Error(`${pagePath} must have exactly one JSON-LD script, found ${count}`);
  }
}

async function assertDefaultShareImage() {
  if (!siteConfig.seo.image.endsWith(".png")) {
    throw new Error(`Default share image must be a PNG file: ${siteConfig.seo.image}`);
  }

  const imagePath = path.join(distDir, siteConfig.seo.image.replace(/^\/+/, ""));
  const image = await readFile(imagePath);
  if (
    image.length < 24 ||
    image[0] !== 0x89 ||
    image[1] !== 0x50 ||
    image[2] !== 0x4e ||
    image[3] !== 0x47
  ) {
    throw new Error(`Default share image is not a valid PNG: ${siteConfig.seo.image}`);
  }

  const width = image.readUInt32BE(16);
  const height = image.readUInt32BE(20);
  if (width !== siteConfig.seo.imageWidth || height !== siteConfig.seo.imageHeight) {
    throw new Error(
      `Default share image must be ${siteConfig.seo.imageWidth}x${siteConfig.seo.imageHeight}, got ${width}x${height}`,
    );
  }
}

async function assertAssetBudgets() {
  const assets = await readdir(assetsDir, { withFileTypes: true });
  const files = await Promise.all(
    assets
      .filter((asset) => asset.isFile())
      .map(async (asset) => {
        const filePath = path.join(assetsDir, asset.name);
        const contents = await readFile(filePath);
        return {
          name: asset.name,
          size: contents.length,
        };
      }),
  );

  const jsFiles = files.filter((file) => file.name.endsWith(".js"));
  const cssFiles = files.filter((file) => file.name.endsWith(".css"));
  const appJs = jsFiles.filter((file) => /^app-[\w-]+\.js$/.test(file.name));
  const manifest = JSON.parse(
    await readFile(path.join(distDir, ".vite", "ssr-manifest.json"), "utf8"),
  ) as Record<string, string[]>;
  const mermaidAssets = new Set(
    Object.entries(manifest)
      .filter(([moduleId]) => moduleId.includes("node_modules/mermaid/"))
      .flatMap(([, assets]) => assets.map((asset) => path.basename(asset))),
  );
  const mermaidJs = jsFiles.filter((file) => mermaidAssets.has(file.name));

  assertBudget(
    appJs.reduce((sum, file) => sum + file.size, 0),
    assetBudgets.initialJs,
    "initial app JS",
  );
  assertBudget(
    Math.max(...jsFiles.map((file) => file.size)),
    assetBudgets.maxJs,
    "largest JS asset",
  );
  assertBudget(
    mermaidJs.reduce((sum, file) => sum + file.size, 0),
    assetBudgets.mermaidJsTotal,
    "lazy Mermaid JS total",
  );

  for (const file of cssFiles) {
    assertBudget(file.size, assetBudgets.css, `CSS asset ${file.name}`);
  }
}

function assertBudget(actual: number, budget: number, label: string) {
  if (actual > budget) {
    throw new Error(
      `${label} exceeds static asset budget: ${formatBytes(actual)} > ${formatBytes(budget)}`,
    );
  }
}

function formatBytes(value: number) {
  return `${(value / 1024).toFixed(1)} KiB`;
}

function expectedSchemaType(type: PageType) {
  if (type === "posts") {
    return "BlogPosting";
  }
  if (type === "docs" || type === "about") {
    return "Article";
  }
  if (
    type === "home" ||
    type === "listing" ||
    type === "projects" ||
    type === "taxonomy" ||
    type === "taxonomy-index"
  ) {
    return "CollectionPage";
  }
  return "WebPage";
}

function assertImagesHaveAlt(html: string, pagePath: string) {
  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt=("[^"]*"|'[^']*')/.test(match[0])) {
      throw new Error(`${pagePath} has image without alt attribute: ${match[0]}`);
    }
  }
}

function assertTitleQuality(title: string, pagePath: string) {
  if (title.length < 12 || title === siteConfig.name.zh || title === siteConfig.name.en) {
    throw new Error(`${pagePath} has weak title: ${title}`);
  }
}

function assertDescriptionQuality(description: string, pagePath: string) {
  if (description.length < 30) {
    throw new Error(`${pagePath} has short description: ${description}`);
  }
}

function assertIncludes(html: string, expected: string, pagePath: string, label: string) {
  if (!html.includes(expected)) {
    throw new Error(`${pagePath} is missing ${label}: ${expected}`);
  }
}

function assertNotIncludes(html: string, unexpected: string, pagePath: string, label: string) {
  if (html.includes(unexpected)) {
    throw new Error(`${pagePath} contains unexpected ${label}: ${unexpected}`);
  }
}

function assertNoExampleDomain(value: string, pagePath: string) {
  assertNotIncludes(value, "ying-blog.example.com", pagePath, "example domain");
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

function unescapeHtml(value: string) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&");
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
