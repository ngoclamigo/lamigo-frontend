import { NextRequest, NextResponse } from "next/server";
import { createClient } from "~/lib/supabase-server";

export const revalidate = 0;

export async function GET(_: NextRequest, { params }: { params: { path_id: string } }) {
  try {
    const supabase = await createClient();

    const { data: learning_path, error: selectError } = await supabase
      .from("learning_paths")
      .select("*, activities(*)")
      .eq("id", params.path_id)
      .single();

    if (selectError) {
      return NextResponse.json(
        {
          status: "error",
          message:
            selectError.code === "PGRST116"
              ? "Learning path not found"
              : "Failed to fetch learning path",
        },
        { status: selectError.code === "PGRST116" ? 404 : 400 }
      );
    }

    return NextResponse.json({ status: "success", data: learning_path });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { path_id: string } }) {
  try {
    const body = await request.json();
    const { title, description, duration_estimate_hours } = body;

    const supabase = await createClient();

    const { data: learning_path, error: updateError } = await supabase
      .from("learning_paths")
      .update({ title, description, duration_estimate_hours })
      .eq("id", params.path_id)
      .select("*, activities(*)")
      .single();

    if (updateError) {
      return NextResponse.json(
        { status: "error", message: "Failed to update learning path" },
        { status: 400 }
      );
    }

    return NextResponse.json({ status: "success", data: learning_path });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { path_id: string } }) {
  try {
    const supabase = await createClient();

    const { error: deleteError } = await supabase
      .from("learning_paths")
      .delete()
      .eq("id", params.path_id);

    if (deleteError) {
      return NextResponse.json(
        { status: "error", message: "Failed to delete learning path" },
        { status: 400 }
      );
    }

    return NextResponse.json({ status: "success", data: "Learning path deleted successfully" });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
