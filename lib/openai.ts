import OpenAI from "openai";
import { createClient } from "./supabase-server";

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate embeddings for a given text using OpenAI's embedding model
 * @param text - The text to generate embeddings for
 * @returns The embedding vector as a number array
 */
export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
}

/**
 * Split a long text into smaller chunks for embedding
 * @param text - The text to split
 * @param maxChunkLength - Maximum length of each chunk (in characters)
 * @param overlap - Number of characters to overlap between chunks
 * @returns Array of text chunks
 */
export function splitTextIntoChunks(
  text: string,
  maxChunkLength: number = 1500,
  overlap: number = 200
): string[] {
  if (text.length <= maxChunkLength) {
    return [text];
  }

  const chunks: string[] = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    // Calculate end index for this chunk
    let endIndex = startIndex + maxChunkLength;

    // If we're not at the end of the text, try to find a natural break point
    if (endIndex < text.length) {
      // Look for paragraph break, then sentence break, then space
      const paragraphBreak = text.lastIndexOf("\n\n", endIndex);
      const sentenceBreak = text.lastIndexOf(". ", endIndex);
      const spaceBreak = text.lastIndexOf(" ", endIndex);

      // Choose the closest break point that's not too far back
      if (paragraphBreak > startIndex && paragraphBreak > endIndex - 200) {
        endIndex = paragraphBreak;
      } else if (sentenceBreak > startIndex && sentenceBreak > endIndex - 100) {
        endIndex = sentenceBreak + 1; // Include the period
      } else if (spaceBreak > startIndex) {
        endIndex = spaceBreak;
      }
    }

    // Add this chunk to our array
    chunks.push(text.slice(startIndex, endIndex).trim());

    // Move the start index for the next chunk, accounting for overlap
    startIndex = endIndex - overlap;

    // Make sure we're not starting in the middle of a word
    if (
      startIndex > 0 &&
      startIndex < text.length &&
      text[startIndex] !== " " &&
      text[startIndex] !== "\n"
    ) {
      const nextSpace = text.indexOf(" ", startIndex);
      if (nextSpace !== -1 && nextSpace < startIndex + 20) {
        startIndex = nextSpace + 1;
      }
    }
  }

  return chunks;
}

/**
 * Generate a completion using the OpenAI Chat API
 * @param messages - Array of chat messages
 * @param temperature - Controls randomness (0 to 1)
 * @returns The AI-generated response text
 */
export async function generateCompletion(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  temperature: number = 0.7
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error generating completion:", error);
    throw error;
  }
}

/**
 * Search for relevant sections based on a query
 * @param query - The search query
 * @param topicId - Optional topic ID to restrict search to
 * @param limit - Maximum number of results to return
 * @returns Array of matching sections with similarity scores
 */
export interface TopicSectionSearchResult {
  id: string;
  content: string;
  content_markdown: string;
  metadata: Record<string, unknown>;
  topic_id: string;
  similarity: number;
  topics?: {
    title: string;
    description: string;
  };
}

export async function searchTopicSections(
  query: string,
  topicId?: string,
  limit: number = 5
): Promise<TopicSectionSearchResult[]> {
  try {
    // Generate embedding for the query
    const embedding = await getEmbedding(query);

    // Initialize Supabase client
    const supabase = await createClient();

    // Build the query using RPC for vector search
    // We'll use a stored procedure for vector search
    const { data, error } = await supabase.rpc("match_topic_sections", {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: limit,
      topic_filter: topicId || null,
    });

    if (error) {
      console.error("Error searching topic sections:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in vector search:", error);
    throw error;
  }
}
