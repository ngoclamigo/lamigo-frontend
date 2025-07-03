import { NextResponse, NextRequest } from "next/server";
import { createClient } from "~/lib/supabase-server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("learning_paths").select()

    if (error) {
      console.error("Error fetching learning paths:", error);
      return NextResponse.json({ error: "Failed to fetch learning paths" }, { status: 500 });
    }

    return NextResponse.json({ status: "success", data });
  } catch (error) {
    console.error("Error fetching learning paths:", error);
    return NextResponse.json({ error: "Failed to fetch learning paths" }, { status: 500 });
  }
}
