import { NextRequest, NextResponse } from "next/server";
import { FeedbackEngine } from "~/lib/feedback-engine";
import { LearningOutcomesEngine } from "~/lib/learning-outcomes-engine";
import { LearnerProfile, ScenarioContext } from "~/types/learning-outcomes";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      transcript,
      learner_profile,
      scenario_context,
    }: {
      transcript: string;
      learner_profile: LearnerProfile;
      scenario_context: ScenarioContext;
    } = body;

    if (!transcript || !learner_profile || !scenario_context) {
      return NextResponse.json(
        { error: "Missing required fields: transcript, learner_profile, and scenario_context" },
        { status: 400 }
      );
    }

    // Generate learning outcomes
    const learningOutcomes = await LearningOutcomesEngine.generateLearningOutcomes(
      learner_profile,
      scenario_context
    );

    // Analyze performance
    const performanceScores = await FeedbackEngine.analyzeTranscript(
      transcript,
      learningOutcomes,
      scenario_context
    );

    // Mock scenario performance
    const scenarioPerformance = {
      scenario_specific_1: 85,
      scenario_specific_2: 78,
    };

    // Calculate readiness
    const readinessCalculation = FeedbackEngine.calculateReadinessScore(
      performanceScores,
      learningOutcomes.layer_2_scenario,
      scenarioPerformance
    );

    // Generate UI content
    const [winningTalkingPoints, keyInsight] = await Promise.all([
      FeedbackEngine.generateWinningTalkingPoints(transcript, scenario_context, performanceScores),
      FeedbackEngine.generateKeyInsight(
        transcript,
        learningOutcomes,
        performanceScores,
        readinessCalculation
      ),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        session_id: `sess_${Date.now()}`,
        learning_outcomes: learningOutcomes,
        performance_scores: performanceScores,
        scenario_performance: scenarioPerformance,
        readiness_calculation: readinessCalculation,
        ui_sections: {
          performance_breakdown: [
            {
              category: "Product Knowledge & Application",
              score: performanceScores.product_knowledge,
              trend: "+3 vs last session",
              feedback: performanceScores.explanations.product_knowledge,
            },
            {
              category: "Communication & Confidence",
              score: performanceScores.communication,
              trend: "+1 vs last session",
              feedback: performanceScores.explanations.communication,
            },
            {
              category: "Discovery & Active Listening",
              score: performanceScores.discovery,
              trend: "-2 vs last session",
              feedback: performanceScores.explanations.discovery,
            },
            {
              category: "Objection Handling & Follow-up",
              score: performanceScores.objection_handling,
              trend: "+5 vs last session",
              feedback: performanceScores.explanations.objection_handling,
            },
          ],
          winning_talking_points: winningTalkingPoints,
          key_insight: keyInsight,
        },
        generated_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error in complete feedback analysis:", error);
    return NextResponse.json({ error: "Failed to complete feedback analysis" }, { status: 500 });
  }
}
