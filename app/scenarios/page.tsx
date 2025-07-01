"use client";

import { BookOpen } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getScenarios } from "~/lib/api";
import { Scenario } from "~/types/scenario";

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
        className="text-3xl font-bold mb-6"
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
            className="border rounded-xl p-4 cursor-pointer hover:shadow-md transition bg-gradient-to-br from-white to-brand-50"
            whileHover={{ scale: 1.02 }}
            onClick={() => router.push(`/scenarios/${scenario.id}`)}
          >
            <div className="flex items-center gap-2 mb-2">
              <motion.div whileHover={{ rotate: 15 }}>
                <BookOpen className="h-5 w-5 text-brand-500" />
              </motion.div>
              <h2 className="text-xl font-semibold">{scenario.scenarios[0].name}</h2>
            </div>
            <p className="text-gray-600 text-sm mb-3 line-clamp-3 leading-relaxed">
              {scenario.scenarios[0].description || "No description available"}
            </p>
            <Link
              href={`/scenarios/${scenario.id}`}
              className="text-sm text-brand-500 hover:text-brand-700 font-medium"
            >
              View details →
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 p-5 border rounded-xl bg-gradient-to-r from-white via-brand-50 to-white shadow-sm"
      >
        <h2 className="text-xl font-semibold mb-4">Access by ID</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={scenarioId}
            onChange={(e) => setScenarioId(e.target.value)}
            placeholder="Enter scenario ID"
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-300 focus:border-brand-500 outline-none"
          />
          <motion.button
            onClick={handleRedirect}
            disabled={!scenarioId.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Go
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
