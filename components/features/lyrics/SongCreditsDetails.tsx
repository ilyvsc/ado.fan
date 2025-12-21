import { Quote } from "lucide-react";

import { Song } from "@/types/Music";

export function SongCreditsDetails({ song }: { song: Song }) {
  if (!song.description) return null;

  return (
    <section className="pt-12 pb-4 sm:pb-8 w-full max-w-3xl">
      <header className="flex justify-start gap-2 text-white/70">
        <Quote className="h-4 w-4" />
        <h3 className="text-sm font-medium tracking-widest uppercase">
          About this Song
        </h3>
      </header>

      <div className="mt-2 mb-4">
        <p className="whitespace-pre-wrap text-sm sm:text-base">
          {song.description}
        </p>
      </div>

      <div className="h-px w-full border border-white/10" />
    </section>
  );
}
