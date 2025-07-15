import { NextRequest, NextResponse } from "next/server";
import { FeedbackAnalyzer } from "~/lib/feedback-analyzer";
import { LearningOutcomesGenerator } from "~/lib/learning-outcomes-generator";
import { LearnerProfile } from "~/types/learning-outcomes";
import { ScenarioDetail } from "~/types/scenario";

export async function POST(request: NextRequest) {
  try {
    const { transcript, learner_profile, scenario_context } = await request.json();

    if (!transcript || !learner_profile || !scenario_context) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate learning outcomes
    const generator = new LearningOutcomesGenerator();
    const learningOutcomes = await generator.generateLearningOutcomes(
      learner_profile as LearnerProfile,
      scenario_context as ScenarioDetail
    );

    // Analyze feedback
    const analyzer = new FeedbackAnalyzer();
    const feedback = await analyzer.analyzeFeedback(transcript, learningOutcomes);

    return NextResponse.json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    console.error("Error completing session:", error);
    return NextResponse.json({ error: "Failed to complete session" }, { status: 500 });
  }
}
