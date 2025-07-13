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
import { ChevronRight, ExternalLink, GripVertical, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  Activity,
  EmbedConfig,
  FillBlanksConfig,
  FlashcardConfig,
  MatchingConfig,
  QuizConfig,
  SlideConfig,
} from "~/types/program";

interface ActivityRendererProps {
  activity: Activity;
  onNext?: () => void;
  isCompleted?: boolean;
  isLastActivity?: boolean;
  isAudioPlaying?: boolean;
}

export function ActivityRenderer({
  activity,
  onNext,
  isCompleted = false,
  isLastActivity = false,
  isAudioPlaying = false,
}: ActivityRendererProps) {
  switch (activity.type) {
    case "slide":
      return (
        <SlideActivity
          activity={activity}
          onNext={onNext}
          isCompleted={isCompleted}
          isLastActivity={isLastActivity}
          isAudioPlaying={isAudioPlaying}
        />
      );
    case "quiz":
      return (
        <QuizActivity
          activity={activity}
          onNext={onNext}
          isCompleted={isCompleted}
          isLastActivity={isLastActivity}
          isAudioPlaying={isAudioPlaying}
        />
      );
    case "embed":
      return (
        <EmbedActivity
          activity={activity}
          onNext={onNext}
          isCompleted={isCompleted}
          isLastActivity={isLastActivity}
          isAudioPlaying={isAudioPlaying}
        />
      );
    case "flashcard":
      return (
        <FlashcardActivity
          activity={activity}
          onNext={onNext}
          isCompleted={isCompleted}
          isLastActivity={isLastActivity}
          isAudioPlaying={isAudioPlaying}
        />
      );
    case "fill_blanks":
      return (
        <FillBlanksActivity
          activity={activity}
          onNext={onNext}
          isCompleted={isCompleted}
          isLastActivity={isLastActivity}
          isAudioPlaying={isAudioPlaying}
        />
      );
    case "matching":
      return (
        <MatchingActivity
          activity={activity}
          onNext={onNext}
          isCompleted={isCompleted}
          isLastActivity={isLastActivity}
          isAudioPlaying={isAudioPlaying}
        />
      );
    default:
      return <div>Unknown activity type</div>;
  }
}

interface NextButtonProps {
  disabled?: boolean;
  isCompleted?: boolean;
  isLastActivity?: boolean;
  onClick?: () => void;
}

function NextButton({
  disabled = false,
  isCompleted = false,
  isLastActivity = false,
  onClick,
}: NextButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={(!isCompleted && disabled) || (isCompleted && isLastActivity)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center px-4 py-2 rounded-lg shadow-sm transition-colors text-sm font-medium ${
        isLastActivity
          ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          : "bg-gradient-to-r from-ring to-primary"
      } text-white disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed`}
    >
      {isLastActivity ? (isCompleted ? "Completed" : "Mark Complete") : "Continue"}
      {!isLastActivity && <ChevronRight className="w-3 h-3 ml-1" />}
      {isLastActivity && <span className="ml-2">🎉</span>}
    </motion.button>
  );
}

function ActionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mt-auto w-full bg-white border-t border-gray-200 shadow-lg rounded-b-xl p-4"
    >
      {children}
    </motion.div>
  );
}

function SlideActivity({
  activity,
  onNext,
  isCompleted,
  isLastActivity,
  isAudioPlaying,
}: ActivityRendererProps) {
  const config = activity.config as SlideConfig;
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (!isCompleted && !hasInteracted) {
      const timer = setTimeout(() => {
        setHasInteracted(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isCompleted, hasInteracted]);

  return (
    <>
      <div className="flex-1 w-full p-6 overflow-y-auto custom-scrollbar">
        <h2 className="text-xl font-bold text-gray-800 mb-6">{activity.title}</h2>

        <motion.div
          className="prose prose-lg max-w-none text-gray-700 leading-loose"
          dangerouslySetInnerHTML={{ __html: config.content }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
      </div>

      <ActionWrapper>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {hasInteracted || isCompleted ? (
              <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                ✓ Slide Read
              </div>
            ) : (
              <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                👁️‍🗨️ Read slide for 5 seconds to continue
              </div>
            )}
          </div>

          <NextButton
            isCompleted={isCompleted}
            disabled={!hasInteracted || isAudioPlaying}
            isLastActivity={isLastActivity}
            onClick={onNext}
          />
        </div>
      </ActionWrapper>
    </>
  );
}

function FlashcardActivity({
  activity,
  onNext,
  isCompleted,
  isLastActivity,
  isAudioPlaying,
}: ActivityRendererProps) {
  const config = activity.config as FlashcardConfig;
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [viewedCards, setViewedCards] = useState<Set<number>>(new Set());

  const totalCards = config.cards.length;
  const allCardsViewed = viewedCards.size === totalCards;

  const handleCardFlip = (index: number) => {
    setFlippedCards((prev) => {
      const updated = new Set(prev);
      if (updated.has(index)) {
        updated.delete(index);
      } else {
        updated.add(index);
        // Mark card as viewed when flipped
        setViewedCards((prevViewed) => {
          const updatedViewed = new Set(prevViewed);
          updatedViewed.add(index);
          return updatedViewed;
        });
      }
      return updated;
    });
  };

  const handleFlipAll = () => {
    if (flippedCards.size === totalCards) {
      // If all cards are flipped, unflip all
      setFlippedCards(new Set());
    } else {
      // Otherwise, flip all cards
      const allFlipped = new Set<number>();
      const allViewed = new Set<number>(viewedCards);

      config.cards.forEach((_, index) => {
        allFlipped.add(index);
        allViewed.add(index);
      });

      setFlippedCards(allFlipped);
      setViewedCards(allViewed);
    }
  };

  return (
    <>
      <div className="flex-1 w-full flex flex-col p-6 overflow-y-auto custom-scrollbar">
        <h2 className="text-xl font-bold text-gray-800 mb-6">{activity.title}</h2>

        <div className="flex flex-col items-center mb-4">
          <motion.div
            className="mb-4 text-sm font-medium text-gray-600 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="mr-4">{totalCards} flashcards in this deck</span>

            <motion.button
              onClick={handleFlipAll}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-1.5 bg-gradient-to-r from-muted to-accent text-primary
                rounded-lg border border-ring shadow-sm text-sm font-medium flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1.5"
              >
                <path d="M21 2v6h-6" />
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                <path d="M3 22v-6h6" />
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
              </svg>
              {flippedCards.size === totalCards ? "Flip All Back" : "Flip All Cards"}
            </motion.button>
          </motion.div>

          <motion.p
            className="text-sm text-gray-600 text-center mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Click on any card to flip it and reveal the answer
          </motion.p>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {config.cards.map((card, index) => {
            const isFlipped = flippedCards.has(index);

            return (
              <motion.div
                key={index}
                className="perspective-1000"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <motion.div
                  className="relative w-full h-full rounded-xl shadow-lg cursor-pointer transition-transform duration-500"
                  onClick={() => handleCardFlip(index)}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  style={{ transformStyle: "preserve-3d", minHeight: "180px" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className={`absolute w-full h-full backface-hidden p-5 rounded-xl
                      bg-gradient-to-br from-muted to-accent border border-accent
                      flex items-center justify-center text-center`}
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <p className="text-base font-semibold text-gray-700">{card.front}</p>
                  </motion.div>

                  <motion.div
                    className={`absolute w-full h-full backface-hidden p-5 rounded-xl
                      bg-gradient-to-br from-muted to-accent border border-ring
                      flex items-center justify-center text-center`}
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <p className="text-base text-gray-700">{card.back}</p>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="mt-2 text-xs font-medium text-gray-500 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  Card {index + 1} {isFlipped ? "✓" : ""}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <ActionWrapper>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {allCardsViewed ? (
              <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                ✓ All cards viewed
              </div>
            ) : (
              <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                {viewedCards.size} of {totalCards} cards viewed
              </div>
            )}
          </div>

          <NextButton
            isCompleted={isCompleted}
            disabled={!allCardsViewed || isAudioPlaying}
            isLastActivity={isLastActivity}
            onClick={onNext}
          />
        </div>
      </ActionWrapper>
    </>
  );
}

function QuizActivity({
  activity,
  onNext,
  isCompleted,
  isLastActivity,
  isAudioPlaying,
}: ActivityRendererProps) {
  const config = activity.config as QuizConfig;
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const handleSubmit = () => {
    if (userAnswer !== null && !answered) {
      setShowResult(true);
      setAnswered(true);
    }
  };

  const handleReset = () => {
    setUserAnswer(null);
    setShowResult(false);
    setAnswered(false);
  };

  return (
    <>
      <div className="flex-1 w-full p-6 overflow-y-auto custom-scrollbar">
        <h2 className="text-xl font-bold text-gray-800 mb-6">{activity.title}</h2>

        <motion.div
          className="mb-8 p-6 rounded-xl bg-gradient-to-br from-muted to-accent border border-accent/50"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-6">{config.question}</h3>

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
                  userAnswer === index
                    ? showResult
                      ? index === config.correct_answer
                        ? "border-green-500 bg-gradient-to-r from-green-50 to-green-100"
                        : "border-red-500 bg-gradient-to-r from-red-50 to-red-100"
                      : "border-primary bg-gradient-to-r from-muted to-accent"
                    : showResult && index === config.correct_answer
                      ? "border-green-500 bg-gradient-to-r from-green-50 to-green-100"
                      : "border-gray-200 hover:border-ring bg-gradient-to-r from-white to-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="quiz-option"
                  value={index}
                  checked={userAnswer === index}
                  onChange={() => !answered && setUserAnswer(index)}
                  disabled={answered}
                  className="w-4 h-4 text-primary mr-3"
                />
                <span className="text-base font-medium text-gray-800">{option}</span>
                {showResult && index === config.correct_answer && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="ml-auto text-green-600 font-semibold flex items-center"
                  >
                    <span className="h-6 w-6 flex items-center justify-center bg-green-100 rounded-full mr-1">
                      ✓
                    </span>
                    Correct
                  </motion.span>
                )}
                {showResult && userAnswer === index && index !== config.correct_answer && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="ml-auto text-red-600 font-semibold flex items-center"
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
            className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200"
          >
            <h4 className="font-bold text-gray-800 mb-2">Explanation:</h4>
            <p className="text-gray-700">{config.explanation}</p>
          </motion.div>
        )}
      </div>

      <ActionWrapper>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {!answered ? (
              <motion.button
                onClick={handleSubmit}
                disabled={userAnswer === null}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-gradient-to-r from-ring to-primary text-white rounded-lg shadow-sm disabled:opacity-70 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                Check Answer
              </motion.button>
            ) : (
              <>
                {userAnswer !== config.correct_answer && (
                  <motion.button
                    onClick={handleReset}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg shadow-sm hover:from-gray-600 hover:to-gray-700 transition-colors flex items-center text-sm font-medium"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Try Again
                  </motion.button>
                )}
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    userAnswer === config.correct_answer
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {userAnswer === config.correct_answer ? "✓ Correct" : "✗ Incorrect"}
                </div>
              </>
            )}
          </div>

          <NextButton
            isCompleted={isCompleted}
            disabled={!answered || isAudioPlaying}
            isLastActivity={isLastActivity}
            onClick={onNext}
          />
        </div>
      </ActionWrapper>
    </>
  );
}

function EmbedActivity({
  activity,
  onNext,
  isCompleted,
  isLastActivity,
  isAudioPlaying,
}: ActivityRendererProps) {
  const config = activity.config as EmbedConfig;
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (config.embed_type === "video" && !isCompleted) {
      const timer = setTimeout(() => {
        setHasInteracted(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [config.embed_type, isCompleted]);

  const handleExternalLinkClick = () => {
    if (!isCompleted) setHasInteracted(true);
  };

  return (
    <>
      <div className="flex-1 w-full p-6 overflow-y-auto custom-scrollbar">
        <h2 className="text-xl font-bold text-gray-800 mb-6">{activity.title}</h2>

        {/* {config.embed_type === "video" && (
          <motion.p
            className="text-gray-600 mb-6 text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            {activity.description}
          </motion.p>
        )} */}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {config.embed_type === "video" ? (
            <motion.div
              className="aspect-[21/9] overflow-hidden rounded-xl shadow-md"
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
              className="border border-accent p-8 text-center rounded-xl bg-gradient-to-br from-muted to-accent shadow-sm"
              whileHover={{ boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <ExternalLink className="w-12 h-12 text-ring mx-auto mb-4" />
              </motion.div>

              <motion.h3
                className="text-xl font-bold text-gray-700 mb-3"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                {activity.title}
              </motion.h3>

              {/* <motion.p
                className="text-gray-600 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                {activity.description}
              </motion.p> */}

              <motion.a
                href={config.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleExternalLinkClick}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-ring to-primary text-white font-medium rounded-lg shadow-md"
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
      </div>

      <ActionWrapper>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {hasInteracted || isCompleted ? (
              <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                {config.embed_type === "video" ? "✓ Video Watched" : "✓ Link Clicked"}
              </div>
            ) : (
              <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                {config.embed_type === "video"
                  ? "🎥 Watch video for 5 seconds to continue"
                  : "🔗 Click the link to continue"}
              </div>
            )}
          </div>

          <NextButton
            isCompleted={isCompleted}
            disabled={!hasInteracted || isAudioPlaying}
            isLastActivity={isLastActivity}
            onClick={onNext}
          />
        </div>
      </ActionWrapper>
    </>
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
          : "cursor-move bg-gradient-to-r from-muted to-accent border border-accent text-primary"
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
              : "border-primary bg-gradient-to-r from-muted to-accent text-primary"
            : isOver
              ? "border-ring bg-gradient-to-r from-muted to-accent"
              : "border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100 hover:border-ring"
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
  onNext,
  isCompleted,
  isLastActivity,
  isAudioPlaying,
}: ActivityRendererProps) {
  const config = activity.config as FillBlanksConfig;
  const [userAnswer, setUserAnswer] = useState<Record<string, string>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  // Add state to store active word during drag
  const [activeWord, setActiveWord] = useState<string | null>(null);

  // Create sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Extract available words from correct answers and keep them stable with useState
  const [availableWords] = useState(() =>
    Array.from(new Set(config.blanks.map((blank) => blank.correct_answers).flat())).sort(
      () => Math.random() - 0.5
    )
  ); // Shuffle once during initialization

  // Add some distractors - also stable with useState
  const distractors = ["ROI", "CAGR", "Beta", "Alpha", "Yield", "Margin", "Ratio", "Index"];
  const [allWords] = useState(() =>
    [...availableWords, ...distractors.slice(0, 3)].sort(() => Math.random() - 0.5)
  ); // Shuffle once during initialization

  // Get used words
  const usedWords = Object.values(userAnswer);

  const handleDragStart = (event: DragStartEvent) => {
    const activeWordId = event.active.id as string;
    setActiveId(activeWordId);

    // Store the actual word being dragged
    if (activeWordId.startsWith("word-")) {
      const wordIndex = parseInt(activeWordId.replace("word-", ""));
      setActiveWord(allWords[wordIndex]);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !active || !activeWord) {
      setActiveId(null);
      setActiveWord(null);
      return;
    }

    const overTarget = over.id as string;

    // Check if dropping on a blank
    if (overTarget.startsWith("blank-")) {
      const blankId = overTarget.replace("blank-", "");

      // Remove this word from any existing blank first
      const updatedAnswers = { ...userAnswer };
      Object.keys(updatedAnswers).forEach((key) => {
        if (updatedAnswers[key] === activeWord) {
          delete updatedAnswers[key];
        }
      });

      // Add word to new blank
      updatedAnswers[blankId] = activeWord;
      setUserAnswer(updatedAnswers);
    }

    setActiveId(null);
    setActiveWord(null);
  };

  const removeWordFromBlank = (blankId: string) => {
    setUserAnswer((prev) => {
      const updated = { ...prev };
      delete updated[blankId];
      return updated;
    });
  };

  const checkAnswers = () => {
    if (!answered) {
      setShowFeedback(true);
      setAnswered(true);
    }
  };

  const handleReset = () => {
    setUserAnswer({});
    setShowFeedback(false);
    setAnswered(false);
    setActiveId(null);
  };

  // Check if all blanks are filled correctly
  const isAllCorrect = () => {
    if (Object.keys(userAnswer).length !== config.blanks.length) return false;

    return config.blanks.every((blank, index) => {
      const userWord = userAnswer[index.toString()];
      return (
        userWord &&
        blank.correct_answers.some((correct) => correct.toLowerCase() === userWord.toLowerCase())
      );
    });
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
      <div className="flex-1 w-full p-6 overflow-y-auto custom-scrollbar">
        <h2 className="text-xl font-bold text-gray-800 mb-6">{activity.title}</h2>

        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <p className="text-gray-600 mb-6">{config.instruction}</p>

          {/* Text with blanks */}
          <motion.div
            className="bg-gradient-to-br from-white to-muted/50 p-6 border border-accent/50 shadow-sm mb-6 rounded-xl"
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
                        word={userAnswer[index.toString()]}
                        isCorrect={
                          userAnswer[index.toString()]
                            ? config.blanks[index].correct_answers.some(
                                (correct) =>
                                  correct.toLowerCase() ===
                                  userAnswer[index.toString()]?.toLowerCase()
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
              className="flex flex-wrap gap-3 p-4 bg-gradient-to-br from-muted to-accent rounded-xl border border-accent/50"
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
        </motion.div>
      </div>

      <ActionWrapper>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {!answered ? (
              <motion.button
                onClick={checkAnswers}
                disabled={Object.keys(userAnswer).length !== config.blanks.length}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-gradient-to-r from-ring to-primary text-white rounded-lg shadow-sm disabled:opacity-70 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                Check Answers
              </motion.button>
            ) : (
              <>
                {!isAllCorrect() && (
                  <motion.button
                    onClick={handleReset}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg shadow-sm hover:from-gray-600 hover:to-gray-700 transition-colors flex items-center text-sm font-medium"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Try Again
                  </motion.button>
                )}
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isAllCorrect() ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {isAllCorrect() ? "✓ Correct" : "✗ Incorrect"}
                </div>
              </>
            )}
          </div>

          <NextButton
            isCompleted={isCompleted}
            disabled={!answered || isAudioPlaying}
            isLastActivity={isLastActivity}
            onClick={onNext}
          />
        </div>
      </ActionWrapper>

      <DragOverlay>
        {activeId && activeId.startsWith("word-") && activeWord ? (
          <motion.div
            initial={{ scale: 1.05 }}
            className="px-4 py-2 bg-gradient-to-r from-muted to-accent text-primary border border-ring shadow-lg rounded-lg pointer-events-none"
          >
            <div className="flex items-center">
              <GripVertical className="w-4 h-4 mr-2 opacity-60" />
              {activeWord}
            </div>
          </motion.div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function MatchingActivity({
  activity,
  onNext,
  isCompleted,
  isLastActivity,
  isAudioPlaying,
}: ActivityRendererProps) {
  const config = activity.config as MatchingConfig;
  const [userAnswer, setUserAnswer] = useState<Record<string, string>>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
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
    if (selectedLeft === leftId) {
      setSelectedLeft(null);
    } else {
      setSelectedLeft(leftId);

      // If there's already a match for this left item, auto-select the corresponding right item
      if (userAnswer[leftId]) {
        setSelectedRight(userAnswer[leftId]);
      } else {
        setSelectedRight(null);
      }
    }
  };

  const handleRightClick = (rightId: string) => {
    if (selectedRight === rightId) {
      setSelectedRight(null);
    } else if (selectedLeft) {
      // Create or update the match
      const updatedMatches = { ...userAnswer };

      // Remove this right item from any existing matches
      Object.keys(updatedMatches).forEach((key) => {
        if (updatedMatches[key] === rightId) {
          delete updatedMatches[key];
        }
      });

      // Add new match
      updatedMatches[selectedLeft] = rightId;
      setUserAnswer(updatedMatches);

      // Clear selections
      setSelectedLeft(null);
      setSelectedRight(null);
    } else {
      // Just select the right item
      setSelectedRight(rightId);

      // If there's a match for this right item, auto-select the corresponding left item
      const leftItemId = Object.keys(userAnswer).find((key) => userAnswer[key] === rightId);
      if (leftItemId) {
        setSelectedLeft(leftItemId);
      }
    }
  };

  const removeMatch = (leftId: string) => {
    const updatedMatches = { ...userAnswer };
    delete updatedMatches[leftId];
    setUserAnswer(updatedMatches);
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const checkMatches = () => {
    if (!answered) {
      setAnswered(true);
      // Only check the answers when the button is explicitly clicked
    }
  };

  const handleReset = () => {
    setUserAnswer({});
    setSelectedLeft(null);
    setSelectedRight(null);
    setAnswered(false);

    // Don't clear item refs when resetting to ensure connections still work
    // on subsequent attempts
  };

  // Effect to ensure line rendering on connection changes
  useEffect(() => {
    // This will trigger a re-render when user answers change
    // helping ensure the connection lines are properly drawn
    if (Object.keys(userAnswer).length > 0) {
      // Small delay to ensure refs are properly set
      const timer = setTimeout(() => {
        setItemRefs((prev) => ({ ...prev }));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [userAnswer]);

  // Check if all matches are correct
  const isAllCorrect = () => {
    if (Object.keys(userAnswer).length !== config.pairs.length) return false;

    return Object.entries(userAnswer).every(([leftId, rightId]) => {
      const leftItem = leftItems.find((item) => item.id === leftId);
      const rightItem = shuffledRightItems.find((item) => item.id === rightId);
      return leftItem && rightItem && leftItem.originalIndex === rightItem.originalIndex;
    });
  };

  // Reference callback to store refs to each card
  const setRef = (id: string, element: HTMLDivElement | null) => {
    if (element) {
      // Only update if the element exists to avoid null refs
      setItemRefs((prev) => ({
        ...prev,
        [id]: element,
      }));
    }
  };

  // Function to render connections between matched pairs
  const renderConnections = () => {
    // Skip rendering if we have no user answers
    if (Object.keys(userAnswer).length === 0) return null;

    return Object.entries(userAnswer).map(([leftId, rightId]) => {
      const leftElement = itemRefs[leftId];
      const rightElement = itemRefs[rightId];

      if (!leftElement || !rightElement) return null;

      // Get the center points of each element
      const leftRect = leftElement.getBoundingClientRect();
      const rightRect = rightElement.getBoundingClientRect();

      const leftCenter = {
        x: leftRect.right + 10, // Increased from 15px to 20px offset
        y: leftRect.top + leftRect.height / 2,
      };

      const rightCenter = {
        x: rightRect.left - 10, // Increased from 15px to 20px offset
        y: rightRect.top + rightRect.height / 2,
      };

      // Calculate positions relative to the container
      const containerRect = document
        .getElementById("matching-container")
        ?.getBoundingClientRect() || { left: 0, top: 0 };

      const x1 = leftCenter.x - containerRect.left;
      const y1 = leftCenter.y - containerRect.top;
      const x2 = rightCenter.x - containerRect.left;
      const y2 = rightCenter.y - containerRect.top; // Create a direct straight line between points
      const d = `
        M ${x1} ${y1}
        L ${x2} ${y2}
      `;

      // Determine if the match is correct (only if showing feedback)
      const leftItem = leftItems.find((item) => item.id === leftId);
      const rightItem = shuffledRightItems.find((item) => item.id === rightId);
      const isCorrect = leftItem && rightItem && leftItem.originalIndex === rightItem.originalIndex;
      const isIncorrect =
        leftItem && rightItem && leftItem.originalIndex !== rightItem.originalIndex;
      const showFeedback = answered;

      const lineColor = showFeedback
        ? isCorrect
          ? "#22c55e"
          : isIncorrect
            ? "#ef4444"
            : "#6366f1"
        : "#6366f1";
      const strokeWidth = showFeedback ? (isCorrect || isIncorrect ? 3 : 2) : 2;
      const dashArray = selectedLeft === leftId && selectedRight === rightId ? "5,5" : "none";

      return (
        <motion.svg
          key={`${leftId}-${rightId}`}
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.path
            d={d}
            fill="none"
            stroke={lineColor}
            strokeWidth={strokeWidth}
            strokeDasharray={dashArray}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6 }}
          />

          {/* Small circle at each end of the path */}
          <motion.circle cx={x1} cy={y1} r={4} fill={lineColor} />
          <motion.circle cx={x2} cy={y2} r={4} fill={lineColor} />
        </motion.svg>
      );
    });
  };

  return (
    <>
      <div className="flex-1 w-full p-6 overflow-y-auto custom-scrollbar">
        <h2 className="text-xl font-bold text-gray-800 mb-6">{activity.title}</h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <p className="text-gray-600 mb-6">{config.instruction}</p>

          {/* Selection instructions */}
          <motion.div
            className="mb-6 p-4 bg-gradient-to-r from-muted to-accent/50 border border-accent rounded-xl shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            whileHover={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
          >
            <p className="text-sm text-primary font-medium flex items-center">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
              {/* Left column - Terms */}
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Terms</h3>
                {leftItems.map((item, index) => {
                  const isMatched = !!userAnswer[item.id];
                  const isSelected = selectedLeft === item.id;
                  const matchedRightId = userAnswer[item.id];
                  const matchedRight = shuffledRightItems.find((r) => r.id === matchedRightId);
                  const isCorrect =
                    answered && matchedRight && item.originalIndex === matchedRight.originalIndex;
                  const isIncorrect =
                    answered && matchedRight && item.originalIndex !== matchedRight.originalIndex;

                  return (
                    <motion.div
                      key={item.id}
                      ref={(el) => setRef(item.id, el)}
                      onClick={() => handleLeftClick(item.id)}
                      className={`p-3 border-2 cursor-pointer rounded-xl shadow-sm ${
                        isSelected
                          ? "border-primary bg-gradient-to-r from-muted to-accent"
                          : isMatched
                            ? answered
                              ? isCorrect
                                ? "border-green-500 bg-gradient-to-r from-green-50 to-green-100"
                                : isIncorrect
                                  ? "border-red-500 bg-gradient-to-r from-red-50 to-red-100"
                                  : "border-primary bg-gradient-to-r from-muted to-accent"
                              : "border-primary bg-gradient-to-r from-muted to-accent"
                            : "border-gray-200 bg-gradient-to-r from-white to-gray-50 hover:border-ring"
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
                              className="ml-2 text-primary font-semibold"
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
                  const isMatched = Object.values(userAnswer).includes(item.id);
                  const isSelected = selectedRight === item.id;
                  const matchedLeftId = Object.keys(userAnswer).find(
                    (key) => userAnswer[key] === item.id
                  );
                  const matchedLeft = leftItems.find((left) => left.id === matchedLeftId);
                  const isCorrect =
                    answered && matchedLeft && matchedLeft.originalIndex === item.originalIndex;
                  const isIncorrect =
                    answered && matchedLeft && matchedLeft.originalIndex !== item.originalIndex;

                  return (
                    <motion.div
                      key={item.id}
                      ref={(el) => setRef(item.id, el)}
                      onClick={() => handleRightClick(item.id)}
                      className={`p-3 border-2 cursor-pointer rounded-xl shadow-sm ${
                        isSelected
                          ? "border-primary bg-gradient-to-r from-muted to-accent"
                          : isMatched
                            ? answered
                              ? isCorrect
                                ? "border-green-500 bg-gradient-to-r from-green-50 to-green-100"
                                : isIncorrect
                                  ? "border-red-500 bg-gradient-to-r from-red-50 to-red-100"
                                  : "border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100"
                              : "border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100"
                            : "border-accent bg-gradient-to-r from-muted to-accent hover:border-ring"
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
                            className="text-ring font-semibold"
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
        </motion.div>
      </div>

      <ActionWrapper>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {!answered ? (
              <motion.button
                onClick={checkMatches}
                disabled={Object.keys(userAnswer).length !== config.pairs.length}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-gradient-to-r from-ring to-primary text-white rounded-lg shadow-sm disabled:opacity-70 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                Check Matches
              </motion.button>
            ) : (
              <>
                {!isAllCorrect() && (
                  <motion.button
                    onClick={handleReset}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg shadow-sm hover:from-gray-600 hover:to-gray-700 transition-colors flex items-center text-sm font-medium"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Try Again
                  </motion.button>
                )}
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isAllCorrect() ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {isAllCorrect() ? "✓ Correct" : "✗ Incorrect"}
                </div>
              </>
            )}
          </div>

          <NextButton
            isCompleted={isCompleted}
            disabled={!answered || isAudioPlaying}
            isLastActivity={isLastActivity}
            onClick={onNext}
          />
        </div>
      </ActionWrapper>
    </>
  );
}
