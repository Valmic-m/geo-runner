import type { WebsiteAnalysis } from '@/engine/analyzers/website-analyzer'
import { parseWebsiteContent } from '@/engine/parsers/website-parser'
import { analyzeWebsite } from '@/engine/analyzers/website-analyzer'

export interface WebsiteExtractInput {
  websiteContent: string
}

export interface WebsiteExtractOutput {
  analysis: WebsiteAnalysis
}

export function runWebsiteExtractWorkflow(input: WebsiteExtractInput): WebsiteExtractOutput {
  const parseResult = parseWebsiteContent(input.websiteContent)
  if (!parseResult.data) {
    throw new Error(`Failed to parse website content: ${parseResult.errors.join(', ')}`)
  }

  return {
    analysis: analyzeWebsite(parseResult.data),
  }
}
