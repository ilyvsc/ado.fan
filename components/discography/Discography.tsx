import { DiscographyClient } from "@/components/discography/DiscographyClient";
import { getAllAlbums } from "@/constants/MusicData";

export async function Discography() {
  try {
    const albums = await getAllAlbums();
    return <DiscographyClient albums={albums} />;
  } catch (error) {
    console.error("Failed to load discography:", error);
    return null;
  }
}
