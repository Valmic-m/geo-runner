import { cn } from '@/lib/cn'

interface SignalBarProps {
  label: string
  score: number
  maxScore?: number
}

export function SignalBar({ label, score, maxScore = 5 }: SignalBarProps) {
  const pct = (score / maxScore) * 100
  const gradientColor =
    score <= 1 ? 'from-red-400 to-red-500' :
    score <= 2 ? 'from-amber-400 to-amber-500' :
    score <= 3 ? 'from-yellow-400 to-yellow-500' :
    'from-emerald-400 to-emerald-500'

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-text-muted w-44 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
        <div
          className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out', gradientColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={cn('text-sm font-medium w-8 text-right tabular-nums', score <= 2 ? 'text-danger' : 'text-text')}>
        {score}
      </span>
    </div>
  )
}
