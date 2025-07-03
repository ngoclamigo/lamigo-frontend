import { NextResponse } from "next/server";
import {
  generateFillBlanksActivity,
  generateFlashcardActivity,
  generateMatchingActivity,
  generateQuizActivities,
  generateSlideActivity,
} from "~/lib/generator/activity";
import { createClient } from "~/lib/supabase/server";
import { TopicSection } from "~/types/topic";

export async function POST(request: Request, { params }: { params: { topic_id: string } }) {
  try {
    const supabase = await createClient();

    // Get topic
    const { data: topic, error: topicError } = await supabase
      .from("topics")
      .select("*, topic_sections(*)")
      .eq("id", params.topic_id)
      .single();

    if (topicError) {
      return NextResponse.json(
        {
          status: "error",
          message: topicError.code === "PGRST116" ? "Topic not found" : "Failed to fetch topic",
        },
        { status: topicError.code === "PGRST116" ? 404 : 400 }
      );
    }

    // create learning path
    const { data: learningPath, error: learningPathError } = await supabase
      .from("learning_paths")
      .insert({
        title: topic.title,
        description: topic.description,
        duration_estimate_hours: 2,
        topic_id: topic.id,
      })
      .select("*")
      .single();

    if (learningPathError) {
      return NextResponse.json(
        { status: "error", message: "Failed to create learning path" },
        { status: 400 }
      );
    }

    await generateActivities(learningPath.id, topic.topic_sections);

    return NextResponse.json({
      status: "success",
      data: learningPath,
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}

async function generateActivities(pathID: string, sections: TopicSection[]): Promise<string[]> {
  if (!sections || sections.length === 0) {
    return [];
  }

  // Group sections by metadata.title to organize them into coherent activities
  const sectionsByTitle: Record<string, Array<(typeof sections)[0]>> = {};

  for (const section of sections) {
    const title = (section.metadata?.title as string) || "Untitled Section";
    if (!sectionsByTitle[title]) {
      sectionsByTitle[title] = [];
    }
    sectionsByTitle[title].push(section);
  }

  const activityIds: string[] = [];

  // Create an activity for each group of sections
  for (const [title, groupedSections] of Object.entries(sectionsByTitle)) {
    // Sort sections by their position or chunk index
    groupedSections.sort((a, b) => {
      const aIndex = (a.metadata?.chunkIndex as number) || 0;
      const bIndex = (b.metadata?.chunkIndex as number) || 0;
      return aIndex - bIndex;
    });

    // Combine content from all sections in this group
    const combinedContent = groupedSections.map((s) => s.content_markdown).join("\n\n");

    try {
      // Generate slide activity with the combined content
      const slideActivityId = await generateSlideActivity(pathID, title, combinedContent);

      activityIds.push(slideActivityId);

      // If the section has substantial content, generate more activity types
      if (combinedContent.length > 500) {
        // Add variety with different activity types based on content length
        if (combinedContent.length > 1000) {
          // Generate flashcards for longer content
          const flashcardActivityId = await generateFlashcardActivity(
            pathID,
            title,
            combinedContent
          );
          activityIds.push(flashcardActivityId);
        }

        // Generate fill-in-the-blanks for medium-sized content
        if (combinedContent.length > 800 && combinedContent.length < 3000) {
          const fillBlanksActivityId = await generateFillBlanksActivity(
            pathID,
            title,
            combinedContent
          );
          activityIds.push(fillBlanksActivityId);
        }

        // Generate matching exercise for content with likely key terms
        if (combinedContent.includes(":") || combinedContent.includes("-")) {
          const matchingActivityId = await generateMatchingActivity(pathID, title, combinedContent);
          activityIds.push(matchingActivityId);
        }
      }
    } catch (error) {
      console.error(`Error creating activities for section ${title}:`, error);
    }
  }

  // Generate quiz activities if there are enough sections
  if (sections.length >= 3) {
    try {
      // Combine all content for quiz generation
      const allContent = sections.map((s) => s.content_markdown).join("\n\n");

      // Generate quiz questions
      const quizActivityIds = await generateQuizActivities(
        pathID,
        "Quiz on " + (sections[0]?.metadata?.title || "Topic Content"),
        allContent
      );

      activityIds.push(...quizActivityIds);
    } catch (error) {
      console.error("Error generating quiz activities:", error);
    }
  }

  return activityIds;
}
