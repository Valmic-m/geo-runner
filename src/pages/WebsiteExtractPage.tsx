import { useState } from 'react'
import { Play } from 'lucide-react'
import { TextInput } from '@/components/shared/TextInput'
import { CollapsibleSection } from '@/components/shared/CollapsibleSection'
import { CopyButton } from '@/components/shared/CopyButton'
import { ExportButton } from '@/components/shared/ExportButton'
import { useWorkflow } from '@/hooks/useWorkflow'
import { runWebsiteExtractWorkflow } from '@/engine/workflows/website-extract-workflow'
import type { WebsiteExtractInput, WebsiteExtractOutput } from '@/engine/workflows/website-extract-workflow'
import { cn } from '@/lib/cn'

export function WebsiteExtractPage() {
  const [websiteContent, setWebsiteContent] = useState('')

  const { result, error, run } = useWorkflow<WebsiteExtractInput, WebsiteExtractOutput>(runWebsiteExtractWorkflow)

  const exportContent = result
    ? [
        '# Website Content Analysis',
        '',
        '## Detected Categories',
        ...(result.analysis.categories.length > 0 ? result.analysis.categories.map((c) => `- ${c}`) : ['- None detected']),
        '',
        '## Detected Audience',
        ...(result.analysis.audience.length > 0 ? result.analysis.audience.map((a) => `- ${a}`) : ['- None detected']),
        '',
        '## Differentiators',
        ...(result.analysis.differentiators.length > 0 ? result.analysis.differentiators.map((d) => `- ${d}`) : ['- None detected']),
        '',
        `## Content Tone: ${result.analysis.tone}`,
        '',
        '## Missing Trust Signals',
        ...result.analysis.missingTrustSignals.map((s) => `- ${s}`),
        '',
        '## Recommendations',
        ...result.analysis.recommendations.map((r) => `- ${r}`),
      ].join('\n')
    : ''

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-text">Website Content Extract</h2>
        <p className="text-sm text-text-muted mt-1">Analyze pasted website content to extract categories, audience, differentiators, and identify missing trust signals.</p>
        <p className="text-xs text-text-muted mt-1">Recommended starting point for new clients. Paste website content and the tool extracts the information needed to fill out a Client GEO Snapshot.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <TextInput
            label="Website Content"
            value={websiteContent}
            onChange={setWebsiteContent}
            required
            rows={20}
            placeholder="Copy and paste the main content from the client's website here (homepage, about page, service pages)..."
          />
          <button
            onClick={() => run({ websiteContent })}
            disabled={!websiteContent.trim()}
            className={cn(
              'w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
              websiteContent.trim() ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-border text-text-muted cursor-not-allowed',
            )}
          >
            <Play size={16} /> Analyze Website Content
          </button>
          {error && <div className="text-sm text-danger bg-danger/10 rounded-lg p-3">{error}</div>}
        </div>

        <div className="space-y-4">
          {!result && (
            <div className="text-center py-20 text-text-muted text-sm border border-dashed border-border rounded-lg">
              Paste website content and run the analysis.
            </div>
          )}

          {result && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-text">Website Analysis</h3>
                <div className="flex gap-2">
                  <CopyButton text={exportContent} label="Copy All" />
                  <ExportButton content={exportContent} filename="geo-website-extract" />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border bg-surface">
                <div className="text-sm">
                  <span className="font-medium">Content Tone:</span>{' '}
                  <span className={cn(
                    result.analysis.tone === 'heavily promotional' ? 'text-danger' :
                    result.analysis.tone === 'moderately promotional' ? 'text-warning' : 'text-success',
                  )}>
                    {result.analysis.tone}
                  </span>
                </div>
              </div>

              <CollapsibleSection title="Detected Categories" badge={`${result.analysis.categories.length}`}>
                {result.analysis.categories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.analysis.categories.map((c, i) => (
                      <span key={i} className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary">{c}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-warning">No clear categories detected. The website needs explicit category positioning.</p>
                )}
              </CollapsibleSection>

              <CollapsibleSection title="Detected Audience" badge={`${result.analysis.audience.length}`}>
                {result.analysis.audience.length > 0 ? (
                  <ul className="space-y-1">
                    {result.analysis.audience.map((a, i) => (
                      <li key={i} className="text-sm">{a}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-warning">Target audience is unclear from the content.</p>
                )}
              </CollapsibleSection>

              <CollapsibleSection title="Differentiators" badge={`${result.analysis.differentiators.length}`}>
                {result.analysis.differentiators.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.analysis.differentiators.map((d, i) => (
                      <span key={i} className="text-sm px-3 py-1 rounded-full bg-surface-alt text-text">{d}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-warning">No clear differentiators detected.</p>
                )}
              </CollapsibleSection>

              <CollapsibleSection title="Missing Trust Signals" badge={`${result.analysis.missingTrustSignals.length}`}>
                <ul className="space-y-1">
                  {result.analysis.missingTrustSignals.map((s, i) => (
                    <li key={i} className="text-sm text-danger flex items-start gap-2">
                      <span className="mt-0.5">&#x26A0;</span> {s}
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="Recommendations" badge={`${result.analysis.recommendations.length}`}>
                <ul className="space-y-2">
                  {result.analysis.recommendations.map((r, i) => (
                    <li key={i} className="text-sm p-3 rounded-lg bg-surface-alt">{r}</li>
                  ))}
                </ul>
              </CollapsibleSection>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
