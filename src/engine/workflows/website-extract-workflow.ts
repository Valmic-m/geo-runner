import type { WebsiteAnalysis } from '@/engine/analyzers/website-analyzer'
import { parseWebsiteContent } from '@/engine/parsers/website-parser'
import type { WebsiteExtract } from '@/engine/parsers/website-parser'
import { analyzeWebsite } from '@/engine/analyzers/website-analyzer'
import { estimateSignals, estimateFocusTier, estimateBottleneck } from '@/engine/analyzers/signal-estimator'
import type { EstimatedSignals } from '@/engine/analyzers/signal-estimator'
import type { Competitor } from '@/types/snapshot'
import type { EnhancedExtractResult } from '@/lib/fetch-url'

export interface WebsiteExtractInput {
  websiteContent: string
  rawHtml?: string
}

export interface WebsiteExtractOutput {
  extract: WebsiteExtract
  analysis: WebsiteAnalysis
  estimatedSignals: EstimatedSignals
  estimatedFocusTier: string
  estimatedBottleneck: string
  geoScope: string
  revenueModel: string
  regulated: string
  competitors: Competitor[]
  businessNameCandidates: string[]
  // Enhanced extraction fields (optional)
  discoveredCompetitors?: Competitor[]
  llmConfidence?: Record<string, string>
  extractionSource?: 'enhanced' | 'basic'
  location?: string
}

export function runWebsiteExtractWorkflow(input: WebsiteExtractInput): WebsiteExtractOutput {
  const parseResult = parseWebsiteContent(input.websiteContent, input.rawHtml)
  if (!parseResult.data) {
    throw new Error(`Failed to parse website content: ${parseResult.errors.join(', ')}`)
  }

  const extract = parseResult.data
  const estimated = estimateSignals(extract)

  return {
    extract,
    analysis: analyzeWebsite(extract),
    estimatedSignals: estimated,
    estimatedFocusTier: estimateFocusTier(estimated),
    estimatedBottleneck: estimateBottleneck(estimated),
    geoScope: extract.hasLocalFocus ? 'Local' : '',
    revenueModel: extract.revenueModelIndicator,
    regulated: extract.regulatedIndustryIndicator,
    competitors: extract.detectedCompetitors.map((name) => ({ url: '', name })),
    businessNameCandidates: extract.businessNameCandidates,
    extractionSource: 'basic',
  }
}

/**
 * Enhanced workflow: merges LLM analysis with regex parsing.
 * LLM results take priority for business info fields;
 * regex parsing still provides schema/content depth analysis.
 */
export function runEnhancedWebsiteExtractWorkflow(
  enhanced: EnhancedExtractResult,
): WebsiteExtractOutput {
  // Run the existing regex parser for schema/content depth data
  const plainText = enhanced.markdown || ''
  const parseResult = parseWebsiteContent(plainText, enhanced.rawHtml || undefined)

  // Build a minimal extract even if parsing fails
  const extract = parseResult.data || ({
    rawContent: plainText,
    detectedCategories: [],
    detectedAudience: [],
    differentiators: [],
    missingTrustSignals: [],
    detectedServices: [],
    tone: 'unknown',
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
    schemaCompleteness: { score: 0, hasOrganization: false, hasLocalBusiness: false, hasFaqPage: false, hasService: false, hasReview: false, missingFields: [] },
    contentDepth: { totalWordCount: 0, headingCount: 0, headingHierarchyValid: false, internalLinkCount: 0, imageCount: 0, imagesWithAlt: 0, altTextCoverage: 0 },
    socialProfiles: [],
  } as WebsiteExtract)

  const llm = enhanced.llmAnalysis

  // Merge LLM-detected categories into the extract so downstream analysis uses them
  if (llm?.primaryCategory) {
    const llmCategories = [llm.primaryCategory, llm.secondaryCategory].filter(Boolean)
    // Prepend LLM categories, dedup with regex categories
    const regexCats = extract.detectedCategories.filter((c) => !llmCategories.includes(c))
    extract.detectedCategories = [...llmCategories, ...regexCats]
  }
  if (llm?.audience) {
    extract.detectedAudience = [llm.audience, ...extract.detectedAudience.filter((a) => a !== llm.audience)]
  }
  if (llm?.businessName && !extract.businessNameCandidates.includes(llm.businessName)) {
    extract.businessNameCandidates = [llm.businessName, ...extract.businessNameCandidates]
  }

  const estimated = estimateSignals(extract)
  const businessName = extract.businessNameCandidates[0] || ''

  // Build discovered competitors from Google CSE results
  const discoveredCompetitors: Competitor[] = (enhanced.discoveredCompetitors || []).map((c) => ({
    url: c.url,
    name: c.name,
    description: c.snippet,
  }))

  // Regex-detected competitors (from page content)
  const regexCompetitors: Competitor[] = extract.detectedCompetitors.map((name) => ({
    url: '',
    name,
  }))

  return {
    extract,
    analysis: analyzeWebsite(extract),
    estimatedSignals: estimated,
    estimatedFocusTier: estimateFocusTier(estimated),
    estimatedBottleneck: estimateBottleneck(estimated),
    geoScope: llm?.geoScope || (extract.hasLocalFocus ? 'Local' : ''),
    revenueModel: llm?.revenueModel || extract.revenueModelIndicator,
    regulated: llm?.regulated || extract.regulatedIndustryIndicator,
    competitors: regexCompetitors,
    businessNameCandidates: businessName ? [businessName, ...extract.businessNameCandidates.filter((n) => n !== businessName)] : extract.businessNameCandidates,
    discoveredCompetitors,
    llmConfidence: llm?.confidence || undefined,
    extractionSource: 'enhanced',
    location: llm?.location || undefined,
  }
}
