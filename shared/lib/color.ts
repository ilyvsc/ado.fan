/**
 * Calculates the perceived luminance of the color using the standard
 * RGB weighting formula and selects the text color that provides
 * better visual contrast.
 *
 * @param hex - A 6-digit hex color string (e.g. "#3B82F6").
 * @returns Ideal constrast color (`black` or `white`) for a given `hex` color.
 *
 * @example
 * getContrastColor("#FFFFFF"); // "black"
 *
 * @example
 * getContrastColor("#000000"); // "white"
 */
export function getContrastColor(hex: string): "white" | "black" {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "black" : "white";
}
