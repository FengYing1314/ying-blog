import { defaultLocale, locales, siteConfig } from "../config/site";
import type { Locale } from "../types/content";

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function localeFromPath(path: string): Locale {
  const [, segment] = path.split("/");
  return isLocale(segment) ? segment : defaultLocale;
}

export function withTrailingSlash(path: string) {
  if (path === "/") {
    return path;
  }
  return path.endsWith("/") ? path : `${path}/`;
}

export function absoluteUrl(path: string) {
  const normalizedPath = withTrailingSlash(path);
  return `${siteConfig.url.replace(/\/$/, "")}${withBasePath(normalizedPath)}`;
}

export function absoluteFileUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url.replace(/\/$/, "")}${withBasePath(normalizedPath)}`;
}

export function withBasePath(path: string) {
  const basePath = siteConfig.basePath === "/" ? "" : siteConfig.basePath.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
}

export function localizedPath(locale: Locale, segment = "") {
  const normalizedSegment = segment.replace(/^\/|\/$/g, "");
  return normalizedSegment ? `/${locale}/${normalizedSegment}/` : `/${locale}/`;
}
