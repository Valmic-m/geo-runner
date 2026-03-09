import type { Competitor } from '@/types/snapshot'

export function extractCompetitorName(url: string): string {
  try {
    const hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname
    const domain = hostname.replace(/^www\./, '')
    const name = domain.split('.')[0]
    return name
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  } catch {
    return url
  }
}

export function formatCompetitorDisplay(competitor: Competitor): string {
  if (competitor.url) {
    return `${competitor.name} (${competitor.url})`
  }
  return competitor.name
}

export function migrateCompetitors(competitors: unknown[]): Competitor[] {
  return competitors.map((c) => {
    if (typeof c === 'string') {
      return { url: '', name: c }
    }
    if (c && typeof c === 'object' && 'name' in c) {
      return c as Competitor
    }
    return { url: '', name: String(c) }
  })
}
