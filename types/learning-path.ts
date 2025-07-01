export interface LearningPath {
  id: string;
  title: string;
  description: string;
  duration_estimate_hours: number;
  activities: LearningActivity[];
}

export interface LearningActivity {
  id: string;
  title: string;
  type: "slide" | "quiz" | "flashcard" | "embed" | "fill_blanks" | "matching";
  config:
    | SlideConfig
    | QuizConfig
    | FlashcardConfig
    | EmbedConfig
    | FillBlanksConfig
    | MatchingConfig;
}

export interface LearningChat {
  message_id: string;
  path_id: string;
  learner_id: string;
  timestamp: string;
  sender_type: "learner" | "system" | "instructor";
  content: string;
}

// Activity specific configs
export interface SlideConfig {
  content: string;
  title: string;
  media_url?: string;
  media_type?: "image" | "video";
  narration?: string;
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
  tags?: string[];
}

export interface EmbedConfig {
  url: string;
  title: string;
  description?: string;
  embed_type: "video" | "article";
}

export interface FillBlanksConfig {
  instruction: string;
  text_with_blanks: string; // Text with placeholders like "The _____ of a company is calculated by..."
  blanks: FillBlank[];
  success_message?: string;
}

export interface FillBlank {
  position: number; // Position in the text where this blank appears
  correct_answers: string[]; // Multiple correct answers possible
  feedback?: string;
}

export interface MatchingConfig {
  instruction: string;
  pairs: MatchingPair[];
  success_message?: string;
}

export interface MatchingPair {
  left: string;
  right: string;
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
