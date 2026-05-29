import { projects } from "../config/projects";
import { contentRegistry as generatedContentRegistry } from "../generated/content";
import type {
  ContentEntry,
  ContentRegistry,
  ContentType,
  Locale,
  ProjectCard,
  TaxonomyIndexPage,
  TaxonomyPage,
} from "../types/content";

export const registry: ContentRegistry = generatedContentRegistry;

export function getEntryById(id: string) {
  return registry.entries.find((entry) => entry.id === id);
}

export function getEntries(locale: Locale, type?: ContentType) {
  return registry.entries.filter(
    (entry) => entry.locale === locale && (!type || entry.type === type),
  );
}

export function getPosts(locale: Locale) {
  return getEntries(locale, "posts").sort((a, b) => b.date.localeCompare(a.date));
}

export function getDocs(locale: Locale) {
  return getEntries(locale, "docs").sort(
    (a, b) => a.order - b.order || a.slug.localeCompare(b.slug),
  );
}

export function getAbout(locale: Locale) {
  return registry.entries.find((entry) => entry.locale === locale && entry.type === "about");
}

export function getFeaturedEntries(locale: Locale) {
  return registry.entries
    .filter((entry) => entry.locale === locale && entry.featured && entry.type !== "about")
    .sort((a, b) => b.date.localeCompare(a.date) || a.order - b.order);
}

export function getLatestEntries(locale: Locale, limit = 5) {
  return registry.entries
    .filter((entry) => entry.locale === locale && entry.type !== "about")
    .sort((a, b) => b.date.localeCompare(a.date) || a.order - b.order)
    .slice(0, limit);
}

export function getListingPage(path: string) {
  return registry.listingPages.find((page) => page.path === path);
}

export function getTaxonomyIndexPage(path: string) {
  return registry.taxonomyIndexPages.find((page) => page.path === path);
}

export function getTaxonomyIndexTerms(page: TaxonomyIndexPage) {
  const pages = registry.taxonomyPages.filter(
    (candidate) => candidate.locale === page.locale && candidate.taxonomyType === page.taxonomyType,
  );
  return page.termSlugs
    .map((slug) => pages.find((candidate) => candidate.slug === slug))
    .filter((termPage): termPage is TaxonomyPage => Boolean(termPage));
}

export function getTaxonomyEntries(page: TaxonomyPage) {
  return page.entryIds
    .map((id) => getEntryById(id))
    .filter((entry): entry is ContentEntry => Boolean(entry));
}

export function getTaxonomyProjects(page: TaxonomyPage) {
  const slugs = new Set(page.projectSlugs);
  return projects.filter((project) => slugs.has(project.slug));
}

export function getProjectCards(): readonly ProjectCard[] {
  return [...projects].sort((a, b) => {
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }

    return a.order - b.order || a.slug.localeCompare(b.slug);
  });
}

export function getPager(entry: ContentEntry) {
  const peers = getEntries(entry.locale, entry.type).sort((a, b) => {
    if (entry.type === "docs") {
      return a.order - b.order || a.slug.localeCompare(b.slug);
    }
    return b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug);
  });

  const index = peers.findIndex((peer) => peer.id === entry.id);
  return {
    previous: index > 0 ? peers[index - 1] : undefined,
    next: index >= 0 && index < peers.length - 1 ? peers[index + 1] : undefined,
  };
}

export function getRelatedEntries(entry: ContentEntry, limit = 3) {
  const categories = new Set(entry.categories);
  const tags = new Set(entry.tags);

  return registry.entries
    .filter(
      (candidate) =>
        candidate.id !== entry.id &&
        candidate.locale === entry.locale &&
        candidate.type !== "about" &&
        (candidate.categories.some((category) => categories.has(category)) ||
          candidate.tags.some((tag) => tags.has(tag))),
    )
    .sort((a, b) => relatedScore(b, categories, tags) - relatedScore(a, categories, tags))
    .slice(0, limit);
}

function relatedScore(entry: ContentEntry, categories: Set<string>, tags: Set<string>) {
  return (
    entry.categories.filter((category) => categories.has(category)).length * 2 +
    entry.tags.filter((tag) => tags.has(tag)).length
  );
}
