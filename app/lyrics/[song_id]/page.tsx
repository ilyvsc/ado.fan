import { notFound } from "next/navigation";

import { ExternalLinks } from "@/components/ExternalLinks";
import { RelatedAlbumSongs } from "@/features/lyrics/reader/components/RelatedAlbumSongs";
import { SongCreditsDetails } from "@/features/lyrics/reader/components/SongCreditsDetails";
import { SongLyricsHeader } from "@/features/lyrics/reader/components/SongLyricsHeader";
import { SongLyricsModes } from "@/features/lyrics/reader/components/SongLyricsModes";
import { TrackRecentlyViewed } from "@/features/lyrics/reader/components/TrackRecentlyViewed";
import { serializeLyricsToLanguages } from "@/features/lyrics/utils/serializeLyrics";
import { getContrastColor, getThemeSurface } from "@/lib/color";
import { buildAlternates, buildUrl, durationToIso8601 } from "@/lib/metadata";
import { prisma } from "@/prisma/client";
import { getAlbumsBySongId } from "@/prisma/queries/album";
import { getSongById, getSongLyricsById } from "@/prisma/queries/songs";

import type { Metadata } from "next";

export async function generateStaticParams() {
  const songs = await prisma.song.findMany({ select: { id: true } });
  return songs.map(({ id }) => ({ song_id: id }));
}

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
    `Read ${song.title.english} lyrics by Ado in Japanese, English, and romaji.`;

  return {
    title: `${titleDisplay} Lyrics`,
    description: description,
    keywords: [
      song.title.english,
      song.title.japanese,
      "Ado",
      "lyrics",
      "Japanese lyrics",
      "romaji",
    ].filter(Boolean),
    alternates: buildAlternates(`/lyrics/${song_id}`),
    openGraph: {
      title: `${titleDisplay} - ado.fan`,
      siteName: "ado.fan",
      description: description,
      url: buildUrl(`/lyrics/${song_id}`),
      type: "music.song",
      images: [{ url: song.coverArt, alt: `${song.title.english} cover art` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${titleDisplay} Lyrics - ado.fan`,
      description: description,
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

  const sameAs = [
    song.youtubeId && `https://www.youtube.com/watch?v=${song.youtubeId}`,
    song.nicoId && `https://www.nicovideo.jp/watch/${song.nicoId}`,
  ].filter(Boolean);

  const songSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    "@id": buildUrl(`/lyrics/${song.id}`),
    name: song.title.english,
    alternateName: song.title.japanese,
    byArtist: {
      name: "Ado",
      "@type": "Person",
      "@id": "https://ado.fan/#person",
    },
    duration: durationToIso8601(song.length),
    datePublished: song.releaseDate,
    image: song.coverArt,
    url: buildUrl(`/lyrics/${song.id}`),
    sameAs: sameAs.length ? sameAs : undefined,
    description:
      song.description ||
      `Read ${song.title.english} lyrics by Ado in Japanese, English, and romaji.`,
  });

  return (
    <>
      <script
        id={`schema-song-${song.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: songSchema }}
      />
      <div
        className="min-h-screen bg-background"
        style={
          {
            "--theme-color": song.themeColor ?? "var(--color-background)",
            "--theme-surface": song.themeColor
              ? getThemeSurface(song.themeColor)
              : "var(--color-background)",
            "--theme-contrast": song.themeColor
              ? getContrastColor(song.themeColor)
              : "var(--color-foreground)",
          } as React.CSSProperties
        }
      >
        <TrackRecentlyViewed songId={song.id} />
        <SongLyricsHeader song={song} albums={albums} />

        <div className="container mx-auto px-2 py-8">
          <div className="mx-auto mb-8 max-w-5xl">
            <SongLyricsModes availableLanguages={availableLanguages} />
          </div>
        </div>

        <div className="relative overflow-hidden bg-(--theme-surface)">
          <div className="container mx-auto px-4">
            <SongCreditsDetails song={song} />
            <div className="mx-auto grid max-w-6xl lg:grid-cols-2 lg:items-start">
              <RelatedAlbumSongs albums={albums} currentSongId={song.id} />
              <ExternalLinks links={song.externalLinks ?? []} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
