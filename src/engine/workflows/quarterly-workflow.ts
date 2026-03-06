import type { ClientGeoSnapshot } from '@/types/snapshot'
import type { SignalDiagnostic } from '@/types/recommendations'
import type { AuthoritySnapshot, CitationOpportunity } from '@/types/authority'
import type { EntityGraph } from '@/types/entity-map'
import type { AuthorityAnalysis } from '@/engine/analyzers/authority-analyzer'
import { parseSnapshot } from '@/engine/parsers/snapshot-parser'
import { parseAuthoritySnapshot } from '@/engine/parsers/authority-parser'
import { analyzeSignals } from '@/engine/analyzers/signal-diagnostics'
import { calculateReadinessScore, getReadinessLabel } from '@/engine/analyzers/readiness-score'
import { analyzeAuthority } from '@/engine/analyzers/authority-analyzer'
import { mapEntityRelationships } from '@/engine/modules/entity-relationship-mapper'
import { formatSnapshot } from '@/engine/generators/snapshot-updater'

export interface QuarterlyInput {
  snapshotText?: string
  snapshot?: ClientGeoSnapshot
  authorityText?: string
  authority?: AuthoritySnapshot
}

export interface QuarterlyOutput {
  snapshot: ClientGeoSnapshot
  diagnostics: SignalDiagnostic[]
  readinessScore: number
  readinessLabel: string
  authorityAnalysis: AuthorityAnalysis
  entityGraph: EntityGraph
  citationOpportunities: CitationOpportunity[]
  contentExpansionPlan: string[]
  updatedSnapshotText: string
}

export function runQuarterlyWorkflow(input: QuarterlyInput): QuarterlyOutput {
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

  let authority: AuthoritySnapshot
  if (input.authority) {
    authority = input.authority
  } else if (input.authorityText) {
    const authorityResult = parseAuthoritySnapshot(input.authorityText)
    authority = authorityResult.data ?? {
      currentAuthoritySources: [],
      industryDirectories: [],
      mediaPresence: [],
      partnerMentions: [],
      certifications: [],
      awards: [],
      speakingEngagements: [],
      publications: [],
    }
  } else {
    authority = {
      currentAuthoritySources: [],
      industryDirectories: [],
      mediaPresence: [],
      partnerMentions: [],
      certifications: [],
      awards: [],
      speakingEngagements: [],
      publications: [],
    }
  }

  const diagnostics = analyzeSignals(snapshot.signals)
  const readinessScore = calculateReadinessScore(snapshot.signals)
  const readinessLabel = getReadinessLabel(readinessScore)

  const authorityAnalysis = analyzeAuthority(authority, snapshot.primaryCategory)
  const entityGraph = mapEntityRelationships(snapshot)

  return {
    snapshot,
    diagnostics,
    readinessScore,
    readinessLabel,
    authorityAnalysis,
    entityGraph,
    citationOpportunities: authorityAnalysis.citationOpportunities,
    contentExpansionPlan: authorityAnalysis.contentExpansionPlan,
    updatedSnapshotText: formatSnapshot(snapshot),
  }
}
