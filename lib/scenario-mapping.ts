export const CALL_TYPE_MAPPING = {
  cold_call: {
    outcome: "Opening & Engagement",
    criteria: ["Hook creation", "Interest generation", "Meeting booking"],
  },
  discovery_call: {
    outcome: "Business Exploration",
    criteria: ["Requirements gathering", "Pain identification", "Qualification"],
  },
  follow_up_call: {
    outcome: "Relationship Deepening",
    criteria: ["Reference previous discussion", "Advance opportunity", "Maintain momentum"],
  },
  demo_call: {
    outcome: "Solution Presentation",
    criteria: ["Feature-benefit mapping", "Customization", "Objection surfacing"],
  },
  proposal_pricing_call: {
    outcome: "Value Articulation",
    criteria: ["ROI demonstration", "Cost justification", "Negotiation"],
  },
  procurement_legal_negotiation: {
    outcome: "Contract Navigation",
    criteria: ["Risk mitigation", "Timeline management", "Stakeholder alignment"],
  },
  handover_to_customer_success: {
    outcome: "Transition Management",
    criteria: ["Success metrics alignment", "Relationship transfer", "Implementation planning"],
  },
};

export const INTENT_MAPPING = {
  education: {
    focus: "Thought Leadership",
    criteria: ["Advisory positioning", "Trust building", "Expertise demonstration"],
  },
  re_qualification: {
    focus: "Re-engagement Skills",
    criteria: ["Opportunity revival", "Updated discovery", "Renewed interest"],
  },
  inbound: {
    focus: "Warm Lead Conversion",
    criteria: ["Capitalize on interest", "Accelerate qualification", "Booking efficiency"],
  },
  urgent_response: {
    focus: "Crisis Management",
    criteria: ["Trust recovery", "Rapid problem solving", "Relationship repair"],
  },
  competitive_deal: {
    focus: "Differentiation Skills",
    criteria: ["Unique value props", "Competitive advantages", "Proof points"],
  },
};

export const PERSONA_MAPPING = {
  analytical: {
    style: "Data-Driven Conversation",
    criteria: ["Metrics", "Case studies", "Quantified outcomes"],
  },
  strategic: {
    style: "Vision-Focused Discussion",
    criteria: ["Growth opportunities", "Competitive edge", "Strategic alignment"],
  },
  risk_averse: {
    style: "Trust Building",
    criteria: ["Validation", "References", "Risk mitigation strategies"],
  },
  skeptical: {
    style: "Proof-Based Persuasion",
    criteria: ["Third-party validation", "Concrete evidence", "Overcoming objections"],
  },
  committee_buyer: {
    style: "Stakeholder Navigation",
    criteria: ["Individual needs", "Consensus building", "Meeting management"],
  },
  regional: {
    style: "Cultural Adaptation",
    criteria: ["Local context", "Regulatory awareness", "Regional communication style"],
  },
};

export const OBJECTION_MAPPING = {
  too_expensive: {
    skill: "Value Demonstration",
    criteria: ["ROI quantification", "Cost comparison", "Payment options"],
  },
  already_using_tool: {
    skill: "Displacement Strategy",
    criteria: ["Switching cost mitigation", "Superior value proof", "Implementation planning"],
  },
  implementation_risk: {
    skill: "Risk Mitigation",
    criteria: ["Phased approach", "Success stories", "Support structure explanation"],
  },
  not_a_priority: {
    skill: "Urgency Creation",
    criteria: ["Opportunity cost demonstration", "Timeline pressure", "Competitive implications"],
  },
};

export const SPECIALTY_MAPPING = {
  reverse_discovery: {
    skill: "Defensive Selling",
    criteria: ["Maintain control", "Redirect questioning", "Demonstrate expertise"],
  },
  board_pitch_practice: {
    skill: "Executive Communication",
    criteria: ["Strategic narrative", "Concise value prop", "Decision-maker language"],
  },
  multi_stakeholder_call: {
    skill: "Complex Navigation",
    criteria: ["Individual needs management", "Consensus building", "Conflict resolution"],
  },
  vc_investor_style: {
    skill: "Business Case Defense",
    criteria: ["Financial justification", "Market opportunity", "Scalability proof"],
  },
  time_compressed: {
    skill: "Efficiency & Clarity",
    criteria: ["Concise messaging", "Priority focus", "Clear next steps"],
  },
  difficult_prospect: {
    skill: "Soft Skills Under Pressure",
    criteria: ["Patience", "Professionalism", "Relationship preservation"],
  },
};

export const ROLE_AMPLIFIERS = {
  "Sales Rep": {
    amplified_skills: ["Discovery", "Objection Handling"],
    focus: "Deal progression, competitive positioning",
  },
  "Account Manager": {
    amplified_skills: ["Relationship Building", "Expansion"],
    focus: "Customer success, upsell opportunities",
  },
  "BDR/SDR": {
    amplified_skills: ["Opening", "Qualification"],
    focus: "Pipeline generation, meeting booking",
  },
  "Sales Engineer": {
    amplified_skills: ["Technical Discovery", "Demo Skills"],
    focus: "Solution fit, technical objection handling",
  },
  "Customer Success": {
    amplified_skills: ["Problem Solving", "Retention"],
    focus: "Adoption drivers, renewal risk factors",
  },
};
