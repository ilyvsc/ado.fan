function srgbChannelToLinear(channel: number): number {
  const v = channel / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

/**
 * WCAG relative luminance for a 6-digit hex color.
 *
 * @param hex - A 6-digit hex color string (e.g. "#3B82F6").
 * @returns Relative luminance in the range `[0, 1]`.
 *
 * @see https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
function getRelativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return (
    0.2126 * srgbChannelToLinear(r) +
    0.7152 * srgbChannelToLinear(g) +
    0.0722 * srgbChannelToLinear(b)
  );
}

/**
 * Selects the foreground (`black` or `white`) that yields the higher WCAG
 * contrast ratio against the given hex color.
 *
 * Uses the standard WCAG threshold (`L ≈ 0.179`), which is the crossover
 * point between white-on-color and black-on-color contrast ratios.
 *
 * @param hex - A 6-digit hex color string (e.g. "#3B82F6").
 * @returns `"black"` for light backgrounds, `"white"` for dark ones.
 */
export function getContrastColor(hex: string): "white" | "black" {
  return getRelativeLuminance(hex) > 0.179 ? "black" : "white";
}

/**
 * Builds the themed-band background for a song. The result is a CSS
 * `oklch()` expression that lightly tames the theme color and pushes the
 * lightness to a clear side of the WCAG threshold so the paired
 * `--theme-contrast` text remains readable:
 *
 *   - colors that pair with `black` text are lifted to `L >= 0.75`,
 *     producing a soft tinted surface that still reads as the original
 *     hue (e.g. pastel yellow / pink stay clearly yellow / pink).
 *   - colors that pair with `white` text are pulled down to `L =< 0.35`,
 *     producing a deep tinted band where vivid mid-tones (magenta, indigo)
 *     keep most of their character without overwhelming the foreground.
 *
 * Chroma is capped at `0.20`, high enough to preserve recognisable
 * identity for vivid themes, low enough to stop saturated mid-light
 * colors from feeling visually aggressive. The hue is always preserved.
 *
 * @param hex - A 6-digit hex color string.
 * @returns A CSS `oklch(...)` value suitable for a `background` property.
 */
export function getThemeSurface(hex: string): string {
  const lightnessClause =
    getContrastColor(hex) === "black" ? "max(l, 0.75)" : "min(l, 0.35)";
  return `oklch(from ${hex} ${lightnessClause} min(c, 0.20) h)`;
}
