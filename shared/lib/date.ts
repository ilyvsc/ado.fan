import { defaultLocale } from "@/i18n/types";

export function formatDate(
  value: string | null | undefined,
  locale: Intl.LocalesArgument = defaultLocale.code,
) {
  if (!value) return "—";

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
