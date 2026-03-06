import type { Artifact } from '@/types/artifacts'
import { ARTIFACT_TEMPLATES } from '@/engine/constants/artifact-templates'

export interface DistributionAction {
  artifact: string
  target: string
  type: 'internal' | 'external'
  action: string
}

export function ensureExternalDistribution(artifacts: Artifact[]): {
  artifacts: Artifact[]
  distributionActions: DistributionAction[]
} {
  const distributionActions: DistributionAction[] = []

  // Add external targets to all applicable artifacts
  for (const artifact of artifacts) {
    const template = ARTIFACT_TEMPLATES[artifact.type]

    // Internal deployments
    for (const target of artifact.deployment.targets) {
      distributionActions.push({
        artifact: artifact.title,
        target,
        type: 'internal',
        action: `Deploy ${artifact.title} to ${target}`,
      })
    }

    // External deployments
    if (template?.externalTargets) {
      for (const target of template.externalTargets) {
        distributionActions.push({
          artifact: artifact.title,
          target,
          type: 'external',
          action: `Distribute ${artifact.title} to ${target}`,
        })
      }
    }
  }

  // Check if at least one external action exists
  const hasExternal = distributionActions.some((a) => a.type === 'external')

  if (!hasExternal && artifacts.length > 0) {
    // Force an external distribution action
    distributionActions.push({
      artifact: 'Authority Content',
      target: 'LinkedIn article',
      type: 'external',
      action: 'Publish a summary of key improvements as a LinkedIn article to build external mentions',
    })
    distributionActions.push({
      artifact: 'Directory Listing',
      target: 'Industry directory',
      type: 'external',
      action: 'Submit or update listing on at least one relevant industry directory',
    })
  }

  return { artifacts, distributionActions }
}
