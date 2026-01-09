import { prisma } from "@/prisma/client";
import { albumPrismaSelect, serializeAlbum } from "@/prisma/serializer";
import { Album } from "@/types/album";

/**
 * Fetch all albums with their tracks.
 *
 * Retrieves every album record from the database, including its tracks
 * and associated songs. Albums are ordered by release date (most recent first),
 * and tracks within each album are ordered by their track number.
 * Each song is transformed to match the application's `Song` interface.
 *
 * @returns Promise resolving to an array of albums, each containing its tracks and songs
 *
 * @example
 * ```typescript
 * const albums = await getAllAlbums();
 * console.log(`Found ${albums.length} albums`);
 * console.log(albums[0].title.english); // Album title in English
 * console.log(albums[0].tracks[0].song.title.english); // First track's song title
 * ```
 *
 * @throws {Error} If database connection fails or query execution fails
 */
export async function getAllAlbums(): Promise<Album[]> {
  const albums = await prisma.album.findMany({
    select: albumPrismaSelect,
    orderBy: { releaseDate: "desc" },
  });

  return albums.map(serializeAlbum);
}

/**
 * Fetch a single album with its tracks and songs.
 *
 * Retrieves a specific album by its ID, including track information
 * and associated songs. Tracks are ordered by track number.
 *
 * @param id - The album ID to fetch
 * @returns Promise resolving to the album with tracks and songs, or null if not found
 *
 * @example
 * ```typescript
 * const album = await getAlbumById("album1");
 * console.log(album?.title.english); // Album title
 * console.log(album?.tracks.length); // Number of tracks
 * ```
 *
 * @throws {Error} If database connection fails or query execution fails
 */
export async function getAlbumById(id: string): Promise<Album | null> {
  const album = await prisma.album.findUnique({
    where: { id },
    select: albumPrismaSelect,
  });

  if (!album) return null;

  return serializeAlbum(album);
}

/**
 * Fetch only album metadata without any track or song information.
 *
 * Retrieves a specific album by its ID but does not include its tracks or songs.
 * Useful for lightweight album lookups where track information is not needed.
 *
 * @param id - The album ID to fetch
 * @returns Promise resolving to basic album information or null if not found
 *
 * @example
 * ```typescript
 * const albumInfo = await getAlbumInfoById("album1");
 * console.log(albumInfo?.title.english); // Album title
 * console.log(albumInfo?.releaseDate);   // Release date
 * ```
 *
 * @throws {Error} If database connection fails or query execution fails
 */
export async function getAlbumInfoById(
  id: string,
): Promise<Omit<Album, "tracks"> | null> {
  const album = await prisma.album.findUnique({
    where: { id },
    select: {
      id: true,
      titleEnglish: true,
      titleJapanese: true,
      releaseDate: true,
      type: true,
      coverArt: true,
    },
  });

  if (!album) return null;

  return {
    id: album.id,
    title: {
      english: album.titleEnglish,
      japanese: album.titleJapanese,
    },
    releaseDate: album.releaseDate.toISOString().slice(0, 10),
    type: album.type,
    coverArt: album.coverArt,
  };
}

/**
 * Fetch all albums that contain a specific song.
 *
 * Retrieves all albums where the given song appears as a track,
 * including full track information for each album. Albums are ordered
 * by release date (oldest first).
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
 */
export async function getAlbumsBySongId(songId: string): Promise<Album[]> {
  const albums = await prisma.album.findMany({
    where: {
      tracks: {
        some: {
          songId,
        },
      },
    },
    select: albumPrismaSelect,
    orderBy: { releaseDate: "desc" }, // always first album!!!
  });

  return albums.map(serializeAlbum);
}
