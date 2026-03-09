export interface FetchedContent {
  rawHtml: string
  plainText: string
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
