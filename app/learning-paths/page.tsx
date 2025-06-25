"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LearningPath } from '@/types/learning-path';
import { getLearningPaths } from '@/lib/api';
import { Clock, BookOpen, ArrowRight } from 'lucide-react';
import { ProgressDashboard } from '@/components/ProgressDashboard';

export default function LearningPathsPage() {
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLearningPaths = async () => {
      try {
        const response = await getLearningPaths();
        if (response.status === 'success') {
          setLearningPaths(response.data);
        } else {
          setError('Failed to load learning paths');
        }
      } catch (err) {
        setError('Failed to load learning paths');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPaths();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-2">⚠️ Error</div>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-100 via-teal-50 to-brand-100 relative overflow-hidden">
      {/* Floating background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-brand-400/10 to-teal-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-teal-400/10 to-brand-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-6 bg-gradient-to-r from-brand-600 to-teal-600 rounded-full mb-8 shadow-2xl">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-gray-800 to-brand-600 bg-clip-text text-transparent mb-8">
            Learning Paths
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed opacity-90">
            Embark on structured learning journeys designed to help you master new skills
            and unlock your potential through interactive, immersive experiences.
          </p>
        </div>

        {/* Progress Dashboard */}
        <div className="mb-16">
          <ProgressDashboard />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {learningPaths.map((path) => (
            <Link
              key={path.path_id}
              href={`/learning-paths/${path.path_id}`}
              className="group block transform transition-all duration-300 hover:scale-105"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50 overflow-hidden relative">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-teal-500/5 to-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="p-8 relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="bg-gradient-to-br from-brand-500 to-teal-600 p-5 rounded-3xl shadow-lg">
                      <BookOpen className="h-8 w-8 text-white" />
                    </div>
                    <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-brand-600 group-hover:translate-x-2 transition-all duration-300" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:bg-gradient-to-r group-hover:from-brand-600 group-hover:to-teal-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {path.title}
                  </h3>

                  <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {path.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                    <div className="flex items-center bg-gradient-to-r from-brand-50 to-brand-100 px-4 py-3 rounded-full border border-brand-200/50">
                      <Clock className="h-4 w-4 mr-2 text-brand-600" />
                      <span className="font-semibold text-brand-700">{path.duration_estimate_hours}h</span>
                    </div>
                    <div className="flex items-center bg-gradient-to-r from-teal-50 to-teal-100 px-4 py-3 rounded-full border border-teal-200/50">
                      <BookOpen className="h-4 w-4 mr-2 text-teal-600" />
                      <span className="font-semibold text-teal-700">{path.activities.length} activities</span>
                    </div>
                  </div>
                </div>

                <div className="px-8 pb-8 relative z-10">
                  <div className="relative w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                    <div className="bg-gradient-to-r from-brand-500 to-teal-500 h-4 rounded-full w-0 group-hover:w-1/3 transition-all duration-500 shadow-lg">
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 font-medium group-hover:text-brand-600 transition-colors duration-300">Ready to begin your journey</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {learningPaths.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-8 inline-flex mb-6">
              <BookOpen className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-4">
              No learning paths available yet
            </h3>
            <p className="text-gray-500 text-lg">
              New learning opportunities are being crafted. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
