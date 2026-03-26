import { describe, it, expect } from 'vitest'
import { calculateReadinessScore, calculateConfidenceAdjustedScore, getReadinessLabel } from './readiness-score'
import type { SignalScores } from '@/types/snapshot'
import type { EstimatedSignals } from './signal-estimator'

function makeSignals(score: number): SignalScores {
  return {
    entityClarity: score,
    brandMentions: score,
    comparisonPresence: score,
    faqCoverage: score,
    structuredData: score,
    reviews: score,
    authoritySignals: score,
    citations: score,
    gbpCompleteness: score,
    knowledgeGraphSignals: score,
    messagingConsistency: score,
    credibilitySignals: score,
  }
}

describe('getReadinessLabel', () => {
  it('returns Critical for scores below 20', () => {
    expect(getReadinessLabel(0)).toBe('Critical')
    expect(getReadinessLabel(19)).toBe('Critical')
  })

  it('returns Weak for scores 20-39', () => {
    expect(getReadinessLabel(20)).toBe('Weak')
    expect(getReadinessLabel(39)).toBe('Weak')
  })

  it('returns Developing for scores 40-59', () => {
    expect(getReadinessLabel(40)).toBe('Developing')
    expect(getReadinessLabel(59)).toBe('Developing')
  })

  it('returns Moderate for scores 60-79', () => {
    expect(getReadinessLabel(60)).toBe('Moderate')
    expect(getReadinessLabel(79)).toBe('Moderate')
  })

  it('returns Strong for scores 80+', () => {
    expect(getReadinessLabel(80)).toBe('Strong')
    expect(getReadinessLabel(100)).toBe('Strong')
  })
})

describe('calculateReadinessScore', () => {
  it('returns 100 when all signals are 5', () => {
    expect(calculateReadinessScore(makeSignals(5))).toBe(100)
  })

  it('returns 20 when all signals are 1', () => {
    expect(calculateReadinessScore(makeSignals(1))).toBe(20)
  })

  it('returns 0 when all signals are 0', () => {
    expect(calculateReadinessScore(makeSignals(0))).toBe(0)
  })

  it('returns a value between 0 and 100 for mixed signals', () => {
    const signals = makeSignals(3)
    signals.entityClarity = 5
    signals.reviews = 1
    const score = calculateReadinessScore(signals)
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
  })

  it('applies industry-specific weights when category provided', () => {
    const signals = makeSignals(3)
    signals.reviews = 5
    signals.gbpCompleteness = 5

    const defaultScore = calculateReadinessScore(signals)
    // Local services weights reviews and GBP much higher
    const localScore = calculateReadinessScore(signals, 'Plumber')
    expect(localScore).not.toBe(defaultScore)
  })
})

describe('calculateConfidenceAdjustedScore', () => {
  it('returns lower score when confidence is low', () => {
    const highConfidence: EstimatedSignals = {} as EstimatedSignals
    const lowConfidence: EstimatedSignals = {} as EstimatedSignals

    const keys: (keyof SignalScores)[] = [
      'entityClarity', 'brandMentions', 'comparisonPresence', 'faqCoverage',
      'structuredData', 'reviews', 'authoritySignals', 'citations',
      'gbpCompleteness', 'knowledgeGraphSignals', 'messagingConsistency', 'credibilitySignals',
    ]

    for (const key of keys) {
      highConfidence[key] = { score: 4, confidence: 'high', reason: 'test' }
      lowConfidence[key] = { score: 4, confidence: 'low', reason: 'test' }
    }

    const highResult = calculateConfidenceAdjustedScore(highConfidence)
    const lowResult = calculateConfidenceAdjustedScore(lowConfidence)

    expect(highResult.score).toBeGreaterThan(lowResult.score)
  })

  it('returns a valid label', () => {
    const signals: EstimatedSignals = {} as EstimatedSignals
    const keys: (keyof SignalScores)[] = [
      'entityClarity', 'brandMentions', 'comparisonPresence', 'faqCoverage',
      'structuredData', 'reviews', 'authoritySignals', 'citations',
      'gbpCompleteness', 'knowledgeGraphSignals', 'messagingConsistency', 'credibilitySignals',
    ]
    for (const key of keys) {
      signals[key] = { score: 3, confidence: 'medium', reason: 'test' }
    }

    const result = calculateConfidenceAdjustedScore(signals)
    expect(['Critical', 'Weak', 'Developing', 'Moderate', 'Strong']).toContain(result.label)
  })

  it('returns verifiedPercentage between 0 and 100', () => {
    const signals: EstimatedSignals = {} as EstimatedSignals
    const keys: (keyof SignalScores)[] = [
      'entityClarity', 'brandMentions', 'comparisonPresence', 'faqCoverage',
      'structuredData', 'reviews', 'authoritySignals', 'citations',
      'gbpCompleteness', 'knowledgeGraphSignals', 'messagingConsistency', 'credibilitySignals',
    ]
    for (const key of keys) {
      signals[key] = { score: 3, confidence: 'high', reason: 'test' }
    }

    const result = calculateConfidenceAdjustedScore(signals)
    expect(result.verifiedPercentage).toBeGreaterThanOrEqual(0)
    expect(result.verifiedPercentage).toBeLessThanOrEqual(100)
  })
})
