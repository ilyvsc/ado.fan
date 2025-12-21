import { NextRequest, NextResponse } from "next/server";

import { searchSongsUniversal } from "@/prisma/queries/songs";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") ?? "";

    if (!query.trim()) {
      return NextResponse.json([]);
    }

    const results = await searchSongsUniversal(query);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Failed to search songs:", error);
    return NextResponse.json(
      { error: "Failed to search songs" },
      { status: 500 },
    );
  }
}
