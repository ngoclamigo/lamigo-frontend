import { mockAchievements, mockLearningPaths, mockProgress, mockScenarios } from "~/lib/mock-data";
import type { ApiResponse, ListResponse } from "~/types/api";
import type {
  LearningAchievement,
  LearningChat,
  LearningPath,
  LearningProgress,
} from "~/types/learning-path";
import type { Scenario } from "~/types/scenario";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const API_BASE_URL = "https://lamigo-api.rockship.co/api";

const createMockResponse = <T>(data: T): ApiResponse<T> => ({
  data,
  status: "success",
});

const createMockListResponse = <T>(data: T[]): ListResponse<T> => ({
  data,
  status: "success",
  paging: {
    page: 1,
    per_page: data.length,
    total: data.length,
  },
});

export async function getScenario(scenarioId: string): Promise<ApiResponse<Scenario>> {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/scenarios/${scenarioId}`);
    if (!response.ok) throw new Error("API not available");
    return response.json();
  } catch (error) {
    console.warn("Using mock data for scenario:", error);
    const mockScenario = mockScenarios.find((s) => s.id === scenarioId);
    if (!mockScenario) {
      throw new Error("Scenario not found");
    }
    return createMockResponse(mockScenario);
  }
}

export async function getScenarios(): Promise<ListResponse<Scenario>> {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/scenarios`);
    if (!response.ok) throw new Error("API not available");
    return response.json();
  } catch (error) {
    console.warn("Using mock data for scenarios:", error);
    return createMockListResponse(mockScenarios);
  }
}

export async function getLearningPaths(): Promise<ListResponse<LearningPath>> {
  try {
    const response = await fetch(`${API_BASE_URL}/learning-paths`);
    if (!response.ok) throw new Error("API not available");
    return response.json();
  } catch (error) {
    console.warn("Using mock data for learning paths:", error);
    return createMockListResponse(mockLearningPaths);
  }
}

export async function getLearningPath(pathId: string): Promise<ApiResponse<LearningPath>> {
  try {
    const response = await fetch(`${API_BASE_URL}/learning-paths/${pathId}`);
    if (!response.ok) throw new Error("API not available");
    return response.json();
  } catch (error) {
    console.warn("Using mock data for learning path:", error);
    const mockPath = mockLearningPaths.find((path) => path.id === pathId);
    if (!mockPath) {
      throw new Error("Learning path not found");
    }
    return createMockResponse(mockPath);
  }
}

export async function getLearningPathChat(pathId: string): Promise<ListResponse<LearningChat>> {
  try {
    const response = await fetch(`${API_BASE_URL}/learning-paths/${pathId}/chat`);
    if (!response.ok) throw new Error("API not available");
    return response.json();
  } catch (error) {
    console.warn("Using mock data for chat:", error);
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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        learner_id: learnerId,
        sender_type: "learner",
      }),
    });
    if (!response.ok) throw new Error("API not available");
    return response.json();
  } catch (error) {
    console.warn("Using mock response for chat message:", error);
    const mockMessage: LearningChat = {
      message_id: `msg-${Date.now()}`,
      path_id: pathId,
      learner_id: learnerId,
      timestamp: new Date().toISOString(),
      sender_type: "learner",
      content: content,
    };
    return createMockResponse(mockMessage);
  }
}

export async function getLearningProgress(): Promise<ListResponse<LearningProgress>> {
  try {
    const response = await fetch(`${API_BASE_URL}/learning-paths/progress`);
    if (!response.ok) throw new Error("API not available");
    return response.json();
  } catch (error) {
    console.warn("Using mock data for learning progress:", error);
    return createMockListResponse(mockProgress);
  }
}

export async function getLearningAchievements(): Promise<ListResponse<LearningAchievement>> {
  try {
    const response = await fetch(`${API_BASE_URL}/learning-paths/achievements`);
    if (!response.ok) throw new Error("API not available");
    return response.json();
  } catch (error) {
    console.warn("Using mock data for achievements:", error);
    return createMockListResponse(mockAchievements);
  }
}

export async function sendMessage(message: string, topic?: string): Promise<ApiResponse<string>> {
  try {
    const response = await fetch(`${APP_URL}/api/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, topic }),
    });
    if (!response.ok) throw new Error("API not available");
    const data = await response.json();
    return {
      data: data || "No response from AI",
      status: "success",
    };
  } catch (error) {
    console.warn("Using mock response for chat message:", error);
    return {
      data: "This is a mock response. The AI service is currently unavailable.",
      status: "success",
    };
  }
}
