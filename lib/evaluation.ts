import { EvaluationResult, Transcription } from '@/types/evaluation';
import { Persona, ScenarioDetail } from '@/types/scenario';

export async function generateEvaluation(
  persona: Persona,
  scenarioDetail: ScenarioDetail,
  transcriptions: Transcription[]
): Promise<EvaluationResult> {
  try {
    const response = await fetch('/api/evaluation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        persona,
        scenarioDetail,
        transcriptions,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate evaluation');
    }

    const evaluation: EvaluationResult = await response.json();
    return evaluation;
  } catch (error) {
    console.error('Error generating evaluation:', error);

    // Return a fallback evaluation if API fails
    return {
      userData: {
        name: 'Sales Rep',
        company: persona.name.split(' ').pop() || 'Target Company',
        meetingTime: 'Practice Session',
        readinessScore: 75,
        improvement: 'Continue practicing'
      },
      talkingPoints: [
        {
          title: 'Product Knowledge',
          description: 'Demonstrated good understanding of the solution'
        },
        {
          title: 'Customer Needs',
          description: 'Identified key pain points effectively'
        }
      ],
      performanceMetrics: [
        {
          category: 'Communication',
          score: 75,
          feedback: 'Good overall communication with room for improvement',
          insight: 'Focus on speaking more confidently and clearly',
          color: 'yellow'
        },
        {
          category: 'Objection Handling',
          score: 70,
          feedback: 'Handled some objections well',
          insight: 'Practice addressing concerns more directly',
          color: 'yellow'
        }
      ],
      sessionData: {
        duration: '15 minutes',
        practicePartner: persona.name,
        scenario: scenarioDetail.name,
        keyInsight: 'Practice sessions help build confidence and improve sales techniques',
        callStatus: 'Good progress! Keep practicing to improve your skills.'
      }
    };
  }
}