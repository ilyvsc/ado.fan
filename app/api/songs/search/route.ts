import { NextRequest, NextResponse } from "next/server";

import { searchSongsByTitle } from "@/prisma/queries/search";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") ?? "";

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return NextResponse.json([]);
    }

    if (trimmedQuery.length > 50) {
      return NextResponse.json(
        { error: "Search query too long. Maximum 50 characters." },
        { status: 400 },
      );
    }

    const results = await searchSongsByTitle(trimmedQuery);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Failed to search songs:", error);
    return NextResponse.json(
      { error: "Failed to search songs" },
      { status: 500 },
    );
  }
}
