"use client";

import { AlertCircle, ArrowLeft, Edit, Plus, Save } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Topic, TopicSection } from "~/types/topic";

type TopicWithSections = Topic & {
  topic_sections: TopicSection[];
};

export default function TopicPage({ params }: { params: { topic_id: string } }) {
  const [topic, setTopic] = useState<TopicWithSections | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [importText, setImportText] = useState("");
  const [showImport, setShowImport] = useState(false);

  const fetchTopic = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/topics/${params.topic_id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch topic");
      }
      const data = await response.json();
      setTopic(data.data);
      setTitle(data.data.title);
      setDescription(data.description || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [params.topic_id]);

  useEffect(() => {
    fetchTopic();
  }, [fetchTopic]);

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/topics/${params.topic_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update topic");
      }

      await fetchTopic();
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleImport = async () => {
    try {
      const response = await fetch(`/api/topics/${params.topic_id}/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: importText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to import content");
      }

      await fetchTopic();
      setShowImport(false);
      setImportText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!topic) return <div className="p-4">Topic not found</div>;

  return (
    <div className="container p-4">
      <div className="mb-6">
        <Link href="/admin/topics" className="flex items-center text-blue-500 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Topics
        </Link>
      </div>

      {isEditing ? (
        <div className="mb-6 space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 text-xl font-bold"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2"
            rows={3}
          />
          <button
            onClick={handleSave}
            className="flex items-center rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </button>
        </div>
      ) : (
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{topic.title}</h1>
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center rounded bg-gray-200 px-3 py-1 hover:bg-gray-300"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </button>
          </div>
          {topic.description && <p className="mt-2 text-gray-600">{topic.description}</p>}
        </div>
      )}

      <div className="mb-6">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold">Sections</h2>
          <div className="space-x-2">
            <button
              onClick={() => setShowImport(!showImport)}
              className="flex items-center rounded bg-purple-500 px-3 py-1 text-white hover:bg-purple-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Import Document
            </button>
          </div>
        </div>

        {showImport && (
          <div className="mt-4 rounded border p-4">
            <h3 className="mb-2 text-lg font-medium">Import Document</h3>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="mb-3 w-full border p-2"
              rows={10}
              placeholder="Paste your document content here..."
            />
            <button
              onClick={handleImport}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Import
            </button>
          </div>
        )}

        {topic.topic_sections.length === 0 ? (
          <div className="mt-4 flex items-center rounded bg-yellow-100 p-4 text-yellow-800">
            <AlertCircle className="mr-2 h-5 w-5" />
            No sections have been added to this topic yet.
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {topic.topic_sections.map((section) => (
              <div key={section.id} className="rounded border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{section.metadata.title}</h3>
                  <Link
                    href={`/admin/topics/${params.topic_id}/sections/${section.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </Link>
                </div>
                {/* {section.description && (
                  <p className="mt-1 text-gray-600">{section.description}</p>
                )} */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}