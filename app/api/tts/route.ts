import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const { text, voice = "alloy" } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Call OpenAI API for text-to-speech
    const mp3 = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: voice, // Options: 'alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'
      input: text,
      instructions: "Speak in a cheerful and positive tone.",
    });

    // Convert the response to an ArrayBuffer
    const buffer = await mp3.arrayBuffer();

    // Return the audio as a response
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json({ error: "Failed to generate speech" }, { status: 500 });
  }
}
