import { useState } from 'react'
import { Play } from 'lucide-react'
import { TextInput } from '@/components/shared/TextInput'
import { CollapsibleSection } from '@/components/shared/CollapsibleSection'
import { CopyButton } from '@/components/shared/CopyButton'
import { ExportButton } from '@/components/shared/ExportButton'
import { PlatformBadge } from '@/components/shared/PlatformBadge'
import { useWorkflow } from '@/hooks/useWorkflow'
import { runGenerateTestsWorkflow } from '@/engine/workflows/generate-tests-workflow'
import type { GenerateTestsInput, GenerateTestsOutput } from '@/engine/workflows/generate-tests-workflow'
import { SNAPSHOT_TEMPLATE } from '@/engine/parsers/snapshot-parser'
import type { PlatformKey } from '@/types/snapshot'
import { cn } from '@/lib/cn'

export function GenerateTestsPage() {
  const [snapshotText, setSnapshotText] = useState('')

  const { result, error, run } = useWorkflow<GenerateTestsInput, GenerateTestsOutput>(runGenerateTestsWorkflow)

  const platforms: PlatformKey[] = ['chatgpt', 'claude', 'gemini']

  const allPromptsText = result
    ? [
        `# AI Visibility Test Prompts - ${result.snapshot.businessName}`,
        '',
        ...platforms.flatMap((p) => {
          const prompts = result.testPrompts.filter((t) => t.platform === p)
          return [
            `## ${p.charAt(0).toUpperCase() + p.slice(1)}`,
            ...prompts.map((t) => `- [${t.category}] ${t.prompt}`),
            '',
          ]
        }),
        '## Interactive Evaluation Prompt',
        result.interactivePrompt,
      ].join('\n')
    : ''

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-text">Generate AI Visibility Tests</h2>
        <p className="text-sm text-text-muted mt-1">Produce test prompts to check your client's visibility on ChatGPT, Claude, and Gemini.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <TextInput label="Client GEO Snapshot" value={snapshotText} onChange={setSnapshotText} template={SNAPSHOT_TEMPLATE} required />
          <button
            onClick={() => run({ snapshotText })}
            disabled={!snapshotText.trim()}
            className={cn(
              'w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
              snapshotText.trim() ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-border text-text-muted cursor-not-allowed',
            )}
          >
            <Play size={16} /> Generate Test Prompts
          </button>
          {error && <div className="text-sm text-danger bg-danger/10 rounded-lg p-3">{error}</div>}
        </div>

        <div className="space-y-4">
          {!result && (
            <div className="text-center py-20 text-text-muted text-sm border border-dashed border-border rounded-lg">
              Paste a snapshot and generate test prompts for AI platforms.
            </div>
          )}

          {result && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-text">Test Prompts: {result.snapshot.businessName}</h3>
                <div className="flex gap-2">
                  <CopyButton text={allPromptsText} label="Copy All" />
                  <ExportButton content={allPromptsText} filename={`geo-tests-${result.snapshot.businessName}`} />
                </div>
              </div>

              {platforms.map((platform) => {
                const prompts = result.testPrompts.filter((t) => t.platform === platform)
                const categories = [...new Set(prompts.map((p) => p.category))]

                return (
                  <CollapsibleSection key={platform} title={platform.charAt(0).toUpperCase() + platform.slice(1)} badge={`${prompts.length} prompts`}>
                    {categories.map((cat) => (
                      <div key={cat} className="mb-3">
                        <p className="text-xs font-medium text-text-muted mb-1">{cat} Queries</p>
                        <div className="space-y-1">
                          {prompts
                            .filter((p) => p.category === cat)
                            .map((p, i) => (
                              <div key={i} className="flex items-center gap-2 p-2 rounded bg-surface-alt">
                                <PlatformBadge platform={platform} />
                                <span className="text-sm flex-1">{p.prompt}</span>
                                <CopyButton text={p.prompt} label="Copy" />
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </CollapsibleSection>
                )
              })}

              <CollapsibleSection title="Interactive Evaluation Prompt">
                <div className="relative">
                  <CopyButton text={result.interactivePrompt} className="absolute top-2 right-2" />
                  <pre className="text-xs font-mono bg-surface-alt rounded-lg p-4 whitespace-pre-wrap">{result.interactivePrompt}</pre>
                </div>
                <p className="text-xs text-text-muted mt-2">
                  Run this prompt on each AI platform and paste the response back into the Monthly workflow for analysis.
                </p>
              </CollapsibleSection>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
