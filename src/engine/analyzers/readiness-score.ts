import type { SignalScores } from '@/types/snapshot'
import { READINESS_WEIGHTS } from '@/engine/constants/scoring-weights'

export function calculateReadinessScore(signals: SignalScores): number {
  let weightedSum = 0
  for (const [key, weight] of Object.entries(READINESS_WEIGHTS)) {
    const score = signals[key as keyof SignalScores]
    weightedSum += score * weight
  }
  return Math.round((weightedSum / 5) * 100)
}

export function getReadinessLabel(score: number): string {
  if (score >= 80) return 'Strong'
  if (score >= 60) return 'Moderate'
  if (score >= 40) return 'Developing'
  if (score >= 20) return 'Weak'
  return 'Critical'
}
