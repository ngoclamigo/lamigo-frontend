// Types for sales scenario evaluation system

export interface SalesScenario {
  name: string;
  description: string;
  customer_mood: string;
  objectives: string[];
  context: string;
  urgency: string;
}

export interface CustomerPersona {
  name: string;
  role: string;
  company_size: string;
  industry: string;
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
}

export interface ConversationTranscript {
  timestamp: string;
  speaker: 'user' | 'agent';
  text: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  confidence?: number;
}

// New type for your conversation script format
export interface ConversationScript {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  final: boolean;
  language: string;
  firstReceivedTime: number;
  lastReceivedTime: number;
  receivedAtMediaTimestamp: number;
  receivedAt: number;
  role: 'assistant' | 'user';
}

export interface TalkingPoint {
  title: string;
  description: string;
}

export interface PerformanceMetric {
  category: string;
  score: number;
  feedback: string;
  insight: string;
  color: 'emerald' | 'yellow' | 'red' | 'blue';
}

export interface UserData {
  name: string;
  company: string;
  meetingTime: string;
  readinessScore: number;
  improvement: string;
}

export interface SessionData {
  duration: string;
  practicePartner: string;
  scenario: string;
  keyInsight: string;
  callStatus: string;
}

export interface EvaluationResult {
  userData: UserData;
  talkingPoints: TalkingPoint[];
  performanceMetrics: PerformanceMetric[];
  sessionData: SessionData;
}
