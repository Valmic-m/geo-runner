import type { AssessmentAnswer, AssessmentQuestion } from '@/types/assessment'
import type { SignalScores, PlatformVisibility, SignalKey, PlatformKey } from '@/types/snapshot'

/**
 * Computes signal scores (1-5) from assessment answers.
 * For each signal, gathers all answered questions, computes weighted average of
 * scoreContributions, then maps 0-1 range to 1-5 scale.
 * Falls back to provided fallback scores for unanswered signals.
 */
export function computeSignalScores(
  answers: AssessmentAnswer[],
  questions: AssessmentQuestion[],
  fallbackScores?: Partial<SignalScores>,
): SignalScores {
  const answerMap = new Map(answers.map((a) => [a.questionId, a.value]))

  const signalKeys: SignalKey[] = [
    'entityClarity', 'brandMentions', 'comparisonPresence', 'faqCoverage',
    'structuredData', 'reviews', 'authoritySignals', 'citations',
    'gbpCompleteness', 'knowledgeGraphSignals', 'messagingConsistency', 'credibilitySignals',
  ]

  const scores = {} as SignalScores

  for (const signalKey of signalKeys) {
    const signalQuestions = questions.filter((q) => q.signalKey === signalKey)
    const score = computeGroupScore(signalQuestions, answerMap)

    if (score !== null) {
      // Map 0-1 contribution to 1-5 scale
      scores[signalKey] = Math.round(1 + score * 4)
    } else {
      scores[signalKey] = fallbackScores?.[signalKey] ?? 0
    }
  }

  return scores
}

/**
 * Computes platform visibility (0-100%) from assessment answers.
 * For unanswered/untested platforms, falls back to provided values or 0.
 */
export function computePlatformVisibility(
  answers: AssessmentAnswer[],
  questions: AssessmentQuestion[],
  fallbackVisibility?: Partial<PlatformVisibility>,
): PlatformVisibility {
  const answerMap = new Map(answers.map((a) => [a.questionId, a.value]))

  const platformKeys: PlatformKey[] = ['chatgpt', 'gemini', 'claude', 'perplexity', 'aiOverviews']
  const visibility = {} as PlatformVisibility

  for (const platformKey of platformKeys) {
    const platformQuestions = questions.filter((q) => q.platformKey === platformKey)
    const score = computeGroupScore(platformQuestions, answerMap)

    if (score !== null) {
      visibility[platformKey] = Math.round(score * 100)
    } else {
      visibility[platformKey] = fallbackVisibility?.[platformKey] ?? 0
    }
  }

  return visibility
}

/**
 * Computes competitor dominance (0-100%) from competitor assessment answers.
 * Higher score = competitors dominate more.
 */
export function computeCompetitorDominance(
  answers: AssessmentAnswer[],
  questions: AssessmentQuestion[],
): number {
  const answerMap = new Map(answers.map((a) => [a.questionId, a.value]))
  const score = computeGroupScore(questions, answerMap)
  return score !== null ? Math.round(score * 100) : 0
}

/**
 * Core scoring algorithm. For a group of questions:
 * 1. Filter to only questions that have been answered (excluding zero-weight gating questions)
 * 2. For each answered question, find the matching option's scoreContribution
 * 3. Compute weighted average
 * Returns null if no questions were answered.
 */
function computeGroupScore(
  questions: AssessmentQuestion[],
  answerMap: Map<string, string>,
): number | null {
  let totalWeight = 0
  let weightedSum = 0
  let hasAnyAnswer = false

  for (const q of questions) {
    const answerValue = answerMap.get(q.id)
    if (answerValue === undefined) continue

    // Skip zero-weight gating questions from the score calculation
    if (q.weight === 0) continue

    // Check if conditional is met
    if (q.conditionalOn) {
      const parentAnswer = answerMap.get(q.conditionalOn.questionId)
      if (!parentAnswer || !q.conditionalOn.answerValues.includes(parentAnswer)) {
        continue
      }
    }

    const option = q.options.find((o) => o.value === answerValue)
    if (!option) continue

    weightedSum += option.scoreContribution * q.weight
    totalWeight += q.weight
    hasAnyAnswer = true
  }

  if (!hasAnyAnswer || totalWeight === 0) return null
  return weightedSum / totalWeight
}
