"use client";

import { ResourceTable } from "@/admin/data-table/DataTableResources";

import { albumTableConfig } from "@/admin/tables/albums";

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
