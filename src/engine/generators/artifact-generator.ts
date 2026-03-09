import type { Artifact } from '@/types/artifacts'
import type { Recommendation } from '@/types/recommendations'
import type { ClientGeoSnapshot } from '@/types/snapshot'
import { ARTIFACT_TEMPLATES } from '@/engine/constants/artifact-templates'
import { getVerticalPromptAddition } from '@/engine/constants/vertical-templates'
import { PLATFORM_CONFIGS } from '@/engine/constants/platform-config'

export function generateArtifacts(
  recommendations: Recommendation[],
  snapshot: ClientGeoSnapshot,
): Artifact[] {
  const seen = new Set<string>()
  const artifacts: Artifact[] = []

  for (const rec of recommendations) {
    if (seen.has(rec.artifactType)) continue
    seen.add(rec.artifactType)

    const template = ARTIFACT_TEMPLATES[rec.artifactType]
    if (!template) continue

    const baseContent = template.promptTemplate(
      snapshot.businessName || '[Business Name]',
      snapshot.primaryCategory || '[Category]',
      snapshot.audience || '[Audience]',
    )

    // Add vertical-specific prompt additions
    const verticalAddition = getVerticalPromptAddition(snapshot.primaryCategory, rec.artifactType)

    // Add platform-specific guidance when targeting a specific platform
    let platformAddition = ''
    if (rec.platform !== 'all') {
      const platformConfig = PLATFORM_CONFIGS.find((p) => p.key === rec.platform)
      if (platformConfig) {
        platformAddition = `\n\nOptimize this content for ${platformConfig.label} visibility. ${platformConfig.description}.`
      }
    }

    const content = baseContent + verticalAddition + platformAddition

    artifacts.push({
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

  return artifacts
}
