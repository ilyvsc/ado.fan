import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ExternalLinks } from "@/components/ExternalLinks";
import { Footer } from "@/components/layout/Footer";
import { RelatedAlbumSongs } from "@/features/lyrics/reader/components/RelatedAlbumSongs";
import { SongCreditsDetails } from "@/features/lyrics/reader/components/SongCreditsDetails";
import { SongLyricsHeader } from "@/features/lyrics/reader/components/SongLyricsHeader";
import { SongLyricsModes } from "@/features/lyrics/reader/components/SongLyricsModes";
import { TrackRecentlyViewed } from "@/features/lyrics/reader/components/TrackRecentlyViewed";
import { serializeLyricsToLanguages } from "@/features/lyrics/utils/serializeLyrics";
import { getContrastColor } from "@/lib/color";
import { getAlbumsBySongId } from "@/prisma/queries/album";
import { getSongById, getSongLyricsById } from "@/prisma/queries/songs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ song_id: string }>;
}): Promise<Metadata> {
  const { song_id } = await params;
  const song = await getSongById(song_id);
  if (!song) return {};

  const titleDisplay = song.title.japanese
    ? `${song.title.english} (${song.title.japanese})`
    : song.title.english;

  const description =
    song.description ||
    `Read ${song.title.english} lyrics by Ado in Japanese, English, and romanized text.`;

  return {
    title: `${titleDisplay} Lyrics`,
    description,
    keywords: [
      song.title.english,
      song.title.japanese,
      "Ado",
      "lyrics",
      "Japanese lyrics",
    ].filter(Boolean),
    alternates: {
      canonical: `https://ado.fan/lyrics/${song_id}`,
    },
    openGraph: {
      title: `${titleDisplay} — ado.fan`,
      siteName: "ado.fan",
      description,
      url: `https://ado.fan/lyrics/${song_id}`,
      type: "music.song",
      images: [{ url: song.coverArt, alt: `${song.title.english} cover art` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${titleDisplay} Lyrics — ado.fan`,
      description,
      images: [song.coverArt],
    },
  };
}

export default async function LyricsSongPage({
  params,
}: {
  params: Promise<{ song_id: string }>;
}) {
  const { song_id } = await params;
  const song = await getSongById(song_id);

  if (!song) notFound();

  const [rawLyrics, albums] = await Promise.all([
    getSongLyricsById(song_id),
    getAlbumsBySongId(song.id),
  ]);

  const availableLanguages = serializeLyricsToLanguages(rawLyrics);

  return (
    <div
      className="min-h-screen bg-background"
      style={
        {
          "--theme-color": song.themeColor || "var(--color-background)",
          "--theme-contrast": song.themeColor
            ? getContrastColor(song.themeColor)
            : "var(--color-foreground)",
        } as React.CSSProperties
      }
    >
      <TrackRecentlyViewed songId={song.id} />
      <SongLyricsHeader song={song} albums={albums} />

      <div className="container mx-auto px-2 py-8 sm:px-4">
        <div className="mx-auto mb-8 max-w-5xl">
          <SongLyricsModes availableLanguages={availableLanguages} />
        </div>
      </div>

      <div className="relative overflow-hidden bg-(--theme-color)">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-center">
            <SongCreditsDetails song={song} />
          </div>
          <div className="grid lg:grid-cols-2 lg:items-start lg:gap-6">
            <RelatedAlbumSongs albums={albums} currentSongId={song.id} />
            <ExternalLinks links={song.externalLinks ?? []} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
