import { describe, it, expect } from 'vitest'
import {
  estimateSignals,
  estimatedSignalsToScores,
  estimateFocusTier,
  estimateBottleneck,
} from './signal-estimator'
import type { WebsiteExtract } from '@/engine/parsers/website-parser'

function makeExtract(overrides: Partial<WebsiteExtract> = {}): WebsiteExtract {
  return {
    rawContent: 'Test content',
    detectedCategories: [],
    detectedAudience: [],
    differentiators: [],
    missingTrustSignals: [],
    detectedServices: [],
    tone: 'neutral',
    hasSchemaMarkup: false,
    schemaTypes: [],
    hasFaqContent: false,
    faqCount: 0,
    hasReviewContent: false,
    reviewMentionCount: 0,
    detectedLocations: [],
    hasLocalFocus: false,
    revenueModelIndicator: '',
    regulatedIndustryIndicator: '',
    hasCertifications: false,
    hasAwards: false,
    hasPartnerships: false,
    hasComparisonContent: false,
    detectedCompetitors: [],
    businessNameCandidates: [],
    schemaCompleteness: {
      score: 0,
      hasOrganization: false,
      hasLocalBusiness: false,
      hasFaqPage: false,
      hasService: false,
      hasReview: false,
      missingFields: [],
    },
    contentDepth: {
      totalWordCount: 100,
      headingCount: 2,
      headingHierarchyValid: true,
      internalLinkCount: 5,
      imageCount: 3,
      imagesWithAlt: 2,
      altTextCoverage: 67,
    },
    socialProfiles: [],
    ...overrides,
  }
}

describe('estimateSignals', () => {
  it('returns all 12 signal keys', () => {
    const result = estimateSignals(makeExtract())
    expect(Object.keys(result)).toHaveLength(12)
  })

  it('returns scores between 1 and 5', () => {
    const result = estimateSignals(makeExtract())
    for (const signal of Object.values(result)) {
      expect(signal.score).toBeGreaterThanOrEqual(1)
      expect(signal.score).toBeLessThanOrEqual(5)
    }
  })

  it('gives higher entity clarity for rich extracts', () => {
    const bare = estimateSignals(makeExtract())
    const rich = estimateSignals(makeExtract({
      detectedCategories: ['Plumber'],
      hasSchemaMarkup: true,
      schemaTypes: ['Organization'],
      businessNameCandidates: ['Acme Plumbing'],
      detectedServices: ['Pipe repair', 'Drain cleaning'],
    }))

    expect(rich.entityClarity.score).toBeGreaterThan(bare.entityClarity.score)
  })

  it('detects FAQ content and scores accordingly', () => {
    const noFaq = estimateSignals(makeExtract())
    const hasFaq = estimateSignals(makeExtract({ hasFaqContent: true, faqCount: 10 }))

    expect(hasFaq.faqCoverage.score).toBeGreaterThan(noFaq.faqCoverage.score)
  })

  it('detects structured data presence', () => {
    const noSchema = estimateSignals(makeExtract())
    const hasSchema = estimateSignals(makeExtract({
      hasSchemaMarkup: true,
      schemaTypes: ['Organization'],
      schemaCompleteness: { score: 50, hasOrganization: true, hasLocalBusiness: false, hasFaqPage: false, hasService: false, hasReview: false, missingFields: [] },
    }))

    expect(hasSchema.structuredData.score).toBeGreaterThan(noSchema.structuredData.score)
  })

  it('provides confidence levels', () => {
    const result = estimateSignals(makeExtract())
    for (const signal of Object.values(result)) {
      expect(['high', 'medium', 'low', 'unknown']).toContain(signal.confidence)
    }
  })

  it('provides non-empty reasons', () => {
    const result = estimateSignals(makeExtract())
    for (const signal of Object.values(result)) {
      expect(signal.reason).toBeTruthy()
    }
  })
})

describe('estimatedSignalsToScores', () => {
  it('converts estimated signals to plain scores', () => {
    const estimated = estimateSignals(makeExtract())
    const scores = estimatedSignalsToScores(estimated)

    expect(Object.keys(scores)).toHaveLength(12)
    for (const key of Object.keys(scores)) {
      expect(scores[key as keyof typeof scores]).toBe(estimated[key as keyof typeof estimated].score)
    }
  })
})

describe('estimateFocusTier', () => {
  it('returns Tier 1 for low average scores', () => {
    const estimated = estimateSignals(makeExtract())
    // Bare extract should have mostly low scores
    const tier = estimateFocusTier(estimated)
    expect(tier).toContain('Tier 1')
  })

  it('returns Tier 2 or 3 for higher scores', () => {
    const rich = estimateSignals(makeExtract({
      detectedCategories: ['Plumber'],
      hasSchemaMarkup: true,
      schemaTypes: ['Organization', 'LocalBusiness'],
      businessNameCandidates: ['Acme'],
      detectedServices: ['Plumbing'],
      hasFaqContent: true,
      faqCount: 20,
      hasReviewContent: true,
      reviewMentionCount: 10,
      hasCertifications: true,
      hasAwards: true,
      hasPartnerships: true,
      hasComparisonContent: true,
      socialProfiles: ['linkedin.com/acme', 'facebook.com/acme', 'instagram.com/acme'],
      schemaCompleteness: { score: 80, hasOrganization: true, hasLocalBusiness: true, hasFaqPage: true, hasService: true, hasReview: true, missingFields: [] },
    }))
    const tier = estimateFocusTier(rich)
    expect(tier).toMatch(/Tier [23]/)
  })
})

describe('estimateBottleneck', () => {
  it('returns a non-empty string', () => {
    const estimated = estimateSignals(makeExtract())
    const bottleneck = estimateBottleneck(estimated)
    expect(bottleneck).toBeTruthy()
    expect(bottleneck.length).toBeGreaterThan(5)
  })
})
