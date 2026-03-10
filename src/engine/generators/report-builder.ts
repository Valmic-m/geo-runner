import type { SignalDiagnostic, Recommendation, ImplementationStep } from '@/types/recommendations'
import type { Artifact } from '@/types/artifacts'
import type { ClientGeoSnapshot, PlatformKey } from '@/types/snapshot'
import type { DistributionAction } from '@/engine/modules/signal-distribution-planner'
import type { DeploymentStep } from '@/engine/generators/deployment-planner'
import type { SprintAction } from '@/engine/workflows/monthly-workflow'
import { PLATFORM_MAP } from '@/engine/constants/platform-config'
import { ARTIFACT_TEMPLATES } from '@/engine/constants/artifact-templates'

export interface ReportData {
  title: string
  workflowType: 'monthly' | 'quarterly' | 'annual'
  date: string
  businessName: string
  category: string
  geoScope: string
  readinessScore: number
  readinessLabel: string
  executiveSummary: string
  signalScores: {
    label: string
    score: number
    max: number
    status: string
    recommendation: string
  }[]
  platformVisibility: {
    platform: string
    score: number
  }[]
  priorityActions: {
    rank: number
    title: string
    description: string
    timeline: string
    impact: string
    steps: ImplementationStep[]
    successCriteria: string
  }[]
  artifacts: {
    title: string
    content: string
    deployTo: string[]
    usageInstructions: string
  }[]
  distributionPlan: {
    action: string
    target: string
    type: string
  }[]
  deploymentSteps: {
    order: number
    artifact: string
    target: string
    priority: string
  }[]
  sprintActions: SprintAction[]
}


function generateExecutiveSummary(
  businessName: string,
  readinessScore: number,
  readinessLabel: string,
  diagnostics: SignalDiagnostic[],
  recommendations: Recommendation[],
): string {
  const criticalCount = diagnostics.filter(d => d.status === 'critical').length
  const weakCount = diagnostics.filter(d => d.status === 'weak').length
  const strongCount = diagnostics.filter(d => d.status === 'strong').length
  const topRec = recommendations[0]

  let summary = `${businessName} has an AI Recommendation Readiness score of ${readinessScore}% (${readinessLabel}). `

  if (criticalCount > 0) {
    summary += `There are ${criticalCount} critical signal${criticalCount > 1 ? 's' : ''} requiring immediate attention. `
  }
  if (weakCount > 0) {
    summary += `${weakCount} signal${weakCount > 1 ? 's are' : ' is'} weak and should be addressed soon. `
  }
  if (strongCount > 0) {
    summary += `${strongCount} signal${strongCount > 1 ? 's are' : ' is'} performing well. `
  }
  if (topRec) {
    summary += `The top priority action is: ${topRec.title}.`
  }

  return summary
}

function buildPlatformVisibility(snapshot: ClientGeoSnapshot): ReportData['platformVisibility'] {
  const platforms: PlatformKey[] = ['chatgpt', 'gemini', 'claude', 'perplexity', 'aiOverviews']
  return platforms.map(key => ({
    platform: PLATFORM_MAP[key]?.label ?? key,
    score: snapshot.platformVisibility[key] ?? 0,
  }))
}

export function buildMonthlyReport(data: {
  snapshot: ClientGeoSnapshot
  diagnostics: SignalDiagnostic[]
  readinessScore: number
  readinessLabel: string
  recommendations: Recommendation[]
  artifacts: Artifact[]
  distributionActions: DistributionAction[]
  deploymentPlan: DeploymentStep[]
  sprintActions: SprintAction[]
}): ReportData {
  return {
    title: 'Monthly GEO Visibility Report',
    workflowType: 'monthly',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    businessName: data.snapshot.businessName,
    category: data.snapshot.primaryCategory,
    geoScope: data.snapshot.geoScope,
    readinessScore: data.readinessScore,
    readinessLabel: data.readinessLabel,
    executiveSummary: generateExecutiveSummary(
      data.snapshot.businessName,
      data.readinessScore,
      data.readinessLabel,
      data.diagnostics,
      data.recommendations,
    ),
    signalScores: data.diagnostics.map(d => ({
      label: d.label,
      score: d.score,
      max: 5,
      status: d.status,
      recommendation: d.recommendation,
    })),
    platformVisibility: buildPlatformVisibility(data.snapshot),
    priorityActions: data.recommendations.map((r, i) => ({
      rank: i + 1,
      title: r.title,
      description: r.description,
      timeline: r.timeline,
      impact: r.impact,
      steps: r.steps,
      successCriteria: r.successCriteria,
    })),
    artifacts: data.artifacts.map(a => ({
      title: a.title,
      content: a.content,
      deployTo: a.deployment.targets,
      usageInstructions: ARTIFACT_TEMPLATES[a.type]?.usageInstructions ?? '',
    })),
    distributionPlan: data.distributionActions.map(d => ({
      action: d.action,
      target: d.target,
      type: d.type,
    })),
    deploymentSteps: data.deploymentPlan.map(d => ({
      order: d.order,
      artifact: d.artifact,
      target: d.target,
      priority: d.priority,
    })),
    sprintActions: data.sprintActions,
  }
}

export function buildQuarterlyReport(data: {
  snapshot: ClientGeoSnapshot
  diagnostics: SignalDiagnostic[]
  readinessScore: number
  readinessLabel: string
}): ReportData {
  return {
    title: 'Quarterly Authority Review Report',
    workflowType: 'quarterly',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    businessName: data.snapshot.businessName,
    category: data.snapshot.primaryCategory,
    geoScope: data.snapshot.geoScope,
    readinessScore: data.readinessScore,
    readinessLabel: data.readinessLabel,
    executiveSummary: generateExecutiveSummary(
      data.snapshot.businessName,
      data.readinessScore,
      data.readinessLabel,
      data.diagnostics,
      [],
    ),
    signalScores: data.diagnostics.map(d => ({
      label: d.label,
      score: d.score,
      max: 5,
      status: d.status,
      recommendation: d.recommendation,
    })),
    platformVisibility: buildPlatformVisibility(data.snapshot),
    priorityActions: [],
    artifacts: [],
    distributionPlan: [],
    deploymentSteps: [],
    sprintActions: [],
  }
}

export function buildAnnualReport(data: {
  snapshot: ClientGeoSnapshot
  diagnostics: SignalDiagnostic[]
  readinessScore: number
  readinessLabel: string
  entityDefinitionBlock: string
}): ReportData {
  return {
    title: 'Annual GEO Reset Report',
    workflowType: 'annual',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    businessName: data.snapshot.businessName,
    category: data.snapshot.primaryCategory,
    geoScope: data.snapshot.geoScope,
    readinessScore: data.readinessScore,
    readinessLabel: data.readinessLabel,
    executiveSummary: generateExecutiveSummary(
      data.snapshot.businessName,
      data.readinessScore,
      data.readinessLabel,
      data.diagnostics,
      [],
    ),
    signalScores: data.diagnostics.map(d => ({
      label: d.label,
      score: d.score,
      max: 5,
      status: d.status,
      recommendation: d.recommendation,
    })),
    platformVisibility: buildPlatformVisibility(data.snapshot),
    priorityActions: [],
    artifacts: data.entityDefinitionBlock
      ? [{ title: 'Entity Definition Block', content: data.entityDefinitionBlock, deployTo: ['Website', 'Schema Markup'], usageInstructions: ARTIFACT_TEMPLATES['entity-definition-block']?.usageInstructions ?? '' }]
      : [],
    distributionPlan: [],
    deploymentSteps: [],
    sprintActions: [],
  }
}
