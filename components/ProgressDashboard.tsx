"use client";

import { CheckCircle, Clock, Target, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { getLearningAchievements, getLearningProgress } from "~/network/programs";
import { ProgramAchievement, ProgramProgress } from "~/types/program";

export function ProgressDashboard() {
  const [progress, setProgress] = useState<ProgramProgress[]>([]);
  const [achievements, setAchievements] = useState<ProgramAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progressResponse, achievementsResponse] = await Promise.all([
          getLearningProgress(),
          getLearningAchievements(),
        ]);

        if (progressResponse.status === "success") {
          setProgress(progressResponse.data);
        }
        if (achievementsResponse.status === "success") {
          setAchievements(achievementsResponse.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded-full w-64 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const totalTimeSpent = progress.reduce((total, p) => total + p.time_spent_minutes, 0);
  const completedActivities = progress.filter((p) => p.status === "completed").length;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold text-primary mb-4">Your Learning Journey</h2>
        <p className="text-gray-600 text-lg">Track your progress and celebrate your achievements</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-white to-green-50 p-6 rounded-2xl shadow border border-gray-100"
        >
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-green-400 to-green-600 p-4 rounded-xl">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm font-semibold">Completed</p>
              <p className="text-3xl font-bold text-green-600">{completedActivities}</p>
              <p className="text-xs text-gray-500 mt-1">Activities finished</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-white to-muted p-6 rounded-2xl shadow border border-gray-100"
        >
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-ring to-primary p-4 rounded-xl">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm font-semibold">Time Spent</p>
              <p className="text-3xl font-bold text-primary">{Math.round(totalTimeSpent / 60)}h</p>
              <p className="text-xs text-gray-500 mt-1">Hours learning</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-white to-yellow-50 p-6 rounded-2xl shadow border border-gray-100"
        >
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 rounded-xl">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm font-semibold">Achievements</p>
              <p className="text-3xl font-bold text-yellow-600">{achievements.length}</p>
              <p className="text-xs text-gray-500 mt-1">Badges earned</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-white to-muted p-6 rounded-2xl shadow border border-gray-100"
        >
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-ring to-primary p-4 rounded-xl">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm font-semibold">Total Points</p>
              <p className="text-3xl font-bold text-primary">
                {achievements.reduce((total, a) => total + (a.points || 0), 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Points collected</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Progress Details */}
      {progress.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow border border-gray-100 p-6"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {progress.slice(0, 5).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      item.status === "completed"
                        ? "bg-green-500"
                        : item.status === "in_progress"
                          ? "bg-muted0"
                          : "bg-gray-400"
                    }`}
                  ></div>
                  <div>
                    <p className="font-semibold text-gray-800">{item.activity_id}</p>
                    <p className="text-sm text-gray-600 capitalize">
                      {item.status.replace("_", " ")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.completion_percentage}%` }}
                        transition={{ duration: 1, delay: 0.2 * index }}
                        className="bg-gradient-to-r from-ring to-primary h-2 rounded-full"
                      ></motion.div>
                    </div>
                    <span className="text-sm font-bold text-gray-800">
                      {item.completion_percentage}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{item.time_spent_minutes}m spent</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-gradient-to-br from-white to-yellow-50 rounded-2xl shadow border border-gray-100 p-6"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Recent Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-200"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 text-lg">{achievement.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full capitalize">
                      {achievement.type.replace("_", " ")}
                    </span>
                    {achievement.points && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        +{achievement.points} points
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
