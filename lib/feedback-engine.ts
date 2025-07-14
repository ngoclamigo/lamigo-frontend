import {
  PerformanceScores,
  ReadinessCalculation,
  ScenarioOutcome,
} from "~/types/learning-outcomes";
import { openai } from "./openai.sdk";

export class FeedbackEngine {
  static async analyzeTranscript(
    transcript: string,
    learningOutcomes: any,
    scenarioContext: any
  ): Promise<PerformanceScores> {
    const prompt = `
    Analyze this sales call transcript and score the performance across these core competencies:

    Transcript:
    ${transcript}

    Scenario Context:
    ${JSON.stringify(scenarioContext)}

    Learning Outcomes:
    ${JSON.stringify(learningOutcomes)}

    Score each competency from 0-100 based on the success criteria:
    1. Product Knowledge & Application
    2. Communication & Confidence
    3. Discovery & Active Listening
    4. Objection Handling & Follow-up

    Return a JSON object with scores and brief explanations:
    {
      "product_knowledge": 85,
      "communication": 78,
      "discovery": 82,
      "objection_handling": 71,
      "explanations": {
        "product_knowledge": "Strong feature knowledge, good use case mapping",
        "communication": "Professional tone, minor hesitations",
        "discovery": "Good questioning, could dig deeper on pain points",
        "objection_handling": "Addressed concerns but didn't fully overcome price objection"
      }
    }
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an expert sales performance analyst. Analyze call transcripts objectively and provide specific, actionable feedback with numerical scores.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 800,
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");

      const scores: PerformanceScores = {
        product_knowledge: result.product_knowledge || 0,
        communication: result.communication || 0,
        discovery: result.discovery || 0,
        objection_handling: result.objection_handling || 0,
        core_average: 0,
        explanations: result.explanations || {},
      };

      scores.core_average =
        (scores.product_knowledge +
          scores.communication +
          scores.discovery +
          scores.objection_handling) /
        4;

      return scores;
    } catch (error) {
      console.error("Error analyzing transcript:", error);
      throw new Error("Failed to analyze transcript");
    }
  }

  static calculateReadinessScore(
    coreScores: PerformanceScores,
    scenarioOutcomes: ScenarioOutcome[],
    scenarioPerformance: Record<string, number>
  ): ReadinessCalculation {
    // Core Performance (40% weight)
    const coreComponent = coreScores.core_average * 0.4;

    // Scenario Success (30% weight)
    const scenarioValues = Object.values(scenarioPerformance);
    const scenarioAverage =
      scenarioValues.length > 0
        ? scenarioValues.reduce((a, b) => a + b, 0) / scenarioValues.length
        : coreScores.core_average;
    const scenarioComponent = scenarioAverage * 0.3;

    // Critical Thresholds (30% weight)
    const allScores = [
      coreScores.product_knowledge,
      coreScores.communication,
      coreScores.discovery,
      coreScores.objection_handling,
    ];
    const minScore = Math.min(...allScores);
    const thresholdComponent = minScore < 60 ? minScore * 0.3 : coreScores.core_average * 0.3;

    const finalScore = coreComponent + scenarioComponent + thresholdComponent;

    // Determine status
    let status: ReadinessCalculation["status"];
    let confidence: ReadinessCalculation["confidence_level"];

    if (finalScore >= 90) {
      status = "Exceeds Ready";
      confidence = "High";
    } else if (finalScore >= 80) {
      status = "Ready";
      confidence = "High";
    } else if (finalScore >= 70) {
      status = "Mostly Ready";
      confidence = "Medium";
    } else if (finalScore >= 60) {
      status = "Developing";
      confidence = "Medium";
    } else {
      status = "Needs Work";
      confidence = "Low";
    }

    return {
      core_component: coreComponent,
      scenario_component: scenarioComponent,
      threshold_component: thresholdComponent,
      final_score: finalScore,
      status,
      confidence_level: confidence,
    };
  }

  static async generateWinningTalkingPoints(
    transcript: string,
    scenarioContext: any,
    performanceScores: PerformanceScores
  ): Promise<Array<{ point: string; context: string; why_effective: string }>> {
    const prompt = `
    Based on this sales call transcript and performance, identify 2-3 winning talking points that were most effective:

    Transcript:
    ${transcript}

    Scenario Context:
    ${JSON.stringify(scenarioContext)}

    Performance Scores:
    ${JSON.stringify(performanceScores)}

    Return a JSON array of the most effective talking points:
    {
      winning_talking_points: [
        {
          "point": "Specific talking point or approach used",
          "context": "When/how it was used in the conversation",
          "why_effective": "Why this worked well for this scenario"
        }
      ]
    }
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a sales performance analyst. Identify the most effective talking points from sales call transcripts.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 600,
        response_format: { type: "json_object" },
      });

      return JSON.parse(response.choices[0].message.content || "{}").winning_talking_points || [];
    } catch (error) {
      console.error("Error generating talking points:", error);
      return [];
    }
  }

  static async generateKeyInsight(
    transcript: string,
    learningOutcomes: any,
    performanceScores: PerformanceScores,
    readinessScore: ReadinessCalculation
  ): Promise<{ primary_finding: string; improvement_area: string; next_session_focus: string }> {
    const prompt = `
    Generate a key insight for this sales practice session:

    Transcript:
    ${transcript}

    Learning Outcomes:
    ${JSON.stringify(learningOutcomes)}

    Performance Scores:
    ${JSON.stringify(performanceScores)}

    Readiness Score:
    ${JSON.stringify(readinessScore)}

    Return a JSON object with actionable insights:
    {
      "primary_finding": "Main strength or breakthrough observed",
      "improvement_area": "Specific area needing attention",
      "next_session_focus": "Recommended focus for next practice session"
    }
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a sales coach providing personalized insights. Focus on actionable, specific feedback.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 400,
        response_format: { type: "json_object" },
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error("Error generating key insight:", error);
      return {
        primary_finding: "Performance analysis completed",
        improvement_area: "Continue practicing core skills",
        next_session_focus: "Reinforce fundamentals",
      };
    }
  }
}
