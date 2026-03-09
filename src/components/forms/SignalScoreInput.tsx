import { CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react'
import { Tooltip } from '@/components/shared/Tooltip'
import { cn } from '@/lib/cn'
import type { SignalConfidence } from '@/engine/analyzers/signal-estimator'

interface SignalScoreInputProps {
  label: string
  description: string
  value: number
  onChange: (value: number) => void
  confidence?: SignalConfidence
  reason?: string
  previousValue?: number
}

const SCORE_LABELS: Record<number, string> = {
  1: 'Not present',
  2: 'Minimal',
  3: 'Basic',
  4: 'Good',
  5: 'Strong',
}

function ConfidenceIcon({ confidence }: { confidence: SignalConfidence }) {
  switch (confidence) {
    case 'high':
      return <span title="High confidence estimate"><CheckCircle2 size={14} className="text-success shrink-0" /></span>
    case 'medium':
      return <span title="Medium confidence — review recommended"><AlertCircle size={14} className="text-warning shrink-0" /></span>
    case 'low':
      return <span title="Low confidence — please verify"><HelpCircle size={14} className="text-text-muted shrink-0" /></span>
    case 'unknown':
      return <span title="Could not estimate — please score manually"><HelpCircle size={14} className="text-text-muted/50 shrink-0" /></span>
  }
}

function TrendIndicator({ current, previous }: { current: number; previous: number }) {
  if (current === previous || current === 0 || previous === 0) return null
  const delta = current - previous
  if (delta > 0) return <span className="text-xs text-success font-medium">+{delta}</span>
  return <span className="text-xs text-danger font-medium">{delta}</span>
}

export function SignalScoreInput({ label, description, value, onChange, confidence, reason, previousValue }: SignalScoreInputProps) {
  return (
    <div className="py-2">
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            {confidence && <ConfidenceIcon confidence={confidence} />}
            <span className="text-sm font-medium text-text truncate">{label}</span>
            <Tooltip content={description} />
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((score) => (
            <button
              key={score}
              type="button"
              onClick={() => onChange(score)}
              title={SCORE_LABELS[score]}
              className={cn(
                'w-8 h-8 rounded-md text-xs font-bold transition-all',
                value === score
                  ? score <= 2
                    ? 'bg-danger text-white ring-2 ring-danger/30'
                    : score === 3
                      ? 'bg-warning text-white ring-2 ring-warning/30'
                      : 'bg-success text-white ring-2 ring-success/30'
                  : 'bg-surface-alt text-text-muted hover:bg-border',
              )}
            >
              {score}
            </button>
          ))}
        </div>
        <span className="text-xs text-text-muted w-20 text-right flex items-center justify-end gap-1">
          {value > 0 ? SCORE_LABELS[value] : '—'}
          {previousValue !== undefined && previousValue > 0 && value > 0 && (
            <TrendIndicator current={value} previous={previousValue} />
          )}
        </span>
      </div>
      {reason && (
        <p className="text-xs text-text-muted mt-0.5 ml-5 truncate">{reason}</p>
      )}
    </div>
  )
}
