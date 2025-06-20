import OpenAI from 'openai';
import {
  SalesScenario,
  CustomerPersona,
  ConversationTranscript,
  EvaluationResult,
  PerformanceMetric,
  TalkingPoint
} from '../types/evaluation';

export class EvaluationService {
  private static openaiClient: OpenAI | null = null;

  /**
   * Get or create OpenAI client instance
   */
  private static getOpenAIClient(): OpenAI {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY in your environment variables.');
    }

    if (!this.openaiClient) {
      this.openaiClient = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    return this.openaiClient;
  }
  /**
   * Generate evaluation using OpenAI function calling
   */
  static async generateEvaluation(
    scenario: SalesScenario,
    persona: CustomerPersona,
    transcripts: ConversationTranscript[],
    salespersonName: string = 'Nam'
  ): Promise<EvaluationResult> {
    try {
      const openai = this.getOpenAIClient();

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert sales coach and evaluator. Your job is to analyze sales conversations and provide detailed, actionable feedback.

You will receive:
1. A sales scenario with objectives and context
2. A detailed customer persona with pain points, objections, and communication style
3. Conversation transcripts between the salesperson and customer
4. The salesperson's name

Your evaluation should be:
- Specific and actionable
- Based on the actual conversation content
- Tailored to the customer persona
- Professional but encouraging
- Include concrete examples from the conversation when possible

Focus on these key areas:
1. Product Knowledge & Application (60-95%)
2. Communication & Confidence (60-95%)
3. Discovery & Active Listening (60-95%)
4. Objection Handling & Follow-up (60-95%)

Generate realistic scores based on conversation analysis, not just random numbers.`
          },
          {
            role: "user",
            content: `Please evaluate this sales conversation:

SALES SCENARIO:
Name: ${scenario.name}
Description: ${scenario.description}
Customer Mood: ${scenario.customer_mood}
Objectives: ${scenario.objectives.join(', ')}
Context: ${scenario.context}
Urgency: ${scenario.urgency}

CUSTOMER PERSONA:
Name: ${persona.name}
Role: ${persona.role}
Company: ${persona.company_size}
Industry: ${persona.industry}
Pain Points: ${persona.pain_points.join(', ')}
Budget Range: ${persona.budget_range}
Decision Style: ${persona.decision_style}
Objections: ${persona.objections.join(', ')}
Personality: ${persona.personality_traits.join(', ')}
Background: ${persona.background}
Current Challenge: ${persona.current_challenge}
Emotional State: ${persona.emotional_state}
Competitors Used: ${persona.competitors_used.join(', ')}

CONVERSATION TRANSCRIPT:
${transcripts.map(t => `[${t.timestamp}] ${t.speaker.toUpperCase()}: ${t.text}`).join('\n')}

SALESPERSON: ${salespersonName}

Please provide a comprehensive evaluation.`
          }
        ],
        functions: [
          {
            name: "provide_sales_evaluation",
            description: "Provide a comprehensive sales performance evaluation",
            parameters: {
              type: "object",
              properties: {
                readiness_score: {
                  type: "number",
                  description: "Overall readiness score from 60-95",
                  minimum: 60,
                  maximum: 95
                },
                improvement_percentage: {
                  type: "string",
                  description: "Improvement vs last practice (e.g., '+35% vs Last Practice')"
                },
                meeting_time: {
                  type: "string",
                  description: "Next meeting time (e.g., 'Tomorrow 2:00 PM')"
                },
                talking_points: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: {
                        type: "string",
                        description: "Short, impactful title for the talking point"
                      },
                      description: {
                        type: "string",
                        description: "Detailed description tailored to this customer"
                      }
                    },
                    required: ["title", "description"]
                  },
                  description: "3-4 specific talking points for this customer"
                },
                performance_metrics: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      category: {
                        type: "string",
                        enum: [
                          "Product Knowledge & Application",
                          "Communication & Confidence",
                          "Discovery & Active Listening",
                          "Objection Handling & Follow-up"
                        ]
                      },
                      score: {
                        type: "number",
                        minimum: 60,
                        maximum: 95
                      },
                      feedback: {
                        type: "string",
                        description: "Specific feedback based on conversation analysis"
                      },
                      insight: {
                        type: "string",
                        description: "Actionable insight or improvement suggestion"
                      },
                      color: {
                        type: "string",
                        enum: ["emerald", "yellow", "red"],
                        description: "emerald for 85+, yellow for 70-84, red for <70"
                      }
                    },
                    required: ["category", "score", "feedback", "insight", "color"]
                  },
                  description: "Performance metrics for all 4 categories"
                },
                session_duration: {
                  type: "string",
                  description: "Session duration in MM:SS format"
                },
                key_insight: {
                  type: "string",
                  description: "A detailed key insight about the salesperson's performance, referencing specific moments from the conversation"
                },
                call_status: {
                  type: "string",
                  description: "Next action or call status message"
                }
              },
              required: [
                "readiness_score",
                "improvement_percentage",
                "meeting_time",
                "talking_points",
                "performance_metrics",
                "session_duration",
                "key_insight",
                "call_status"
              ]
            }
          }
        ],
        function_call: { name: "provide_sales_evaluation" }
      });

      const functionCall = completion.choices[0]?.message?.function_call;
      if (!functionCall?.arguments) {
        throw new Error('No function call response received from OpenAI');
      }

      const evaluationData = JSON.parse(functionCall.arguments);

      // Transform OpenAI response to our EvaluationResult format
      const result: EvaluationResult = {
        userData: {
          name: salespersonName,
          company: this.extractCompanyFromPersona(persona),
          meetingTime: evaluationData.meeting_time,
          readinessScore: evaluationData.readiness_score,
          improvement: evaluationData.improvement_percentage
        },
        talkingPoints: evaluationData.talking_points,
        performanceMetrics: evaluationData.performance_metrics,
        sessionData: {
          duration: evaluationData.session_duration,
          practicePartner: this.extractCompanyFromPersona(persona),
          scenario: `AI ${persona.name}`,
          keyInsight: evaluationData.key_insight,
          callStatus: evaluationData.call_status
        }
      };

      return result;

    } catch (error) {
      console.error('OpenAI evaluation error:', error);
      throw new Error(`Failed to generate evaluation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate talking points using OpenAI
   */
  static async generateTalkingPoints(
    scenario: SalesScenario,
    persona: CustomerPersona,
    transcripts: ConversationTranscript[]
  ): Promise<TalkingPoint[]> {
    try {
      const openai = this.getOpenAIClient();

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a sales strategist. Generate 3-4 specific, actionable talking points for the salesperson based on the customer's profile and conversation."
          },
          {
            role: "user",
            content: `Generate talking points for this situation:

SCENARIO: ${scenario.name} - ${scenario.description}
CUSTOMER: ${persona.name} (${persona.role}) at ${persona.company_size}
PAIN POINTS: ${persona.pain_points.join(', ')}
COMPETITORS: ${persona.competitors_used.join(', ')}
CONVERSATION: ${transcripts.map(t => `${t.speaker}: ${t.text}`).join('\n')}`
          }
        ],
        functions: [
          {
            name: "generate_talking_points",
            description: "Generate specific talking points for this customer",
            parameters: {
              type: "object",
              properties: {
                talking_points: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" }
                    },
                    required: ["title", "description"]
                  }
                }
              },
              required: ["talking_points"]
            }
          }
        ],
        function_call: { name: "generate_talking_points" }
      });

      const functionCall = completion.choices[0]?.message?.function_call;
      if (!functionCall?.arguments) {
        throw new Error('No function call response received');
      }

      const data = JSON.parse(functionCall.arguments);
      return data.talking_points;

    } catch (error) {
      console.error('Error generating talking points:', error);
      return [];
    }
  }

  /**
   * Analyze conversation performance using OpenAI
   */
  static async analyzeConversationPerformance(
    transcripts: ConversationTranscript[],
    persona: CustomerPersona
  ): Promise<PerformanceMetric[]> {
    try {
      const openai = this.getOpenAIClient();

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a sales performance analyst. Analyze the conversation and provide scores and feedback for the 4 key performance areas."
          },
          {
            role: "user",
            content: `Analyze this conversation with ${persona.name}:

CUSTOMER PROFILE:
- Role: ${persona.role}
- Communication Style: ${persona.communication_style}
- Pain Points: ${persona.pain_points.join(', ')}
- Objections: ${persona.objections.join(', ')}

CONVERSATION:
${transcripts.map(t => `${t.speaker}: ${t.text}`).join('\n')}

Please evaluate performance in all 4 categories.`
          }
        ],
        functions: [
          {
            name: "analyze_performance",
            description: "Analyze conversation performance across 4 categories",
            parameters: {
              type: "object",
              properties: {
                metrics: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      category: {
                        type: "string",
                        enum: [
                          "Product Knowledge & Application",
                          "Communication & Confidence",
                          "Discovery & Active Listening",
                          "Objection Handling & Follow-up"
                        ]
                      },
                      score: { type: "number", minimum: 60, maximum: 95 },
                      feedback: { type: "string" },
                      insight: { type: "string" },
                      color: { type: "string", enum: ["emerald", "yellow", "red"] }
                    },
                    required: ["category", "score", "feedback", "insight", "color"]
                  }
                }
              },
              required: ["metrics"]
            }
          }
        ],
        function_call: { name: "analyze_performance" }
      });

      const functionCall = completion.choices[0]?.message?.function_call;
      if (!functionCall?.arguments) {
        throw new Error('No function call response received');
      }

      const data = JSON.parse(functionCall.arguments);
      return data.metrics;

    } catch (error) {
      console.error('Error analyzing performance:', error);
      return [];
    }
  }

  /**
   * Extract company name from persona
   */
  private static extractCompanyFromPersona(persona: CustomerPersona): string {
    // Try to extract from context or use company size as fallback
    if (persona.company_size.includes('Vista')) return 'Vista Equity Partners';
    if (persona.company_size.includes('KKR')) return 'KKR';
    if (persona.company_size.includes('Blackstone')) return 'Blackstone';

    return persona.company_size.includes('PE') ? 'Private Equity Firm' : 'Enterprise Client';
  }

  /**
   * Test OpenAI connection
   */
  static async testConnection(): Promise<boolean> {
    try {
      const openai = this.getOpenAIClient();

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "user", content: "Test connection - please respond with 'OK'" }
        ],
        max_tokens: 5
      });

      return completion.choices[0]?.message?.content?.includes('OK') || false;
    } catch (error) {
      console.error('OpenAI connection test failed:', error);
      return false;
    }
  }
}
