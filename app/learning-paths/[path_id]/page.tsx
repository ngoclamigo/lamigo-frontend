"use client";

import { CheckCircle, ChevronLeft, ChevronRight, Circle, Home } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ActivityRenderer } from "~/components/ActivityRenderer";
import { LearningChatComponent } from "~/components/LearningChat";
import { getLearningPath } from "~/lib/api";
import { LearningPath } from "~/types/learning-path";

export default function LearningPathPage() {
  const params = useParams();
  const pathId = params.path_id as string;

  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const fetchLearningPath = async () => {
      try {
        const response = await getLearningPath(pathId);
        if (response.status === "success") {
          setLearningPath(response.data);
        } else {
          setError("Failed to load learning path");
        }
      } catch (err) {
        setError("Failed to load learning path");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPath();
  }, [pathId]);

  const handleActivityComplete = (activityId: string) => {
    setCompletedActivities((prev) => new Set(prev).add(activityId));

    // Check if this is the last activity and show celebration
    if (
      learningPath &&
      activityId === learningPath.activities[learningPath.activities.length - 1].activity_id
    ) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 4000); // Hide after 4 seconds
    }
  };

  const handleNext = () => {
    if (learningPath && currentActivityIndex < learningPath.activities.length - 1) {
      // Mark current activity as complete when moving to next
      const currentActivityId = learningPath.activities[currentActivityIndex].activity_id;
      handleActivityComplete(currentActivityId);
      setCurrentActivityIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentActivityIndex > 0) {
      setCurrentActivityIndex((prev) => prev - 1);
    }
  };

  const handleActivitySelect = (index: number) => {
    if (index !== currentActivityIndex) {
      setCurrentActivityIndex(index);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <motion.div
          className="rounded-full h-16 w-16 border-4 border-indigo-200 border-b-brand-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (error || !learningPath) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg"
        >
          <div className="text-red-600 text-xl mb-2">⚠️ Error</div>
          <p className="text-gray-700">{error || "Learning path not found"}</p>
          <Link
            href="/learning-paths"
            className="mt-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg hover:from-brand-600 hover:to-brand-700 transition-colors shadow-md"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Learning Paths
          </Link>
        </motion.div>
      </div>
    );
  }

  const currentActivity = learningPath.activities[currentActivityIndex];
  return (
    <div className="h-screen bg-gradient-to-br from-slate-700 to-slate-900 relative overflow-hidden">
      {/* Celebration */}
      {showCelebration && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                y: [0, -10, 0],
                boxShadow: [
                  "0 0 0 rgba(34, 197, 94, 0)",
                  "0 0 20px rgba(34, 197, 94, 0.5)",
                  "0 0 0 rgba(34, 197, 94, 0)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 py-8 rounded-xl shadow-lg"
            >
              <div className="text-center">
                <div className="text-5xl mb-3">🎉</div>
                <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
                <p className="text-lg">You&apos;ve completed the learning path!</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <Link
              href="/learning-paths"
              className="flex items-center text-white/80 hover:text-white transition-all duration-300 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-md"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Back</span>
            </Link>
            <div className="text-white">
              <h1 className="text-lg font-bold">{learningPath.title}</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Progress indicator */}
            <div className="text-white/80 text-sm font-medium">
              {currentActivityIndex + 1} / {learningPath.activities.length}
            </div>

            {/* Sidebar toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 bg-white/10 hover:bg-white/20 text-white transition-all duration-300 rounded-md"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-4 pb-3">
          <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${((currentActivityIndex + 1) / learningPath.activities.length) * 100}%`,
              }}
              className="bg-gradient-to-r from-brand-400 to-brand-600 h-1 rounded-full"
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex h-full pt-16">
        {/* Sidebar - Activity List */}
        <motion.div
          animate={{ width: sidebarCollapsed ? "3rem" : "18rem" }}
          className="bg-white/5 backdrop-blur-sm border-r border-white/10 overflow-y-auto flex flex-col transition-all duration-300"
        >
          {!sidebarCollapsed ? (
            // Full Sidebar
            <>
              <div className="p-4 flex-1">
                <h3 className="text-white font-bold text-lg mb-4">Activities</h3>
                <div className="space-y-2">
                  {learningPath.activities.map((activity, index) => (
                    <motion.button
                      key={activity.activity_id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleActivitySelect(index)}
                      className={`w-full text-left p-3 transition-all duration-300 rounded-lg ${
                        index === currentActivityIndex
                          ? "bg-gradient-to-r from-brand-500/20 to-brand-600/20 border border-brand-400/30 text-white"
                          : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {completedActivities.has(activity.activity_id) ? (
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 flex-shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{activity.title}</p>
                          <p className="text-xs opacity-70 capitalize">{activity.type}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Collapse Button */}
              <div className="p-3 border-t border-white/10">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSidebarCollapsed(true)}
                  className="w-full flex items-center justify-center px-3 py-2 text-white/70 hover:text-white transition-all duration-300 bg-white/5 hover:bg-white/10 rounded-lg"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Collapse</span>
                </motion.button>
              </div>
            </>
          ) : (
            // Minimal Sidebar
            <>
              <div className="p-2 flex-1">
                <div className="space-y-2">
                  {learningPath.activities.map((activity, index) => (
                    <motion.button
                      key={activity.activity_id}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleActivitySelect(index)}
                      className={`w-8 h-8 flex items-center justify-center transition-all duration-300 rounded-full ${
                        index === currentActivityIndex
                          ? "bg-gradient-to-r from-brand-500/30 to-brand-600/30 border border-brand-400/50 text-white"
                          : "bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-white/20"
                      }`}
                      title={activity.title}
                    >
                      {completedActivities.has(activity.activity_id) ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Expand Button */}
              <div className="p-2 border-t border-white/10">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSidebarCollapsed(false)}
                  className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 bg-white/5 hover:bg-white/10 rounded-full"
                  title="Expand sidebar"
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </>
          )}
        </motion.div>

        {/* Main Slide Content Area with Navigation */}
        <div className="flex-1 flex">
          {/* Previous Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePrevious}
            disabled={currentActivityIndex === 0}
            className="p-2 text-white/50 hover:text-white/80 disabled:text-white/20 disabled:cursor-not-allowed transition-all duration-200 bg-white/5 hover:bg-white/10 disabled:bg-white/5 rounded"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          {/* Activity Content */}
          <div className="flex-1 h-full overflow-hidden p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="h-full w-full flex items-center justify-center bg-white shadow-lg p-6 border border-white/50 rounded-xl overflow-y-auto"
            >
              <motion.div
                key={currentActivityIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full w-full"
              >
                <ActivityRenderer
                  activity={currentActivity}
                  onComplete={() => handleActivityComplete(currentActivity.activity_id)}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  showNavigation={false}
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Next Button */}
          <motion.button
            whileHover={{ opacity: 0.9 }}
            whileTap={{ opacity: 0.7 }}
            onClick={handleNext}
            className="p-2 text-white/50 hover:text-white/80 disabled:text-white/20 disabled:cursor-not-allowed transition-all duration-200 bg-white/5 hover:bg-white/10 disabled:bg-white/5 rounded"
            disabled={currentActivityIndex >= learningPath.activities.length - 1}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Chat Sidebar - Fixed Right */}
        <div className="w-80 bg-white/5 backdrop-blur-sm border-l border-white/10 rounded-tl-xl">
          <div className="h-full">
            <LearningChatComponent
              learningPathId={pathId}
              currentActivity={currentActivity?.title}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
