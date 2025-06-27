import {
  EmbedConfig,
  FillBlanksConfig,
  FlashcardConfig,
  LearningActivity,
  MatchingConfig,
  QuizConfig,
  SequenceConfig,
  SlideConfig,
} from "@/types/learning-path";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  GripVertical,
  Move,
  RotateCcw,
  Shuffle,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

// Droppable container for sequence building
function SequenceDropContainer({
  children,
  isEmpty,
}: {
  children: React.ReactNode;
  isEmpty: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: "sequence-container",
  });

  return (
    <div
      ref={setNodeRef}
      className={`bg-gradient-to-br from-white to-brand-50/30 p-6 rounded-2xl border-2 border-dashed min-h-[120px] transition-all duration-300 ${
        isOver ? "border-brand-500 bg-brand-100/50" : "border-brand-300"
      }`}
    >
      {isEmpty ? (
        <div className="text-center text-gray-500 py-8">
          <Move className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>Drag items here to build the sequence</p>
        </div>
      ) : (
        children
      )}
    </div>
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
    opacity: isDragging ? 0.5 : isUsed ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`px-4 py-2 bg-gradient-to-r from-brand-100 to-teal-100 text-brand-800 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-brand-200/50 select-none ${
        isUsed ? "cursor-not-allowed" : "cursor-move"
      }`}
    >
      <div className="flex items-center">
        <GripVertical className="w-4 h-4 mr-2 opacity-60" />
        {word}
      </div>
    </div>
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
    <span className="inline-block mx-1">
      <div
        ref={setNodeRef}
        className={`inline-flex items-center justify-center min-w-[100px] h-10 border-2 border-dashed rounded-lg transition-all duration-300 ${
          word
            ? showFeedback
              ? isCorrect
                ? "border-green-500 bg-green-50 text-green-800"
                : "border-red-500 bg-red-50 text-red-800"
              : "border-brand-500 bg-brand-50 text-brand-800"
            : isOver
              ? "border-brand-400 bg-brand-100"
              : "border-gray-300 bg-gray-50 hover:border-brand-400"
        }`}
      >
        {word ? (
          <div className="flex items-center">
            <span>{word}</span>
            {!showFeedback && (
              <button onClick={onRemove} className="ml-2 text-xs text-gray-500 hover:text-red-500">
                ✕
              </button>
            )}
          </div>
        ) : (
          "Drop here"
        )}
      </div>
    </span>
  );
}

// Sortable Sequence Item Component
function SortableSequenceItem({
  id,
  content,
  index,
  isCorrect,
  showFeedback,
  showNumbers,
  onRemove,
}: {
  id: string;
  content: string;
  index: number;
  isCorrect?: boolean;
  showFeedback: boolean;
  showNumbers?: boolean;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center p-4 rounded-xl border transition-all duration-300 cursor-move ${
        showFeedback
          ? isCorrect
            ? "border-green-500 bg-green-50 text-green-800"
            : "border-red-500 bg-red-50 text-red-800"
          : "border-brand-200 bg-white hover:border-brand-400"
      }`}
    >
      <div className="flex items-center flex-1">
        {showNumbers && (
          <div className="w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
            {index + 1}
          </div>
        )}
        <span className="font-medium">{content}</span>
      </div>
      <button
        onClick={onRemove}
        className="ml-4 text-gray-400 hover:text-red-500 transition-colors"
      >
        ✕
      </button>
      {showFeedback && (
        <span className={`ml-2 ${isCorrect ? "text-green-600" : "text-red-600"}`}>
          {isCorrect ? "✓" : "✗"}
        </span>
      )}
    </div>
  );
}

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
    case "sequence":
      return (
        <SequenceActivity
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
      <div className="relative z-10">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-brand-600 bg-clip-text text-transparent mb-10">
          {config.title || activity.title}
        </h2>

        {config.media_url && (
          <div className="mb-10 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02]">
            {config.media_type === "video" ? (
              <video src={config.media_url} controls className="w-full rounded-2xl" />
            ) : (
              <Image
                src={config.media_url}
                alt={config.title || activity.title}
                width={800}
                height={400}
                className="w-full rounded-2xl shadow-lg"
              />
            )}
          </div>
        )}

        <div
          className="prose prose-lg max-w-none text-gray-700 mb-12 leading-loose"
          dangerouslySetInnerHTML={{ __html: config.content }}
        />
      </div>

      <NavigationButtons
        onComplete={onComplete}
        onNext={onNext}
        onPrevious={onPrevious}
        showNavigation={showNavigation}
      />
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
    <div className="h-full">
      <div className="relative z-10">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-brand-600 bg-clip-text text-transparent mb-10">
          {activity.title}
        </h2>

        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-700 mb-10 leading-relaxed">
            {config.question}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-500 transform hover:scale-[1.02] ${
                  selectedAnswer === index
                    ? showResult
                      ? index === config.correct_answer
                        ? "border-green-500 bg-gradient-to-r from-green-50 to-emerald-100 shadow-xl"
                        : "border-red-500 bg-gradient-to-r from-red-50 to-red-100 shadow-xl"
                      : "border-brand-500 bg-gradient-to-r from-brand-50 to-brand-100 shadow-lg"
                    : showResult && index === config.correct_answer
                      ? "border-green-500 bg-gradient-to-r from-green-50 to-emerald-100 shadow-xl"
                      : "border-gray-200 hover:border-brand-300 hover:bg-gradient-to-r hover:from-brand-50 hover:to-brand-100 hover:shadow-lg"
                }`}
              >
                <input
                  type="radio"
                  name="quiz-option"
                  value={index}
                  checked={selectedAnswer === index}
                  onChange={() => !answered && setSelectedAnswer(index)}
                  disabled={answered}
                  className="w-5 h-5 text-brand-600 mr-4 rounded-full"
                />
                <span className="text-lg font-medium text-gray-800">{option}</span>
                {showResult && index === config.correct_answer && (
                  <span className="ml-auto text-green-600 font-bold">✓ Correct</span>
                )}
                {showResult && selectedAnswer === index && index !== config.correct_answer && (
                  <span className="ml-auto text-red-600 font-bold">✗ Incorrect</span>
                )}
              </label>
            ))}
          </div>
        </div>

        {showResult && config.explanation && (
          <div className="mb-10 p-6 bg-gradient-to-r from-brand-50 to-teal-100 rounded-2xl border border-brand-200/50 shadow-lg">
            <h4 className="font-bold text-gray-800 mb-3 text-lg">Explanation:</h4>
            <p className="text-gray-700 leading-relaxed">{config.explanation}</p>
          </div>
        )}

        <div className="flex justify-center space-x-4">
          {!answered ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="px-10 py-4 bg-gradient-to-r from-brand-500 to-teal-600 text-white rounded-full hover:from-brand-600 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 font-bold text-lg"
            >
              Submit Answer
            </button>
          ) : selectedAnswer === config.correct_answer ? (
            <div className="flex items-center px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-xl font-bold text-lg">
              <span className="mr-3">🎉</span>
              Correct! Well done!
            </div>
          ) : (
            <button
              onClick={handleReset}
              className="px-10 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 font-bold text-lg flex items-center"
            >
              <RotateCcw className="w-5 h-5 mr-3" />
              Try Again
            </button>
          )}
        </div>
      </div>

      <NavigationButtons
        onComplete={onComplete}
        onNext={onNext}
        onPrevious={onPrevious}
        showNavigation={showNavigation}
        disabled={!answered || selectedAnswer !== config.correct_answer}
      />
    </div>
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
  const [studiedCards, setStudiedCards] = useState<Set<string>>(new Set());

  const currentCard = config.cards[currentCardIndex];
  const totalCards = config.cards.length;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setStudiedCards((prev) => new Set(prev).add(currentCard.id));
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
    <div className="h-full">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-brand-600 bg-clip-text text-transparent">
            {activity.title}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-brand-100 to-teal-100 px-6 py-3 rounded-full shadow-lg border border-white/50">
              <span className="text-sm font-bold bg-gradient-to-r from-brand-600 to-teal-600 bg-clip-text text-transparent">
                {currentCardIndex + 1} of {totalCards}
              </span>
            </div>
            <button
              onClick={shuffleCards}
              className="p-3 bg-gradient-to-r from-brand-500 to-teal-600 text-white rounded-full hover:from-brand-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              title="Shuffle cards"
            >
              <Shuffle className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mb-8">
          <div className={`flip-card ${isFlipped ? "flipped" : ""}`}>
            <div
              className="flip-card-inner relative bg-gradient-to-br from-brand-50/80 via-teal-50/80 to-brand-100/80 rounded-xl min-h-[280px] max-h-[320px] cursor-pointer shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] mx-auto max-w-2xl"
              onClick={handleFlip}
            >
              <div className="flip-card-front absolute inset-0 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                <div className="bg-gradient-to-r from-brand-600 to-teal-600 text-white px-4 py-2 rounded-full text-xs font-bold mb-6 shadow-md">
                  Question
                </div>
                <p className="text-lg font-medium text-gray-800 leading-relaxed mb-6 max-w-sm">
                  {currentCard.front}
                </p>
                <div className="bg-gradient-to-r from-brand-100 to-teal-100 px-4 py-2 rounded-full">
                  <p className="text-xs text-gray-600 font-medium flex items-center">
                    <span className="inline-block w-1.5 h-1.5 bg-brand-500 rounded-full mr-2"></span>
                    Click to reveal answer
                  </p>
                </div>
              </div>

              {/* Back of card */}
              <div className="flip-card-back absolute inset-0 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-full text-xs font-bold mb-6 shadow-md">
                  Answer
                </div>
                <p className="text-lg font-medium text-gray-800 leading-relaxed mb-6 max-w-sm">
                  {currentCard.back}
                </p>
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-full">
                  <p className="text-xs text-gray-600 font-medium flex items-center">
                    <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                    Click to flip back
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={handlePrevCard}
              disabled={currentCardIndex === 0}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 disabled:from-gray-50 disabled:to-gray-100 disabled:text-gray-400 rounded-full transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg font-medium text-gray-700 text-sm"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </button>

            <div className="text-center">
              <div className="flex space-x-2 mb-2">
                {config.cards.map((card, index) => (
                  <button
                    key={card.id}
                    onClick={() => {
                      setCurrentCardIndex(index);
                      setIsFlipped(false);
                    }}
                    className={`w-3 h-3 rounded-full transition-all duration-300 transform hover:scale-125 ${
                      index === currentCardIndex
                        ? "bg-gradient-to-r from-brand-500 to-teal-500 scale-125 shadow-md"
                        : studiedCards.has(card.id)
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 shadow-sm"
                          : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs font-medium bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
                {studiedCards.size} of {totalCards} studied
              </p>
            </div>

            <button
              onClick={handleNextCard}
              disabled={currentCardIndex === totalCards - 1}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-brand-500 to-teal-600 hover:from-brand-600 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-full transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg font-medium text-sm"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>

          {currentCard.tags && currentCard.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {currentCard.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-brand-100 to-teal-100 text-brand-700 rounded-full text-xs font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 border border-brand-200/50"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <NavigationButtons
        onComplete={onComplete}
        onNext={onNext}
        onPrevious={onPrevious}
        showNavigation={showNavigation}
      />
    </div>
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
    <div className="">
      <div className="relative z-10">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-brand-600 bg-clip-text text-transparent mb-8">
          {activity.title}
        </h2>

        {config.description && (
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">{config.description}</p>
        )}

        <div className="mb-10">
          {config.embed_type === "video" ? (
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                src={config.url}
                className="w-full h-full rounded-2xl"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-300">
              <ExternalLink className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-700 mb-4">{config.title}</h3>
              {config.description && (
                <p className="text-gray-600 mb-8 leading-relaxed">{config.description}</p>
              )}
              <a
                href={config.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-brand-500 to-teal-600 text-white rounded-full hover:from-brand-600 hover:to-teal-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 font-bold text-lg"
              >
                <ExternalLink className="w-5 h-5 mr-3" />
                Open Resource
              </a>
            </div>
          )}
        </div>
      </div>

      <NavigationButtons
        onComplete={onComplete}
        onNext={onNext}
        onPrevious={onPrevious}
        showNavigation={showNavigation}
      />
    </div>
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
    <div className="flex justify-between items-center mt-8">
      {onPrevious ? (
        <button
          onClick={onPrevious}
          className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors rounded-full bg-gray-100 hover:bg-gray-200 shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </button>
      ) : (
        <div />
      )}

      {onNext && (
        <button
          onClick={onNext}
          disabled={disabled}
          className="flex items-center px-8 py-3 bg-gradient-to-r from-brand-500 to-teal-600 text-white rounded-full hover:from-brand-600 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      )}
    </div>
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
    new Set(config.blanks.flatMap((blank) => blank.correct_answers))
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

    // Get the actual word from the wordItems
    const wordItem = wordItems.find((item) => item.id === activeWordId);
    if (!wordItem) {
      setActiveId(null);
      return;
    }

    // Check if dropping on a blank
    if (overTarget.startsWith("blank-")) {
      const blankId = overTarget.replace("blank-", "");

      // Remove this word from any existing blank first
      const updatedAnswers = { ...userAnswers };
      Object.keys(updatedAnswers).forEach((key) => {
        if (updatedAnswers[key] === wordItem.word) {
          delete updatedAnswers[key];
        }
      });

      // Add word to new blank
      updatedAnswers[blankId] = wordItem.word;
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
    const isAllCorrect = config.blanks.every((blank) => {
      const userAnswer = userAnswers[blank.id];
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

  // Create word items with proper IDs
  const wordItems = allWords.map((word, index) => ({
    id: `word-${index}`,
    word,
    isUsed: usedWords.includes(word),
  }));

  // Create blank items with proper IDs
  const blankItems = config.blanks.map((blank) => `blank-${blank.id}`);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-brand-600 bg-clip-text text-transparent mb-8">
            {activity.title}
          </h2>

          <div className="mb-8">
            <p className="text-lg text-gray-600 mb-8">{config.instruction}</p>

            {/* Text with blanks */}
            <div className="bg-gradient-to-br from-white to-brand-50/30 p-8 rounded-2xl shadow-lg border border-brand-200/30 mb-8">
              <SortableContext items={blankItems}>
                <div className="text-lg leading-relaxed">
                  {config.text_with_blanks.split("_____").map((textPart, index) => (
                    <span key={index}>
                      {textPart}
                      {index < config.blanks.length && (
                        <DroppableBlank
                          id={config.blanks[index].id}
                          word={userAnswers[config.blanks[index].id]}
                          isCorrect={
                            userAnswers[config.blanks[index].id]
                              ? config.blanks[index].correct_answers.some(
                                  (correct) =>
                                    correct.toLowerCase() ===
                                    userAnswers[config.blanks[index].id]?.toLowerCase()
                                )
                              : undefined
                          }
                          showFeedback={showFeedback}
                          onRemove={() => removeWordFromBlank(config.blanks[index].id)}
                        />
                      )}
                    </span>
                  ))}
                </div>
              </SortableContext>
            </div>

            {/* Available words */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Available Words:</h3>
              <SortableContext
                items={wordItems.filter((item) => !item.isUsed).map((item) => item.id)}
              >
                <div className="flex flex-wrap gap-3">
                  {wordItems
                    .filter((item) => !item.isUsed)
                    .map((item) => (
                      <DraggableWord
                        key={item.id}
                        id={item.id}
                        word={item.word}
                        isUsed={item.isUsed}
                      />
                    ))}
                </div>
              </SortableContext>
            </div>

            {/* Check answers button */}
            {!isCompleted && (
              <div className="text-center mb-8">
                <button
                  onClick={checkAnswers}
                  disabled={Object.keys(userAnswers).length !== config.blanks.length}
                  className="px-8 py-4 bg-gradient-to-r from-brand-500 to-teal-600 text-white rounded-full hover:from-brand-600 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 font-bold text-lg"
                >
                  Check Answers
                </button>
              </div>
            )}

            {/* Feedback */}
            {showFeedback && (
              <div
                className={`p-6 rounded-2xl border shadow-lg mb-8 ${
                  isCompleted
                    ? "bg-gradient-to-r from-green-50 to-emerald-100 border-green-200 text-green-800"
                    : "bg-gradient-to-r from-yellow-50 to-orange-100 border-yellow-200 text-yellow-800"
                }`}
              >
                <h4 className="font-bold mb-2 text-lg">
                  {isCompleted ? "🎉 Excellent!" : "📝 Keep trying!"}
                </h4>
                <p className="mb-4">
                  {isCompleted
                    ? config.success_message || "You got all the answers correct!"
                    : "Some answers need adjustment. Check the highlighted blanks."}
                </p>
                {!isCompleted && (
                  <div className="flex justify-center">
                    <button
                      onClick={handleReset}
                      className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 font-bold text-base flex items-center"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <NavigationButtons
          onNext={onNext}
          onPrevious={onPrevious}
          showNavigation={showNavigation}
          disabled={!isCompleted}
        />
      </div>

      <DragOverlay dropAnimation={null}>
        {activeId && wordItems.find((item) => item.id === activeId) ? (
          <div className="px-4 py-2 bg-gradient-to-r from-brand-200 to-teal-200 text-brand-900 rounded-full shadow-2xl border-2 border-brand-300 scale-110 font-semibold pointer-events-none">
            <div className="flex items-center">
              <GripVertical className="w-4 h-4 mr-2 opacity-60" />
              {wordItems.find((item) => item.id === activeId)?.word}
            </div>
          </div>
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

  // Shuffle right side items
  const [shuffledRightItems] = useState(() =>
    [...config.pairs.map((pair) => pair.right)].sort(() => Math.random() - 0.5)
  );

  const handleLeftClick = (leftId: string) => {
    if (showFeedback) return;

    setSelectedLeft(leftId);
    setSelectedRight(null);

    // If there's already a match for this left item, auto-select the corresponding right item
    if (matches[leftId]) {
      setSelectedRight(matches[leftId]);
    }
  };

  const handleRightClick = (rightId: string) => {
    if (showFeedback) return;

    if (selectedLeft) {
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
      setSelectedLeft(null);

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
    const isAllCorrect = config.pairs.every((pair) => {
      return matches[pair.left.id] === pair.right.id;
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

  return (
    <div className="h-full">
      <div className="relative z-10">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-brand-600 bg-clip-text text-transparent mb-8">
          {activity.title}
        </h2>

        <div className="mb-8">
          <p className="text-lg text-gray-600 mb-8">{config.instruction}</p>

          {/* Selection instructions */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-800 font-medium">
              💡 Click on a term and then click on its matching definition to connect them. Click on
              connected pairs to break the connection.
            </p>
          </div>

          {/* Matching interface */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Left column - Terms */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Terms</h3>
              {config.pairs.map((pair) => {
                const matchedRightId = matches[pair.left.id];
                const isSelected = selectedLeft === pair.left.id;
                const isCorrect = showFeedback && matchedRightId === pair.right.id;
                const isIncorrect =
                  showFeedback && matchedRightId && matchedRightId !== pair.right.id;

                return (
                  <div
                    key={pair.left.id}
                    onClick={() => handleLeftClick(pair.left.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                      isSelected
                        ? "border-blue-500 bg-blue-100 shadow-lg scale-[1.02]"
                        : matchedRightId
                          ? isCorrect
                            ? "border-green-500 bg-green-50 shadow-md"
                            : isIncorrect
                              ? "border-red-500 bg-red-50 shadow-md"
                              : "border-brand-500 bg-brand-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">{pair.left.content}</span>
                      <div className="flex items-center">
                        {matchedRightId && (
                          <>
                            <span className="ml-2 px-3 py-1 bg-white/70 rounded-full text-sm border">
                              {
                                shuffledRightItems.find((item) => item.id === matchedRightId)
                                  ?.content
                              }
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeMatch(pair.left.id);
                              }}
                              className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              ✕
                            </button>
                          </>
                        )}
                        {isSelected && (
                          <span className="ml-2 text-blue-600 font-bold animate-pulse">→</span>
                        )}
                        {showFeedback && matchedRightId && (
                          <span className={`ml-2 ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                            {isCorrect ? "✓" : "✗"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right column - Definitions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Definitions</h3>
              {shuffledRightItems.map((item) => {
                const isMatched = Object.values(matches).includes(item.id);
                const isSelected = selectedRight === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleRightClick(item.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                      isSelected
                        ? "border-blue-500 bg-blue-100 shadow-lg scale-[1.02]"
                        : isMatched
                          ? "border-gray-300 bg-gray-100 opacity-60 cursor-not-allowed"
                          : "border-teal-200 bg-teal-50 hover:border-teal-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">{item.content}</span>
                      {isSelected && (
                        <span className="text-blue-600 font-bold animate-pulse">←</span>
                      )}
                      {isMatched && <span className="text-gray-500 text-sm">Matched</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Check matches button */}
          {!isCompleted && (
            <div className="text-center mb-8">
              <button
                onClick={checkMatches}
                disabled={Object.keys(matches).length !== config.pairs.length}
                className="px-8 py-4 bg-gradient-to-r from-brand-500 to-teal-600 text-white rounded-full hover:from-brand-600 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 font-bold text-lg"
              >
                Check Matches
              </button>
            </div>
          )}

          {/* Feedback */}
          {showFeedback && (
            <div
              className={`p-6 rounded-2xl border shadow-lg mb-8 ${
                isCompleted
                  ? "bg-gradient-to-r from-green-50 to-emerald-100 border-green-200 text-green-800"
                  : "bg-gradient-to-r from-yellow-50 to-orange-100 border-yellow-200 text-yellow-800"
              }`}
            >
              <h4 className="font-bold mb-2 text-lg">
                {isCompleted ? "🎯 Perfect Match!" : "🔄 Try Again!"}
              </h4>
              <p className="mb-4">
                {isCompleted
                  ? config.success_message || "You matched all pairs correctly!"
                  : "Some matches need adjustment. Check the highlighted pairs."}
              </p>
              {!isCompleted && (
                <div className="flex justify-center">
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 font-bold text-base flex items-center"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <NavigationButtons
        onNext={onNext}
        onPrevious={onPrevious}
        showNavigation={showNavigation}
        disabled={!isCompleted}
      />
    </div>
  );
}

// Helper component for draggable sequence items (available items)
function DraggableSequenceItem({
  id,
  content,
  onClick,
}: {
  id: string;
  content: string;
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="p-4 bg-gradient-to-r from-teal-100 to-brand-100 text-teal-800 rounded-xl cursor-move shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-teal-200/50 select-none"
    >
      <div className="flex items-center">
        <GripVertical className="w-4 h-4 mr-2 opacity-60" />
        {content}
      </div>
    </div>
  );
}

function SequenceActivity({
  activity,
  onComplete,
  onNext,
  onPrevious,
  showNavigation,
}: ActivityRendererProps) {
  const config = activity.config as SequenceConfig;
  const [orderedItems, setOrderedItems] = useState<string[]>([]);
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

  // Shuffle items initially
  const [shuffledItems] = useState(() => [...config.items].sort(() => Math.random() - 0.5));

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Handle dropping from available items to sequence
    if (!orderedItems.includes(activeId) && overId === "sequence-container") {
      setOrderedItems((prev) => [...prev, activeId]);
    }
    // Handle reordering within sequence
    else if (orderedItems.includes(activeId) && orderedItems.includes(overId)) {
      const oldIndex = orderedItems.indexOf(activeId);
      const newIndex = orderedItems.indexOf(overId);
      setOrderedItems(arrayMove(orderedItems, oldIndex, newIndex));
    }
    // Handle dropping on another sortable item in sequence
    else if (!orderedItems.includes(activeId) && orderedItems.includes(overId)) {
      const targetIndex = orderedItems.indexOf(overId);
      setOrderedItems((prev) => {
        const newItems = [...prev];
        newItems.splice(targetIndex, 0, activeId);
        return newItems;
      });
    }

    setActiveId(null);
  };

  const addToSequence = (itemId: string) => {
    if (!orderedItems.includes(itemId)) {
      setOrderedItems((prev) => [...prev, itemId]);
    }
  };

  const removeFromSequence = (itemId: string) => {
    setOrderedItems((prev) => prev.filter((id) => id !== itemId));
  };

  const checkSequence = () => {
    const isCorrect =
      orderedItems.length === config.items.length &&
      orderedItems.every((itemId, index) => {
        const item = config.items.find((i) => i.id === itemId);
        return item && item.correct_position === index + 1;
      });

    setShowFeedback(true);
    if (isCorrect) {
      setIsCompleted(true);
      onComplete?.();
    }
  };

  const handleReset = () => {
    setOrderedItems([]);
    setShowFeedback(false);
    setIsCompleted(false);
    setActiveId(null);
  };

  const availableItems = shuffledItems.filter((item) => !orderedItems.includes(item.id));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-brand-600 bg-clip-text text-transparent mb-8">
            {activity.title}
          </h2>

          <div className="mb-8">
            <p className="text-lg text-gray-600 mb-8">{config.instruction}</p>

            {/* Sequence building area */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Build the Sequence:</h3>
              <SequenceDropContainer isEmpty={orderedItems.length === 0}>
                {orderedItems.length > 0 && (
                  <SortableContext items={orderedItems} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                      {orderedItems.map((itemId, index) => {
                        const item = config.items.find((i) => i.id === itemId);
                        if (!item) return null;

                        const isCorrectPosition =
                          showFeedback && item.correct_position === index + 1;

                        return (
                          <SortableSequenceItem
                            key={itemId}
                            id={itemId}
                            content={item.content}
                            index={index}
                            isCorrect={isCorrectPosition}
                            showFeedback={showFeedback}
                            showNumbers={config.show_numbers}
                            onRemove={() => removeFromSequence(itemId)}
                          />
                        );
                      })}
                    </div>
                  </SortableContext>
                )}
              </SequenceDropContainer>
            </div>

            {/* Available items */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Available Items:</h3>
              <SortableContext items={availableItems.map((item) => item.id)}>
                <div className="flex flex-wrap gap-3">
                  {availableItems.map((item) => (
                    <DraggableSequenceItem
                      key={item.id}
                      id={item.id}
                      content={item.content}
                      onClick={() => addToSequence(item.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </div>

            {/* Check sequence button */}
            {!isCompleted && (
              <div className="text-center mb-8">
                <button
                  onClick={checkSequence}
                  disabled={orderedItems.length !== config.items.length}
                  className="px-8 py-4 bg-gradient-to-r from-brand-500 to-teal-600 text-white rounded-full hover:from-brand-600 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 font-bold text-lg"
                >
                  Check Sequence
                </button>
              </div>
            )}

            {/* Feedback */}
            {showFeedback && (
              <div
                className={`p-6 rounded-2xl border shadow-lg mb-8 ${
                  isCompleted
                    ? "bg-gradient-to-r from-green-50 to-emerald-100 border-green-200 text-green-800"
                    : "bg-gradient-to-r from-yellow-50 to-orange-100 border-yellow-200 text-yellow-800"
                }`}
              >
                <h4 className="font-bold mb-2 text-lg">
                  {isCompleted ? "🎯 Perfect Sequence!" : "🔄 Try Again!"}
                </h4>
                <p className="mb-4">
                  {isCompleted
                    ? config.success_message || "You got the sequence exactly right!"
                    : "The sequence needs adjustment. Check the highlighted positions."}
                </p>
                {!isCompleted && (
                  <div className="flex justify-center">
                    <button
                      onClick={handleReset}
                      className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 font-bold text-base flex items-center"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <NavigationButtons
          onNext={onNext}
          onPrevious={onPrevious}
          showNavigation={showNavigation}
          disabled={!isCompleted}
        />
      </div>

      <DragOverlay dropAnimation={null}>
        {activeId ? (
          <div className="p-4 bg-gradient-to-r from-teal-200 to-brand-200 text-teal-900 rounded-xl shadow-2xl border-2 border-teal-300 scale-110 font-semibold transform rotate-3">
            <div className="flex items-center">
              <GripVertical className="w-4 h-4 mr-2 opacity-60" />
              {config.items.find((item) => item.id === activeId)?.content}
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default ActivityRenderer;
