import { generateCompletion } from "~/lib/openai";
import { createClient } from "~/lib/supabase-server";
import {
  ActivityConfig,
  ActivityType,
  EmbedConfig,
  FillBlanksConfig,
  FlashcardConfig,
  FlashcardData,
  MatchingConfig,
  QuizConfig,
  SlideConfig,
} from "~/types/learning-path";

/**
 * Create an activity in the database
 * @param learningPathId - The ID of the learning path
 * @param title - The title of the activity
 * @param description - The description of the activity
 * @param type - The type of activity
 * @param config - The configuration for the activity
 * @returns The ID of the created activity
 */
export async function createActivity(
  learningPathId: string,
  title: string,
  description: string,
  type: ActivityType,
  config: ActivityConfig
): Promise<string> {
  try {
    const supabase = await createClient();

    const { data: activity, error: activityError } = await supabase
      .from("activities")
      .insert({
        title,
        description,
        type,
        config,
        learning_path_id: learningPathId,
      })
      .select("id")
      .single();

    if (activityError) {
      console.error("Error creating activity:", activityError);
      throw activityError;
    }

    return activity.id;
  } catch (error) {
    console.error(`Error creating ${type} activity:`, error);
    throw error;
  }
}

/**
 * Generate a slide activity with narration
 * @param learningPathId - The ID of the learning path
 * @param title - The title of the slide
 * @param content - The markdown content for the slide
 * @returns The ID of the created activity
 */
export async function generateSlideActivity(
  learningPathId: string,
  title: string,
  content: string
): Promise<string> {
  try {
    // Generate narration for the slide content
    const narration = await generateNarrationForContent(content);

    const slideConfig: SlideConfig = {
      content,
      narration,
    };

    return await createActivity(learningPathId, title, `Slide: ${title}`, "slide", slideConfig);
  } catch (error) {
    console.error("Error generating slide activity:", error);
    throw error;
  }
}

/**
 * Generate a quiz activity with multiple-choice questions
 * @param learningPathId - The ID of the learning path
 * @param title - The title of the quiz
 * @param content - The content to generate questions from
 * @returns The IDs of the created quiz activities
 */
export async function generateQuizActivities(
  learningPathId: string,
  title: string,
  content: string
): Promise<string[]> {
  try {
    // Generate quiz questions using OpenAI
    const quizQuestions = await generateQuizQuestionsFromContent(content);

    const activityIds: string[] = [];

    // Create a separate activity for each question
    for (let i = 0; i < quizQuestions.length; i++) {
      const question = quizQuestions[i];
      const quizConfig: QuizConfig = {
        question: question.question,
        options: question.options,
        correct_answer: question.correct_answer,
        explanation: question.explanation || "",
      };

      const activityId = await createActivity(
        learningPathId,
        `${title} - Quiz Question ${i + 1}`,
        question.question,
        "quiz",
        quizConfig
      );

      activityIds.push(activityId);
    }

    return activityIds;
  } catch (error) {
    console.error("Error generating quiz activities:", error);
    throw error;
  }
}

/**
 * Generate flashcard activities
 * @param learningPathId - The ID of the learning path
 * @param title - The title of the flashcard set
 * @param content - The content to generate flashcards from
 * @returns The ID of the created flashcard activity
 */
export async function generateFlashcardActivity(
  learningPathId: string,
  title: string,
  content: string
): Promise<string> {
  try {
    // Generate flashcards using OpenAI
    const flashcards = await generateFlashcardsFromContent(content);

    const flashcardConfig: FlashcardConfig = {
      cards: flashcards,
    };

    return await createActivity(
      learningPathId,
      `${title} - Flashcards`,
      `Flashcards for: ${title}`,
      "flashcard",
      flashcardConfig
    );
  } catch (error) {
    console.error("Error generating flashcard activity:", error);
    throw error;
  }
}

/**
 * Generate a fill-in-the-blanks activity
 * @param learningPathId - The ID of the learning path
 * @param title - The title of the activity
 * @param content - The content to generate fill-in-the-blanks from
 * @returns The ID of the created activity
 */
export async function generateFillBlanksActivity(
  learningPathId: string,
  title: string,
  content: string
): Promise<string> {
  try {
    // Generate fill-in-the-blanks exercise using OpenAI
    const fillBlanksExercise = await generateFillBlanksFromContent(content);

    return await createActivity(
      learningPathId,
      `${title} - Fill in the Blanks`,
      `Fill in the blanks exercise for: ${title}`,
      "fill_blanks",
      fillBlanksExercise
    );
  } catch (error) {
    console.error("Error generating fill-in-the-blanks activity:", error);
    throw error;
  }
}

/**
 * Generate a matching activity
 * @param learningPathId - The ID of the learning path
 * @param title - The title of the activity
 * @param content - The content to generate matching pairs from
 * @returns The ID of the created activity
 */
export async function generateMatchingActivity(
  learningPathId: string,
  title: string,
  content: string
): Promise<string> {
  try {
    // Generate matching exercise using OpenAI
    const matchingExercise = await generateMatchingFromContent(content);

    return await createActivity(
      learningPathId,
      `${title} - Matching Exercise`,
      `Matching exercise for: ${title}`,
      "matching",
      matchingExercise
    );
  } catch (error) {
    console.error("Error generating matching activity:", error);
    throw error;
  }
}

/**
 * Create an embed activity for a video or article
 * @param learningPathId - The ID of the learning path
 * @param title - The title of the activity
 * @param url - The URL to embed
 * @param embedType - The type of embed (video or article)
 * @returns The ID of the created activity
 */
export async function createEmbedActivity(
  learningPathId: string,
  title: string,
  url: string,
  embedType: "video" | "article"
): Promise<string> {
  try {
    const embedConfig: EmbedConfig = {
      url,
      embed_type: embedType,
    };

    return await createActivity(
      learningPathId,
      `${title} - ${embedType === "video" ? "Video" : "Article"}`,
      `${embedType === "video" ? "Video" : "Article"}: ${title}`,
      "embed",
      embedConfig
    );
  } catch (error) {
    console.error("Error creating embed activity:", error);
    throw error;
  }
}

// Helper functions to generate content with OpenAI

/**
 * Generate narration for slide content
 * @param content - The slide content
 * @returns Generated narration
 */
async function generateNarrationForContent(content: string): Promise<string> {
  const promptText = `
Convert the following educational content into a clear, engaging narration script
that could be read aloud. Keep the narration conversational and accessible.
Make it sound natural but maintain all the important information.
Keep it concise and to the point.

CONTENT:
${content.substring(0, 4000)}  // Limit to avoid token limits
`;

  const narration = await generateCompletion(
    [
      {
        role: "system",
        content: "You are an expert at creating clear, engaging narration for educational content.",
      },
      { role: "user", content: promptText },
    ],
    0.7
  );

  return narration;
}

/**
 * Generate quiz questions from content
 * @param content - The content to generate questions from
 * @returns Array of quiz questions
 */
async function generateQuizQuestionsFromContent(content: string): Promise<
  Array<{
    question: string;
    options: string[];
    correct_answer: number;
    explanation?: string;
  }>
> {
  const promptText = `
Based on the following educational content, create 3-5 multiple-choice quiz questions.
For each question, provide 4 options and indicate the correct answer.
Also include a brief explanation for why the answer is correct.
Format your response as a JSON array of objects with the following structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": 0,  // Index of the correct option (0-based)
    "explanation": "Brief explanation of why this answer is correct"
  }
]

CONTENT:
${content.substring(0, 4000)}  // Limit to avoid token limits
`;

  const quizQuestionsJson = await generateCompletion(
    [
      {
        role: "system",
        content:
          "You are an educational content creator specializing in creating effective quiz questions.",
      },
      { role: "user", content: promptText },
    ],
    0.7
  );

  try {
    // Parse the generated JSON
    const quizQuestions = JSON.parse(quizQuestionsJson);

    // Validate the structure
    if (!Array.isArray(quizQuestions) || quizQuestions.length === 0) {
      throw new Error("Invalid quiz questions format");
    }

    return quizQuestions;
  } catch (parseError) {
    console.error("Error parsing quiz questions:", parseError);
    // Try to extract JSON from the text response
    const jsonMatch = quizQuestionsJson.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        console.error("Failed to extract JSON from response");
        return [];
      }
    }
    return [];
  }
}

/**
 * Generate flashcards from content
 * @param content - The content to generate flashcards from
 * @returns Array of flashcard data
 */
async function generateFlashcardsFromContent(content: string): Promise<FlashcardData[]> {
  const promptText = `
Based on the following educational content, create 5-8 flashcards.
Each flashcard should have a front side with a term, concept, or question,
and a back side with the definition, explanation, or answer.
Format your response as a JSON array of objects with the following structure:
[
  {
    "front": "Term or question",
    "back": "Definition or answer"
  }
]

CONTENT:
${content.substring(0, 4000)}  // Limit to avoid token limits
`;

  const flashcardsJson = await generateCompletion(
    [
      {
        role: "system",
        content:
          "You are an educational content creator specializing in creating effective flashcards.",
      },
      { role: "user", content: promptText },
    ],
    0.7
  );

  try {
    // Parse the generated JSON
    const flashcards = JSON.parse(flashcardsJson);

    // Validate the structure
    if (!Array.isArray(flashcards) || flashcards.length === 0) {
      throw new Error("Invalid flashcards format");
    }

    return flashcards;
  } catch (parseError) {
    console.error("Error parsing flashcards:", parseError);
    // Try to extract JSON from the text response
    const jsonMatch = flashcardsJson.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        console.error("Failed to extract JSON from response");
        return [];
      }
    }
    return [];
  }
}

/**
 * Generate fill-in-the-blanks exercise from content
 * @param content - The content to generate fill-in-the-blanks from
 * @returns Fill-in-the-blanks configuration
 */
async function generateFillBlanksFromContent(content: string): Promise<FillBlanksConfig> {
  const promptText = `
Based on the following educational content, create a fill-in-the-blanks exercise.
Create a paragraph with 3-5 key terms or concepts replaced with blanks (represented by _____).
For each blank, provide the correct answer(s) that could fill it.
Format your response as a JSON object with the following structure:
{
  "instruction": "Fill in the blanks with the correct terms.",
  "text_with_blanks": "The _____ is a fundamental concept in...",
  "blanks": [
    {
      "position": 0,  // Index of the first blank (0-based)
      "correct_answers": ["term", "concept", "similar acceptable answer"]  // Multiple correct answers
    },
    // More blanks...
  ]
}

CONTENT:
${content.substring(0, 4000)}  // Limit to avoid token limits
`;

  const fillBlanksJson = await generateCompletion(
    [
      {
        role: "system",
        content:
          "You are an educational content creator specializing in creating effective fill-in-the-blanks exercises.",
      },
      { role: "user", content: promptText },
    ],
    0.7
  );

  try {
    // Parse the generated JSON
    const fillBlanks = JSON.parse(fillBlanksJson);

    // Validate the structure
    if (!fillBlanks.text_with_blanks || !Array.isArray(fillBlanks.blanks)) {
      throw new Error("Invalid fill-in-the-blanks format");
    }

    return fillBlanks;
  } catch (parseError) {
    console.error("Error parsing fill-in-the-blanks:", parseError);
    // Try to extract JSON from the text response
    const jsonMatch = fillBlanksJson.match(/\{\s*"instruction[\s\S]*\}\s*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        console.error("Failed to extract JSON from response");
        return {
          instruction: "Fill in the blanks with the correct terms.",
          text_with_blanks: "Error generating exercise.",
          blanks: [],
        };
      }
    }
    return {
      instruction: "Fill in the blanks with the correct terms.",
      text_with_blanks: "Error generating exercise.",
      blanks: [],
    };
  }
}

/**
 * Generate matching exercise from content
 * @param content - The content to generate matching pairs from
 * @returns Matching configuration
 */
async function generateMatchingFromContent(content: string): Promise<MatchingConfig> {
  const promptText = `
Based on the following educational content, create a matching exercise.
Create 5-8 pairs of related terms, concepts, or phrases that should be matched.
Format your response as a JSON object with the following structure:
{
  "instruction": "Match the items in the left column with their corresponding items in the right column.",
  "pairs": [
    {
      "left": "Term or concept",
      "right": "Definition or related concept"
    },
    // More pairs...
  ]
}

CONTENT:
${content.substring(0, 4000)}  // Limit to avoid token limits
`;

  const matchingJson = await generateCompletion(
    [
      {
        role: "system",
        content:
          "You are an educational content creator specializing in creating effective matching exercises.",
      },
      { role: "user", content: promptText },
    ],
    0.7
  );

  try {
    // Parse the generated JSON
    const matching = JSON.parse(matchingJson);

    // Validate the structure
    if (!matching.instruction || !Array.isArray(matching.pairs)) {
      throw new Error("Invalid matching format");
    }

    return matching;
  } catch (parseError) {
    console.error("Error parsing matching exercise:", parseError);
    // Try to extract JSON from the text response
    const jsonMatch = matchingJson.match(/\{\s*"instruction[\s\S]*\}\s*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        console.error("Failed to extract JSON from response");
        return {
          instruction:
            "Match the items in the left column with their corresponding items in the right column.",
          pairs: [],
        };
      }
    }
    return {
      instruction:
        "Match the items in the left column with their corresponding items in the right column.",
      pairs: [],
    };
  }
}
