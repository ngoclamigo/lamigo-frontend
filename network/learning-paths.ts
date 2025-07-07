/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getLearningPaths() {
  const response = await fetch("/api/learning-paths", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch learning paths");
  }
  const data = await response.json();
  return data.data || [];
}

export async function createLearningPath(learningPath: { title: string; description: string }) {
  const response = await fetch("/api/learning-paths", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(learningPath),
  });
  if (!response.ok) {
    throw new Error("Failed to create learning path");
  }
  const data = await response.json();
  return data.data;
}

export async function deleteLearningPath(pathId: string) {
  const response = await fetch(`/api/learning-paths/${pathId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete learning path");
  }
  const data = await response.json();
  return data;
}

export async function updateLearningPath(
  pathId: string,
  updates: { name?: string; description?: string }
) {
  const response = await fetch(`/api/learning-paths/${pathId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error("Failed to update learning path");
  }
  const data = await response.json();
  return data.data;
}

export async function generateActivities(pathId: string, payload: any) {
  const response = await fetch(`/api/learning-paths/${pathId}/activities/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("Failed to generate activities");
  }
  const data = await response.json();
  return data.data;
}

export async function createActivities(
  pathId: string,
  activities: Array<{
    title: string;
    description: string;
    type: string;
    config: Record<string, any>;
  }>
) {
  const response = await fetch(`/api/learning-paths/${pathId}/activities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ activities }),
  });
  if (!response.ok) {
    throw new Error("Failed to create activities");
  }
  const data = await response.json();
  return data.data;
}
