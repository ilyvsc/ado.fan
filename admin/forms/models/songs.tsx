"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import { useMemo } from "react";
import { Resolver } from "react-hook-form";

import { FormSkeleton } from "@/admin/components/ui/TableSkeleton";
import { GenericForm } from "@/admin/forms/form";
import { FormActions } from "@/admin/forms/FormActions";

import {
  SongAlbums,
  CreditsEditor,
  ExternalLinksEditor,
  SongLyricsEditor,
} from "@/admin/forms/models/";

import { songFormSchema, type SongFormValues } from "@/admin/schemas/songs";

import { Form } from "@/components/ui/form";

import type { FormConfig } from "@/admin/types/forms";

export function SongForm({ action, id }: { action: "create" | "edit"; id?: string }) {
  const form = useForm<SongFormValues>({
    refineCoreProps: {
      resource: "songs",
      action,
      id,
      redirect: "list",
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
              fields: [
                {
                  name: "id",
                  label: "ID",
                  placeholder: "usseewa",
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
                  name: "length",
                  label: "Duration",
                  placeholder: "Enter the song duration",
                },
                {
                  name: "releaseDate",
                  label: "Release Date",
                  type: "date" as const,
                },
                {
                  name: "themeColor",
                  label: "Theme Color",
                  type: "color" as const,
                  placeholder: "#FFFFFF",
                },
              ],
            },
            {
              title: "Media",
              fields: [
                { name: "coverArt", label: "Cover Art", type: "url" as const },
              ],
            },
            {
              title: "Platform IDs",
              fields: [
                {
                  name: "nicoId",
                  label: "Nico ID",
                  placeholder: "Enter video ",
                },
                {
                  name: "youtubeId",
                  label: "YouTube ID",
                  placeholder: "Enter video ",
                },
              ],
            },
            {
              title: "Description",
              fields: [
                {
                  name: "description",
                  label: "Description",
                  type: "textarea" as const,
                  rows: 2,
                  span: 3 as const,
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
      </form>
    </Form>
  );
}
