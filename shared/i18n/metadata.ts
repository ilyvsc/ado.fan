import { defaultLocale, locales } from "./types";

import type { Metadata } from "next";

/**
 * Builds the Next.js metadata alternates configuration for a route.
 *
 * Generates:
 * - A canonical URL for the current pathname.
 * - Localized alternate URLs for all configured locales.
 *
 * The default locale is served without a locale prefix, while all
 * other locales are prefixed with their locale code.
 *
 * Example:
 *
 * ```js
 * buildAlternates("/")
 * => {
 *   canonical: "https://ado.fan/",
 *   languages: {
 *     en: "https://ado.fan/",
 *     es: "https://ado.fan/es/"
 *   }
 * }
 * ```
 *
 * @param pathname - Route pathname. May be provided with or without a leading slash.
 * @returns Next.js Metadata alternates configuration containing canonical and localized URLs.
 */
export function buildAlternates(pathname = ""): Metadata["alternates"] {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;

  return {
    canonical: `https://ado.fan${normalized}`,
    languages: Object.fromEntries(
      locales.map((locale) => [
        locale,
        locale === defaultLocale.code
          ? `https://ado.fan${normalized}`
          : `https://ado.fan/${locale}${normalized}`,
      ]),
    ),
  };
}
