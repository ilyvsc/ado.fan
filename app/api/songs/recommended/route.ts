import { NextResponse } from "next/server";

import { getRecommendedSongs } from "@/prisma/queries/songs";

export async function GET() {
  try {
    const recommended = await getRecommendedSongs();
    return NextResponse.json(recommended);
  } catch (error) {
    console.error("Failed to fetch recommended songs:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommended songs" },
      { status: 500 },
    );
  }
}
