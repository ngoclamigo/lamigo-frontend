"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { LearningPath } from '@/types/learning-path';
import { getLearningPath } from '@/lib/api';
import ActivityRenderer from '@/components/ActivityRenderer';
import { LearningChatComponent } from '@/components/LearningChat';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  BookOpen,
  CheckCircle,
  Circle,
  Home
} from 'lucide-react';
import Link from 'next/link';

export default function LearningPathPage() {
  const params = useParams();
  const pathId = params.path_id as string;

  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const fetchLearningPath = async () => {
      try {
        const response = await getLearningPath(pathId);
        if (response.status === 'success') {
          setLearningPath(response.data);
        } else {
          setError('Failed to load learning path');
        }
      } catch (err) {
        setError('Failed to load learning path');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPath();
  }, [pathId]);

  const handleActivityComplete = (activityId: string) => {
    setCompletedActivities(prev => new Set(prev).add(activityId));
  };

  const handleNext = () => {
    if (learningPath && currentActivityIndex < learningPath.activities.length - 1) {
      setCurrentActivityIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentActivityIndex > 0) {
      setCurrentActivityIndex(prev => prev - 1);
    }
  };

  const handleActivitySelect = (index: number) => {
    setCurrentActivityIndex(index);
  };

  const getProgressPercentage = () => {
    if (!learningPath) return 0;
    return (completedActivities.size / learningPath.activities.length) * 100;
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
          <p className="text-gray-700">{error || 'Learning path not found'}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-brand-100 via-teal-50 to-brand-100 relative overflow-hidden">
      {/* Floating background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-brand-400/10 to-teal-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-teal-400/10 to-brand-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-xl border-b border-white/50 relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link
                href="/learning-paths"
                className="flex items-center text-gray-600 hover:text-brand-600 transition-all duration-300 hover:scale-105 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-brand-100 hover:to-brand-200 px-6 py-3 rounded-full shadow-lg hover:shadow-xl"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                <span className="font-semibold">Back</span>
              </Link>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-brand-600 bg-clip-text text-transparent">
                  {learningPath.title}
                </h1>
                <p className="text-gray-600 mt-2 text-lg">{learningPath.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center bg-gradient-to-r from-brand-50 to-brand-100 px-5 py-3 rounded-full border border-brand-200/50 shadow-lg">
                <Clock className="w-5 h-5 mr-3 text-brand-600" />
                <span className="font-bold text-brand-700">{learningPath.duration_estimate_hours}h</span>
              </div>
              <div className="flex items-center bg-gradient-to-r from-teal-50 to-teal-100 px-5 py-3 rounded-full border border-teal-200/50 shadow-lg">
                <BookOpen className="w-5 h-5 mr-3 text-teal-600" />
                <span className="font-bold text-teal-700">{learningPath.activities.length} activities</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span className="font-semibold text-lg">Progress</span>
              <span className="font-semibold text-lg">{completedActivities.size} of {learningPath.activities.length} completed</span>
            </div>
            <div className="w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-brand-500 to-teal-500 h-4 rounded-full transition-all duration-1000 shadow-lg"
                style={{ width: `${getProgressPercentage()}%` }}
              >
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Sidebar - Activity List */}
          <div className={`xl:col-span-1 transition-all duration-300 ${sidebarCollapsed ? 'xl:col-span-0' : ''}`}>
            <div className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl sticky top-8 border border-white/50 transition-all duration-300 ${
              sidebarCollapsed ? 'w-16 p-4' : 'p-8'
            }`}>
              <div className="flex items-center justify-between mb-8">
                {!sidebarCollapsed && (
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Activities</h3>
                )}
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-2 rounded-full bg-gradient-to-r from-brand-100 to-brand-200 hover:from-brand-200 hover:to-brand-300 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {sidebarCollapsed ? <ChevronRight className="w-5 h-5 text-brand-600" /> : <ChevronLeft className="w-5 h-5 text-brand-600" />}
                </button>
              </div>

              {!sidebarCollapsed && (
                <div className="space-y-4">
                  {learningPath.activities.map((activity, index) => (
                    <button
                      key={activity.activity_id}
                      onClick={() => handleActivitySelect(index)}
                      className={`w-full text-left p-5 rounded-2xl transition-all duration-300 ${
                        index === currentActivityIndex
                          ? 'bg-gradient-to-r from-brand-500 to-teal-600 text-white shadow-xl'
                          : 'bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 text-gray-800 shadow-lg hover:shadow-xl'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {completedActivities.has(activity.activity_id) ? (
                            <CheckCircle className="w-7 h-7 text-green-400" />
                          ) : (
                            <Circle className={`w-7 h-7 ${
                              index === currentActivityIndex ? 'text-white' : 'text-gray-400'
                            }`} />
                          )}
                          <div>
                            <p className="font-bold text-sm mb-1">
                              {activity.title}
                            </p>
                            <p className={`text-xs capitalize font-medium ${
                              index === currentActivityIndex ? 'text-white/80' : 'text-gray-500'
                            }`}>
                              {activity.type}
                            </p>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {sidebarCollapsed && (
                <div className="space-y-3">
                  {learningPath.activities.map((activity, index) => (
                    <button
                      key={activity.activity_id}
                      onClick={() => handleActivitySelect(index)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        index === currentActivityIndex
                          ? 'bg-gradient-to-r from-brand-500 to-teal-600 text-white shadow-xl'
                          : 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-600 shadow-lg hover:shadow-xl'
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
              )}
            </div>
          </div>

          {/* Main Content and Chat */}
          <div className={`transition-all duration-300 ${sidebarCollapsed ? 'xl:col-span-4' : 'xl:col-span-3'}`}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Activity Content */}
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-brand-600 bg-clip-text text-transparent">
                        Activity {currentActivityIndex + 1} of {learningPath.activities.length}
                      </h2>
                      <p className="text-gray-600 capitalize font-semibold text-lg mt-2">{currentActivity.type}</p>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={handlePrevious}
                        disabled={currentActivityIndex === 0}
                        className="flex items-center px-8 py-4 text-gray-600 hover:text-brand-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300 bg-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
                      >
                        <ChevronLeft className="w-5 h-5 mr-2" />
                        Previous
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={currentActivityIndex === learningPath.activities.length - 1}
                        className="flex items-center px-8 py-4 bg-gradient-to-r from-brand-500 to-teal-600 text-white rounded-full hover:from-brand-600 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 font-semibold"
                      >
                        Next
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </button>
                    </div>
                  </div>
                </div>

                <ActivityRenderer
                  activity={currentActivity}
                  onComplete={() => handleActivityComplete(currentActivity.activity_id)}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  showNavigation={false}
                />
              </div>

              {/* Chat Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 h-[600px]">
                  <LearningChatComponent
                    learningPathId={pathId}
                    currentActivity={currentActivity?.title}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
