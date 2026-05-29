export type Locale = "zh" | "en";

export type ContentType = "posts" | "docs" | "about";

export type PageType =
  | ContentType
  | "home"
  | "projects"
  | "taxonomy"
  | "taxonomy-index"
  | "listing"
  | "not-found";

export type TaxonomyType = "categories" | "tags";

export interface LocalizedText {
  zh: string;
  en: string;
}

export interface Heading {
  id: string;
  level: 2 | 3;
  title: string;
}

export interface ContentEntry {
  id: string;
  type: ContentType;
  locale: Locale;
  slug: string;
  title: string;
  seoTitle?: string;
  description: string;
  date: string;
  updated?: string;
  image?: string;
  imageAlt?: string;
  categories: string[];
  tags: string[];
  featured: boolean;
  order: number;
  section?: string;
  path: string;
  counterpartPath: string;
  readingTime: number;
  headings: Heading[];
  html: string;
}

export interface ListingPage {
  id: string;
  type: "home" | "listing" | "projects";
  locale: Locale;
  path: string;
  title: string;
  description: string;
  counterpartPath: string;
}

export interface TaxonomyPage {
  id: string;
  type: "taxonomy";
  taxonomyType: TaxonomyType;
  locale: Locale;
  slug: string;
  path: string;
  title: string;
  description: string;
  counterpartPath: string;
  entryIds: string[];
  projectSlugs: string[];
}

export interface TaxonomyIndexPage {
  id: string;
  type: "taxonomy-index";
  taxonomyType: TaxonomyType;
  locale: Locale;
  path: string;
  title: string;
  description: string;
  counterpartPath: string;
  termSlugs: string[];
}

export interface ProjectCard {
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  categories: string[];
  tags: string[];
  status: LocalizedText;
  period: LocalizedText;
  role: LocalizedText;
  stack: string[];
  highlights: LocalizedText[];
  order: number;
  url?: string;
  repository?: string;
  featured: boolean;
}

export interface ContentRegistry {
  generatedAt: string;
  entries: ContentEntry[];
  listingPages: ListingPage[];
  taxonomyPages: TaxonomyPage[];
  taxonomyIndexPages: TaxonomyIndexPage[];
  projects: ProjectCard[];
  routes: string[];
  rssItems: Array<{
    id: string;
    title: string;
    description: string;
    date: string;
    path: string;
    locale: Locale;
    type: ContentType | "projects";
  }>;
}
