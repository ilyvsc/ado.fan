"use client";

import { ResourceTable } from "@/admin/data-table/DataTableResources";

import { songTableConfig } from "@/admin/tables/songs";

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
