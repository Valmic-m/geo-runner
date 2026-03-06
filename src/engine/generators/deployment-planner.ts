import type { Artifact } from '@/types/artifacts'

export interface DeploymentStep {
  order: number
  artifact: string
  target: string
  priority: 'high' | 'medium' | 'low'
  action: string
}

export function createDeploymentPlan(artifacts: Artifact[]): DeploymentStep[] {
  const steps: DeploymentStep[] = []
  let order = 1

  const sorted = [...artifacts].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.deployment.priority] - priorityOrder[b.deployment.priority]
  })

  for (const artifact of sorted) {
    for (const target of artifact.deployment.targets) {
      steps.push({
        order: order++,
        artifact: artifact.title,
        target,
        priority: artifact.deployment.priority,
        action: `Deploy ${artifact.title} to ${target}`,
      })
    }
  }

  return steps
}
