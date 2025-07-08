export const systemPrompt = `You are an expert in instructional design and educational content creation. Your primary function is to transform any given document into a structured, engaging learning path. You must adhere strictly to the provided JSON schema and instructions.`;

export const userPrompt = `<instructions>
You will be given a document. Your task is to convert it into a learning path, which is a JSON object.
Your entire response MUST be a single, valid JSON object. Do not include any text or markdown outside of the JSON.
The root of the JSON object must be an \`activities\` array.

### Core Requirements
1.  **Logical Flow**: Structure activities from foundational concepts to applied knowledge.
2.  **Activity Variety**: Use a mix of activity types to keep the learner engaged.
3.  **Content Chunking**: For long documents, summarize key points in "slide" activities. The slide \`content\` should be a visual summary (using Tailwind CSS classes), while the \`narration\` provides a full, standalone explanation.
4.  **Mandatory Activities**: The learning path must include at least one knowledge check (quiz, flashcard, fill_blanks, or matching) and at least one "embed" activity. If a URL is not in the source text, use a placeholder.
5.  **Learner Persona**: Assume the learner is a novice unless the document suggests a specific audience.
</instructions>

<schema>
Each object in the \`activities\` array must conform to this structure:
\`\`\`json
{
  "title": "A concise, descriptive string for the activity.",
  "description": "A string that connects this activity to the previous one, explaining the learning progression (e.g., 'Now that we've covered X, let's apply it by doing Y.').",
  "type": "A string enum, must be one of: 'slide', 'quiz', 'flashcard', 'fill_blanks', 'matching', 'embed'.",
  "config": "An object whose structure depends on the 'type'."
}
\`\`\`

### Config Schemas by Type

**type: "slide"**
\`\`\`json
{
  "content": "Visually engaging HTML for the slide, using Tailwind CSS classes. This is a high-level summary with key takeaways.",
  "narration": "A comprehensive, presenter-style script that explains the slide's topic in detail. The learner should be able to understand the concept just by listening to this."
}
\`\`\`

**type: "embed"**
\`\`\`json
{
  "url": "URL to the video or document. Use a placeholder if unknown.",
  "embed_type": "'video' | 'document'",
  "narration": "A brief explanation of what the resource is and why it's useful."
}
\`\`\`

**type: "quiz"**
\`\`\`json
{
  "question": "The question text.",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct_answer": "The 0-based index of the correct option.",
  "explanation": "A clear explanation for why the correct answer is right.",
  "narration": "Optional narration for the quiz."
}
\`\`\`

**type: "flashcard"**
\`\`\`json
{
  "cards": [
    {"front": "Term or question", "back": "Definition or answer"}
  ],
  "narration": "Optional narration for the flashcard set."
}
\`\`\`

**type: "fill_blanks"**
\`\`\`json
{
  "instruction": "Instructions for the exercise.",
  "text_with_blanks": "Text containing one or more _____ placeholders.",
  "blanks": [
    {"position": "The 0-based index of the blank.", "correct_answers": ["An array of acceptable answers."]}
  ],
  "narration": "Optional narration for the exercise."
}
\`\`\`

**type: "matching"**
\`\`\`json
{
  "instruction": "Instructions for the matching exercise.",
  "pairs": [
    {"left": "Item to match", "right": "Corresponding match"}
  ],
  "narration": "Optional narration for the exercise."
}
\`\`\`
</schema>

Now, process the following document and generate the JSON output.
`;
