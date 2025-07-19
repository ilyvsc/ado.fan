import React from "react";

import { TimelineClient } from "@/components/root/timeline/TimelineClient";
import { getTimelineSongs } from "@/constants/MusicData";

export const dynamic = "force-dynamic";

export async function DiscographyTimeline() {
  try {
    const songs = await getTimelineSongs();
    return <TimelineClient songs={songs} />;
  } catch (error) {
    return null;
  }
}
