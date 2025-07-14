export interface LearnerProfile {
  role: "Sales Rep" | "Account Manager" | "BDR/SDR" | "Sales Engineer" | "Customer Success";
  industry_focus: string;
  experience_level: "Junior" | "Mid-level" | "Senior";
  historical_performance: {
    avg_core_scores: [number, number, number, number]; // [product, communication, discovery, objection]
    improvement_areas: string[];
  };
}

export interface ScenarioContext {
  call_type:
    | "Cold Call"
    | "Discovery Call"
    | "Follow-up Call"
    | "Demo Call"
    | "Proposal/Pricing Call"
    | "Procurement/Legal"
    | "Customer Success Handover";
  persona: string[];
  objections: string[];
  specialty?: string;
  industry?: string;
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
  explanations: {
    product_knowledge: string;
    communication: string;
    discovery: string;
    objection_handling: string;
  };
}

export interface ReadinessCalculation {
  core_component: number;
  scenario_component: number;
  threshold_component: number;
  final_score: number;
  status: "Exceeds Ready" | "Ready" | "Mostly Ready" | "Developing" | "Needs Work";
  confidence_level: "High" | "Medium" | "Low";
}
