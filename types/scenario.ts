export type Organisation = {
  id: string;
  name: string;
  created_at: string;
};

export type Topic = {
  id: string;
  title: string;
  organisation: Organisation;
  metadatas: {
    prompt: string;
  };
  started_at: string;
};

export type Program = {
  id: string;
  user_id: string;
  topic: Topic;
  assignment_prompt: string;
  metadatas: {
    day: number;
    topics: string;
    exercises: string;
  };
  assignment_type: "ESSAY" | "MULTIPLE_CHOICE";
  status: "ACTIVE" | "COMPLETED" | "ARCHIVED";
  started_at: string;
};

export type Persona = {
  name: string;
  role: string;
  company_size: string;
  pain_points: string[];
  budget_range: string;
  decision_style: string;
  objections: string[];
  personality_traits: string[];
  voice: string;
  background: string;
  communication_style: string;
  current_challenge: string;
  specific_context: string;
  time_pressure: string;
  emotional_state: string;
  competitors_used: string[];
};

export type ScenarioDetail = {
  name: string;
  description: string;
  customer_mood: string;
  objections: string[];
  context: string;
  urgency: string;
};

export type Scenario = {
  id: string;
  program: Program;
  persona: Persona;
  scenarios: ScenarioDetail[];
  created_at: string;
};
