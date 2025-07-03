import { createClient } from "../supabase/server";
import { getEmbedding } from "./index";

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
