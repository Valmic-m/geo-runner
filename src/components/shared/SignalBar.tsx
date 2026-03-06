import { cn } from '@/lib/cn'

interface SignalBarProps {
  label: string
  score: number
  maxScore?: number
}

export function SignalBar({ label, score, maxScore = 5 }: SignalBarProps) {
  const pct = (score / maxScore) * 100
  const color =
    score <= 1 ? 'bg-danger' :
    score <= 2 ? 'bg-warning' :
    score <= 3 ? 'bg-yellow-400' :
    'bg-success'

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-text-muted w-44 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-2.5 bg-border/50 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${pct}%` }} />
      </div>
      <span className={cn('text-sm font-medium w-8 text-right', score <= 2 ? 'text-danger' : 'text-text')}>
        {score}
      </span>
    </div>
  )
}
