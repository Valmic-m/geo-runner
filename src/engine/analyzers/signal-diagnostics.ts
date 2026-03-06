import type { SignalScores, SignalKey } from '@/types/snapshot'
import type { SignalDiagnostic } from '@/types/recommendations'
import { SIGNAL_DEFINITIONS } from '@/engine/constants/signal-definitions'

function getStatus(score: number): SignalDiagnostic['status'] {
  if (score <= 1) return 'critical'
  if (score <= 2) return 'weak'
  if (score <= 3) return 'moderate'
  return 'strong'
}

function getRecommendation(key: SignalKey, score: number): string {
  const recs: Record<string, Record<string, string>> = {
    entityClarity: {
      critical: 'Urgent: Create a clear entity definition block. AI models cannot identify this brand.',
      weak: 'Create and deploy an entity definition across homepage and about page.',
      moderate: 'Refine entity description for consistency across all pages.',
    },
    brandMentions: {
      critical: 'No brand presence detected. Begin external mention campaign immediately.',
      weak: 'Increase brand mentions through guest articles and directory listings.',
      moderate: 'Expand brand mention diversity across new source types.',
    },
    comparisonPresence: {
      critical: 'Brand is invisible in comparison contexts. Create comparison content urgently.',
      weak: 'Publish comparison pages and "alternatives to" content.',
      moderate: 'Expand comparison presence to cover more competitor contexts.',
    },
    faqCoverage: {
      critical: 'No FAQ content found. Create comprehensive FAQ set immediately.',
      weak: 'Expand FAQ coverage to address common category queries.',
      moderate: 'Add deeper, more specific FAQ content for niche queries.',
    },
    structuredData: {
      critical: 'No structured data detected. Implement Organization schema immediately.',
      weak: 'Add schema markup for services, FAQ, and reviews.',
      moderate: 'Enhance schema with additional entity relationships.',
    },
    reviews: {
      critical: 'Insufficient reviews. Launch review acquisition campaign.',
      weak: 'Increase review volume and platform diversity.',
      moderate: 'Focus on review quality and response consistency.',
    },
    authoritySignals: {
      critical: 'No authority indicators. Publish thought leadership content urgently.',
      weak: 'Build authority through educational content and industry articles.',
      moderate: 'Deepen authority with case studies and original research.',
    },
    citations: {
      critical: 'No third-party citations. Begin outreach for external mentions.',
      weak: 'Increase citation diversity through directory and media outreach.',
      moderate: 'Target higher-authority citation sources.',
    },
    gbpCompleteness: {
      critical: 'GBP incomplete or missing. Set up and optimize immediately.',
      weak: 'Complete all GBP fields and add Q&A content.',
      moderate: 'Optimize GBP with posts, photos, and regular updates.',
    },
    knowledgeGraphSignals: {
      critical: 'No knowledge graph presence. Establish entity connections.',
      weak: 'Strengthen entity relationships through consistent structured data.',
      moderate: 'Expand knowledge graph connections to related entities.',
    },
    messagingConsistency: {
      critical: 'Messaging is inconsistent. Align all touchpoints immediately.',
      weak: 'Standardize core messaging across website and profiles.',
      moderate: 'Fine-tune messaging consistency across external mentions.',
    },
    credibilitySignals: {
      critical: 'No credibility indicators found. Add certifications and trust signals.',
      weak: 'Expand credibility signals with awards, endorsements, or certifications.',
      moderate: 'Highlight existing credibility signals more prominently.',
    },
  }

  const status = getStatus(score)
  if (status === 'strong') return 'Signal is strong. Maintain current efforts.'
  return recs[key]?.[status] ?? 'Improve this signal to strengthen AI recommendation probability.'
}

export function analyzeSignals(signals: SignalScores): SignalDiagnostic[] {
  return SIGNAL_DEFINITIONS.map((def) => {
    const score = signals[def.key]
    return {
      signal: def.key,
      score,
      label: def.label,
      status: getStatus(score),
      recommendation: getRecommendation(def.key, score),
    }
  }).sort((a, b) => a.score - b.score)
}
