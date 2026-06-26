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
import { ResourceTable } from "@/admin/data-table/DataTableResources";

import type { FilterDef, TableConfig } from "@/admin/types/data-table";

interface Album {
  id: string;
  titleEnglish: string;
  titleJapanese: string;
  releaseDate: string;
  type: string;
  coverArt: string;
  externalLinks: unknown;
  _count: { tracks: number };
}

const columns: ColumnDef<Album>[] = [
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
    accessorKey: "type",
    enableSorting: false,
    header: "Type",
    cell: ({ getValue }) => <TextCell value={getValue()} className="capitalize" />,
  },
  {
    id: "trackCount",
    accessorFn: (row) => row._count.tracks,
    enableResizing: false,
    enableSorting: false,
    header: "Tracks",
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

const albumTableConfig: TableConfig<Album> = {
  resource: "albums",
  columns,
  filters,
  getRowLabel: (row) => row.titleEnglish,
  duplicate: adminDuplicateAlbum,
  pageSize: 10,
};

export default function AlbumsPage() {
  return (
    <ResourceTable
      config={albumTableConfig}
      createHref="/admin/albums/create"
      title="Albums"
      singular="Album"
    />
  );
}
