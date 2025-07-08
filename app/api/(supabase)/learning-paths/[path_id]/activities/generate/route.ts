import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { systemPrompt, userPrompt } from "~/utils/prompt";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path_id: string }> }
) {
  try {
    const { document_url, system_prompt, user_prompt } = await request.json();

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
          content: system_prompt || systemPrompt,
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
              text: user_prompt || userPrompt,
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
      data: JSON.parse(generatedContent).activities || [],
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
