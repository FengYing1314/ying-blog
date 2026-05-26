import { useHead } from "@unhead/vue";
import type { ReactiveHead } from "@unhead/vue";
import { siteConfig } from "../config/site";
import type { Locale, PageType } from "../types/content";
import { absoluteUrl } from "./paths";

interface SeoInput {
  title: string;
  description: string;
  path: string;
  locale: Locale;
  type: PageType;
  alternatePath?: string;
  date?: string;
}

export function usePageSeo(input: SeoInput | (() => SeoInput | undefined)) {
  useHead((): ReactiveHead => {
    const resolved = typeof input === "function" ? input() : input;
    return resolved ? createHeadInput(resolved) : {};
  });
}

function createHeadInput(input: SeoInput): ReactiveHead {
  const pageTitle =
    input.title === siteConfig.name[input.locale]
      ? input.title
      : `${input.title} | ${siteConfig.name[input.locale]}`;
  const canonical = absoluteUrl(input.path);
  const alternates = input.alternatePath
    ? [
        {
          rel: "alternate" as const,
          hreflang: input.locale === "zh" ? "en" : "zh-CN",
          href: absoluteUrl(input.alternatePath),
        },
      ]
    : [];

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
        content: input.type === "posts" ? "article" : "website",
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
        name: "twitter:card",
        content: "summary_large_image",
      },
      ...(input.type === "not-found"
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
        innerHTML: JSON.stringify(createJsonLd(input, canonical)),
      },
    ],
  };
}

function createJsonLd(input: SeoInput, canonical: string) {
  if (input.type === "posts") {
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: input.title,
      description: input.description,
      datePublished: input.date,
      dateModified: input.date,
      author: {
        "@type": "Person",
        name: siteConfig.author,
      },
      url: canonical,
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.title,
    description: input.description,
    url: canonical,
  };
}
