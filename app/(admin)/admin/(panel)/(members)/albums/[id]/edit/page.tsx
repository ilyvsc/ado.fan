import { AlbumForm } from "@/admin/forms/models/";

export default async function AlbumEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Album</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update album details and metadata
        </p>
      </div>

      <AlbumForm action="edit" id={id} />
    </div>
  );
}
