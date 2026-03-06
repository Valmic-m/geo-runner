import { cn } from '@/lib/cn'

interface ScoreGaugeProps {
  score: number
  label: string
  subtitle?: string
}

export function ScoreGauge({ score, label, subtitle }: ScoreGaugeProps) {
  const color =
    score >= 80 ? 'text-success' :
    score >= 60 ? 'text-yellow-500' :
    score >= 40 ? 'text-warning' :
    'text-danger'

  return (
    <div className="flex flex-col items-center p-4 rounded-xl border border-border bg-surface">
      <div className={cn('text-4xl font-bold', color)}>{score}%</div>
      <div className="text-sm font-medium text-text mt-1">{label}</div>
      {subtitle && <div className="text-xs text-text-muted mt-0.5">{subtitle}</div>}
    </div>
  )
}
