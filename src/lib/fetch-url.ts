export interface FetchedContent {
  rawHtml: string
  plainText: string
}

// ─── Enhanced extraction types ──────────────────────────────────────

export interface LLMBusinessAnalysis {
  businessName: string
  primaryCategory: string
  secondaryCategory: string
  audience: string
  geoScope: string
  revenueModel: string
  regulated: string
  services: string[]
  differentiators: string[]
  location: string
  confidence: Record<string, 'high' | 'medium' | 'low'>
}

export interface DiscoveredCompetitor {
  name: string
  url: string
  snippet: string
  domain: string
}

export interface EnhancedExtractResult {
  markdown: string
  rawHtml: string
  llmAnalysis: LLMBusinessAnalysis | null
  discoveredCompetitors: DiscoveredCompetitor[]
  source: 'jina' | 'fallback' | 'enhanced'
}

export async function fetchUrlContent(url: string): Promise<FetchedContent> {
  const response = await fetch(`/api/fetch-url?url=${encodeURIComponent(url)}`)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch URL' }))
    throw new Error(error.error || `Failed to fetch URL: ${response.status}`)
  }

  const rawHtml = await response.text()
  return {
    rawHtml,
    plainText: stripHtmlToText(rawHtml),
  }
}

// ─── Enhanced extraction (Jina + OpenAI + Google CSE) ───────────────

export async function fetchEnhancedExtract(url: string): Promise<EnhancedExtractResult> {
  const response = await fetch('/api/extract-enhanced', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Enhanced extraction failed' }))
    throw new Error(error.error || `Enhanced extraction failed: ${response.status}`)
  }

  return response.json()
}

function stripHtmlToText(html: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  // Remove non-content elements
  const removeSelectors = ['script', 'style', 'nav', 'footer', 'header', 'noscript', 'svg', 'iframe']
  for (const selector of removeSelectors) {
    doc.querySelectorAll(selector).forEach((el) => el.remove())
  }

  const text = doc.body?.textContent || ''

  // Collapse whitespace and clean up
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim()
}
