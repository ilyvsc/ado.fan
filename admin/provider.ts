import {
  adminCreateAlbum,
  adminDeleteAlbum,
  adminGetAlbum,
  adminListAlbums,
  adminUpdateAlbum,
} from "./actions/albums";
import {
  adminCreateSong,
  adminDeleteSong,
  adminGetSong,
  adminListSongs,
  adminUpdateSong,
} from "./actions/songs";

import type { AlbumFormValues } from "./schemas/albums";
import type { SongFormValues } from "./schemas/songs";

import type {
  BaseRecord,
  CrudSort,
  DataProvider,
  LogicalFilter,
} from "@refinedev/core";

export type ListFilter = Pick<LogicalFilter, "field" | "operator" | "value">;

interface ListParams {
  page: number;
  pageSize: number;
  search?: string;
  filters?: ListFilter[];
  sorters?: CrudSort[];
}

interface ResourceHandlers {
  getList: (params: ListParams) => Promise<{ data: BaseRecord[]; total: number }>;
  getOne: (id: string) => Promise<BaseRecord>;
  create: (variables: unknown) => Promise<BaseRecord>;
  update: (id: string, variables: unknown) => Promise<BaseRecord>;
  deleteOne: (id: string) => Promise<BaseRecord>;
}

const registry = {
  albums: {
    getList: (params) => adminListAlbums(params),
    getOne: (id) => adminGetAlbum(id),
    create: (vars) => adminCreateAlbum(vars as AlbumFormValues),
    update: (id, vars) => adminUpdateAlbum(id, vars as AlbumFormValues),
    deleteOne: (id) => adminDeleteAlbum(id),
  },
  songs: {
    getList: (params) => adminListSongs(params),
    getOne: (id) => adminGetSong(id),
    create: (vars) => adminCreateSong(vars as SongFormValues),
    update: (id, vars) => adminUpdateSong(id, vars as SongFormValues),
    deleteOne: (id) => adminDeleteSong(id),
  },
} satisfies Record<string, ResourceHandlers>;

function getHandlers(resource: string): ResourceHandlers {
  const handlers = (registry as Record<string, ResourceHandlers | undefined>)[
    resource
  ];
  if (!handlers) throw new Error(`Resource not registered: ${resource}`);
  return handlers;
}

export const adminDataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters, sorters }) => {
    const logical = (filters ?? []).filter((f): f is LogicalFilter => "field" in f);
    const fieldFilters = logical.filter((f) => f.field !== "q");
    const { data, total } = await getHandlers(resource).getList({
      page: pagination?.currentPage ?? 1,
      pageSize: pagination?.pageSize ?? 20,
      search: logical.find((f) => f.field === "q")?.value as string | undefined,
      filters: fieldFilters.length ? fieldFilters : undefined,
      sorters: sorters?.length ? sorters : undefined,
    });
    return { data: data as never[], total };
  },

  getOne: async ({ resource, id }) => ({
    data: (await getHandlers(resource).getOne(String(id))) as never,
  }),

  create: async ({ resource, variables }) => ({
    data: (await getHandlers(resource).create(variables)) as never,
  }),

  update: async ({ resource, id, variables }) => ({
    data: (await getHandlers(resource).update(String(id), variables)) as never,
  }),

  deleteOne: async ({ resource, id }) => ({
    data: (await getHandlers(resource).deleteOne(String(id))) as never,
  }),

  getApiUrl: () => "/admin",
};
