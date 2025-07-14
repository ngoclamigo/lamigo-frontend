// Mock Progress Data
export const mockProgress = [
  {
    id: "prog-1",
    learner_id: "current-learner-id",
    program_id: "market-intelligence",
    activity_id: "market-intelligence-quiz",
    status: "completed" as const,
    completion_percentage: 100,
    time_spent_minutes: 15,
    last_accessed: "2025-06-25T10:00:00Z",
    started_at: "2025-06-25T09:45:00Z",
    completed_at: "2025-06-25T10:00:00Z",
  },
  {
    id: "prog-2",
    learner_id: "current-learner-id",
    program_id: "capital-iq-fundamentals",
    activity_id: "financial-analysis-flashcard",
    status: "in_progress" as const,
    completion_percentage: 50,
    time_spent_minutes: 8,
    last_accessed: "2025-06-25T10:15:00Z",
    started_at: "2025-06-25T10:00:00Z",
  },
];

// Mock Achievements Data
export const mockAchievements = [
  {
    id: "ach-1",
    learner_id: "current-learner-id",
    title: "First Steps",
    description: "Completed your first learning activity",
    type: "completion" as const,
    earned_at: "2025-06-25T10:00:00Z",
    points: 10,
    program_id: "intro-to-react",
  },
  {
    id: "ach-2",
    learner_id: "current-learner-id",
    title: "Quiz Master",
    description: "Answered 5 quiz questions correctly",
    type: "skill_based" as const,
    earned_at: "2025-06-25T10:15:00Z",
    points: 25,
  },
];
