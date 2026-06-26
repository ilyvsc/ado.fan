"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import { Disc3 } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Resolver } from "react-hook-form";

import { adminGetSongAlbums } from "@/admin/actions/songs";
import { FormSkeleton } from "@/admin/components/ui/TableSkeleton";
import { GenericForm } from "@/admin/forms/form";
import { FormActions } from "@/admin/forms/FormActions";
import { CreditsEditor, ExternalLinksEditor } from "@/admin/forms/models/";
import { albumFormSchema, type AlbumFormValues } from "@/admin/schemas/albums";

import { Form } from "@/components/ui/form";

import { cn } from "@/lib/utils";

import type { FormConfig } from "@/admin/types/forms";

interface AlbumEntry {
  id: string;
  title: { english: string; japanese: string };
  type: string;
  releaseDate: string;
  coverArt: string;
}

export function SongAlbums({ songId }: { songId: string }) {
  const [albums, setAlbums] = useState<AlbumEntry[] | null>(null);

  useEffect(() => {
    void adminGetSongAlbums(songId).then(setAlbums);
  }, [songId]);

  if (albums === null) {
    return <p className="text-sm text-muted-foreground/50">Loading albums…</p>;
  }

  if (albums.length === 0) {
    return <p className="text-sm text-muted-foreground/50">No albums yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-foreground/12 bg-foreground/2 p-4">
      <p className="text-xs font-medium tracking-wider text-muted-foreground/60 uppercase">
        Albums
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {albums.map((album) => (
          <div
            key={album.id}
            className={cn(
              "flex items-center gap-3 rounded-lg border border-foreground/8 bg-background p-3",
            )}
          >
            <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-foreground/5">
              {album.coverArt ? (
                <Image
                  src={album.coverArt}
                  alt={album.title.english}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Disc3 className="size-4 text-muted-foreground/30" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {album.title.english}
              </p>
              <p className="truncate text-xs text-muted-foreground capitalize">
                {album.type} · {album.releaseDate}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const TYPE_OPTIONS = [
  { label: "Single", value: "single" },
  { label: "EP", value: "ep" },
  { label: "Album", value: "album" },
];

export function AlbumForm({
  action,
  id,
}: {
  action: "create" | "edit";
  id?: string;
}) {
  const form = useForm<AlbumFormValues>({
    refineCoreProps: {
      resource: "albums",
      action,
      id,
      redirect: "list",
    },
    resolver: zodResolver(albumFormSchema) as unknown as Resolver,
    defaultValues: {
      credits: { credits: [] },
      externalLinks: [],
    },
  });

  const {
    refineCore: { onFinish, query },
  } = form;

  const config: FormConfig = useMemo(
    () => ({
      tabs: [
        {
          label: "Details",
          columns: 2 as const,
          groups: [
            {
              title: "Identity",
              fields: [
                {
                  name: "id",
                  label: "ID",
                  placeholder: "usseewa-single",
                  description: "Unique slug used in URLs. Lowercase, hyphens only.",
                  readOnly: action === "edit",
                },
              ],
            },
            {
              title: "Titles",
              fields: [
                { name: "titleEnglish", label: "English Title" },
                { name: "titleJapanese", label: "Japanese Title" },
              ],
            },
            {
              title: "Release",
              fields: [
                {
                  name: "releaseDate",
                  label: "Release Date",
                  type: "date" as const,
                  fromYear: 2017,
                },
                {
                  name: "type",
                  label: "Type",
                  type: "select" as const,
                  options: TYPE_OPTIONS,
                },
              ],
            },
            {
              title: "Media",
              fields: [
                { name: "coverArt", label: "Cover Art", type: "url" as const },
              ],
            },
          ],
        },
        {
          label: "Credits",
          content: <CreditsEditor control={form.control} />,
        },
        {
          label: "External Links",
          content: (
            <ExternalLinksEditor control={form.control} fieldName="externalLinks" />
          ),
        },
      ],
    }),
    [action, form.control],
  );

  if (action === "edit" && query?.isLoading) {
    return <FormSkeleton />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => void form.handleSubmit(onFinish)(e)}
        className="flex flex-col items-center gap-6"
      >
        <GenericForm form={form} schema={albumFormSchema} config={config} />
        <FormActions listHref="/admin/albums" />
      </form>
    </Form>
  );
}
