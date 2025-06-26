"use client";

import ActivityRenderer from "@/components/ActivityRenderer";
import { LearningChatComponent } from "@/components/LearningChat";
import { getLearningPath } from "@/lib/api";
import { LearningPath } from "@/types/learning-path";
import { CheckCircle, ChevronLeft, ChevronRight, Circle, Home } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LearningPathPage() {
  const params = useParams();
  const pathId = params.path_id as string;

  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
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

      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentActivityIndex((prev) => prev + 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const handlePrevious = () => {
    if (currentActivityIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentActivityIndex((prev) => prev - 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const handleActivitySelect = (index: number) => {
    if (index !== currentActivityIndex) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentActivityIndex(index);
        setIsTransitioning(false);
      }, 150);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !learningPath) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-2">⚠️ Error</div>
          <p className="text-gray-700">{error || "Learning path not found"}</p>
          <Link
            href="/learning-paths"
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Learning Paths
          </Link>
        </div>
      </div>
    );
  }

  const currentActivity = learningPath.activities[currentActivityIndex];
  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Fireworks Celebration */}
      {showCelebration && (
        <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
          {/* Fireworks particles */}
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F"][
                  Math.floor(Math.random() * 6)
                ],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            />
          ))}

          {/* Celebration message */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-12 py-8 rounded-3xl shadow-2xl animate-bounce">
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold mb-2">Congratulations!</h2>
                <p className="text-xl">You&apos;ve completed the learning path!</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-500/20 to-teal-500/20"></div>
      </div>

      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link
              href="/learning-paths"
              className="flex items-center text-white/80 hover:text-white transition-all duration-300 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm"
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
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-300"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-6 pb-4">
          <div className="w-full bg-white/20 rounded-full h-1">
            <div
              className="bg-gradient-to-r from-brand-500 to-teal-500 h-1 rounded-full transition-all duration-500"
              style={{
                width: `${((currentActivityIndex + 1) / learningPath.activities.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex h-full pt-20">
        {/* Sidebar - Activity List */}
        <div
          className={`bg-black/30 backdrop-blur-sm border-r border-white/10 overflow-y-auto custom-scrollbar flex flex-col transition-all duration-300 ${
            sidebarCollapsed ? "w-16" : "w-80"
          }`}
        >
          {!sidebarCollapsed ? (
            // Full Sidebar
            <>
              <div className="p-6 flex-1">
                <h3 className="text-white font-bold text-lg mb-6">Activities</h3>
                <div className="space-y-3">
                  {learningPath.activities.map((activity, index) => (
                    <button
                      key={activity.activity_id}
                      onClick={() => handleActivitySelect(index)}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                        index === currentActivityIndex
                          ? "bg-gradient-to-r from-brand-500/20 to-teal-500/20 border border-brand-400/30 text-white"
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
                    </button>
                  ))}
                </div>
              </div>

              {/* Collapse Button */}
              <div className="p-4 border-t border-white/10">
                <button
                  onClick={() => setSidebarCollapsed(true)}
                  className="w-full flex items-center justify-center px-4 py-3 text-white/70 hover:text-white transition-all duration-300 bg-white/5 hover:bg-white/10 rounded-xl backdrop-blur-sm"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Collapse</span>
                </button>
              </div>
            </>
          ) : (
            // Minimal Sidebar
            <>
              <div className="p-3 flex-1">
                <div className="space-y-3">
                  {learningPath.activities.map((activity, index) => (
                    <button
                      key={activity.activity_id}
                      onClick={() => handleActivitySelect(index)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        index === currentActivityIndex
                          ? "bg-gradient-to-r from-brand-500/30 to-teal-500/30 border border-brand-400/50 text-white"
                          : "bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-white/20"
                      }`}
                      title={activity.title}
                    >
                      {completedActivities.has(activity.activity_id) ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Expand Button */}
              <div className="p-3 border-t border-white/10">
                <button
                  onClick={() => setSidebarCollapsed(false)}
                  className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-sm"
                  title="Expand sidebar"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Main Slide Content */}
        <div className={`flex-1 relative`}>
          {/* Previous Button - Left Edge */}
          <button
            onClick={handlePrevious}
            disabled={currentActivityIndex === 0}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 text-white/70 hover:text-white disabled:text-white/20 disabled:cursor-not-allowed transition-all duration-300 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm disabled:bg-white/5"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button - Right Edge */}
          {currentActivityIndex < learningPath.activities.length - 1 ? (
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-gradient-to-r from-brand-500 to-teal-600 text-white rounded-full hover:from-brand-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          ) : (
            <button
              onClick={() => handleActivityComplete(currentActivity.activity_id)}
              disabled={completedActivities.has(currentActivity.activity_id)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-sm"
            >
              {completedActivities.has(currentActivity.activity_id)
                ? "✓ Completed"
                : "Mark Complete"}
            </button>
          )}

          {/* Activity Content */}
          <div className="flex-1 h-full overflow-hidden p-6">
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-white to-brand-50/30 backdrop-blur-sm rounded-2xl shadow-xl p-10 border border-white/50 transform transition-all duration-500 hover:shadow-2xl relative overflow-y-auto custom-scrollbar">
              <div
                className={`transition-all duration-300 ease-in-out transform h-full  ${
                  isTransitioning
                    ? "opacity-0 scale-95 translate-y-4"
                    : "opacity-100 scale-100 translate-y-0"
                }`}
              >
                <ActivityRenderer
                  activity={currentActivity}
                  onComplete={() => handleActivityComplete(currentActivity.activity_id)}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  showNavigation={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Chat Sidebar - Fixed Right */}
        <div className="w-96 bg-black/30 backdrop-blur-sm border-l border-white/10">
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
