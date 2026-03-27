/**
 * Google Custom Search API client for competitor discovery.
 * Free tier: 100 queries/day (~3000/month).
 */

export interface DiscoveredCompetitor {
  name: string
  url: string
  snippet: string
  domain: string
}

interface GoogleSearchItem {
  title: string
  link: string
  snippet: string
  displayLink: string
}

interface GoogleSearchResponse {
  items?: GoogleSearchItem[]
}

export async function discoverCompetitors(
  businessName: string,
  category: string,
  location?: string,
  businessUrl?: string,
): Promise<DiscoveredCompetitor[]> {
  const apiKey = process.env.GOOGLE_CSE_API_KEY
  const cseId = process.env.GOOGLE_CSE_ID

  if (!apiKey || !cseId) {
    throw new Error('GOOGLE_CSE_API_KEY or GOOGLE_CSE_ID not set in environment')
  }

  // Build search queries
  const queries: string[] = []

  if (location) {
    queries.push(`best ${category} in ${location}`)
    queries.push(`${category} companies ${location}`)
  } else {
    queries.push(`top ${category} companies`)
    queries.push(`${businessName} alternatives`)
  }

  // Extract business domain for filtering
  let businessDomain = ''
  if (businessUrl) {
    try {
      businessDomain = new URL(businessUrl).hostname.replace(/^www\./, '')
    } catch { /* ignore */ }
  }

  // Run searches and collect results
  const allResults: DiscoveredCompetitor[] = []
  const seenDomains = new Set<string>()

  // Always exclude the business's own domain
  if (businessDomain) {
    seenDomains.add(businessDomain)
  }

  for (const query of queries) {
    try {
      const params = new URLSearchParams({
        key: apiKey,
        cx: cseId,
        q: query,
        num: '5',
      })

      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?${params}`,
      )

      if (!response.ok) {
        console.warn(`Google CSE query "${query}" failed: ${response.status}`)
        continue
      }

      const data = (await response.json()) as GoogleSearchResponse

      for (const item of data.items || []) {
        const domain = item.displayLink.replace(/^www\./, '')

        // Skip duplicates, the business itself, and generic aggregator sites
        if (seenDomains.has(domain)) continue
        if (isAggregatorDomain(domain)) continue

        seenDomains.add(domain)
        allResults.push({
          name: extractCompanyName(item.title, domain),
          url: item.link,
          snippet: item.snippet || '',
          domain,
        })
      }
    } catch (err) {
      console.warn(`Google CSE search failed for "${query}":`, err)
    }
  }

  // Return top 5 unique competitors
  return allResults.slice(0, 5)
}

/**
 * Extract a clean company name from a search result title.
 * Strips common suffixes like " - Home", " | Official Site", etc.
 */
function extractCompanyName(title: string, domain: string): string {
  // Remove common title suffixes
  const cleaned = title
    .replace(/\s*[-|]\s*(Home|Homepage|Official Site|Official Website|Welcome).*$/i, '')
    .replace(/\s*[-|]\s*[^-|]+$/, '') // Remove last segment after - or |
    .trim()

  if (cleaned.length > 2) return cleaned

  // Fallback: capitalize domain
  return domain
    .replace(/\.(com|net|org|io|co)$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * Filter out directory/aggregator domains that aren't real competitors.
 */
function isAggregatorDomain(domain: string): boolean {
  const aggregators = [
    'yelp.com', 'yellowpages.com', 'bbb.org', 'facebook.com',
    'instagram.com', 'linkedin.com', 'twitter.com', 'x.com',
    'tiktok.com', 'youtube.com', 'reddit.com', 'quora.com',
    'wikipedia.org', 'indeed.com', 'glassdoor.com', 'crunchbase.com',
    'angi.com', 'angieslist.com', 'homeadvisor.com', 'thumbtack.com',
    'nextdoor.com', 'mapquest.com', 'manta.com', 'chamberofcommerce.com',
    'g2.com', 'capterra.com', 'trustpilot.com', 'sitejabber.com',
    'google.com', 'apple.com', 'amazon.com', 'microsoft.com',
  ]
  return aggregators.some((a) => domain.endsWith(a))
}
