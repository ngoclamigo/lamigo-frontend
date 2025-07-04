import { NextRequest, NextResponse } from "next/server";
import { createClient } from "~/lib/supabase-server";

export async function GET(_: NextRequest, { params }: { params: { path_id: string } }) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("learning_paths")
      .select("*, activities(*)")
      .eq("id", params.path_id)
      .single();

    if (error) {
      console.error("Error fetching learning path:", error);
      return NextResponse.json(
        { status: "error", error: "Failed to fetch learning path" },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: "success", data });
  } catch (error) {
    console.error("Error fetching learning path:", error);
    return NextResponse.json(
      { status: "error", error: "Failed to fetch learning path" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { path_id: string } }) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("learning_paths")
      .update(await request.json())
      .eq("id", params.path_id);

    if (error) {
      console.error("Error updating learning path:", error);
      return NextResponse.json(
        { status: "error", error: "Failed to update learning path" },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: "success", data });
  } catch (error) {
    console.error("Error updating learning path:", error);
    return NextResponse.json(
      { status: "error", error: "Failed to update learning path" },
      { status: 500 }
    );
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { path_id: string } }) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("learning_paths").delete().eq("id", params.path_id);

    if (error) {
      console.error("Error deleting learning path:", error);
      return NextResponse.json(
        { status: "error", error: "Failed to delete learning path" },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: "success", data });
  } catch (error) {
    console.error("Error deleting learning path:", error);
    return NextResponse.json(
      { status: "error", error: "Failed to delete learning path" },
      { status: 500 }
    );
  }
}
