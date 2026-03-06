import type { ClientGeoSnapshot } from '@/types/snapshot'
import type { SignalDiagnostic } from '@/types/recommendations'
import type { EntityGraph } from '@/types/entity-map'
import type { CategoryPrecisionAnalysis } from '@/engine/analyzers/category-precision'
import { parseSnapshot } from '@/engine/parsers/snapshot-parser'
import { analyzeSignals } from '@/engine/analyzers/signal-diagnostics'
import { calculateReadinessScore, getReadinessLabel } from '@/engine/analyzers/readiness-score'
import { analyzeCategoryPrecision } from '@/engine/analyzers/category-precision'
import { mapEntityRelationships } from '@/engine/modules/entity-relationship-mapper'
import { generateEntityDefinition } from '@/engine/generators/entity-definition'
import { formatSnapshot } from '@/engine/generators/snapshot-updater'

export interface AnnualInput {
  snapshotText: string
  websiteExcerpts?: string
}

export interface AnnualOutput {
  snapshot: ClientGeoSnapshot
  diagnostics: SignalDiagnostic[]
  readinessScore: number
  readinessLabel: string
  categoryPrecision: CategoryPrecisionAnalysis
  entityGraph: EntityGraph
  entityDefinitionBlock: string
  updatedSnapshotText: string
}

export function runAnnualWorkflow(input: AnnualInput): AnnualOutput {
  const snapshotResult = parseSnapshot(input.snapshotText)
  if (!snapshotResult.data) {
    throw new Error(`Failed to parse snapshot: ${snapshotResult.errors.join(', ')}`)
  }
  const snapshot = snapshotResult.data

  const diagnostics = analyzeSignals(snapshot.signals)
  const readinessScore = calculateReadinessScore(snapshot.signals)
  const readinessLabel = getReadinessLabel(readinessScore)

  const categoryPrecision = analyzeCategoryPrecision(snapshot)
  const entityGraph = mapEntityRelationships(snapshot)
  const entityDefinitionBlock = generateEntityDefinition(snapshot)

  return {
    snapshot,
    diagnostics,
    readinessScore,
    readinessLabel,
    categoryPrecision,
    entityGraph,
    entityDefinitionBlock,
    updatedSnapshotText: formatSnapshot(snapshot),
  }
}
