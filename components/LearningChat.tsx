"use client";

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
    <div
      className={`flex flex-col h-full bg-gradient-to-br from-white via-brand-50/30 to-teal-50/20 border border-white/20 shadow-2xl backdrop-blur-xl overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="relative p-6 bg-gradient-to-r from-brand-600 to-teal-600 border-b border-white/10">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        <div className="relative flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              David
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </h3>
            <p className="text-white/80 text-sm">Supportive coach</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-transparent to-white/5">
        {/* Display only the latest assistant message text */}
        <div className="flex items-start justify-between">
          <div className="text-gray-800 flex-1">
            <p className="text-base leading-relaxed">{latestMessage.content}</p>
          </div>
          <button
            onClick={playMessage}
            disabled={isLoading}
            className={`ml-4 p-2 rounded-full transition-all duration-300 ${
              isPlaying
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse"
                : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 hover:from-blue-100 hover:to-blue-200 hover:text-blue-600"
            } shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
            title={isPlaying ? "Stop playing" : "Play message"}
          >
            {isPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        {isLoading && (
          <div className="mt-4">
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-gradient-to-r from-white/60 via-white/40 to-white/60 backdrop-blur-xl border-t border-white/20">
        <div className="space-y-3">
          {/* Text Input */}
          <div className="w-full relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about this learning path..."
              className="w-full p-4 pr-12 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all duration-300 text-gray-800 placeholder-gray-500 shadow-lg"
              disabled={isLoading}
            />
            <MessageCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* Voice and Send Buttons */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={startListening}
              disabled={isLoading}
              className={`px-6 py-4 rounded-2xl font-medium shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                isListening
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse"
                  : "bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700"
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="relative px-6 py-4 bg-gradient-to-r from-brand-600 to-teal-600 text-white rounded-2xl font-medium shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-2">
                <Send
                  className={`w-5 h-5 transition-transform duration-300 ${isLoading ? "animate-pulse" : "group-hover:translate-x-1"}`}
                />
                <span className="hidden sm:inline">Send</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LearningChatComponent;
