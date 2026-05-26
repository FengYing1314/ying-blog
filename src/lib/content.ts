import { projects } from "../config/projects";
import { contentRegistry as generatedContentRegistry } from "../generated/content";
import type {
  ContentEntry,
  ContentRegistry,
  ContentType,
  Locale,
  ProjectCard,
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
  return projects;
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
