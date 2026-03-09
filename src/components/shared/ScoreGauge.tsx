import { cn } from '@/lib/cn'

interface ScoreGaugeProps {
  score: number
  label: string
  subtitle?: string
}

export function ScoreGauge({ score, label, subtitle }: ScoreGaugeProps) {
  const color =
    score >= 80 ? 'text-emerald-500' :
    score >= 60 ? 'text-yellow-500' :
    score >= 40 ? 'text-warning' :
    'text-danger'

  const strokeColor =
    score >= 80 ? '#10b981' :
    score >= 60 ? '#eab308' :
    score >= 40 ? '#f59e0b' :
    '#ef4444'

  const radius = 40
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center p-4 rounded-xl border border-border bg-surface shadow-md">
      <div className="relative w-24 h-24 mb-1">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="8"
          />
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('text-2xl font-extrabold', color)}>{score}%</span>
        </div>
      </div>
      <div className="text-sm font-medium text-text">{label}</div>
      {subtitle && <div className="text-xs text-text-muted mt-0.5">{subtitle}</div>}
    </div>
  )
}
