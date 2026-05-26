import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
import container from "markdown-it-container";
import { createHighlighter } from "shiki";
import { assertSafeHref, sanitizeHref } from "../../src/lib/urls.ts";
import type { Heading, Locale } from "../../src/types/content.ts";

const approvedComponentNames = ["Callout", "Tabs", "CardGrid", "StepList", "Badge"];
const approvedDirectiveNames = new Set([
  "callout",
  "tabs",
  "tab",
  "card-grid",
  "card",
  "steps",
  "step-list",
  "step",
]);

const supportedLanguages = new Set([
  "bash",
  "css",
  "html",
  "javascript",
  "js",
  "json",
  "markdown",
  "md",
  "shell",
  "sh",
  "text",
  "typescript",
  "ts",
  "vue",
  "xml",
]);

export interface RenderedMarkdown {
  html: string;
  headings: Heading[];
}

export function assertApprovedMarkdown(source: string, filePath: string) {
  const tagPattern = /<\/?([A-Z][A-Za-z0-9]*)\b/g;
  const invalid = new Set<string>();
  for (const match of source.matchAll(tagPattern)) {
    if (!approvedComponentNames.includes(match[1])) {
      invalid.add(match[1]);
    }
  }

  if (invalid.size > 0) {
    throw new Error(
      `${filePath} uses unsupported Markdown component(s): ${Array.from(invalid).join(", ")}`,
    );
  }

  assertApprovedDirectives(source, filePath);
  assertSafeDirectiveUrls(source, filePath);
  assertHeadingStructure(source, filePath);
}

export async function createMarkdownRenderer() {
  const highlighter = await createHighlighter({
    themes: ["github-light", "github-dark"],
    langs: Array.from(supportedLanguages),
  });

  let activeHeadings: Heading[] = [];

  const md = new MarkdownIt({
    html: false,
    linkify: true,
    typographer: true,
  });

  md.use(anchor, {
    level: [2, 3],
    tabIndex: false,
    slugify: slugifyHeading,
    callback(token, info) {
      const level = Number(token.tag.slice(1));
      if (level === 2 || level === 3) {
        activeHeadings.push({
          id: info.slug,
          level,
          title: info.title,
        });
      }
    },
  });

  const defaultTableOpen =
    md.renderer.rules.table_open ??
    ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));
  const defaultTableClose =
    md.renderer.rules.table_close ??
    ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));

  md.renderer.rules.table_open = (tokens, idx, options, env, self) =>
    `<div class="table-scroll">${defaultTableOpen(tokens, idx, options, env, self)}`;
  md.renderer.rules.table_close = (tokens, idx, options, env, self) =>
    `${defaultTableClose(tokens, idx, options, env, self)}</div>\n`;

  md.use(container, "callout", {
    validate: (params: string) =>
      /^callout(?:\s+(note|info|success|warning))?$/.test(params.trim()),
    render(tokens: any[], idx: number) {
      const token = tokens[idx];
      if (token.nesting === 1) {
        const [, variant = "info"] =
          token.info.trim().match(/^callout(?:\s+(note|info|success|warning))?$/) ?? [];
        return `<div class="md-callout md-callout-${escapeHtml(variant)}">`;
      }
      return "</div>\n";
    },
  });

  md.use(container, "tabs", {
    validate: (params: string) => params.trim() === "tabs",
    render(tokens: any[], idx: number) {
      return tokens[idx].nesting === 1 ? '<div class="md-tabs" data-tabs>' : "</div>\n";
    },
  });

  md.use(container, "tab", {
    validate: (params: string) => /^tab\s+.+/.test(params.trim()),
    render(tokens: any[], idx: number) {
      const token = tokens[idx];
      if (token.nesting === 1) {
        const title = token.info
          .trim()
          .replace(/^tab\s+/, "")
          .replace(/^["']|["']$/g, "");
        return `<section class="md-tab-panel" data-tab-title="${escapeAttr(title)}">\n`;
      }
      return "</section>\n";
    },
  });

  md.use(container, "card-grid", {
    validate: (params: string) => params.trim() === "card-grid",
    render(tokens: any[], idx: number) {
      return tokens[idx].nesting === 1 ? '<div class="md-card-grid">' : "</div>\n";
    },
  });

  md.use(container, "card", {
    validate: (params: string) => /^card\s+.+/.test(params.trim()),
    render(tokens: any[], idx: number) {
      const token = tokens[idx];
      if (token.nesting === 1) {
        const info = token.info.trim().replace(/^card\s+/, "");
        const [title, href] = info.split("|").map((part: string) => part.trim());
        const safeHref = sanitizeHref(href);
        const tag = safeHref ? "a" : "div";
        const hrefAttr = safeHref ? ` href="${escapeAttr(safeHref)}"` : "";
        return `<${tag} class="md-card"${hrefAttr}><strong class="md-card-title">${escapeHtml(title)}</strong>\n`;
      }
      const info = tokens[idx - 1]?.info?.trim().replace(/^card\s+/, "") ?? "";
      const hasHref = info.includes("|");
      return hasHref ? "</a>\n" : "</div>\n";
    },
  });

  md.use(container, "steps", {
    validate: (params: string) => params.trim() === "steps" || params.trim() === "step-list",
    render(tokens: any[], idx: number) {
      return tokens[idx].nesting === 1 ? '<div class="md-step-list">' : "</div>\n";
    },
  });

  md.use(container, "step", {
    validate: (params: string) => /^step\s+.+/.test(params.trim()),
    render(tokens: any[], idx: number) {
      const token = tokens[idx];
      if (token.nesting === 1) {
        const title = token.info
          .trim()
          .replace(/^step\s+/, "")
          .replace(/^["']|["']$/g, "");
        return `<section class="md-step"><h3>${escapeHtml(title)}</h3>\n`;
      }
      return "</section>\n";
    },
  });

  addBadgeRule(md);

  md.renderer.rules.fence = (tokens, idx, _options, env) => {
    const token = tokens[idx];
    const locale = isLocale(env?.locale) ? env.locale : "en";
    const language = normalizeLanguage(token.info.trim().split(/\s+/)[0] || "text");
    if (language === "mermaid") {
      return renderMermaidBlock(token.content, locale);
    }

    const highlighted = highlighter.codeToHtml(token.content, {
      lang: language,
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: false,
    });

    return [
      `<div class="code-block" data-code="${escapeAttr(token.content)}" data-language="${escapeAttr(language)}">`,
      '<div class="code-toolbar">',
      `<span>${escapeHtml(language)}</span>`,
      `<button class="code-copy" type="button" data-copy-code data-copy-label="${escapeAttr(copyLabel(locale))}" data-copied-label="${escapeAttr(copiedLabel(locale))}" aria-label="${escapeAttr(copyLabel(locale))}">${escapeHtml(copyLabel(locale))}</button>`,
      "</div>",
      highlighted,
      "</div>",
    ].join("");
  };

  return {
    render(source: string, locale: Locale): RenderedMarkdown {
      activeHeadings = [];
      const html = md.render(source, { locale });
      return {
        html,
        headings: activeHeadings,
      };
    },
  };
}

function renderMermaidBlock(source: string, locale: Locale) {
  const label = locale === "zh" ? "Mermaid 图表" : "Mermaid diagram";
  const copySourceLabel = locale === "zh" ? "复制源码" : "Copy source";
  const copiedLabel = copiedLabelForMermaid(locale);
  const toolbarLabel = locale === "zh" ? "Mermaid 图表工具" : "Mermaid diagram tools";
  const zoomOutLabel = locale === "zh" ? "缩小" : "Zoom out";
  const zoomInLabel = locale === "zh" ? "放大" : "Zoom in";
  const fitLabel = locale === "zh" ? "适应宽度" : "Fit width";
  const resetLabel = locale === "zh" ? "重置" : "Reset";
  const openLabel = locale === "zh" ? "放大查看" : "Open viewer";
  const scaleLabel = locale === "zh" ? "当前缩放 100%" : "Current zoom 100%";
  const hintLabel = locale === "zh" ? "可拖拽 / Ctrl 滚轮缩放" : "Drag / Ctrl+wheel";
  const loadingLabel = locale === "zh" ? "渲染中" : "Rendering";
  const errorLabel = locale === "zh" ? "渲染失败" : "Render failed";

  return [
    `<div class="md-mermaid" data-mermaid data-rendered="false" data-mermaid-hint="${escapeAttr(hintLabel)}" data-loading-label="${escapeAttr(loadingLabel)}" data-error-label="${escapeAttr(errorLabel)}" data-copied-label="${escapeAttr(copiedLabel)}">`,
    '<div class="md-mermaid-toolbar">',
    `<span class="md-mermaid-title">${escapeHtml(label)}</span>`,
    `<span class="md-mermaid-scale" data-mermaid-scale aria-label="${escapeAttr(scaleLabel)}">100%</span>`,
    `<div class="md-mermaid-tools" role="toolbar" aria-label="${escapeAttr(toolbarLabel)}">`,
    renderMermaidToolButton({
      action: "copy",
      label: copySourceLabel,
      icon: "[]",
      attrs: `data-copy-mermaid data-copy-label="${escapeAttr(copySourceLabel)}" data-copied-label="${escapeAttr(copiedLabel)}"`,
    }),
    renderMermaidToolButton({ action: "zoom-out", label: zoomOutLabel, icon: "-" }),
    renderMermaidToolButton({ action: "zoom-in", label: zoomInLabel, icon: "+" }),
    renderMermaidToolButton({ action: "fit", label: fitLabel, icon: "<>" }),
    renderMermaidToolButton({ action: "reset", label: resetLabel, icon: "1:1" }),
    renderMermaidToolButton({ action: "open", label: openLabel, icon: "[]" }),
    "</div>",
    "</div>",
    `<div class="md-mermaid-canvas" data-mermaid-canvas tabindex="0" role="img" aria-label="${escapeAttr(label)}"></div>`,
    `<pre class="md-mermaid-source" data-mermaid-source>${escapeHtml(source)}</pre>`,
    "</div>",
  ].join("");
}

function renderMermaidToolButton({
  action,
  label,
  icon,
  attrs = "",
}: {
  action: string;
  label: string;
  icon: string;
  attrs?: string;
}) {
  const extraAttrs = attrs ? ` ${attrs}` : "";
  return [
    `<button class="md-mermaid-tool" type="button" data-mermaid-action="${escapeAttr(action)}"${extraAttrs} aria-label="${escapeAttr(label)}" title="${escapeAttr(label)}">`,
    `<span class="md-mermaid-tool-icon" aria-hidden="true">${escapeHtml(icon)}</span>`,
    `<span class="md-visually-hidden">${escapeHtml(label)}</span>`,
    "</button>",
  ].join("");
}

function addBadgeRule(md: MarkdownIt) {
  md.inline.ruler.before("emphasis", "badge", (state, silent) => {
    const marker = ":badge[";
    if (!state.src.startsWith(marker, state.pos)) {
      return false;
    }

    const start = state.pos + marker.length;
    const end = state.src.indexOf("]", start);
    if (end === -1) {
      return false;
    }

    if (!silent) {
      const open = state.push("badge_open", "span", 1);
      open.attrSet("class", "md-badge");
      const text = state.push("text", "", 0);
      text.content = state.src.slice(start, end);
      state.push("badge_close", "span", -1);
    }

    state.pos = end + 1;
    return true;
  });
}

function assertApprovedDirectives(source: string, filePath: string) {
  const invalid = new Set<string>();
  for (const line of source.split(/\r?\n/)) {
    const match = /^\s*:{3,}\s*([a-z][a-z0-9-]*)\b/.exec(line);
    if (match && !approvedDirectiveNames.has(match[1])) {
      invalid.add(match[1]);
    }
  }

  if (invalid.size > 0) {
    throw new Error(
      `${filePath} uses unsupported Markdown directive(s): ${Array.from(invalid).join(", ")}`,
    );
  }
}

function assertSafeDirectiveUrls(source: string, filePath: string) {
  for (const line of source.split(/\r?\n/)) {
    const match = /^\s*:{3,}\s*card\s+.+\|\s*(.+?)\s*$/.exec(line);
    if (match) {
      assertSafeHref(match[1], filePath);
    }
  }
}

function assertHeadingStructure(source: string, filePath: string) {
  const headings: Array<{ level: number; title: string; line: number }> = [];
  let inFence = false;
  const lines = source.split(/\r?\n/);

  lines.forEach((line, index) => {
    if (line.trim().startsWith("```")) {
      inFence = !inFence;
      return;
    }

    if (inFence) {
      return;
    }

    const match = /^(#{1,6})\s+(.+)$/.exec(line);
    if (match) {
      headings.push({
        level: match[1].length,
        title: match[2].trim(),
        line: index + 1,
      });
    }
  });

  const h1Count = headings.filter((heading) => heading.level === 1).length;
  if (h1Count !== 1) {
    throw new Error(`${filePath} must contain exactly one H1 heading; found ${h1Count}`);
  }

  for (let index = 1; index < headings.length; index += 1) {
    const previous = headings[index - 1];
    const current = headings[index];
    if (current.level > previous.level + 1) {
      throw new Error(
        `${filePath} skips heading levels at line ${current.line}: "${current.title}"`,
      );
    }
  }
}

function normalizeLanguage(language: string) {
  if (language === "mermaid") {
    return "mermaid";
  }

  if (language === "shell") {
    return "bash";
  }

  if (language === "sh") {
    return "bash";
  }

  if (language === "js") {
    return "javascript";
  }

  if (language === "ts") {
    return "typescript";
  }

  if (language === "md") {
    return "markdown";
  }

  return supportedLanguages.has(language) ? language : "text";
}

function copyLabel(locale: Locale) {
  return locale === "zh" ? "复制代码" : "Copy code";
}

function copiedLabel(locale: Locale) {
  return locale === "zh" ? "已复制" : "Copied";
}

function copiedLabelForMermaid(locale: Locale) {
  return locale === "zh" ? "源码已复制" : "Source copied";
}

function isLocale(value: unknown): value is Locale {
  return value === "zh" || value === "en";
}

function slugifyHeading(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[char];
  });
}

function escapeAttr(value: string) {
  return escapeHtml(value).replace(/\n/g, "&#10;");
}
