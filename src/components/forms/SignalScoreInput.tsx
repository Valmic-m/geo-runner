import { Tooltip } from '@/components/shared/Tooltip'
import { cn } from '@/lib/cn'

interface SignalScoreInputProps {
  label: string
  description: string
  value: number
  onChange: (value: number) => void
}

const SCORE_LABELS: Record<number, string> = {
  1: 'Not present',
  2: 'Minimal',
  3: 'Basic',
  4: 'Good',
  5: 'Strong',
}

export function SignalScoreInput({ label, description, value, onChange }: SignalScoreInputProps) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
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
      <span className="text-xs text-text-muted w-20 text-right">
        {value > 0 ? SCORE_LABELS[value] : '—'}
      </span>
    </div>
  )
}
