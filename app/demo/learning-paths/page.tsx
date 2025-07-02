"use client";

import { useEffect, useState } from "react";

// Define the types for our API responses
interface LearningPathSummary {
  id: string;
  title: string;
  description: string;
  duration_estimate_hours: number;
  activity_ids: string[];
}

interface LearningPathDetail {
  id: string;
  title: string;
  description: string;
  duration_estimate_hours: number;
  activities: Activity[];
}

interface Activity {
  id: string;
  title: string;
  description: string;
  type: string;
  config: Record<string, unknown>; // Using Record instead of any
}

interface ApiResponse<T> {
  status: string;
  data: T;
  paging?: {
    page: number;
    per_page: number;
    total: number;
  };
}

export default function LearningPathsDemo() {
  const [learningPaths, setLearningPaths] = useState<LearningPathSummary[]>([]);
  const [selectedPath, setSelectedPath] = useState<LearningPathDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [apiResponseTime, setApiResponseTime] = useState<number>(0);
  const [detailApiResponseTime, setDetailApiResponseTime] = useState<number>(0);

  // Fetch all learning paths
  const fetchLearningPaths = async () => {
    setLoading(true);
    setError(null);
    const startTime = performance.now();

    try {
      const response = await fetch(`/api/learning-paths?page=${page}&per_page=${perPage}`);
      const data: ApiResponse<LearningPathSummary[]> = await response.json();

      if (data.status === "success") {
        setLearningPaths(data.data);
        if (data.paging) {
          setTotalPages(Math.ceil(data.paging.total / data.paging.per_page));
        }
      } else {
        setError("Failed to load learning paths");
      }
    } catch (err) {
      setError("Error connecting to API");
      console.error(err);
    } finally {
      setLoading(false);
      setApiResponseTime(performance.now() - startTime);
    }
  };

  // Fetch a specific learning path
  const fetchLearningPath = async (id: string) => {
    setDetailLoading(true);
    setError(null);
    const startTime = performance.now();

    try {
      const response = await fetch(`/api/learning-paths/${id}`);
      const data: ApiResponse<LearningPathDetail> = await response.json();

      if (data.status === "success") {
        setSelectedPath(data.data);
      } else {
        setError("Failed to load learning path details");
      }
    } catch (err) {
      setError("Error connecting to API");
      console.error(err);
    } finally {
      setDetailLoading(false);
      setDetailApiResponseTime(performance.now() - startTime);
    }
  };

  // Load learning paths on mount and when page changes
  useEffect(() => {
    fetchLearningPaths();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Format duration
  const formatDuration = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} minutes`;
    } else if (hours === 1) {
      return "1 hour";
    } else {
      return `${hours} hours`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Learning Paths API Demo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left panel - Learning Paths List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">All Learning Paths</h2>
            <div className="text-sm text-gray-600">
              Response time: {apiResponseTime.toFixed(2)}ms
            </div>
          </div>

          <div className="mb-4 flex items-center">
            <label className="mr-2">Per page:</label>
            <select
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className="border rounded p-1"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>

            <button
              onClick={() => fetchLearningPaths()}
              className="ml-4 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 py-4">{error}</div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {learningPaths.length > 0 ? (
                  learningPaths.map((path) => (
                    <div key={path.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <h3 className="font-medium text-lg">{path.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{path.description}</p>
                      <div className="flex justify-between text-sm">
                        <span>{formatDuration(path.duration_estimate_hours)}</span>
                        <span>{path.activity_ids.length} activities</span>
                      </div>
                      <button
                        onClick={() => fetchLearningPath(path.id)}
                        className="mt-3 text-blue-500 hover:underline text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">No learning paths found</div>
                )}
              </div>

              {/* Pagination controls */}
              <div className="flex justify-between items-center">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className={`px-3 py-1 rounded ${
                    page === 1
                      ? "bg-gray-200 text-gray-500"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Previous
                </button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className={`px-3 py-1 rounded ${
                    page === totalPages
                      ? "bg-gray-200 text-gray-500"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>

        {/* Right panel - Learning Path Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Learning Path Details</h2>
            {selectedPath && (
              <div className="text-sm text-gray-600">
                Response time: {detailApiResponseTime.toFixed(2)}ms
              </div>
            )}
          </div>

          {detailLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : selectedPath ? (
            <div>
              <div className="mb-6">
                <h3 className="font-bold text-xl mb-2">{selectedPath.title}</h3>
                <p className="text-gray-700 mb-3">{selectedPath.description}</p>
                <div className="text-sm text-gray-600 mb-4">
                  Duration: {formatDuration(selectedPath.duration_estimate_hours)}
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">
                    Activities ({selectedPath.activities.length})
                  </h4>

                  {selectedPath.activities.length > 0 ? (
                    <div className="space-y-3">
                      {selectedPath.activities.map((activity, index) => (
                        <div key={activity.id} className="border-l-4 border-blue-500 pl-3 py-1">
                          <div className="font-medium">
                            {index + 1}. {activity.title}
                          </div>
                          <div className="text-sm text-gray-600">{activity.description}</div>
                          <div className="text-xs mt-1 text-gray-500">Type: {activity.type}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 italic">
                      No activities found for this learning path
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg mt-6">
                <h4 className="text-sm font-semibold mb-2">API Response Preview</h4>
                <pre className="text-xs overflow-auto max-h-60 p-2 bg-gray-800 text-green-400 rounded">
                  {JSON.stringify({ status: "success", data: selectedPath }, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Select a learning path to view its details
            </div>
          )}
        </div>
      </div>

      {/* API Reference */}
      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">API Reference</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">GET /api/learning-paths</h3>
            <p className="mb-2 text-gray-700">
              Returns a list of all learning paths with pagination.
            </p>
            <h4 className="font-medium mt-3 mb-1">Query Parameters:</h4>
            <ul className="list-disc pl-6 text-sm">
              <li>
                <code className="bg-gray-100 px-1">page</code> - Page number (default: 1)
              </li>
              <li>
                <code className="bg-gray-100 px-1">per_page</code> - Items per page (default: 10)
              </li>
            </ul>
            <h4 className="font-medium mt-3 mb-1">Response Format:</h4>
            <pre className="text-xs overflow-auto p-2 bg-gray-800 text-green-400 rounded">
              {`{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "title": "Learning Path Title",
      "description": "Description",
      "duration_estimate_hours": 5,
      "activity_ids": ["uuid1", "uuid2", ...]
    },
    ...
  ],
  "paging": {
    "page": 1,
    "per_page": 10,
    "total": 25
  }
}`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">
              GET /api/learning-paths/{"{learning_path_id}"}
            </h3>
            <p className="mb-2 text-gray-700">
              Returns details for a specific learning path including all its activities.
            </p>
            <h4 className="font-medium mt-3 mb-1">Path Parameters:</h4>
            <ul className="list-disc pl-6 text-sm">
              <li>
                <code className="bg-gray-100 px-1">learning_path_id</code> - UUID of the learning
                path
              </li>
            </ul>
            <h4 className="font-medium mt-3 mb-1">Response Format:</h4>
            <pre className="text-xs overflow-auto p-2 bg-gray-800 text-green-400 rounded">
              {`{
  "status": "success",
  "data": {
    "id": "uuid",
    "title": "Learning Path Title",
    "description": "Description",
    "duration_estimate_hours": 5,
    "activities": [
      {
        "id": "uuid1",
        "title": "Activity Title",
        "description": "Activity Description",
        "type": "slide",
        "config": { ... }
      },
      ...
    ]
  }
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
