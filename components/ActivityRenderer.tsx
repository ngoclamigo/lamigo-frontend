import { LearningActivity, SlideConfig, QuizConfig, FlashcardConfig, EmbedConfig } from '@/types/learning-path';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, ExternalLink, Shuffle } from 'lucide-react';
import Image from 'next/image';

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
  showNavigation = false
}: ActivityRendererProps) {
  switch (activity.type) {
    case 'slide':
      return (
        <SlideActivity
          activity={activity}
          onComplete={onComplete}
          onNext={onNext}
          onPrevious={onPrevious}
          showNavigation={showNavigation}
        />
      );
    case 'quiz':
      return (
        <QuizActivity
          activity={activity}
          onComplete={onComplete}
          onNext={onNext}
          onPrevious={onPrevious}
          showNavigation={showNavigation}
        />
      );
    case 'flashcard':
      return (
        <FlashcardActivity
          activity={activity}
          onComplete={onComplete}
          onNext={onNext}
          onPrevious={onPrevious}
          showNavigation={showNavigation}
        />
      );
    case 'embed':
      return (
        <EmbedActivity
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

function SlideActivity({ activity, onComplete, onNext, onPrevious, showNavigation }: ActivityRendererProps) {
  const config = activity.config as SlideConfig;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-10 border border-white/50 transform transition-all duration-500 hover:shadow-2xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50/30 via-teal-50/30 to-brand-50/30 opacity-50"></div>

      <div className="relative z-10">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-brand-600 bg-clip-text text-transparent mb-10">
          {config.title || activity.title}
        </h2>

        {config.media_url && (
          <div className="mb-10 rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02]">
            {config.media_type === 'video' ? (
              <video
                src={config.media_url}
                controls
                className="w-full rounded-3xl"
              />
            ) : (
              <Image
                src={config.media_url}
                alt={config.title || activity.title}
                width={800}
                height={400}
                className="w-full rounded-3xl shadow-lg"
              />
            )}
          </div>
        )}

        <div
          className="prose prose-lg max-w-none text-gray-700 mb-12 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: config.content }}
        />

        <div className="flex justify-center mb-8">
          <button
            onClick={() => {
              onComplete?.();
            }}
            className="px-10 py-4 bg-gradient-to-r from-brand-500 to-teal-600 text-white rounded-full hover:from-brand-600 hover:to-teal-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 font-bold text-lg"
          >
            ✓ Complete Activity
          </button>
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

function QuizActivity({ activity, onComplete, onNext, onPrevious, showNavigation }: ActivityRendererProps) {
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
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-10 border border-white/50 transform transition-all duration-500 hover:shadow-2xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50/30 via-teal-50/30 to-brand-50/30 opacity-50"></div>

      <div className="relative z-10">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-brand-600 bg-clip-text text-transparent mb-10">
          {activity.title}
        </h2>

        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-700 mb-10 leading-relaxed">{config.question}</h3>

          <div className="space-y-4">
            {config.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-500 transform hover:scale-[1.02] ${
                  selectedAnswer === index
                    ? showResult
                      ? index === config.correct_answer
                        ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-100 shadow-xl'
                        : 'border-red-500 bg-gradient-to-r from-red-50 to-red-100 shadow-xl'
                      : 'border-brand-500 bg-gradient-to-r from-brand-50 to-brand-100 shadow-lg'
                    : showResult && index === config.correct_answer
                    ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-100 shadow-xl'
                    : 'border-gray-200 hover:border-brand-300 hover:bg-gradient-to-r hover:from-brand-50 hover:to-brand-100 hover:shadow-lg'
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

function FlashcardActivity({ activity, onComplete, onNext, onPrevious, showNavigation }: ActivityRendererProps) {
  const config = activity.config as FlashcardConfig;
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studiedCards, setStudiedCards] = useState<Set<string>>(new Set());

  const currentCard = config.cards[currentCardIndex];
  const totalCards = config.cards.length;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setStudiedCards(prev => new Set(prev).add(currentCard.id));
      // Complete the activity if all cards have been studied
      if (studiedCards.size + 1 === totalCards) {
        onComplete?.();
      }
    }
  };

  const handleNextCard = () => {
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const shuffleCards = () => {
    const randomIndex = Math.floor(Math.random() * totalCards);
    setCurrentCardIndex(randomIndex);
    setIsFlipped(false);
  };

  return (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-10 border border-white/50 transform transition-all duration-500 hover:shadow-2xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50/30 via-teal-50/30 to-brand-50/30 opacity-50"></div>

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

        <div className="mb-10">
          <div className={`flip-card ${isFlipped ? 'flipped' : ''}`}>
            <div
              className="flip-card-inner relative bg-gradient-to-br from-blue-50/80 via-purple-50/80 to-pink-50/80 rounded-3xl min-h-[400px] cursor-pointer shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]"
              onClick={handleFlip}
            >
              <div className="flip-card-front absolute inset-0 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
                <div className="bg-gradient-to-r from-brand-600 to-teal-600 text-white px-6 py-3 rounded-full text-sm font-bold mb-8 shadow-lg">
                  Question
                </div>
                <p className="text-xl font-medium text-gray-800 leading-relaxed mb-8 max-w-md">{currentCard.front}</p>
                <div className="bg-gradient-to-r from-brand-100 to-teal-100 px-6 py-3 rounded-full">
                  <p className="text-sm text-gray-600 font-medium flex items-center">
                    <span className="inline-block w-2 h-2 bg-brand-500 rounded-full mr-2"></span>
                    Click to reveal answer
                  </p>
                </div>
              </div>

              {/* Back of card */}
              <div className="flip-card-back absolute inset-0 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full text-sm font-bold mb-8 shadow-lg">
                  Answer
                </div>
                <p className="text-xl font-medium text-gray-800 leading-relaxed mb-8 max-w-md">{currentCard.back}</p>
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-3 rounded-full">
                  <p className="text-sm text-gray-600 font-medium flex items-center">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Click to flip back
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={handlePrevCard}
              disabled={currentCardIndex === 0}
              className="flex items-center px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 disabled:from-gray-50 disabled:to-gray-100 disabled:text-gray-400 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-gray-700"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous Card
            </button>

            <div className="text-center">
              <div className="flex space-x-3 mb-3">
                {config.cards.map((card, index) => (
                  <button
                    key={card.id}
                    onClick={() => {
                      setCurrentCardIndex(index);
                      setIsFlipped(false);
                    }}
                    className={`w-4 h-4 rounded-full transition-all duration-500 transform hover:scale-125 ${
                      index === currentCardIndex
                        ? 'bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 scale-125 shadow-lg'
                        : studiedCards.has(card.id)
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-md'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm font-medium bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
                {studiedCards.size} of {totalCards} studied
              </p>
            </div>

            <button
              onClick={handleNextCard}
              disabled={currentCardIndex === totalCards - 1}
              className="flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
            >
              Next Card
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>

          {currentCard.tags && currentCard.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              {currentCard.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-5 py-2 bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 text-purple-700 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-purple-200/50"
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

function EmbedActivity({ activity, onComplete, onNext, onPrevious, showNavigation }: ActivityRendererProps) {
  const config = activity.config as EmbedConfig;
  const [completed, setCompleted] = useState(false);

  const handleMarkComplete = () => {
    setCompleted(true);
    onComplete?.();
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-10 border border-white/50 transform transition-all duration-500 hover:shadow-2xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50/30 via-teal-50/30 to-brand-50/30 opacity-50"></div>

      <div className="relative z-10">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-brand-600 bg-clip-text text-transparent mb-8">
          {activity.title}
        </h2>

        {config.description && (
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">{config.description}</p>
        )}

        <div className="mb-10">
          {config.embed_type === 'video' ? (
            <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl">
              <iframe
                src={config.url}
                className="w-full h-full rounded-3xl"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-300">
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

        <div className="flex justify-center">
          <button
            onClick={handleMarkComplete}
            disabled={completed}
            className={`px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-bold text-lg ${
              completed
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                : 'bg-gradient-to-r from-brand-500 to-teal-600 text-white hover:from-brand-600 hover:to-teal-700'
            }`}
          >
            {completed ? '✓ Completed' : 'Mark as Complete'}
          </button>
        </div>
      </div>

      <NavigationButtons
        onComplete={onComplete}
        onNext={onNext}
        onPrevious={onPrevious}
        showNavigation={showNavigation}
        disabled={!completed}
      />
    </div>
  );
}

function NavigationButtons({
  onNext,
  onPrevious,
  showNavigation,
  disabled = false
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

export default ActivityRenderer;
