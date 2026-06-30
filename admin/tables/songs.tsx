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
  VideoLinksCell,
} from "@/admin/data-table/cells";

import type { FilterDef, TableConfig } from "@/admin/types/data-table";

interface SongRow {
  id: string;
  titleEnglish: string;
  titleJapanese: string;
  releaseDate: string;
  coverArt: string;
  themeColor: string | null;
  length: string;
  nicoId: string | null;
  youtubeId: string | null;
  externalLinks: unknown;
  _count: { albumTracks: number; lyrics: number };
}

const columns: ColumnDef<SongRow>[] = [
  {
    accessorKey: "id",
    enableResizing: false,
    enableSorting: false,
    header: "Song ID",
    cell: ({ getValue }) => <IdCell value={getValue()} />,
  },
  {
    accessorKey: "titleEnglish",
    header: "English title",
    cell: ({ getValue }) => <TextCell value={getValue()} />,
  },
  {
    accessorKey: "titleJapanese",
    header: "Japanese title",
    cell: ({ getValue }) => <NullableCell value={getValue()} />,
  },
  {
    accessorKey: "releaseDate",
    header: "Release Date",
    enableResizing: false,
    maxSize: 32,
    cell: ({ getValue }) => <DateCell value={getValue()} />,
  },
  {
    accessorKey: "length",
    header: "Duration",
    enableResizing: false,
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
        count={((getValue() as unknown[] | null) ?? []).length}
        icon={Link2}
      />
    ),
  },
  {
    id: "videoLinks",
    enableResizing: false,
    enableSorting: false,
    header: "Video",
    cell: ({ row }) => (
      <VideoLinksCell
        nicoId={row.original.nicoId}
        youtubeId={row.original.youtubeId}
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

export const songTableConfig: TableConfig<SongRow> = {
  resource: "songs",
  columns,
  filters,
  getRowLabel: (row) => row.titleEnglish,
  duplicate: adminDuplicateSong,
};
