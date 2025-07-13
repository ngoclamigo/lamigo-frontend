import { Topic } from "./topic";

export enum ProgramStatusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum AssignmentTypeEnum {
  ESSAY = "ESSAY",
  QUIZ = "QUIZ",
}

export interface Program {
  id: string;
  user_id: string;
  topic: Topic;
  assignment_prompt: string;
  metadatas: any;
  assignment_type: AssignmentTypeEnum;
  status: ProgramStatusEnum;
  started_at: string;
  title: string;
  description: string;
  duration_estimate_hours: number;
  activities: Activity[];
}

export enum ActivityTypeEnum {
  SLIDE = "slide",
  QUIZ = "quiz",
  EMBED = "embed",
  FLASHCARD = "flashcard",
  MATCHING = "matching",
  FILL_BLANKS = "fill_blanks",
}

export interface Activity {
  id: string;
  title: string;
  type: ActivityTypeEnum;
  config: ActivityConfig;
  user_action: any;
  program_id: Program["id"];
}

export type ActivityConfig =
  | SlideConfig
  | QuizConfig
  | FlashcardConfig
  | EmbedConfig
  | FillBlanksConfig
  | MatchingConfig;

export interface SlideConfig {
  content: string;
  narration?: string;
}

export interface QuizConfig {
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
  narration?: string;
}

export interface FlashcardConfig {
  cards: {
    front: string;
    back: string;
  }[];
  narration?: string;
}

export enum EmbedTypeEnum {
  VIDEO = "video",
  DOCUMENT = "document",
}

export interface EmbedConfig {
  url: string;
  embed_type: EmbedTypeEnum;
  narration?: string;
}

export interface FillBlanksConfig {
  instruction: string;
  text_with_blanks: string;
  blanks: {
    position: number;
    correct_answers: string[];
  }[];
  narration?: string;
}

export interface MatchingConfig {
  instruction: string;
  pairs: {
    left: string;
    right: string;
  }[];
  narration?: string;
}

export interface ProgramProgress {
  id: string;
  learner_id: string;
  program_id: string;
  activity_id: string;
  status: "not_started" | "in_progress" | "completed";
  completion_percentage: number;
  time_spent_minutes: number;
  last_accessed: string;
  started_at?: string;
  completed_at?: string;
}

export interface ProgramAchievement {
  id: string;
  learner_id: string;
  title: string;
  description: string;
  type: "completion" | "streak" | "time_based" | "skill_based";
  earned_at: string;
  badge_url?: string;
  points?: number;
  program_id?: string;
}
