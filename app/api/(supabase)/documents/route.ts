import { NextResponse } from "next/server";
import { createClient } from "~/lib/supabase-server";
import type { FileObject } from "~/types/document";

export async function GET() {
  try {
    const supabase = await createClient();

    // List all files from the documents bucket
    const { data: files, error: listError } = await supabase.storage.from("documents").list("", {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    });

    if (listError) {
      console.error("Error listing files:", listError);
      return NextResponse.json(
        { status: "error", error: "Failed to list documents" },
        { status: 500 }
      );
    }

    if (!files) {
      return NextResponse.json({ status: "success", data: [] });
    }

    // Get public URLs for each file
    const documents = await Promise.all(
      files
        .filter((file: FileObject) => file.name !== ".emptyFolderPlaceholder")
        .map(async (file: FileObject) => {
          const { data } = supabase.storage.from("documents").getPublicUrl(file.name);

          return {
            id: file.id || file.name,
            name: file.name,
            size: file.metadata?.size || 0,
            type: file.metadata?.mimetype || "application/octet-stream",
            created_at: file.created_at || new Date().toISOString(),
            url: data.publicUrl,
            bucket_path: file.name,
          };
        })
    );

    return NextResponse.json({ status: "success", data: documents });
  } catch (error) {
    console.error("Error in GET /api/documents:", error);
    return NextResponse.json({ status: "error", error: "Internal server error" }, { status: 500 });
  }
}
