import { AlbumForm } from "@/admin/forms/models/";

export default function AlbumCreatePage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create Album</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a new album to the catalog
        </p>
      </div>

      <AlbumForm action="create" />
    </div>
  );
}
