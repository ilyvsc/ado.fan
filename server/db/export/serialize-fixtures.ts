import type { Credits } from "@/schemas/credits";
import type { ExternalLinks } from "@/schemas/externalLinks";

export interface FixtureFile {
  path: string;
  content: string;
}

export interface SongFixtureInput {
  id: string;
  titleEnglish: string;
  titleJapanese: string | null;
  length: string;
  releaseDate: string;
  description: string | null;
  nicoId: string | null;
  youtubeId: string | null;
  coverArt: string | null;
  themeColor: string | null;
  credits: Credits | null;
  externalLinks: ExternalLinks;
}

export interface LyricsFixtureInput {
  songId: string;
  language: string;
  translator: string | null;
  lines: string[];
}

export interface AlbumFixtureInput {
  id: string;
  titleEnglish: string;
  titleJapanese: string | null;
  releaseDate: string;
  type: string;
  coverArt: string | null;
  credits: Credits | null;
  externalLinks: ExternalLinks;
  tracks: { songId: string; trackNumber: number; isBonusTrack: boolean }[];
}

// ponytail: targets the refactored FLAT fixtures layout — songs/<id>/…, albums/<id>.json.
// No category folder (dropped per design). Adjust SONG_DIR/ALBUM_DIR if the refactor lands elsewhere.
const SONG_DIR = "prisma/fixtures/songs";
const ALBUM_DIR = "prisma/fixtures/albums";

const json = (value: unknown) => JSON.stringify(value, null, 2) + "\n";

// Inverse of seed's resolveCoverArt: strip CDN prefix + .webp back to the raw stored path.
// ponytail: leaves a leading slash if present; the refactor normalizes slash convention.
export function toRawCoverArt(
  stored: string,
  cdnUrl = process.env.NEXT_PUBLIC_CDN_URL,
): string {
  if (!stored) return "";
  const cdn = (cdnUrl ?? "").replace(/\/$/, "");
  let path = stored;
  if (cdn && path.startsWith(cdn)) path = path.slice(cdn.length);
  if (path.endsWith(".webp")) path = path.slice(0, -".webp".length);
  return path;
}

function lyricsFrontmatter(lyric: LyricsFixtureInput): string {
  const lines = [`language: ${lyric.language}`, `songId: ${lyric.songId}`];
  // JSON.stringify yields a valid double-quoted YAML scalar (handles names with punctuation).
  if (lyric.translator) lines.push(`translator: ${JSON.stringify(lyric.translator)}`);
  return `---\n${lines.join("\n")}\n---\n\n${lyric.lines.join("\n")}\n`;
}

export function songFixtureFiles(
  song: SongFixtureInput,
  lyrics: LyricsFixtureInput[],
  opts: { cdnUrl?: string } = {},
): FixtureFile[] {
  const meta: Record<string, unknown> = {
    id: song.id,
    title: { english: song.titleEnglish, japanese: song.titleJapanese ?? "" },
    length: song.length,
    releaseDate: song.releaseDate,
    youtubeId: song.youtubeId ?? "",
    nicoId: song.nicoId ?? "",
    coverArt: toRawCoverArt(song.coverArt ?? "", opts.cdnUrl),
    themeColor: song.themeColor ?? "",
  };
  if (song.credits) meta.credits = song.credits;
  if (song.externalLinks.length) meta.externalLinks = song.externalLinks;

  const files: FixtureFile[] = [
    { path: `${SONG_DIR}/${song.id}/meta.json`, content: json(meta) },
  ];

  if (song.description?.trim()) {
    files.push({
      path: `${SONG_DIR}/${song.id}/description.md`,
      content: song.description.trim() + "\n",
    });
  }

  for (const lyric of lyrics) {
    files.push({
      path: `${SONG_DIR}/${song.id}/lyrics/${lyric.language}.md`,
      content: lyricsFrontmatter(lyric),
    });
  }

  return files;
}

export function albumFixtureFiles(
  album: AlbumFixtureInput,
  opts: { cdnUrl?: string } = {},
): FixtureFile[] {
  const data: Record<string, unknown> = {
    id: album.id,
    titleEnglish: album.titleEnglish,
    titleJapanese: album.titleJapanese ?? "",
    releaseDate: album.releaseDate,
    type: album.type,
    coverArt: toRawCoverArt(album.coverArt ?? "", opts.cdnUrl),
  };
  if (album.credits) data.credits = album.credits;
  if (album.externalLinks.length) data.externalLinks = album.externalLinks;
  data.tracks = album.tracks.map((t) => ({
    songId: t.songId,
    trackNumber: t.trackNumber,
    ...(t.isBonusTrack ? { isBonusTrack: true } : {}),
  }));

  return [{ path: `${ALBUM_DIR}/${album.id}.json`, content: json(data) }];
}
