import { ApiResponse, ListResponse } from "~/types/api";
import { Program } from "~/types/program";

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
