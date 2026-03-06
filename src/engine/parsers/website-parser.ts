import type { ParseResult } from '@/types/common'

export interface WebsiteExtract {
  rawContent: string
  detectedCategories: string[]
  detectedAudience: string[]
  differentiators: string[]
  missingTrustSignals: string[]
  detectedServices: string[]
  tone: string
}

const TRUST_SIGNAL_KEYWORDS = [
  'certified', 'licensed', 'accredited', 'award', 'recognized',
  'years of experience', 'established', 'trusted', 'guarantee',
  'testimonial', 'case study', 'client', 'review', 'rating',
  'partnership', 'member of', 'affiliated', 'ISO', 'BBB',
]

const DIFFERENTIATOR_PATTERNS = [
  /(?:unique|only|first|exclusive|proprietary|patented|innovative)\s+\w+/gi,
  /(?:unlike|compared to|different from|sets us apart)/gi,
  /(?:specialized|specializing|expertise in|focused on)/gi,
]

export function parseWebsiteContent(rawText: string): ParseResult<WebsiteExtract> {
  if (!rawText.trim()) {
    return { success: false, errors: ['Website content is required'] }
  }

  const lower = rawText.toLowerCase()

  const detectedCategories: string[] = []
  const categoryPatterns = [
    /(?:we are|we're|is) (?:a|an|the) (.+?)(?:\.|,|\n)/gi,
    /(?:providing|offering|delivering) (.+?)(?:\.|,|\n)/gi,
    /(?:specializ(?:e|ing) in) (.+?)(?:\.|,|\n)/gi,
  ]
  for (const pattern of categoryPatterns) {
    let match
    while ((match = pattern.exec(rawText)) !== null) {
      detectedCategories.push(match[1].trim())
    }
  }

  const detectedAudience: string[] = []
  const audiencePatterns = [
    /(?:for|serving|helping) (.+?)(?:businesses|companies|organizations|individuals|professionals|teams)/gi,
    /(?:our clients|our customers) (?:include|are|range from) (.+?)(?:\.|,|\n)/gi,
  ]
  for (const pattern of audiencePatterns) {
    let match
    while ((match = pattern.exec(rawText)) !== null) {
      detectedAudience.push(match[0].trim())
    }
  }

  const differentiators: string[] = []
  for (const pattern of DIFFERENTIATOR_PATTERNS) {
    let match
    while ((match = pattern.exec(rawText)) !== null) {
      differentiators.push(match[0].trim())
    }
  }

  const missingTrustSignals: string[] = []
  const presentSignals = TRUST_SIGNAL_KEYWORDS.filter((kw) => lower.includes(kw.toLowerCase()))
  const absentSignals = TRUST_SIGNAL_KEYWORDS.filter((kw) => !lower.includes(kw.toLowerCase()))

  if (!presentSignals.some((s) => ['testimonial', 'case study', 'review'].includes(s))) {
    missingTrustSignals.push('No testimonials, case studies, or reviews detected')
  }
  if (!presentSignals.some((s) => ['certified', 'licensed', 'accredited', 'ISO'].includes(s))) {
    missingTrustSignals.push('No certifications or accreditations mentioned')
  }
  if (!presentSignals.some((s) => ['award', 'recognized'].includes(s))) {
    missingTrustSignals.push('No awards or recognition mentioned')
  }
  if (!presentSignals.some((s) => ['guarantee'].includes(s))) {
    missingTrustSignals.push('No guarantees or risk-reduction signals')
  }
  if (!presentSignals.some((s) => ['partnership', 'member of', 'affiliated'].includes(s))) {
    missingTrustSignals.push('No partnerships or association memberships mentioned')
  }
  if (absentSignals.length > 10) {
    missingTrustSignals.push(`Only ${presentSignals.length} of ${TRUST_SIGNAL_KEYWORDS.length} trust signal types detected`)
  }

  const servicePatterns = [
    /(?:our services include|services?:)\s*(.+?)(?:\n\n|\n[A-Z])/gis,
    /(?:we offer|we provide)\s+(.+?)(?:\.|,\s*and|\n)/gi,
  ]
  const detectedServices: string[] = []
  for (const pattern of servicePatterns) {
    let match
    while ((match = pattern.exec(rawText)) !== null) {
      detectedServices.push(match[1].trim())
    }
  }

  let tone = 'neutral'
  const salesWords = ['best', 'leading', 'top', '#1', 'premier', 'unmatched', 'unrivaled']
  const salesCount = salesWords.filter((w) => lower.includes(w)).length
  if (salesCount >= 3) tone = 'heavily promotional'
  else if (salesCount >= 1) tone = 'moderately promotional'
  else tone = 'neutral/informative'

  return {
    success: true,
    data: {
      rawContent: rawText,
      detectedCategories: [...new Set(detectedCategories)].slice(0, 5),
      detectedAudience: [...new Set(detectedAudience)].slice(0, 5),
      differentiators: [...new Set(differentiators)].slice(0, 10),
      missingTrustSignals,
      detectedServices: [...new Set(detectedServices)].slice(0, 10),
      tone,
    },
    errors: [],
  }
}
