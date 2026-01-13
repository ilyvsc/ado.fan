import { prisma } from "@/prisma/client";
import type { ExternalLinkDefinition } from "@/types/externalLink";

/**
 * Fetch external links for a specific relation (song or album).
 *
 * @param relationType - The type of relation ("song" or "album")
 * @param relationId - The ID of the related song or album
 * @returns Promise resolving to an array of external links
 *
 * @example
 * ```typescript
 * // Fetch external links for a song
 * const songLinks = await getExternalLinks("song", "usseewa");
 *
 * // Fetch external links for an album
 * const albumLinks = await getExternalLinks("album", "kyogen");
 * ```
 */
export async function getExternalLinks(
  relationType: "song" | "album",
  relationId: string,
): Promise<ExternalLinkDefinition[]> {
  const externalLinks = await prisma.externalLink.findMany({
    where: {
      relationId,
      relationType,
    },
    select: {
      type: true,
      value: true,
      title: true,
      description: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return externalLinks.map((link: ExternalLinkDefinition) => ({
    type: link.type,
    value: link.value,
    title: link.title,
    description: link.description,
  }));
}
