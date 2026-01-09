import { Quote } from "lucide-react";

import type { Song } from "@/types/song";

export function SongCreditsDetails({ song }: { song: Song }) {
  if (!song.description) return null;

  return (
    <section className="w-full max-w-3xl pt-12 pb-4 sm:pb-8">
      <header className="flex justify-start gap-2 text-white/70">
        <Quote className="h-4 w-4" />
        <h3 className="text-sm font-medium tracking-widest uppercase">
          About this Song
        </h3>
      </header>

      <div className="mt-2 mb-4">
        <p className="text-sm whitespace-pre-wrap sm:text-base">
          {song.description}
        </p>
      </div>

      <div className="h-px w-full border border-white/10" />
    </section>
  );
}
