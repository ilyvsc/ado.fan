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

      if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        return NextResponse.json(
          { error: "Invalid limit parameter." },
          { status: 400 },
        );
      }

      if (isNaN(offsetNum) || offsetNum < 0) {
        return NextResponse.json(
          { error: "Invalid offset parameter." },
          { status: 400 },
        );
      }

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
