const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31536000],
  ["month", 2592000],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
];

export function timeAgo(date: Date | string): string {
  const sec = Math.round((Date.now() - new Date(date).getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, s] of UNITS) {
    if (Math.abs(sec) >= s) return rtf.format(-Math.round(sec / s), unit);
  }
  return rtf.format(-sec, "second");
}
