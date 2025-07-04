import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: NextRequest, { params }: { params: { path_id: string } }) {
  try {
    const { document_url } = await request.json();

    if (!document_url) {
      return NextResponse.json({ error: "document_url is required" }, { status: 400 });
    }

    // Fetch document from URL and convert to base64
    let base64Document = "";
    let filename = "";
    let mimeType = "";

    try {
      const documentResponse = await fetch(document_url);
      if (!documentResponse.ok) {
        throw new Error(`Failed to fetch document: ${documentResponse.statusText}`);
      }

      const arrayBuffer = await documentResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      base64Document = buffer.toString("base64");

      // Extract filename from URL or use default
      const urlParts = document_url.split("/");
      filename = urlParts[urlParts.length - 1] || "document";

      // Determine MIME type from file extension or content-type header
      const contentType = documentResponse.headers.get("content-type");
      if (contentType) {
        mimeType = contentType;
      } else {
        const extension = filename.split(".").pop()?.toLowerCase();
        switch (extension) {
          case "pdf":
            mimeType = "application/pdf";
            break;
          case "docx":
            mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            break;
          case "doc":
            mimeType = "application/msword";
            break;
          case "txt":
            mimeType = "text/plain";
            break;
          default:
            mimeType = "application/octet-stream";
        }
      }
    } catch (error) {
      console.error("Failed to fetch document:", error);
      return NextResponse.json({ error: "Failed to fetch document from URL" }, { status: 400 });
    }

    // Generate activities using OpenAI with file input
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content: `You are an educational‑content expert.

          Your task is to turn *any* uploaded document—regardless of format—into a coherent learning path that still uses the activity schema.`,
        },
        {
          role: "user",
          content: [
            {
              type: "input_file",
              filename: filename,
              file_data: `data:${mimeType};base64,${base64Document}`,
            },
            {
              type: "input_text",
              text: `**Key rules (DO NOT VIOLATE front‑end contracts)**

1. Output a single valid JSON object with an 'activities' array.

2. Each activity must include ▸ title ▸ description ▸ type ▸ config, matching one of the format:

For slide activities, use:
{
  "content": "HTML content for the slide, MIN 1500 characters",
  "narration": "Optional narration text"
}

For quiz activities, use:
{
  "question": "Question text",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correct_answer": 0,
  "explanation": "Explanation of the correct answer",
  "narration": "Optional narration text"
}

For flashcard activities, use:
{
  "cards": [
    {"front": "Term or question", "back": "Definition or answer"}
  ],
  "narration": "Optional narration text"
}

For fill_blanks activities, use:
{
  "instruction": "Instructions for the exercise",
  "text_with_blanks": "Text with _____ placeholders",
  "blanks": [
    {"position": 0, "correct_answers": ["answer1", "answer2"]}
  ],
  "narration": "Optional narration text"
}

For matching activities, use:
{
  "instruction": "Instructions for matching",
  "pairs": [
    {"left": "Item to match", "right": "Corresponding match"}
  ],
  "narration": "Optional narration text"
}

3. Add a narration provided that the learner has 5 years of sales experience in B2B SaaS industry

**Additional sequencing & quality guidelines**

A. ***Global flow first:*** Before writing activities, internally decide an order that teaches from the simplest concepts → applied scenarios.

B. ***Vary cognitive load:*** Avoid repeating the same activity type back‑to‑back across sections unless pedagogically necessary.

C. ***Chunking:*** If a section is very long or complex, summarise it concisely—do **not** paste huge blocks.

D. ***Bridging sentences:*** Use the activity *description* field to explain how this activity connects to the previous one ("Now that you understand X, let's test Y …").

E. ***Role awareness:*** Assume the learner is a newcomer to the topic unless the text clearly states otherwise.

F. ***Document‑agnostic:*** Treat headings, bullet points, and tables generically; do not rely on any format‑specific cues (it might be a PDF, .md, .pptx, etc.).

Return only the JSON; no commentary.`,
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_object",
        },
      },
    });

    const generatedContent = response.output_text;

    return NextResponse.json({
      status: "success",
      data: JSON.parse(generatedContent) || [],
    });
  } catch (error) {
    console.error("Error generating activities:", error);
    return NextResponse.json(
      {
        status: "error",
        error: "Failed to generate activities",
      },
      { status: 500 }
    );
  }
}
