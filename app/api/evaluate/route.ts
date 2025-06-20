import { NextResponse } from "next/server";
import { EvaluationService } from "@/lib/EvaluationService";
import { TranscriptionConverter } from "@/lib/TranscriptionConverter";
import { SalesScenario, CustomerPersona, ConversationScript } from "@/types/evaluation";

/**
 * Endpoint specifically for evaluating conversations in the new script format
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { scenario, persona, conversationScript, salespersonName } = body;

    // Validate required fields
    if (!scenario || !persona || !conversationScript) {
      return NextResponse.json(
        { error: "Scenario, persona, and conversationScript are required" },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured. Please set OPENAI_API_KEY in your environment variables." },
        { status: 500 }
      );
    }

    // Validate the conversation script format
    const validation = TranscriptionConverter.validateScript(conversationScript);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: "Invalid conversation script format",
          details: validation.errors
        },
        { status: 400 }
      );
    }

    // Convert conversation script to transcript format
    const transcripts = TranscriptionConverter.convertScriptToTranscript(conversationScript as ConversationScript[]);

    // Get conversation statistics
    const stats = TranscriptionConverter.getConversationStats(conversationScript as ConversationScript[]);
    const duration = TranscriptionConverter.calculateDuration(conversationScript as ConversationScript[]);

    // Generate evaluation using OpenAI
    const evaluation = await EvaluationService.generateEvaluation(
      scenario as SalesScenario,
      persona as CustomerPersona,
      transcripts,
      salespersonName || "Nam"
    );

    // Add conversation metadata to the response
    const response = {
      ...evaluation,
      conversationMetadata: {
        duration,
        messageCount: stats.totalMessages,
        userMessages: stats.userMessages,
        assistantMessages: stats.assistantMessages,
        averageMessageLength: stats.averageMessageLength,
        originalScriptLength: conversationScript.length,
        processedTranscriptLength: transcripts.length
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error evaluating conversation:", error);

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: "OpenAI API key is invalid or missing" },
          { status: 401 }
        );
      }
      if (error.message.includes('quota')) {
        return NextResponse.json(
          { error: "OpenAI API quota exceeded" },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for testing with sample conversation script
 */
export async function GET() {
  try {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured. Please set OPENAI_API_KEY in your environment variables." },
        { status: 500 }
      );
    }

    // Sample conversation script in the new format
    const sampleConversationScript: ConversationScript[] = [
      {
        id: "msg_001",
        text: "Hi Anne, thanks for taking the time today. I understand you're looking for better deal sourcing tools?",
        startTime: 0,
        endTime: 3000,
        final: true,
        language: "en",
        firstReceivedTime: Date.now() - 900000,
        lastReceivedTime: Date.now() - 897000,
        receivedAtMediaTimestamp: 0,
        receivedAt: Date.now() - 900000,
        role: "user"
      },
      {
        id: "msg_002",
        text: "Yes, we're really struggling with our current Bloomberg setup.",
        startTime: 3500,
        endTime: 6000,
        final: true,
        language: "en",
        firstReceivedTime: Date.now() - 870000,
        lastReceivedTime: Date.now() - 867000,
        receivedAtMediaTimestamp: 3500,
        receivedAt: Date.now() - 870000,
        role: "assistant"
      },
      {
        id: "msg_003",
        text: "Finding quality mid-market tech deals is becoming increasingly difficult.",
        startTime: 6200,
        endTime: 9500,
        final: true,
        language: "en",
        firstReceivedTime: Date.now() - 865000,
        lastReceivedTime: Date.now() - 862000,
        receivedAtMediaTimestamp: 6200,
        receivedAt: Date.now() - 865000,
        role: "assistant"
      },
      {
        id: "msg_004",
        text: "I completely understand that challenge. Our Capital IQ Pro solution has helped firms like KKR identify 3x more relevant mid-market opportunities.",
        startTime: 10000,
        endTime: 16000,
        final: true,
        language: "en",
        firstReceivedTime: Date.now() - 840000,
        lastReceivedTime: Date.now() - 834000,
        receivedAtMediaTimestamp: 10000,
        receivedAt: Date.now() - 840000,
        role: "user"
      },
      {
        id: "msg_005",
        text: "What's your current deal flow looking like?",
        startTime: 16500,
        endTime: 18500,
        final: true,
        language: "en",
        firstReceivedTime: Date.now() - 830000,
        lastReceivedTime: Date.now() - 828000,
        receivedAtMediaTimestamp: 16500,
        receivedAt: Date.now() - 830000,
        role: "user"
      },
      {
        id: "msg_006",
        text: "We're seeing deals, but the quality isn't there. Plus our due diligence process is taking too long.",
        startTime: 19000,
        endTime: 24000,
        final: true,
        language: "en",
        firstReceivedTime: Date.now() - 810000,
        lastReceivedTime: Date.now() - 805000,
        receivedAtMediaTimestamp: 19000,
        receivedAt: Date.now() - 810000,
        role: "assistant"
      },
      {
        id: "msg_007",
        text: "What kind of ROI are we talking about here?",
        startTime: 24500,
        endTime: 26500,
        final: true,
        language: "en",
        firstReceivedTime: Date.now() - 804000,
        lastReceivedTime: Date.now() - 802000,
        receivedAtMediaTimestamp: 24500,
        receivedAt: Date.now() - 804000,
        role: "assistant"
      },
      {
        id: "msg_008",
        text: "Great question. KKR reported saving 15 hours per week on initial screening alone, which translates to about 30% faster deal evaluation.",
        startTime: 27000,
        endTime: 35000,
        final: true,
        language: "en",
        firstReceivedTime: Date.now() - 780000,
        lastReceivedTime: Date.now() - 772000,
        receivedAtMediaTimestamp: 27000,
        receivedAt: Date.now() - 780000,
        role: "user"
      }
    ];

    const sampleScenario: SalesScenario = {
      name: "Technical Evaluation",
      description: "Customer's technical team is evaluating the solution for mid-market PE deal sourcing",
      customer_mood: "Detail-focused and skeptical but genuinely interested in solving real problems",
      objectives: [
        "Answer technical questions about data accuracy and integration",
        "Provide proof of concept for mid-market tech deals",
        "Address integration concerns with existing PE tools",
        "Demonstrate ROI potential for the investment team",
      ],
      context: "Vista Equity Partners exploring Capital IQ Pro for deal sourcing and portfolio monitoring",
      urgency: "Decision needed within 2 weeks for Q4 budget planning",
    };

    const samplePersona: CustomerPersona = {
      name: "Anne Wojcicki",
      role: "Managing Director, Private Equity",
      company_size: "Mid-market PE firm ($2-5B AUM)",
      industry: "Private Equity / Investment Management",
      pain_points: [
        "Finding quality mid-market tech deals in competitive market",
        "Limited portfolio company benchmarking tools",
        "Inefficient due diligence processes",
        "Lack of real-time market intelligence",
      ],
      budget_range: "$100K - $500K annually per seat",
      decision_style: "ROI-focused, data-driven, values efficiency",
      objections: [
        "Concerned about data accuracy and timeliness",
        "Integration complexity with existing investment tools",
        "Cost justification for entire investment team",
        "Learning curve for senior partners",
      ],
      personality_traits: [
        "Confident",
        "Analytical",
        "Efficiency-focused",
        "Tech-savvy",
      ],
      voice: "Confident, analytical tone with slight Australian accent awareness",
      background: "12 years in PE, former McKinsey consultant, tech-focused investments",
      communication_style: "ROI-focused, data-driven, values efficiency",
      current_challenge: "Finding quality mid-market tech deals in competitive market",
      specific_context: "Wants better portfolio company benchmarking tools",
      time_pressure: "Has another meeting in 20 minutes",
      emotional_state: "Pressed for time, genuinely frustrated with current tools but curious if this could help",
      competitors_used: ["Bloomberg Terminal", "FactSet"],
    };

    // Convert and evaluate
    const validation = TranscriptionConverter.validateScript(sampleConversationScript);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: "Sample script validation failed", details: validation.errors },
        { status: 500 }
      );
    }

    const transcripts = TranscriptionConverter.convertScriptToTranscript(sampleConversationScript);
    const stats = TranscriptionConverter.getConversationStats(sampleConversationScript);
    const duration = TranscriptionConverter.calculateDuration(sampleConversationScript);

    const evaluation = await EvaluationService.generateEvaluation(
      sampleScenario,
      samplePersona,
      transcripts,
      "Nam"
    );

    const response = {
      ...evaluation,
      conversationMetadata: {
        duration,
        messageCount: stats.totalMessages,
        userMessages: stats.userMessages,
        assistantMessages: stats.assistantMessages,
        averageMessageLength: stats.averageMessageLength,
        originalScriptLength: sampleConversationScript.length,
        processedTranscriptLength: transcripts.length
      },
      sampleData: {
        originalScript: sampleConversationScript,
        processedTranscripts: transcripts,
        stats
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error generating sample conversation evaluation:", error);

    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: "OpenAI API key is invalid or missing" },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to generate sample conversation evaluation" },
      { status: 500 }
    );
  }
}
