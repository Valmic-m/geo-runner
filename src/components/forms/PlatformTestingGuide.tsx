import { useState } from 'react'
import { ExternalLink, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react'
import type { PlatformKey } from '@/types/snapshot'
import { PLATFORM_MAP } from '@/engine/constants/platform-config'
import { generateQuickTestPrompts } from '@/engine/generators/test-prompt-generator'
import { cn } from '@/lib/cn'

interface PlatformTestingGuideProps {
  platformKey: PlatformKey
  templateVars: { businessName: string; category: string; location: string }
}

function QuickCopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="p-1 rounded hover:bg-surface-alt transition-colors shrink-0"
      title="Copy query"
    >
      {copied ? <Check size={12} className="text-success" /> : <Copy size={12} className="text-text-muted" />}
    </button>
  )
}

export function PlatformTestingGuide({ platformKey, templateVars }: PlatformTestingGuideProps) {
  const [expanded, setExpanded] = useState(false)
  const config = PLATFORM_MAP[platformKey]
  if (!config) return null

  const queries = generateQuickTestPrompts(
    templateVars.businessName,
    templateVars.category,
    templateVars.location,
    platformKey,
  )

  return (
    <div className="mb-3 rounded-lg border border-primary/20 bg-primary/5 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-primary/10 transition-colors"
      >
        <span className="text-xs font-medium text-primary">
          How to test on {config.label}
        </span>
        {expanded ? <ChevronUp size={14} className="text-primary" /> : <ChevronDown size={14} className="text-primary" />}
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-2">
          <p className="text-xs text-text-muted">
            Open {config.label}, try these queries, and answer the questions below based on what you observe.
          </p>

          <div className="space-y-1">
            {queries.map((q, i) => (
              <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded bg-white/60 dark:bg-surface text-xs">
                <span className={cn(
                  'w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0',
                  'bg-primary/15 text-primary',
                )}>
                  {i + 1}
                </span>
                <span className="flex-1 font-mono text-text">{q}</span>
                <QuickCopyButton text={q} />
              </div>
            ))}
          </div>

          <a
            href={config.testUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline mt-1"
          >
            Open {config.label} <ExternalLink size={11} />
          </a>
        </div>
      )}
    </div>
  )
}
