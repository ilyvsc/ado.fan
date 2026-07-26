import { ImageOff, type LucideIcon } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface CellProps {
  value: unknown;
  className?: string;
}

export function TextCell({ value, className }: CellProps) {
  return (
    <span className={cn("truncate text-sm text-muted-foreground", className)}>
      {value as string}
    </span>
  );
}

export function MonoCell({ value, className }: CellProps) {
  return (
    <TextCell value={value} className={cn("font-mono tabular-nums", className)} />
  );
}

export function BoldCell({ value, className }: CellProps) {
  return (
    <TextCell
      value={value}
      className={cn("font-medium text-foreground", className)}
    />
  );
}

export function DateCell({ value, className }: CellProps) {
  const formatted = value
    ? new Date(value as string).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

  return <TextCell value={formatted} className={cn("tabular-nums", className)} />;
}

export function BadgeCell({ value, className }: CellProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-foreground/10 bg-foreground/5 px-2 py-0.5 text-xs font-medium text-foreground",
        className,
      )}
    >
      {value as string}
    </span>
  );
}

export function NullCell({ className }: { className?: string }) {
  return <span className={cn("text-xs text-muted-foreground/40", className)}>-</span>;
}

export function NullableCell({ value, className }: CellProps) {
  if (value === null || value === undefined || value === "") return <NullCell />;
  return <TextCell value={value} className={className} />;
}

export function ColorCell({
  value,
  className,
}: {
  value: string | null;
  className?: string;
}) {
  if (!value) return <NullCell />;
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className="size-4 shrink-0 rounded-sm border border-foreground/10"
        style={{ backgroundColor: value }}
      />
      <span className="font-mono text-xs text-muted-foreground">{value}</span>
    </div>
  );
}

export function IdCell({ value, className }: CellProps) {
  return (
    <TextCell value={value} className={cn("block font-mono text-xs", className)} />
  );
}

export function CountCell({
  count,
  icon: Icon,
  className,
}: {
  count: number;
  icon: LucideIcon;
  className?: string;
}) {
  if (count === 0) return <NullCell />;
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-foreground/25 bg-foreground/10 px-2 py-1 text-muted-foreground",
        className,
      )}
    >
      <Icon className="size-3.5 shrink-0" />
      <span className="text-md tabular-nums">{count}</span>
    </div>
  );
}

export function DateTimeCell({
  value,
  className,
  highlightExpired = false,
}: CellProps & {
  highlightExpired?: boolean;
}) {
  if (!value) return <NullCell className={className} />;

  const date = new Date(value as string | Date);
  const expired = highlightExpired && date < new Date();

  return (
    <span
      className={cn(
        "truncate text-xs tabular-nums",
        expired ? "text-destructive" : "text-muted-foreground",
        className,
      )}
    >
      {date.toLocaleString()}
    </span>
  );
}

export function UserCell({
  name,
  image,
  href,
  className,
  suffix,
}: {
  name: string;
  image?: string | null;
  href?: string;
  className?: string;
  suffix?: React.ReactNode;
}) {
  const inner = (
    <div className={cn("flex min-w-0 items-center gap-2", className)}>
      <Avatar className="size-7 shrink-0 border border-foreground/10">
        {image && <AvatarImage src={image} alt={name} />}
        <AvatarFallback className="text-xs">
          {name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="truncate text-sm font-medium text-foreground">
        {name}
        {suffix}
      </span>
    </div>
  );
  if (href) {
    return (
      <Link href={href} className="hover:underline">
        {inner}
      </Link>
    );
  }
  return inner;
}

export function CoverCell({ url }: { url: string }) {
  if (!url) {
    return (
      <div className="flex size-9 items-center justify-center rounded-md bg-foreground/5">
        <ImageOff className="size-3.5 text-muted-foreground/30" />
      </div>
    );
  }
  return (
    <div className="relative size-9 shrink-0 overflow-hidden rounded-md bg-foreground/5">
      <Image
        src={url}
        alt="Cover"
        sizes="36px"
        className="object-cover"
        loading="lazy"
        fill
      />
    </div>
  );
}

export function VideoLinksCell({
  nicoId,
  youtubeId,
}: {
  nicoId?: string | null;
  youtubeId?: string | null;
}) {
  if (!nicoId && !youtubeId) return <NullCell />;

  return (
    <div className="flex items-center gap-1.5">
      {youtubeId && (
        <a
          href={`https://youtube.com/watch?v=${youtubeId}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Open on YouTube"
          className="text-xs font-medium text-muted-foreground/50 transition-colors hover:text-foreground"
        >
          YouTube
        </a>
      )}
      {nicoId && (
        <a
          href={`https://www.nicovideo.jp/watch/${nicoId}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Open on NicoNico"
          className="text-xs font-medium text-muted-foreground/50 transition-colors hover:text-foreground"
        >
          NicoNico
        </a>
      )}
    </div>
  );
}
