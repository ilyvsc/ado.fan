// import { Metadata } from "next";
import { notFound } from "next/navigation";

// import { buildLyricsMetadata } from "./metadata";

import { Footer } from "@/components/layout/Footer";
import { RelatedAlbumSongs } from "@/features/lyrics/components/RelatedAlbumSongs";
import { SongCreditsDetails } from "@/features/lyrics/components/SongCreditsDetails";
import { SongLyricsHeader } from "@/features/lyrics/components/SongLyricsHeader";
import { SongLyricsModes } from "@/features/lyrics/components/SongLyricsModes";
import { getAlbumsBySongId } from "@/prisma/queries/album";
import { getSongWithLyrics } from "@/prisma/queries/songs";

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ song_id: string }>;
// }): Promise<Metadata> {
//   return buildLyricsMetadata({ params });
// }

export default async function LyricsSongPage({
  params,
}: {
  params: Promise<{ song_id: string }>;
}) {
  const { song_id } = await params;

  const song = await getSongWithLyrics(song_id);

  if (!song) {
    notFound();
  }

  const albums = await getAlbumsBySongId(song.id);
  const themeColor = song.themeColor;

  return (
    <div className="min-h-screen bg-background">
      <SongLyricsHeader song={song} albums={albums} />

      <div className="container mx-auto px-2 py-8 sm:px-4">
        <div className="mx-auto mb-8 max-w-5xl">
          <SongLyricsModes
            japanese={song.lyrics.japanese}
            romaji={song.lyrics.romaji}
            english={song.lyrics.english}
          />
        </div>
      </div>

      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${themeColor} 0%, ${themeColor}dd 100%)`,
        }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-center">
            <SongCreditsDetails song={song} />
          </div>

          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <RelatedAlbumSongs albums={albums} currentSongId={song.id} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
