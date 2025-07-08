import { NextRequest, NextResponse } from "next/server";
import { createClient } from "~/lib/supabase-server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path_id: string }> }
) {
  try {
    const { path_id } = await params;
    const supabase = await createClient();

    const { activities } = await request.json();

    const { data, error } = await supabase
      .from("activities")
      .insert(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        activities.map((activity: any) => ({
          ...activity,
          learning_path_id: path_id,
        }))
      )
      .select();

    if (error) {
      console.error("Failed to create activities:", error);
      return NextResponse.json(
        { status: "error", error: "Failed to create activities" },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: "success", data });
  } catch (error) {
    console.error("Failed to create activities:", error);
    return NextResponse.json(
      { status: "error", error: "Failed to create activities" },
      { status: 500 }
    );
  }
}
