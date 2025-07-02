import { NextRequest, NextResponse } from "next/server";
import { createClient } from "~/lib/supabase/server";

// don't cache the results
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: { learning_path_id: string } }
) {
  try {
    const learning_path_id = params.learning_path_id;

    if (!learning_path_id) {
      return NextResponse.json(
        { status: "error", message: "Learning path ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get the learning path
    const { data: learningPath, error: pathError } = await supabase
      .from("learning_paths")
      .select("id, title, description, duration_estimate_hours")
      .eq("id", learning_path_id)
      .single();

    if (pathError) {
      console.error("Error fetching learning path:", pathError);
      return NextResponse.json(
        {
          status: "error",
          message:
            pathError.code === "PGRST116"
              ? "Learning path not found"
              : "Failed to fetch learning path",
        },
        { status: pathError.code === "PGRST116" ? 404 : 500 }
      );
    }

    // Get the activities for this learning path
    const { data: activities, error: activitiesError } = await supabase
      .from("activities")
      .select("id, title, description, type, config")
      .eq("learning_path_id", learning_path_id);

    if (activitiesError) {
      console.error("Error fetching activities:", activitiesError);
      return NextResponse.json(
        { status: "error", message: "Failed to fetch activities" },
        { status: 500 }
      );
    }

    const learningPathWithActivities = {
      ...learningPath,
      activities: activities || [],
    };

    const headers = new Headers({
      "Cache-Control": "no-store",
    });

    return NextResponse.json(
      {
        status: "success",
        data: learningPathWithActivities,
      },
      { headers }
    );
  } catch (error) {
    console.error("Unexpected error in learning path API:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
