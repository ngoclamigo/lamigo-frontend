import { ConversationScript, ConversationTranscript } from '../types/evaluation';

export class TranscriptionConverter {
  /**
   * Convert conversation script format to evaluation transcript format
   */
  static convertScriptToTranscript(
    conversationScript: ConversationScript[]
  ): ConversationTranscript[] {
    if (!conversationScript || conversationScript.length === 0) {
      return [];
    }

    // Filter out incomplete/non-final messages and merge fragmented ones
    const processedMessages = this.mergeFragmentedMessages(conversationScript);

    return processedMessages.map((script) => ({
      timestamp: new Date(script.receivedAt).toISOString(),
      speaker: script.role === 'user' ? 'agent' : 'user', // user = salesperson, assistant = customer
      text: script.text.trim(),
      sentiment: this.inferSentiment(script.text),
      confidence: script.final ? 1.0 : 0.8
    }));
  }

  /**
   * Merge fragmented messages from the same speaker that are close in time
   */
  private static mergeFragmentedMessages(
    scripts: ConversationScript[]
  ): ConversationScript[] {
    const merged: ConversationScript[] = [];
    const MERGE_THRESHOLD_MS = 5000; // 5 seconds - increased for your format

    for (const script of scripts) {
      if (!script.final || !script.text.trim()) {
        continue; // Skip incomplete or empty messages
      }

      const lastMerged = merged[merged.length - 1];

      // Check if we should merge with the previous message
      if (
        lastMerged &&
        lastMerged.role === script.role &&
        (script.receivedAt - lastMerged.receivedAt) < MERGE_THRESHOLD_MS &&
        this.shouldMergeTexts(lastMerged.text, script.text)
      ) {
        // Merge the texts
        lastMerged.text = this.mergeTexts(lastMerged.text, script.text);
        lastMerged.lastReceivedTime = script.lastReceivedTime;
        lastMerged.receivedAt = Math.min(lastMerged.receivedAt, script.receivedAt); // Use earliest receivedAt
      } else {
        // Add as new message
        merged.push({ ...script });
      }
    }

    return merged;
  }

  /**
   * Determine if two text fragments should be merged
   */
  private static shouldMergeTexts(previousText: string, currentText: string): boolean {
    // Merge if the current text is very short (likely a fragment)
    if (currentText.length <= 3) {
      return true;
    }

    // Merge if the previous text doesn't end with punctuation
    const lastChar = previousText.trim().slice(-1);
    if (!'.!?'.includes(lastChar)) {
      return true;
    }

    return false;
  }

  /**
   * Merge two text fragments intelligently
   */
  private static mergeTexts(previousText: string, currentText: string): string {
    const prev = previousText.trim();
    const curr = currentText.trim();

    // If current text is very short, append it
    if (curr.length <= 3) {
      return `${prev} ${curr}`;
    }

    // If previous doesn't end with punctuation, append current
    const lastChar = prev.slice(-1);
    if (!'.!?'.includes(lastChar)) {
      return `${prev} ${curr}`;
    }

    // Otherwise, treat as separate sentences
    return `${prev} ${curr}`;
  }

  /**
   * Infer sentiment from text content
   */
  private static inferSentiment(text: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = [
      'great', 'excellent', 'good', 'interested', 'helpful', 'perfect',
      'amazing', 'fantastic', 'love', 'like', 'yes', 'absolutely'
    ];

    const negativeWords = [
      'concern', 'worried', 'problem', 'issue', 'difficult', 'struggle',
      'disappointed', 'frustrated', 'no', 'cannot', 'unable', 'doubt'
    ];

    const lowerText = text.toLowerCase();

    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;

    if (positiveCount > negativeCount) {
      return 'positive';
    } else if (negativeCount > positiveCount) {
      return 'negative';
    }

    return 'neutral';
  }

  /**
   * Calculate conversation duration from script
   */
  static calculateDuration(conversationScript: ConversationScript[]): string {
    if (!conversationScript || conversationScript.length === 0) {
      return '0:00';
    }

    const times = conversationScript
      .filter(script => script.final)
      .map(script => script.receivedAt)
      .sort((a, b) => a - b);

    if (times.length < 2) {
      return '0:30'; // Default minimum duration
    }

    const durationMs = times[times.length - 1] - times[0];
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Extract speaker roles and counts from script
   */
  static getConversationStats(conversationScript: ConversationScript[]): {
    userMessages: number;
    assistantMessages: number;
    totalMessages: number;
    averageMessageLength: number;
  } {
    const finalMessages = conversationScript.filter(script => script.final && script.text.trim());

    const userMessages = finalMessages.filter(script => script.role === 'user').length;
    const assistantMessages = finalMessages.filter(script => script.role === 'assistant').length;

    const totalLength = finalMessages.reduce((sum, script) => sum + script.text.length, 0);
    const averageMessageLength = finalMessages.length > 0 ? Math.round(totalLength / finalMessages.length) : 0;

    return {
      userMessages,
      assistantMessages,
      totalMessages: finalMessages.length,
      averageMessageLength
    };
  }

  /**
   * Validate conversation script format
   */
  static validateScript(conversationScript: unknown[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!Array.isArray(conversationScript)) {
      errors.push('Conversation script must be an array');
      return { isValid: false, errors };
    }

    conversationScript.forEach((script: unknown, index: number) => {
      if (typeof script !== 'object' || script === null) {
        errors.push(`Message ${index}: Must be an object`);
        return;
      }

      const scriptObj = script as Record<string, unknown>;

      if (!scriptObj.id) {
        errors.push(`Message ${index}: Missing required 'id' field`);
      }
      if (!scriptObj.text && scriptObj.final) {
        errors.push(`Message ${index}: Final message missing 'text' field`);
      }
      if (!['user', 'assistant'].includes(scriptObj.role as string)) {
        errors.push(`Message ${index}: Invalid role '${scriptObj.role}', must be 'user' or 'assistant'`);
      }
      if (typeof scriptObj.receivedAt !== 'number') {
        errors.push(`Message ${index}: 'receivedAt' must be a number (timestamp)`);
      }
    });

    return { isValid: errors.length === 0, errors };
  }
}
