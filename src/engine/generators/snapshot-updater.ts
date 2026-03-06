import type { ClientGeoSnapshot } from '@/types/snapshot'

export function formatSnapshot(snapshot: ClientGeoSnapshot): string {
  return `CLIENT GEO SNAPSHOT

Business name: ${snapshot.businessName}
Primary category label: ${snapshot.primaryCategory}
Secondary category: ${snapshot.secondaryCategory}
Audience: ${snapshot.audience}
Geo scope: ${snapshot.geoScope}
Revenue model: ${snapshot.revenueModel}
Regulated: ${snapshot.regulated}

Competitors: ${snapshot.competitors.join(', ')}

Scores (1-5)

Entity clarity: ${snapshot.signals.entityClarity}
Brand mentions: ${snapshot.signals.brandMentions}
Comparison presence: ${snapshot.signals.comparisonPresence}
FAQ coverage: ${snapshot.signals.faqCoverage}
Structured data: ${snapshot.signals.structuredData}
Reviews: ${snapshot.signals.reviews}
Authority signals: ${snapshot.signals.authoritySignals}
Citations: ${snapshot.signals.citations}
GBP completeness: ${snapshot.signals.gbpCompleteness}
Knowledge graph signals: ${snapshot.signals.knowledgeGraphSignals}
Messaging consistency: ${snapshot.signals.messagingConsistency}
Credibility signals: ${snapshot.signals.credibilitySignals}

AI Visibility

ChatGPT inclusion %: ${snapshot.platformVisibility.chatgpt}
Gemini inclusion %: ${snapshot.platformVisibility.gemini}
Claude inclusion %: ${snapshot.platformVisibility.claude}

Competitor dominance %: ${snapshot.competitorDominance}

Focus tier: ${snapshot.focusTier}
Primary bottleneck: ${snapshot.primaryBottleneck}
Notes: ${snapshot.notes}

END SNAPSHOT`
}
