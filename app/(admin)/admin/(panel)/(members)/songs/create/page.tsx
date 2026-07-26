import { SongForm } from "@/admin/forms/models/";

export default function SongCreatePage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create Song</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a new song to the database
        </p>
      </div>

      <SongForm action="create" />
    </div>
  );
}
