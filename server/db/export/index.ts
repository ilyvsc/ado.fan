import { prisma } from "@/prisma/client";
import { parseCredits } from "@/schemas/credits";
import { parseExternalLinks } from "@/schemas/externalLinks";

import {
  albumFixtureFiles,
  songFixtureFiles,
  type FixtureFile,
} from "./serialize-fixtures";

const SLUG = /^[a-z0-9-]+$/;

// Path-traversal guard: ids become file paths, so reject anything but a slug.
function assertSlug(id: string) {
  if (!SLUG.test(id)) throw new Error(`Invalid id: ${id}`);
}

const toDate = (d: Date) => d.toISOString().slice(0, 10);

export async function exportSong(id: string): Promise<FixtureFile[]> {
  assertSlug(id);
  const song = await prisma.song.findUnique({ where: { id } });
  if (!song) throw new Error(`Song not found: ${id}`);

  const lyrics = await prisma.lyrics.findMany({
    where: { songId: id },
    select: { songId: true, language: true, translator: true, lines: true },
    orderBy: { language: "asc" },
  });

  return songFixtureFiles(
    {
      id: song.id,
      titleEnglish: song.titleEnglish,
      titleJapanese: song.titleJapanese,
      length: song.length,
      releaseDate: toDate(song.releaseDate),
      description: song.description,
      nicoId: song.nicoId,
      youtubeId: song.youtubeId,
      coverArt: song.coverArt,
      themeColor: song.themeColor,
      credits: parseCredits(song.credits),
      externalLinks: parseExternalLinks(song.externalLinks),
    },
    lyrics,
  );
}

export async function exportAlbum(id: string): Promise<FixtureFile[]> {
  assertSlug(id);
  const album = await prisma.album.findUnique({ where: { id } });
  if (!album) throw new Error(`Album not found: ${id}`);

  const tracks = await prisma.albumTrack.findMany({
    where: { albumId: id },
    select: { songId: true, trackNumber: true, isBonusTrack: true },
    orderBy: { trackNumber: "asc" },
  });

  return albumFixtureFiles({
    id: album.id,
    titleEnglish: album.titleEnglish,
    titleJapanese: album.titleJapanese,
    releaseDate: toDate(album.releaseDate),
    type: album.type,
    coverArt: album.coverArt,
    credits: parseCredits(album.credits),
    externalLinks: parseExternalLinks(album.externalLinks),
    tracks,
  });
}

export async function exportEntity(
  entity: "song" | "album",
  id: string,
): Promise<FixtureFile[]> {
  return entity === "song" ? exportSong(id) : exportAlbum(id);
}
