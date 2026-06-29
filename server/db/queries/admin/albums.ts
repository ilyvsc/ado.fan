import { Prisma, prisma } from "@/prisma/client";

const albumAdminSelect = {
  id: true,
  titleEnglish: true,
  titleJapanese: true,
  releaseDate: true,
  type: true,
  coverArt: true,
  credits: true,
  externalLinks: true,
} satisfies Prisma.AlbumSelect;

const albumListSelect = {
  id: true,
  titleEnglish: true,
  titleJapanese: true,
  releaseDate: true,
  type: true,
  coverArt: true,
  externalLinks: true,
  _count: { select: { tracks: true } },
} satisfies Prisma.AlbumSelect;

export async function dbGetAlbum(id: string) {
  return prisma.album.findUnique({ where: { id }, select: albumAdminSelect });
}

export async function dbListAlbums(params: {
  where: Prisma.AlbumWhereInput;
  orderBy:
    | Prisma.AlbumOrderByWithRelationInput
    | Prisma.AlbumOrderByWithRelationInput[];
  skip: number;
  take: number;
}) {
  return Promise.all([
    prisma.album.findMany({
      where: params.where,
      select: albumListSelect,
      orderBy: params.orderBy,
      skip: params.skip,
      take: params.take,
    }),
    prisma.album.count({ where: params.where }),
  ]);
}

export interface AlbumMutationData {
  titleEnglish: string;
  titleJapanese: string | null;
  releaseDate: Date;
  type: Prisma.AlbumCreateInput["type"];
  coverArt: string | null;
  credits?: Prisma.InputJsonValue;
  externalLinks?: Prisma.InputJsonValue;
}

export async function dbCreateAlbum(id: string, data: AlbumMutationData) {
  return prisma.album.create({ data: { id, ...data }, select: albumAdminSelect });
}

export async function dbUpdateAlbum(id: string, data: AlbumMutationData) {
  return prisma.album.update({ where: { id }, data, select: albumAdminSelect });
}

export async function dbDeleteAlbum(id: string) {
  await prisma.album.delete({ where: { id } });
}

export async function dbDuplicateAlbum(id: string): Promise<{ id: string }> {
  const source = await prisma.album.findUnique({
    where: { id },
    select: albumAdminSelect,
  });
  if (!source) throw new Error(`Album not found: ${id}`);

  const newId = `${source.id}-copy`;
  const album = await prisma.album.create({
    data: {
      id: newId,
      titleEnglish: `${source.titleEnglish} (Copy)`,
      titleJapanese: source.titleJapanese,
      releaseDate: source.releaseDate,
      type: source.type,
      coverArt: source.coverArt,
      credits:
        source.credits !== null
          ? (source.credits as Prisma.InputJsonValue)
          : undefined,
    },
    select: { id: true },
  });
  return { id: album.id };
}
