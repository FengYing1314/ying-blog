import { describe, expect, it } from "vitest";
import { taxonomy } from "../src/config/taxonomy";
import { contentRegistry } from "../src/generated/content";
import { absoluteFileUrl, absoluteUrl, withBasePath } from "../src/lib/paths";
import { assertApprovedMarkdown, createMarkdownRenderer } from "../scripts/content/markdown";
import type { ContentEntry } from "../src/types/content";

const entries = contentRegistry.entries as readonly ContentEntry[];

describe("content registry", () => {
  it("generates paired bilingual content entries", () => {
    const keys = new Map<string, Set<string>>();
    for (const entry of entries) {
      const key = `${entry.type}:${entry.slug}`;
      keys.set(key, new Set([...(keys.get(key) ?? []), entry.locale]));
    }

    for (const locales of keys.values()) {
      expect(locales.has("zh")).toBe(true);
      expect(locales.has("en")).toBe(true);
    }
  });

  it("keeps one entry per content type, slug, and locale", () => {
    const identities = entries.map((entry) => `${entry.type}:${entry.slug}:${entry.locale}`);
    expect(new Set(identities).size).toBe(identities.length);
  });

  it("keeps routes unique and locale rooted", () => {
    expect(new Set(contentRegistry.routes).size).toBe(contentRegistry.routes.length);
    expect(contentRegistry.routes).toContain("/zh/");
    expect(contentRegistry.routes).toContain("/en/");
    expect(
      contentRegistry.routes.every(
        (route) => route === "/" || route.startsWith("/zh/") || route.startsWith("/en/"),
      ),
    ).toBe(true);
  });

  it("uses only centrally configured taxonomy slugs", () => {
    const categories = new Set<string>(taxonomy.categories.map((term) => term.slug));
    const tags = new Set<string>(taxonomy.tags.map((term) => term.slug));

    for (const entry of entries) {
      expect(entry.categories.every((slug) => categories.has(slug))).toBe(true);
      expect(entry.tags.every((slug) => tags.has(slug))).toBe(true);
    }
  });

  it("keeps paired frontmatter fields exactly aligned", () => {
    const pairs = new Map<string, ContentEntry[]>();
    for (const entry of entries) {
      const key = `${entry.type}:${entry.slug}`;
      pairs.set(key, [...(pairs.get(key) ?? []), entry]);
    }

    for (const [key, entries] of pairs) {
      const zh = entries.find((entry) => entry.locale === "zh");
      const en = entries.find((entry) => entry.locale === "en");
      expect(zh, `${key} missing zh`).toBeTruthy();
      expect(en, `${key} missing en`).toBeTruthy();
      expect(zh?.date).toBe(en?.date);
      expect(zh?.updated).toBe(en?.updated);
      expect(zh?.featured).toBe(en?.featured);
      expect(zh?.order).toBe(en?.order);
      expect(zh?.section).toBe(en?.section);
      expect(zh?.categories).toEqual(en?.categories);
      expect(zh?.tags).toEqual(en?.tags);
    }
  });

  it("does not generate project detail routes or project rss items", () => {
    expect(contentRegistry.routes.some((route) => /\/projects\/[^/]+\/$/.test(route))).toBe(false);
    expect(contentRegistry.routes).not.toContain("/404/");
    expect(
      contentRegistry.rssItems
        .filter((item) => item.type === "projects")
        .map((item) => item.path)
        .sort(),
    ).toEqual(["/en/projects/", "/zh/projects/"]);
  });

  it("keeps project RSS items limited to localized project indexes", () => {
    const projectItems = contentRegistry.rssItems.filter((item) => item.type === "projects");
    expect(projectItems).toHaveLength(2);
    expect(projectItems.map((item) => item.id).sort()).toEqual(["projects:en", "projects:zh"]);
    expect(projectItems.every((item) => /\/(en|zh)\/projects\/$/.test(item.path))).toBe(true);
  });

  it("renders approved Markdown affordances at build time", () => {
    const post = entries.find((entry) => entry.id === "posts:building-this-site:en");
    expect(post?.html).toContain('class="md-tabs"');
    expect(post?.html).toContain('class="code-block"');
    expect(post?.html).toContain("shiki");
    expect(post?.html).not.toContain("<h1>");
  });

  it("renders Mermaid fences as diagram containers", async () => {
    const renderer = await createMarkdownRenderer();
    const rendered = renderer.render(
      ["# Example", "", "```mermaid", "flowchart TD", "  A --> B", "```"].join("\n"),
      "en",
    );

    expect(rendered.html).toContain("data-mermaid");
    expect(rendered.html).toContain('class="md-mermaid-canvas"');
    expect(rendered.html).toContain('role="toolbar"');
    expect(rendered.html).toContain('data-mermaid-action="zoom-out"');
    expect(rendered.html).toContain('data-mermaid-action="zoom-in"');
    expect(rendered.html).toContain('data-mermaid-action="fit"');
    expect(rendered.html).toContain('data-mermaid-action="reset"');
    expect(rendered.html).toContain('data-mermaid-action="open"');
    expect(rendered.html).toContain("data-mermaid-scale");
    expect(rendered.html).not.toContain('class="code-block"');
  });

  it("rejects unsupported Markdown container directives", () => {
    expect(() =>
      assertApprovedMarkdown(
        ["# Example", "", "::: unsupported", "Hidden behavior", ":::"].join("\n"),
        "example.md",
      ),
    ).toThrow(/unsupported Markdown directive/);
  });

  it("rejects unsupported Markdown component tags", () => {
    expect(() =>
      assertApprovedMarkdown(
        ["# Example", "", "<DangerousWidget />", "", "Content"].join("\n"),
        "example.md",
      ),
    ).toThrow(/unsupported Markdown component/);
  });

  it("rejects unsafe Markdown card links", () => {
    expect(() =>
      assertApprovedMarkdown(
        ["# Example", "", "::: card Unsafe | javascript:alert(1)", "Content", ":::"].join("\n"),
        "example.md",
      ),
    ).toThrow(/unsafe URL/);
  });

  it("keeps base path helpers stable for route and file URLs", () => {
    expect(withBasePath("/rss.xml")).toMatch(/\/rss\.xml$/);
    expect(withBasePath("/zh/categories/engineering/")).toMatch(/\/zh\/categories\/engineering\/$/);
    expect(absoluteUrl("/zh/")).toMatch(/\/zh\/$/);
    expect(absoluteFileUrl("/sitemap.xml")).toMatch(/\/sitemap\.xml$/);
  });
});
