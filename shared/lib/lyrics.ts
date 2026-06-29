export function formatLyricsMarkdown(text: string): string {
  return text.replace(/\n/g, "  \n");
}
