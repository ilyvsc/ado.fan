import { Metadata } from "next";
import { notFound } from "next/navigation";

import { buildLyricsMetadata } from "./metadata";

import { RelatedAlbumSongs } from "@/components/features/lyrics/RelatedAlbumSongs";
import { SongCreditsDetails } from "@/components/features/lyrics/SongCreditsDetails";
import { SongLyricsHeader } from "@/components/features/lyrics/SongLyricsHeader";
import { SongLyricsModes } from "@/components/features/lyrics/SongLyricsModes";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/prisma/client";
import { getAlbumsBySongId } from "@/prisma/queries/albums";
import { serializeSong, songPrismaSelect } from "@/prisma/serializer";

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

  const songData = await prisma.song.findUnique({
    where: { id: song_id },
    select: songPrismaSelect,
  });

  if (!songData) {
    notFound();
  }

  const song = serializeSong(songData);
  const albums = await getAlbumsBySongId(song.id);
  const themeColor = song.themeColor;

  return (
    <div className="min-h-screen bg-background">
      <SongLyricsHeader song={song} albums={albums} />

      <div className="container mx-auto px-4 py-8 sm:px-4">
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
