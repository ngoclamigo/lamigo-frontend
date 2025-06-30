import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  GripVertical,
  RotateCcw,
  Shuffle,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import {
  EmbedConfig,
  FillBlanksConfig,
  FlashcardConfig,
  LearningActivity,
  MatchingConfig,
  QuizConfig,
  SlideConfig,
} from "~/types/learning-path";

interface ActivityRendererProps {
  activity: LearningActivity;
  onComplete?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  showNavigation?: boolean;
}

export function ActivityRenderer({
  activity,
  onComplete,
  onNext,
  onPrevious,
  showNavigation = false,
}: ActivityRendererProps) {
  switch (activity.type) {
    case "slide":
      return (
        <SlideActivity
          activity={activity}
          onComplete={onComplete}
          onNext={onNext}
          onPrevious={onPrevious}
          showNavigation={showNavigation}
        />
      );
    case "quiz":
      return (
        <QuizActivity
          activity={activity}
          onComplete={onComplete}
          onNext={onNext}
          onPrevious={onPrevious}
          showNavigation={showNavigation}
        />
      );
    case "flashcard":
      return (
        <FlashcardActivity
          activity={activity}
          onComplete={onComplete}
          onNext={onNext}
          onPrevious={onPrevious}
          showNavigation={showNavigation}
        />
      );
    case "embed":
      return (
        <EmbedActivity
          activity={activity}
          onComplete={onComplete}
          onNext={onNext}
          onPrevious={onPrevious}
          showNavigation={showNavigation}
        />
      );
    case "fill_blanks":
      return (
        <FillBlanksActivity
          activity={activity}
          onComplete={onComplete}
          onNext={onNext}
          onPrevious={onPrevious}
          showNavigation={showNavigation}
        />
      );
    case "matching":
      return (
        <MatchingActivity
          activity={activity}
          onComplete={onComplete}
          onNext={onNext}
          onPrevious={onPrevious}
          showNavigation={showNavigation}
        />
      );
    default:
      return <div>Unknown activity type</div>;
  }
}

function SlideActivity({
  activity,
  onComplete,
  onNext,
  onPrevious,
  showNavigation,
}: ActivityRendererProps) {
  const config = activity.config as SlideConfig;

  return (
    <div className="h-full">
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{config.title || activity.title}</h2>

        {config.media_url && (
          <motion.div
            className="mb-6 overflow-hidden rounded-xl shadow-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {config.media_type === "video" ? (
              <video src={config.media_url} controls className="w-full rounded-lg" />
            ) : (
              <Image
                src={config.media_url}
                alt={config.title || activity.title}
                width={800}
                height={400}
                className="w-full rounded-lg"
              />
            )}
          </motion.div>
        )}

        <motion.div
          className="prose prose-lg max-w-none text-gray-700 mb-8 p-6 rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 border border-brand-200/50"
          dangerouslySetInnerHTML={{ __html: config.content }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <NavigationButtons
          onComplete={onComplete}
          onNext={onNext}
          onPrevious={onPrevious}
          showNavigation={showNavigation}
        />
      </motion.div>
    </div>
  );
}

function QuizActivity({
  activity,
  onComplete,
  onNext,
  onPrevious,
  showNavigation,
}: ActivityRendererProps) {
  const config = activity.config as QuizConfig;
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setShowResult(true);
      setAnswered(true);
      if (selectedAnswer === config.correct_answer) {
        onComplete?.();
      }
    }
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswered(false);
  };

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="relative z-10"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{activity.title}</h2>

        <motion.div
          className="mb-8 p-6 rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 border border-brand-200/50"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="text-xl font-semibold text-gray-700 mb-6">{config.question}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.options.map((option, index) => (
              <motion.label
                key={index}
                whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedAnswer === index
                    ? showResult
                      ? index === config.correct_answer
                        ? "border-green-500 bg-gradient-to-r from-green-50 to-green-100"
                        : "border-red-500 bg-gradient-to-r from-red-50 to-red-100"
                      : "border-brand-500 bg-gradient-to-r from-brand-50 to-brand-100"
                    : showResult && index === config.correct_answer
                      ? "border-green-500 bg-gradient-to-r from-green-50 to-green-100"
                      : "border-gray-200 hover:border-brand-300 bg-gradient-to-r from-white to-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="quiz-option"
                  value={index}
                  checked={selectedAnswer === index}
                  onChange={() => !answered && setSelectedAnswer(index)}
                  disabled={answered}
                  className="w-4 h-4 text-brand-600 mr-3"
                />
                <span className="text-base font-medium text-gray-800">{option}</span>
                {showResult && index === config.correct_answer && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="ml-auto text-green-600 font-bold flex items-center"
                  >
                    <span className="h-6 w-6 flex items-center justify-center bg-green-100 rounded-full mr-1">
                      ✓
                    </span>
                    Correct
                  </motion.span>
                )}
                {showResult && selectedAnswer === index && index !== config.correct_answer && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="ml-auto text-red-600 font-bold flex items-center"
                  >
                    <span className="h-6 w-6 flex items-center justify-center bg-red-100 rounded-full mr-1">
                      ✗
                    </span>
                    Incorrect
                  </motion.span>
                )}
              </motion.label>
            ))}
          </div>
        </motion.div>

        {showResult && config.explanation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-6 p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200"
          >
            <h4 className="font-bold text-gray-800 mb-2">Explanation:</h4>
            <p className="text-gray-700">{config.explanation}</p>
          </motion.div>
        )}

        <motion.div
          className="flex justify-center space-x-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          {!answered ? (
            <motion.button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg shadow-md disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              Submit Answer
            </motion.button>
          ) : selectedAnswer === config.correct_answer ? (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md"
            >
              Correct! Well done!
            </motion.div>
          ) : (
            <motion.button
              onClick={handleReset}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg shadow-md hover:from-gray-600 hover:to-gray-700 transition-colors flex items-center"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </motion.button>
          )}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <NavigationButtons
          onComplete={onComplete}
          onNext={onNext}
          onPrevious={onPrevious}
          showNavigation={showNavigation}
          disabled={!answered || selectedAnswer !== config.correct_answer}
        />
      </motion.div>
    </motion.div>
  );
}

function FlashcardActivity({
  activity,
  onComplete,
  onNext,
  onPrevious,
  showNavigation,
}: ActivityRendererProps) {
  const config = activity.config as FlashcardConfig;
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studiedCards, setStudiedCards] = useState<Set<number>>(new Set());

  const currentCard = config.cards[currentCardIndex];
  const totalCards = config.cards.length;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setStudiedCards((prev) => new Set(prev).add(currentCardIndex));
      // Complete the activity if all cards have been studied
      if (studiedCards.size + 1 === totalCards) {
        onComplete?.();
      }
    }
  };

  const handleNextCard = () => {
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  };

  const shuffleCards = () => {
    const randomIndex = Math.floor(Math.random() * totalCards);
    setCurrentCardIndex(randomIndex);
    setIsFlipped(false);
  };

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="relative z-10"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{activity.title}</h2>
          <div className="flex items-center space-x-3">
            <motion.div
              className="bg-gradient-to-r from-brand-50 to-brand-100 px-4 py-2 rounded-lg border border-brand-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-sm font-bold text-brand-700">
                {currentCardIndex + 1} of {totalCards}
              </span>
            </motion.div>
            <motion.button
              onClick={shuffleCards}
              className="p-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-colors"
              title="Shuffle cards"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Shuffle className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        <div className="mb-6">
          <motion.div
            className={`flip-card ${isFlipped ? "flipped" : ""}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <motion.div
              className="flip-card-inner relative bg-gradient-to-br from-white to-brand-50 rounded-xl min-h-[280px] max-h-[320px] cursor-pointer shadow-md border border-brand-200 hover:shadow-lg transition-all mx-auto max-w-2xl"
              onClick={handleFlip}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flip-card-front absolute inset-0 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                <motion.div
                  className="bg-gradient-to-r from-brand-500 to-brand-600 text-white px-4 py-1.5 rounded-full text-xs font-bold mb-4"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Question
                </motion.div>
                <motion.p
                  className="text-lg font-medium text-gray-800 leading-relaxed mb-4 max-w-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  {currentCard.front}
                </motion.p>
                <motion.div
                  className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-1.5 rounded-full"
                  animate={{
                    scale: [1, 1.05, 1],
                    backgroundColor: [
                      "rgba(243, 244, 246, 1)",
                      "rgba(229, 231, 235, 1)",
                      "rgba(243, 244, 246, 1)",
                    ],
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <p className="text-xs text-gray-600 font-medium flex items-center">
                    Click to reveal answer
                  </p>
                </motion.div>
              </div>

              {/* Back of card */}
              <div className="flip-card-back absolute inset-0 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-gradient-to-br from-white to-green-50">
                <motion.div
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-1.5 rounded-full text-xs font-bold mb-4"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Answer
                </motion.div>
                <motion.p
                  className="text-lg font-medium text-gray-800 leading-relaxed mb-4 max-w-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  {currentCard.back}
                </motion.p>
                <motion.div
                  className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-1.5 rounded-full"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <p className="text-xs text-gray-600 font-medium flex items-center">
                    Click to flip back
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Card Navigation */}
          <motion.div
            className="flex items-center justify-between mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.button
              onClick={handlePrevCard}
              disabled={currentCardIndex === 0}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 disabled:from-gray-50 disabled:to-gray-100 disabled:text-gray-400 rounded-lg transition-colors font-medium text-gray-700 text-sm"
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </motion.button>

            <div className="text-center">
              <div className="flex space-x-2 mb-1">
                {config.cards.map((card, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      setCurrentCardIndex(index);
                      setIsFlipped(false);
                    }}
                    className={`w-3 h-3 rounded-full ${
                      index === currentCardIndex
                        ? "bg-gradient-to-r from-brand-400 to-brand-500"
                        : studiedCards.has(index)
                          ? "bg-gradient-to-r from-green-400 to-green-500"
                          : "bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400"
                    }`}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.8 }}
                    // transition={{ duration: 0.2 }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  />
                ))}
              </div>
              <motion.p
                className="text-xs font-medium text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {studiedCards.size} of {totalCards} studied
              </motion.p>
            </div>

            <motion.button
              onClick={handleNextCard}
              disabled={currentCardIndex === totalCards - 1}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-lg transition-colors font-medium text-sm"
              whileHover={{ scale: 1.05, x: 2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </motion.button>
          </motion.div>

          {currentCard.tags && currentCard.tags.length > 0 && (
            <motion.div
              className="mt-4 flex flex-wrap gap-2 justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {currentCard.tags.map((tag, index) => (
                <motion.span
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-brand-50 to-brand-100 text-brand-700 rounded-full text-xs font-medium border border-brand-200"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  whileHover={{ scale: 1.1 }}
                >
                  #{tag}
                </motion.span>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <NavigationButtons
          onComplete={onComplete}
          onNext={onNext}
          onPrevious={onPrevious}
          showNavigation={showNavigation}
        />
      </motion.div>
    </motion.div>
  );
}

function EmbedActivity({
  activity,
  onComplete,
  onNext,
  onPrevious,
  showNavigation,
}: ActivityRendererProps) {
  const config = activity.config as EmbedConfig;

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="relative z-10"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{activity.title}</h2>

        {config.description && (
          <motion.p
            className="text-gray-600 mb-6 text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            {config.description}
          </motion.p>
        )}

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {config.embed_type === "video" ? (
            <motion.div
              className="aspect-video overflow-hidden rounded-xl shadow-md"
              whileHover={{ scale: 1.01, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <iframe
                src={config.url}
                className="w-full h-full rounded-xl"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          ) : (
            <motion.div
              className="border border-brand-200 p-8 text-center rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 shadow-sm"
              whileHover={{ boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <ExternalLink className="w-12 h-12 text-brand-400 mx-auto mb-4" />
              </motion.div>

              <motion.h3
                className="text-xl font-bold text-gray-700 mb-3"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                {config.title}
              </motion.h3>

              {config.description && (
                <motion.p
                  className="text-gray-600 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  {config.description}
                </motion.p>
              )}

              <motion.a
                href={config.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium rounded-lg shadow-md"
                whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Resource
              </motion.a>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <NavigationButtons
          onComplete={onComplete}
          onNext={onNext}
          onPrevious={onPrevious}
          showNavigation={showNavigation}
        />
      </motion.div>
    </motion.div>
  );
}

function NavigationButtons({
  onNext,
  onPrevious,
  showNavigation,
  disabled = false,
}: {
  onComplete?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  showNavigation?: boolean;
  disabled?: boolean;
}) {
  if (!showNavigation) return null;

  return (
    <motion.div
      className="flex justify-between items-center mt-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {onPrevious ? (
        <motion.button
          onClick={onPrevious}
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center px-6 py-3 rounded-lg text-gray-700 transition-colors bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 border border-gray-200 font-medium shadow-sm"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </motion.button>
      ) : (
        <div />
      )}

      {onNext && (
        <motion.button
          onClick={onNext}
          disabled={disabled}
          whileHover={{ scale: 1.05, x: 2 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center px-8 py-3 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700 disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed transition-colors font-medium shadow-md"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </motion.button>
      )}
    </motion.div>
  );
}

// Draggable Word Component
function DraggableWord({ id, word, isUsed }: { id: string; word: string; isUsed: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: isUsed,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.3 : isUsed ? 0.4 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 select-none ${
        isUsed
          ? "cursor-not-allowed opacity-60 bg-gray-100"
          : "cursor-move bg-gradient-to-r from-brand-50 to-brand-100 border border-brand-200 text-brand-800"
      }`}
      whileHover={!isUsed ? { scale: 1.03 } : {}}
      whileTap={!isUsed ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center">
        <GripVertical className="w-4 h-4 mr-2 opacity-60" />
        {word}
      </div>
    </motion.div>
  );
}

// Droppable Blank Component
function DroppableBlank({
  id,
  word,
  isCorrect,
  showFeedback,
  onRemove,
}: {
  id: string;
  word?: string;
  isCorrect?: boolean;
  showFeedback: boolean;
  onRemove: () => void;
}) {
  const { setNodeRef, isOver } = useSortable({
    id: `blank-${id}`,
  });

  return (
    <motion.span
      className="inline-block mx-1"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        ref={setNodeRef}
        className={`inline-flex items-center justify-center min-w-[100px] h-10 border-2 border-dashed rounded-md ${
          word
            ? showFeedback
              ? isCorrect
                ? "border-green-500 bg-gradient-to-r from-green-50 to-green-100 text-green-800"
                : "border-red-500 bg-gradient-to-r from-red-50 to-red-100 text-red-800"
              : "border-brand-500 bg-gradient-to-r from-brand-50 to-brand-100 text-brand-800"
            : isOver
              ? "border-brand-400 bg-gradient-to-r from-brand-50 to-brand-100"
              : "border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100 hover:border-brand-400"
        }`}
        whileHover={{ scale: 1.02, boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
        whileTap={{ scale: 0.98 }}
      >
        {word ? (
          <div className="flex items-center">
            <span>{word}</span>
            {!showFeedback && (
              <motion.button
                onClick={onRemove}
                className="ml-2 text-xs text-gray-500 hover:text-red-500"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>
            )}
          </div>
        ) : (
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            Drop here
          </motion.span>
        )}
      </motion.div>
    </motion.span>
  );
}

function FillBlanksActivity({
  activity,
  onComplete,
  onNext,
  onPrevious,
  showNavigation,
}: ActivityRendererProps) {
  const config = activity.config as FillBlanksConfig;
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Create sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Extract available words from correct answers
  const availableWords = Array.from(
    new Set(config.blanks.map((blank) => blank.correct_answers).flat())
  ).sort(() => Math.random() - 0.5); // Shuffle

  // Add some distractors
  const distractors = ["ROI", "CAGR", "Beta", "Alpha", "Yield", "Margin", "Ratio", "Index"];
  const allWords = [...availableWords, ...distractors.slice(0, 3)].sort(() => Math.random() - 0.5);

  // Get used words
  const usedWords = Object.values(userAnswers);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !active) {
      setActiveId(null);
      return;
    }

    const activeWordId = active.id as string;
    const overTarget = over.id as string;

    // Find the actual word directly from allWords using the id pattern
    const wordIndex = parseInt(activeWordId.replace("word-", ""));
    const word = allWords[wordIndex];

    if (!word) {
      setActiveId(null);
      return;
    }

    // Check if dropping on a blank
    if (overTarget.startsWith("blank-")) {
      const blankId = overTarget.replace("blank-", "");

      // Remove this word from any existing blank first
      const updatedAnswers = { ...userAnswers };
      Object.keys(updatedAnswers).forEach((key) => {
        if (updatedAnswers[key] === word) {
          delete updatedAnswers[key];
        }
      });

      // Add word to new blank
      updatedAnswers[blankId] = word;
      setUserAnswers(updatedAnswers);
    }

    setActiveId(null);
  };

  const removeWordFromBlank = (blankId: string) => {
    setUserAnswers((prev) => {
      const updated = { ...prev };
      delete updated[blankId];
      return updated;
    });
  };

  const checkAnswers = () => {
    const isAllCorrect = config.blanks.every((blank, index) => {
      const userAnswer = userAnswers[index.toString()];
      return (
        userAnswer &&
        blank.correct_answers.some((correct) => correct.toLowerCase() === userAnswer.toLowerCase())
      );
    });

    setShowFeedback(true);
    if (isAllCorrect) {
      setIsCompleted(true);
      onComplete?.();
    }
  };

  const handleReset = () => {
    setUserAnswers({});
    setShowFeedback(false);
    setIsCompleted(false);
    setActiveId(null);
  };

  // Create word items with proper IDs (keep the order stable)
  const wordItems = allWords.map((word, index) => ({
    id: `word-${index}`,
    word,
    isUsed: usedWords.includes(word),
  }));

  // Create blank items with proper IDs
  const blankItems = config.blanks.map((blank, index) => `blank-${index}`);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <motion.div
        className="h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="relative z-10"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{activity.title}</h2>

          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <p className="text-gray-600 mb-6">{config.instruction}</p>

            {/* Text with blanks */}
            <motion.div
              className="bg-gradient-to-br from-white to-brand-50/50 p-6 border border-brand-200/50 shadow-sm mb-6 rounded-xl"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
            >
              <SortableContext items={blankItems}>
                <div className="text-lg leading-relaxed">
                  {config.text_with_blanks.split("_____").map((textPart, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                    >
                      {textPart}
                      {index < config.blanks.length && (
                        <DroppableBlank
                          id={index.toString()}
                          word={userAnswers[index.toString()]}
                          isCorrect={
                            userAnswers[index.toString()]
                              ? config.blanks[index].correct_answers.some(
                                  (correct) =>
                                    correct.toLowerCase() ===
                                    userAnswers[index.toString()]?.toLowerCase()
                                )
                              : undefined
                          }
                          showFeedback={showFeedback}
                          onRemove={() => removeWordFromBlank(index.toString())}
                        />
                      )}
                    </motion.span>
                  ))}
                </div>
              </SortableContext>
            </motion.div>

            {/* Available words */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Available Words:</h3>
              <motion.div
                className="flex flex-wrap gap-3 p-4 bg-gradient-to-br from-brand-50 to-brand-100 rounded-xl border border-brand-200/50"
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                {wordItems
                  .filter((item) => !item.isUsed)
                  .map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + idx * 0.05, duration: 0.3 }}
                    >
                      <DraggableWord id={item.id} word={item.word} isUsed={item.isUsed} />
                    </motion.div>
                  ))}
              </motion.div>
            </motion.div>

            {/* Check answers button */}
            {!isCompleted && (
              <motion.div
                className="text-center mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <motion.button
                  onClick={checkAnswers}
                  disabled={Object.keys(userAnswers).length !== config.blanks.length}
                  className="px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl shadow-md hover:shadow-lg disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Check Answers
                </motion.button>
              </motion.div>
            )}

            {/* Feedback */}
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className={`p-5 border rounded-xl mb-6 ${
                  isCompleted
                    ? "bg-gradient-to-r from-green-50 to-green-100 border-green-200 text-green-800"
                    : "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-800"
                }`}
              >
                <h4 className="font-bold mb-2">{isCompleted ? "Excellent!" : "Keep trying!"}</h4>
                <p className="mb-4">
                  {isCompleted
                    ? config.success_message || "You got all the answers correct!"
                    : "Some answers need adjustment. Check the highlighted blanks."}
                </p>
                {!isCompleted && (
                  <motion.div className="flex justify-center">
                    <motion.button
                      onClick={handleReset}
                      className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl shadow-md flex items-center"
                      whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Try Again
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <NavigationButtons
            onNext={onNext}
            onPrevious={onPrevious}
            showNavigation={showNavigation}
            disabled={!isCompleted}
          />
        </motion.div>
      </motion.div>

      <DragOverlay>
        {activeId && activeId.startsWith("word-") ? (
          <motion.div
            initial={{ scale: 1.05 }}
            className="px-4 py-2 bg-gradient-to-r from-brand-100 to-brand-200 text-brand-800 border border-brand-300 shadow-lg rounded-lg pointer-events-none"
          >
            <div className="flex items-center">
              <GripVertical className="w-4 h-4 mr-2 opacity-60" />
              {allWords[parseInt(activeId.replace("word-", ""))]}
            </div>
          </motion.div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function MatchingActivity({
  activity,
  onComplete,
  onNext,
  onPrevious,
  showNavigation,
}: ActivityRendererProps) {
  const config = activity.config as MatchingConfig;
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [itemRefs, setItemRefs] = useState<Record<string, HTMLDivElement | null>>({});

  // Generate IDs for each pair to use in matching
  const leftItems = config.pairs.map((pair, index) => ({
    id: `left-${index}`,
    content: pair.left,
    originalIndex: index,
  }));

  const rightItems = config.pairs.map((pair, index) => ({
    id: `right-${index}`,
    content: pair.right,
    originalIndex: index,
  }));

  // Shuffle right side items
  const [shuffledRightItems] = useState(() => [...rightItems].sort(() => Math.random() - 0.5));

  const handleLeftClick = (leftId: string) => {
    if (showFeedback) return;

    if (selectedLeft === leftId) {
      setSelectedLeft(null);
    } else {
      setSelectedLeft(leftId);

      // If there's already a match for this left item, auto-select the corresponding right item
      if (matches[leftId]) {
        setSelectedRight(matches[leftId]);
      } else {
        setSelectedRight(null);
      }
    }
  };

  const handleRightClick = (rightId: string) => {
    if (showFeedback) return;

    if (selectedRight === rightId) {
      setSelectedRight(null);
    } else if (selectedLeft) {
      // Create or update the match
      const updatedMatches = { ...matches };

      // Remove this right item from any existing matches
      Object.keys(updatedMatches).forEach((key) => {
        if (updatedMatches[key] === rightId) {
          delete updatedMatches[key];
        }
      });

      // Add new match
      updatedMatches[selectedLeft] = rightId;
      setMatches(updatedMatches);

      // Clear selections
      setSelectedLeft(null);
      setSelectedRight(null);
    } else {
      // Just select the right item
      setSelectedRight(rightId);

      // If there's a match for this right item, auto-select the corresponding left item
      const leftItemId = Object.keys(matches).find((key) => matches[key] === rightId);
      if (leftItemId) {
        setSelectedLeft(leftItemId);
      }
    }
  };

  const removeMatch = (leftId: string) => {
    if (showFeedback) return;

    const updatedMatches = { ...matches };
    delete updatedMatches[leftId];
    setMatches(updatedMatches);
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const checkMatches = () => {
    const isAllCorrect = leftItems.every((leftItem) => {
      const rightItem = shuffledRightItems.find((r) => matches[leftItem.id] === r.id);
      return rightItem && leftItem.originalIndex === rightItem.originalIndex;
    });

    setShowFeedback(true);
    if (isAllCorrect) {
      setIsCompleted(true);
      onComplete?.();
    }
  };

  const handleReset = () => {
    setMatches({});
    setShowFeedback(false);
    setIsCompleted(false);
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  // Reference callback to store refs to each card
  const setRef = (id: string, element: HTMLDivElement | null) => {
    setItemRefs(prev => ({
      ...prev,
      [id]: element
    }));
  };

  // Function to render connections between matched pairs
  const renderConnections = () => {
    return Object.entries(matches).map(([leftId, rightId]) => {
      const leftElement = itemRefs[leftId];
      const rightElement = itemRefs[rightId];

      if (!leftElement || !rightElement) return null;

      // Get the center points of each element
      const leftRect = leftElement.getBoundingClientRect();
      const rightRect = rightElement.getBoundingClientRect();

      const leftCenter = {
        x: leftRect.right,
        y: leftRect.top + leftRect.height / 2
      };

      const rightCenter = {
        x: rightRect.left,
        y: rightRect.top + rightRect.height / 2
      };

      // Calculate positions relative to the container
      const containerRect = document.getElementById('matching-container')?.getBoundingClientRect() || { left: 0, top: 0 };

      const x1 = leftCenter.x - containerRect.left;
      const y1 = leftCenter.y - containerRect.top;
      const x2 = rightCenter.x - containerRect.left;
      const y2 = rightCenter.y - containerRect.top;

      // Determine if the match is correct (only if showing feedback)
      const leftItem = leftItems.find(item => item.id === leftId);
      const rightItem = shuffledRightItems.find(item => item.id === rightId);
      const isCorrect = showFeedback && leftItem && rightItem && leftItem.originalIndex === rightItem.originalIndex;
      const isIncorrect = showFeedback && leftItem && rightItem && leftItem.originalIndex !== rightItem.originalIndex;

      const lineColor = isCorrect ? 'green' : isIncorrect ? 'red' : '#6366f1';
      const strokeWidth = isCorrect || isIncorrect ? 3 : 2;
      const dashArray = selectedLeft === leftId && selectedRight === rightId ? "5,5" : "none";

      return (
        <motion.svg
          key={`${leftId}-${rightId}`}
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={lineColor}
            strokeWidth={strokeWidth}
            strokeDasharray={dashArray}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Small circle at each end of the line */}
          <motion.circle cx={x1} cy={y1} r={4} fill={lineColor} />
          <motion.circle cx={x2} cy={y2} r={4} fill={lineColor} />

          {/* Show check or x mark on the line if showing feedback */}
          {showFeedback && (
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              {isCorrect ? (
                <motion.text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2 - 10}
                  textAnchor="middle"
                  fontSize="16"
                  fill="green"
                  fontWeight="bold"
                >
                  ✓
                </motion.text>
              ) : isIncorrect ? (
                <motion.text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2 - 10}
                  textAnchor="middle"
                  fontSize="16"
                  fill="red"
                  fontWeight="bold"
                >
                  ✗
                </motion.text>
              ) : null}
            </motion.g>
          )}
        </motion.svg>
      );
    });
  };

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="relative z-10"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{activity.title}</h2>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <p className="text-gray-600 mb-6">{config.instruction}</p>

          {/* Selection instructions */}
          <motion.div
            className="mb-6 p-4 bg-gradient-to-r from-brand-50 to-brand-100/50 border border-brand-200 rounded-xl shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            whileHover={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
          >
            <p className="text-sm text-brand-800 font-medium flex items-center">
              <motion.span
                animate={{ rotate: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="mr-2"
              >
                💡
              </motion.span>
              Click on a term and then click on its matching definition to connect them with a line.
              Click on the same item again to unselect it.
            </p>
          </motion.div>

          {/* Matching interface - Container for both columns and connections */}
          <div id="matching-container" className="relative">
            {/* Connection lines between matched pairs */}
            {renderConnections()}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Left column - Terms */}
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Terms</h3>
                {leftItems.map((item, index) => {
                  const isMatched = !!matches[item.id];
                  const isSelected = selectedLeft === item.id;
                  const matchedRightId = matches[item.id];
                  const matchedRight = shuffledRightItems.find((r) => r.id === matchedRightId);
                  const isCorrect =
                    showFeedback && matchedRight && item.originalIndex === matchedRight.originalIndex;
                  const isIncorrect =
                    showFeedback && matchedRight && item.originalIndex !== matchedRight.originalIndex;

                  return (
                    <motion.div
                      key={item.id}
                      ref={(el) => setRef(item.id, el)}
                      onClick={() => handleLeftClick(item.id)}
                      className={`p-3 border-2 cursor-pointer rounded-xl shadow-sm ${
                        isSelected
                          ? "border-brand-500 bg-gradient-to-r from-brand-50 to-brand-100"
                          : isMatched
                            ? isCorrect
                              ? "border-green-500 bg-gradient-to-r from-green-50 to-green-100"
                              : isIncorrect
                                ? "border-red-500 bg-gradient-to-r from-red-50 to-red-100"
                                : "border-brand-500 bg-gradient-to-r from-brand-50 to-brand-100"
                            : "border-gray-200 bg-gradient-to-r from-white to-gray-50 hover:border-brand-300"
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                      whileHover={{ scale: 1.02, boxShadow: "0 4px 8px rgba(0,0,0,0.05)" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800">{item.content}</span>
                        <div className="flex items-center">
                          {isSelected && (
                            <motion.span
                              animate={{ x: [0, 5, 0] }}
                              transition={{ repeat: Infinity, duration: 1 }}
                              className="ml-2 text-brand-600 font-bold"
                            >
                              →
                            </motion.span>
                          )}
                          {isMatched && (
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeMatch(item.id);
                              }}
                              className="ml-2 text-gray-400 hover:text-red-500"
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              ✕
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Right column - Definitions */}
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Definitions</h3>
                {shuffledRightItems.map((item, index) => {
                  const isMatched = Object.values(matches).includes(item.id);
                  const isSelected = selectedRight === item.id;
                  const matchedLeftId = Object.keys(matches).find(key => matches[key] === item.id);
                  const matchedLeft = leftItems.find(left => left.id === matchedLeftId);
                  const isCorrect = showFeedback && matchedLeft && matchedLeft.originalIndex === item.originalIndex;
                  const isIncorrect = showFeedback && matchedLeft && matchedLeft.originalIndex !== item.originalIndex;

                  return (
                    <motion.div
                      key={item.id}
                      ref={(el) => setRef(item.id, el)}
                      onClick={() => handleRightClick(item.id)}
                      className={`p-3 border-2 cursor-pointer rounded-xl shadow-sm ${
                        isSelected
                          ? "border-brand-500 bg-gradient-to-r from-brand-50 to-brand-100"
                          : isMatched
                            ? isCorrect
                              ? "border-green-500 bg-gradient-to-r from-green-50 to-green-100"
                              : isIncorrect
                                ? "border-red-500 bg-gradient-to-r from-red-50 to-red-100"
                                : "border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100"
                            : "border-brand-200 bg-gradient-to-r from-brand-50 to-brand-100 hover:border-brand-300"
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                      whileHover={{ scale: 1.02, boxShadow: "0 4px 8px rgba(0,0,0,0.05)" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800">{item.content}</span>
                        {isSelected && (
                          <motion.span
                            animate={{ x: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="text-brand-600 font-bold"
                          >
                            ←
                          </motion.span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>

          {/* Check matches button */}
          {!isCompleted && (
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <motion.button
                onClick={checkMatches}
                disabled={Object.keys(matches).length !== config.pairs.length}
                className="px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl shadow-md disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05, boxShadow: "0 6px 15px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.98 }}
              >
                Check Matches
              </motion.button>
            </motion.div>
          )}

          {/* Feedback */}
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              className={`p-5 border rounded-xl mb-6 ${
                isCompleted
                  ? "bg-gradient-to-r from-green-50 to-green-100 border-green-200 text-green-800"
                  : "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-800"
              }`}
            >
              <h4 className="font-bold mb-2">{isCompleted ? "Perfect Match!" : "Try Again!"}</h4>
              <p className="mb-4">
                {isCompleted
                  ? config.success_message || "You matched all pairs correctly!"
                  : "Some matches need adjustment. Check the highlighted pairs."}
              </p>
              {!isCompleted && (
                <motion.div className="flex justify-center">
                  <motion.button
                    onClick={handleReset}
                    className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg shadow-md flex items-center"
                    whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Again
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      >
        <NavigationButtons
          onNext={onNext}
          onPrevious={onPrevious}
          showNavigation={showNavigation}
          disabled={!isCompleted}
        />
      </motion.div>
    </motion.div>
  );
}
