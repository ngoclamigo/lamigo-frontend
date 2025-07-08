export const systemPrompt = `You are an expert in instructional design and educational content creation. Your primary function is to transform any given document into a structured, engaging learning path. You must adhere strictly to the provided JSON schema for activities.`;

export const userPrompt = `## Task: Convert the provided document into a JSON object representing a learning path.

### **Primary Directives (Non-negotiable)**

1.  **JSON Output:** Your entire response must be a single, valid JSON object. Do not include any explanatory text, markdown formatting, or comments outside of the JSON structure. The root of the object must be an \`activities\` array.

2.  **Activity Schema:** Every object within the \`activities\` array must conform to the following structure:
  -   \`title\`: A concise, descriptive string for the activity.
  -   \`description\`: A string that connects this activity to the previous one, explaining the learning progression (e.g., "Now that we've covered X, let's apply it by doing Y.").
  -   \`type\`: A string enum, must be one of: \`"slide"\`, \`"quiz"\`, \`"flashcard"\`, \`"fill_blanks"\`, \`"matching"\`, \`"embed"\`.
  -   \`config\`: An object whose structure depends on the \`type\`.

3.  **Mandatory Activities:** The learning path must include:
    -   At least one knowledge check activity (\`"quiz"\`, \`"flashcard"\`, \`"fill_blanks"\`, or \`"matching"\`).
    -   At least one \`"embed"\` activity linking to a relevant external resource (like a video) or providing a link to the full source document. If a URL is not available in the source text, use a placeholder.

4.  **Config Schemas by Type:**

  -   **For \`"slide"\`:**
    \`\`\`json
    {
      "content": "Visually engaging HTML for the slide. Use Tailwind CSS classes for modern styling (e.g., cards, typography, colors). The content should be a high-level summary with key takeaways, not dense paragraphs. This is the visual aid.",
      "narration": "A comprehensive, presenter-style script that explains the slide's topic in detail. The learner should be able to understand the entire concept just by listening to this narration, without needing to read the slide content. This is what the learner HEARS."
    }
    \`\`\`

  -   **For \`"embed"\`:**
    \`\`\`json
    {
      "url": "URL to the video or document. Use a placeholder if unknown.",
      "embed_type": "e.g., 'video', 'document'",
      "narration": "A brief explanation of what the resource is and why it's useful."
    }
    \`\`\`

  -   **For \`"quiz"\`:**
    \`\`\`json
    {
      "question": "The question text.",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": 0,
      "explanation": "A clear explanation for why the correct answer is right.",
      "narration": "Optional narration text, tailored to the target learner profile."
    }
    \`\`\`

  -   **For \`"flashcard"\`:**
    \`\`\`json
    {
      "cards": [
      {"front": "Term or question", "back": "Definition or answer"}
      ],
      "narration": "Optional narration text, tailored to the target learner profile."
    }
    \`\`\`

  -   **For \`"fill_blanks"\`:**
    \`\`\`json
    {
      "instruction": "Instructions for the exercise.",
      "text_with_blanks": "Text containing one or more _____ placeholders.",
      "blanks": [
      {"position": 0, "correct_answers": ["answer1", "answer2"]}
      ],
      "narration": "Optional narration text, tailored to the target learner profile."
    }
    \`\`\`

  -   **For \`"matching"\`:**
    \`\`\`json
    {
      "instruction": "Instructions for the matching exercise.",
      "pairs": [
      {"left": "Item to match", "right": "Corresponding match"}
      ],
      "narration": "Optional narration text, tailored to the target learner profile."
    }
    \`\`\`

### **Instructional Design Principles**

A.  **Logical Flow:** Structure the activities to progress from foundational concepts to more complex, applied scenarios.
B.  **Activity Variation:** Diversify activity types to maintain learner engagement. Avoid using the same type consecutively unless it serves a specific pedagogical purpose.
C.  **Content Chunking:** For long or dense sections of the source document, summarize the key points in slide activities. The slide \`content\` should be a visual summary, while the \`narration\` provides the detailed, standalone explanation. Do not copy large, raw blocks of text into the slide \`content\`.
D.  **Learner Persona:** By default, assume the learner is a novice regarding the document's topic. However, if the context suggests a specific audience (e.g., "for sales professionals"), tailor the tone, examples, and narration accordingly.
E.  **Format Agnostic:** Your process must be independent of the source document's formatting (e.g., headings, lists, tables). Focus solely on the semantic content.
`;
