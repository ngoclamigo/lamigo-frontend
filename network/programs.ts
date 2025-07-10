import type { ApiResponse, ListResponse } from "~/types/api";
import type { Activity, Program } from "~/types/program";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://lamigo-api.rockship.co/api";

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

export async function getProgram(program_id: string): Promise<ApiResponse<Program>> {
  const response = await fetch(`${serverUrl}/v1/programs/${program_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch program with id ${program_id}`);
  }

  const data: ApiResponse<Program> = await response.json();
  return data;
}

export async function updateUserActivityProgress(
  activity_id: string,
  body: any
): Promise<ApiResponse<Activity>> {
  const response = await fetch(`${serverUrl}/v1/learning-activities/${activity_id}/user-action`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_action: body }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update user progress for activity ${activity_id}`);
  }

  const data: ApiResponse<Activity> = await response.json();
  return data;
}
