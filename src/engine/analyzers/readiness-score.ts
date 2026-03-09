import type { SignalKey, SignalScores } from '@/types/snapshot'
import type { EstimatedSignals, SignalConfidence } from '@/engine/analyzers/signal-estimator'
import { READINESS_WEIGHTS } from '@/engine/constants/scoring-weights'
import { getWeightsForCategory } from '@/engine/constants/industry-weights'

export function calculateReadinessScore(signals: SignalScores, category?: string): number {
  const weights = category ? getWeightsForCategory(category) : READINESS_WEIGHTS
  let weightedSum = 0
  for (const [key, weight] of Object.entries(weights)) {
    const score = signals[key as SignalKey]
    weightedSum += score * weight
  }
  return Math.round((weightedSum / 5) * 100)
}

const CONFIDENCE_MULTIPLIERS: Record<SignalConfidence, number> = {
  high: 1.0,
  medium: 0.7,
  low: 0.4,
  unknown: 0.2,
}

export interface ConfidenceAdjustedResult {
  score: number
  label: string
  verifiedPercentage: number
}

export function calculateConfidenceAdjustedScore(
  estimatedSignals: EstimatedSignals,
  category?: string,
): ConfidenceAdjustedResult {
  const weights = category ? getWeightsForCategory(category) : READINESS_WEIGHTS
  let weightedSum = 0
  let totalConfidenceWeight = 0

  for (const [key, weight] of Object.entries(weights)) {
    const signal = estimatedSignals[key as SignalKey]
    if (!signal) continue
    const confidenceMultiplier = CONFIDENCE_MULTIPLIERS[signal.confidence]
    weightedSum += signal.score * weight * confidenceMultiplier
    totalConfidenceWeight += confidenceMultiplier * weight
  }

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0)
  const verifiedPercentage = Math.round((totalConfidenceWeight / totalWeight) * 100)
  const score = Math.round((weightedSum / 5) * 100)

  return {
    score,
    label: getReadinessLabel(score),
    verifiedPercentage,
  }
}

export function getReadinessLabel(score: number): string {
  if (score >= 80) return 'Strong'
  if (score >= 60) return 'Moderate'
  if (score >= 40) return 'Developing'
  if (score >= 20) return 'Weak'
  return 'Critical'
}
