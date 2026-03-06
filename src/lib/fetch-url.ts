export async function fetchUrlContent(url: string): Promise<string> {
  const response = await fetch(`/api/fetch-url?url=${encodeURIComponent(url)}`)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch URL' }))
    throw new Error(error.error || `Failed to fetch URL: ${response.status}`)
  }

  const html = await response.text()
  return stripHtmlToText(html)
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
