import { describe, it, expect } from 'vitest'
import { parseChangelog } from './changelog-parser'

describe('parseChangelog', () => {
  it('parses a complete changelog', () => {
    const text = `
New Services/Products: Added drain cleaning
New Locations: Opened San Diego office
Messaging Changes: Updated tagline
Pricing Changes: 10% increase
Compliance Updates: HIPAA training complete
Campaigns Launched: Spring promo
Priority Revenue Focus: Commercial contracts
`
    const result = parseChangelog(text)

    expect(result.success).toBe(true)
    expect(result.data!.newServicesProducts).toBe('Added drain cleaning')
    expect(result.data!.newLocations).toBe('Opened San Diego office')
    expect(result.data!.messagingChanges).toBe('Updated tagline')
    expect(result.data!.pricingChanges).toBe('10% increase')
    expect(result.data!.complianceUpdates).toBe('HIPAA training complete')
    expect(result.data!.campaignsLaunched).toBe('Spring promo')
    expect(result.data!.priorityRevenueFocus).toBe('Commercial contracts')
  })

  it('returns empty strings for missing fields', () => {
    const result = parseChangelog('Some unstructured text')

    expect(result.success).toBe(true)
    expect(result.data!.newServicesProducts).toBe('')
    expect(result.data!.newLocations).toBe('')
  })

  it('handles alternate separators', () => {
    const text = 'New Services - New API endpoint\nNew Locations = Remote'
    const result = parseChangelog(text)

    expect(result.success).toBe(true)
    expect(result.data!.newServicesProducts).toBeTruthy()
  })
})
