import {
  Lightbulb,
  MessageSquare,
  Sparkles,
  ThumbsUp,
  TrendingUp,
  TriangleAlert,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";

interface MessageEvaluation {
  type: "suggestion" | "improvement" | "warning" | "positive";
  message: string;
  icon: React.ReactNode;
  color: string;
}

function generatePartnerEvaluation(content: string): MessageEvaluation | null {
  const suggestions = [
    {
      triggers: ["cancel", "refund", "complaint"],
      evaluation: {
        type: "suggestion" as const,
        message: "You can acknowledge their concern first, then explain your policy clearly",
        icon: <Lightbulb size={14} />,
        color: "blue",
      },
    },
    {
      triggers: ["upset", "angry", "frustrated"],
      evaluation: {
        type: "suggestion" as const,
        message: "You need to show empathy and use calming language",
        icon: <Lightbulb size={14} />,
        color: "blue",
      },
    },
    {
      triggers: ["price", "cost", "expensive"],
      evaluation: {
        type: "suggestion" as const,
        message: "You can emphasize the value and benefits rather than just defending the price",
        icon: <Lightbulb size={14} />,
        color: "blue",
      },
    },
    {
      triggers: ["help", "support", "assistance"],
      evaluation: {
        type: "suggestion" as const,
        message: "You need to be proactive and offer specific solutions",
        icon: <Lightbulb size={14} />,
        color: "blue",
      },
    },
  ];

  const lowerContent = content.toLowerCase();

  for (const suggestion of suggestions) {
    if (suggestion.triggers.some((trigger) => lowerContent.includes(trigger))) {
      return suggestion.evaluation;
    }
  }

  return null;
}

function generateUserEvaluation(content: string): MessageEvaluation | null {
  const evaluations = [
    {
      triggers: ["sorry", "apologize", "my fault"],
      evaluation: {
        type: "positive" as const,
        message: "Acknowledging responsibility builds trust with customers and shows humility",
        icon: <ThumbsUp size={14} />,
        color: "green",
      },
    },
    {
      triggers: ["understand", "i see", "i hear you"],
      evaluation: {
        type: "positive" as const,
        message: "Excellent empathy! Shows you're actively listening and processing their concerns",
        icon: <ThumbsUp size={14} />,
        color: "green",
      },
    },
    {
      triggers: ["no", "can't", "impossible", "not allowed"],
      evaluation: {
        type: "warning" as const,
        message: "Avoid flat rejections - focus on what you CAN do and offer alternatives",
        icon: <TriangleAlert size={14} />,
        color: "orange",
      },
    },
    {
      triggers: ["policy", "rules", "company says"],
      evaluation: {
        type: "improvement" as const,
        message: "Explain the reasoning behind policies in customer-friendly language",
        icon: <Zap size={14} />,
        color: "blue",
      },
    },
    {
      triggers: ["let me check", "i'll find out", "give me a moment"],
      evaluation: {
        type: "positive" as const,
        message: "Great initiative! Taking time to find the right answer shows dedication",
        icon: <TrendingUp size={14} />,
        color: "green",
      },
    },
    {
      triggers: ["thank you", "thanks", "appreciate"],
      evaluation: {
        type: "positive" as const,
        message: "Gratitude sets a positive tone and builds mutual respect",
        icon: <Sparkles size={14} />,
        color: "green",
      },
    },
    {
      triggers: ["calm down", "relax", "chill"],
      evaluation: {
        type: "warning" as const,
        message: "This can sound dismissive - acknowledge their feelings instead",
        icon: <TriangleAlert size={14} />,
        color: "orange",
      },
    },
    {
      triggers: ["happy to help", "of course", "no problem"],
      evaluation: {
        type: "positive" as const,
        message: "Friendly affirmations create a supportive and approachable tone",
        icon: <ThumbsUp size={14} />,
        color: "green",
      },
    },
  ];

  const lowerContent = content.toLowerCase();

  for (const evalItem of evaluations) {
    if (evalItem.triggers.some((trigger) => lowerContent.includes(trigger))) {
      return evalItem.evaluation;
    }
  }

  // Default evaluation based on message characteristics
  if (content.length < 10) {
    return {
      type: "improvement",
      message: "Try providing more detailed and thoughtful responses",
      icon: <Zap size={14} />,
      color: "blue",
    };
  }

  if (content.includes("?")) {
    return {
      type: "positive",
      message: "Asking questions shows engagement and helps clarify needs",
      icon: <Lightbulb size={14} />,
      color: "green",
    };
  }

  return null;
}

export function RecommendationView({ messages }: { messages: any[] }) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getEvaluationStyle = (type: string) => {
    return evaluationStyles[type as keyof typeof evaluationStyles] || evaluationStyles.improvement;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Evaluation styles
  const evaluationStyles = {
    positive: {
      bg: "bg-gradient-to-r from-green-50 to-green-100",
      borderColor: "border-green-200",
      iconBg: "bg-green-500",
      iconColor: "text-white",
      textColor: "text-green-800",
    },
    warning: {
      bg: "bg-gradient-to-r from-orange-50 to-orange-100",
      borderColor: "border-orange-200",
      iconBg: "bg-orange-500",
      iconColor: "text-white",
      textColor: "text-orange-800",
    },
    improvement: {
      bg: "bg-gradient-to-r from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-500",
      iconColor: "text-white",
      textColor: "text-blue-800",
    },
    suggestion: {
      bg: "bg-gradient-to-r from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      iconBg: "bg-purple-500",
      iconColor: "text-white",
      textColor: "text-purple-800",
    },
  };

  return (
    <div className="h-full flex flex-col gap-0 rounded-lg overflow-hidden shadow-md relative">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 relative z-10"
      >
        <div className="flex flex-col items-start gap-0 flex-1">
          <p className="font-bold text-lg text-gray-800">AI Voice Coach</p>
          <p className="text-sm text-gray-600 font-medium">
            Real-time guidance & intelligent feedback
          </p>
        </div>
      </motion.div>

      {/* Messages Container */}
      <div className="flex-1 w-full overflow-y-auto p-4 relative z-5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-16"
          >
            <div className="flex flex-col items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-4 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 shadow-md"
              >
                <MessageSquare className="w-10 h-10 text-gray-400" />
              </motion.div>
              <div className="flex flex-col items-center gap-2">
                <p className="text-xl font-bold text-gray-800">Start your voice practice</p>
                <p className="text-md text-gray-600 max-w-[400px] text-center leading-relaxed">
                  Your AI coach is ready to provide real-time feedback and intelligent suggestions
                  as you practice customer service scenarios
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-4 items-stretch">
            {messages.map((message, index) => {
              const content = typeof message.text === "string" ? message.text : "";
              const evaluation =
                message.role === "user"
                  ? generateUserEvaluation(content)
                  : generatePartnerEvaluation(content);

              if (!evaluation) return null;
              const style = getEvaluationStyle(evaluation.type);

              return (
                <motion.div
                  key={`message-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="max-w-[90%] w-full">
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className={`${style.bg} border ${style.borderColor} rounded-xl p-3 shadow-md relative overflow-hidden`}
                      >
                        <div className="flex gap-2 items-start relative z-2">
                          <div className="flex flex-col items-start gap-2 flex-1">
                            <div className="flex items-center gap-2">
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                className={`p-2 rounded-full ${style.iconBg} ${style.iconColor} flex-shrink-0 shadow-sm`}
                              >
                                {evaluation.icon}
                              </motion.div>
                              <motion.span
                                whileHover={{ y: -2 }}
                                className={`bg-${evaluation.color}-500 text-white rounded-full text-xs font-semibold uppercase tracking-wide px-3 py-1 shadow-sm`}
                              >
                                {evaluation.type}
                              </motion.span>
                            </div>
                            <p className={`text-sm ${style.textColor} leading-relaxed font-medium`}>
                              {evaluation.message}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
}
