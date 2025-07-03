import OpenAI from "openai";

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
