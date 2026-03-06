export interface AuthoritySnapshot {
  currentAuthoritySources: string[]
  industryDirectories: string[]
  mediaPresence: string[]
  partnerMentions: string[]
  certifications: string[]
  awards: string[]
  speakingEngagements: string[]
  publications: string[]
}

export interface CitationOpportunity {
  source: string
  type: 'directory' | 'media' | 'partner' | 'association' | 'publication' | 'community'
  effort: 'low' | 'medium' | 'high'
  expectedImpact: 'low' | 'medium' | 'high'
  action: string
}
