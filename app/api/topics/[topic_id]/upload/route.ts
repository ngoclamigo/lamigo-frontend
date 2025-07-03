import { NextResponse } from "next/server";
import { getEmbedding, splitTextIntoChunks } from "~/lib/openai";
import { createClient } from "~/lib/supabase-server";

export async function POST(request: Request, { params }: { params: { topic_id: string } }) {
  try {
    const body = await request.json();
    const { content } = body;

    const chunks = splitTextIntoChunks(content);

    const supabase = await createClient();

    const titleMatch = content.match(/^#+\s+(.+)$/m);
    const sectionTitle = titleMatch ? titleMatch[1] : "Untitled Section";

    for (const chunk of chunks) {
      try {
        const embedding = await getEmbedding(chunk);
        const metadata = {
          title: sectionTitle,
          chunkIndex: chunks.indexOf(chunk),
          totalChunks: chunks.length,
          wordCount: chunk.split(/\s+/).length,
        };

        const { error } = await supabase.from("topic_sections").insert({
          topic_id: params.topic_id,
          content: removeMarkdownFormatting(chunk),
          content_markdown: chunk,
          content_embedding: embedding,
          metadata,
        });

        if (error) {
          return NextResponse.json(
            { status: "error", message: "Failed to insert section" },
            { status: 400 }
          );
        }
      } catch {
        return NextResponse.json(
          { status: "error", message: "Internal server error" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { status: "success", data: "Document uploaded successfully" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Simple function to remove markdown formatting for plain text
 * @param markdown - Markdown text to convert
 * @returns Plain text without markdown formatting
 */
function removeMarkdownFormatting(markdown: string): string {
  return markdown
    .replace(/#+\s+/g, "") // Remove headings
    .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
    .replace(/\*(.*?)\*/g, "$1") // Remove italic
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Remove links
    .replace(/`(.*?)`/g, "$1") // Remove inline code
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
    .replace(/- /g, "") // Remove list items
    .replace(/\d+\. /g, "") // Remove numbered list items
    .replace(/\n\n/g, " ") // Replace double line breaks with space
    .replace(/\n/g, " ") // Replace single line breaks with space
    .trim();
}
