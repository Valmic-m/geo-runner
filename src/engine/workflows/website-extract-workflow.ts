import type { WebsiteAnalysis } from '@/engine/analyzers/website-analyzer'
import { parseWebsiteContent } from '@/engine/parsers/website-parser'
import type { WebsiteExtract } from '@/engine/parsers/website-parser'
import { analyzeWebsite } from '@/engine/analyzers/website-analyzer'
import { estimateSignals, estimateFocusTier, estimateBottleneck } from '@/engine/analyzers/signal-estimator'
import type { EstimatedSignals } from '@/engine/analyzers/signal-estimator'

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
  competitors: string[]
  businessNameCandidates: string[]
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
    competitors: extract.detectedCompetitors,
    businessNameCandidates: extract.businessNameCandidates,
  }
}
