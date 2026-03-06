import type { WebsiteExtract } from '@/engine/parsers/website-parser'

export interface WebsiteAnalysis {
  categories: string[]
  audience: string[]
  differentiators: string[]
  missingTrustSignals: string[]
  services: string[]
  tone: string
  recommendations: string[]
  schemaTypes: string[]
  hasFaqContent: boolean
  faqCount: number
  hasReviewContent: boolean
  detectedLocations: string[]
  revenueModelIndicator: string
  regulatedIndicator: string
}

export function analyzeWebsite(extract: WebsiteExtract): WebsiteAnalysis {
  const recommendations: string[] = []

  if (extract.detectedCategories.length === 0) {
    recommendations.push('No clear category positioning detected. Add explicit category statements (e.g., "We are a [category] company").')
  }
  if (extract.detectedAudience.length === 0) {
    recommendations.push('Target audience is unclear. Add explicit audience statements (e.g., "We serve [audience]").')
  }
  if (extract.differentiators.length === 0) {
    recommendations.push('No differentiators detected. Add unique value propositions to distinguish from competitors.')
  }
  if (extract.missingTrustSignals.length > 3) {
    recommendations.push('Multiple trust signals are missing. Prioritize adding certifications, testimonials, and case studies.')
  }
  if (extract.tone === 'heavily promotional') {
    recommendations.push('Content tone is heavily promotional. AI models prefer neutral, informative content. Reduce superlatives and add factual claims.')
  }
  if (extract.detectedServices.length === 0) {
    recommendations.push('Services are not clearly listed. Add structured service descriptions.')
  }

  if (!extract.hasSchemaMarkup) {
    recommendations.push('No JSON-LD schema markup found. Add Organization, LocalBusiness, and FAQPage schemas to improve AI model understanding.')
  } else if (!extract.schemaTypes.includes('Organization') && !extract.schemaTypes.includes('LocalBusiness')) {
    recommendations.push('Schema markup found but missing Organization/LocalBusiness type. Add these core schema types for better entity recognition.')
  }

  if (!extract.hasFaqContent) {
    recommendations.push('No FAQ content detected. Create a comprehensive FAQ section with 10-15 questions to improve AI answer coverage.')
  } else if (extract.faqCount < 5) {
    recommendations.push(`Only ${extract.faqCount} FAQ items detected. Expand to at least 10-15 questions for better coverage.`)
  }

  if (!extract.hasReviewContent) {
    recommendations.push('No testimonials or review content on the website. Add a testimonials section or link to review platforms.')
  }

  if (extract.hasLocalFocus && extract.detectedLocations.length > 0 && !extract.schemaTypes.includes('LocalBusiness')) {
    recommendations.push('Local business detected but no LocalBusiness schema. Add LocalBusiness structured data with address and service area.')
  }

  return {
    categories: extract.detectedCategories,
    audience: extract.detectedAudience,
    differentiators: extract.differentiators,
    missingTrustSignals: extract.missingTrustSignals,
    services: extract.detectedServices,
    tone: extract.tone,
    recommendations,
    schemaTypes: extract.schemaTypes,
    hasFaqContent: extract.hasFaqContent,
    faqCount: extract.faqCount,
    hasReviewContent: extract.hasReviewContent,
    detectedLocations: extract.detectedLocations,
    revenueModelIndicator: extract.revenueModelIndicator,
    regulatedIndicator: extract.regulatedIndustryIndicator,
  }
}
