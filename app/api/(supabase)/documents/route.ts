import { NextResponse, NextRequest} from "next/server";
import OpenAI from "openai";
import { createClient } from "~/lib/supabase-server";


export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("document").select()

    if (error) {
      console.error("Error fetching documents:", error);
      return NextResponse.json({ status: "error", error: "Failed to fetch documents" }, { status: 500 });
    }

    return NextResponse.json({ status: "success", data });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json({ status: "error", error: "Failed to fetch documents" }, { status: 500 });
  }
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const formData = await request.formData();
    const file = formData.get("file") as File;

    // Create a document entry in the database
    const { data: document, error: documentError } = await supabase
      .from("document")
      .insert({ path: file.name, type: "markdown", source: "upload" })
      .select()
      .single();

    if (documentError) {
      console.error("Error creating document:", documentError);
      return NextResponse.json({ status: "error", error: "Failed to create document" }, { status: 500 });
    }

    // Get text from markdown file
    const text = await file.text();

    // Extract headings and content
    const headings = extractHeadingsFromMarkdown(text);

    // Process headings into chunks
    const { chunks, headings: headingTitles } = processHeadingsIntoChunks(headings);

    // Loop through each chunk and generate embeddings
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      try {
        const embeddingResponse = await openai.embeddings.create({
          model: "text-embedding-ada-002",
          input: chunk,
        });

        // Generate slug from heading
        const heading = headingTitles[i];
        const slug = createSlugFromHeading(heading);

        const { error } = await supabase.from("document_section").insert({
          document_id: document.id,
          slug,
          heading,
          content: chunk,
          token_count: embeddingResponse.usage.total_tokens,
          embedding: embeddingResponse.data[0].embedding,
        });

        if (error) {
          console.error("Error inserting document section:", error);
          return NextResponse.json({ status: "error", error: "Failed to insert document section" }, { status: 500 });
        }
      } catch (error) {
        console.error("Error generating embedding:", error);
        return NextResponse.json({ status: "error", error: "Failed to generate embedding" }, { status: 500 });
      }
    }

    return NextResponse.json({ status: "success", data: document });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ status: "error", error: "Failed to upload file" }, { status: 500 });
  }
}

interface HeadingSection {
  level: number;
  title: string;
  content: string;
  position: number;
}

/**
 * Extracts headings and their content from markdown text
 */
function extractHeadingsFromMarkdown(text: string): HeadingSection[] {
  const headings: HeadingSection[] = [];
  let lastIndex = 0;

  // Process content before any heading as "Introduction"
  let introContent = "";
  const firstHeadingMatch = text.match(/^#{1,6}\s+.+$/m);
  if (firstHeadingMatch) {
    const firstHeadingIndex = text.indexOf(firstHeadingMatch[0]);
    if (firstHeadingIndex > 0) {
      introContent = text.substring(0, firstHeadingIndex).trim();
    }
  } else {
    introContent = text.trim();
  }

  if (introContent) {
    headings.push({
      level: 0,
      title: "Introduction",
      content: introContent,
      position: 0
    });
  }

  // Find all headings and their content
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  let match;
  while ((match = headingRegex.exec(text)) !== null) {
    const fullMatch = match[0];
    const level = match[1].length;
    const title = match[2].trim();
    const position = match.index!;

    // Add the previous heading with its content
    if (position > lastIndex && headings.length > 0) {
      const prevHeading = headings[headings.length - 1];
      if (prevHeading.position > 0) { // Skip for intro which is already processed
        prevHeading.content = text.substring(
          prevHeading.position + fullMatch.length,
          position
        ).trim();
      }
    }

    headings.push({
      level,
      title,
      content: "", // Will be filled in next iteration or at the end
      position
    });

    lastIndex = position;
  }

  // Fill in content for the last heading
  if (headings.length > 0 && headings[headings.length - 1].position > 0) {
    const lastHeading = headings[headings.length - 1];
    lastHeading.content = text.substring(
      lastHeading.position + lastHeading.title.length + lastHeading.level + 1
    ).trim();
  }

  return headings;
}

/**
 * Processes headings into chunks, combining content until it reaches the size threshold
 */
function processHeadingsIntoChunks(headings: HeadingSection[], maxChunkSize: number = 1500): {
  chunks: string[];
  headings: string[];
} {
  // Sort headings by level (from highest number/lowest level to lowest number/highest level)
  const sortedHeadings = [...headings].sort((a, b) => b.level - a.level);

  const processedChunks: string[] = [];
  const processedHeadings: string[] = [];

  // Group content by combining smaller sections
  let currentChunk = "";
  let currentHeading = "";

  // Process headings from lowest to highest level (reverse the array)
  for (let i = sortedHeadings.length - 1; i >= 0; i--) {
    const { title, content } = sortedHeadings[i];

    // Start a new chunk with this heading
    if (currentChunk.length === 0) {
      currentChunk = title + "\n" + content;
      currentHeading = title;
    }
    // If adding this content would exceed max chunk size, push current chunk and start new one
    else if (currentChunk.length + content.length + title.length + 1 > maxChunkSize) {
      processedChunks.push(currentChunk);
      processedHeadings.push(currentHeading);
      currentChunk = title + "\n" + content;
      currentHeading = title;
    }
    // Otherwise combine with current chunk
    else {
      currentChunk += "\n\n" + title + "\n" + content;
    }
  }

  // Add the last chunk if it exists
  if (currentChunk.length > 0) {
    processedChunks.push(currentChunk);
    processedHeadings.push(currentHeading);
  }

  return {
    chunks: processedChunks,
    headings: processedHeadings
  };
}

/**
 * Converts a heading to a URL-friendly slug
 */
function createSlugFromHeading(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/--+/g, '-')     // Replace multiple hyphens with single hyphen
    .trim();                  // Trim leading/trailing spaces
}
