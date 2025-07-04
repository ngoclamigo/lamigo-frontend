import { NextRequest, NextResponse } from "next/server";
import { createClient } from "~/lib/supabase-server";
import type { FileObject } from "~/types/document";

export async function GET(request: NextRequest, { params }: { params: { path: string } }) {
  try {
    const { path: bucketPath } = params;
    const supabase = await createClient();

    // Download file from storage
    const { data, error } = await supabase.storage.from("documents").download(bucketPath);

    if (error) {
      console.error("Download error:", error);
      return NextResponse.json({ status: "error", error: "File not found" }, { status: 404 });
    }

    if (!data) {
      return NextResponse.json({ status: "error", error: "File not found" }, { status: 404 });
    }

    // Get file info to determine content type
    const { data: files, error: listError } = await supabase.storage.from("documents").list("", {
      search: bucketPath,
    });

    let contentType = "application/octet-stream";
    let fileName = bucketPath;

    if (!listError && files && files.length > 0) {
      const file = files.find((f: FileObject) => f.name === bucketPath);
      if (file) {
        contentType = file.metadata?.mimetype || contentType;
        // Extract original filename from the timestamped filename
        const parts = file.name.split("_");
        if (parts.length > 1) {
          fileName = parts.slice(1).join("_");
        }
      }
    }

    // Convert blob to array buffer
    const arrayBuffer = await data.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": arrayBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("Error in GET /api/documents/[id]/download:", error);
    return NextResponse.json({ status: "error", error: "Internal server error" }, { status: 500 });
  }
}
