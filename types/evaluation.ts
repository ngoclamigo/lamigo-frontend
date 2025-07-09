export type Transcription = {
  text: string;
  role: "assistant" | "user";
};

export type TalkingPoint = {
  title: string;
  description: string;
};

export type PerformanceMetric = {
  category: string;
  score: number;
  feedback: string;
  insight: string;
  color?: "emerald" | "yellow" | "red";
};

export type UserData = {
  name: string;
  company: string;
  meetingTime: string;
  readinessScore: number;
  improvement: string;
};

export type SessionData = {
  duration: string;
  practicePartner: string;
  scenario: string;
  keyInsight: string;
  callStatus: string;
};

export type EvaluationResult = {
  userData: UserData;
  talkingPoints: TalkingPoint[];
  performanceMetrics: PerformanceMetric[];
  sessionData: SessionData;
};
