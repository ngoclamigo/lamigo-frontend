"use client";

import { TextToSpeechRequest } from "@elevenlabs/elevenlabs-js/api";
import { Bot, MessageCircle, Mic, MicOff, Send, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSpeech } from "~/hooks/use-speech";
import { AudioPlayer } from "./AudioPlayer";
import { sendMessage } from "~/network/programs";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

interface ProgramChatProps {
  className?: string;
  narration?: string; // Optional slide activity narration
  audioBase64?: string; // Base64 audio for the initial narration
  onGenerateStart: (text: string) => string;
  onGenerateComplete: (id: string, text: string, audioUrl: string) => void;
}

export function ProgramChat({
  className = "",
  narration,
  audioBase64,
  onGenerateStart,
  onGenerateComplete,
}: ProgramChatProps) {
  const [latestMessage, setLatestMessage] = useState<string>(
    narration ||
      "Hi! I'm David. I'm here to help you understand the concepts and answer any questions you might have about this learning path. How can I help you today?"
  );
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isListening] = useState(false);

  const {
    speak,
    isLoading: isSpeaking,
    error,
  } = useSpeech({
    onError: (errorMessage) => toast.error(errorMessage),
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSubmit = async (data: { text: string }) => {
    try {
      setIsGenerating(true);

      const requestData: TextToSpeechRequest = {
        text: data.text,
        modelId: "eleven_flash_v2_5",
        voiceSettings: {
          stability: 0.5,
          similarityBoost: 0.75,
          style: 0,
          speed: 1.0,
          useSpeakerBoost: false,
        },
      };

      const pendingId = onGenerateStart(data.text);

      const audioUrl = await speak("ErXwobaYiN019PkySvjV", requestData);

      if (audioUrl) {
        // Pass the complete URL to the callback
        onGenerateComplete(pendingId, data.text, audioUrl);
        // toast.success("Generated speech");
      }
    } catch (err) {
      console.log(`An unexpected error occurred: ${err}`);
      toast.error(`An unexpected error occurred: ${err}`);
    } finally {
      setLatestMessage(data.text);
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (narration) {
      if (!audioBase64) {
        handleSubmit({ text: narration });
      }
      setLatestMessage(narration);
    }
  }, [narration]);

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

    try {
      // Call the API with the topic (learning path name)
      const response = await sendMessage(userMessage.content);

      if (response.status === "success") {
        setLatestMessage(response.data);
      } else {
        throw new Error("Failed to get response from AI");
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      setLatestMessage(
        "I'm sorry, I'm having trouble processing your request right now. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
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

      <div className="flex-1 p-4 overflow-y-auto">
        {isGenerating ? (
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
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start justify-between"
          >
            <div className="text-gray-800 flex-1">
              <p className="text-base leading-relaxed">{latestMessage}</p>
            </div>
          </motion.div>
        )}
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
          {audioBase64 && narration === latestMessage && (
            <AudioPlayer audioBase64={audioBase64} autoplay />
          )}
          {/* Text Input */}
          <div className="w-full relative">
            <div className="relative flex items-center w-full bg-white border rounded-lg focus-within:ring-2 focus-within:ring-brand-400">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me anything..."
                className="w-full p-3 pr-10 bg-transparent resize-none focus:outline-none text-gray-800 placeholder-gray-500 overflow-auto custom-scrollbar"
                disabled={isLoading}
                rows={1}
                style={{
                  minHeight: "44px",
                  maxHeight: "120px",
                  lineHeight: "1.5",
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                }}
              />
              <MessageCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Voice and Send Buttons */}
          <div className="flex gap-2 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              // onClick={startListening}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
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
              className="px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
