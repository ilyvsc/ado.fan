"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Disc3, Languages, Link2 } from "lucide-react";

import { adminDuplicateSong } from "@/admin/actions/songs";
import {
  ColorCell,
  CountCell,
  CoverCell,
  DateCell,
  IdCell,
  NullableCell,
  TextCell,
} from "@/admin/data-table/cells";

import { ResourceTable } from "@/admin/data-table/DataTableResources";

import type { FilterDef, TableConfig } from "@/admin/types/data-table";

interface Song {
  id: string;
  titleEnglish: string;
  titleJapanese: string;
  releaseDate: string;
  coverArt: string;
  themeColor: string | null;
  length: string;
  externalLinks: unknown;
  _count: { albumTracks: number; lyrics: number };
}

const columns: ColumnDef<Song>[] = [
  {
    accessorKey: "id",
    enableResizing: false,
    enableSorting: false,
    header: "ID",
    cell: ({ getValue }) => <IdCell value={getValue()} />,
  },
  {
    accessorKey: "titleEnglish",
    header: "Title (English)",
    cell: ({ getValue }) => <TextCell value={getValue()} />,
  },
  {
    accessorKey: "titleJapanese",
    header: "Title (Japanese)",
    cell: ({ getValue }) => <NullableCell value={getValue()} />,
  },
  {
    accessorKey: "releaseDate",
    header: "Release Date",
    cell: ({ getValue }) => <DateCell value={getValue()} />,
  },
  {
    accessorKey: "length",
    header: "Duration",
    maxSize: 0,
    cell: ({ getValue }) => <TextCell value={getValue()} />,
  },
  {
    id: "albumCount",
    accessorFn: (row) => row._count.albumTracks,
    enableResizing: false,
    enableSorting: false,
    header: "Albums",
    cell: ({ getValue }) => <CountCell count={getValue() as number} icon={Disc3} />,
  },
  {
    id: "lyricsCount",
    accessorFn: (row) => row._count.lyrics,
    enableResizing: false,
    enableSorting: false,
    header: "Lyrics",
    cell: ({ getValue }) => (
      <CountCell count={getValue() as number} icon={Languages} />
    ),
  },
  {
    accessorKey: "externalLinks",
    enableResizing: false,
    enableSorting: false,
    header: "Ext. Links",
    cell: ({ getValue }) => (
      <CountCell
        count={((getValue() as Song["externalLinks"][] | undefined) ?? []).length}
        icon={Link2}
      />
    ),
  },
  {
    accessorKey: "themeColor",
    enableResizing: false,
    enableSorting: false,
    header: "Theme Color",
    cell: ({ getValue }) => <ColorCell value={getValue() as string | null} />,
  },
  {
    accessorKey: "coverArt",
    enableResizing: false,
    enableSorting: false,
    header: "Cover",
    cell: ({ getValue }) => <CoverCell url={getValue() as string} />,
  },
];

const filters: FilterDef[] = [
  {
    id: "releaseYear",
    type: "year-range",
    label: "Release Year",
    description: "Narrow results to a specific year or range of years.",
    field: "releaseDate",
    min: 2017,
    max: new Date().getFullYear(),
  },
  {
    id: "hasLyrics",
    type: "switch",
    label: "Lyrics",
    description: "Show only songs that have at least one translation added.",
    field: "hasLyrics",
  },
  {
    id: "hasAlbums",
    type: "switch",
    label: "In album",
    description: "Show only songs that appear in at least one album.",
    field: "hasAlbums",
  },
  {
    id: "hasThemeColor",
    type: "switch",
    label: "Has color",
    description: "Show only songs with a custom theme color configured.",
    field: "hasThemeColor",
  },
];

const songTableConfig: TableConfig<Song> = {
  resource: "songs",
  columns,
  filters,
  getRowLabel: (row) => row.titleEnglish,
  duplicate: adminDuplicateSong,
  pageSize: 15,
};

export default function SongsPage() {
  return (
    <ResourceTable
      config={songTableConfig}
      createHref="/admin/songs/create"
      title="Songs"
      singular="Song"
    />
  );
}
