import type { AuthoritySnapshot } from '@/types/authority'
import type { ParseResult } from '@/types/common'

function extractList(text: string, ...labels: string[]): string[] {
  for (const label of labels) {
    const regex = new RegExp(`${label}\\s*[:\\-=]\\s*(.+)`, 'i')
    const match = text.match(regex)
    if (match) {
      return match[1]
        .split(/[,;]/)
        .map((s) => s.trim())
        .filter(Boolean)
    }
  }
  return []
}

export function parseAuthoritySnapshot(rawText: string): ParseResult<AuthoritySnapshot> {
  const snapshot: AuthoritySnapshot = {
    currentAuthoritySources: extractList(rawText, 'current authority sources', 'authority sources'),
    industryDirectories: extractList(rawText, 'industry directories', 'directories'),
    mediaPresence: extractList(rawText, 'media presence', 'media'),
    partnerMentions: extractList(rawText, 'partner mentions', 'partners'),
    certifications: extractList(rawText, 'certifications'),
    awards: extractList(rawText, 'awards'),
    speakingEngagements: extractList(rawText, 'speaking engagements', 'speaking'),
    publications: extractList(rawText, 'publications'),
  }

  return { success: true, data: snapshot, errors: [] }
}
