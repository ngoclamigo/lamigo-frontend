import {
  CoreCompetency,
  LearnerProfile,
  LearningOutcomes,
  RoleAmplifier,
  ScenarioContext,
  ScenarioOutcome,
} from "~/types/learning-outcomes";
import { openai } from "./openai.sdk";

export class LearningOutcomesEngine {
  private static CORE_COMPETENCIES = [
    "Product Knowledge & Application",
    "Communication & Confidence",
    "Discovery & Active Listening",
    "Objection Handling & Follow-up",
  ];

  private static CALL_TYPE_MAPPINGS = {
    "Cold Call": {
      focus: "Opening & Engagement",
      criteria: ["Hook creation", "Interest generation", "Meeting booking"],
    },
    "Discovery Call": {
      focus: "Business Exploration",
      criteria: ["Requirements gathering", "Pain identification", "Qualification"],
    },
    "Follow-up Call": {
      focus: "Relationship Deepening",
      criteria: ["Reference previous discussion", "Advance opportunity", "Maintain momentum"],
    },
    "Demo Call": {
      focus: "Solution Presentation",
      criteria: ["Feature-benefit mapping", "Customization", "Objection surfacing"],
    },
    "Proposal/Pricing Call": {
      focus: "Value Articulation",
      criteria: ["ROI demonstration", "Cost justification", "Negotiation"],
    },
    "Procurement/Legal": {
      focus: "Contract Navigation",
      criteria: ["Risk mitigation", "Timeline management", "Stakeholder alignment"],
    },
    "Customer Success Handover": {
      focus: "Transition Management",
      criteria: ["Success metrics alignment", "Relationship transfer", "Implementation planning"],
    },
  };

  private static PERSONA_MAPPINGS = {
    Analytical: {
      style: "Data-Driven Conversation",
      criteria: ["Metrics", "Case studies", "Quantified outcomes"],
    },
    Strategic: {
      style: "Vision-Focused Discussion",
      criteria: ["Growth opportunities", "Competitive edge", "Strategic alignment"],
    },
    "Risk-Averse": {
      style: "Trust Building",
      criteria: ["Validation", "References", "Risk mitigation strategies"],
    },
    Skeptical: {
      style: "Proof-Based Persuasion",
      criteria: ["Third-party validation", "Concrete evidence", "Overcoming objections"],
    },
    "Committee Buyer": {
      style: "Stakeholder Navigation",
      criteria: ["Individual needs", "Consensus building", "Meeting management"],
    },
  };

  private static OBJECTION_MAPPINGS = {
    "Too Expensive": {
      skill: "Value Demonstration",
      criteria: ["ROI quantification", "Cost comparison", "Payment options"],
    },
    "Already Using Tool": {
      skill: "Displacement Strategy",
      criteria: ["Switching cost mitigation", "Superior value proof", "Implementation planning"],
    },
    "Implementation Risk": {
      skill: "Risk Mitigation",
      criteria: ["Phased approach", "Success stories", "Support structure explanation"],
    },
    "Not a Priority": {
      skill: "Urgency Creation",
      criteria: ["Opportunity cost demonstration", "Timeline pressure", "Competitive implications"],
    },
  };

  private static ROLE_AMPLIFIERS = {
    "Sales Rep": {
      amplified: ["Discovery", "Objection Handling"],
      focus: "Deal progression, competitive positioning",
    },
    "Account Manager": {
      amplified: ["Relationship Building", "Expansion"],
      focus: "Customer success, upsell opportunities",
    },
    "BDR/SDR": {
      amplified: ["Opening", "Qualification"],
      focus: "Pipeline generation, meeting booking",
    },
    "Sales Engineer": {
      amplified: ["Technical Discovery", "Demo Skills"],
      focus: "Solution fit, technical objection handling",
    },
    "Customer Success": {
      amplified: ["Problem Solving", "Retention"],
      focus: "Adoption drivers, renewal risk factors",
    },
  };

  static async generateLearningOutcomes(
    learnerProfile: LearnerProfile,
    scenarioContext: ScenarioContext
  ): Promise<LearningOutcomes> {
    // Layer 1: Fixed Core Competencies
    const layer1Core = this.generateLayer1Outcomes(learnerProfile, scenarioContext);

    // Layer 2: Scenario-Triggered Outcomes
    const layer2Scenario = await this.generateLayer2Outcomes(scenarioContext);

    // Layer 3: Role-Specific Amplifiers
    const layer3Amplifiers = this.generateLayer3Amplifiers(learnerProfile, scenarioContext);

    return {
      layer_1_core: layer1Core,
      layer_2_scenario: layer2Scenario,
      layer_3_role_amplifiers: layer3Amplifiers,
    };
  }

  private static generateLayer1Outcomes(
    learnerProfile: LearnerProfile,
    scenarioContext: ScenarioContext
  ): CoreCompetency[] {
    const outcomes: CoreCompetency[] = [];

    this.CORE_COMPETENCIES.forEach((competency, index) => {
      // Calculate weight based on learner's historical performance
      const baseScore = learnerProfile.historical_performance.avg_core_scores[index];
      const isWeakArea = learnerProfile.historical_performance.improvement_areas.includes(
        competency.toLowerCase().replace(/\s+/g, "_").replace(/&/g, "and")
      );

      // Higher weight for improvement areas, lower for strong areas
      const weight = isWeakArea ? 1.3 : baseScore < 70 ? 1.2 : baseScore > 90 ? 0.8 : 1.0;

      outcomes.push({
        competency,
        weight,
        success_criteria: this.getCoreCriteria(competency, scenarioContext),
      });
    });

    return outcomes;
  }

  private static async generateLayer2Outcomes(
    scenarioContext: ScenarioContext
  ): Promise<ScenarioOutcome[]> {
    const outcomes: ScenarioOutcome[] = [];

    // Add call type specific outcome
    const callTypeMapping = this.CALL_TYPE_MAPPINGS[scenarioContext.call_type];
    if (callTypeMapping) {
      outcomes.push({
        outcome: callTypeMapping.focus,
        triggered_by: `Call Type: ${scenarioContext.call_type}`,
        success_criteria: callTypeMapping.criteria,
      });
    }

    // Add persona-specific outcomes
    for (const persona of scenarioContext.persona) {
      const personaKey = Object.keys(this.PERSONA_MAPPINGS).find((key) => persona.includes(key));

      if (personaKey) {
        const personaMapping =
          this.PERSONA_MAPPINGS[personaKey as keyof typeof this.PERSONA_MAPPINGS];
        outcomes.push({
          outcome: personaMapping.style,
          triggered_by: `Persona: ${persona}`,
          success_criteria: personaMapping.criteria,
        });
      }
    }

    // Add objection-specific outcomes
    for (const objection of scenarioContext.objections) {
      const objectionMapping =
        this.OBJECTION_MAPPINGS[objection as keyof typeof this.OBJECTION_MAPPINGS];
      if (objectionMapping) {
        outcomes.push({
          outcome: objectionMapping.skill,
          triggered_by: `Objection: ${objection}`,
          success_criteria: objectionMapping.criteria,
        });
      }
    }

    // Use OpenAI to generate additional contextual outcomes
    const additionalOutcomes = await this.generateContextualOutcomes(scenarioContext);
    outcomes.push(...additionalOutcomes);

    return outcomes;
  }

  private static generateLayer3Amplifiers(
    learnerProfile: LearnerProfile,
    scenarioContext: ScenarioContext
  ): RoleAmplifier[] {
    const amplifiers: RoleAmplifier[] = [];

    const roleMapping = this.ROLE_AMPLIFIERS[learnerProfile.role];
    if (roleMapping) {
      amplifiers.push({
        amplifier: `${learnerProfile.role} Excellence`,
        role_relevance: `${learnerProfile.role} in ${learnerProfile.industry_focus}`,
        weight_modifier: 1.2,
        focus_areas: [roleMapping.focus, ...roleMapping.amplified],
      });
    }

    // Industry-specific amplifier
    if (scenarioContext.industry) {
      amplifiers.push({
        amplifier: `${scenarioContext.industry} Industry Expertise`,
        role_relevance: `${learnerProfile.role} in ${scenarioContext.industry}`,
        weight_modifier: 1.1,
        focus_areas: [
          `${scenarioContext.industry} terminology`,
          `Industry-specific use cases`,
          `Regulatory awareness`,
        ],
      });
    }

    return amplifiers;
  }

  private static async generateContextualOutcomes(
    scenarioContext: ScenarioContext
  ): Promise<ScenarioOutcome[]> {
    const prompt = `
    Given this sales roleplay scenario context:
    - Call Type: ${scenarioContext.call_type}
    - Persona: ${scenarioContext.persona.join(", ")}
    - Objections: ${scenarioContext.objections.join(", ")}
    - Industry: ${scenarioContext.industry || "General"}
    - Specialty: ${scenarioContext.specialty || "Standard"}

    Generate 1-2 additional learning outcomes that would be specifically relevant to this scenario combination.
    Focus on skills that would be uniquely important given these combined factors.

    Return a JSON array of objects with this structure:
    {
      learning_outcomes: [
        {
          "outcome": "Specific skill name",
          "triggered_by": "Explanation of why this is relevant",
          "success_criteria": ["Specific success criteria 1", "Specific success criteria 2", "Specific success criteria 3"]
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
              "You are an expert sales training designer. Generate specific, actionable learning outcomes for sales roleplay scenarios. Return only valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
        response_format: { type: "json_object" },
      });

      return JSON.parse(response.choices[0].message.content || "{}").learning_outcomes || [];
    } catch (error) {
      console.error("Error generating contextual outcomes:", error);
      return [];
    }
  }

  private static getCoreCriteria(competency: string, scenarioContext: ScenarioContext): string[] {
    const baseCriteria = {
      "Product Knowledge & Application": [
        "Accurate feature descriptions",
        "Relevant use case mapping",
        "Integration capabilities mentioned",
      ],
      "Communication & Confidence": [
        "Professional industry language",
        "Confident tone throughout",
        "Smooth topic transitions",
      ],
      "Discovery & Active Listening": [
        "Value-focused questions asked",
        "Business impact explored",
        "Technical requirements identified",
      ],
      "Objection Handling & Follow-up": [
        "Concerns addressed directly",
        "Value-based responses",
        "Clear next steps provided",
      ],
    };

    return baseCriteria[competency as keyof typeof baseCriteria] || [];
  }
}
