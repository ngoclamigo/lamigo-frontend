import { NextRequest, NextResponse } from "next/server";
import { createClient } from "~/lib/supabase/server";

export const revalidate = 0;

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: learning_paths, error } = await supabase
      .from("learning_paths")
      .select("*, activities(*)")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { status: "error", message: "Failed to fetch learning paths" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: "success",
      data: learning_paths || [],
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, duration_estimate_hours } = body;

    const supabase = await createClient();

    const { data: learning_path, error: createError } = await supabase
      .from("learning_paths")
      .insert({ title, description, duration_estimate_hours })
      .select("*")
      .single();

    if (createError) {
      return NextResponse.json(
        { status: "error", message: "Failed to create learning path" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        data: learning_path,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
