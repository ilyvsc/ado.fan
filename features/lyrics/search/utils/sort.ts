import type { SongListItem, SongSortOption } from "@/types/song";

export function sortSongs<
  T extends { title: { english: string }; releaseDate: string },
>(songs: T[], sort: SongSortOption): T[] {
  const copy = [...songs];
  switch (sort) {
    case "za":
      return copy.sort((a, b) => b.title.english.localeCompare(a.title.english));
    case "newest":
      return copy.sort(
        (a, b) =>
          new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime(),
      );
    case "oldest":
      return copy.sort(
        (a, b) =>
          new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime(),
      );
    default:
      return copy.sort((a, b) => a.title.english.localeCompare(b.title.english));
  }
}

export function applySortAndFilter(
  songs: SongListItem[],
  sort: SongSortOption,
  year: number | null,
): SongListItem[] {
  const filtered = year
    ? songs.filter((s) => new Date(s.releaseDate).getFullYear() === year)
    : songs;
  return sortSongs(filtered, sort);
}
