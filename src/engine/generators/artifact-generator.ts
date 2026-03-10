import type { Artifact } from '@/types/artifacts'
import type { Recommendation } from '@/types/recommendations'
import type { ClientGeoSnapshot, SignalKey } from '@/types/snapshot'
import { ARTIFACT_TEMPLATES } from '@/engine/constants/artifact-templates'
import { getVerticalPromptAddition } from '@/engine/constants/vertical-templates'
import { PLATFORM_CONFIGS } from '@/engine/constants/platform-config'
import { SIGNAL_DEFINITIONS } from '@/engine/constants/signal-definitions'

function getSignalAddendum(signal: SignalKey, snapshot: ClientGeoSnapshot): string {
  const name = snapshot.businessName || 'the business'
  const addendums: Partial<Record<SignalKey, string>> = {
    knowledgeGraphSignals: `\n\nAlso address Knowledge Graph signals: ensure this content includes sameAs references, entity relationships, and connections to ${name}'s industry entities to strengthen knowledge graph presence.`,
    messagingConsistency: `\n\nAlso address Messaging Consistency: ensure the language, positioning, and key claims in this content are identical to what appears on the website, social profiles, and directory listings for ${name}.`,
    brandMentions: `\n\nAlso address Brand Mentions: structure this content to generate natural mentions of ${name} across external publications and directories.`,
    authoritySignals: `\n\nAlso address Authority Signals: include expertise indicators, original insights, and thought leadership positioning for ${name}.`,
    citations: `\n\nAlso address Citations: include citable data, statistics, or frameworks that third-party sources would reference and link to.`,
    credibilitySignals: `\n\nAlso address Credibility Signals: incorporate certifications, awards, endorsements, and trust indicators for ${name}.`,
  }
  return addendums[signal] ?? ''
}

export function generateArtifacts(
  recommendations: Recommendation[],
  snapshot: ClientGeoSnapshot,
): Artifact[] {
  const artifactMap = new Map<string, Artifact>()

  for (const rec of recommendations) {
    const template = ARTIFACT_TEMPLATES[rec.artifactType]
    if (!template) continue

    const existing = artifactMap.get(rec.artifactType)

    if (existing) {
      // Merge: add signal context and enrich content
      if (!existing.targetSignals.includes(rec.signal)) {
        existing.targetSignals.push(rec.signal)
        const addendum = getSignalAddendum(rec.signal, snapshot)
        if (addendum) {
          existing.content += addendum
        }
        const signalLabel = SIGNAL_DEFINITIONS.find(d => d.key === rec.signal)?.label ?? rec.signal
        existing.deployment.notes += `; Also addresses ${signalLabel} (score: ${snapshot.signals[rec.signal]}/5)`
      }
      // Upgrade priority if this rec is higher impact
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      if (priorityOrder[rec.impact] < priorityOrder[existing.deployment.priority]) {
        existing.deployment.priority = rec.impact
      }
    } else {
      // Create new artifact
      const baseContent = template.promptTemplate(
        snapshot.businessName || '[Business Name]',
        snapshot.primaryCategory || '[Category]',
        snapshot.audience || '[Audience]',
        snapshot.competitors,
      )

      const verticalAddition = getVerticalPromptAddition(snapshot.primaryCategory, rec.artifactType)

      let platformAddition = ''
      if (rec.platform !== 'all') {
        const platformConfig = PLATFORM_CONFIGS.find((p) => p.key === rec.platform)
        if (platformConfig) {
          platformAddition = `\n\nOptimize this content for ${platformConfig.label} visibility. ${platformConfig.description}.`
        }
      }

      const content = baseContent + verticalAddition + platformAddition

      artifactMap.set(rec.artifactType, {
        type: rec.artifactType,
        title: template.title,
        content,
        targetSignals: [rec.signal],
        deployment: {
          targets: [...template.defaultDeployTargets],
          priority: rec.impact,
          notes: `Addresses ${rec.title} (score: ${snapshot.signals[rec.signal]}/5)`,
        },
        isExternalDistribution: template.externalTargets.length > 0,
      })
    }
  }

  return Array.from(artifactMap.values())
}
