/**
 * Jina Reader client — converts any URL to clean markdown.
 * Free, no API key needed. Handles JS-rendered sites.
 * https://jina.ai/reader/
 */

export interface JinaScrapeResult {
  markdown: string
  title: string
  source: 'jina' | 'fallback'
}

export async function scrapeUrl(url: string): Promise<JinaScrapeResult> {
  try {
    const response = await fetch(`https://r.jina.ai/${url}`, {
      headers: {
        Accept: 'application/json',
        'X-Return-Format': 'markdown',
      },
    })

    if (!response.ok) {
      throw new Error(`Jina returned ${response.status}`)
    }

    const data = await response.json() as { data?: { content?: string; title?: string } }
    const markdown = data?.data?.content || ''
    const title = data?.data?.title || ''

    if (!markdown.trim()) {
      throw new Error('Jina returned empty content')
    }

    return { markdown, title, source: 'jina' }
  } catch (err) {
    console.warn(`Jina Reader failed for ${url}, falling back to raw fetch:`, err)
    return fallbackFetch(url)
  }
}

async function fallbackFetch(url: string): Promise<JinaScrapeResult> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; GEORunner/1.0)',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`)
  }

  const html = await response.text()

  // Basic HTML to text conversion (server-side)
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  // Extract title from HTML
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  const title = titleMatch?.[1]?.trim() || ''

  return { markdown: text, title, source: 'fallback' }
}
