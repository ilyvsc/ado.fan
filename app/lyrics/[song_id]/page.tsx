import { notFound } from "next/navigation";

import { ExternalLinks } from "@/components/ExternalLinks";
import { Footer } from "@/components/layout/Footer";
import { RelatedAlbumSongs } from "@/features/lyrics/reader/components/RelatedAlbumSongs";
import { SongCreditsDetails } from "@/features/lyrics/reader/components/SongCreditsDetails";
import { SongLyricsHeader } from "@/features/lyrics/reader/components/SongLyricsHeader";
import { SongLyricsModes } from "@/features/lyrics/reader/components/SongLyricsModes";
import { serializeLyricsToLanguages } from "@/features/lyrics/utils/serializeLyrics";
import { getAlbumsBySongId } from "@/prisma/queries/album";
import { getExternalLinks } from "@/prisma/queries/externalLinks";
import { getSongById, getSongLyricsById } from "@/prisma/queries/songs";

export default async function LyricsSongPage({
  params,
}: {
  params: Promise<{ song_id: string }>;
}) {
  const { song_id } = await params;
  const song = await getSongById(song_id);

  if (!song) notFound();

  const [rawLyrics, albums, externalLinks] = await Promise.all([
    getSongLyricsById(song_id),
    getAlbumsBySongId(song.id),
    getExternalLinks("song", song.id),
  ]);

  const availableLanguages = serializeLyricsToLanguages(rawLyrics);

  return (
    <div className="min-h-screen bg-background">
      <SongLyricsHeader song={song} albums={albums} />

      <div className="container mx-auto px-2 py-8 sm:px-4">
        <div className="mx-auto mb-8 max-w-5xl">
          <SongLyricsModes availableLanguages={availableLanguages} />
        </div>
      </div>

      <div
        className="relative overflow-hidden"
        style={{ background: song.themeColor }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-center">
            <SongCreditsDetails song={song} />
          </div>
          <div className="grid lg:grid-cols-2 lg:items-start lg:gap-6">
            <RelatedAlbumSongs albums={albums} currentSongId={song.id} />
            <ExternalLinks links={externalLinks} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
