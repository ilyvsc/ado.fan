import { prisma } from "@/prisma/client";

import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const songs = await prisma.song.findMany({
    select: { id: true, releaseDate: true },
  });

  const songEntries: MetadataRoute.Sitemap = songs.map((song) => ({
    url: `https://ado.fan/lyrics/${song.id}`,
    lastModified: song.releaseDate,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: "https://ado.fan",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://ado.fan/lyrics",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...songEntries,
  ];
}
