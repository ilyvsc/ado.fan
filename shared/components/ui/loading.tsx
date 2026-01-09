import React from "react";

import { cn } from "@/shared/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({
  className,
  size = "md",
}: Readonly<LoadingSpinnerProps>) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div
      className={cn(
        "border-primary/30 border-t-primary animate-spin rounded-full border-2",
        sizeClasses[size],
        className,
      )}
    />
  );
}

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
}

export function LoadingSkeleton({
  className,
  lines = 1,
}: Readonly<LoadingSkeletonProps>) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "bg-muted h-4 animate-pulse rounded",
            i === lines - 1 && lines > 1 && "w-3/4", // Make last line shorter
          )}
        />
      ))}
    </div>
  );
}

interface SongCardSkeletonProps {
  className?: string;
}

export function SongCardSkeleton({
  className,
}: Readonly<SongCardSkeletonProps>) {
  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative w-full overflow-hidden rounded-2xl border border-white/20 bg-card/50 sm:rounded-3xl">
        <div className="bg-muted relative h-48 animate-pulse sm:h-56 md:h-60" />
        <div className="space-y-3 p-4 sm:space-y-4 sm:p-6">
          <div className="space-y-2">
            <LoadingSkeleton className="h-6" />
            <LoadingSkeleton className="h-5 w-3/4" />
          </div>
          <LoadingSkeleton lines={3} />
          <div className="flex items-center justify-between pt-2">
            <LoadingSkeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
