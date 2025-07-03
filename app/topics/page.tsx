"use client";

import { BookOpen } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createTopic, deleteTopic, getTopics } from "~/lib/api";
import { Topic } from "~/types/topic";

export default function TopicsPage() {
  const router = useRouter();

  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchScenarios = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const data = await getTopics();
        setTopics(data.data);
      } catch (error) {
        console.error("Failed to fetch scenarios:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScenarios();
  }, []);

  const handleDelete = async (topicID: string) => {
    const deletePromise = deleteTopic(topicID);

    toast.promise(deletePromise, {
      loading: "Deleting topic...",
      success: () => {
        setTopics((prev) => prev.filter((t) => t.id !== topicID));
        return "Topic deleted successfully";
      },
      error: (error) => {
        console.error("Failed to delete topic:", error);
        return "Failed to delete topic. Please try again.";
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6"
    >
      <motion.h1
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl font-bold mb-6"
      >
        Available Topics
      </motion.h1>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-36 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      )}

      {isError && (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4"
        >
          Failed to load scenarios. Please try again later.
        </motion.div>
      )}

      {!isLoading && !isError && topics.length === 0 && (
        <p className="text-gray-500">No scenarios available.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="border rounded-xl p-4 cursor-pointer hover:shadow-md transition bg-gradient-to-br from-white to-brand-50"
            whileHover={{ scale: 1.02 }}
            onClick={() => router.push(`/topics/${topic.id}`)}
          >
            <div className="flex items-center gap-2 mb-2">
              <motion.div whileHover={{ rotate: 15 }}>
                <BookOpen className="h-5 w-5 text-brand-500" />
              </motion.div>
              <h2 className="text-xl font-semibold">{topic.title}</h2>
            </div>
            <p className="text-gray-600 text-sm mb-3 line-clamp-3 leading-relaxed">
              {topic.description || "No description available"}
            </p>
            <div className="flex items-center justify-between">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(topic.id);
                }}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Delete
              </motion.button>
              <Link
                href={`/topics/${topic.id}`}
                className="text-sm text-brand-500 hover:text-brand-700 font-medium"
              >
                View details →
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      <CreateTopic onSuccess={(topic) => setTopics((prev) => [topic, ...prev])} />
    </motion.div>
  );
}

function CreateTopic({ onSuccess }: { onSuccess?: (data: Topic) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [, setIsError] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) return;

    setIsLoading(true);
    setIsError(false);
    try {
      const data = await createTopic({ title, description });
      setTitle("");
      setDescription("");
      onSuccess?.(data.data);
    } catch (error) {
      console.error("Failed to fetch scenarios:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-8 p-5 border rounded-xl bg-gradient-to-r from-white via-brand-50 to-white shadow-sm"
    >
      <h2 className="text-xl font-semibold mb-4">Create topic</h2>
      <div className="flex flex-col gap-4 mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title"
          className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-300 focus:border-brand-500 outline-none"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-300 focus:border-brand-500 outline-none"
        />
        <motion.button
          onClick={handleSubmit}
          disabled={!title.trim()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-brand-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating..." : "Create"}
        </motion.button>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-sm text-gray-500"
      >
        Topics are used to organize related learning paths and scenarios. You can create a topic to
        group your content and make it easier to find later.
      </motion.div>
    </motion.div>
  );
}
