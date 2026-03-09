import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { SIGNAL_DEFINITIONS, SIGNAL_MAP } from '@/engine/constants/signal-definitions'
import { PLATFORM_CONFIGS } from '@/engine/constants/platform-config'

interface ReferenceDrawerProps {
  onClose: () => void
}

const signalsByTier = (() => {
  const sorted = [...SIGNAL_DEFINITIONS].sort((a, b) => b.weight - a.weight)
  return {
    high: sorted.filter((s) => s.weight >= 0.1),
    medium: sorted.filter((s) => s.weight >= 0.08 && s.weight < 0.1),
    supporting: sorted.filter((s) => s.weight < 0.08),
  }
})()

const tiers = [
  { key: 'high' as const, label: 'High Impact', borderColor: 'border-l-primary' },
  { key: 'medium' as const, label: 'Medium Impact', borderColor: 'border-l-yellow-500' },
  { key: 'supporting' as const, label: 'Supporting', borderColor: 'border-l-border' },
]

export function ReferenceDrawer({ onClose }: ReferenceDrawerProps) {
  const backdropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose()
  }

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-black/40"
    >
      <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-surface border-l border-border shadow-xl overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-border px-5 py-4 flex items-center justify-between z-10">
          <h2 className="font-semibold text-text">GEO Reference Guide</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-alt transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-8">
          {/* What is GEO */}
          <div>
            <h3 className="text-sm font-semibold text-text mb-2">What is GEO?</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              AI platforms like ChatGPT, Claude, Gemini, Perplexity, and Google AI Overviews now influence buying decisions by
              recommending brands directly to users. Generative Engine Optimization (GEO) is the
              practice of strengthening the signals these AI models use to decide which brands to
              mention, recommend, and trust.
            </p>
          </div>

          {/* The 12 Signals */}
          <div>
            <h3 className="text-sm font-semibold text-text mb-1">The 12 GEO Signals</h3>
            <p className="text-xs text-text-muted mb-3">
              Each signal is scored 1-5. The tool identifies your weakest signals and generates targeted content.
            </p>
            <div className="space-y-3">
              {tiers.map((tier) => (
                <div key={tier.key}>
                  <div className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">
                    {tier.label}
                  </div>
                  <div className="space-y-1.5">
                    {signalsByTier[tier.key].map((signal) => (
                      <div
                        key={signal.key}
                        className={`border-l-2 ${tier.borderColor} bg-surface-alt rounded-r-lg px-3 py-2`}
                      >
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-medium text-text">{signal.label}</span>
                          <span className="text-xs text-text-muted">
                            {Math.round(signal.weight * 100)}%
                          </span>
                        </div>
                        <p className="text-xs text-text-muted mt-0.5">{signal.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Priorities */}
          <div>
            <h3 className="text-sm font-semibold text-text mb-1">Platform Priorities</h3>
            <p className="text-xs text-text-muted mb-3">
              Each AI platform weighs signals differently. Recommendations are tailored to each.
            </p>
            <div className="space-y-3">
              {PLATFORM_CONFIGS.map((platform) => (
                <div
                  key={platform.key}
                  className="rounded-lg border border-border bg-surface-alt p-3"
                >
                  <h4 className="font-medium text-xs text-text">{platform.label}</h4>
                  <p className="text-xs text-text-muted mt-0.5">{platform.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {platform.prioritySignals.map((key) => (
                      <span
                        key={key}
                        className="text-xs bg-surface px-2 py-0.5 rounded-full text-text-muted"
                      >
                        {SIGNAL_MAP[key].label}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workflow Guide */}
          <div>
            <h3 className="text-sm font-semibold text-text mb-2">Workflow Guide</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-surface-alt">
                <p className="font-medium text-text">1. Website Scan (new clients)</p>
                <p className="text-text-muted mt-0.5">Scan a URL to extract categories, audience, and auto-estimate signals.</p>
              </div>
              <div className="p-3 rounded-lg bg-surface-alt">
                <p className="font-medium text-text">2. AI Visibility Tests (monthly baseline)</p>
                <p className="text-text-muted mt-0.5">Generate test prompts for all 5 AI platforms.</p>
              </div>
              <div className="p-3 rounded-lg bg-surface-alt">
                <p className="font-medium text-text">3. Monthly Cycle (every month)</p>
                <p className="text-text-muted mt-0.5">Full diagnostic with scores, artifacts, and deployment plan.</p>
              </div>
              <div className="p-3 rounded-lg bg-surface-alt">
                <p className="font-medium text-text">4. Quarterly Review (every 3 months)</p>
                <p className="text-text-muted mt-0.5">Authority analysis, citation opportunities, entity mapping.</p>
              </div>
              <div className="p-3 rounded-lg bg-surface-alt">
                <p className="font-medium text-text">5. Annual Reset (yearly)</p>
                <p className="text-text-muted mt-0.5">Category precision, entity redefinition, positioning refresh.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
