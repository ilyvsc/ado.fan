import { prisma } from "@/prisma/client";
import { buildLocalizedUrls, SEO_BASE_URL } from "@/shared/i18n/metadata";

import type { MetadataRoute } from "next";

function durationToSeconds(duration: string): number {
  const [minutes, seconds] = duration.split(":");
  if (!minutes || !seconds) return 0;
  return Number(minutes) * 60 + Number(seconds);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const songs = await prisma.song.findMany({
    select: {
      id: true,
      titleEnglish: true,
      titleJapanese: true,
      releaseDate: true,
      description: true,
      length: true,
      coverArt: true,
      youtubeId: true,
      nicoId: true,
    },
  });

  const songEntries: MetadataRoute.Sitemap = songs.map((song) => {
    const baseVideoMetadata = {
      title: `${song.titleEnglish}${song.titleJapanese ? ` (${song.titleJapanese})` : ""} - Ado`,
      description: song.description,
      duration: durationToSeconds(song.length),
      publication_date: new Date(song.releaseDate),
      requires_subscription: "no" as const,
      family_friendly: "yes" as const,
      live: "no" as const,
    };

    const videos = [];

    if (song.youtubeId) {
      videos.push({
        ...baseVideoMetadata,
        content_loc: `https://youtu.be/${song.youtubeId}`,
        player_loc: `https://www.youtube-nocookie.com/embed/${song.youtubeId}`,
        thumbnail_loc: `https://img.youtube.com/vi/${song.youtubeId}/maxresdefault.jpg`,
      });
    }

    if (song.nicoId) {
      videos.push({
        ...baseVideoMetadata,
        content_loc: `https://www.nicovideo.jp/watch/${song.nicoId}`,
        player_loc: `https://embed.nicovideo.jp/watch/${song.nicoId}`,
        thumbnail_loc: "",
      });
    }

    return {
      url: `${SEO_BASE_URL}/lyrics/${song.id}`,
      alternates: buildLocalizedUrls(`/lyrics/${song.id}`),
      images: [song.coverArt],
      videos: videos,
      lastModified: song.releaseDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    };
  });

  return [
    {
      url: SEO_BASE_URL,
      alternates: buildLocalizedUrls(SEO_BASE_URL),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SEO_BASE_URL}/lyrics/`,
      alternates: buildLocalizedUrls(`${SEO_BASE_URL}/lyrics/`),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...songEntries,
  ];
}
