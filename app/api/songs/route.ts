import { NextResponse } from "next/server";

import { getAllSongs } from "@/prisma/queries/songs";

export async function GET() {
  try {
    const songs = await getAllSongs();
    return NextResponse.json(songs);
  } catch (error) {
    console.error("Failed to fetch songs:", error);
    return NextResponse.json(
      { error: "Failed to fetch songs" },
      { status: 500 },
    );
  }
}
