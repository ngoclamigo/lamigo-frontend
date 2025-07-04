import { NextRequest, NextResponse } from "next/server";
import { createClient } from "~/lib/supabase-server";

const ALLOWED_FILE_TYPES = [
  "text/markdown",
  "text/plain",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ status: "error", error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          status: "error",
          error: "Invalid file type. Only markdown, PDF, text, DOC, and DOCX files are allowed.",
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { status: "error", error: "File size too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Generate unique filename to avoid conflicts
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}_${sanitizedFileName}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage.from("documents").upload(fileName, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      console.error("Upload error:", error);
      return NextResponse.json(
        { status: "error", error: "Failed to upload file" },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("documents").getPublicUrl(fileName);

    return NextResponse.json({
      status: "success",
      data: {
        id: data.id,
        name: file.name,
        size: file.size,
        type: file.type,
        path: data.path,
        url: urlData.publicUrl,
      },
    });
  } catch (error) {
    console.error("Error in POST /api/documents/upload:", error);
    return NextResponse.json({ status: "error", error: "Internal server error" }, { status: 500 });
  }
}
