import { ApiResponse, ListResponse } from "@/types/api";
import { Program, Scenario } from "@/types/scenario";
import { LearningPath, LearningChat, LearningProgress, LearningAchievement } from "@/types/learning-path";
import { mockLearningPaths, mockProgress, mockAchievements } from "@/lib/mock-data";

const API_BASE_URL = "https://lamigo-api.rockship.co/api";

// Helper function to create mock responses
const createMockResponse = <T>(data: T): ApiResponse<T> => ({
  data,
  status: "success"
});

const createMockListResponse = <T>(data: T[]): ListResponse<T> => ({
  data,
  status: "success",
  paging: {
    page: 1,
    per_page: data.length,
    total: data.length
  }
});

export async function getScenario(scenarioId: string): Promise<ApiResponse<Scenario>> {
  const response = await fetch(`${API_BASE_URL}/v1/scenarios/${scenarioId}`);
  return response.json();
}

export type GetScenariosResponse = Omit<Scenario, "program"> & {
  program_id: Program["id"];
};

export async function getScenarios(): Promise<ListResponse<GetScenariosResponse>> {
  const response = await fetch(`${API_BASE_URL}/v1/scenarios`);
  return response.json();
}

// Learning Path API functions
export async function getLearningPaths(): Promise<ListResponse<LearningPath>> {
  try {
    const response = await fetch(`${API_BASE_URL}/learning-paths`);
    if (!response.ok) throw new Error('API not available');
    return response.json();
  } catch (error) {
    console.warn('Using mock data for learning paths:', error);
    return createMockListResponse(mockLearningPaths);
  }
}

export async function getLearningPath(pathId: string): Promise<ApiResponse<LearningPath>> {
  try {
    const response = await fetch(`${API_BASE_URL}/learning-paths/${pathId}`);
    if (!response.ok) throw new Error('API not available');
    return response.json();
  } catch (error) {
    console.warn('Using mock data for learning path:', error);
    const mockPath = mockLearningPaths.find(path => path.path_id === pathId);
    if (!mockPath) {
      throw new Error('Learning path not found');
    }
    return createMockResponse(mockPath);
  }
}

export async function getLearningPathChat(pathId: string): Promise<ListResponse<LearningChat>> {
  try {
    const response = await fetch(`${API_BASE_URL}/learning-paths/${pathId}/chat`);
    if (!response.ok) throw new Error('API not available');
    return response.json();
  } catch (error) {
    console.warn('Using mock data for chat:', error);
    // Return empty chat for now
    return createMockListResponse([]);
  }
}

export async function sendLearningPathMessage(
  pathId: string,
  content: string,
  learnerId: string
): Promise<ApiResponse<LearningChat>> {
  try {
    const response = await fetch(`${API_BASE_URL}/learning-paths/${pathId}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        learner_id: learnerId,
        sender_type: 'learner',
      }),
    });
    if (!response.ok) throw new Error('API not available');
    return response.json();
  } catch (error) {
    console.warn('Using mock response for chat message:', error);
    // Create a mock response
    const mockMessage: LearningChat = {
      message_id: `msg-${Date.now()}`,
      path_id: pathId,
      learner_id: learnerId,
      timestamp: new Date().toISOString(),
      sender_type: 'learner',
      content: content
    };
    return createMockResponse(mockMessage);
  }
}

// Progress and Achievement API functions
export async function getLearningProgress(): Promise<ListResponse<LearningProgress>> {
  try {
    const response = await fetch(`${API_BASE_URL}/learning-paths/progress`);
    if (!response.ok) throw new Error('API not available');
    return response.json();
  } catch (error) {
    console.warn('Using mock data for learning progress:', error);
    return createMockListResponse(mockProgress);
  }
}

export async function getLearningAchievements(): Promise<ListResponse<LearningAchievement>> {
  try {
    const response = await fetch(`${API_BASE_URL}/learning-paths/achievements`);
    if (!response.ok) throw new Error('API not available');
    return response.json();
  } catch (error) {
    console.warn('Using mock data for achievements:', error);
    return createMockListResponse(mockAchievements);
  }
}
