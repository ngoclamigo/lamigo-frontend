import { NextResponse } from "next/server";
import { createClient } from "~/lib/supabase-server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("learning_paths").select("*, activities(*)");

    if (error) {
      console.error("Error fetching learning paths:", error);
      return NextResponse.json(
        { status: "error", error: "Failed to fetch learning paths" },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: "success", data });
  } catch (error) {
    console.error("Error fetching learning paths:", error);
    return NextResponse.json(
      { status: "error", error: "Failed to fetch learning paths" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { title, description } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { status: "error", error: "Name and description are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("learning_paths")
      .insert([{ title, description }])
      .select("*")
      .single();

    if (error) {
      console.error("Error creating learning path:", error);
      return NextResponse.json(
        { status: "error", error: "Failed to create learning path" },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: "success", data });
  } catch (error) {
    console.error("Error creating learning path:", error);
    return NextResponse.json(
      { status: "error", error: "Failed to create learning path" },
      { status: 500 }
    );
  }
}
