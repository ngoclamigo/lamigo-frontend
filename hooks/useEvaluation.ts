import { useState } from 'react';
import { ConversationScript, SalesScenario, CustomerPersona, EvaluationResult } from '@/types/evaluation';

interface ConversationEvaluationResponse extends EvaluationResult {
  conversationMetadata?: {
    duration: string;
    messageCount: number;
    userMessages: number;
    assistantMessages: number;
    averageMessageLength: number;
    originalScriptLength: number;
    processedTranscriptLength: number;
  };
}

interface UseConversationEvaluationResult {
  evaluation: ConversationEvaluationResponse | null;
  loading: boolean;
  error: string | null;
  evaluate: (
    scenario: SalesScenario,
    persona: CustomerPersona,
    conversationScript: ConversationScript[],
    salespersonName?: string
  ) => Promise<void>;
  loadSample: () => Promise<void>;
  clearError: () => void;
}

export function useEvaluation(): UseConversationEvaluationResult {
  const [evaluation, setEvaluation] = useState<ConversationEvaluationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const evaluate = async (
    scenario: SalesScenario,
    persona: CustomerPersona,
    conversationScript: ConversationScript[],
    salespersonName = 'Nam'
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenario,
          persona,
          conversationScript,
          salespersonName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setEvaluation(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to evaluate conversation';
      setError(errorMessage);
      console.error('Error evaluating conversation:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSample = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/evaluate', {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setEvaluation(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load sample evaluation';
      setError(errorMessage);
      console.error('Error loading sample:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    evaluation,
    loading,
    error,
    evaluate,
    loadSample,
    clearError,
  };
}
