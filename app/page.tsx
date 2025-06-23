"use client";

import { type GetScenariosResponse, getScenarios } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ScenariosPage() {
  const [scenarioId, setScenarioId] = useState("");
  const router = useRouter();

  const [scenarios, setScenarios] = useState<GetScenariosResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchScenarios = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const data = await getScenarios();
        setScenarios(data.data);
      } catch (error) {
        console.error("Failed to fetch scenarios:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScenarios();
  }, []);

  const handleRedirect = () => {
    if (scenarioId.trim()) {
      router.push(`/scenarios/${encodeURIComponent(scenarioId.trim())}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="w-full max-w-md space-y-6 p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">Scenario Lookup</h1>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isError ? (
          <div className="text-center text-red-500 py-4">
            Failed to load scenarios. Please try again.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex gap-2">
              <select
                value={scenarioId}
                onChange={(e) => setScenarioId(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              >
                <option value="">Select a scenario</option>
                {scenarios.map((scenario) => (
                  <option key={scenario.id} value={scenario.id}>
                    {scenario.persona.name || scenario.id}
                  </option>
                ))}
              </select>
              <button
                onClick={handleRedirect}
                disabled={!scenarioId.trim()}
                className="px-6 py-3 text-white bg-brand-500 rounded-md hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-gray-300 transition-colors"
              >
                Go
              </button>
            </div>

            <div className="text-sm text-gray-500 text-center">Or enter scenario ID manually:</div>

            <div className="flex gap-2">
              <input
                type="text"
                value={scenarioId}
                onChange={(e) => setScenarioId(e.target.value)}
                placeholder="Enter scenario ID"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
              <button
                onClick={handleRedirect}
                disabled={!scenarioId.trim()}
                className="px-6 py-3 text-white bg-brand-500 rounded-md hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-gray-300 transition-colors"
              >
                Go
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
