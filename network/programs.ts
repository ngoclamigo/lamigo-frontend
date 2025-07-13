import { mockAchievements, mockProgress } from "~/lib/mock-data";
import type { ApiResponse, ListResponse } from "~/types";
import type { Activity, Program, ProgramAchievement, ProgramProgress } from "~/types/program";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://lamigo-api.rockship.co/api";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const API_BASE_URL = "https://lamigo-api.rockship.co/api";

// const createMockResponse = <T>(data: T): ApiResponse<T> => ({
//   data,
//   status: "success",
// });

const createMockListResponse = <T>(data: T[]): ListResponse<T> => ({
  data,
  status: "success",
  paging: {
    page: 1,
    per_page: data.length,
    total: data.length,
  },
});

export async function getPrograms(): Promise<ListResponse<Program>> {
  const response = await fetch(`${serverUrl}/v1/programs`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch programs");
  }

  const data: ListResponse<Program> = await response.json();
  return data;
}

export async function getProgram(programID: string): Promise<ApiResponse<Program>> {
  const response = await fetch(`${serverUrl}/v1/programs/${programID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch program with id ${programID}`);
  }

  const data: ApiResponse<Program> = await response.json();
  return data;
}

export async function updateUserActivityProgress(
  activityID: string,
  body: any
): Promise<ApiResponse<Activity>> {
  const response = await fetch(`${serverUrl}/v1/learning-activities/${activityID}/user-action`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_action: body }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update user progress for activity ${activityID}`);
  }

  const data: ApiResponse<Activity> = await response.json();
  return data;
}

export async function getLearningProgress(): Promise<ListResponse<ProgramProgress>> {
  try {
    const response = await fetch(`${API_BASE_URL}/learning-paths/progress`);
    if (!response.ok) throw new Error("API not available");
    return response.json();
  } catch (error) {
    console.warn("Using mock data for learning progress:", error);
    return createMockListResponse(mockProgress);
  }
}

export async function getLearningAchievements(): Promise<ListResponse<ProgramAchievement>> {
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