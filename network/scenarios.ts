import type { ApiResponse, ListResponse } from "~/types";
import type { Scenario } from "~/types/scenario";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://lamigo-api.rockship.co/api";

export async function getScenarios(): Promise<ListResponse<Scenario>> {
  const response = await fetch(`${serverUrl}/v1/scenarios`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch scenarios");
  }

  const data: ListResponse<Scenario> = await response.json();
  return data;
}

export async function getScenario(scenarioID: string): Promise<ApiResponse<Scenario>> {
  const response = await fetch(`${serverUrl}/v1/scenarios/${scenarioID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch scenario with id ${scenarioID}`);
  }

  const data: ApiResponse<Scenario> = await response.json();
  return data;
}

export async function createScenario(scenario: Scenario): Promise<ApiResponse<Scenario>> {
  const response = await fetch(`${serverUrl}/v1/scenarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(scenario),
  });

  if (!response.ok) {
    throw new Error("Failed to create scenario");
  }

  const data: ApiResponse<Scenario> = await response.json();
  return data;
}

export async function updateScenario(
  scenarioId: string,
  scenario: Scenario
): Promise<ApiResponse<Scenario>> {
  const response = await fetch(`${serverUrl}/v1/scenarios/${scenarioId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(scenario),
  });

  if (!response.ok) {
    throw new Error(`Failed to update scenario with id ${scenarioId}`);
  }

  const data: ApiResponse<Scenario> = await response.json();
  return data;
}

export async function deleteScenario(scenarioID: string): Promise<ApiResponse<string>> {
  const response = await fetch(`${serverUrl}/v1/scenarios/${scenarioID}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete scenario with id ${scenarioID}`);
  }

  const data: ApiResponse<string> = await response.json();
  return data;
}
