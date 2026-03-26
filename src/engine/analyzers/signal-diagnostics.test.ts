import { describe, it, expect } from 'vitest'
import { analyzeSignals } from './signal-diagnostics'
import type { SignalScores } from '@/types/snapshot'

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

describe('analyzeSignals', () => {
  it('returns 12 diagnostics for all signals', () => {
    const diagnostics = analyzeSignals(makeSignals(3))
    expect(diagnostics).toHaveLength(12)
  })

  it('assigns critical status for score <= 1', () => {
    const diagnostics = analyzeSignals(makeSignals(1))
    expect(diagnostics.every(d => d.status === 'critical')).toBe(true)
  })

  it('assigns weak status for score 2', () => {
    const diagnostics = analyzeSignals(makeSignals(2))
    expect(diagnostics.every(d => d.status === 'weak')).toBe(true)
  })

  it('assigns moderate status for score 3', () => {
    const diagnostics = analyzeSignals(makeSignals(3))
    expect(diagnostics.every(d => d.status === 'moderate')).toBe(true)
  })

  it('assigns strong status for score 4+', () => {
    const diagnostics = analyzeSignals(makeSignals(4))
    expect(diagnostics.every(d => d.status === 'strong')).toBe(true)
  })

  it('sorts diagnostics by score ascending (weakest first)', () => {
    const signals = makeSignals(3)
    signals.entityClarity = 1
    signals.reviews = 5

    const diagnostics = analyzeSignals(signals)
    expect(diagnostics[0].signal).toBe('entityClarity')
    expect(diagnostics[diagnostics.length - 1].signal).toBe('reviews')
  })

  it('provides non-empty recommendations for weak signals', () => {
    const diagnostics = analyzeSignals(makeSignals(1))
    for (const d of diagnostics) {
      expect(d.recommendation).toBeTruthy()
      expect(d.recommendation.length).toBeGreaterThan(10)
    }
  })

  it('provides maintain message for strong signals', () => {
    const diagnostics = analyzeSignals(makeSignals(5))
    for (const d of diagnostics) {
      expect(d.recommendation).toContain('strong')
    }
  })

  it('includes label for each diagnostic', () => {
    const diagnostics = analyzeSignals(makeSignals(3))
    for (const d of diagnostics) {
      expect(d.label).toBeTruthy()
    }
  })
})
