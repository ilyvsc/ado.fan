"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import { Disc3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Resolver } from "react-hook-form";

import { adminGetSongAlbums } from "@/admin/actions/songs";
import { CreditsEditor, ExternalLinksEditor } from "@/admin/components/editors";
import { LastEditMarker } from "@/admin/components/ui/LastEditMarker";
import { FormSkeleton } from "@/admin/components/ui/TableSkeleton";
import { GenericForm } from "@/admin/forms/form";
import { FormActions } from "@/admin/forms/FormActions";

import { albumFormSchema, type AlbumFormValues } from "@/admin/schemas/albums";

import { Form } from "@/components/ui/form";
import { TypographyMuted } from "@/components/ui/typography";

import type { FormConfig } from "@/admin/types/forms";
import type { Album } from "@/types/album";

export function SongAlbums({ songId }: { songId: string }) {
  const [albums, setAlbums] = useState<Album[] | null>(null);

  useEffect(() => {
    void adminGetSongAlbums(songId).then(setAlbums);
  }, [songId]);

  return (
    <div className="flex min-h-48 w-full flex-col gap-3 rounded-lg border border-foreground/12 bg-foreground/2 p-4">
      <div className="flex flex-col gap-0.5">
        <p className="text-xs font-medium tracking-wider text-muted-foreground/60 uppercase">
          Albums
        </p>
        <TypographyMuted className="text-xs leading-snug">
          {albums === null
            ? "Loading…"
            : albums.length === 0
              ? "This song hasn't been added to any album yet."
              : `Appears in ${albums.length} album${albums.length === 1 ? "" : "s"}.`}
        </TypographyMuted>
      </div>

      {albums && albums.length > 0 && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {albums.map((album) => {
            const track = album.tracks.find((t) => t.song.id === songId);
            return (
              <div
                key={album.id}
                className="flex gap-3 rounded-lg border border-foreground/8 bg-background p-3"
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
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <Link
                    href={`/admin/albums/${album.id}/edit`}
                    className="truncate text-sm font-medium text-foreground hover:text-ado-primary hover:underline"
                  >
                    {album.title.english}
                  </Link>
                  {album.title.japanese && (
                    <p className="truncate font-jp-sans text-xs text-muted-foreground/50">
                      {album.title.japanese}
                    </p>
                  )}
                  <dl className="mt-0.5 grid grid-cols-2 gap-x-3 gap-y-0.5">
                    {(
                      [
                        ["Type", <span className="capitalize">{album.type}</span>],
                        ["Released", album.releaseDate.slice(0, 4)],
                        ["Tracks", album.tracks.length],
                        [
                          "Position",
                          track
                            ? `#${track.trackNumber}${track.isBonusTrack ? " (bonus)" : ""}`
                            : "—",
                        ],
                      ] as [string, React.ReactNode][]
                    ).map(([label, value]) => (
                      <div key={label} className="flex items-baseline gap-1">
                        <dt className="shrink-0 text-xs text-muted-foreground/40">
                          {label}:
                        </dt>
                        <dd className="truncate text-xs text-muted-foreground">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            );
          })}
        </div>
      )}
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
  const router = useRouter();
  const form = useForm<AlbumFormValues>({
    refineCoreProps: {
      resource: "albums",
      action,
      id,
      redirect: "list",
      onMutationSuccess: () => {
        router.refresh();
      },
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
              col: 1 as const,
              fields: [
                {
                  name: "id",
                  label: "Album ID",
                  placeholder: "usseewa-single",
                  description: "Unique slug used in URLs. Lowercase, hyphens only.",
                  readOnly: action === "edit",
                },
              ],
            },
            {
              title: "Titles",
              col: 2 as const,
              row: 1,
              fields: [
                {
                  name: "titleEnglish",
                  label: "English Title",
                  placeholder: "Enter English title",
                },
                {
                  name: "titleJapanese",
                  label: "Japanese Title",
                  placeholder: "Enter Japanese title",
                  inputClassName: "font-jp-sans",
                  optional: true,
                },
              ],
            },
            {
              title: "Release Information",
              col: 1 as const,
              row: 2,
              fields: [
                {
                  name: "releaseDate",
                  label: "Release Date",
                  type: "date" as const,
                  fromYear: 2017,
                  description: "Date the album was first released.",
                },
                {
                  name: "type",
                  label: "Type",
                  type: "select" as const,
                  options: TYPE_OPTIONS,
                  description: "Release format of this album.",
                },
              ],
            },
            {
              title: "Media",
              col: 2 as const,
              row: 2,
              cols: 1,
              fields: [
                {
                  name: "coverArt",
                  label: "Cover Art",
                  type: "url" as const,
                  imagePreview: true,
                  description: "URL to the album's cover art image.",
                  optional: true,
                },
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
        {action === "edit" && id && <LastEditMarker entity="album" id={id} />}
      </form>
    </Form>
  );
}
