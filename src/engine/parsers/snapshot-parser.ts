import type { ClientGeoSnapshot, SignalScores, PlatformVisibility } from '@/types/snapshot'
import type { ParseResult } from '@/types/common'

function extractField(text: string, ...labels: string[]): string {
  for (const label of labels) {
    const regex = new RegExp(`${label}\\s*[:\\-=]\\s*(.+)`, 'i')
    const match = text.match(regex)
    if (match) return match[1].trim()
  }
  return ''
}

function extractNumber(text: string, ...labels: string[]): number {
  const value = extractField(text, ...labels)
  const num = parseFloat(value.replace('%', ''))
  return isNaN(num) ? 0 : num
}

function extractList(text: string, label: string): string[] {
  const regex = new RegExp(`${label}\\s*[:\\-=]\\s*(.+)`, 'i')
  const match = text.match(regex)
  if (!match) return []
  return match[1]
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export function parseSnapshot(rawText: string): ParseResult<ClientGeoSnapshot> {
  const errors: string[] = []

  const businessName = extractField(rawText, 'business name', 'company name', 'client name')
  if (!businessName) errors.push('Business name is required')

  const primaryCategory = extractField(rawText, 'primary category label', 'primary category')
  if (!primaryCategory) errors.push('Primary category is required')

  const signals: SignalScores = {
    entityClarity: extractNumber(rawText, 'entity clarity'),
    brandMentions: extractNumber(rawText, 'brand mentions'),
    comparisonPresence: extractNumber(rawText, 'comparison presence'),
    faqCoverage: extractNumber(rawText, 'faq coverage'),
    structuredData: extractNumber(rawText, 'structured data'),
    reviews: extractNumber(rawText, 'reviews'),
    authoritySignals: extractNumber(rawText, 'authority signals'),
    citations: extractNumber(rawText, 'citations'),
    gbpCompleteness: extractNumber(rawText, 'gbp completeness'),
    knowledgeGraphSignals: extractNumber(rawText, 'knowledge graph signals'),
    messagingConsistency: extractNumber(rawText, 'messaging consistency'),
    credibilitySignals: extractNumber(rawText, 'credibility signals'),
  }

  const platformVisibility: PlatformVisibility = {
    chatgpt: extractNumber(rawText, 'chatgpt inclusion', 'chatgpt'),
    gemini: extractNumber(rawText, 'gemini inclusion', 'gemini'),
    claude: extractNumber(rawText, 'claude inclusion', 'claude'),
  }

  const snapshot: ClientGeoSnapshot = {
    businessName,
    primaryCategory,
    secondaryCategory: extractField(rawText, 'secondary category'),
    audience: extractField(rawText, 'audience', 'target audience'),
    geoScope: extractField(rawText, 'geo scope', 'geographic scope', 'geography'),
    revenueModel: extractField(rawText, 'revenue model'),
    regulated: extractField(rawText, 'regulated'),
    competitors: extractList(rawText, 'competitors'),
    signals,
    platformVisibility,
    competitorDominance: extractNumber(rawText, 'competitor dominance'),
    focusTier: extractField(rawText, 'focus tier'),
    primaryBottleneck: extractField(rawText, 'primary bottleneck'),
    notes: extractField(rawText, 'notes'),
  }

  if (errors.length > 0) {
    return { success: false, data: snapshot, errors }
  }

  return { success: true, data: snapshot, errors: [] }
}
