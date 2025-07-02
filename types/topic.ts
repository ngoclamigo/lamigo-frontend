type Topic = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
};

type TopicSection = {
  id: string;
  topic_id: string;
  content: string;
  content_markdown: string;
  content_embedding: unknown;
  created_at: string;
  updated_at: string;
  metadata: Record<string, unknown>;
};

export type { Topic, TopicSection };
