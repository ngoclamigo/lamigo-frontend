"use client";

import { CheckCircle, ChevronLeft, ChevronRight, Circle, Home } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ActivityRenderer } from "~/components/ActivityRenderer";
import { LearningChatComponent } from "~/components/LearningChat";
import { getLearningPath } from "~/lib/api";
import type { LearningPath, SlideConfig } from "~/types/learning-path";

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
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

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

  const handleNext = (activityID: string) => {
    if (!completedActivities.has(activityID)) {
      setCompletedActivities((prev) => new Set(prev).add(activityID));
    }

    if (currentActivityIndex < learningPath.activities.length - 1) {
      setCurrentActivityIndex((prev) => prev + 1);
    } else {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 4000);
    }
  };

  const handleActivitySelect = (index: number) => {
    if (index !== currentActivityIndex && learningPath) {
      // Only allow navigation to activities that are unlocked
      const activityId = learningPath.activities[index].id;

      // Allow going back to any previous activity or completed activities
      if (index <= currentActivityIndex || completedActivities.has(activityId)) {
        setCurrentActivityIndex(index);
      } else {
        // Check if previous activities are completed to unlock this one
        const allPreviousCompleted = learningPath.activities
          .slice(0, index)
          .every((activity) => completedActivities.has(activity.id));

        if (allPreviousCompleted) {
          setCurrentActivityIndex(index);
        }
      }
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-700 to-slate-900 relative overflow-hidden">
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
                  {learningPath.activities.map((activity, index) => {
                    const isCompleted = completedActivities.has(activity.id);
                    const isCurrentActivity = index === currentActivityIndex;
                    const allPreviousCompleted = learningPath.activities
                      .slice(0, index)
                      .every((act) => completedActivities.has(act.id));
                    const isUnlocked = index === 0 || allPreviousCompleted || isCompleted;

                    return (
                      <motion.button
                        key={activity.id}
                        whileHover={{ scale: isUnlocked ? 1.02 : 1 }}
                        whileTap={{ scale: isUnlocked ? 0.98 : 1 }}
                        onClick={() => handleActivitySelect(index)}
                        disabled={!isUnlocked}
                        className={`w-full text-left p-3 transition-all duration-300 rounded-lg ${
                          isCurrentActivity
                            ? "bg-gradient-to-r from-brand-500/20 to-brand-600/20 border border-brand-400/30 text-white"
                            : isUnlocked
                              ? "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
                              : "bg-white/5 text-white/30 border border-white/5 cursor-not-allowed opacity-50"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                          ) : isUnlocked ? (
                            <Circle className="w-5 h-5 flex-shrink-0" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                              <div className="w-2 h-2 bg-white/20 rounded-full" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{activity.title}</p>
                            <p className="text-xs opacity-70 capitalize">{activity.type}</p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
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
                  {learningPath.activities.map((activity, index) => {
                    const isCompleted = completedActivities.has(activity.id);
                    const isCurrentActivity = index === currentActivityIndex;
                    const allPreviousCompleted = learningPath.activities
                      .slice(0, index)
                      .every((act) => completedActivities.has(act.id));
                    const isUnlocked = index === 0 || allPreviousCompleted || isCompleted;

                    return (
                      <motion.button
                        key={activity.id}
                        whileHover={{ scale: isUnlocked ? 1.1 : 1 }}
                        whileTap={{ scale: isUnlocked ? 0.9 : 1 }}
                        onClick={() => handleActivitySelect(index)}
                        disabled={!isUnlocked}
                        className={`w-8 h-8 flex items-center justify-center transition-all duration-300 rounded-full ${
                          isCurrentActivity
                            ? "bg-gradient-to-r from-brand-500/30 to-brand-600/30 border border-brand-400/50 text-white"
                            : isUnlocked
                              ? "bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-white/20"
                              : "bg-white/5 text-white/20 border border-white/10 cursor-not-allowed opacity-50"
                        }`}
                        title={`${activity.title} ${!isUnlocked ? "(Locked)" : ""}`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : isUnlocked ? (
                          <Circle className="w-4 h-4" />
                        ) : (
                          <div className="w-3 h-3 rounded-full border border-white/20 flex items-center justify-center">
                            <div className="w-1 h-1 bg-white/20 rounded-full" />
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
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

        {/* Activity Content */}
        <div className="flex-1 h-full overflow-hidden p-4 relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="h-full w-full flex items-center justify-center bg-white shadow-lg p-6 border border-white/50 rounded-xl overflow-y-auto relative"
          >
            {/* Celebration positioned within activity area */}
            {showCelebration && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{ opacity: 0, scale: 0.8, y: -50 }}
                transition={{
                  duration: 0.6,
                }}
                className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
              >
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                    scale: [1, 1.02, 1],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 text-emerald-800 px-10 py-8 rounded-3xl shadow-xl border border-emerald-200/60 backdrop-blur-sm relative overflow-hidden"
                >
                  {/* Subtle background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-2 left-4 w-16 h-16 bg-emerald-300 rounded-full blur-xl"></div>
                    <div className="absolute bottom-4 right-6 w-12 h-12 bg-green-300 rounded-full blur-lg"></div>
                  </div>

                  <div className="text-center relative z-10">
                    <motion.div
                      className="text-5xl mb-4"
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      🎉
                    </motion.div>
                    <motion.h2
                      className="text-2xl font-bold mb-3 text-emerald-700"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                    >
                      Congratulations!
                    </motion.h2>
                    <motion.p
                      className="text-emerald-600 font-medium"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                    >
                      You&apos;ve completed the learning path!
                    </motion.p>
                  </div>

                  {/* Firework effects */}
                  <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute"
                        initial={{
                          x: "50%",
                          y: "50%",
                          opacity: 0,
                        }}
                        animate={{
                          x: `${Math.cos((i * (Math.PI * 2)) / 12) * 150 + 50}%`,
                          y: `${Math.sin((i * (Math.PI * 2)) / 12) * 150 + 50}%`,
                          opacity: [0, 1, 0],
                          scale: [0.2, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: 3,
                          repeatType: "reverse",
                          delay: i * 0.1,
                          ease: "easeOut",
                        }}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-${["pink", "emerald", "amber", "indigo", "blue"][i % 5]}-400`}
                        ></div>
                      </motion.div>
                    ))}

                    {[...Array(15)].map((_, i) => (
                      <motion.div
                        key={`spark-${i}`}
                        className="absolute"
                        initial={{
                          x: "50%",
                          y: "50%",
                          opacity: 0,
                          scale: 0,
                        }}
                        animate={{
                          x: `${Math.random() * 100}%`,
                          y: `${Math.random() * 100}%`,
                          opacity: [0, 1, 0],
                          scale: [0, 0.8, 0],
                        }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          repeatDelay: Math.random() * 2,
                          delay: i * 0.2,
                        }}
                      >
                        <div className="text-xl">✨</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

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
                onNext={() => handleNext(currentActivity.id)}
                isCompleted={completedActivities.has(currentActivity.id)}
                isLastActivity={currentActivityIndex === learningPath.activities.length - 1}
                isAudioPlaying={isAudioPlaying}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Chat Sidebar - Fixed Right */}
        <div className="w-96 bg-white/5 backdrop-blur-sm border-l border-white/10 rounded-tl-xl">
          <div className="h-full">
            <LearningChatComponent
              topic={learningPath.title}
              narration={
                currentActivity.type === "slide"
                  ? (currentActivity.config as SlideConfig).narration
                  : undefined
              }
              onPlayingStateChange={setIsAudioPlaying}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
