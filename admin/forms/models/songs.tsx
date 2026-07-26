"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Resolver } from "react-hook-form";

import {
  CreditsEditor,
  ExternalLinksEditor,
  SongLyricsEditor,
} from "@/admin/components/editors";
import { LastEditMarker } from "@/admin/components/ui/LastEditMarker";
import { FormSkeleton } from "@/admin/components/ui/TableSkeleton";
import { GenericForm } from "@/admin/forms/form";
import { FormActions } from "@/admin/forms/FormActions";

import { songFormSchema, type SongFormValues } from "@/admin/schemas/songs";

import { Form } from "@/components/ui/form";

import { SongAlbums } from "./albums";

import type { FormConfig } from "@/admin/types/forms";

export function SongForm({ action, id }: { action: "create" | "edit"; id?: string }) {
  const router = useRouter();
  const form = useForm<SongFormValues>({
    refineCoreProps: {
      resource: "songs",
      action,
      id,
      redirect: "list",
      onMutationSuccess: () => {
        router.refresh();
      },
    },
    resolver: zodResolver(songFormSchema) as unknown as Resolver,
    defaultValues: {
      credits: { credits: [] },
      externalLinks: [],
    },
  });

  const {
    refineCore: { onFinish, query },
  } = form;

  const songId = query?.data?.data.id;

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
                  label: "Song ID",
                  placeholder: "usseewa",
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
                  name: "length",
                  label: "Duration",
                  placeholder: "Enter the song duration",
                  description: "Song length in M:SS format.",
                },
                {
                  name: "releaseDate",
                  label: "Release Date",
                  type: "date" as const,
                  description: "Date the song was publicly released.",
                },
              ],
            },
            {
              title: "Platform IDs",
              col: 2 as const,
              row: 2,
              fields: [
                {
                  name: "nicoId",
                  label: "Nico ID",
                  placeholder: "Enter NicoNico video ID",
                },
                {
                  name: "youtubeId",
                  label: "YouTube ID",
                  placeholder: "Enter YouTube video ID",
                },
              ],
            },
            {
              title: "Appearance",
              col: 2 as const,
              cols: 1,
              fields: [
                {
                  name: "coverArt",
                  label: "Cover Art",
                  type: "url" as const,
                  imagePreview: true,
                  description: "URL to the song's cover art image.",
                  optional: true,
                },
                {
                  name: "themeColor",
                  label: "Theme Color",
                  type: "color" as const,
                  placeholder: "#FFFFFF",
                  description: "Hex color used as the song's theme on public pages.",
                },
              ],
            },
            {
              title: "Description",
              fullWidth: true,
              fields: [
                {
                  name: "description",
                  label: "Description",
                  type: "markdown" as const,
                  rows: 4,
                  span: 3 as const,
                  description:
                    "Markdown-formatted notes shown on the song's public page.",
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
        ...(action === "edit" && songId
          ? [{ label: "Lyrics", content: <SongLyricsEditor songId={songId} /> }]
          : []),
        ...(action === "edit" && songId
          ? [{ label: "Albums", content: <SongAlbums songId={songId} /> }]
          : []),
      ],
    }),
    [action, songId, form.control],
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
        <GenericForm form={form} schema={songFormSchema} config={config} />
        <FormActions listHref="/admin/songs" />
        {action === "edit" && songId && <LastEditMarker entity="song" id={songId} />}
      </form>
    </Form>
  );
}
