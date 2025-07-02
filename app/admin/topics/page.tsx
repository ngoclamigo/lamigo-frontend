"use client";

import { AlertCircle, ArrowLeft, BookOpen, Edit, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Topic } from "~/types/topic";

export default function TopicsAdminPage() {
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch("/api/topics");
        if (!response.ok) throw new Error("Failed to fetch topics");
        const data = await response.json();
        setTopics(data.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load topics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this topic?")) return;

    try {
      const response = await fetch(`/api/topics/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete topic");
      setTopics((prev) => [...prev].filter((topic) => topic.id !== id));
      toast.success("Topic deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete topic");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Link href="/admin" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back to Admin
          </Link>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700 transition-all"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="w-5 h-5" />
          Add Topic
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-brand-50 to-brand-100 p-6 border-b">
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-brand-600" />
            Topics Management
          </h1>
          <p className="text-gray-600 mt-1">Manage your learning topics</p>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading topics...</div>
        ) : topics.length === 0 ? (
          <div className="p-8 text-center text-gray-500 flex flex-col items-center">
            <AlertCircle className="w-10 h-10 text-gray-400 mb-2" />
            <p>No topics found. Create your first topic to get started.</p>
          </div>
        ) : (
          <div className="divide-y">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className="p-5 flex items-center justify-between hover:bg-gray-50"
              >
                <div>
                  <h2 className="text-lg font-medium text-gray-800">{topic.title}</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {topic.description || "No description"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/admin/topics/${topic.id}`)}
                    className="p-2 rounded-lg text-brand-600 hover:bg-brand-50"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(topic.id)}
                    className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateTopicDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={(topic) => {
          setTopics([...topics, { ...topic }]); // Simulate adding new topic
          toast.success("Topic created successfully");
        }}
      />
    </div>
  );
}

interface CreateTopicDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (topic: Topic) => void;
}

function CreateTopicDialog({ isOpen, onClose, onSave }: CreateTopicDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/topics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) throw new Error("Failed to create topic");

      const data = await response.json();
      onSave(data.data);
      resetForm();
      onClose();
      toast.success("Topic created successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create topic");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-brand-50 to-brand-100 px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Plus className="w-5 h-5 text-brand-600" />
            Create New Topic
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg hover:from-brand-600 hover:to-brand-700 disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : "Save Topic"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
