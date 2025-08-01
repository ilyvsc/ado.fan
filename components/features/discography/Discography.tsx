import { DiscographyClient } from "./DiscographyClient";

import { getAllAlbums } from "@/prisma/queries/albums";

export const dynamic = "force-dynamic";

export async function Discography() {
  try {
    const albums = await getAllAlbums();
    return <DiscographyClient albums={albums} />;
  } catch (error) {
    console.error("Failed to load discography:", error);
    return null;
  }
}
