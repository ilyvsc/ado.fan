import { SiNiconico, SiYoutube } from "@icons-pack/react-simple-icons";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Mic,
  Music2,
  Sparkles,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { LyricsDisplay } from "@/components/features/lyrics/LyricsSong";
import { prisma } from "@/prisma/client";
import { serializeSong, songPrismaSelect } from "@/prisma/serializer";

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
  const themeColor = song.themeColor;

  return (
    <div className="min-h-screen bg-background">
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${themeColor} 0%)`,
        }}
      >
        <div className="relative container mx-auto px-4 py-8 sm:px-6 sm:py-12">
          <Link
            href="/lyrics"
            className="mb-6 inline-flex items-center gap-2 text-white/90 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Lyrics</span>
          </Link>

          <div className="flex flex-col gap-6 md:flex-row md:gap-8 lg:gap-12">
            <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-lg shadow-2xl md:h-56 md:w-56 lg:h-64 lg:w-64">
              <Image
                src={song.coverArt}
                alt={`${song.title.english} (${song.title.japanese})`}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="flex flex-col justify-end pb-2 text-white">
              <h1 className="mb-2 font-gambarino text-4xl leading-tight font-black md:text-5xl lg:text-6xl">
                {song.title.english}
              </h1>
              {song.title.japanese && (
                <h2 className="mb-4 text-xl font-medium opacity-90 md:text-2xl">
                  {song.title.japanese}
                </h2>
              )}

              {song.albumTrack && (
                <Link
                  href={`/album/${song.albumTrack.album.id}`}
                  className="mb-3 inline-flex items-center gap-2 text-sm font-medium opacity-90 transition-opacity hover:opacity-100"
                >
                  <Music2 className="h-4 w-4" />
                  <span>Track {song.albumTrack.trackNumber} on</span>
                  <span className="font-semibold underline decoration-white/40 underline-offset-2">
                    {song.albumTrack.album.title.english} (
                    {song.albumTrack.album.title.japanese})
                  </span>
                </Link>
              )}

              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm font-medium opacity-90">
                <div className="flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  <span>Ado</span>
                </div>
                <span className="opacity-60">•</span>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{song.releaseDate}</span>
                </div>
                <span className="opacity-60">•</span>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{song.length}</span>
                </div>
              </div>

              {(song.youtubeId || song.nicoId) && (
                <div className="flex flex-wrap gap-2">
                  {song.youtubeId && (
                    <a
                      href={`https://www.youtube.com/watch?v=${song.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-red-700 hover:shadow-md"
                    >
                      <SiYoutube className="h-4 w-4" />
                      <span>YouTube</span>
                    </a>
                  )}
                  {song.nicoId && (
                    <a
                      href={`https://www.nicovideo.jp/watch/${song.nicoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 transition-all hover:bg-gray-50 hover:shadow-md"
                    >
                      <SiNiconico className="h-4 w-4" />
                      <span>NicoNico</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-5xl">
          {song.description && (
            <div className="mb-8 rounded-xl border border-foreground/5 bg-background/50 p-6">
              <div className="flex items-start gap-4">
                <div className="shrink-0 rounded-lg bg-foreground/5 p-2.5">
                  <Sparkles className="h-4 w-4" style={{ color: themeColor }} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs font-bold tracking-widest text-muted-foreground/70 uppercase">
                    About this Track
                  </h3>
                  <p className="font-sans text-base leading-relaxed text-foreground/90">
                    {song.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-12">
            <LyricsDisplay
              japanese={song.lyrics.japanese}
              romaji={song.lyrics.romaji}
              english={song.lyrics.english}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
