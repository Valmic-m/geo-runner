export interface SignalScores {
  entityClarity: number
  brandMentions: number
  comparisonPresence: number
  faqCoverage: number
  structuredData: number
  reviews: number
  authoritySignals: number
  citations: number
  gbpCompleteness: number
  knowledgeGraphSignals: number
  messagingConsistency: number
  credibilitySignals: number
}

export type SignalKey = keyof SignalScores

export interface PlatformVisibility {
  chatgpt: number
  claude: number
  gemini: number
  perplexity: number
  aiOverviews: number
}

export type PlatformKey = keyof PlatformVisibility

export interface Competitor {
  url: string
  name: string
  category?: string
  description?: string
}

export interface ClientGeoSnapshot {
  businessName: string
  primaryCategory: string
  secondaryCategory: string
  audience: string
  geoScope: string
  revenueModel: string
  regulated: string
  competitors: Competitor[]
  signals: SignalScores
  platformVisibility: PlatformVisibility
  competitorDominance: number
  focusTier: string
  primaryBottleneck: string
  notes: string
  assessmentAnswers?: import('./assessment').AssessmentAnswer[]
}
