import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { text, voice = "ash" } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Create audio using OpenAI's TTS API
    const audioResponse = await openai.audio.speech.create({
      model: "tts-1", // Using the fastest model
      voice: voice,
      input: text,
      instructions: "Speak in a cheerful and positive tone.",
      response_format: "wav", // Using WAV for better streaming with playAudio
    });

    // Get the array buffer from the response
    const buffer = await audioResponse.arrayBuffer();

    // Return the audio data with appropriate headers
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "audio/wav",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("TTS API error:", error);
    return NextResponse.json({ error: "Failed to generate speech" }, { status: 500 });
  }
}
