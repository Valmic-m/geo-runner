import type { SignalKey, SignalScores } from '@/types/snapshot'
import type { WebsiteExtract } from '@/engine/parsers/website-parser'

export type SignalConfidence = 'high' | 'medium' | 'low' | 'unknown'

export interface EstimatedSignal {
  score: number
  confidence: SignalConfidence
  reason: string
}

export type EstimatedSignals = Record<SignalKey, EstimatedSignal>

export function estimateSignals(extract: WebsiteExtract): EstimatedSignals {
  return {
    entityClarity: estimateEntityClarity(extract),
    brandMentions: estimateBrandMentions(),
    comparisonPresence: estimateComparisonPresence(extract),
    faqCoverage: estimateFaqCoverage(extract),
    structuredData: estimateStructuredData(extract),
    reviews: estimateReviews(extract),
    authoritySignals: estimateAuthoritySignals(extract),
    citations: estimateCitations(),
    gbpCompleteness: estimateGbpCompleteness(extract),
    knowledgeGraphSignals: estimateKnowledgeGraph(extract),
    messagingConsistency: estimateMessagingConsistency(),
    credibilitySignals: estimateCredibilitySignals(extract),
  }
}

function estimateEntityClarity(extract: WebsiteExtract): EstimatedSignal {
  let score = 1
  const reasons: string[] = []

  if (extract.detectedCategories.length > 0) {
    score += 1
    reasons.push(`${extract.detectedCategories.length} category statement(s)`)
  }
  if (extract.hasSchemaMarkup && extract.schemaTypes.includes('Organization')) {
    score += 1
    reasons.push('Organization schema present')
  }
  if (extract.businessNameCandidates.length > 0) {
    score += 1
    reasons.push('Business name found in metadata')
  }
  if (extract.detectedServices.length > 0) {
    score += 1
    reasons.push('Services clearly listed')
  }

  return {
    score: Math.min(score, 5),
    confidence: 'high',
    reason: reasons.length > 0 ? reasons.join('; ') : 'No clear entity definition found on page',
  }
}

function estimateBrandMentions(): EstimatedSignal {
  return {
    score: 2,
    confidence: 'unknown',
    reason: 'Requires checking external sources — not detectable from website alone',
  }
}

function estimateComparisonPresence(extract: WebsiteExtract): EstimatedSignal {
  if (extract.hasComparisonContent) {
    return {
      score: 3,
      confidence: 'medium',
      reason: 'Comparison content found on website',
    }
  }
  return {
    score: 1,
    confidence: 'unknown',
    reason: 'No comparison content on site; external comparison presence unknown',
  }
}

function estimateFaqCoverage(extract: WebsiteExtract): EstimatedSignal {
  if (!extract.hasFaqContent) {
    return { score: 1, confidence: 'high', reason: 'No FAQ content detected' }
  }
  const count = extract.faqCount
  let score = 2
  if (count >= 4) score = 3
  if (count >= 9) score = 4
  if (count >= 16) score = 5
  return {
    score,
    confidence: 'high',
    reason: `${count} FAQ item(s) detected`,
  }
}

function estimateStructuredData(extract: WebsiteExtract): EstimatedSignal {
  if (!extract.hasSchemaMarkup) {
    return { score: 1, confidence: 'high', reason: 'No JSON-LD schema markup found' }
  }
  const count = extract.schemaTypes.length
  let score = 2
  if (count >= 2) score = 3
  if (count >= 4) score = 4
  if (count >= 6) score = 5
  return {
    score,
    confidence: 'high',
    reason: `Schema types found: ${extract.schemaTypes.join(', ')}`,
  }
}

function estimateReviews(extract: WebsiteExtract): EstimatedSignal {
  if (!extract.hasReviewContent) {
    return { score: 1, confidence: 'medium', reason: 'No review or testimonial content detected' }
  }
  const count = extract.reviewMentionCount
  let score = 2
  if (count >= 3) score = 3
  if (count >= 6) score = 4
  return {
    score,
    confidence: 'medium',
    reason: `${count} review/testimonial reference(s) on site; external review volume unknown`,
  }
}

function estimateAuthoritySignals(extract: WebsiteExtract): EstimatedSignal {
  let score = 1
  const reasons: string[] = []

  if (extract.hasCertifications) { score++; reasons.push('certifications') }
  if (extract.hasAwards) { score++; reasons.push('awards') }
  if (extract.hasPartnerships) { score++; reasons.push('partnerships') }
  if (extract.differentiators.length >= 3) { score++; reasons.push('multiple differentiators') }

  return {
    score: Math.min(score, 5),
    confidence: 'medium',
    reason: reasons.length > 0 ? `Detected: ${reasons.join(', ')}` : 'No authority signals detected on site',
  }
}

function estimateCitations(): EstimatedSignal {
  return {
    score: 1,
    confidence: 'unknown',
    reason: 'Requires checking external sources — not detectable from website alone',
  }
}

function estimateGbpCompleteness(extract: WebsiteExtract): EstimatedSignal {
  if (extract.hasLocalFocus) {
    return {
      score: 2,
      confidence: 'unknown',
      reason: 'Local business detected; GBP completeness requires manual verification',
    }
  }
  return {
    score: 2,
    confidence: 'unknown',
    reason: 'GBP completeness requires manual verification on Google',
  }
}

function estimateKnowledgeGraph(extract: WebsiteExtract): EstimatedSignal {
  let score = 1
  const reasons: string[] = []

  if (extract.hasSchemaMarkup) { score++; reasons.push('has schema markup') }
  if (extract.schemaTypes.includes('Organization') || extract.schemaTypes.includes('LocalBusiness')) {
    score++
    reasons.push('Organization/LocalBusiness schema')
  }

  return {
    score: Math.min(score, 5),
    confidence: 'low',
    reason: reasons.length > 0
      ? `${reasons.join('; ')}; actual Knowledge Graph presence requires manual check`
      : 'No Knowledge Graph signals detected; requires manual verification',
  }
}

function estimateMessagingConsistency(): EstimatedSignal {
  return {
    score: 3,
    confidence: 'low',
    reason: 'Cannot assess cross-platform consistency from a single page scan',
  }
}

function estimateCredibilitySignals(extract: WebsiteExtract): EstimatedSignal {
  const trustCount = [
    extract.hasCertifications,
    extract.hasAwards,
    extract.hasPartnerships,
    extract.hasReviewContent,
  ].filter(Boolean).length

  let score = 1
  if (trustCount >= 1) score = 2
  if (trustCount >= 2) score = 3
  if (trustCount >= 3) score = 4
  if (trustCount >= 4) score = 5

  return {
    score,
    confidence: 'medium',
    reason: trustCount > 0
      ? `${trustCount} credibility signal type(s) detected on site`
      : 'No credibility signals detected on site',
  }
}

export function estimatedSignalsToScores(estimated: EstimatedSignals): SignalScores {
  const scores = {} as SignalScores
  for (const key of Object.keys(estimated) as SignalKey[]) {
    scores[key] = estimated[key].score
  }
  return scores
}

export function estimateFocusTier(estimated: EstimatedSignals): string {
  const scores = Object.values(estimated).map(s => s.score)
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length
  if (avg < 2.5) return 'Tier 1 - Foundation'
  if (avg < 3.5) return 'Tier 2 - Growth'
  return 'Tier 3 - Optimization'
}

export function estimateBottleneck(estimated: EstimatedSignals): string {
  // Find the lowest-scoring signal among high/medium confidence estimates
  const bottleneckMap: Partial<Record<SignalKey, string>> = {
    entityClarity: 'Entity clarity — AI doesn\'t know who we are',
    reviews: 'No reviews — lack of review presence',
    structuredData: 'Missing schema — no structured data',
    authoritySignals: 'Weak authority — no third-party citations',
    comparisonPresence: 'Poor comparison presence — not in "best of" content',
    messagingConsistency: 'Inconsistent messaging — brand info varies across sites',
  }

  let lowestKey: SignalKey = 'entityClarity'
  let lowestScore = 6

  for (const [key, est] of Object.entries(estimated) as [SignalKey, EstimatedSignal][]) {
    if ((est.confidence === 'high' || est.confidence === 'medium') && est.score < lowestScore) {
      lowestScore = est.score
      lowestKey = key
    }
  }

  return bottleneckMap[lowestKey] || 'Entity clarity — AI doesn\'t know who we are'
}
