import { describe, it, expect } from 'vitest'
import { generateRecommendations } from './recommendation-engine'
import type { ClientGeoSnapshot } from '@/types/snapshot'

function makeSnapshot(signalScore: number = 3): ClientGeoSnapshot {
  return {
    businessName: 'Acme Plumbing',
    primaryCategory: 'Plumber',
    secondaryCategory: '',
    audience: 'Homeowners',
    geoScope: 'San Diego, CA',
    revenueModel: 'Services',
    regulated: 'No',
    competitors: [{ url: '', name: 'DrainMaster' }],
    signals: {
      entityClarity: signalScore,
      brandMentions: signalScore,
      comparisonPresence: signalScore,
      faqCoverage: signalScore,
      structuredData: signalScore,
      reviews: signalScore,
      authoritySignals: signalScore,
      citations: signalScore,
      gbpCompleteness: signalScore,
      knowledgeGraphSignals: signalScore,
      messagingConsistency: signalScore,
      credibilitySignals: signalScore,
    },
    platformVisibility: { chatgpt: 50, gemini: 50, claude: 50, perplexity: 50, aiOverviews: 50 },
    competitorDominance: 40,
    focusTier: 'Tier 2',
    primaryBottleneck: '',
    notes: '',
  }
}

describe('generateRecommendations', () => {
  it('returns empty array when all signals are strong', () => {
    const snapshot = makeSnapshot(5)
    const recs = generateRecommendations(snapshot)
    // All signals at 5 are above the critical threshold of 3, so no signal-based recs
    expect(recs.length).toBe(0)
  })

  it('generates recommendations for weak signals', () => {
    const snapshot = makeSnapshot(1)
    const recs = generateRecommendations(snapshot)
    expect(recs.length).toBeGreaterThan(0)
  })

  it('sorts recommendations by priority descending', () => {
    const snapshot = makeSnapshot(1)
    const recs = generateRecommendations(snapshot)

    for (let i = 1; i < recs.length; i++) {
      expect(recs[i - 1].priority).toBeGreaterThanOrEqual(recs[i].priority)
    }
  })

  it('includes implementation steps', () => {
    const snapshot = makeSnapshot(1)
    const recs = generateRecommendations(snapshot)

    for (const rec of recs) {
      expect(rec.steps.length).toBeGreaterThan(0)
      expect(rec.steps[0].action).toBeTruthy()
      expect(rec.steps[0].detail).toBeTruthy()
    }
  })

  it('includes timeline and success criteria', () => {
    const snapshot = makeSnapshot(1)
    const recs = generateRecommendations(snapshot)

    for (const rec of recs) {
      expect(rec.timeline).toBeTruthy()
      expect(rec.successCriteria).toBeTruthy()
    }
  })

  it('assigns high impact to very low scores', () => {
    const snapshot = makeSnapshot(1)
    const recs = generateRecommendations(snapshot)

    const highImpact = recs.filter(r => r.impact === 'high')
    expect(highImpact.length).toBeGreaterThan(0)
  })

  it('generates platform-specific recs for low-visibility platforms', () => {
    const snapshot = makeSnapshot(2)
    snapshot.platformVisibility = { chatgpt: 10, gemini: 10, claude: 10, perplexity: 10, aiOverviews: 10 }

    const recs = generateRecommendations(snapshot)
    const platformRecs = recs.filter(r => r.platform !== 'all')
    expect(platformRecs.length).toBeGreaterThan(0)
  })

  it('includes business name in descriptions', () => {
    const snapshot = makeSnapshot(1)
    const recs = generateRecommendations(snapshot)

    const hasBusinessName = recs.some(r => r.description.includes('Acme Plumbing'))
    expect(hasBusinessName).toBe(true)
  })
})
