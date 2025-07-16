import { OpenAI } from "openai";
import {
  FeedbackResponse,
  LearningOutcomes,
  PerformanceScores,
  ReadinessCalculation,
} from "~/types/learning-outcomes";

export class FeedbackAnalyzer {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async analyzeFeedback(
    transcript: string,
    learningOutcomes: LearningOutcomes
  ): Promise<FeedbackResponse> {
    const performanceScores = await this.analyzePerformance(transcript, learningOutcomes);
    const scenarioPerformance = await this.analyzeScenarioPerformance(transcript, learningOutcomes);
    const readinessCalculation = this.calculateReadiness(performanceScores, scenarioPerformance);
    const uiSections = await this.generateUISections(
      transcript,
      learningOutcomes,
      performanceScores
    );

    return {
      performance_scores: performanceScores,
      scenario_performance: scenarioPerformance,
      readiness_calculation: readinessCalculation,
      ui_sections: uiSections,
    };
  }

  private async analyzePerformance(
    transcript: string,
    learningOutcomes: LearningOutcomes
  ): Promise<PerformanceScores> {
    const prompt = `
    Analyze the following roleplay transcript and score the performance on core competencies.

    Transcript:
    ${transcript}

    Learning Outcomes Context:
    ${JSON.stringify(learningOutcomes.layer_1_core)}

    Score each competency from 0-100 based on the success criteria:
    - Product Knowledge
    - Communication
    - Discovery
    - Objection Handling

    Return ONLY a JSON object with the scores:
    {
      "product_knowledge": 85,
      "communication": 78,
      "discovery": 72,
      "objection_handling": 69
    }
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.3,
      response_format: {
        type: "json_object",
      },
    });

    const content =
      response.choices[0]?.message?.content?.trim() ||
      `{
      "product_knowledge": 0,
      "communication": 0,
      "discovery": 0,
      "objection_handling": 0
    }`;
    const scores = JSON.parse(content);

    const coreAverage =
      (scores.product_knowledge +
        scores.communication +
        scores.discovery +
        scores.objection_handling) /
      4;

    return {
      ...scores,
      core_average: coreAverage,
    };
  }

  private async analyzeScenarioPerformance(
    transcript: string,
    learningOutcomes: LearningOutcomes
  ): Promise<Record<string, number>> {
    const prompt = `
    Analyze the following roleplay transcript for scenario-specific performance.

    Transcript:
    ${transcript}

    Scenario Outcomes to Evaluate:
    ${JSON.stringify(learningOutcomes.layer_2_scenario)}

    Score each scenario outcome from 0-100 based on how well the success criteria were met.
    Return ONLY a JSON object with outcome names as keys and scores as values.
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.3,
      response_format: {
        type: "json_object",
      },
    });

    const content = response.choices[0]?.message?.content?.trim() || "{}";
    return JSON.parse(content);
  }

  private calculateReadiness(
    performanceScores: PerformanceScores,
    scenarioPerformance: Record<string, number>
  ): ReadinessCalculation {
    const coreComponent = performanceScores.core_average * 0.4;

    const scenarioValues = Object.values(scenarioPerformance);
    const scenarioAverage =
      scenarioValues.length > 0
        ? scenarioValues.reduce((a, b) => a + b) / scenarioValues.length
        : 0;
    const scenarioComponent = scenarioAverage * 0.3;

    const allScores = [
      performanceScores.product_knowledge,
      performanceScores.communication,
      performanceScores.discovery,
      performanceScores.objection_handling,
    ];
    const minScore = Math.min(...allScores);
    const thresholdComponent = minScore * 0.3;

    const finalScore = coreComponent + scenarioComponent + thresholdComponent;

    let status: ReadinessCalculation["status"];
    let confidenceLevel: ReadinessCalculation["confidence_level"];

    if (finalScore >= 90) {
      status = "Exceeds Ready";
      confidenceLevel = "High";
    } else if (finalScore >= 80) {
      status = "Ready";
      confidenceLevel = "High";
    } else if (finalScore >= 70) {
      status = "Mostly Ready";
      confidenceLevel = "Medium";
    } else if (finalScore >= 60) {
      status = "Developing";
      confidenceLevel = "Medium";
    } else {
      status = "Needs Work";
      confidenceLevel = "Low";
    }

    return {
      core_component: coreComponent,
      scenario_component: scenarioComponent,
      threshold_component: thresholdComponent,
      final_score: finalScore,
      status,
      confidence_level: confidenceLevel,
    };
  }

  private async generateUISections(
    transcript: string,
    learningOutcomes: LearningOutcomes,
    performanceScores: PerformanceScores
  ): Promise<FeedbackResponse["ui_sections"]> {
    const performanceBreakdown = await this.generatePerformanceBreakdown(
      transcript,
      learningOutcomes,
      performanceScores
    );
    const winningTalkingPoints = await this.generateWinningTalkingPoints(
      transcript,
      learningOutcomes
    );
    const keyInsight = await this.generateKeyInsight(
      transcript,
      learningOutcomes,
      performanceScores
    );

    return {
      performance_breakdown: performanceBreakdown,
      winning_talking_points: winningTalkingPoints,
      key_insight: keyInsight,
    };
  }

  private async generatePerformanceBreakdown(
    transcript: string,
    learningOutcomes: LearningOutcomes,
    performanceScores: PerformanceScores
  ): Promise<
    Array<{
      category: string;
      score: number;
      trend: string;
      feedback: string;
    }>
  > {
    const prompt = `
    Generate performance breakdown feedback for each core competency.

    Transcript:
    ${transcript}

    Scores:
    ${JSON.stringify(performanceScores)}

    Learning Outcomes:
    ${JSON.stringify(learningOutcomes.layer_1_core)}

    For each competency, provide specific feedback about what was done well.
    Return JSON array with format:
    {
      performance_breakdown: [
        {
          "category": "Product Knowledge",
          "score": 85,
          "trend": "+3 vs last session",
          "feedback": "Specific feedback about performance"
        }
      ]
    }
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.5,
      response_format: {
        type: "json_object",
      },
    });

    const content = response.choices[0]?.message?.content?.trim() || "{}";
    return JSON.parse(content)?.performance_breakdown || [];
  }

  private async generateWinningTalkingPoints(
    transcript: string,
    learningOutcomes: LearningOutcomes
  ): Promise<
    Array<{
      point: string;
      context: string;
      why_effective: string;
    }>
  > {
    const prompt = `
    Identify winning talking points from the roleplay conversation.

    Transcript:
    ${transcript}

    Learning Context:
    ${learningOutcomes.session_focus}

    Find 2-3 specific moments where the learner said something particularly effective.
    Return JSON array with format:
    {
      winning_talking_points: [
        {
          "point": "Specific phrase or approach used",
          "context": "When and why it was used",
          "why_effective": "Why this worked well"
        }
      ]
    }
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 400,
      temperature: 0.6,
      response_format: {
        type: "json_object",
      },
    });

    const content = response.choices[0]?.message?.content?.trim() || "{}";
    return JSON.parse(content)?.winning_talking_points || [];
  }

  private async generateKeyInsight(
    transcript: string,
    learningOutcomes: LearningOutcomes,
    performanceScores: PerformanceScores
  ): Promise<{
    primary_finding: string;
    improvement_area: string;
    next_session_focus: string;
  }> {
    const prompt = `
    Generate key insight and recommendations based on the roleplay performance.

    Transcript:
    ${transcript}

    Session Focus:
    ${learningOutcomes.session_focus}

    Performance Scores:
    ${JSON.stringify(performanceScores)}

    Provide:
    1. Primary finding: What they did best this session
    2. Improvement area: One specific area to work on
    3. Next session focus: What to practice next

    Return JSON object with format:
    {
      "primary_finding": "What they excelled at",
      "improvement_area": "One area to improve",
      "next_session_focus": "What to practice next"
    }
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.5,
      response_format: {
        type: "json_object",
      },
    });

    const content =
      response.choices[0]?.message?.content?.trim() ||
      `{
      "primary_finding": "No significant findings",
      "improvement_area": "No specific area identified",
      "next_session_focus": "No specific focus identified"
    }`;
    return JSON.parse(content);
  }
}
