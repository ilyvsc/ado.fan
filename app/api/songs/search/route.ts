import { NextRequest, NextResponse } from "next/server";

import { searchSongsByTitle } from "@/db/queries/search";

const LIMIT = 10;
const WINDOW_MS = 60_000;
const rate_limit_hits = new Map<string, { count: number; reset: number }>();

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const rec = rate_limit_hits.get(ip);

  if (!rec || Date.now() > rec.reset) {
    rate_limit_hits.set(ip, { count: 1, reset: Date.now() + WINDOW_MS });
  } else if (++rec.count > LIMIT) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rec.reset - Date.now()) / 1000)),
        },
      },
    );
  }

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
    return NextResponse.json({ error: "Failed to search songs" }, { status: 500 });
  }
}
