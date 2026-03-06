import type { ParseResult } from '@/types/common'
import { BUSINESS_CATEGORIES } from '@/engine/constants/business-categories'

export interface WebsiteExtract {
  rawContent: string
  detectedCategories: string[]
  detectedAudience: string[]
  differentiators: string[]
  missingTrustSignals: string[]
  detectedServices: string[]
  tone: string
  // Structured data signals
  hasSchemaMarkup: boolean
  schemaTypes: string[]
  hasFaqContent: boolean
  faqCount: number
  hasReviewContent: boolean
  reviewMentionCount: number
  detectedLocations: string[]
  hasLocalFocus: boolean
  revenueModelIndicator: string
  regulatedIndustryIndicator: string
  hasCertifications: boolean
  hasAwards: boolean
  hasPartnerships: boolean
  hasComparisonContent: boolean
  detectedCompetitors: string[]
  businessNameCandidates: string[]
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

function extractSchemaMarkup(rawHtml: string): { hasSchema: boolean; types: string[] } {
  const types: string[] = []
  const schemaRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  let match
  while ((match = schemaRegex.exec(rawHtml)) !== null) {
    try {
      const json = JSON.parse(match[1])
      const items = Array.isArray(json) ? json : [json]
      for (const item of items) {
        if (item['@type']) {
          const itemTypes = Array.isArray(item['@type']) ? item['@type'] : [item['@type']]
          types.push(...itemTypes)
        }
        // Check @graph for nested types
        if (item['@graph'] && Array.isArray(item['@graph'])) {
          for (const node of item['@graph']) {
            if (node['@type']) {
              const nodeTypes = Array.isArray(node['@type']) ? node['@type'] : [node['@type']]
              types.push(...nodeTypes)
            }
          }
        }
      }
    } catch {
      // Malformed JSON-LD, skip
    }
  }
  return { hasSchema: types.length > 0, types: [...new Set(types)] }
}

function extractFaqContent(rawHtml: string, plainText: string): { hasFaq: boolean; count: number } {
  const lower = plainText.toLowerCase()
  let count = 0

  // Check for FAQ schema
  if (rawHtml.includes('"FAQPage"') || rawHtml.includes("'FAQPage'")) {
    const questionMatches = rawHtml.match(/"Question"/gi) || []
    count += questionMatches.length
  }

  // Check for <details>/<summary> patterns (accordion FAQ)
  const detailsMatches = rawHtml.match(/<details/gi) || []
  count += detailsMatches.length

  // Check for FAQ heading patterns and Q&A in text
  const hasFaqHeading = /(?:faq|frequently asked|common questions|questions & answers)/i.test(lower)
  if (hasFaqHeading) {
    // Count question-like patterns after FAQ heading
    const questionPatterns = plainText.match(/(?:^|\n)\s*(?:Q:|Q\.|[0-9]+\.)\s*.+\?/gm) || []
    count += questionPatterns.length

    // Also count standalone questions (sentences ending with ?)
    if (count === 0) {
      const questions = plainText.match(/[A-Z][^.!?]*\?/g) || []
      count += Math.min(questions.length, 20) // Cap to avoid over-counting
    }
  }

  return { hasFaq: count > 0 || hasFaqHeading, count }
}

function extractReviewContent(plainText: string): { hasReviews: boolean; mentionCount: number } {
  const lower = plainText.toLowerCase()
  const reviewPatterns = [
    'testimonial', 'what our clients say', 'what our customers say',
    'client stories', 'customer stories', 'success stories',
    'reviews', 'rated', 'stars', 'star rating',
    'what people are saying', 'hear from our',
  ]
  let count = 0
  for (const pattern of reviewPatterns) {
    const matches = lower.match(new RegExp(pattern, 'gi')) || []
    count += matches.length
  }
  return { hasReviews: count > 0, mentionCount: count }
}

function extractLocations(rawHtml: string, plainText: string): { locations: string[]; isLocal: boolean } {
  const locations: string[] = []

  // Extract from <address> tags
  const addressRegex = /<address[^>]*>([\s\S]*?)<\/address>/gi
  let match
  while ((match = addressRegex.exec(rawHtml)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    if (text.length > 5) locations.push(text)
  }

  // US state abbreviations pattern (City, ST format)
  const cityStatePattern = /([A-Z][a-zA-Z\s]+),\s*(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)(?:\s+\d{5})?/g
  while ((match = cityStatePattern.exec(plainText)) !== null) {
    locations.push(match[0].trim())
  }

  // Check schema for LocalBusiness
  const hasLocalSchema = rawHtml.includes('"LocalBusiness"') || rawHtml.includes('"Restaurant"') ||
    rawHtml.includes('"Store"') || rawHtml.includes('"MedicalBusiness"') ||
    rawHtml.includes('"LegalService"') || rawHtml.includes('"FinancialService"')

  const isLocal = locations.length > 0 || hasLocalSchema ||
    /(?:serving|located in|based in|offices? in)\s/i.test(plainText)

  return { locations: [...new Set(locations)].slice(0, 5), isLocal }
}

function inferRevenueModel(plainText: string): string {
  const lower = plainText.toLowerCase()
  const scores: Record<string, number> = {
    'B2B': 0, 'B2C': 0, 'SaaS': 0, 'E-commerce': 0, 'Services': 0,
  }

  const b2bTerms = ['enterprise', 'business solutions', 'for teams', 'for companies', 'for businesses', 'request a demo', 'schedule a call', 'b2b', 'corporate']
  const b2cTerms = ['buy now', 'add to cart', 'shop now', 'order online', 'for individuals', 'for families', 'personal']
  const saasTerms = ['pricing plans', 'free trial', 'subscribe', 'monthly plan', 'per user', 'per month', 'saas', 'cloud platform', 'sign up free']
  const ecomTerms = ['add to cart', 'checkout', 'shipping', 'product catalog', 'shop', 'store', 'free shipping', 'returns policy']
  const serviceTerms = ['our services', 'we provide', 'consultation', 'contact us', 'get a quote', 'free estimate', 'schedule', 'appointment']

  for (const t of b2bTerms) if (lower.includes(t)) scores['B2B']++
  for (const t of b2cTerms) if (lower.includes(t)) scores['B2C']++
  for (const t of saasTerms) if (lower.includes(t)) scores['SaaS']++
  for (const t of ecomTerms) if (lower.includes(t)) scores['E-commerce']++
  for (const t of serviceTerms) if (lower.includes(t)) scores['Services']++

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]
  return best[1] >= 2 ? best[0] : ''
}

function inferRegulatedIndustry(plainText: string): string {
  const lower = plainText.toLowerCase()
  const regulatedTerms = [
    'attorney', 'law firm', 'legal', 'litigation', 'court',
    'healthcare', 'medical', 'patient', 'hipaa', 'physician', 'clinic', 'hospital',
    'financial', 'banking', 'insurance', 'sec', 'fiduciary', 'investment', 'finra',
    'pharmaceutical', 'fda', 'compliance', 'regulatory',
    'licensed', 'accredited', 'board certified',
  ]
  const partialTerms = ['compliance', 'regulatory', 'licensed', 'accredited']

  const fullMatches = regulatedTerms.filter(t => lower.includes(t)).length
  const partialMatches = partialTerms.filter(t => lower.includes(t)).length

  if (fullMatches >= 3) return 'Yes'
  if (fullMatches >= 1 || partialMatches >= 2) return 'Partially'
  return ''
}

function extractBusinessName(rawHtml: string): string[] {
  const candidates: string[] = []

  // og:site_name
  const ogMatch = rawHtml.match(/<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i)
  if (ogMatch) candidates.push(ogMatch[1].trim())

  // <title> tag - take first segment before separator
  const titleMatch = rawHtml.match(/<title[^>]*>([^<]+)<\/title>/i)
  if (titleMatch) {
    const title = titleMatch[1].trim()
    const segment = title.split(/\s*[|\-–—:]\s*/)[0].trim()
    if (segment.length > 1 && segment.length < 60) candidates.push(segment)
  }

  // Schema name
  const schemaNameMatch = rawHtml.match(/"name"\s*:\s*"([^"]+)"/i)
  if (schemaNameMatch && schemaNameMatch[1].length < 60) {
    candidates.push(schemaNameMatch[1].trim())
  }

  return [...new Set(candidates)].slice(0, 3)
}

function extractCompetitors(plainText: string): string[] {
  const competitors: string[] = []
  const patterns = [
    /(?:vs\.?|versus|compared to|alternative to)\s+([A-Z][A-Za-z\s&]+?)(?:\.|,|\n|$)/gi,
    /(?:unlike|different from|switch from)\s+([A-Z][A-Za-z\s&]+?)(?:\.|,|\n|$)/gi,
  ]
  for (const pattern of patterns) {
    let match
    while ((match = pattern.exec(plainText)) !== null) {
      const name = match[1].trim()
      if (name.length > 2 && name.length < 40) competitors.push(name)
    }
  }
  return [...new Set(competitors)].slice(0, 5)
}

export function parseWebsiteContent(rawText: string, rawHtml?: string): ParseResult<WebsiteExtract> {
  if (!rawText.trim()) {
    return { success: false, errors: ['Website content is required'] }
  }

  const lower = rawText.toLowerCase()

  // Match against known business categories by checking if any appear in the page content
  const detectedCategories: string[] = []
  const lowerText = rawText.toLowerCase()
  for (const category of BUSINESS_CATEGORIES) {
    if (lowerText.includes(category.toLowerCase())) {
      detectedCategories.push(category)
    }
  }

  // Also try regex extraction as fallback, but filter to reasonable lengths
  if (detectedCategories.length === 0) {
    const categoryPatterns = [
      /(?:we are|we're) (?:a|an) ([a-zA-Z\s]{3,40}?)(?:\s+(?:company|firm|agency|provider|service|studio|shop|business|practice))(?:\.|,|\n)/gi,
      /(?:specializ(?:e|ing) in) ([a-zA-Z\s]{3,40}?)(?:\.|,|\n)/gi,
    ]
    for (const pattern of categoryPatterns) {
      let match
      while ((match = pattern.exec(rawText)) !== null) {
        const candidate = match[1].trim()
        // Only keep if it looks like a real category (not a location or generic phrase)
        if (candidate.length >= 5 && candidate.length <= 50 && !/^\d/.test(candidate)) {
          detectedCategories.push(candidate)
        }
      }
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

  // HTML-aware extractions (only when raw HTML is available)
  const html = rawHtml || ''
  const schema = extractSchemaMarkup(html)
  const faq = extractFaqContent(html, rawText)
  const reviews = extractReviewContent(rawText)
  const locations = extractLocations(html, rawText)
  const revenueModelIndicator = inferRevenueModel(rawText)
  const regulatedIndustryIndicator = inferRegulatedIndustry(rawText)
  const businessNameCandidates = html ? extractBusinessName(html) : []
  const detectedCompetitors = extractCompetitors(rawText)
  const hasComparisonContent = /(?:vs\.?|versus|compare|comparison|alternative)/i.test(rawText)

  const hasCertifications = presentSignals.some(s => ['certified', 'licensed', 'accredited', 'ISO'].includes(s))
  const hasAwards = presentSignals.some(s => ['award', 'recognized'].includes(s))
  const hasPartnerships = presentSignals.some(s => ['partnership', 'member of', 'affiliated'].includes(s))

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
      hasSchemaMarkup: schema.hasSchema,
      schemaTypes: schema.types,
      hasFaqContent: faq.hasFaq,
      faqCount: faq.count,
      hasReviewContent: reviews.hasReviews,
      reviewMentionCount: reviews.mentionCount,
      detectedLocations: locations.locations,
      hasLocalFocus: locations.isLocal,
      revenueModelIndicator,
      regulatedIndustryIndicator,
      hasCertifications,
      hasAwards,
      hasPartnerships,
      hasComparisonContent,
      detectedCompetitors,
      businessNameCandidates,
    },
    errors: [],
  }
}
