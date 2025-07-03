import { NextResponse, NextRequest } from "next/server";
import { createClient } from "~/lib/supabase-server";
import OpenAI from "openai";
import { SupabaseClient } from "@supabase/supabase-js";

// Define interfaces for the data structure
interface DocumentSection {
  id: number;
  document_id: number;
  slug: string;
  heading: string;
  content: string;
  similarity?: number;
}

interface Document {
  id: number;
  path: string;
  meta?: {
    title?: string;
    [key: string]: unknown;
  };
  type?: string;
}

// Activity type-specific configurations
interface SlideConfig {
  content: string;
  narration: string;
  media_url?: string;
  media_type?: "image" | "video";
}

interface QuizConfig {
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
}

interface FlashcardConfig {
  cards: FlashcardData[];
}

interface FlashcardData {
  front: string;
  back: string;
}

interface EmbedConfig {
  url: string;
  embed_type: "video" | "article";
}

interface FillBlanksConfig {
  instruction: string;
  text_with_blanks: string;
  blanks: FillBlank[];
}

interface FillBlank {
  position: number;
  correct_answers: string[];
}

interface MatchingConfig {
  instruction: string;
  pairs: MatchingPair[];
}

interface MatchingPair {
  left: string;
  right: string;
}

// Input configuration interfaces (for AI-generated or partial configurations)
interface PartialSlideConfig {
  content?: string;
  narration?: string;
  media_url?: string;
  media_type?: string;
}

interface PartialQuizConfig {
  question?: string;
  options?: string[];
  correct_answer?: number;
  explanation?: string;
}

interface PartialFlashcardData {
  front?: string;
  back?: string;
}

interface PartialFlashcardConfig {
  cards?: PartialFlashcardData[];
}

interface PartialEmbedConfig {
  url?: string;
  embed_type?: string;
}

interface PartialFillBlank {
  position?: number;
  correct_answers?: string[] | string;
}

interface PartialFillBlanksConfig {
  instruction?: string;
  text_with_blanks?: string;
  blanks?: PartialFillBlank[];
}

interface PartialMatchingPair {
  left?: string;
  right?: string;
}

interface PartialMatchingConfig {
  instruction?: string;
  pairs?: PartialMatchingPair[];
}

type PartialActivityConfig =
  | PartialSlideConfig
  | PartialQuizConfig
  | PartialFlashcardConfig
  | PartialEmbedConfig
  | PartialFillBlanksConfig
  | PartialMatchingConfig
  | Record<string, unknown>
  | null
  | undefined;

// Union type for all activity configurations
type ActivityConfig =
  | SlideConfig
  | QuizConfig
  | FlashcardConfig
  | EmbedConfig
  | FillBlanksConfig
  | MatchingConfig;

// Activity types
type ActivityType = "slide" | "quiz" | "flashcard" | "embed" | "fill_blanks" | "matching";

interface Activity {
  title: string;
  description: string;
  type: ActivityType;
  config: ActivityConfig;
  path_id: string;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  duration_estimate_hours: number;
  document_id: number;
}

interface AIGeneratedActivity {
  title?: string;
  description?: string;
  type?: ActivityType;
  config?: PartialActivityConfig;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define prompts and constraints for each activity type
const activityTypePrompts = {
  slide: `
    Create a slide activity with the following structure:
    - content: Concise content (max 500 characters)
    - narration: Voice-over script explaining the content (max 1000 characters)
    - media_url: (Optional) URL to an image or video
    - media_type: (Optional) Either "image" or "video"

    The content should be clear, focused, and educational.
  `,
  quiz: `
    Create a quiz activity with the following structure:
    - question: A clear, focused question based on the content
    - options: An array of 4 possible answers
    - correct_answer: The index (0-based) of the correct answer
    - explanation: (Optional) Why the answer is correct

    Ensure questions are unambiguous and directly related to the content.
  `,
  flashcard: `
    Create a flashcard activity with the following structure:
    - cards: An array of 4 flashcard objects, each with:
      - front: A question or concept (max 100 characters)
      - back: The answer or explanation (max 200 characters)

    Flashcards should cover key concepts from the content.
  `,
  embed: `
    Create an embed activity with the following structure:
    - url: A URL to embed (use a placeholder like "https://example.com/resource/123")
    - embed_type: Either "video" or "article"

    Describe what type of resource would be ideal to embed.
  `,
  fill_blanks: `
    Create a fill-in-the-blanks activity with the following structure:
    - instruction: Clear instructions for the learner
    - text_with_blanks: Text with blanks indicated by underscores
    - blanks: An array of 4-5 blank objects, each with:
      - position: The 0-based index of the blank in the text
      - correct_answers: An array of acceptable answers for this blank

    Blanks should test understanding of key concepts.
  `,
  matching: `
    Create a matching activity with the following structure:
    - instruction: Clear instructions for the learner
    - pairs: An array of 4-5 matching pairs, each with:
      - left: The term or concept
      - right: The matching definition or example

    Pairs should cover related concepts from the content.
  `
};

// Helper functions to improve maintainability
async function fetchDocumentMetadata(supabase: SupabaseClient, documentID: number): Promise<Document> {
  const { data, error } = await supabase
    .from("documents")
    .select("id, path, meta, type")
    .eq("id", documentID)
    .single();

  if (error) {
    console.error("Error fetching document:", error);
    throw new Error("Document not found");
  }

  return data;
}

async function fetchDocumentSections(supabase: SupabaseClient, documentID: number): Promise<DocumentSection[]> {
  // Query document sections directly by document_id instead of using embedding matching
  const { data, error } = await supabase
    .from("document_sections")
    .select("id, document_id, content, slug, heading")
    .eq("document_id", documentID)
    .order("id")
    .limit(10);

  if (error) {
    console.error("Error fetching document sections:", error);
    throw new Error("Failed to fetch document sections");
  }

  if (!data || data.length === 0) {
    throw new Error("No content found to create learning path");
  }

  // Filter out sections with insufficient content
  const validSections = data.filter(section => section.content && section.content.length >= 50);

  if (validSections.length === 0) {
    throw new Error("No substantial content found to create learning path");
  }

  return validSections;
}

async function createLearningPath(supabase: SupabaseClient, document: Document): Promise<LearningPath> {
  const pathTitle = document.meta?.title || `Learning path for ${document.path}`;
  const { data, error } = await supabase
    .from("learning_paths")
    .insert({
      title: pathTitle,
      description: `Learning path generated from document: ${document.path}`,
      duration_estimate_hours: 2, // Will be updated based on activities
      document_id: document.id
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating learning path:", error);
    throw new Error("Failed to create learning path");
  }

  return data;
}

async function generateActivitiesWithAI(sections: DocumentSection[], documentID: number, learningPathId: string): Promise<Activity[]> {
  // We'll generate activities in batches to ensure all sections are covered
  const MAX_SECTIONS_PER_BATCH = 5; // Process 5 sections at a time to avoid token limits
  const allActivities: Activity[] = [];

  // Process sections in batches
  for (let i = 0; i < sections.length; i += MAX_SECTIONS_PER_BATCH) {
    const batchSections = sections.slice(i, i + MAX_SECTIONS_PER_BATCH);

    // Prepare context for OpenAI for this batch
    const contextData = batchSections.map(section => ({
      id: section.id,
      heading: section.heading || "Untitled Section",
      content: section.content.substring(0, 500) // Trim content to avoid token limits
    }));

    // Construct the activity type prompts
    const activityPrompts = Object.entries(activityTypePrompts)
      .map(([type, prompt]) => `${type}: ${prompt}`)
      .join('\n\n');

    try {
      // Call OpenAI to generate activities for this batch
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content: `You are an educational content expert specializing in creating engaging learning activities.

            Create activities following these specific formats and constraints:

            ${activityPrompts}

            For each section, create exactly TWO activities of different types.
            Choose activity types that best match the content of each section.
            Format your response as a valid JSON object with an 'activities' array.
            Each activity must have: title, description, type, and config properties.
            The config property must match the structure for the specific activity type.`
          },
          {
            role: "user",
            content: `Generate learning activities based on these document sections.
            Create varied activities that best fit each section's content.
            For EACH section, create TWO different activities of appropriate types.
            Ensure each activity follows the required format and constraints:

            ${JSON.stringify(contextData, null, 2)}`
          }
        ],
        response_format: { type: "json_object" }
      });

      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error("No content returned from OpenAI");
      }

      // Parse the activities from OpenAI response
      const aiResponse = JSON.parse(content);
      const batchActivities = aiResponse.activities || [];

      // Validate and ensure all activities have the required structure
      const processedActivities = batchActivities.map((activity: AIGeneratedActivity, index: number) => {
        // Calculate which section this activity belongs to (each section gets multiple activities)
        const sectionIndex = Math.floor(index / 2); // Two activities per section
        const section = batchSections[sectionIndex < batchSections.length ? sectionIndex : batchSections.length - 1];

        // Default to slide type if invalid type provided
        const activityType = isValidActivityType(activity.type) ? activity.type : "slide";

        // Generate properly formatted config based on activity type
        const config = validateAndFormatConfig(activityType, activity.config, section);

        return {
          title: activity.title || section.heading || `Activity ${index + 1}`,
          description: activity.description || section.content.substring(0, 100) + "...",
          type: activityType,
          config,
          path_id: learningPathId
        };
      });

      // Add the processed batch activities to our collection
      allActivities.push(...processedActivities);

    } catch (error) {
      console.error(`Error generating activities for batch ${i / MAX_SECTIONS_PER_BATCH + 1}:`, error);
      // For failed batches, generate fallback activities just for those sections
      const fallbackActivities = generateFallbackActivitiesForSections(
        batchSections,
        documentID,
        learningPathId
      );
      allActivities.push(...fallbackActivities);
    }

    // Small delay to avoid rate limiting
    if (i + MAX_SECTIONS_PER_BATCH < sections.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return allActivities;
}


// Type guard for activity type
function isValidActivityType(type?: ActivityType): type is ActivityType {
  const validTypes: ActivityType[] = ["slide", "quiz", "flashcard", "embed", "fill_blanks", "matching"];
  return !!type && validTypes.includes(type);
}

// Validate and format config according to activity type
function validateAndFormatConfig(type: ActivityType, providedConfig: PartialActivityConfig, section: DocumentSection): ActivityConfig {
  switch (type) {
    case "slide":
      return formatSlideConfig(providedConfig as PartialSlideConfig, section);
    case "quiz":
      return formatQuizConfig(providedConfig as PartialQuizConfig, section);
    case "flashcard":
      return formatFlashcardConfig(providedConfig as PartialFlashcardConfig, section);
    case "embed":
      return formatEmbedConfig(providedConfig as PartialEmbedConfig, section);
    case "fill_blanks":
      return formatFillBlanksConfig(providedConfig as PartialFillBlanksConfig, section);
    case "matching":
      return formatMatchingConfig(providedConfig as PartialMatchingConfig, section);
    default:
      // This should never happen due to isValidActivityType check
      return formatSlideConfig(providedConfig as PartialSlideConfig, section);
  }
}

function formatSlideConfig(config: PartialSlideConfig | undefined | null, section: DocumentSection): SlideConfig {
  return {
    content: config?.content || section.content.substring(0, 500),
    narration: config?.narration || `In this slide, we'll learn about ${section.heading}.`,
    media_url: config?.media_url,
    media_type: config?.media_type === "video" ? "video" : "image"
  };
}

function formatQuizConfig(config: PartialQuizConfig | undefined | null, section: DocumentSection): QuizConfig {
  const defaultOptions = [
    section.content.substring(0, 100) + "...",
    "Option 2",
    "Option 3",
    "Option 4"
  ].slice(0, 4);

  return {
    question: config?.question || `What is the main concept in ${section.heading}?`,
    options: Array.isArray(config?.options) && config.options.length > 1
      ? config.options.slice(0, 4)
      : defaultOptions,
    correct_answer: typeof config?.correct_answer === 'number'
      ? Math.min(config.correct_answer, 3)
      : 0,
    explanation: config?.explanation
  };
}

function formatFlashcardConfig(config: PartialFlashcardConfig | undefined | null, section: DocumentSection): FlashcardConfig {
  let cards: FlashcardData[] = [];

  // If valid cards are provided, use them (up to 4)
  if (Array.isArray(config?.cards) && config.cards.length > 0) {
    cards = config.cards
      .filter((card: PartialFlashcardData) => card.front && card.back)
      .slice(0, 4)
      .map((card: PartialFlashcardData) => ({
        front: card.front!.substring(0, 100),
        back: card.back!.substring(0, 200)
      }));
  }

  // If no valid cards, create a default one
  if (cards.length === 0) {
    cards = [{
      front: section.heading,
      back: section.content.substring(0, 200)
    }];
  }

  return { cards };
}

function formatEmbedConfig(config: PartialEmbedConfig | undefined | null, section: DocumentSection): EmbedConfig {
  return {
    url: config?.url || `https://example.com/resource/${section.id}`,
    embed_type: config?.embed_type === "article" ? "article" : "video"
  };
}

function formatFillBlanksConfig(config: PartialFillBlanksConfig | undefined | null, section: DocumentSection): FillBlanksConfig {
  // Default fill in the blanks if none provided
  if (!config?.text_with_blanks || !Array.isArray(config?.blanks)) {
    const words = section.content.split(' ');
    let text_with_blanks = section.content;
    const blanks: FillBlank[] = [];

    // Create up to 4 blanks
    for (let i = 0, count = 0; i < words.length && count < 4; i += 5) {
      if (i < words.length && words[i].length > 3) {
        const word = words[i];
        text_with_blanks = text_with_blanks.replace(word, "_______");
        blanks.push({
          position: count,
          correct_answers: [word]
        });
        count++;
      }
    }

    return {
      instruction: `Fill in the blanks in this text about ${section.heading}:`,
      text_with_blanks,
      blanks: blanks.slice(0, 4)
    };
  }

  // Format provided config
  return {
    instruction: config.instruction || `Fill in the blanks:`,
    text_with_blanks: config.text_with_blanks,
    blanks: Array.isArray(config.blanks)
      ? config.blanks.slice(0, 4).map((blank: PartialFillBlank, i: number) => ({
          position: blank.position || i,
          correct_answers: Array.isArray(blank.correct_answers)
            ? blank.correct_answers
            : [typeof blank.correct_answers === 'string' ? blank.correct_answers : ""]
        }))
      : []
  };
}

function formatMatchingConfig(config: PartialMatchingConfig | undefined | null, section: DocumentSection): MatchingConfig {
  // Default matching pairs if none provided
  if (!Array.isArray(config?.pairs) || config.pairs.length === 0) {
    // Create simple matching pairs from section content
    const sentences = section.content
      .split(/[.!?]/)
      .filter(s => s.trim().length > 0)
      .slice(0, 4);

    const pairs: MatchingPair[] = sentences.map(sentence => {
      const parts = sentence.trim().split(',');
      return {
        left: parts[0] || sentence.substring(0, sentence.length / 2),
        right: parts[1] || sentence.substring(sentence.length / 2)
      };
    });

    return {
      instruction: `Match these related concepts about ${section.heading}:`,
      pairs: pairs.slice(0, 4)
    };
  }

  // Format provided config
  return {
    instruction: config.instruction || `Match these related concepts:`,
    pairs: config.pairs.slice(0, 4).map((pair: PartialMatchingPair) => ({
      left: pair.left || "",
      right: pair.right || ""
    }))
  };
}


// Function to generate fallback activities for a specific batch of sections
function generateFallbackActivitiesForSections(
  sections: DocumentSection[],
  documentID: number,
  learningPathId: string
): Activity[] {
  return sections.flatMap((section, index) => {
    // For each section, create two different types of activities
    const activityTypes: ActivityType[] = ["slide", "quiz", "flashcard", "embed", "fill_blanks", "matching"];

    // Use two different activity types for each section
    const firstType = activityTypes[index % activityTypes.length];
    const secondType = activityTypes[(index + 3) % activityTypes.length]; // Offset by 3 to ensure variety

    const firstConfig = validateAndFormatConfig(firstType, null, section);
    const secondConfig = validateAndFormatConfig(secondType, null, section);

    return [
      {
        title: `${firstType.charAt(0).toUpperCase() + firstType.slice(1)}: ${section.heading || `Section ${index + 1}`}`,
        description: section.content.substring(0, 100) + "...",
        type: firstType,
        config: firstConfig,
        path_id: learningPathId
      },
      {
        title: `${secondType.charAt(0).toUpperCase() + secondType.slice(1)}: ${section.heading || `Section ${index + 1}`}`,
        description: section.content.substring(0, 100) + "...",
        type: secondType,
        config: secondConfig,
        path_id: learningPathId
      }
    ];
  });
}

async function saveActivities(supabase: SupabaseClient, activities: Activity[]): Promise<Activity[] | null> {
  const { data, error } = await supabase
    .from("activities")
    .insert(activities)
    .select();

  if (error) {
    console.error("Error creating activities:", error);
    return null;
  }

  return data;
}

async function updateLearningPathDuration(supabase: SupabaseClient, learningPathId: string, activitiesCount: number): Promise<void> {
  // Estimate duration based on number of activities
  const estimatedHours = Math.ceil(activitiesCount / 5);

  const { error } = await supabase
    .from("learning_paths")
    .update({ duration_estimate_hours: estimatedHours })
    .eq("id", learningPathId);

  if (error) {
    console.error("Error updating learning path duration:", error);
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("learning_paths").select("*, activities(*)");

    if (error) {
      console.error("Error fetching learning paths:", error);
      return NextResponse.json({ error: "Failed to fetch learning paths" }, { status: 500 });
    }

    return NextResponse.json({ status: "success", data });
  } catch (error) {
    console.error("Error fetching learning paths:", error);
    return NextResponse.json({ error: "Failed to fetch learning paths" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { documentID } = await request.json();
    const supabase = await createClient();

    // Step 1: Fetch document metadata
    const document = await fetchDocumentMetadata(supabase, documentID);

    // Step 2: Fetch document sections with embeddings
    const sections = await fetchDocumentSections(supabase, documentID);

    // Step 3: Create learning path
    const learningPath = await createLearningPath(supabase, document);

    // Step 4: Generate activities using OpenAI or fallback
    const activities = await generateActivitiesWithAI(sections, documentID, learningPath.id);

    // Step 5: Save activities to database
    const createdActivities = await saveActivities(supabase, activities);

    // Step 6: Update learning path duration based on activities
    if (createdActivities) {
      await updateLearningPathDuration(supabase, learningPath.id, createdActivities.length);
    }

    return NextResponse.json({
      status: "success",
      data: {
        learningPath,
        activities: createdActivities || []
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create learning path";
    const statusCode = errorMessage === "Document not found" ? 404 : 500;

    console.error("Error creating learning path:", error);
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}