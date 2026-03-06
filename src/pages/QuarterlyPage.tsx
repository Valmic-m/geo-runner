import { useState } from 'react'
import { Play } from 'lucide-react'
import { TextInput } from '@/components/shared/TextInput'
import { SignalBar } from '@/components/shared/SignalBar'
import { ScoreGauge } from '@/components/shared/ScoreGauge'
import { CollapsibleSection } from '@/components/shared/CollapsibleSection'
import { CopyButton } from '@/components/shared/CopyButton'
import { ExportButton } from '@/components/shared/ExportButton'
import { useWorkflow } from '@/hooks/useWorkflow'
import { runQuarterlyWorkflow } from '@/engine/workflows/quarterly-workflow'
import type { QuarterlyInput, QuarterlyOutput } from '@/engine/workflows/quarterly-workflow'
import { SNAPSHOT_TEMPLATE } from '@/engine/parsers/snapshot-parser'
import { AUTHORITY_TEMPLATE } from '@/engine/parsers/authority-parser'
import { cn } from '@/lib/cn'

export function QuarterlyPage() {
  const [snapshotText, setSnapshotText] = useState('')
  const [authorityText, setAuthorityText] = useState('')

  const { result, error, run } = useWorkflow<QuarterlyInput, QuarterlyOutput>(runQuarterlyWorkflow)

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
        <p className="text-xs text-text-muted mt-1">Use every 3 months for a deeper look at authority and citation gaps. Identifies external sites to target for mentions, maps entity relationships, and plans content expansion.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <TextInput label="Client GEO Snapshot" value={snapshotText} onChange={setSnapshotText} template={SNAPSHOT_TEMPLATE} required />
          <TextInput label="Authority Snapshot" value={authorityText} onChange={setAuthorityText} template={AUTHORITY_TEMPLATE} rows={8} />
          <button
            onClick={() => run({ snapshotText, authorityText })}
            disabled={!snapshotText.trim()}
            className={cn(
              'w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
              snapshotText.trim() ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-border text-text-muted cursor-not-allowed',
            )}
          >
            <Play size={16} /> Run Quarterly Review
          </button>
          {error && <div className="text-sm text-danger bg-danger/10 rounded-lg p-3">{error}</div>}
        </div>

        <div className="space-y-4">
          {!result && (
            <div className="text-center py-20 text-text-muted text-sm border border-dashed border-border rounded-lg">
              Paste snapshot and authority data, then run the review.
            </div>
          )}

          {result && (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}
