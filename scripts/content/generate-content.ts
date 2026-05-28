import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import matter from "gray-matter";
import { format } from "oxfmt";
import { z } from "zod";
import { projects } from "../../src/config/projects.ts";
import { siteConfig, uiText } from "../../src/config/site.ts";
import { taxonomy } from "../../src/config/taxonomy.ts";
import { assertSafeHref } from "../../src/lib/urls.ts";
import type {
  ContentEntry,
  ContentRegistry,
  ContentType,
  Locale,
  ProjectCard,
  TaxonomyPage,
} from "../../src/types/content.ts";
import { assertApprovedMarkdown, createMarkdownRenderer } from "./markdown.ts";

const locales: Locale[] = ["zh", "en"];
const contentTypes: ContentType[] = ["posts", "docs", "about"];
const routeSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/;

const dateString = z.union([z.string(), z.date()]).transform((value, ctx) => {
  const normalized = value instanceof Date ? value.toISOString().slice(0, 10) : value;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Expected YYYY-MM-DD date",
    });
    return z.NEVER;
  }
  return normalized;
});

const frontmatterSchema = z
  .object({
    locale: z.enum(["zh", "en"]),
    slug: z.string().regex(routeSlugPattern),
    title: z.string().trim().min(1),
    seoTitle: z.string().trim().min(1).optional(),
    description: z.string().trim().min(1),
    date: dateString,
    updated: dateString.optional(),
    image: z.string().trim().min(1).optional(),
    imageAlt: z.string().trim().min(1).optional(),
    categories: z.array(z.string().trim().min(1)).min(1),
    tags: z.array(z.string().trim().min(1)).min(1),
    featured: z.boolean().optional().default(false),
    order: z.number().int().nonnegative().optional().default(100),
    section: z.string().trim().min(1).optional(),
  })
  .strict();

interface ParsedFile {
  filePath: string;
  locale: Locale;
  type: ContentType;
  slug: string;
  data: z.infer<typeof frontmatterSchema>;
  body: string;
}

export async function generateContent(root = process.cwd()): Promise<ContentRegistry> {
  const renderer = await createMarkdownRenderer();
  const contentRoot = path.join(root, "src/content");
  const generatedDir = path.join(root, "src/generated");
  const files = await fg("src/content/{zh,en}/{posts,docs,about}/**/*.md", {
    cwd: root,
    absolute: true,
  });

  if (files.length === 0) {
    throw new Error("No Markdown content found under src/content");
  }

  const entries: ContentEntry[] = [];
  for (const filePath of files.sort()) {
    const parsed = await parseContentFile(filePath, contentRoot);
    assertApprovedMarkdown(parsed.body, parsed.filePath);
    assertTaxonomy(parsed.data.categories, "categories", parsed.filePath);
    assertTaxonomy(parsed.data.tags, "tags", parsed.filePath);

    const body = stripPrimaryHeading(parsed.body);
    const rendered = renderer.render(body, parsed.locale);
    entries.push({
      id: `${parsed.type}:${parsed.slug}:${parsed.locale}`,
      type: parsed.type,
      locale: parsed.locale,
      slug: parsed.slug,
      title: parsed.data.title,
      seoTitle: parsed.data.seoTitle,
      description: parsed.data.description,
      date: parsed.data.date,
      updated: parsed.data.updated,
      image: parsed.data.image,
      imageAlt: parsed.data.imageAlt,
      categories: parsed.data.categories,
      tags: parsed.data.tags,
      featured: parsed.data.featured,
      order: parsed.data.order,
      section: parsed.data.section,
      path: contentPath(parsed.locale, parsed.type, parsed.slug),
      counterpartPath: contentPath(oppositeLocale(parsed.locale), parsed.type, parsed.slug),
      readingTime: readingTime(body),
      headings: rendered.headings,
      html: rendered.html,
    });
  }

  assertBilingualPairs(entries);
  assertProjectConfig(projects);

  const listingPages = locales.flatMap((locale) => [
    {
      id: `home:${locale}`,
      type: "home" as const,
      locale,
      path: `/${locale}/`,
      title: siteConfig.name[locale],
      description: siteConfig.description[locale],
      counterpartPath: `/${oppositeLocale(locale)}/`,
    },
    {
      id: `posts:${locale}`,
      type: "listing" as const,
      locale,
      path: `/${locale}/posts/`,
      title: uiText.listing.posts[locale],
      description:
        locale === "zh"
          ? "Ying Blog 的文章归档，集中记录静态站点实现、内容系统设计、双语维护和项目工程实践。"
          : "Ying Blog posts collect static-site implementation notes, content-system design, bilingual maintenance, and project engineering practice.",
      counterpartPath: `/${oppositeLocale(locale)}/posts/`,
    },
    {
      id: `docs:${locale}`,
      type: "listing" as const,
      locale,
      path: `/${locale}/docs/`,
      title: uiText.listing.docs[locale],
      description:
        locale === "zh"
          ? "Ying Blog 的文档目录，整理内容工作流、分支边界、静态部署约束和长期维护规则。"
          : "Ying Blog docs organize content workflows, branch boundaries, static deployment constraints, and long-term maintenance rules.",
      counterpartPath: `/${oppositeLocale(locale)}/docs/`,
    },
    {
      id: `projects:${locale}`,
      type: "projects" as const,
      locale,
      path: `/${locale}/projects/`,
      title: uiText.listing.projects[locale],
      description:
        locale === "zh"
          ? "Ying Blog 的项目展示页，以配置驱动卡片汇总当前基线、示例能力和公开项目方向。"
          : "Ying Blog projects use configuration-driven cards to summarize the current baseline, example capabilities, and public project directions.",
      counterpartPath: `/${oppositeLocale(locale)}/projects/`,
    },
  ]);

  const taxonomyPages = createTaxonomyPages(entries);
  const latestContentDate = getLatestContentDate(entries);
  const routes = uniqueSorted([
    "/",
    ...listingPages.map((page) => page.path),
    ...entries.map((entry) => entry.path),
    ...taxonomyPages.map((page) => page.path),
  ]);

  const registry: ContentRegistry = {
    generatedAt: `${latestContentDate}T00:00:00.000Z`,
    entries: sortEntries(entries),
    listingPages,
    taxonomyPages,
    projects: projects as unknown as ProjectCard[],
    routes,
    rssItems: createRssItems(entries, latestContentDate),
  };

  await mkdir(generatedDir, { recursive: true });
  const generatedFile = path.join(generatedDir, "content.ts");
  const generatedSource = [
    'import type { ContentRegistry } from "../types/content";',
    "",
    `export const contentRegistry = ${JSON.stringify(registry, null, 2)} as const satisfies ContentRegistry;`,
    "",
  ].join("\n");
  const formatted = await format(generatedFile, generatedSource);
  if (formatted.errors.length > 0) {
    throw new Error(
      `Failed to format generated content: ${formatted.errors.map((error) => error.message).join(", ")}`,
    );
  }

  await writeFile(generatedFile, formatted.code);

  return registry;
}

async function parseContentFile(filePath: string, contentRoot: string): Promise<ParsedFile> {
  const raw = await readFile(filePath, "utf8");
  const parsed = matter(raw);
  const data = frontmatterSchema.parse(parsed.data);
  const relativePath = path.relative(contentRoot, filePath).replace(/\\/g, "/");
  const parts = relativePath.replace(/\.md$/, "").split("/");
  const [localeSegment, typeSegment, ...slugParts] = parts;

  if (!isLocale(localeSegment)) {
    throw new Error(`${filePath} is not under a supported locale root`);
  }

  if (!isContentType(typeSegment)) {
    throw new Error(`${filePath} is not under a supported content type`);
  }

  const pathSlug = slugParts.join("/");
  if (data.locale !== localeSegment) {
    throw new Error(
      `${filePath} locale frontmatter "${data.locale}" does not match folder "${localeSegment}"`,
    );
  }

  if (data.slug !== pathSlug) {
    throw new Error(
      `${filePath} slug frontmatter "${data.slug}" does not match path slug "${pathSlug}"`,
    );
  }

  if (typeSegment === "posts" && data.slug.includes("/")) {
    throw new Error(`${filePath} post slugs must not be nested`);
  }

  if (typeSegment === "about" && data.slug !== "index") {
    throw new Error(`${filePath} about content must use slug "index"`);
  }

  return {
    filePath,
    locale: localeSegment,
    type: typeSegment,
    slug: data.slug,
    data,
    body: parsed.content.trim(),
  };
}

function stripPrimaryHeading(source: string) {
  const lines = source.split(/\r?\n/);
  const index = lines.findIndex((line) => /^#\s+/.test(line));
  if (index === -1) {
    return source;
  }

  lines.splice(index, 1);
  if (lines[index]?.trim() === "") {
    lines.splice(index, 1);
  }

  return lines.join("\n").trim();
}

function assertTaxonomy(values: readonly string[], type: "categories" | "tags", filePath: string) {
  const allowed = new Set<string>(taxonomy[type].map((term) => term.slug));
  const invalid = values.filter((value) => !allowed.has(value));
  if (invalid.length > 0) {
    throw new Error(`${filePath} uses unknown ${type}: ${invalid.join(", ")}`);
  }
}

function assertBilingualPairs(entries: ContentEntry[]) {
  const byKey = new Map<string, ContentEntry[]>();
  for (const entry of entries) {
    const key = `${entry.type}:${entry.slug}`;
    byKey.set(key, [...(byKey.get(key) ?? []), entry]);
  }

  for (const [key, pair] of byKey.entries()) {
    for (const locale of locales) {
      const localizedEntries = pair.filter((entry) => entry.locale === locale);
      if (localizedEntries.length === 0) {
        throw new Error(`${key} is missing ${locale} translation`);
      }
      if (localizedEntries.length > 1) {
        throw new Error(`${key} has duplicate ${locale} translations`);
      }
    }

    const [first, second] = pair;
    if (!sameValues(first.categories, second.categories)) {
      throw new Error(`${key} has mismatched categories between locales`);
    }
    if (!sameValues(first.tags, second.tags)) {
      throw new Error(`${key} has mismatched tags between locales`);
    }
    if (first.date !== second.date) {
      throw new Error(`${key} has mismatched date between locales`);
    }
    if (first.updated !== second.updated) {
      throw new Error(`${key} has mismatched updated date between locales`);
    }
    if (first.image !== second.image) {
      throw new Error(`${key} has mismatched image between locales`);
    }
    if (first.featured !== second.featured) {
      throw new Error(`${key} has mismatched featured state between locales`);
    }
    if (first.order !== second.order) {
      throw new Error(`${key} has mismatched order between locales`);
    }
    if (first.section !== second.section) {
      throw new Error(`${key} has mismatched docs section between locales`);
    }
  }
}

function assertProjectConfig(projectCards: readonly ProjectCard[]) {
  const seen = new Set<string>();
  for (const project of projectCards) {
    if (seen.has(project.slug)) {
      throw new Error(`Duplicate project slug: ${project.slug}`);
    }
    seen.add(project.slug);
    assertTaxonomy(project.categories, "categories", `project:${project.slug}`);
    assertTaxonomy(project.tags, "tags", `project:${project.slug}`);
    if (project.url) {
      assertSafeHref(project.url, `project:${project.slug} url`);
    }
    if (project.repository) {
      assertSafeHref(project.repository, `project:${project.slug} repository`);
    }
  }
}

function createTaxonomyPages(entries: ContentEntry[]): TaxonomyPage[] {
  const pages: TaxonomyPage[] = [];
  for (const locale of locales) {
    for (const term of taxonomy.categories) {
      const localizedEntries = entries.filter(
        (entry) => entry.locale === locale && entry.categories.includes(term.slug),
      );
      const localizedProjects = projects.filter((project) =>
        hasSlug(project.categories, term.slug),
      );
      pages.push({
        id: `category:${term.slug}:${locale}`,
        type: "taxonomy",
        taxonomyType: "categories",
        locale,
        slug: term.slug,
        path: `/${locale}/categories/${term.slug}/`,
        title: term.label[locale],
        description: taxonomyPageDescription(term.description[locale], locale, "categories"),
        counterpartPath: `/${oppositeLocale(locale)}/categories/${term.slug}/`,
        entryIds: localizedEntries.map((entry) => entry.id),
        projectSlugs: localizedProjects.map((project) => project.slug),
      });
    }

    for (const term of taxonomy.tags) {
      const localizedEntries = entries.filter(
        (entry) => entry.locale === locale && entry.tags.includes(term.slug),
      );
      const localizedProjects = projects.filter((project) => hasSlug(project.tags, term.slug));
      pages.push({
        id: `tag:${term.slug}:${locale}`,
        type: "taxonomy",
        taxonomyType: "tags",
        locale,
        slug: term.slug,
        path: `/${locale}/tags/${term.slug}/`,
        title: term.label[locale],
        description: taxonomyPageDescription(term.description[locale], locale, "tags"),
        counterpartPath: `/${oppositeLocale(locale)}/tags/${term.slug}/`,
        entryIds: localizedEntries.map((entry) => entry.id),
        projectSlugs: localizedProjects.map((project) => project.slug),
      });
    }
  }
  return pages;
}

function createRssItems(
  entries: ContentEntry[],
  latestContentDate: string,
): ContentRegistry["rssItems"] {
  const contentItems = entries
    .filter((entry) => entry.type === "posts" || entry.type === "docs")
    .map((entry) => ({
      id: entry.id,
      title: entry.title,
      description: entry.description,
      date: entry.date,
      path: entry.path,
      locale: entry.locale,
      type: entry.type,
    }));

  const projectItems = locales.map((locale) => ({
    id: `projects:${locale}`,
    title: uiText.listing.projects[locale],
    description:
      locale === "zh"
        ? "Ying Blog 的项目展示页，以配置驱动卡片汇总当前基线、示例能力和公开项目方向。"
        : "Ying Blog projects use configuration-driven cards to summarize the current baseline, example capabilities, and public project directions.",
    date: latestContentDate,
    path: `/${locale}/projects/`,
    locale,
    type: "projects" as const,
  }));

  return [...contentItems, ...projectItems].sort((a, b) => b.date.localeCompare(a.date));
}

function taxonomyPageDescription(
  description: string,
  locale: Locale,
  taxonomyType: "categories" | "tags",
) {
  const suffix =
    locale === "zh"
      ? taxonomyType === "categories"
        ? "这里汇总 Ying Blog 中对应分类下的文章、文档和项目卡片，方便按主题浏览相关内容。"
        : "这里汇总 Ying Blog 中带有对应标签的文章、文档和项目卡片，方便按关键词继续阅读。"
      : taxonomyType === "categories"
        ? "This page groups related Ying Blog posts, docs, and project cards by category for topic-based browsing."
        : "This page groups related Ying Blog posts, docs, and project cards by tag for keyword-based browsing.";

  return `${description} ${suffix}`;
}

function contentPath(locale: Locale, type: ContentType, slug: string) {
  if (type === "about") {
    return `/${locale}/about/`;
  }
  return `/${locale}/${type}/${slug}/`;
}

function sortEntries(entries: ContentEntry[]) {
  return [...entries].sort((a, b) => {
    if (a.locale !== b.locale) {
      return a.locale.localeCompare(b.locale);
    }
    if (a.type !== b.type) {
      return contentTypes.indexOf(a.type) - contentTypes.indexOf(b.type);
    }
    if (a.type === "docs" || b.type === "docs") {
      return a.order - b.order || a.slug.localeCompare(b.slug);
    }
    return b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug);
  });
}

function readingTime(source: string) {
  const plain = source.replace(/```[\s\S]*?```/g, "").replace(/[^\p{L}\p{N}\s]/gu, " ");
  const cjkCount = [...plain.matchAll(/[\p{Script=Han}]/gu)].length;
  const wordCount = plain
    .replace(/[\p{Script=Han}]/gu, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil((wordCount + cjkCount / 2) / 220));
}

function sameValues(a: readonly string[], b: readonly string[]) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function hasSlug(values: readonly string[], slug: string) {
  return values.includes(slug);
}

function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

function isContentType(value: string): value is ContentType {
  return contentTypes.includes(value as ContentType);
}

function oppositeLocale(locale: Locale): Locale {
  return locale === "zh" ? "en" : "zh";
}

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function getLatestContentDate(entries: ContentEntry[]) {
  return entries.reduce((latest, entry) => {
    const candidate = entry.updated ?? entry.date;
    return candidate > latest ? candidate : latest;
  }, "1970-01-01");
}
