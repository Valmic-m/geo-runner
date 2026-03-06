import type { WebsiteExtract } from '@/engine/parsers/website-parser'

export interface WebsiteAnalysis {
  categories: string[]
  audience: string[]
  differentiators: string[]
  missingTrustSignals: string[]
  services: string[]
  tone: string
  recommendations: string[]
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

  return {
    categories: extract.detectedCategories,
    audience: extract.detectedAudience,
    differentiators: extract.differentiators,
    missingTrustSignals: extract.missingTrustSignals,
    services: extract.detectedServices,
    tone: extract.tone,
    recommendations,
  }
}
