import { prisma } from "@/prisma/client";
import { Prisma } from "@/prisma/generated/client";
import { albumListPrismaSelect } from "@/prisma/select";
import { serializeAlbumWithoutLyrics } from "@/prisma/serializer";
import { Album } from "@/types/album";

type AlbumWithTracks = Prisma.AlbumGetPayload<{
  select: typeof albumListPrismaSelect;
}>;

/**
 * Fetch all albums that contain a specific song (without lyrics).
 *
 * Retrieves all albums where the given song appears as a track,
 * including track information but excluding lyrics content to reduce
 * payload size. Albums are ordered by release date (most recent first).
 *
 * @param songId - The song ID to search for
 * @returns Promise resolving to an array of albums containing the song
 *
 * @example
 * ```typescript
 * const albums = await getAlbumsBySongId("song1");
 * console.log(`Song appears in ${albums.length} album(s)`);
 * albums.forEach(album => {
 *   console.log(`- ${album.title.english} (${album.type})`);
 * });
 * ```
 *
 * @throws {Error} If database connection fails or query execution fails
 *
 * @note This query excludes lyrics to reduce payload size. Songs in tracks will have empty lyrics fields.
 */
export async function getAlbumsBySongId(songId: string): Promise<Album[]> {
  const albums = (await prisma.album.findMany({
    where: {
      tracks: {
        some: {
          songId,
        },
      },
    },
    select: albumListPrismaSelect,
    orderBy: { releaseDate: "desc" },
  })) as unknown as AlbumWithTracks[];

  return albums.map(serializeAlbumWithoutLyrics);
}
