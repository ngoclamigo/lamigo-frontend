import { NextRequest, NextResponse } from "next/server";
import { createClient } from "~/lib/supabase/server";

// don't cache the results
export const revalidate = 0;

interface LearningPathWithActivityIds {
  id: string;
  title: string;
  description: string;
  duration_estimate_hours: number;
  activity_ids: string[];
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const per_page = parseInt(searchParams.get("per_page") || "10");
    const offset = (page - 1) * per_page;

    const supabase = await createClient();

    // Get total count
    const { count: total } = await supabase
      .from("learning_paths")
      .select("*", { count: "exact", head: true });

    // Get learning paths with pagination
    const { data: learningPaths, error } = await supabase
      .from("learning_paths")
      .select("id, title, description, duration_estimate_hours")
      .range(offset, offset + per_page - 1);

    if (error) {
      console.error("Error fetching learning paths:", error);
      return NextResponse.json(
        { status: "error", message: "Failed to fetch learning paths" },
        { status: 500 }
      );
    }

    // Get activity_ids for each learning path
    const pathsWithActivityIds: LearningPathWithActivityIds[] = await Promise.all(
      learningPaths.map(
        async (path: {
          id: string;
          title: string;
          description: string;
          duration_estimate_hours: number;
        }) => {
          const { data: activities } = await supabase
            .from("activities")
            .select("id")
            .eq("learning_path_id", path.id);

          return {
            ...path,
            activity_ids: activities?.map((activity: { id: string }) => activity.id) || [],
          };
        }
      )
    );

    const headers = new Headers({
      "Cache-Control": "no-store",
    });

    return NextResponse.json(
      {
        status: "success",
        data: pathsWithActivityIds,
        paging: {
          page,
          per_page,
          total: total || 0,
        },
      },
      { headers }
    );
  } catch (error) {
    console.error("Unexpected error in learning paths API:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
