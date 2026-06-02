import { Skeleton } from "@/shared/components/ui/skeleton";

function HorizontalScrollerSkeleton() {
  return (
    <div className="mb-8">
      <Skeleton className="mb-3 h-4 w-28" />
      <div className="flex gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex w-32 shrink-0 flex-col gap-2">
            <Skeleton className="aspect-square rounded-lg" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LyricsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 border-b border-foreground/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center gap-2 py-3">
            <Skeleton className="h-8 flex-1 md:h-10" />
            <div className="flex items-center gap-1 sm:hidden">
              <Skeleton className="h-8 w-16 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
          <div className="flex items-center justify-center border-t border-foreground/5 py-2 lg:justify-between">
            <Skeleton className="hidden h-3 w-20 md:block" />
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-8 w-16 rounded-lg" />
              <Skeleton className="h-8 w-16 rounded-lg" />
              <Skeleton className="h-8 w-20 rounded-lg" />
              <Skeleton className="h-8 w-20 rounded-lg" />
              <div className="hidden h-4 w-px bg-foreground/10 sm:block" />
              <Skeleton className="hidden h-8 w-16 rounded-lg sm:block" />
              <Skeleton className="hidden h-8 w-8 rounded-lg sm:block" />
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:pr-14 sm:pl-6">
        <HorizontalScrollerSkeleton />
        <HorizontalScrollerSkeleton />

        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-1 w-1 rounded-full" />
          <Skeleton className="h-4 w-8" />
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="aspect-square rounded-lg" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-14" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
