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
    As an expert sales coach, analyze the provided sales roleplay transcript. Your task is to score my (the learner's) performance on four core competencies based on the provided success criteria.

    **Transcript:**
    The full conversation between me (I, the learner) and a potential client.
    \`\`\`
    ${transcript}
    \`\`\`

    **Core Competencies and Success Criteria:**
    \`\`\`json
    ${JSON.stringify(learningOutcomes.layer_1_core, null, 2)}
    \`\`\`

    **Instructions:**
    1.  Carefully read the entire transcript.
    2.  Your evaluation must be based **exclusively** on the dialogue from "I" (the learner). Do not evaluate the client's speech.
    3.  For each of the four core competencies (product_knowledge, communication, discovery, objection_handling), evaluate my performance against its specific success criteria.
    4.  Assign a score from 0 (did not demonstrate) to 100 (perfectly demonstrated) for each competency. Base your scores strictly on evidence from my dialogue in the transcript.
    5.  If I have not spoken or provided enough dialogue to demonstrate a competency, assign a score of 0 for that competency.
    6.  Provide your output as a single, clean JSON object. Do not include any introductory text, explanations, or markdown formatting.

    **Required JSON Output Format:**
    {
      "product_knowledge": <score>,
      "communication": <score>,
      "discovery": <score>,
      "objection_handling": <score>
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
    const scenarioKeys = Object.keys(learningOutcomes.layer_2_scenario);
    const jsonOutputFormat = scenarioKeys.reduce(
      (acc, key) => {
        acc[key] = `<score_for_${key}>`;
        return acc;
      },
      {} as Record<string, string>
    );

    const prompt = `
    As an expert sales coach, analyze the provided sales roleplay transcript. Your task is to score the seller's performance on scenario-specific outcomes based on the provided success criteria.

    **Transcript:**
    \`\`\`
    ${transcript}
    \`\`\`

    **Scenario Outcomes and Success Criteria:**
    \`\`\`json
    ${JSON.stringify(learningOutcomes.layer_2_scenario, null, 2)}
    \`\`\`

    **Instructions:**
    1.  Carefully read the entire transcript.
    2.  For each scenario outcome, evaluate the seller's performance against its specific success criteria.
    3.  Assign a score from 0 (did not demonstrate) to 100 (perfectly demonstrated) for each outcome. Base your scores strictly on evidence from the transcript.
    4.  Provide your output as a single, clean JSON object. The keys must be the exact outcome names from the "Scenario Outcomes" section. Do not include any introductory text, explanations, or markdown formatting.

    **Required JSON Output Format:**
    \`\`\`json
    ${JSON.stringify(jsonOutputFormat, null, 2)}
    \`\`\`
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
    As an expert coach, your task is to generate a detailed performance breakdown for the learner based on a roleplay transcript.

    **Context:**
    1.  **Transcript:** The full conversation between I (the learner) and a potential client.
      \`\`\`
      ${transcript}
      \`\`\`
    2.  **Performance Scores:** Pre-calculated scores for each core competency.
      \`\`\`json
      ${JSON.stringify(performanceScores, null, 2)}
      \`\`\`
    3.  **Success Criteria (Learning Outcomes):** The specific behaviors and skills being evaluated for each competency.
      \`\`\`json
      ${JSON.stringify(learningOutcomes.layer_1_core, null, 2)}
      \`\`\`

    **Instructions:**
    1.  Your feedback must be based **exclusively** on the dialogue from "I" (the learner). Do not evaluate the client's speech.
    2.  For each of the four core competencies (Product Knowledge, Communication, Discovery, Objection Handling), provide a concise, actionable feedback summary.
    3.  Your feedback must be directly supported by evidence from my (the learner's) dialogue in the transcript. Quote or reference specific phrases or moments.
    4.  If I have not spoken or there is no dialogue from me to evaluate, the feedback for that competency should state that there was no opportunity to demonstrate the skill. For example: "There was no dialogue from the learner to assess this skill."
    5.  For each competency, identify both what I did well and what I could improve, referencing the success criteria. If there's nothing to evaluate, state it clearly.
    6.  The 'trend' field is for future use. Set its value to "N/A".
    7.  The 'score' for each category must match the score provided in the "Performance Scores" context.
    8.  Ensure your output is a single, clean JSON object with no extra text or markdown.

    **Required JSON Output Format:**
    {
      "performance_breakdown": [
      {
      "category": "Product Knowledge",
      "score": ${performanceScores.product_knowledge},
      "trend": "N/A",
      "feedback": "Provide specific, evidence-based feedback here based *only* on the learner's dialogue. If the learner did not speak, state that no assessment could be made."
      },
      {
      "category": "Communication",
      "score": ${performanceScores.communication},
      "trend": "N/A",
      "feedback": "..."
      },
      {
      "category": "Discovery",
      "score": ${performanceScores.discovery},
      "trend": "N/A",
      "feedback": "..."
      },
      {
      "category": "Objection Handling",
      "score": ${performanceScores.objection_handling},
      "trend": "N/A",
      "feedback": "..."
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
    As an expert coach, your task is to identify the most effective "winning talking points" from a roleplay transcript.

    **Context:**
    1.  **Transcript:** The full conversation between I (the learner) and a potential client.
      \`\`\`
      ${transcript}
      \`\`\`
    2.  **Success Criteria (Learning Outcomes):** The specific behaviors and skills being evaluated. A "winning talking point" is a moment where I effectively demonstrated one of these criteria.
      \`\`\`json
      ${JSON.stringify(learningOutcomes.session_focus, null, 2)}
      \`\`\`

    **Instructions:**
    1.  Your analysis must be based **exclusively** on the dialogue from "I" (the learner). Do not evaluate the client's speech.
    2.  Carefully analyze the transcript to find 2-3 specific moments where I (the learner) said something particularly effective.
    3.  These moments must directly align with the provided Success Criteria.
    4.  For each point, you MUST extract the exact, verbatim quote from my dialogue in the transcript. Do not paraphrase or invent quotes. The 'point' field must be a direct copy of my words.
    5.  If I have not spoken or there is no dialogue from me to evaluate, you must return an empty array for "winning_talking_points". Do not analyze the client's dialogue.
    6.  Explain the context of the conversation at that moment.
    7.  Explain *why* the talking point was effective, linking it back to the Success Criteria.
    8.  Provide your output as a single, clean JSON object. Do not include any introductory text, explanations, or markdown formatting.

    **Required JSON Output Format:**
    {
      "winning_talking_points": [
      {
      "point": "The exact, verbatim quote from me that was effective. This must be copied directly from the transcript.",
      "context": "A brief description of the conversational situation (e.g., 'When the other party raised a concern about pricing...').",
      "why_effective": "A clear explanation of why this was a strong move, referencing the relevant success criterion (e.g., 'This effectively handled the objection by reframing the cost as a long-term investment, demonstrating the 'Value Proposition' skill.')."
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
    As an expert coach, your task is to synthesize the results of a roleplay analysis into a single, actionable key insight. You must identify my main strength and my single biggest opportunity for improvement based *only* on my dialogue.

    **Context:**
    1.  **Transcript:** The full conversation between I (the learner) and a potential client.
      \`\`\`
      ${transcript}
      \`\`\`
    2.  **Performance Scores:** Pre-calculated scores for each core competency. The lowest score indicates the biggest weakness.
      \`\`\`json
      ${JSON.stringify(performanceScores, null, 2)}
      \`\`\`
    3.  **Success Criteria (Learning Outcomes):** The specific behaviors and skills being evaluated.
      \`\`\`json
      ${JSON.stringify(learningOutcomes.session_focus, null, 2)}
      \`\`\`

    **Instructions:**
    1.  Your analysis must be based **exclusively** on the dialogue from "I" (the learner). Do not evaluate the client's speech.
    2.  If I have not spoken or there is no dialogue from me to evaluate, all fields in your response must state that no assessment could be made due to lack of learner input.
    3.  **Primary Finding:** Identify the competency with the highest score. Write a concise statement about what I did well in this area, referencing a specific example from my dialogue in the transcript.
    4.  **Improvement Area:** Identify the competency with the lowest score. Describe this as the single most important area for improvement. Provide a constructive, actionable suggestion, referencing a moment in the transcript where I could have applied this skill differently.
    5.  **Next Session Focus:** Based on the "Improvement Area," recommend a specific skill or topic to focus on in the next coaching session. This should be a direct and practical recommendation.
    6.  Provide your output as a single, clean JSON object. Do not include any introductory text, explanations, or markdown formatting.

    **Required JSON Output Format:**
    {
      "primary_finding": "A concise summary of my top strength with a supporting example from my dialogue. If I did not speak, state that no assessment could be made.",
      "improvement_area": "The single most critical area for improvement, explained with a constructive example from my dialogue. If I did not speak, state that no assessment could be made.",
      "next_session_focus": "A specific, forward-looking recommendation. If I did not speak, state that no assessment could be made."
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
