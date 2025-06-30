export type Persona = {
  name: string;
  job_title: string;
  company: string;
  industry: string;
  location: string;
};

export type ScenarioDetail = {
  name: string;
  description: string;
  type: "call_scenario";
  category: string;
  call_type: string;
  intent: string;
  persona: string[];
  objections: string[];
  specialty: string;
  time_limit: string;
  roleplay_tips: string[];
};

export type Scenario = {
  id: string;
  persona: Persona;
  scenarios: ScenarioDetail[];
  created_at: string;
};
