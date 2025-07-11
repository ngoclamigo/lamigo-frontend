export type Persona = {
  name: string;
  job_title: string;
  company: string;
  industry: string;
  location: string;
};

export type IntentType =
  | "education" // Rep positions as advisor, builds trust
  | "re_qualification" // Revive stalled or aged opportunities
  | "inbound" // Prospect requested info/demo
  | "urgent_response" // Prospect unhappy or crisis-triggered
  | "competitive_deal"; // Buyer comparing multiple vendors

export type PersonaArchetype =
  | "analytical" // Data-driven: ROI, risk mitigation
  | "strategic" // Visionary: growth, market edge
  | "risk_averse" // Stability, governance, compliance
  | "skeptical" // Cautious, needs proof or validation
  | "committee_buyer" // Multi-stakeholder alignment needed
  | "regional"; // Regional preferences or regulations

export type ObjectionType =
  | "too_expensive" // Value vs price questioned
  | "already_using_tool" // Locked in with another vendor
  | "implementation_risk" // Concerned about friction or risk
  | "not_a_priority"; // Competing priorities or low urgency

export type SpecialtyType =
  | "reverse_discovery" // Prospect drives questions; rep defends
  | "board_pitch_practice" // Practice selling to exec/board
  | "multi_stakeholder_call" // Multiple personas with differing goals
  | "vc_investor_style" // Financial grilling on ROI
  | "time_compressed" // Short window (e.g., 5 minutes)
  | "difficult_prospect"; // Rude, distracted, or impatient buyer

export type LeadStageCategory =
  | "top_of_funnel" // Cold call: pique interest & book meeting
  | "mid_funnel" // Discovery/demo/follow-up: qualify and deepen fit
  | "bottom_funnel" // Proposal, pricing, procurement
  | "post_sale"; // Handoff to customer success

export type CallType =
  | "cold_call"
  | "discovery_call"
  | "follow_up_call"
  | "demo_call"
  | "proposal_pricing_call"
  | "procurement_legal_negotiation"
  | "handover_to_customer_success";

export type ScenarioDetail = {
  // name: string;
  // description: string;
  type: "call_scenario";
  category: LeadStageCategory;
  call_type: CallType;
  intent: IntentType;
  persona: PersonaArchetype[];
  objections: ObjectionType[];
  specialty: SpecialtyType;
  time_limit: string;
  roleplay_tips: string[];
};

export type ScenarioAgent = {
  id: string;
  platform: string;
  platform_agent_id: string;
};

export type Scenario = {
  id: string;
  persona: Persona;
  scenarios: ScenarioDetail;
  agents: ScenarioAgent[];
  created_at: string;
};
