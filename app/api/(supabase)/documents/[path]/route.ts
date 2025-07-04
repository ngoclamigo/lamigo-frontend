import { NextRequest, NextResponse } from "next/server";
import { createClient } from "~/lib/supabase-server";
import type { FileObject } from "~/types/document";

export async function DELETE(request: NextRequest, { params }: { params: { path: string } }) {
  try {
    const { path: bucketPath } = params;
    const supabase = await createClient();

    // Delete file from storage
    const { error } = await supabase.storage.from("documents").remove([bucketPath]);

    if (error) {
      console.error("Delete error:", error);
      return NextResponse.json(
        { status: "error", error: "Failed to delete file" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "success",
      data: "File deleted successfully",
    });
  } catch (error) {
    console.error("Error in DELETE /api/documents/[id]:", error);
    return NextResponse.json({ status: "error", error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest, { params }: { params: { path: string } }) {
  try {
    const { path: bucketPath } = params;
    const supabase = await createClient();

    // Get file info
    const { data: files, error: listError } = await supabase.storage.from("documents").list("", {
      search: bucketPath,
    });

    if (listError || !files || files.length === 0) {
      return NextResponse.json({ status: "error", error: "File not found" }, { status: 404 });
    }

    const file = files.find((f: FileObject) => f.name === bucketPath);
    if (!file) {
      return NextResponse.json({ status: "error", error: "File not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: "success",
      data: {
        id: file.id || file.name,
        name: file.name,
        size: file.metadata?.size || 0,
        type: file.metadata?.mimetype || "application/octet-stream",
        created_at: file.created_at || new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error in GET /api/documents/[id]:", error);
    return NextResponse.json({ status: "error", error: "Internal server error" }, { status: 500 });
  }
}
