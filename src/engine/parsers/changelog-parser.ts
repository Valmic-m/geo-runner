import type { MonthlyChangeLog } from '@/types/changelog'
import type { ParseResult } from '@/types/common'

export const CHANGELOG_TEMPLATE = `MONTHLY CHANGE LOG

New services/products:
New locations:
Messaging changes:
Pricing changes:
Compliance updates:
Campaigns launched:
Priority revenue focus:

END LOG`

function extractField(text: string, ...labels: string[]): string {
  for (const label of labels) {
    const regex = new RegExp(`${label}\\s*[:\\-=]\\s*(.+)`, 'i')
    const match = text.match(regex)
    if (match) return match[1].trim()
  }
  return ''
}

export function parseChangelog(rawText: string): ParseResult<MonthlyChangeLog> {
  const log: MonthlyChangeLog = {
    newServicesProducts: extractField(rawText, 'new services/products', 'new services', 'new products'),
    newLocations: extractField(rawText, 'new locations'),
    messagingChanges: extractField(rawText, 'messaging changes'),
    pricingChanges: extractField(rawText, 'pricing changes'),
    complianceUpdates: extractField(rawText, 'compliance updates'),
    campaignsLaunched: extractField(rawText, 'campaigns launched'),
    priorityRevenueFocus: extractField(rawText, 'priority revenue focus'),
  }

  return { success: true, data: log, errors: [] }
}
