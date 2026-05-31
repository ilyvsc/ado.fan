import { defaultLocale, locales } from "./types";

import type { Metadata } from "next";

export const SEO_BASE_URL = "https://ado.fan";

/**
 * Builds an absolute URL for the given pathname.
 *
 * The pathname may be provided with or without a leading slash.
 *
 * Example:
 *
 * ```ts
 * buildUrl("/") // https://ado.fan/
 * ```
 *
 * @param pathname - Route pathname.
 * @returns Absolute URL for the route.
 */
export function buildUrl(pathname = ""): string {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SEO_BASE_URL}${normalized}`;
}

/**
 * Generates canonical and localized URLs for a route.
 *
 * The default locale is served without a locale prefix, while
 * all other locales are prefixed with their locale code.
 *
 * Example:
 *
 * ```ts
 * buildLocalizedUrls("/lyrics/show")
 * // {
 * //   canonical: "https://ado.fan/lyrics/show",
 * //   languages: {
 * //     en: "https://ado.fan/lyrics/show",
 * //     es: "https://ado.fan/es/lyrics/show"
 * //   }
 * // }
 * ```
 *
 * @param pathname - Route pathname. May be provided with or without a leading slash.
 * @returns Canonical URL and locale-specific alternate URLs.
 */
export function buildLocalizedUrls(pathname = ""): {
  canonical: string;
  languages: Record<string, string>;
} {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const canonical = buildUrl(normalized);

  const languages = Object.fromEntries(
    locales.map((locale) => [
      locale,
      locale === defaultLocale.code ? canonical : buildUrl(`/${locale}${normalized}`),
    ]),
  );

  return { canonical, languages };
}

/**
 * Builds the Next.js metadata alternates configuration for a route.
 *
 * Generates:
 * - A canonical URL for the current pathname.
 * - Localized alternate URLs for all configured locales.
 *
 * This helper is intended for use inside page metadata definitions.
 * For sitemap generation and other SEO utilities, prefer using
 * {@link buildLocalizedUrls} directly.
 *
 * Example:
 *
 * ```ts
 * export const metadata: Metadata = {
 *   alternates: buildAlternates("/lyrics"),
 * };
 * ```
 *
 * @param pathname - Route pathname. May be provided with or without a leading slash.
 * @returns Next.js Metadata alternates configuration.
 */
export function buildAlternates(pathname = ""): Metadata["alternates"] {
  const { canonical, languages } = buildLocalizedUrls(pathname);
  return { canonical, languages };
}
