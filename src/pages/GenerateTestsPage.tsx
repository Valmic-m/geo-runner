import { useState } from 'react'
import { CollapsibleSection } from '@/components/shared/CollapsibleSection'
import { CopyButton } from '@/components/shared/CopyButton'
import { ExportButton } from '@/components/shared/ExportButton'
import { PlatformBadge } from '@/components/shared/PlatformBadge'
import { SnapshotForm } from '@/components/forms/SnapshotForm'
import { SnapshotSummaryCard } from '@/components/snapshot/SnapshotSummaryCard'
import { SnapshotEditModal } from '@/components/snapshot/SnapshotEditModal'
import { useWorkflow } from '@/hooks/useWorkflow'
import { runGenerateTestsWorkflow } from '@/engine/workflows/generate-tests-workflow'
import type { GenerateTestsInput, GenerateTestsOutput } from '@/engine/workflows/generate-tests-workflow'
import { useSession } from '@/context/SessionContext'
import { PLATFORM_CONFIGS } from '@/engine/constants/platform-config'
import type { ClientGeoSnapshot, PlatformKey } from '@/types/snapshot'
import { cn } from '@/lib/cn'
import { PageHeader } from '@/components/shared/PageHeader'

export function GenerateTestsPage() {
  const { extractedData, clearExtractedData, currentSnapshot, setCurrentSnapshot, markWorkflowCompleted } = useSession()
  const { result, error, isRunning, run } = useWorkflow<GenerateTestsInput, GenerateTestsOutput>(runGenerateTestsWorkflow)
  const [editingSnapshot, setEditingSnapshot] = useState(false)

  const handleRun = (snapshot: ClientGeoSnapshot) => {
    clearExtractedData()
    run({ snapshot })
    setCurrentSnapshot(snapshot)
    markWorkflowCompleted('generate-tests')
  }

  const handleRunWithCurrentSnapshot = () => {
    if (currentSnapshot) handleRun(currentSnapshot)
  }

  const platforms: PlatformKey[] = ['chatgpt', 'claude', 'gemini', 'perplexity', 'aiOverviews']

  const allPromptsText = result
    ? [
        `# AI Visibility Test Prompts - ${result.snapshot.businessName}`,
        '',
        ...platforms.flatMap((p) => {
          const prompts = result.testPrompts.filter((t) => t.platform === p)
          const label = PLATFORM_CONFIGS.find((c) => c.key === p)?.label ?? p
          return [
            `## ${label}`,
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
      <PageHeader title="Generate AI Visibility Tests" subtitle="Produce test prompts to check your client's visibility on ChatGPT, Claude, Gemini, Perplexity, and AI Overviews." />

      {!result ? (
        <div className="max-w-2xl mx-auto space-y-6">
          {currentSnapshot ? (
            <>
              <SnapshotSummaryCard snapshot={currentSnapshot} onEdit={() => setEditingSnapshot(true)} />
              <button
                onClick={handleRunWithCurrentSnapshot}
                disabled={isRunning}
                className={cn(
                  'w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  !isRunning ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md shadow-primary/25 hover:shadow-lg active:scale-[0.98]' : 'bg-border text-text-muted cursor-not-allowed opacity-60',
                )}
              >
                {isRunning ? 'Running...' : 'Generate Test Prompts'}
              </button>
            </>
          ) : (
            <div>
              <h3 className="text-sm font-semibold text-text mb-3">Client GEO Snapshot</h3>
              <SnapshotForm onSubmit={handleRun} isRunning={isRunning} initialData={extractedData ?? undefined} />
            </div>
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
                <CollapsibleSection key={platform} title={PLATFORM_CONFIGS.find((c) => c.key === platform)?.label ?? platform} badge={`${prompts.length} prompts`}>
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
