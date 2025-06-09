import useCombinedTranscriptions from "@/hooks/useCombinedTranscriptions";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import {
  LuLightbulb,
  LuMessageSquare,
  LuSparkles,
  LuThumbsUp,
  LuTrendingUp,
  LuTriangleAlert,
  LuZap,
} from "react-icons/lu";

// Motion components
const MotionDiv = motion.div;

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
        icon: <LuLightbulb size={14} />,
        color: "blue",
      },
    },
    {
      triggers: ["upset", "angry", "frustrated"],
      evaluation: {
        type: "suggestion" as const,
        message: "You need to show empathy and use calming language",
        icon: <LuLightbulb size={14} />,
        color: "blue",
      },
    },
    {
      triggers: ["price", "cost", "expensive"],
      evaluation: {
        type: "suggestion" as const,
        message: "You can emphasize the value and benefits rather than just defending the price",
        icon: <LuLightbulb size={14} />,
        color: "blue",
      },
    },
    {
      triggers: ["help", "support", "assistance"],
      evaluation: {
        type: "suggestion" as const,
        message: "You need to be proactive and offer specific solutions",
        icon: <LuLightbulb size={14} />,
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
        icon: <LuThumbsUp size={14} />,
        color: "green",
      },
    },
    {
      triggers: ["understand", "i see", "i hear you"],
      evaluation: {
        type: "positive" as const,
        message: "Excellent empathy! Shows you're actively listening and processing their concerns",
        icon: <LuThumbsUp size={14} />,
        color: "green",
      },
    },
    {
      triggers: ["no", "can't", "impossible", "not allowed"],
      evaluation: {
        type: "warning" as const,
        message: "Avoid flat rejections - focus on what you CAN do and offer alternatives",
        icon: <LuTriangleAlert size={14} />,
        color: "orange",
      },
    },
    {
      triggers: ["policy", "rules", "company says"],
      evaluation: {
        type: "improvement" as const,
        message: "Explain the reasoning behind policies in customer-friendly language",
        icon: <LuZap size={14} />,
        color: "blue",
      },
    },
    {
      triggers: ["let me check", "i'll find out", "give me a moment"],
      evaluation: {
        type: "positive" as const,
        message: "Great initiative! Taking time to find the right answer shows dedication",
        icon: <LuTrendingUp size={14} />,
        color: "green",
      },
    },
    {
      triggers: ["thank you", "thanks", "appreciate"],
      evaluation: {
        type: "positive" as const,
        message: "Gratitude sets a positive tone and builds mutual respect",
        icon: <LuSparkles size={14} />,
        color: "green",
      },
    },
    {
      triggers: ["calm down", "relax", "chill"],
      evaluation: {
        type: "warning" as const,
        message: "This can sound dismissive - acknowledge their feelings instead",
        icon: <LuTriangleAlert size={14} />,
        color: "orange",
      },
    },
    {
      triggers: ["happy to help", "of course", "no problem"],
      evaluation: {
        type: "positive" as const,
        message: "Friendly affirmations create a supportive and approachable tone",
        icon: <LuThumbsUp size={14} />,
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
      icon: <LuZap size={14} />,
      color: "blue",
    };
  }

  if (content.includes("?")) {
    return {
      type: "positive",
      message: "Asking questions shows engagement and helps clarify needs",
      icon: <LuLightbulb size={14} />,
      color: "green",
    };
  }

  return null;
}

export function RecommendationView() {
  const messages = useCombinedTranscriptions();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Theme colors for light/dark mode
  const isDarkMode = false; // This would be replaced with your theme detection logic

  // Evaluation styles
  const evaluationStyles = {
    positive: {
      bg: isDarkMode ? "bg-green-900/20" : "bg-green-50",
      borderColor: isDarkMode ? "border-green-700" : "border-green-200",
      iconBg: isDarkMode ? "bg-green-400" : "bg-green-500",
      iconColor: "text-white",
      textColor: isDarkMode ? "text-green-200" : "text-green-800",
      glowColor: isDarkMode ? "border-green-600" : "border-green-200",
    },
    warning: {
      bg: isDarkMode ? "bg-orange-900/20" : "bg-orange-50",
      borderColor: isDarkMode ? "border-orange-700" : "border-orange-200",
      iconBg: isDarkMode ? "bg-orange-400" : "bg-orange-500",
      iconColor: "text-white",
      textColor: isDarkMode ? "text-orange-200" : "text-orange-800",
      glowColor: isDarkMode ? "border-orange-600" : "border-orange-200",
    },
    improvement: {
      bg: isDarkMode ? "bg-blue-900/20" : "bg-blue-50",
      borderColor: isDarkMode ? "border-blue-700" : "border-blue-200",
      iconBg: isDarkMode ? "bg-blue-400" : "bg-blue-500",
      iconColor: "text-white",
      textColor: isDarkMode ? "text-blue-200" : "text-blue-800",
      glowColor: isDarkMode ? "border-blue-600" : "border-blue-200",
    },
    suggestion: {
      bg: isDarkMode ? "bg-purple-900/20" : "bg-purple-50",
      borderColor: isDarkMode ? "border-purple-700" : "border-purple-200",
      iconBg: isDarkMode ? "bg-purple-400" : "bg-purple-500",
      iconColor: "text-white",
      textColor: isDarkMode ? "text-purple-200" : "text-purple-800",
      glowColor: isDarkMode ? "border-purple-600" : "border-purple-200",
    },
  };

  const getEvaluationStyle = (type: string) => {
    return evaluationStyles[type as keyof typeof evaluationStyles] || evaluationStyles.improvement;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const headerVariants = {
    initial: { opacity: 0, y: -30, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
        duration: 0.6,
      },
    },
  };

  const messageVariants = {
    initial: { opacity: 0, y: 40, scale: 0.9 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      y: -30,
      scale: 0.95,
      transition: {
        duration: 0.3,
      },
    },
  };

  const pulseAnimation = {
    animate: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={containerVariants}
      className="h-full flex flex-col gap-0 dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg relative backdrop-blur-md"
    >
      {/* Animated background gradients */}
      <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-br from-blue-50/40 via-purple-50/20 to-transparent dark:from-blue-900/10 dark:via-purple-900/5 dark:to-transparent pointer-events-none z-0" />

      {/* Floating orbs for decoration */}
      <MotionDiv
        className="absolute top-[20%] right-[10%] w-[100px] h-[100px] bg-blue-100/30 dark:bg-blue-800/10 rounded-full blur-3xl pointer-events-none z-0"
        {...pulseAnimation}
      />
      <MotionDiv
        className="absolute bottom-[30%] left-[5%] w-[80px] h-[80px] bg-purple-100/30 dark:bg-purple-800/10 rounded-full blur-2xl pointer-events-none z-0"
        {...pulseAnimation}
        transition={{ delay: 1 }}
      />

      {/* Header */}
      <motion.div
        variants={headerVariants}
        className="w-full p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-xl relative z-10"
      >
        <div className="flex flex-col items-start gap-0 flex-1">
          <p className="font-bold text-lg text-gray-800 dark:text-gray-100">AI Voice Coach</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Real-time guidance & intelligent feedback
          </p>
        </div>
      </motion.div>

      {/* Messages Container */}
      <div className="flex-1 w-full overflow-y-auto p-4 relative z-5 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <MotionDiv
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="flex flex-col items-center gap-4">
              <MotionDiv
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 shadow-lg">
                  <LuMessageSquare className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                </div>
              </MotionDiv>
              <div className="flex flex-col items-center gap-2">
                <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  Start your voice practice
                </p>
                <p className="text-md text-gray-600 dark:text-gray-400 max-w-[400px] text-center leading-relaxed">
                  Your AI coach is ready to provide real-time feedback and intelligent suggestions
                  as you practice customer service scenarios
                </p>
              </div>
            </div>
          </MotionDiv>
        ) : (
          <div className="flex flex-col gap-4 items-stretch">
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => {
                const content = typeof message.text === "string" ? message.text : "";
                const evaluation =
                  message.role === "user"
                    ? generateUserEvaluation(content)
                    : generatePartnerEvaluation(content);

                if (!evaluation) return null;
                const style = getEvaluationStyle(evaluation.type);

                return (
                  <MotionDiv
                    key={`message-${index}`}
                    variants={messageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    layout
                  >
                    <div
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className="max-w-[90%] w-full">
                        <motion.div
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          transition={{
                            delay: index * 0.1,
                            duration: 0.5,
                            type: "spring",
                            stiffness: 300,
                          }}
                        >
                          <div
                            className={`${style.bg} border-2 ${style.borderColor} rounded-2xl p-3 shadow-xl relative overflow-hidden backdrop-blur-md hover:shadow-2xl hover:${style.glowColor} transition-all duration-300`}
                          >
                            {/* Animated gradient overlay */}
                            <div
                              className={`absolute top-0 left-0 right-0 h-full bg-gradient-to-br from-${style.bg.replace("bg-", "")} to-transparent opacity-40 pointer-events-none`}
                            />

                            <div className="flex gap-2 items-start relative z-2">
                              <div className="flex flex-col items-start gap-2 flex-1">
                                <div className="flex items-center gap-2">
                                  <MotionDiv
                                    whileHover={{ scale: 1.1, rotate: 10 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                  >
                                    <div
                                      className={`p-2 rounded-xl ${style.iconBg} ${style.iconColor} flex-shrink-0 shadow-lg border-2 border-white`}
                                    >
                                      {evaluation.icon}
                                    </div>
                                  </MotionDiv>
                                  <span
                                    className={`bg-${evaluation.color}-500 text-white rounded-full text-xs font-semibold uppercase tracking-wide px-3 py-1 shadow-md`}
                                  >
                                    {evaluation.type}
                                  </span>
                                  {evaluation.type === "positive" && (
                                    <MotionDiv
                                      animate={{ rotate: [0, 10, -10, 0] }}
                                      transition={{ duration: 2, repeat: Infinity }}
                                    >
                                      <LuSparkles
                                        className={`w-4 h-4 ${style.iconBg.replace("bg-", "text-")}`}
                                      />
                                    </MotionDiv>
                                  )}
                                </div>
                                <p
                                  className={`text-sm ${style.textColor} leading-relaxed font-medium`}
                                >
                                  {evaluation.message}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </MotionDiv>
                );
              })}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
