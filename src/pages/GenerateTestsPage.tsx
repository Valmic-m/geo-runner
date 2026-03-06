import { CollapsibleSection } from '@/components/shared/CollapsibleSection'
import { CopyButton } from '@/components/shared/CopyButton'
import { ExportButton } from '@/components/shared/ExportButton'
import { PlatformBadge } from '@/components/shared/PlatformBadge'
import { SnapshotForm } from '@/components/forms/SnapshotForm'
import { useWorkflow } from '@/hooks/useWorkflow'
import { runGenerateTestsWorkflow } from '@/engine/workflows/generate-tests-workflow'
import type { GenerateTestsInput, GenerateTestsOutput } from '@/engine/workflows/generate-tests-workflow'
import { useExtractedData } from '@/context/ExtractedDataContext'
import type { ClientGeoSnapshot, PlatformKey } from '@/types/snapshot'

export function GenerateTestsPage() {
  const { extractedData, clearExtractedData } = useExtractedData()
  const { result, error, isRunning, run } = useWorkflow<GenerateTestsInput, GenerateTestsOutput>(runGenerateTestsWorkflow)

  const handleRun = (snapshot: ClientGeoSnapshot) => {
    clearExtractedData()
    run({ snapshot })
  }

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
        <p className="text-xs text-text-muted mt-1">Use the generated prompts to test each AI platform and see if the client is mentioned, recommended, or absent. Run before your first monthly cycle (baseline) and monthly thereafter.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-text">Client GEO Snapshot</h3>
          <SnapshotForm onSubmit={handleRun} isRunning={isRunning} initialData={extractedData ?? undefined} />
          {error && <div className="text-sm text-danger bg-danger/10 rounded-lg p-3">{error}</div>}
        </div>

        <div className="space-y-4">
          {!result && (
            <div className="text-center py-20 text-text-muted text-sm border border-dashed border-border rounded-lg">
              Fill out the snapshot form and generate test prompts for AI platforms.
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
