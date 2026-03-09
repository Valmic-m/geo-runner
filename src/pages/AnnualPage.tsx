import { useState } from 'react'
import { SignalBar } from '@/components/shared/SignalBar'
import { ScoreGauge } from '@/components/shared/ScoreGauge'
import { CollapsibleSection } from '@/components/shared/CollapsibleSection'
import { CopyButton } from '@/components/shared/CopyButton'
import { ExportButton } from '@/components/shared/ExportButton'
import { SnapshotForm } from '@/components/forms/SnapshotForm'
import { SnapshotSummaryCard } from '@/components/snapshot/SnapshotSummaryCard'
import { SnapshotEditModal } from '@/components/snapshot/SnapshotEditModal'
import { useWorkflow } from '@/hooks/useWorkflow'
import { runAnnualWorkflow } from '@/engine/workflows/annual-workflow'
import type { AnnualInput, AnnualOutput } from '@/engine/workflows/annual-workflow'
import { useSession } from '@/context/SessionContext'
import type { ClientGeoSnapshot } from '@/types/snapshot'
import { cn } from '@/lib/cn'
import { PageHeader } from '@/components/shared/PageHeader'

export function AnnualPage() {
  const { extractedData, clearExtractedData, currentSnapshot, setCurrentSnapshot, markWorkflowCompleted } = useSession()
  const [websiteExcerpts, setWebsiteExcerpts] = useState('')
  const [editingSnapshot, setEditingSnapshot] = useState(false)

  const { result, error, isRunning, run } = useWorkflow<AnnualInput, AnnualOutput>(runAnnualWorkflow)

  const handleRun = (snapshot: ClientGeoSnapshot) => {
    clearExtractedData()
    run({ snapshot, websiteExcerpts: websiteExcerpts || undefined })
    setCurrentSnapshot(snapshot)
    markWorkflowCompleted('annual')
  }

  const handleRunWithCurrentSnapshot = () => {
    if (currentSnapshot) handleRun(currentSnapshot)
  }

  const inputClass = cn(
    'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm font-mono',
    'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
    'placeholder:text-text-muted/50 resize-y',
  )

  const exportContent = result
    ? [
        `# Annual GEO Reset - ${result.snapshot.businessName}`,
        '',
        `## Readiness: ${result.readinessScore}% (${result.readinessLabel})`,
        '',
        `## Category Precision: ${result.categoryPrecision.precision}`,
        ...result.categoryPrecision.recommendations.map((r) => `- ${r}`),
        '',
        '## Positioning Improvements',
        ...result.categoryPrecision.positioningImprovements.map((p) => `- ${p}`),
        '',
        '## Entity Definition Block',
        result.entityDefinitionBlock,
        '',
        '## Entity Map',
        result.entityGraph.summary,
        '',
        '## Updated Snapshot',
        result.updatedSnapshotText,
      ].join('\n')
    : ''

  return (
    <div className="space-y-6">
      <PageHeader title="Annual GEO Reset" subtitle="Full category precision review, entity definition, and positioning improvements." />

      {!result ? (
        <div className="max-w-2xl mx-auto space-y-6">
          {currentSnapshot ? (
            <>
              <SnapshotSummaryCard snapshot={currentSnapshot} onEdit={() => setEditingSnapshot(true)} />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">
                  Website Excerpts <span className="text-text-muted font-normal">(optional)</span>
                </label>
                <textarea
                  value={websiteExcerpts}
                  onChange={(e) => setWebsiteExcerpts(e.target.value)}
                  rows={6}
                  placeholder="Paste key website content here for category precision analysis..."
                  className={inputClass}
                />
              </div>
              <button
                onClick={handleRunWithCurrentSnapshot}
                disabled={isRunning}
                className={cn(
                  'w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  !isRunning ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md shadow-primary/25 hover:shadow-lg active:scale-[0.98]' : 'bg-border text-text-muted cursor-not-allowed opacity-60',
                )}
              >
                {isRunning ? 'Running...' : 'Run Annual Reset'}
              </button>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-sm font-semibold text-text mb-3">Client GEO Snapshot</h3>
                <SnapshotForm onSubmit={handleRun} isRunning={isRunning} initialData={extractedData ?? undefined} cycle="annual" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">
                  Website Excerpts <span className="text-text-muted font-normal">(optional)</span>
                </label>
                <textarea
                  value={websiteExcerpts}
                  onChange={(e) => setWebsiteExcerpts(e.target.value)}
                  rows={6}
                  placeholder="Paste key website content here for category precision analysis..."
                  className={inputClass}
                />
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
                <ExportButton content={exportContent} filename={`geo-annual-${result.snapshot.businessName}`} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ScoreGauge score={result.readinessScore} label="Readiness" subtitle={result.readinessLabel} />
              <div className="flex flex-col items-center p-4 rounded-xl border border-border bg-surface">
                <div className={cn(
                  'text-2xl font-bold',
                  result.categoryPrecision.precision === 'precise' ? 'text-success' :
                  result.categoryPrecision.precision === 'broad' ? 'text-warning' : 'text-danger',
                )}>
                  {result.categoryPrecision.precision}
                </div>
                <div className="text-sm font-medium text-text mt-1">Category Precision</div>
              </div>
            </div>

            <CollapsibleSection title="Signal Overview">
              <div className="space-y-2">
                {result.diagnostics.map((d) => (
                  <SignalBar key={d.signal} label={d.label} score={d.score} />
                ))}
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Category Precision Analysis">
              <div className="space-y-3">
                <p className="text-sm">
                  <span className="font-medium">Current category:</span> {result.categoryPrecision.currentCategory || 'Not set'}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Suggested entity definition:</span> {result.categoryPrecision.suggestedEntityDefinition}
                </p>
                {result.categoryPrecision.recommendations.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-text-muted mb-1">Issues:</p>
                    {result.categoryPrecision.recommendations.map((r, i) => (
                      <p key={i} className="text-sm text-warning">&#x26A0; {r}</p>
                    ))}
                  </div>
                )}
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Positioning Improvements">
              <ul className="space-y-1">
                {result.categoryPrecision.positioningImprovements.map((p, i) => (
                  <li key={i} className="text-sm">{i + 1}. {p}</li>
                ))}
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="Entity Definition Block">
              <div className="relative">
                <CopyButton text={result.entityDefinitionBlock} className="absolute top-2 right-2" />
                <pre className="text-xs font-mono bg-surface-alt rounded-lg p-4 whitespace-pre-wrap">{result.entityDefinitionBlock}</pre>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Entity Map">
              <pre className="text-xs font-mono bg-surface-alt rounded-lg p-4 whitespace-pre-wrap">{result.entityGraph.summary}</pre>
              <div className="mt-3">
                <p className="text-xs font-medium text-text-muted mb-2">Content Alignment Checklist:</p>
                {result.entityGraph.contentAlignmentChecklist.map((c, i) => (
                  <label key={i} className="flex items-start gap-2 text-xs text-text-muted">
                    <input type="checkbox" className="mt-0.5" /> {c}
                  </label>
                ))}
              </div>
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
