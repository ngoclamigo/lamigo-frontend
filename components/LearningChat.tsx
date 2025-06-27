"use client";

import { motion } from "framer-motion";
import { Bot, MessageCircle, Mic, MicOff, Send, Sparkles, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

interface LearningChatProps {
  learningPathId?: string;
  currentActivity?: string;
  className?: string;
}

export function LearningChatComponent({
  learningPathId,
  currentActivity,
  className = "",
}: LearningChatProps) {
  const [latestMessage, setLatestMessage] = useState<Message>({
    id: "1",
    content:
      "Hi! I'm David. I'm here to help you understand the concepts and answer any questions you might have about this learning path. How can I help you today?",
    sender: "assistant",
    timestamp: new Date(),
  });
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recognition, setRecognition] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const speechRecognition = new (window as any).webkitSpeechRecognition();
      speechRecognition.continuous = false;
      speechRecognition.interimResults = false;
      speechRecognition.lang = "en-US";

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      speechRecognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      speechRecognition.onend = () => {
        setIsListening(false);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      speechRecognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      setRecognition(speechRecognition);
    }
  }, []);

  const startListening = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      recognition.start();
    }
  };

  const playMessage = () => {
    if ("speechSynthesis" in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(latestMessage.content);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;

        // Set a female voice if available
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(
          (voice) =>
            voice.name.toLowerCase().includes("female") ||
            voice.name.toLowerCase().includes("sarah") ||
            voice.name.toLowerCase().includes("samantha")
        );
        if (femaleVoice) {
          utterance.voice = femaleVoice;
        }

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);

        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setInputValue("");
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(
      () => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: generateResponse(userMessage.content),
          sender: "assistant",
          timestamp: new Date(),
        };
        setLatestMessage(assistantMessage);
        setIsLoading(false);
      },
      1000 + Math.random() * 2000
    );
  };

  const generateResponse = (userInput: string): string => {
    // Context-aware responses based on learning path and current activity
    const contextualResponses = [
      `That's a great question about ${currentActivity || "this topic"}! Let me explain that concept in more detail...`,
      "I can help you understand this better. Here's what you need to know...",
      "That's an important point to clarify. Let me break it down for you...",
      "Excellent observation! This relates to the core concepts we're covering...",
      `I see you're thinking deeply about this${learningPathId ? " learning path" : ""}. Here's my perspective...`,
      "That's a common area of confusion. Let me provide some clarity...",
    ];

    // Simple keyword matching for more relevant responses
    if (userInput.toLowerCase().includes("help") || userInput.toLowerCase().includes("explain")) {
      return contextualResponses[0];
    }

    return contextualResponses[Math.floor(Math.random() * contextualResponses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col h-full overflow-hidden rounded-lg shadow-md ${className}`}
      style={{
        background: "linear-gradient(to bottom, white, #f7f9fc)",
      }}
    >
      {/* Header */}
      <div
        className="relative p-4 rounded-t-lg"
        style={{
          background: "linear-gradient(135deg, var(--brand-600), var(--brand-700))",
        }}
      >
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative flex items-center gap-3"
        >
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20"
            >
              <Bot className="w-5 h-5 text-white" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, repeatDelay: 5 }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white"
            ></motion.div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              David
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </motion.div>
            </h3>
            <p className="text-white/80 text-sm">Supportive coach</p>
          </div>
        </motion.div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Display only the latest assistant message text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={latestMessage.id}
          className="flex items-start justify-between"
        >
          <div className="text-gray-800 flex-1">
            <p className="text-base leading-relaxed">{latestMessage.content}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={playMessage}
            disabled={isLoading}
            className={`ml-4 p-2 rounded-full ${
              isPlaying ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={isPlaying ? "Stop playing" : "Play message"}
          >
            {isPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </motion.button>
        </motion.div>

        {isLoading && (
          <div className="mt-4">
            <motion.div
              className="flex gap-2"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="w-2 h-2 bg-brand-400 rounded-full"></div>
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                className="w-2 h-2 bg-brand-400 rounded-full"
              ></motion.div>
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                className="w-2 h-2 bg-brand-400 rounded-full"
              ></motion.div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Input */}
      <div
        className="p-4 bg-gray-50 border-t rounded-b-lg"
        style={{
          background: "linear-gradient(to top, #f0f4f8, #f7f9fc)",
        }}
      >
        <div className="space-y-2">
          {/* Text Input */}
          <div className="w-full relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="w-full p-3 pr-10 bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-brand-400 text-gray-800 placeholder-gray-500"
              disabled={isLoading}
            />
            <MessageCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* Voice and Send Buttons */}
          <div className="flex gap-2 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startListening}
              disabled={isLoading}
              className={`px-4 py-2 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                isListening ? "bg-red-500 text-white" : "bg-gray-500 text-white hover:bg-gray-600"
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="px-4 py-2 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, var(--brand-500), var(--brand-600))",
              }}
            >
              <div className="flex items-center gap-2 text-white">
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">Send</span>
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
