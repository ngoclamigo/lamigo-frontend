"use client";

import { useEffect, useState } from 'react';
import { LearningProgress, LearningAchievement } from '@/types/learning-path';
import { getLearningProgress, getLearningAchievements } from '@/lib/api';
import { Trophy, Clock, CheckCircle, Target } from 'lucide-react';

export function ProgressDashboard() {
  const [progress, setProgress] = useState<LearningProgress[]>([]);
  const [achievements, setAchievements] = useState<LearningAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progressResponse, achievementsResponse] = await Promise.all([
          getLearningProgress(),
          getLearningAchievements()
        ]);

        if (progressResponse.status === 'success') {
          setProgress(progressResponse.data);
        }
        if (achievementsResponse.status === 'success') {
          setAchievements(achievementsResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-64"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const totalTimeSpent = progress.reduce((total, p) => total + p.time_spent_minutes, 0);
  const completedActivities = progress.filter(p => p.status === 'completed').length;

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-brand-600 bg-clip-text text-transparent mb-4">
          Your Learning Journey
        </h2>
        <p className="text-gray-600 text-lg">Track your progress and celebrate your achievements</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/50 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex items-center relative z-10">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-5 rounded-3xl shadow-lg">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div className="ml-6">
              <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Completed</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {completedActivities}
              </p>
              <p className="text-xs text-gray-500 mt-1">Activities finished</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/50 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-teal-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex items-center relative z-10">
            <div className="bg-gradient-to-br from-brand-500 to-teal-600 p-5 rounded-3xl shadow-lg">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <div className="ml-6">
              <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Time Spent</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-brand-600 to-teal-600 bg-clip-text text-transparent">
                {Math.round(totalTimeSpent / 60)}h
              </p>
              <p className="text-xs text-gray-500 mt-1">Hours learning</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/50 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex items-center relative z-10">
            <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-5 rounded-3xl shadow-lg">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div className="ml-6">
              <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Achievements</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                {achievements.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Badges earned</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/50 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-teal-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex items-center relative z-10">
            <div className="bg-gradient-to-br from-brand-500 to-teal-600 p-5 rounded-3xl shadow-lg">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div className="ml-6">
              <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Total Points</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-brand-600 to-teal-600 bg-clip-text text-transparent">
                {achievements.reduce((total, a) => total + (a.points || 0), 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Points collected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Details */}
      {progress.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-50/30 to-teal-50/30 opacity-50"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {progress.slice(0, 5).map((item) => (
                <div key={item.progress_id}
                     className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50/80 to-white/80 rounded-2xl border border-gray-200/50 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full shadow-lg ${
                      item.status === 'completed' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                      item.status === 'in_progress' ? 'bg-gradient-to-r from-brand-500 to-teal-500' :
                      'bg-gray-400'
                    }`}></div>
                    <div>
                      <p className="font-semibold text-gray-800">{item.activity_id}</p>
                      <p className="text-sm text-gray-600 capitalize font-medium">{item.status.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-20 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-brand-500 to-teal-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${item.completion_percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-gray-800">{item.completion_percentage}%</span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">{item.time_spent_minutes}m spent</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/30 to-orange-50/30 opacity-50"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">Recent Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement) => (
                <div key={achievement.achievement_id}
                     className="flex items-center space-x-5 p-6 bg-gradient-to-r from-yellow-50/80 via-orange-50/80 to-yellow-50/80 rounded-2xl border border-yellow-200/50 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 via-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-xl">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 text-lg mb-1">{achievement.title}</h4>
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">{achievement.description}</p>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs px-3 py-2 bg-gradient-to-r from-yellow-200 to-orange-200 text-yellow-800 rounded-full capitalize font-semibold shadow-sm">
                        {achievement.type.replace('_', ' ')}
                      </span>
                      {achievement.points && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-2 rounded-full font-semibold">
                          +{achievement.points} points
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
