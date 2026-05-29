import { useHead } from "@unhead/vue";
import type { ReactiveHead } from "@unhead/vue";
import { siteConfig } from "../config/site";
import type { Locale, PageType } from "../types/content";
import { absoluteFileUrl, absoluteUrl } from "./paths";

interface SeoInput {
  title: string;
  description: string;
  path: string;
  locale: Locale;
  type: PageType;
  alternatePath?: string;
  date?: string;
  updated?: string;
  image?: string;
  imageAlt?: string;
  noindex?: boolean;
}

export function usePageSeo(input: SeoInput | (() => SeoInput | undefined)) {
  useHead((): ReactiveHead => {
    const resolved = typeof input === "function" ? input() : input;
    return resolved ? createHeadInput(resolved) : {};
  });
}

function createHeadInput(input: SeoInput): ReactiveHead {
  const pageTitle = createPageTitle(input);
  const canonical = absoluteUrl(input.path);
  const image = resolveImage(input.image);
  const imageAlt = input.imageAlt ?? siteConfig.seo.imageAlt[input.locale];
  const alternates = createAlternateLinks(input);
  const isArticle = input.type === "posts" || input.type === "docs" || input.type === "about";

  return {
    htmlAttrs: {
      lang: input.locale === "zh" ? "zh-CN" : "en",
    },
    title: pageTitle,
    meta: [
      {
        name: "description",
        content: input.description,
      },
      {
        property: "og:title",
        content: pageTitle,
      },
      {
        property: "og:description",
        content: input.description,
      },
      {
        property: "og:type",
        content: isArticle ? "article" : "website",
      },
      {
        property: "og:url",
        content: canonical,
      },
      {
        property: "og:site_name",
        content: siteConfig.name[input.locale],
      },
      {
        property: "og:locale",
        content: input.locale === "zh" ? "zh_CN" : "en_US",
      },
      ...(input.alternatePath
        ? [
            {
              property: "og:locale:alternate",
              content: input.locale === "zh" ? "en_US" : "zh_CN",
            },
          ]
        : []),
      {
        property: "og:image",
        content: image,
      },
      {
        property: "og:image:secure_url",
        content: image,
      },
      {
        property: "og:image:alt",
        content: imageAlt,
      },
      {
        property: "og:image:width",
        content: String(siteConfig.seo.imageWidth),
      },
      {
        property: "og:image:height",
        content: String(siteConfig.seo.imageHeight),
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: pageTitle,
      },
      {
        name: "twitter:description",
        content: input.description,
      },
      {
        name: "twitter:image",
        content: image,
      },
      {
        name: "twitter:image:alt",
        content: imageAlt,
      },
      ...(input.date && isArticle
        ? [
            {
              property: "article:published_time",
              content: input.date,
            },
          ]
        : []),
      ...((input.updated ?? input.date) && isArticle
        ? [
            {
              property: "article:modified_time",
              content: input.updated ?? input.date ?? "",
            },
          ]
        : []),
      ...(input.type === "not-found" || input.noindex
        ? [
            {
              name: "robots",
              content: "noindex",
            },
          ]
        : []),
      ...(siteConfig.verification.google
        ? [
            {
              name: "google-site-verification",
              content: siteConfig.verification.google,
            },
          ]
        : []),
      ...(siteConfig.verification.bing
        ? [
            {
              name: "msvalidate.01",
              content: siteConfig.verification.bing,
            },
          ]
        : []),
    ],
    link: [
      {
        rel: "canonical",
        href: canonical,
      },
      ...alternates,
    ],
    script: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify(createJsonLd(input, canonical, image)),
      },
    ],
  };
}

function createPageTitle(input: SeoInput) {
  const rawTitle = input.title.trim();
  if (rawTitle === siteConfig.name[input.locale]) {
    return siteConfig.seo.title[input.locale];
  }

  return `${rawTitle} | ${siteConfig.name[input.locale]}`;
}

function createAlternateLinks(input: SeoInput) {
  const links = [
    {
      rel: "alternate" as const,
      hreflang: input.locale === "zh" ? "zh-CN" : "en",
      href: absoluteUrl(input.path),
    },
  ];

  if (input.alternatePath) {
    links.push({
      rel: "alternate" as const,
      hreflang: input.locale === "zh" ? "en" : "zh-CN",
      href: absoluteUrl(input.alternatePath),
    });
  }

  const defaultHref =
    input.locale === "zh"
      ? absoluteUrl(input.path)
      : absoluteUrl(input.alternatePath ?? input.path);
  links.push({
    rel: "alternate" as const,
    hreflang: "x-default",
    href: defaultHref,
  });

  return links;
}

function resolveImage(image: string | undefined) {
  if (image?.startsWith("http://") || image?.startsWith("https://")) {
    return image;
  }

  return absoluteFileUrl(image ?? siteConfig.seo.image);
}

function createJsonLd(input: SeoInput, canonical: string, image: string) {
  const basePage = {
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: input.title,
    headline: input.title,
    description: input.description,
    inLanguage: input.locale === "zh" ? "zh-CN" : "en",
    image,
    isPartOf: {
      "@id": `${absoluteUrl(`/${input.locale}/`)}#website`,
    },
    breadcrumb: {
      "@id": `${canonical}#breadcrumb`,
    },
  };

  const siteIdentity = {
    "@type": siteConfig.seo.identityType,
    "@id": `${siteConfig.url}#identity`,
    name: siteConfig.author,
    url: siteConfig.url,
    sameAs: siteConfig.seo.sameAs,
  };

  const website = {
    "@type": "WebSite",
    "@id": `${absoluteUrl(`/${input.locale}/`)}#website`,
    name: siteConfig.name[input.locale],
    description: siteConfig.description[input.locale],
    url: absoluteUrl(`/${input.locale}/`),
    inLanguage: input.locale === "zh" ? "zh-CN" : "en",
    publisher: {
      "@id": `${siteConfig.url}#identity`,
    },
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${canonical}#breadcrumb`,
    itemListElement: createBreadcrumbItems(input, canonical),
  };

  const page = createPageJsonLd(input, basePage);

  return {
    "@context": "https://schema.org",
    "@graph": [siteIdentity, website, page, breadcrumb],
  };
}

function createPageJsonLd(input: SeoInput, basePage: Record<string, unknown>) {
  if (input.type === "posts") {
    return {
      "@type": "BlogPosting",
      ...basePage,
      datePublished: input.date,
      dateModified: input.updated ?? input.date,
      author: {
        "@id": `${siteConfig.url}#identity`,
      },
      publisher: {
        "@id": `${siteConfig.url}#identity`,
      },
    };
  }

  if (input.type === "docs" || input.type === "about") {
    return {
      "@type": "Article",
      ...basePage,
      datePublished: input.date,
      dateModified: input.updated ?? input.date,
      author: {
        "@id": `${siteConfig.url}#identity`,
      },
      publisher: {
        "@id": `${siteConfig.url}#identity`,
      },
    };
  }

  if (input.type === "home") {
    return {
      "@type": ["WebPage", "CollectionPage"],
      ...basePage,
      about: {
        "@id": `${siteConfig.url}#identity`,
      },
    };
  }

  if (
    input.type === "listing" ||
    input.type === "projects" ||
    input.type === "taxonomy" ||
    input.type === "taxonomy-index"
  ) {
    return {
      "@type": "CollectionPage",
      ...basePage,
    };
  }

  return {
    "@type": "WebPage",
    ...basePage,
  };
}

function createBreadcrumbItems(input: SeoInput, canonical: string) {
  const homeUrl = absoluteUrl(`/${input.locale}/`);
  const homeName = siteConfig.name[input.locale];
  if (input.type === "home") {
    return [
      {
        "@type": "ListItem",
        position: 1,
        name: homeName,
        item: canonical,
      },
    ];
  }

  const segments = input.path
    .replace(/^\/|\/$/g, "")
    .split("/")
    .filter(Boolean)
    .slice(1);
  const items: Array<{ "@type": "ListItem"; position: number; name: string; item: string }> = [
    {
      "@type": "ListItem",
      position: 1,
      name: homeName,
      item: homeUrl,
    },
  ];

  if (segments.length > 1) {
    const section = segments[0];
    items.push({
      "@type": "ListItem",
      position: 2,
      name: sectionName(section, input.locale),
      item: absoluteUrl(`/${input.locale}/${section}/`),
    });
  }

  items.push({
    "@type": "ListItem",
    position: items.length + 1,
    name: input.title,
    item: canonical,
  });

  return items;
}

function sectionName(section: string, locale: Locale) {
  const labels: Record<string, Record<Locale, string>> = {
    posts: { zh: "文章", en: "Posts" },
    docs: { zh: "文档", en: "Docs" },
    projects: { zh: "项目", en: "Projects" },
    categories: { zh: "分类", en: "Categories" },
    tags: { zh: "标签", en: "Tags" },
    about: { zh: "关于", en: "About" },
  };

  return labels[section]?.[locale] ?? section;
}
