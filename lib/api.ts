import { ApiResponse, ListResponse } from "@/types/api";
import { Program, Scenario } from "@/types/scenario";

const API_BASE_URL = "https://lamigo-api.rockship.co/api";

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
