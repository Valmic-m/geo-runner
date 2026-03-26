import { describe, it, expect } from 'vitest'
import { parseSnapshot } from './snapshot-parser'

describe('parseSnapshot', () => {
  it('parses a complete snapshot text', () => {
    const text = `
Business Name: Acme Plumbing
Primary Category: Plumber
Secondary Category: Home Services
Audience: Homeowners
Geo Scope: San Diego, CA
Revenue Model: Services
Regulated: No
Competitors: DrainMaster, PipePro
Entity Clarity: 3
Brand Mentions: 2
Comparison Presence: 1
FAQ Coverage: 4
Structured Data: 2
Reviews: 5
Authority Signals: 3
Citations: 2
GBP Completeness: 4
Knowledge Graph Signals: 1
Messaging Consistency: 3
Credibility Signals: 2
ChatGPT Inclusion: 40
Gemini Inclusion: 30
Claude Inclusion: 20
Perplexity Inclusion: 50
AI Overviews Inclusion: 35
Competitor Dominance: 60
Focus Tier: Tier 1
Primary Bottleneck: Entity clarity
Notes: New client
`
    const result = parseSnapshot(text)

    expect(result.success).toBe(true)
    expect(result.data!.businessName).toBe('Acme Plumbing')
    expect(result.data!.primaryCategory).toBe('Plumber')
    expect(result.data!.signals.entityClarity).toBe(3)
    expect(result.data!.signals.reviews).toBe(5)
    expect(result.data!.platformVisibility.chatgpt).toBe(40)
    expect(result.data!.competitors).toHaveLength(2)
    expect(result.data!.competitors[0].name).toBe('DrainMaster')
  })

  it('returns errors when required fields missing', () => {
    const result = parseSnapshot('Some random text without fields')

    expect(result.success).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
    expect(result.errors).toContain('Business name is required')
    expect(result.errors).toContain('Primary category is required')
  })

  it('defaults missing numeric fields to 0', () => {
    const text = `
Business Name: Test Co
Primary Category: Plumber
`
    const result = parseSnapshot(text)

    expect(result.success).toBe(true)
    expect(result.data!.signals.entityClarity).toBe(0)
    expect(result.data!.signals.reviews).toBe(0)
    expect(result.data!.platformVisibility.chatgpt).toBe(0)
  })

  it('handles alternative field labels', () => {
    const text = `
Client Name: Alt Corp
Primary Category: Dentist
Target Audience: Families
Geographic Scope: National
`
    const result = parseSnapshot(text)

    expect(result.success).toBe(true)
    expect(result.data!.businessName).toBe('Alt Corp')
    expect(result.data!.audience).toBe('Families')
    expect(result.data!.geoScope).toBe('National')
  })

  it('parses percentage values correctly', () => {
    const text = `
Business Name: Test
Primary Category: Dentist
ChatGPT Inclusion: 45%
Competitor Dominance: 70%
`
    const result = parseSnapshot(text)
    expect(result.data!.platformVisibility.chatgpt).toBe(45)
    expect(result.data!.competitorDominance).toBe(70)
  })
})
