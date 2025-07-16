"use client";

import { motion } from "motion/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getScenario } from "~/network/scenarios";
import { FeedbackResponse } from "~/types/learning-outcomes";
import { Scenario } from "~/types/scenario";
import { getCallTypeLabel } from "~/utils/label";

const mockLearnerProfile = {
  role: "Sales Rep",
  industry_focus: "Technology",
  experience_level: "Mid-level",
  historical_performance: {
    avg_core_scores: [75, 80, 70, 65], // [product, communication, discovery, objection]
    improvement_areas: ["objection_handling", "discovery"],
  },
};

export default function ScenarioSummaryPage() {
  const params = useParams();
  const scenario_id = params.scenario_id as string;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedbackResult, setFeedbackResult] = useState<FeedbackResponse | null>(null);
  const [scenario, setScenario] = useState<Scenario | null>(null);

  useEffect(() => {
    const fetchScenarioAndEvaluate = async () => {
      setLoading(true);
      try {
        const { data } = await getScenario(scenario_id);
        setScenario(data);
        const mockTranscriptions = [
          {
            text: "Hi, I'm calling about our software solution that could help with your current challenges.",
            role: "user",
          },
          {
            text: "I'm not sure we have the budget for new software right now.",
            role: "assistant",
          },
        ];
        const transcriptions = sessionStorage.getItem("transcriptions");
        const transcriptionsParsed = transcriptions
          ? JSON.parse(transcriptions)
          : mockTranscriptions;
        const conversation = transcriptionsParsed
          .reduce((acc: string[], curr: any, index: number) => {
            const role = curr.role === "user" ? "LEARNER" : "CLIENT";
            const prev = transcriptionsParsed[index - 1];
            const prevRole = prev?.role === "user" ? "LEARNER" : "CLIENT";

            if (index === 0 || role !== prevRole) {
              // New turn
              acc.push(`${role}: ${curr.text}`);
            } else {
              // Same turn, append to previous
              acc[acc.length - 1] += ` ${curr.text}`;
            }

            return acc;
          }, [])
          .join("\n");

        if (data.persona && data.scenarios) {
          // todo: Replace with actual feedback logic
          const res = await fetch("/api/ai/feedback", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              transcript: conversation,
              learner_profile: mockLearnerProfile,
              scenario_context: data.scenarios,
            }),
          });
          if (!res.ok) {
            throw new Error("Failed to generate feedback");
          }
          const feedback = await res.json();
          console.log("Feedback Result:", feedback);
          setFeedbackResult(feedback.data);
        }
      } catch (error) {
        console.error("Failed to fetch scenario or generate feedback:", error);
        setError("Failed to load scenario or generate feedback");
      } finally {
        setLoading(false);
      }
    };

    fetchScenarioAndEvaluate();
  }, [scenario_id]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="animate-spin h-12 w-12 border-b-2 border-primary rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your practice session...</p>
        </motion.div>
      </div>
    );
  }

  // Show error state
  if (error || !feedbackResult) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center p-8 bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-sm"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-red-600 mb-4">Failed to load feedback</p>
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

  const { winning_talking_points, performance_breakdown, key_insight } = feedbackResult.ui_sections;

  return (
    <motion.div
      className="container mx-auto bg-white min-h-screen rounded-t-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className={`relative text-center px-8 py-10 rounded-b-lg ${
          feedbackResult.readiness_calculation.final_score > 80
            ? "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-900"
            : feedbackResult.readiness_calculation.final_score > 70
              ? "bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-900"
              : feedbackResult.readiness_calculation.final_score > 60
                ? "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-900"
                : "bg-gradient-to-r from-red-50 to-red-100 text-red-900"
        }`}
      >
        <div className="relative">
          <motion.div
            className={`inline-flex items-center gap-2 text-white px-4 py-2 text-sm font-semibold mb-4 rounded-full ${
              feedbackResult.readiness_calculation.final_score > 80
                ? "bg-emerald-500"
                : feedbackResult.readiness_calculation.final_score > 70
                  ? "bg-yellow-500"
                  : feedbackResult.readiness_calculation.final_score > 60
                    ? "bg-orange-500"
                    : "bg-red-500"
            }`}
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
            {feedbackResult.readiness_calculation.final_score > 90
              ? "Exceptional Performance"
              : feedbackResult.readiness_calculation.final_score > 80
                ? "Ready for Live Calls"
                : feedbackResult.readiness_calculation.final_score > 70
                  ? "Minor Improvements Needed"
                  : feedbackResult.readiness_calculation.final_score > 60
                    ? "Additional Practice Recommended"
                    : "Significant Development Required"}
          </motion.h1>
          <p
            className={`text-lg mb-8 ${
              feedbackResult.readiness_calculation.final_score > 80
                ? "text-emerald-800"
                : feedbackResult.readiness_calculation.final_score > 70
                  ? "text-yellow-800"
                  : feedbackResult.readiness_calculation.final_score > 60
                    ? "text-orange-800"
                    : "text-red-800"
            }`}
          >
            {scenario?.persona.buyer_identity.company} • {(Number(scenario?.scenarios.time_limit) || 0) / 60}{" "}
            minutes
          </p>
          <motion.div
            className="mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <motion.div
              className={`relative w-32 h-32 mx-auto mb-4 border-2 border-white rounded-full shadow-md flex items-center justify-center ${
                feedbackResult.readiness_calculation.final_score > 80
                  ? "bg-gradient-to-br from-emerald-100 to-emerald-200"
                  : feedbackResult.readiness_calculation.final_score > 70
                    ? "bg-gradient-to-br from-yellow-100 to-yellow-200"
                    : feedbackResult.readiness_calculation.final_score > 60
                      ? "bg-gradient-to-br from-orange-100 to-orange-200"
                      : "bg-gradient-to-br from-red-100 to-red-200"
              }`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute w-20 h-20 bg-white rounded-full"></div>
              <div
                className={`relative text-2xl font-bold ${
                  feedbackResult.readiness_calculation.final_score > 80
                    ? "text-emerald-700"
                    : feedbackResult.readiness_calculation.final_score > 70
                      ? "text-yellow-700"
                      : feedbackResult.readiness_calculation.final_score > 60
                        ? "text-orange-700"
                        : "text-red-700"
                }`}
              >
                {Math.round(feedbackResult.readiness_calculation.final_score)}%
              </div>
            </motion.div>
            <div
              className={`font-semibold ${
                feedbackResult.readiness_calculation.final_score > 80
                  ? "text-emerald-800"
                  : feedbackResult.readiness_calculation.final_score > 70
                    ? "text-yellow-800"
                    : feedbackResult.readiness_calculation.final_score > 60
                      ? "text-orange-800"
                      : "text-red-800"
              }`}
            >
              {feedbackResult.readiness_calculation.status} -{" "}
              {feedbackResult.readiness_calculation.confidence_level} Confidence
            </div>
          </motion.div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-muted to-accent border-b border-gray-200 p-8 rounded-lg my-4 mx-4">
        <h2 className="text-xl font-bold text-primary text-center mb-4">
          💪 Your Winning Talking Points
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {winning_talking_points.map((point, index: number) => (
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
              <div className="font-semibold text-gray-900 mb-1">{point.context}</div>
              <div className="text-sm text-gray-500">&quot;{point.why_effective}&quot;</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">📊 Performance Breakdown</h2>
        </div>
        <div className="grid gap-4">
          {performance_breakdown.map((metric, index: number) => {
            const colorClass = {
              emerald: "bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-500",
              yellow: "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-500",
              orange: "bg-gradient-to-r from-orange-50 to-orange-100 border-orange-500",
              red: "bg-gradient-to-r from-red-50 to-red-100 border-red-500",
            };

            // Determine color based on score
            const getColorByScore = (score: number) => {
              if (score >= 80) return "emerald";
              if (score >= 70) return "yellow";
              if (score >= 60) return "orange";
              return "red";
            };

            const color = getColorByScore(metric.score);

            return (
              <motion.div
                key={index}
                className={`p-5 border-l-4 rounded-lg shadow-sm ${colorClass[color]}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
              >
                <div className="flex justify-between items-center gap-2 mb-2">
                  <div className="font-semibold text-gray-800">{metric.category}</div>
                  <div
                    className={`ml-auto text-xl font-bold ${color === "red" ? "text-red-500" : color === "yellow" ? "text-yellow-500" : color === "orange" ? "text-orange-600" : "text-emerald-600"}`}
                  >
                    {metric.score}/100
                  </div>
                  {metric.trend && (
                    <div className="text-sm italic text-gray-400 bg-white/60 p-2 rounded-md">
                      {metric.trend.includes("+") ? "💡" : "⚠️"} {metric.trend}
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-600 mb-2">{metric.feedback}</div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="p-8 bg-gradient-to-r from-yellow-50 to-yellow-100 m-4 rounded-lg">
        <h3 className="text-lg font-bold text-orange-900 mb-4 flex items-center gap-2">
          💡 Key Insight from This Session
        </h3>
        <div className="space-y-4">
          <motion.div
            className="bg-white/70 p-5 border-l-4 border-yellow-500 text-orange-900 leading-relaxed rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {key_insight.primary_finding}
          </motion.div>
          <motion.div
            className="bg-white/70 p-5 border-l-4 border-yellow-500 text-orange-900 leading-relaxed rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {key_insight.improvement_area}
          </motion.div>
          <motion.div
            className="bg-white/70 p-5 border-l-4 border-yellow-500 text-orange-900 leading-relaxed rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {key_insight.next_session_focus}
          </motion.div>
        </div>
      </div>

      <div className="p-8 bg-gradient-to-r from-slate-50 to-slate-100 text-center rounded-lg m-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Ready for your next session?</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <motion.a
            href="#"
            className="px-6 py-4 font-semibold text-white bg-gradient-to-r from-ring to-primary cursor-pointer rounded-lg shadow-sm"
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
            🎭{" "}
            {feedbackResult.readiness_calculation.final_score > 90
              ? "Suggest advanced scenarios"
              : feedbackResult.readiness_calculation.final_score > 80
                ? "Proceed with confidence"
                : feedbackResult.readiness_calculation.final_score > 70
                  ? "1-2 more practice sessions"
                  : feedbackResult.readiness_calculation.final_score > 60
                    ? "Focus on weak areas"
                    : "Remedial training path"}
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
          <span className="block text-lg font-bold text-gray-900">
            {Number(scenario?.scenarios.time_limit) / 60} minutes
          </span>
          <span className="text-xs text-slate-500 uppercase tracking-wide">Duration</span>
        </motion.div>
        <motion.div
          className="flex-1"
          whileHover={{ y: -3 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="block text-lg font-bold text-gray-900">{scenario?.persona.buyer_identity.name}</span>
          <span className="text-xs text-slate-500 uppercase tracking-wide">Practice Partner</span>
        </motion.div>
        <motion.div
          className="flex-1"
          whileHover={{ y: -3 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="block text-lg font-bold text-gray-900">
            {scenario?.scenarios.call_type
              ? getCallTypeLabel(scenario.scenarios.call_type)
              : "Unknown"}
          </span>
          <span className="text-xs text-slate-500 uppercase tracking-wide">Scenario</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
