"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getEntityLastChange } from "@/admin/actions/sync";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Marker, MarkerContent } from "@/components/ui/marker";

import { timeAgo } from "@/lib/relative-time";

import type { ContentEntityType, LastChange } from "@/db/queries/admin/changes";

export function LastEditMarker({
  entity,
  id,
}: {
  entity: ContentEntityType;
  id: string;
}) {
  const [change, setChange] = useState<LastChange | null>(null);

  useEffect(() => {
    void getEntityLastChange(entity, id).then(setChange);
  }, [entity, id]);

  if (!change) return null;

  return (
    <Marker
      variant="separator"
      className="mx-auto max-w-6xl text-xs text-muted-foreground/80"
    >
      <MarkerContent className="flex items-center gap-1.5">
        <Avatar className="size-4">
          {change.user.image && (
            <AvatarImage src={change.user.image} alt="Profile Avatar" />
          )}
          <AvatarFallback className="text-xs">
            {change.user.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <Link href="/admin/changes" className="hover:text-foreground">
          {change.user.name}
        </Link>
        <span>edited {timeAgo(change.createdAt)}</span>
        <span
          className={change.synced ? "text-muted-foreground/80" : "text-ado-primary"}
        >
          ({change.synced ? "synced" : "unsynced"})
        </span>
      </MarkerContent>
    </Marker>
  );
}
