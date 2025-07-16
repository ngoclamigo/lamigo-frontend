"use client";

import { BookOpen } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getScenarios } from "~/network/scenarios";
import type { Scenario } from "~/types/scenario";
import { getCallTypeLabel, getIntentTypeLabel, getLeadStageCategoryLabel } from "~/utils/label";

export default function ScenariosPage() {
  const [scenarioId, setScenarioId] = useState("");
  const router = useRouter();

  const [scenarios, setScenarios] = useState<Scenario[]>([]);
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6"
    >
      <motion.h1
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl font-bold mb-6"
      >
        Available Scenarios
      </motion.h1>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-36 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      )}

      {isError && (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4"
        >
          Failed to load scenarios. Please try again later.
        </motion.div>
      )}

      {!isLoading && !isError && scenarios.length === 0 && (
        <p className="text-gray-500">No scenarios available.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map((scenario, index) => (
          <motion.div
            key={scenario.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="border rounded-xl p-5 bg-white hover:shadow-lg transition-all"
            whileHover={{ scale: 1.02 }}
          >
            <div className="space-y-4">
              {/* Header with icon */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <h2 className="font-semibold text-gray-900">{scenario.persona.buyer_identity.name}</h2>
                </div>
                <div className="text-sm text-gray-600">
                  <p>{scenario.persona.buyer_identity.title}</p>
                  <p>{scenario.persona.buyer_identity.company}</p>
                </div>
              </div>

              {/* Tags section */}
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                  {getLeadStageCategoryLabel(scenario.scenarios.category)}
                </span>
                <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md">
                  {getCallTypeLabel(scenario.scenarios.call_type)}
                </span>
                <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-md">
                  {getIntentTypeLabel(scenario.scenarios.intent)}
                </span>
              </div>

              {/* Time info */}
              <div className="text-sm text-gray-600">
                Duration: {Number(scenario.scenarios.time_limit) / 60} minutes
              </div>

              {/* Action button */}
              <Link
                href={`/scenarios/${scenario.id}`}
                className="block w-full text-center py-2 mt-2 bg-muted text-primary rounded-lg hover:bg-accent transition-colors"
              >
                Start Practice →
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 p-5 border rounded-xl bg-gradient-to-r from-white via-muted to-white shadow-sm"
      >
        <h2 className="text-xl font-semibold mb-4">Access by ID</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={scenarioId}
            onChange={(e) => setScenarioId(e.target.value)}
            placeholder="Enter scenario ID"
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary outline-none"
          />
          <motion.button
            onClick={handleRedirect}
            disabled={!scenarioId.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-primary text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Go
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
