import type { MetadataRoute } from "next";

import { getAllSongsForSitemap } from "@/db/queries/songs";
import { buildLocalizedUrls, durationToSeconds, SEO_BASE_URL } from "@/lib/metadata";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const songs = await getAllSongsForSitemap();

  const songEntries: MetadataRoute.Sitemap = songs.map((song) => {
    const baseVideoMetadata = {
      title: `${song.titleEnglish}${song.titleJapanese ? ` (${song.titleJapanese})` : ""} - Ado`,
      description: song.description ?? "",
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
      images: song.coverArt ? [song.coverArt] : [],
      videos: videos,
      lastModified: song.releaseDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    };
  });

  return [
    {
      url: SEO_BASE_URL,
      alternates: buildLocalizedUrls("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SEO_BASE_URL}/lyrics/`,
      alternates: buildLocalizedUrls("/lyrics/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...songEntries,
  ];
}
