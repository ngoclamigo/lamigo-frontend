import { EvaluationResult, Transcription } from "@/types/evaluation";
import { Persona, ScenarioDetail } from "@/types/scenario";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  // Read the request body once at the beginning
  const {
    persona,
    scenarioDetail,
    transcriptions,
  }: {
    persona: Persona;
    scenarioDetail: ScenarioDetail;
    transcriptions: Transcription[];
  } = await request.json();

  try {
    // Format transcriptions for analysis
    const conversationHistory = transcriptions
      .sort((a, b) => a.startTime - b.startTime)
      .map((t) => `${t.role === "assistant" ? "PERSONA" : "SALES_REP"}: ${t.text}`)
      .join("\n");

    const prompt = `
You are an expert sales coach analyzing a practice sales conversation. Based on the conversation transcript, persona, and scenario, provide a comprehensive evaluation.

PERSONA DETAILS:
- Name: ${persona.name}
- Role: ${persona.role}
- Company Size: ${persona.company_size}
- Pain Points: ${persona.pain_points.join(", ")}
- Budget Range: ${persona.budget_range}
- Decision Style: ${persona.decision_style}
- Objections: ${persona.objections.join(", ")}
- Personality Traits: ${persona.personality_traits.join(", ")}
- Background: ${persona.background}
- Communication Style: ${persona.communication_style}
- Current Challenge: ${persona.current_challenge}
- Emotional State: ${persona.emotional_state}

SCENARIO:
- Name: ${scenarioDetail.name}
- Description: ${scenarioDetail.description}
- Customer Mood: ${scenarioDetail.customer_mood}
- Context: ${scenarioDetail.context}
- Urgency: ${scenarioDetail.urgency}
- Objected: ${scenarioDetail.objectives.join(", ")}

CONVERSATION TRANSCRIPT:
${conversationHistory}

Please provide a detailed evaluation in the following JSON format:
{
  "userData": {
    "name": "Sales rep's name from conversation or 'Sales Rep'",
    "company": "Company being pitched to",
    "meetingTime": "Estimated meeting duration",
    "readinessScore": 85,
    "improvement": "Brief improvement suggestion"
  },
  "talkingPoints": [
    {
      "title": "Key talking point title",
      "description": "What the sales rep said effectively"
    }
  ],
  "performanceMetrics": [
    {
      "category": "Communication",
      "score": 85,
      "feedback": "Specific feedback on performance",
      "insight": "Actionable insight for improvement"
    }
  ],
  "sessionData": {
    "duration": "Estimated duration",
    "practicePartner": "${persona.name}",
    "scenario": "${scenarioDetail.name}",
    "keyInsight": "Most important learning from this session",
    "callStatus": "Assessment of readiness for real call"
  }
}

Evaluate these key areas:
1. Communication (clarity, confidence, pace)
2. Objection Handling (how well they addressed concerns)
3. Value Proposition (how clearly they communicated benefits)
4. Relationship Building (rapport, empathy, connection)
5. Closing Technique (asking for next steps, commitment)

Provide scores out of 100 and specific, actionable feedback. Be encouraging but honest about areas for improvement.
`;
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert sales coach providing detailed performance evaluations. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_object",
      },
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error("No response from OpenAI");
    }

    // Parse the JSON response
    const evaluation: EvaluationResult = JSON.parse(responseContent);

    // Add color coding for performance metrics based on scores
    evaluation.performanceMetrics = evaluation.performanceMetrics.map((metric) => ({
      ...metric,
      color: (metric.score >= 80 ? "emerald" : metric.score >= 60 ? "yellow" : "red") as
        | "emerald"
        | "yellow"
        | "red",
    }));

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error("Error generating evaluation:", error);

    // Return a fallback evaluation using the data we already parsed
    const fallbackEvaluation: EvaluationResult = {
      userData: {
        name: "Sales Rep",
        company: persona.name.split(" ").pop() || "Target Company",
        meetingTime: "Practice Session",
        readinessScore: 75,
        improvement: "Continue practicing",
      },
      talkingPoints: [
        {
          title: "Product Knowledge",
          description: "Demonstrated good understanding of the solution",
        },
        {
          title: "Customer Needs",
          description: "Identified key pain points effectively",
        },
      ],
      performanceMetrics: [
        {
          category: "Communication",
          score: 75,
          feedback: "Good overall communication with room for improvement",
          insight: "Focus on speaking more confidently and clearly",
          color: "yellow",
        },
        {
          category: "Objection Handling",
          score: 70,
          feedback: "Handled some objections well",
          insight: "Practice addressing concerns more directly",
          color: "yellow",
        },
      ],
      sessionData: {
        duration: "15 minutes",
        practicePartner: persona.name,
        scenario: scenarioDetail.name,
        keyInsight: "Practice sessions help build confidence and improve sales techniques",
        callStatus: "Good progress! Keep practicing to improve your skills.",
      },
    };

    return NextResponse.json(fallbackEvaluation, { status: 200 });
  }
}
