import { OpenAI } from "openai";
import { ScenarioDetail } from "~/types/scenario";
import {
  CoreCompetency,
  LearnerProfile,
  LearningOutcomes,
  RoleAmplifier,
  ScenarioOutcome,
} from "~/types/learning-outcomes";
import {
  CALL_TYPE_MAPPING,
  INTENT_MAPPING,
  OBJECTION_MAPPING,
  PERSONA_MAPPING,
  ROLE_AMPLIFIERS,
  SPECIALTY_MAPPING,
} from "./scenario-mapping";

export class LearningOutcomesGenerator {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateLearningOutcomes(
    learnerProfile: LearnerProfile,
    scenarioContext: ScenarioDetail
  ): Promise<LearningOutcomes> {
    const coreCompetencies = this.generateCoreCompetencies(learnerProfile, scenarioContext);
    const scenarioOutcomes = this.generateScenarioOutcomes(scenarioContext);
    const roleAmplifiers = this.generateRoleAmplifiers(learnerProfile);

    const sessionFocus = await this.generateSessionFocus(learnerProfile, scenarioContext);

    return {
      session_focus: sessionFocus,
      layer_1_core: coreCompetencies,
      layer_2_scenario: scenarioOutcomes,
      layer_3_role_amplifiers: roleAmplifiers,
    };
  }

  private generateCoreCompetencies(
    learnerProfile: LearnerProfile,
    scenarioContext: ScenarioDetail
  ): CoreCompetency[] {
    const baseCompetencies = [
      {
        competency: "Product Knowledge",
        weight: 1.0,
        success_criteria: [
          "Accurate feature descriptions",
          "Relevant use case mapping",
          "Integration capabilities mentioned",
        ],
      },
      {
        competency: "Communication",
        weight: 1.0,
        success_criteria: [
          "Professional industry language",
          "Confident tone throughout",
          "Smooth topic transitions",
        ],
      },
      {
        competency: "Discovery",
        weight: 1.0,
        success_criteria: [
          "Value-focused questions asked",
          "Business impact explored",
          "Technical requirements identified",
        ],
      },
      {
        competency: "Objection Handling",
        weight: 1.0,
        success_criteria: [
          "Concerns addressed professionally",
          "Value-based responses provided",
          "Clear next steps outlined",
        ],
      },
    ];

    // Apply weights based on improvement areas
    return baseCompetencies.map((comp) => ({
      ...comp,
      weight: this.calculateCompetencyWeight(comp.competency, learnerProfile, scenarioContext),
    }));
  }

  private calculateCompetencyWeight(
    competency: string,
    learnerProfile: LearnerProfile,
    scenarioContext: ScenarioDetail
  ): number {
    let weight = 1.0;

    // Amplify based on improvement areas
    const improvementAreas = learnerProfile.historical_performance.improvement_areas;
    if (improvementAreas.includes(competency.toLowerCase().replace(/\s+/g, "_"))) {
      weight *= 1.3;
    }

    // Amplify based on scenario context
    if (
      competency === "Discovery & Active Listening" &&
      scenarioContext.call_type === "discovery_call"
    ) {
      weight *= 1.2;
    }
    if (competency === "Objection Handling & Follow-up" && scenarioContext.objections.length > 0) {
      weight *= 1.4;
    }

    return weight;
  }

  private generateScenarioOutcomes(scenarioContext: ScenarioDetail): ScenarioOutcome[] {
    const outcomes: ScenarioOutcome[] = [];

    // Generate outcomes based on call type
    const callTypeOutcome = this.getCallTypeOutcome(scenarioContext.call_type);
    if (callTypeOutcome) {
      outcomes.push(callTypeOutcome);
    }

    // Generate outcomes based on intent
    const intentOutcome = this.getIntentOutcome(scenarioContext.intent);
    if (intentOutcome) {
      outcomes.push(intentOutcome);
    }

    // Generate outcomes based on persona
    scenarioContext.persona.forEach((persona) => {
      const personaOutcome = this.getPersonaOutcome(persona);
      if (personaOutcome) {
        outcomes.push(personaOutcome);
      }
    });

    // Generate outcomes based on objections
    scenarioContext.objections.forEach((objection) => {
      const objectionOutcome = this.getObjectionOutcome(objection);
      if (objectionOutcome) {
        outcomes.push(objectionOutcome);
      }
    });

    // Generate outcomes based on specialty
    const specialtyOutcome = this.getSpecialtyOutcome(scenarioContext.specialty);
    if (specialtyOutcome) {
      outcomes.push(specialtyOutcome);
    }

    return outcomes;
  }

  private getCallTypeOutcome(callType: string): ScenarioOutcome | null {
    const callTypeData = CALL_TYPE_MAPPING[callType as keyof typeof CALL_TYPE_MAPPING];
    if (callTypeData) {
      return {
        outcome: callTypeData.outcome,
        triggered_by: `${callType} call type`,
        success_criteria: callTypeData.criteria,
      };
    }
    return null;
  }

  private getIntentOutcome(intent: string): ScenarioOutcome | null {
    const intentData = INTENT_MAPPING[intent as keyof typeof INTENT_MAPPING];
    if (intentData) {
      return {
        outcome: intentData.focus,
        triggered_by: `${intent} intent`,
        success_criteria: intentData.criteria,
      };
    }
    return null;
  }

  private getPersonaOutcome(persona: string): ScenarioOutcome | null {
    const personaData = PERSONA_MAPPING[persona as keyof typeof PERSONA_MAPPING];
    if (personaData) {
      return {
        outcome: personaData.style,
        triggered_by: `${persona} persona`,
        success_criteria: personaData.criteria,
      };
    }
    return null;
  }

  private getObjectionOutcome(objection: string): ScenarioOutcome | null {
    const objectionData = OBJECTION_MAPPING[objection as keyof typeof OBJECTION_MAPPING];
    if (objectionData) {
      return {
        outcome: objectionData.skill,
        triggered_by: `${objection} objection`,
        success_criteria: objectionData.criteria,
      };
    }
    return null;
  }

  private getSpecialtyOutcome(specialty: string): ScenarioOutcome | null {
    const specialtyData = SPECIALTY_MAPPING[specialty as keyof typeof SPECIALTY_MAPPING];
    if (specialtyData) {
      return {
        outcome: specialtyData.skill,
        triggered_by: `${specialty} specialty`,
        success_criteria: specialtyData.criteria,
      };
    }
    return null;
  }

  private generateRoleAmplifiers(learnerProfile: LearnerProfile): RoleAmplifier[] {
    const roleData = ROLE_AMPLIFIERS[learnerProfile.role];
    if (!roleData) return [];

    return [
      {
        amplifier: `${learnerProfile.role} Excellence`,
        role_relevance: `${learnerProfile.role} in ${learnerProfile.industry_focus}`,
        weight_modifier: 1.2,
        focus_areas: roleData.amplified_skills,
      },
    ];
  }

  private async generateSessionFocus(
    learnerProfile: LearnerProfile,
    scenarioContext: ScenarioDetail
  ): Promise<string> {
    const prompt = `
    Generate a concise session focus description for a roleplay practice session.

    Learner Context:
    - Role: ${learnerProfile.role}
    - Industry: ${learnerProfile.industry_focus}
    - Experience: ${learnerProfile.experience_level}
    - Improvement Areas: ${learnerProfile.historical_performance.improvement_areas.join(", ")}

    Scenario Context:
    - Call Type: ${scenarioContext.call_type}
    - Intent: ${scenarioContext.intent}
    - Persona: ${scenarioContext.persona.join(", ")}
    - Objections: ${scenarioContext.objections.join(", ")}
    - Specialty: ${scenarioContext.specialty}

    Generate a single sentence that captures the main learning focus for this session.
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content?.trim() || "Session focus generation failed";
  }
}
