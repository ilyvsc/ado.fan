import { NextResponse } from "next/server";

import {
  getAllSongsForListing,
  getPaginatedSongsForListing,
} from "@/prisma/queries/songs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    if (limit !== null || offset !== null) {
      const limitNum = limit ? parseInt(limit, 10) : 24;
      const offsetNum = offset ? parseInt(offset, 10) : 0;

      const result = await getPaginatedSongsForListing(limitNum, offsetNum);
      return NextResponse.json(result);
    }

    const songs = await getAllSongsForListing();
    return NextResponse.json(songs);
  } catch (error) {
    console.error("Failed to fetch songs:", error);
    return NextResponse.json(
      { error: "Failed to fetch songs" },
      { status: 500 },
    );
  }
}
