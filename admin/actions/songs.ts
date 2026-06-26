"use server";

import { requireResource } from "@/admin/auth/guard";
import { type SongFormValues } from "@/admin/schemas/songs";
import {
  dbCreateSong,
  dbDeleteLyrics,
  dbDeleteSong,
  dbDuplicateSong,
  dbGetSong,
  dbGetSongLyrics,
  dbListSongs,
  dbUpdateSong,
  dbUpsertLyrics,
} from "@/db/queries/admin/songs";
import { getAlbumsBySongId } from "@/db/queries/album";
import { Prisma } from "@/prisma/client";
import { assertCredits } from "@/schemas/credits";

import type { ListFilter } from "../types/filters";

function buildFilterWhere(filters?: ListFilter[]): Prisma.SongWhereInput {
  if (!filters?.length) return {};
  const conditions: Prisma.SongWhereInput[] = [];

  for (const f of filters) {
    switch (f.field) {
      case "releaseDate":
        if (f.operator === "gte") {
          const v =
            typeof f.value === "number"
              ? new Date(`${f.value}-01-01`)
              : new Date(String(f.value));
          conditions.push({ releaseDate: { gte: v } });
        }
        if (f.operator === "lte") {
          const v =
            typeof f.value === "number"
              ? new Date(`${f.value}-12-31`)
              : new Date(String(f.value));
          conditions.push({ releaseDate: { lte: v } });
        }
        break;
      case "hasLyrics":
        if (f.value === true) conditions.push({ lyrics: { some: {} } });
        if (f.value === false) conditions.push({ lyrics: { none: {} } });
        break;
      case "hasAlbums":
        if (f.value === true) conditions.push({ albumTracks: { some: {} } });
        if (f.value === false) conditions.push({ albumTracks: { none: {} } });
        break;
      case "hasThemeColor":
        if (f.value === true) {
          conditions.push({ themeColor: { not: null } });
          conditions.push({ themeColor: { not: "" } });
        }
        if (f.value === false)
          conditions.push({ OR: [{ themeColor: null }, { themeColor: "" }] });
        break;
    }
  }

  return conditions.length ? { AND: conditions } : {};
}

export async function adminListSongs({
  page,
  pageSize,
  search,
  filters,
  sorters,
}: {
  page: number;
  pageSize: number;
  search?: string;
  filters?: ListFilter[];
  sorters?: { field: string; order: "asc" | "desc" }[];
}) {
  await requireResource("songs", "read");
  const searchWhere: Prisma.SongWhereInput = search
    ? {
        OR: [
          { titleEnglish: { contains: search, mode: "insensitive" } },
          { titleJapanese: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};
  const where = { ...searchWhere, ...buildFilterWhere(filters) };
  const orderBy = sorters?.length
    ? sorters.map((s) => ({ [s.field]: s.order }))
    : [{ releaseDate: "desc" as const }];

  const [data, total] = await dbListSongs({
    where,
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return {
    data: data.map((song) => ({
      ...song,
      releaseDate: song.releaseDate.toISOString().slice(0, 10),
    })),
    total,
  };
}

export async function adminGetSong(id: string) {
  await requireResource("songs", "read");
  const song = await dbGetSong(id);
  if (!song) throw new Error(`Song not found: ${id}`);
  return { ...song, releaseDate: song.releaseDate.toISOString().slice(0, 10) };
}

export async function adminCreateSong(data: SongFormValues) {
  await requireResource("songs", "write");
  const song = await dbCreateSong(data.id, {
    titleEnglish: data.titleEnglish,
    titleJapanese: data.titleJapanese,
    length: data.length,
    description: data.description,
    releaseDate: new Date(data.releaseDate),
    nicoId: data.nicoId ?? null,
    youtubeId: data.youtubeId ?? null,
    coverArt: data.coverArt,
    themeColor: data.themeColor ?? null,
    credits: data.credits ? assertCredits(data.credits) : undefined,
    externalLinks: data.externalLinks as Prisma.InputJsonValue | undefined,
  });
  return { ...song, releaseDate: song.releaseDate.toISOString().slice(0, 10) };
}

export async function adminUpdateSong(id: string, data: SongFormValues) {
  await requireResource("songs", "write");
  const song = await dbUpdateSong(id, {
    titleEnglish: data.titleEnglish,
    titleJapanese: data.titleJapanese,
    length: data.length,
    description: data.description,
    releaseDate: new Date(data.releaseDate),
    nicoId: data.nicoId ?? null,
    youtubeId: data.youtubeId ?? null,
    coverArt: data.coverArt,
    themeColor: data.themeColor ?? null,
    credits: data.credits ? assertCredits(data.credits) : undefined,
    externalLinks: data.externalLinks as Prisma.InputJsonValue | undefined,
  });
  return { ...song, releaseDate: song.releaseDate.toISOString().slice(0, 10) };
}

export async function adminGetSongAlbums(id: string) {
  await requireResource("songs", "read");
  return getAlbumsBySongId(id);
}

export async function adminDeleteSong(id: string) {
  await requireResource("songs", "write");
  await dbDeleteSong(id);
  return { id };
}

export async function adminDuplicateSong(id: string) {
  await requireResource("songs", "write");
  return dbDuplicateSong(id);
}

export async function adminGetSongLyrics(songId: string) {
  await requireResource("songs", "read");
  return dbGetSongLyrics(songId);
}

export async function adminUpsertLyrics(
  songId: string,
  language: string,
  lines: string[],
  translator: string | null,
) {
  await requireResource("songs", "write");
  return dbUpsertLyrics(songId, language, lines, translator);
}

export async function adminDeleteLyrics(songId: string, language: string) {
  await requireResource("songs", "write");
  await dbDeleteLyrics(songId, language);
}
