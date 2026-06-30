"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Link2, Music } from "lucide-react";

import { adminDuplicateAlbum } from "@/admin/actions/albums";
import {
  CountCell,
  CoverCell,
  DateCell,
  IdCell,
  NullableCell,
  TextCell,
} from "@/admin/data-table/cells";

import type { FilterDef, TableConfig } from "@/admin/types/data-table";

interface AlbumRow {
  id: string;
  titleEnglish: string;
  titleJapanese: string;
  releaseDate: string;
  type: string;
  coverArt: string;
  externalLinks: unknown;
  _count: { tracks: number };
}

const columns: ColumnDef<AlbumRow>[] = [
  {
    accessorKey: "id",
    enableResizing: false,
    enableSorting: false,
    header: "Album ID",
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
    accessorKey: "type",
    enableSorting: false,
    enableResizing: false,
    header: "Type",
    size: 20,
    cell: ({ getValue }) => <TextCell value={getValue()} className="capitalize" />,
  },
  {
    id: "trackCount",
    enableResizing: false,
    enableSorting: false,
    header: "Tracks",
    size: 20,
    accessorFn: (row) => row._count.tracks,
    cell: ({ getValue }) => <CountCell count={getValue() as number} icon={Music} />,
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
    id: "hasTracks",
    type: "switch",
    label: "Has tracks",
    description: "Show only albums with at least one track added.",
    field: "hasTracks",
  },
];

export const albumTableConfig: TableConfig<AlbumRow> = {
  resource: "albums",
  columns,
  filters,
  getRowLabel: (row) => row.titleEnglish,
  duplicate: adminDuplicateAlbum,
};
