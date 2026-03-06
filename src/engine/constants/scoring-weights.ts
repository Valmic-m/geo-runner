import type { SignalKey } from '@/types/snapshot'

export const READINESS_WEIGHTS: Record<SignalKey, number> = {
  entityClarity: 0.15,
  brandMentions: 0.08,
  comparisonPresence: 0.10,
  faqCoverage: 0.10,
  structuredData: 0.08,
  reviews: 0.08,
  authoritySignals: 0.12,
  citations: 0.10,
  gbpCompleteness: 0.05,
  knowledgeGraphSignals: 0.05,
  messagingConsistency: 0.04,
  credibilitySignals: 0.05,
}
