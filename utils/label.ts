import {
  CallType,
  IntentType,
  LeadStageCategory,
  ObjectionType,
  PersonaArchetype,
  SpecialtyType,
} from "~/types/scenario";

const intentTypeLabels: Record<IntentType, string> = {
  education: "Education",
  re_qualification: "Re-qualification",
  inbound: "Inbound",
  urgent_response: "Urgent Response",
  competitive_deal: "Competitive Deal",
};

const personaArchetypeLabels: Record<PersonaArchetype, string> = {
  analytical: "Analytical",
  strategic: "Strategic",
  risk_averse: "Risk Averse",
  skeptical: "Skeptical",
  committee_buyer: "Committee Buyer",
  regional: "Regional",
};

const objectionTypeLabels: Record<ObjectionType, string> = {
  too_expensive: "Too Expensive",
  already_using_tool: "Already Using Tool",
  implementation_risk: "Implementation Risk",
  not_a_priority: "Not a Priority",
};

const specialtyTypeLabels: Record<SpecialtyType, string> = {
  reverse_discovery: "Reverse Discovery",
  board_pitch_practice: "Board Pitch Practice",
  multi_stakeholder_call: "Multi-Stakeholder Call",
  vc_investor_style: "VC Investor Style",
  time_compressed: "Time Compressed",
  difficult_prospect: "Difficult Prospect",
};

const leadStageCategoryLabels: Record<LeadStageCategory, string> = {
  top_of_funnel: "Top of Funnel",
  mid_funnel: "Mid Funnel",
  bottom_funnel: "Bottom Funnel",
  post_sale: "Post Sale",
};

const callTypeLabels: Record<CallType, string> = {
  cold_call: "Cold Call",
  discovery_call: "Discovery Call",
  follow_up_call: "Follow-Up Call",
  demo_call: "Demo Call",
  proposal_pricing_call: "Proposal & Pricing Call",
  procurement_legal_negotiation: "Procurement/Legal Negotiation",
  handover_to_customer_success: "Handover to Customer Success",
};

// GET LABEL FUNCTIONS

export function getIntentTypeLabel(value: IntentType): string {
  return intentTypeLabels[value];
}

export function getPersonaArchetypeLabel(value: PersonaArchetype): string {
  return personaArchetypeLabels[value];
}

export function getObjectionTypeLabel(value: ObjectionType): string {
  return objectionTypeLabels[value];
}

export function getSpecialtyTypeLabel(value: SpecialtyType): string {
  return specialtyTypeLabels[value];
}

export function getLeadStageCategoryLabel(value: LeadStageCategory): string {
  return leadStageCategoryLabels[value];
}

export function getCallTypeLabel(value: CallType): string {
  return callTypeLabels[value];
}
