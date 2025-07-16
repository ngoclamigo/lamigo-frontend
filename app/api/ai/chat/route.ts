import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI();

export async function POST(request: Request) {
  const { topic, message } = await request.json();

  try {
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      instructions: topic
        ? `You are an AI assistant specialized in providing information and answering questions about ${topic}. Your responses should be informative, concise, and relevant to the user's query. No yapping, one paragraph. If you don't know the answer, it's okay to say so.`
        : "You are an AI assistant specialized in providing information and answering questions about various topics. Your responses should be informative, concise, and relevant to the user's query. No yapping, one paragraph. If you don't know the answer, it's okay to say so.",
      input: message,
    });

    return NextResponse.json(response.output_text);
  } catch (error) {
    console.error("Error generating chat completion:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
