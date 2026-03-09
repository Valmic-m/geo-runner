import type { AssessmentQuestion } from '@/types/assessment'
import type { Competitor } from '@/types/snapshot'

/**
 * Generates dynamic competitor dominance questions based on the user's competitor list.
 * These questions are created at runtime since they depend on the actual competitors entered.
 */
export function generateCompetitorQuestions(competitors: Competitor[], platformKeys: string[] = ['chatgpt', 'gemini', 'perplexity']): AssessmentQuestion[] {
  if (competitors.length === 0) return []

  const questions: AssessmentQuestion[] = []

  // General competitor dominance question
  questions.push({
    id: 'comp-general',
    text: 'When you ask AI chatbots about {{category}}, do they recommend your competitors more often than {{businessName}}?',
    answerType: 'yes-sometimes-no',
    options: [
      { value: 'yes', label: 'Yes, competitors dominate', scoreContribution: 1.0 },
      { value: 'sometimes', label: 'Mixed — sometimes us, sometimes them', scoreContribution: 0.5 },
      { value: 'no', label: 'No, we appear equally or more', scoreContribution: 0.0 },
    ],
    cycle: 'all',
    weight: 0.3,
  })

  // Per-competitor questions (max 3 competitors to keep form manageable)
  for (const comp of competitors.slice(0, 3)) {
    const compId = comp.name.toLowerCase().replace(/[^a-z0-9]/g, '-')

    questions.push({
      id: `comp-${compId}-mention`,
      text: `When asking AI about {{category}}, does it mention ${comp.name} specifically?`,
      answerType: 'yes-sometimes-no',
      options: [
        { value: 'yes', label: 'Yes, frequently', scoreContribution: 1.0 },
        { value: 'sometimes', label: 'Sometimes', scoreContribution: 0.5 },
        { value: 'no', label: 'No', scoreContribution: 0.0 },
      ],
      cycle: 'all',
      weight: 0.35 / Math.min(competitors.length, 3),
    })

    questions.push({
      id: `comp-${compId}-bestof`,
      text: `Does ${comp.name} appear in "best of" or "top {{category}}" lists that {{businessName}} does not?`,
      answerType: 'yes-no',
      options: [
        { value: 'yes', label: 'Yes', scoreContribution: 1.0 },
        { value: 'no', label: 'No', scoreContribution: 0.0 },
      ],
      cycle: 'quarterly',
      weight: 0.35 / Math.min(competitors.length, 3),
    })
  }

  return questions
}
