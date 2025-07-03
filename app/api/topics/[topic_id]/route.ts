import { NextRequest, NextResponse } from "next/server";
import { createClient } from "~/lib/supabase-server";

export const revalidate = 0;

export async function GET(_: NextRequest, { params }: { params: { topic_id: string } }) {
  try {
    const supabase = await createClient();

    const { data: topic, error: selectError } = await supabase
      .from("topics")
      .select("*, topic_sections(*)")
      .eq("id", params.topic_id)
      .single();

    if (selectError) {
      return NextResponse.json(
        {
          status: "error",
          message: selectError.code === "PGRST116" ? "Topic not found" : "Failed to fetch topic",
        },
        { status: selectError.code === "PGRST116" ? 404 : 400 }
      );
    }

    return NextResponse.json({
      status: "success",
      data: topic,
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { topic_id: string } }) {
  try {
    const body = await request.json();
    const { title, description } = body;

    const supabase = await createClient();

    const { data: topic, error: updateError } = await supabase
      .from("topics")
      .update({ title, description })
      .eq("id", params.topic_id)
      .select("*")
      .single();

    if (updateError) {
      return NextResponse.json(
        { status: "error", message: "Failed to update topic" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: "success",
      data: topic,
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { topic_id: string } }) {
  try {
    const supabase = await createClient();

    const { error: deleteError } = await supabase.from("topics").delete().eq("id", params.topic_id);

    if (deleteError) {
      return NextResponse.json(
        { status: "error", message: "Failed to delete topic" },
        { status: 400 }
      );
    }

    return NextResponse.json({ status: "success", data: "Topic deleted successfully" });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
