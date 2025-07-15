export interface LearnerProfile {
  role: 'Sales Rep' | 'Account Manager' | 'BDR/SDR' | 'Sales Engineer' | 'Customer Success';
  industry_focus: string;
  experience_level: 'Junior' | 'Mid-level' | 'Senior';
  historical_performance: {
    avg_core_scores: [number, number, number, number];
    improvement_areas: string[];
  };
}

export interface CoreCompetency {
  competency: string;
  weight: number;
  success_criteria: string[];
}

export interface ScenarioOutcome {
  outcome: string;
  triggered_by: string;
  success_criteria: string[];
}

export interface RoleAmplifier {
  amplifier: string;
  role_relevance: string;
  weight_modifier: number;
  focus_areas: string[];
}

export interface LearningOutcomes {
  session_focus: string;
  layer_1_core: CoreCompetency[];
  layer_2_scenario: ScenarioOutcome[];
  layer_3_role_amplifiers: RoleAmplifier[];
}

export interface PerformanceScores {
  product_knowledge: number;
  communication: number;
  discovery: number;
  objection_handling: number;
  core_average: number;
}

export interface ReadinessCalculation {
  core_component: number;
  scenario_component: number;
  threshold_component: number;
  final_score: number;
  status: 'Exceeds Ready' | 'Ready' | 'Mostly Ready' | 'Developing' | 'Needs Work';
  confidence_level: 'High' | 'Medium' | 'Low';
}

export interface FeedbackResponse {
  performance_scores: PerformanceScores;
  scenario_performance: Record<string, number>;
  readiness_calculation: ReadinessCalculation;
  ui_sections: {
    performance_breakdown: Array<{
      category: string;
      score: number;
      trend: string;
      feedback: string;
    }>;
    winning_talking_points: Array<{
      point: string;
      context: string;
      why_effective: string;
    }>;
    key_insight: {
      primary_finding: string;
      improvement_area: string;
      next_session_focus: string;
    };
  };
}