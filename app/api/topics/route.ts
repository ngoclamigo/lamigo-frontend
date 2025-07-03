import { NextRequest, NextResponse } from "next/server";
import { createClient } from "~/lib/supabase-server";

export const revalidate = 0;

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: topics, error } = await supabase
      .from("topics")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { status: "error", message: "Failed to fetch topics" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: "success",
      data: topics || [],
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
    const { title, description } = body;

    const supabase = await createClient();

    const { data: topic, error: createError } = await supabase
      .from("topics")
      .insert({ title, description })
      .select("*")
      .single();

    if (createError) {
      return NextResponse.json(
        { status: "error", message: "Failed to create topic" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        data: topic,
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
