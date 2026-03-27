import { useState } from 'react'
import { SignalBar } from '@/components/shared/SignalBar'
import { SignalRadarChart } from '@/components/shared/SignalRadarChart'
import { CollapsibleSection } from '@/components/shared/CollapsibleSection'
import { ArtifactCard } from '@/components/shared/ArtifactCard'
import { CopyButton } from '@/components/shared/CopyButton'
import { ExportButton } from '@/components/shared/ExportButton'
import { PlatformBadge } from '@/components/shared/PlatformBadge'
import { SnapshotForm } from '@/components/forms/SnapshotForm'
import { ChangelogForm } from '@/components/forms/ChangelogForm'
import { SnapshotSummaryCard } from '@/components/snapshot/SnapshotSummaryCard'
import { SnapshotEditModal } from '@/components/snapshot/SnapshotEditModal'
import { ResultsSummaryHeader } from '@/components/results/ResultsSummaryHeader'
import { useWorkflow } from '@/hooks/useWorkflow'
import { runMonthlyWorkflow } from '@/engine/workflows/monthly-workflow'
import type { MonthlyInput, MonthlyOutput } from '@/engine/workflows/monthly-workflow'
import { useSession } from '@/context/SessionContext'
import type { ClientGeoSnapshot } from '@/types/snapshot'
import type { MonthlyChangeLog } from '@/types/changelog'
import { cn } from '@/lib/cn'
import { PageHeader } from '@/components/shared/PageHeader'
import { JourneyBreadcrumb } from '@/components/shared/JourneyBreadcrumb'
import { NEW_CLIENT_JOURNEY, RETURNING_CLIENT_JOURNEY } from '@/lib/journey-definitions'
import { buildMonthlyReport } from '@/engine/generators/report-builder'
import { renderReportHtml } from '@/engine/generators/report-html-template'

export function MonthlyPage() {
  const { extractedData, clearExtractedData, setCurrentSnapshot, currentSnapshot, lastSnapshot, markWorkflowCompleted, completedWorkflows } = useSession()
  const [changelog, setChangelog] = useState<MonthlyChangeLog | null>(null)
  const [editingSnapshot, setEditingSnapshot] = useState(false)

  const { result, error, isRunning, run } = useWorkflow<MonthlyInput, MonthlyOutput>(runMonthlyWorkflow)

  const handleRun = (snapshot: ClientGeoSnapshot) => {
    clearExtractedData()
    run({ snapshot, changelog: changelog ?? undefined })
    setCurrentSnapshot(snapshot)
    markWorkflowCompleted('monthly')
  }

  const handleRunWithCurrentSnapshot = () => {
    if (currentSnapshot) {
      handleRun(currentSnapshot)
    }
  }

  const allArtifactsText = result
    ? result.artifacts.map((a) => `=== ${a.title} ===\n\n${a.content}`).join('\n\n---\n\n')
    : ''

  const exportContent = result
    ? [
        `# Monthly GEO Report - ${result.snapshot.businessName}`,
        '',
        `## Recommendation Readiness: ${result.readinessScore}% (${result.readinessLabel})`,
        result.industryVertical && result.industryVertical !== 'General / Default' ? `Industry weighting: ${result.industryVertical}` : '',
        '',
        '## Signal Diagnostics',
        ...result.diagnostics.map((d) => `- **${d.label}**: ${d.score}/5 (${d.status}) - ${d.recommendation}`),
        '',
        '## Sprint Actions',
        ...result.sprintActions.map((s, i) => `${i + 1}. **${s.title}** (${s.timeline})\n   ${s.steps.map((step, j) => `${j + 1}. ${step}`).join('\n   ')}\n   *Done when: ${s.successCriteria}*`),
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

  const reportHtml = result
    ? renderReportHtml(buildMonthlyReport({
        snapshot: result.snapshot,
        diagnostics: result.diagnostics,
        readinessScore: result.readinessScore,
        readinessLabel: result.readinessLabel,
        recommendations: result.recommendations,
        artifacts: result.artifacts,
        distributionActions: result.distributionActions,
        deploymentPlan: result.deploymentPlan,
        sprintActions: result.sprintActions,
      }))
    : ''

  return (
    <div className="space-y-6">
      <JourneyBreadcrumb
        journey={completedWorkflows.includes('website-extract') ? NEW_CLIENT_JOURNEY : RETURNING_CLIENT_JOURNEY}
        activeStepIndex={completedWorkflows.includes('website-extract') ? 2 : 0}
        hasResults={!!result}
      />
      <PageHeader title="Monthly GEO Cycle" subtitle="Run a full monthly diagnostic with signal analysis, recommendations, and artifact generation." />

      {!result ? (
        <div className="max-w-2xl mx-auto space-y-6">
          {currentSnapshot ? (
            <>
              <SnapshotSummaryCard snapshot={currentSnapshot} onEdit={() => setEditingSnapshot(true)} />
              <div>
                <h3 className="text-sm font-semibold text-text mb-3">Monthly Change Log <span className="text-text-muted font-normal">(optional)</span></h3>
                <ChangelogForm onChange={setChangelog} />
              </div>
              <button
                onClick={handleRunWithCurrentSnapshot}
                disabled={isRunning}
                className={cn(
                  'w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  !isRunning ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md shadow-primary/25 hover:shadow-lg active:scale-[0.98]' : 'bg-border text-text-muted cursor-not-allowed opacity-60',
                )}
              >
                {isRunning ? 'Running...' : 'Run Monthly Analysis'}
              </button>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-sm font-semibold text-text mb-3">Client GEO Snapshot</h3>
                <SnapshotForm key={extractedData ? 'prefilled' : 'empty'} onSubmit={handleRun} isRunning={isRunning} initialData={extractedData ?? undefined} cycle="monthly" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text mb-3">Monthly Change Log <span className="text-text-muted font-normal">(optional)</span></h3>
                <ChangelogForm onChange={setChangelog} />
              </div>
            </>
          )}

          {error && (
            <div className="text-sm text-danger bg-danger/10 rounded-lg p-3">{error}</div>
          )}
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
                <ExportButton content={exportContent} filename={`geo-monthly-${result.snapshot.businessName}`} reportHtml={reportHtml} />
              </div>
            </div>

            <ResultsSummaryHeader
              metrics={[
                { label: 'Readiness', value: `${result.readinessScore}%`, color: result.readinessScore >= 60 ? 'success' : result.readinessScore >= 40 ? 'warning' : 'danger' },
                { label: 'Issues', value: result.diagnostics.filter((d) => d.status === 'critical' || d.status === 'weak').length, color: 'danger' },
                { label: 'Artifacts', value: result.artifacts.length, color: 'primary' },
                { label: 'Top Priority', value: result.sprintActions[0]?.title?.slice(0, 30) + '...' || '—', color: 'default' },
              ]}
            />
            {result.industryVertical && result.industryVertical !== 'General / Default' && (
              <p className="text-xs text-text-muted text-center">Scored with <span className="font-medium text-text">{result.industryVertical}</span> industry weights</p>
            )}

            <div className="border border-border rounded-xl p-4 bg-surface">
              <h4 className="text-xs font-semibold text-text-muted mb-2 text-center">Signal Overview</h4>
              <SignalRadarChart signals={result.snapshot.signals} />
            </div>

            <CollapsibleSection title="Signal Diagnostics" badge={`${result.diagnostics.filter((d) => d.status === 'critical' || d.status === 'weak').length} issues`} priority="high">
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
                  <div key={i} className="p-3 rounded-lg bg-surface-alt">
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-bold text-primary bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm">{r.title}</span>
                          <PlatformBadge platform={r.platform} />
                          <span className={cn(
                            'text-[10px] font-semibold px-1.5 py-0.5 rounded-full uppercase',
                            r.timeline === 'This week' ? 'bg-danger/10 text-danger' : r.timeline === 'Within 2 weeks' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success',
                          )}>{r.timeline}</span>
                        </div>
                        <p className="text-xs text-text-muted mt-1">{r.description}</p>
                        {r.steps.length > 0 && (
                          <ol className="mt-2 ml-4 list-decimal text-xs text-text-muted space-y-1">
                            {r.steps.map((s) => (
                              <li key={s.step}><span className="font-medium text-text">{s.action}</span> — {s.detail}</li>
                            ))}
                          </ol>
                        )}
                        <p className="mt-2 text-xs text-success"><span className="font-semibold">Success criteria:</span> {r.successCriteria}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="GEO Artifacts" badge={`${result.artifacts.length}`} defaultOpen={false}>
              <div className="flex justify-end mb-2">
                <CopyButton text={allArtifactsText} label="Copy All Artifacts" />
              </div>
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

            <CollapsibleSection title="Implementation Sprint" badge={`${result.sprintActions.length} actions`} priority="high">
              <div className="space-y-4">
                {['This week', 'Within 2 weeks', 'Within 30 days'].map(timeline => {
                  const group = result.sprintActions.filter(s => s.timeline === timeline)
                  if (group.length === 0) return null
                  return (
                    <div key={timeline}>
                      <p className={cn(
                        'text-xs font-semibold uppercase tracking-wide mb-2 px-2 py-1 rounded-full inline-block',
                        timeline === 'This week' ? 'bg-danger/10 text-danger' : timeline === 'Within 2 weeks' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success',
                      )}>{timeline}</p>
                      <div className="space-y-2">
                        {group.map((action, i) => (
                          <div key={i} className="p-3 rounded-lg bg-surface-alt">
                            <p className="font-medium text-sm text-text">{action.title}</p>
                            <ol className="mt-1 ml-4 list-decimal text-xs text-text-muted space-y-0.5">
                              {action.steps.map((step, j) => (
                                <li key={j}>{step}</li>
                              ))}
                            </ol>
                            <p className="mt-1.5 text-xs text-success"><span className="font-semibold">Done when:</span> {action.successCriteria}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Updated Snapshot" defaultOpen={false} priority="low">
              <div className="relative">
                <CopyButton text={result.updatedSnapshotText} label="Copy Snapshot" className="absolute top-2 right-2" />
                <pre className="text-xs font-mono bg-surface-alt rounded-lg p-4 whitespace-pre-wrap">
                  {result.updatedSnapshotText}
                </pre>
              </div>
            </CollapsibleSection>
          </div>
        </div>
      )}

      {editingSnapshot && (
        <SnapshotEditModal
          snapshot={currentSnapshot || result?.snapshot || { businessName: '', primaryCategory: '', secondaryCategory: '', audience: '', geoScope: '', revenueModel: '', regulated: '', competitors: [], signals: { entityClarity: 0, brandMentions: 0, comparisonPresence: 0, faqCoverage: 0, structuredData: 0, reviews: 0, authoritySignals: 0, citations: 0, gbpCompleteness: 0, knowledgeGraphSignals: 0, messagingConsistency: 0, credibilitySignals: 0 }, platformVisibility: { chatgpt: 0, claude: 0, gemini: 0, perplexity: 0, aiOverviews: 0 }, competitorDominance: 0, focusTier: '', primaryBottleneck: '', notes: '' }}
          onSave={setCurrentSnapshot}
          onClose={() => setEditingSnapshot(false)}
        />
      )}
    </div>
  )
}
