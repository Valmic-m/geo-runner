import { useState } from 'react'
import { Play } from 'lucide-react'
import { TextInput } from '@/components/shared/TextInput'
import { SignalBar } from '@/components/shared/SignalBar'
import { ScoreGauge } from '@/components/shared/ScoreGauge'
import { CollapsibleSection } from '@/components/shared/CollapsibleSection'
import { ArtifactCard } from '@/components/shared/ArtifactCard'
import { CopyButton } from '@/components/shared/CopyButton'
import { ExportButton } from '@/components/shared/ExportButton'
import { PlatformBadge } from '@/components/shared/PlatformBadge'
import { useWorkflow } from '@/hooks/useWorkflow'
import { runMonthlyWorkflow } from '@/engine/workflows/monthly-workflow'
import type { MonthlyInput, MonthlyOutput } from '@/engine/workflows/monthly-workflow'
import { SNAPSHOT_TEMPLATE } from '@/engine/parsers/snapshot-parser'
import { CHANGELOG_TEMPLATE } from '@/engine/parsers/changelog-parser'
import { cn } from '@/lib/cn'

export function MonthlyPage() {
  const [snapshotText, setSnapshotText] = useState('')
  const [changelogText, setChangelogText] = useState('')

  const { result, error, isRunning, run } = useWorkflow<MonthlyInput, MonthlyOutput>(runMonthlyWorkflow)

  const handleRun = () => {
    run({ snapshotText, changelogText })
  }

  const canRun = snapshotText.trim().length > 0

  const exportContent = result
    ? [
        `# Monthly GEO Report - ${result.snapshot.businessName}`,
        '',
        `## Recommendation Readiness: ${result.readinessScore}% (${result.readinessLabel})`,
        '',
        '## Signal Diagnostics',
        ...result.diagnostics.map((d) => `- **${d.label}**: ${d.score}/5 (${d.status}) - ${d.recommendation}`),
        '',
        '## Sprint Actions',
        ...result.sprintActions,
        '',
        '## Artifacts Generated',
        ...result.artifacts.map((a) => `### ${a.title}\n${a.content}\n`),
        '',
        '## Distribution Actions',
        ...result.distributionActions.map((d) => `- [${d.type}] ${d.action} -> ${d.target}`),
        '',
        '## Updated Snapshot',
        result.updatedSnapshotText,
      ].join('\n')
    : ''

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-text">Monthly GEO Cycle</h2>
        <p className="text-sm text-text-muted mt-1">Run a full monthly diagnostic with signal analysis, recommendations, and artifact generation.</p>
        <p className="text-xs text-text-muted mt-1">This is the core GEO workflow. It scores all 12 signals, flags critical gaps, generates ready-to-publish content artifacts, and produces a deployment plan. Run monthly for each client.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-4">
          <TextInput
            label="Client GEO Snapshot"
            value={snapshotText}
            onChange={setSnapshotText}
            template={SNAPSHOT_TEMPLATE}
            required
            placeholder="Paste the Client GEO Snapshot here..."
          />
          <TextInput
            label="Monthly Change Log"
            value={changelogText}
            onChange={setChangelogText}
            template={CHANGELOG_TEMPLATE}
            rows={8}
            placeholder="Paste the Monthly Change Log here (optional)..."
          />
          <button
            onClick={handleRun}
            disabled={!canRun || isRunning}
            className={cn(
              'w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
              canRun
                ? 'bg-primary text-white hover:bg-primary-dark'
                : 'bg-border text-text-muted cursor-not-allowed',
            )}
          >
            <Play size={16} />
            {isRunning ? 'Running...' : 'Run Monthly Analysis'}
          </button>
          {error && (
            <div className="text-sm text-danger bg-danger/10 rounded-lg p-3">{error}</div>
          )}
        </div>

        {/* Output Panel */}
        <div className="space-y-4">
          {!result && !error && (
            <div className="text-center py-20 text-text-muted text-sm border border-dashed border-border rounded-lg">
              Paste a Client GEO Snapshot and run the analysis to see results.
            </div>
          )}

          {result && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-text">Results: {result.snapshot.businessName}</h3>
                <div className="flex gap-2">
                  <CopyButton text={exportContent} label="Copy All" />
                  <ExportButton content={exportContent} filename={`geo-monthly-${result.snapshot.businessName}`} />
                </div>
              </div>

              <ScoreGauge
                score={result.readinessScore}
                label="Recommendation Readiness"
                subtitle={result.readinessLabel}
              />

              <CollapsibleSection title="Signal Diagnostics" badge={`${result.diagnostics.filter((d) => d.status === 'critical' || d.status === 'weak').length} issues`}>
                <div className="space-y-2">
                  {result.diagnostics.map((d) => (
                    <div key={d.signal}>
                      <SignalBar label={d.label} score={d.score} />
                      <p className="text-xs text-text-muted ml-47 mt-0.5">{d.recommendation}</p>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Recommendations" badge={`${result.recommendations.length}`}>
                <div className="space-y-3">
                  {result.recommendations.map((r, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-surface-alt">
                      <span className="text-xs font-bold text-primary bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm">{r.title}</span>
                          <PlatformBadge platform={r.platform} />
                        </div>
                        <p className="text-xs text-text-muted mt-1">{r.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="GEO Artifacts" badge={`${result.artifacts.length}`} defaultOpen={false}>
                <div className="space-y-3">
                  {result.artifacts.map((a, i) => (
                    <ArtifactCard key={i} artifact={a} />
                  ))}
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Distribution Plan" defaultOpen={false}>
                <div className="space-y-2">
                  {result.distributionActions.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded font-medium',
                        d.type === 'external' ? 'bg-primary/10 text-primary' : 'bg-surface-alt text-text-muted',
                      )}>
                        {d.type}
                      </span>
                      <span className="text-text-muted">{d.action}</span>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Monthly Sprint" badge="Top Actions">
                <div className="space-y-1">
                  {result.sprintActions.map((action, i) => (
                    <p key={i} className="text-sm text-text">{action}</p>
                  ))}
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Updated Snapshot" defaultOpen={false}>
                <div className="relative">
                  <CopyButton text={result.updatedSnapshotText} label="Copy Snapshot" className="absolute top-2 right-2" />
                  <pre className="text-xs font-mono bg-surface-alt rounded-lg p-4 whitespace-pre-wrap">
                    {result.updatedSnapshotText}
                  </pre>
                </div>
              </CollapsibleSection>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
