import { NextRequest, NextResponse } from "next/server";
import { generateCompletion } from "~/lib/openai";
import { TopicSectionSearchResult, searchTopicSections } from "~/lib/openai/embeddings";
import { createClient } from "~/lib/supabase/server";

export const revalidate = 0;

export async function POST(request: NextRequest, { params }: { params: { topic_id: string } }) {
  try {
    const body = await request.json();
    const { query } = body;

    const supabase = await createClient();

    // get topic
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

    const relevantSections = await searchTopicSections(query, params.topic_id, 5);

    if (!relevantSections || relevantSections.length === 0) {
      return NextResponse.json({
        status: "success",
        data: {
          answer:
            "I don't have enough information to answer that question about this learning path.",
          context: [],
        },
      });
    }

    const formattedSections = relevantSections
      .map((section: TopicSectionSearchResult) => {
        return `SECTION:
          ${section.content}
        `;
      })
      .join("\n\n");

    const answer = await generateAnswer(query, formattedSections, topic.title);

    return NextResponse.json({
      status: "success",
      data: {
        answer,
        context: relevantSections.map((section: TopicSectionSearchResult) => ({
          id: section.id,
          content: section.content_markdown,
          metadata: section.metadata,
          similarity: section.similarity,
        })),
      },
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}

async function generateAnswer(query: string, context: string, topicTitle: string): Promise<string> {
  const messages = [
    {
      role: "system" as const,
      content: `You are a helpful AI assistant that answers questions about learning materials.
You are given sections from a learning path titled "${topicTitle}".
Your task is to answer the user's question based ONLY on the provided sections.
If the provided sections don't contain enough information to answer the question, admit that you don't know rather than making up information.
Be concise and accurate. Format your answers in markdown when appropriate.`,
    },
    {
      role: "user" as const,
      content: `I have a question about ${topicTitle}: ${query}\n\nHere are relevant sections from the learning material:\n\n${context}`,
    },
  ];

  return await generateCompletion(messages, 0.3);
}
