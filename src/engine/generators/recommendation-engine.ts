import type { ClientGeoSnapshot, SignalKey } from '@/types/snapshot'
import type { MonthlyChangeLog } from '@/types/changelog'
import type { Recommendation } from '@/types/recommendations'
import { SIGNAL_DEFINITIONS } from '@/engine/constants/signal-definitions'
import { PLATFORM_CONFIGS } from '@/engine/constants/platform-config'

export function generateRecommendations(
  snapshot: ClientGeoSnapshot,
  _changelog?: MonthlyChangeLog,
): Recommendation[] {
  const recommendations: Recommendation[] = []

  const weakSignals = SIGNAL_DEFINITIONS.filter(
    (def) => snapshot.signals[def.key] < def.criticalThreshold
  ).sort((a, b) => {
    const scoreA = snapshot.signals[a.key]
    const scoreB = snapshot.signals[b.key]
    const priorityA = a.weight * (5 - scoreA)
    const priorityB = b.weight * (5 - scoreB)
    return priorityB - priorityA
  })

  for (const def of weakSignals) {
    const score = snapshot.signals[def.key]
    const impact = score <= 1 ? 'high' : score <= 2 ? 'high' : 'medium'

    const relevantPlatform = PLATFORM_CONFIGS.find((p) =>
      p.prioritySignals.includes(def.key)
    )

    recommendations.push({
      priority: def.weight * (5 - score),
      signal: def.key,
      artifactType: def.artifactType,
      title: `Improve ${def.label}`,
      description: getActionDescription(def.key, score, snapshot),
      platform: relevantPlatform?.key ?? 'all',
      impact,
    })
  }

  // Platform-specific recommendations
  for (const platform of PLATFORM_CONFIGS) {
    const visibility = snapshot.platformVisibility[platform.key]
    if (visibility < 30) {
      const weakPlatformSignals = platform.prioritySignals.filter(
        (sig) => snapshot.signals[sig] < 3
      )
      if (weakPlatformSignals.length > 0 && !recommendations.some((r) => r.platform === platform.key)) {
        recommendations.push({
          priority: 0.5,
          signal: weakPlatformSignals[0],
          artifactType: SIGNAL_DEFINITIONS.find((d) => d.key === weakPlatformSignals[0])!.artifactType,
          title: `Boost ${platform.label} visibility`,
          description: `${platform.label} visibility is at ${visibility}%. Focus on: ${weakPlatformSignals.map((s) => SIGNAL_DEFINITIONS.find((d) => d.key === s)?.label).join(', ')}`,
          platform: platform.key,
          impact: 'high',
        })
      }
    }
  }

  return recommendations
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 8)
}

function getActionDescription(key: SignalKey, score: number, snapshot: ClientGeoSnapshot): string {
  const name = snapshot.businessName || 'the business'
  const category = snapshot.primaryCategory || 'the category'

  const descriptions: Record<string, string> = {
    entityClarity: `Create a clear entity definition block for ${name} as a ${category} provider. Deploy across homepage, about page, and external profiles.`,
    brandMentions: `Increase brand mentions for ${name} through guest articles, directory listings, and partner mentions.`,
    comparisonPresence: `Create comparison content positioning ${name} against alternatives in the ${category} space.`,
    faqCoverage: `Build comprehensive FAQ content covering common ${category} queries that AI models use to answer questions.`,
    structuredData: `Implement Organization, Service, and FAQ schema markup for ${name}.`,
    reviews: `Launch a review acquisition campaign targeting Google, industry platforms, and relevant review sites.`,
    authoritySignals: `Publish thought leadership content establishing ${name} as an authority in ${category}.`,
    citations: `Build third-party citations through directory listings, media mentions, and industry associations.`,
    gbpCompleteness: `Complete and optimize Google Business Profile for ${name} including Q&A, posts, and photos.`,
    knowledgeGraphSignals: `Strengthen knowledge graph connections through consistent structured data and entity relationships.`,
    messagingConsistency: `Align messaging about ${name} across all touchpoints: website, profiles, directories, and social media.`,
    credibilitySignals: `Add credibility indicators: certifications, awards, endorsements, and partnership badges.`,
  }

  return descriptions[key] ?? `Improve ${key} signal (currently ${score}/5).`
}
