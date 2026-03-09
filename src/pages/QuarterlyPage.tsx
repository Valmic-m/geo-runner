import { useState } from 'react'
import { SignalBar } from '@/components/shared/SignalBar'
import { ScoreGauge } from '@/components/shared/ScoreGauge'
import { CollapsibleSection } from '@/components/shared/CollapsibleSection'
import { CopyButton } from '@/components/shared/CopyButton'
import { ExportButton } from '@/components/shared/ExportButton'
import { SnapshotForm } from '@/components/forms/SnapshotForm'
import { AuthorityForm } from '@/components/forms/AuthorityForm'
import { SnapshotSummaryCard } from '@/components/snapshot/SnapshotSummaryCard'
import { SnapshotEditModal } from '@/components/snapshot/SnapshotEditModal'
import { useWorkflow } from '@/hooks/useWorkflow'
import { runQuarterlyWorkflow } from '@/engine/workflows/quarterly-workflow'
import type { QuarterlyInput, QuarterlyOutput } from '@/engine/workflows/quarterly-workflow'
import { useSession } from '@/context/SessionContext'
import type { ClientGeoSnapshot } from '@/types/snapshot'
import type { AuthoritySnapshot } from '@/types/authority'
import { cn } from '@/lib/cn'

export function QuarterlyPage() {
  const { extractedData, clearExtractedData, currentSnapshot, setCurrentSnapshot, markWorkflowCompleted } = useSession()
  const [authority, setAuthority] = useState<AuthoritySnapshot | null>(null)
  const [editingSnapshot, setEditingSnapshot] = useState(false)

  const { result, error, isRunning, run } = useWorkflow<QuarterlyInput, QuarterlyOutput>(runQuarterlyWorkflow)

  const handleRun = (snapshot: ClientGeoSnapshot) => {
    clearExtractedData()
    run({ snapshot, authority: authority ?? undefined })
    setCurrentSnapshot(snapshot)
    markWorkflowCompleted('quarterly')
  }

  const handleRunWithCurrentSnapshot = () => {
    if (currentSnapshot) handleRun(currentSnapshot)
  }

  const exportContent = result
    ? [
        `# Quarterly GEO Review - ${result.snapshot.businessName}`,
        '',
        `## Readiness: ${result.readinessScore}% (${result.readinessLabel})`,
        '',
        `## Authority: ${result.authorityAnalysis.currentStrength}`,
        '',
        '## Gaps',
        ...result.authorityAnalysis.gaps.map((g) => `- ${g}`),
        '',
        '## Citation Opportunities',
        ...result.citationOpportunities.map((c) => `- [${c.type}] ${c.action} (${c.expectedImpact} impact)`),
        '',
        '## Content Expansion Plan',
        ...result.contentExpansionPlan.map((c) => `- ${c}`),
        '',
        '## Entity Map',
        result.entityGraph.summary,
        '',
        '## Schema Recommendations',
        ...result.entityGraph.schemaRecommendations.map((s) => `- ${s}`),
        '',
        '## Updated Snapshot',
        result.updatedSnapshotText,
      ].join('\n')
    : ''

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-text">Quarterly Authority Review</h2>
        <p className="text-sm text-text-muted mt-1">Deep authority analysis, entity mapping, citation opportunities, and content expansion.</p>
      </div>

      {!result ? (
        <div className="max-w-2xl mx-auto space-y-6">
          {currentSnapshot ? (
            <>
              <SnapshotSummaryCard snapshot={currentSnapshot} onEdit={() => setEditingSnapshot(true)} />
              <div>
                <h3 className="text-sm font-semibold text-text mb-3">Authority Snapshot <span className="text-text-muted font-normal">(optional)</span></h3>
                <AuthorityForm onChange={setAuthority} />
              </div>
              <button
                onClick={handleRunWithCurrentSnapshot}
                disabled={isRunning}
                className={cn(
                  'w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  !isRunning ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-border text-text-muted cursor-not-allowed',
                )}
              >
                {isRunning ? 'Running...' : 'Run Quarterly Review'}
              </button>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-sm font-semibold text-text mb-3">Client GEO Snapshot</h3>
                <SnapshotForm onSubmit={handleRun} isRunning={isRunning} initialData={extractedData ?? undefined} cycle="quarterly" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text mb-3">Authority Snapshot <span className="text-text-muted font-normal">(optional)</span></h3>
                <AuthorityForm onChange={setAuthority} />
              </div>
            </>
          )}

          {error && <div className="text-sm text-danger bg-danger/10 rounded-lg p-3">{error}</div>}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <div className="space-y-4">
            <SnapshotSummaryCard snapshot={result.snapshot} onEdit={() => setEditingSnapshot(true)} />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-text">Results: {result.snapshot.businessName}</h3>
              <div className="flex gap-2">
                <CopyButton text={exportContent} label="Copy All" />
                <ExportButton content={exportContent} filename={`geo-quarterly-${result.snapshot.businessName}`} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ScoreGauge score={result.readinessScore} label="Readiness" subtitle={result.readinessLabel} />
              <div className="flex flex-col items-center p-4 rounded-xl border border-border bg-surface">
                <div className={cn('text-2xl font-bold', result.authorityAnalysis.currentStrength === 'strong' ? 'text-success' : result.authorityAnalysis.currentStrength === 'moderate' ? 'text-warning' : 'text-danger')}>
                  {result.authorityAnalysis.currentStrength}
                </div>
                <div className="text-sm font-medium text-text mt-1">Authority Level</div>
              </div>
            </div>

            <CollapsibleSection title="Signal Overview">
              <div className="space-y-2">
                {result.diagnostics.map((d) => (
                  <SignalBar key={d.signal} label={d.label} score={d.score} />
                ))}
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Authority Gaps" badge={`${result.authorityAnalysis.gaps.length}`}>
              <ul className="space-y-1">
                {result.authorityAnalysis.gaps.map((g, i) => (
                  <li key={i} className="text-sm text-danger flex items-start gap-2">
                    <span className="text-danger mt-0.5">&#x2022;</span> {g}
                  </li>
                ))}
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="Citation Opportunities" badge={`${result.citationOpportunities.length}`}>
              <div className="space-y-2">
                {result.citationOpportunities.map((c, i) => (
                  <div key={i} className="p-3 rounded-lg bg-surface-alt">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">{c.type}</span>
                      <span className="text-xs text-text-muted">Effort: {c.effort} | Impact: {c.expectedImpact}</span>
                    </div>
                    <p className="text-sm">{c.action}</p>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Entity Map">
              <pre className="text-xs font-mono bg-surface-alt rounded-lg p-4 whitespace-pre-wrap">{result.entityGraph.summary}</pre>
              <div className="mt-3">
                <p className="text-xs font-medium text-text-muted mb-2">Schema Recommendations:</p>
                <ul className="space-y-1">
                  {result.entityGraph.schemaRecommendations.map((s, i) => (
                    <li key={i} className="text-xs text-text-muted">&#x2022; {s}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-3">
                <p className="text-xs font-medium text-text-muted mb-2">Content Alignment Checklist:</p>
                <ul className="space-y-1">
                  {result.entityGraph.contentAlignmentChecklist.map((c, i) => (
                    <li key={i} className="text-xs text-text-muted flex items-start gap-2">
                      <input type="checkbox" className="mt-0.5" /> {c}
                    </li>
                  ))}
                </ul>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Content Expansion Plan">
              <ul className="space-y-1">
                {result.contentExpansionPlan.map((c, i) => (
                  <li key={i} className="text-sm text-text">
                    {i + 1}. {c}
                  </li>
                ))}
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="Updated Snapshot" defaultOpen={false}>
              <div className="relative">
                <CopyButton text={result.updatedSnapshotText} className="absolute top-2 right-2" />
                <pre className="text-xs font-mono bg-surface-alt rounded-lg p-4 whitespace-pre-wrap">{result.updatedSnapshotText}</pre>
              </div>
            </CollapsibleSection>
          </div>
        </div>
      )}

      {editingSnapshot && currentSnapshot && (
        <SnapshotEditModal
          snapshot={currentSnapshot}
          onSave={setCurrentSnapshot}
          onClose={() => setEditingSnapshot(false)}
        />
      )}
    </div>
  )
}
