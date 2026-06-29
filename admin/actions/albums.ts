"use server";

import { requireResource } from "@/admin/auth/guard";
import { type AlbumFormValues } from "@/admin/schemas/albums";
import {
  dbCreateAlbum,
  dbDeleteAlbum,
  dbDuplicateAlbum,
  dbGetAlbum,
  dbListAlbums,
  dbUpdateAlbum,
} from "@/db/queries/admin/albums";
import { recordChange } from "@/db/queries/admin/changes";
import { Prisma } from "@/prisma/client";
import { assertCredits } from "@/schemas/credits";

import type { ListFilter } from "../types/filters";

function buildFilterWhere(filters?: ListFilter[]): Prisma.AlbumWhereInput {
  if (!filters?.length) return {};
  const conditions: Prisma.AlbumWhereInput[] = [];

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
      case "hasTracks":
        if (f.value === true) conditions.push({ tracks: { some: {} } });
        if (f.value === false) conditions.push({ tracks: { none: {} } });
        break;
    }
  }

  return conditions.length ? { AND: conditions } : {};
}

export async function adminListAlbums({
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
  await requireResource("albums", "read");
  const searchWhere: Prisma.AlbumWhereInput = search
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

  const [data, total] = await dbListAlbums({
    where,
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return {
    data: data.map((album) => ({
      ...album,
      releaseDate: album.releaseDate.toISOString().slice(0, 10),
    })),
    total,
  };
}

export async function adminGetAlbum(id: string) {
  await requireResource("albums", "read");
  const album = await dbGetAlbum(id);
  if (!album) throw new Error(`Album not found: ${id}`);
  return { ...album, releaseDate: album.releaseDate.toISOString().slice(0, 10) };
}

export async function adminCreateAlbum(data: AlbumFormValues) {
  const user = await requireResource("albums", "write");
  const album = await dbCreateAlbum(data.id, {
    titleEnglish: data.titleEnglish,
    titleJapanese: data.titleJapanese ?? null,
    releaseDate: new Date(data.releaseDate),
    type: data.type,
    coverArt: data.coverArt ?? null,
    credits: data.credits ? assertCredits(data.credits) : undefined,
    externalLinks: data.externalLinks as Prisma.InputJsonValue | undefined,
  });
  await recordChange("album", album.id, user.id);
  return { ...album, releaseDate: album.releaseDate.toISOString().slice(0, 10) };
}

export async function adminUpdateAlbum(id: string, data: AlbumFormValues) {
  const user = await requireResource("albums", "write");
  const album = await dbUpdateAlbum(id, {
    titleEnglish: data.titleEnglish,
    titleJapanese: data.titleJapanese ?? null,
    releaseDate: new Date(data.releaseDate),
    type: data.type,
    coverArt: data.coverArt ?? null,
    credits: data.credits ? assertCredits(data.credits) : undefined,
    externalLinks: data.externalLinks as Prisma.InputJsonValue | undefined,
  });
  await recordChange("album", id, user.id);
  return { ...album, releaseDate: album.releaseDate.toISOString().slice(0, 10) };
}

export async function adminDeleteAlbum(id: string) {
  await requireResource("albums", "write");
  await dbDeleteAlbum(id);
  return { id };
}

export async function adminDuplicateAlbum(id: string) {
  await requireResource("albums", "write");
  return dbDuplicateAlbum(id);
}
