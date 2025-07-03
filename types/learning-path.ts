type LearningPath = {
  id: string;
  title: string;
  description: string;
  duration_estimate_hours: number;
  activities: Activity[];
};

type ActivityType = "slide" | "quiz" | "flashcard" | "embed" | "fill_blanks" | "matching";

type ActivityConfig =
  | SlideConfig
  | QuizConfig
  | FlashcardConfig
  | EmbedConfig
  | FillBlanksConfig
  | MatchingConfig;

type Activity = {
  id: string;
  title: string;
  description: string;
  type: ActivityType;
  config: ActivityConfig;
};

export interface SlideConfig {
  content: string;
  narration: string;
  media_url?: string;
  media_type?: "image" | "video";
}

export interface QuizConfig {
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
}

export interface FlashcardConfig {
  cards: FlashcardData[];
}

export interface FlashcardData {
  front: string;
  back: string;
}

export interface EmbedConfig {
  url: string;
  embed_type: "video" | "article";
}

export interface FillBlanksConfig {
  instruction: string;
  text_with_blanks: string;
  blanks: FillBlank[];
}

export interface FillBlank {
  position: number;
  correct_answers: string[];
}

export interface MatchingConfig {
  instruction: string;
  pairs: MatchingPair[];
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface LearningChat {
  message_id: string;
  path_id: string;
  learner_id: string;
  timestamp: string;
  sender_type: "learner" | "system" | "instructor";
  content: string;
}

// Progress and Achievement types
export interface LearningProgress {
  progress_id: string;
  learner_id: string;
  path_id: string;
  activity_id: string;
  status: "not_started" | "in_progress" | "completed";
  completion_percentage: number;
  time_spent_minutes: number;
  last_accessed: string;
  started_at?: string;
  completed_at?: string;
}

export interface LearningAchievement {
  achievement_id: string;
  learner_id: string;
  title: string;
  description: string;
  type: "completion" | "streak" | "time_based" | "skill_based";
  earned_at: string;
  badge_url?: string;
  points?: number;
  path_id?: string;
}

export type { LearningPath, Activity, ActivityConfig, ActivityType };
