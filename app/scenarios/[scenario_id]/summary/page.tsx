"use client";

import { motion } from "motion/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getScenario } from "~/lib/api";
import { generateEvaluation } from "~/lib/evaluation";
import { EvaluationResult, Transcription } from "~/types/evaluation";

export default function ScenarioSummaryPage() {
  const params = useParams();
  const scenario_id = params.scenario_id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);

  useEffect(() => {
    const fetchScenarioAndEvaluate = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const data = await getScenario(scenario_id);
        // Generate evaluation using mock transcriptions for now
        // In a real app, you would fetch actual transcriptions from your API
        const mockTranscriptions: Transcription[] = [
          {
            id: "1",
            text: "Hi, I'm calling about our software solution that could help with your current challenges.",
            startTime: 0,
            endTime: 5000,
            final: true,
            language: "en",
            firstReceivedTime: Date.now(),
            lastReceivedTime: Date.now(),
            receivedAtMediaTimestamp: 0,
            receivedAt: Date.now(),
            role: "user",
          },
          {
            id: "2",
            text: "I'm not sure we have the budget for new software right now.",
            startTime: 5000,
            endTime: 8000,
            final: true,
            language: "en",
            firstReceivedTime: Date.now(),
            lastReceivedTime: Date.now(),
            receivedAtMediaTimestamp: 5000,
            receivedAt: Date.now(),
            role: "assistant",
          },
        ];
        const transcriptions = sessionStorage.getItem("transcriptions");

        if (data.data.persona && data.data.scenarios[0]) {
          const evaluation = await generateEvaluation(
            data.data.persona,
            data.data.scenarios[0],
            transcriptions ? JSON.parse(transcriptions) : mockTranscriptions
          );
          setEvaluationResult(evaluation);
        }
      } catch (error) {
        console.error("Failed to fetch scenario or generate evaluation:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScenarioAndEvaluate();
  }, [params.scenario_id]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="animate-spin h-12 w-12 border-b-2 border-emerald-500 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your evaluation...</p>
        </motion.div>
      </div>
    );
  }

  // Show error state
  if (isError || !evaluationResult) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center p-8 bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-sm"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-red-600 mb-4">Failed to load evaluation</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  const { userData, talkingPoints, performanceMetrics, sessionData } = evaluationResult;

  return (
    <motion.div
      className="container mx-auto bg-white min-h-screen rounded-t-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative text-center bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-900 px-8 py-10 rounded-b-lg">
        <div className="relative">
          <motion.div
            className="inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 text-sm font-semibold mb-4 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            🎯 Session Complete
          </motion.div>
          <motion.h1
            className="text-3xl font-bold mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            You&apos;re Ready, {userData.name}!
          </motion.h1>
          <p className="text-lg text-emerald-800 mb-8">
            {userData.company} • {userData.meetingTime}
          </p>
          <motion.div
            className="mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <motion.div
              className="relative w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center border-2 border-white rounded-full shadow-md"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute w-20 h-20 bg-white rounded-full"></div>
              <div className="relative text-2xl font-bold text-emerald-700">
                {userData.readinessScore}%
              </div>
            </motion.div>
            <div className="font-semibold text-emerald-800">Ready for {userData.company}</div>
          </motion.div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-brand-50 to-brand-100 border-b border-gray-200 p-8 rounded-lg my-4 mx-4">
        <h2 className="text-xl font-bold text-brand-900 text-center mb-4">
          💪 Your Winning Talking Points
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {talkingPoints.map((point, index) => (
            <motion.div
              key={index}
              className="bg-white p-5 border-l-4 border-emerald-500 cursor-pointer rounded-lg shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-6 h-6 bg-emerald-500 text-white flex items-center justify-center text-xs font-bold mb-2 rounded-full">
                {index + 1}
              </div>
              <div className="font-semibold text-gray-900 mb-1">{point.title}</div>
              <div className="text-sm text-gray-500">&quot;{point.description}&quot;</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">📊 Performance Breakdown</h2>
          <div className="bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-600 px-3 py-1 text-sm font-semibold rounded-full">
            {userData.improvement}
          </div>
        </div>
        <div className="grid gap-4">
          {performanceMetrics.map((metric, index) => {
            const colorClass = {
              emerald: "bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-500",
              yellow: "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-500",
              red: "bg-gradient-to-r from-red-50 to-red-100 border-red-500",
            };
            return (
              <motion.div
                key={index}
                className={`p-5 border-l-4 rounded-lg shadow-sm ${colorClass[metric.color as keyof typeof colorClass]}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold text-gray-800">{metric.category}</div>
                  <div
                    className={`text-xl font-bold text-${metric.color === "red" ? "red-500" : metric.color === "yellow" ? "yellow-500" : "emerald-600"}`}
                  >
                    {metric.score}/100
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2">{metric.feedback}</div>
                <div className="text-sm italic text-gray-400 bg-white/60 p-2 rounded-md">
                  {metric.color === "emerald" ? "💡" : "⚠️"} &quot;{metric.insight}&quot;
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="p-8 bg-gradient-to-r from-yellow-50 to-yellow-100 m-4 rounded-lg">
        <h3 className="text-lg font-bold text-orange-900 mb-4 flex items-center gap-2">
          💡 Key Insight from This Session
        </h3>
        <motion.div
          className="bg-white/70 p-5 border-l-4 border-yellow-500 text-orange-900 leading-relaxed rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {sessionData.keyInsight}
        </motion.div>
      </div>

      <div className="p-8 bg-gradient-to-r from-slate-50 to-slate-100 text-center rounded-lg m-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">{sessionData.callStatus}</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <motion.a
            href="#"
            className="px-6 py-4 font-semibold text-white bg-gradient-to-r from-brand-500 to-brand-600 cursor-pointer rounded-lg shadow-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            ❤️ I&apos;M READY FOR THE CALL
          </motion.a>
          <motion.a
            href="#"
            className="px-6 py-4 font-semibold text-gray-800 border-2 border-gray-200 bg-white cursor-pointer rounded-lg shadow-sm"
            whileHover={{ scale: 1.05, backgroundColor: "#f9fafb" }}
            whileTap={{ scale: 0.98 }}
          >
            🎭 ONE MORE FULL PRACTICE
          </motion.a>
          <motion.a
            href="#"
            className="px-6 py-4 font-semibold text-gray-800 border-2 border-gray-200 bg-white cursor-pointer rounded-lg shadow-sm"
            whileHover={{ scale: 1.05, backgroundColor: "#f9fafb" }}
            whileTap={{ scale: 0.98 }}
          >
            💬 ASK ABOUT MY FEEDBACK
          </motion.a>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-around text-center bg-gradient-to-r from-slate-100 to-slate-200 px-8 py-6 gap-4 rounded-lg m-4">
        <motion.div
          className="flex-1"
          whileHover={{ y: -3 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="block text-lg font-bold text-gray-900">{sessionData.duration}</span>
          <span className="text-xs text-slate-500 uppercase tracking-wide">Duration</span>
        </motion.div>
        <motion.div
          className="flex-1"
          whileHover={{ y: -3 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="block text-lg font-bold text-gray-900">
            {sessionData.practicePartner}
          </span>
          <span className="text-xs text-slate-500 uppercase tracking-wide">Practice Partner</span>
        </motion.div>
        <motion.div
          className="flex-1"
          whileHover={{ y: -3 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="block text-lg font-bold text-gray-900">{sessionData.scenario}</span>
          <span className="text-xs text-slate-500 uppercase tracking-wide">Scenario</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
