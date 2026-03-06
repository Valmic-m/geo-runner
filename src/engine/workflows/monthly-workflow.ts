import type { ClientGeoSnapshot } from '@/types/snapshot'
import type { MonthlyChangeLog } from '@/types/changelog'
import type { SignalDiagnostic, Recommendation } from '@/types/recommendations'
import type { Artifact } from '@/types/artifacts'
import type { DeploymentStep } from '@/engine/generators/deployment-planner'
import type { DistributionAction } from '@/engine/modules/signal-distribution-planner'
import { parseSnapshot } from '@/engine/parsers/snapshot-parser'
import { parseChangelog } from '@/engine/parsers/changelog-parser'
import { analyzeSignals } from '@/engine/analyzers/signal-diagnostics'
import { calculateReadinessScore, getReadinessLabel } from '@/engine/analyzers/readiness-score'
import { generateRecommendations } from '@/engine/generators/recommendation-engine'
import { generateArtifacts } from '@/engine/generators/artifact-generator'
import { createDeploymentPlan } from '@/engine/generators/deployment-planner'
import { ensureExternalDistribution } from '@/engine/modules/signal-distribution-planner'
import { formatSnapshot } from '@/engine/generators/snapshot-updater'

export interface MonthlyInput {
  snapshotText?: string
  snapshot?: ClientGeoSnapshot
  changelogText?: string
  changelog?: MonthlyChangeLog
  testResultsText?: string
  websiteExcerpts?: string
}

export interface MonthlyOutput {
  snapshot: ClientGeoSnapshot
  diagnostics: SignalDiagnostic[]
  readinessScore: number
  readinessLabel: string
  recommendations: Recommendation[]
  artifacts: Artifact[]
  distributionActions: DistributionAction[]
  deploymentPlan: DeploymentStep[]
  updatedSnapshotText: string
  sprintActions: string[]
}

export function runMonthlyWorkflow(input: MonthlyInput): MonthlyOutput {
  // Parse inputs
  let snapshot: ClientGeoSnapshot
  if (input.snapshot) {
    snapshot = input.snapshot
  } else if (input.snapshotText) {
    const snapshotResult = parseSnapshot(input.snapshotText)
    if (!snapshotResult.data) {
      throw new Error(`Failed to parse snapshot: ${snapshotResult.errors.join(', ')}`)
    }
    snapshot = snapshotResult.data
  } else {
    throw new Error('Either snapshot or snapshotText is required')
  }

  let changelog: MonthlyChangeLog | undefined = input.changelog
  if (!changelog && input.changelogText?.trim()) {
    const changelogResult = parseChangelog(input.changelogText)
    changelog = changelogResult.data
  }

  // Analyze
  const diagnostics = analyzeSignals(snapshot.signals)
  const readinessScore = calculateReadinessScore(snapshot.signals)
  const readinessLabel = getReadinessLabel(readinessScore)

  // Generate recommendations
  const recommendations = generateRecommendations(snapshot, changelog)

  // Generate artifacts
  const artifacts = generateArtifacts(recommendations, snapshot)

  // Signal distribution check
  const { distributionActions } = ensureExternalDistribution(artifacts)

  // Deployment plan
  const deploymentPlan = createDeploymentPlan(artifacts)

  // Sprint actions (top 3-5)
  const sprintActions = recommendations.slice(0, 5).map((r, i) => `${i + 1}. ${r.title}: ${r.description}`)

  // Updated snapshot text
  const updatedSnapshotText = formatSnapshot(snapshot)

  return {
    snapshot,
    diagnostics,
    readinessScore,
    readinessLabel,
    recommendations,
    artifacts,
    distributionActions,
    deploymentPlan,
    updatedSnapshotText,
    sprintActions,
  }
}
