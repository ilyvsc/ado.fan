import { songListPrismaSelect, songPrismaSelect } from "@/db/select/song";
import { Prisma, prisma } from "@/prisma/client";

export interface SongMutationData {
  titleEnglish: string;
  titleJapanese: string;
  length: string;
  description: string;
  releaseDate: Date;
  nicoId: string | null;
  youtubeId: string | null;
  coverArt: string;
  themeColor: string | null;
  credits?: Prisma.InputJsonValue;
  externalLinks?: Prisma.InputJsonValue;
}

export async function dbGetSong(id: string) {
  return prisma.song.findUnique({ where: { id }, select: songPrismaSelect });
}

export async function dbListSongs(params: {
  where: Prisma.SongWhereInput;
  orderBy:
    | Prisma.SongOrderByWithRelationInput
    | Prisma.SongOrderByWithRelationInput[];
  skip: number;
  take: number;
}) {
  return Promise.all([
    prisma.song.findMany({
      where: params.where,
      select: {
        ...songListPrismaSelect,
        externalLinks: true,
        _count: { select: { albumTracks: true, lyrics: true } },
      },
      orderBy: params.orderBy,
      skip: params.skip,
      take: params.take,
    }),
    prisma.song.count({ where: params.where }),
  ]);
}

export async function dbCreateSong(id: string, data: SongMutationData) {
  return prisma.song.create({ data: { id, ...data }, select: songPrismaSelect });
}

export async function dbUpdateSong(id: string, data: SongMutationData) {
  return prisma.song.update({ where: { id }, data, select: songPrismaSelect });
}

export async function dbDeleteSong(id: string) {
  await prisma.song.delete({ where: { id } });
}

export async function dbDuplicateSong(id: string): Promise<{ id: string }> {
  const source = await prisma.song.findUnique({
    where: { id },
    select: songPrismaSelect,
  });
  if (!source) throw new Error(`Song not found: ${id}`);

  const newId = `${source.id}-copy`;
  const song = await prisma.song.create({
    data: {
      id: newId,
      titleEnglish: `${source.titleEnglish} (Copy)`,
      titleJapanese: source.titleJapanese,
      length: source.length,
      description: source.description,
      releaseDate: source.releaseDate,
      nicoId: null,
      youtubeId: null,
      coverArt: source.coverArt,
      themeColor: source.themeColor ?? null,
      credits:
        source.credits !== null
          ? (source.credits as Prisma.InputJsonValue)
          : undefined,
    },
    select: { id: true },
  });
  return { id: song.id };
}

export async function dbGetSongLyrics(songId: string) {
  return prisma.lyrics.findMany({
    where: { songId },
    select: { language: true, translator: true, lines: true },
    orderBy: { language: "asc" },
  });
}

export async function dbUpsertLyrics(
  songId: string,
  language: string,
  lines: string[],
  translator: string | null,
) {
  return prisma.lyrics.upsert({
    where: { songId_language: { songId, language } },
    create: { songId, language, lines, translator },
    update: { lines, translator },
    select: { language: true, translator: true, lines: true },
  });
}

export async function dbDeleteLyrics(songId: string, language: string) {
  await prisma.lyrics.delete({ where: { songId_language: { songId, language } } });
}
