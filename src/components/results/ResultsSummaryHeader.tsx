import { cn } from '@/lib/cn'

interface MetricItem {
  label: string
  value: string | number
  color?: 'success' | 'warning' | 'danger' | 'primary' | 'default'
}

interface ResultsSummaryHeaderProps {
  metrics: MetricItem[]
  className?: string
}

const colorMap = {
  success: 'text-emerald-400',
  warning: 'text-amber-400',
  danger: 'text-red-400',
  primary: 'text-blue-400',
  default: 'text-white',
}

export function ResultsSummaryHeader({ metrics, className }: ResultsSummaryHeaderProps) {
  return (
    <div className={cn('grid gap-3 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-6 shadow-lg divide-x divide-white/10', className)} style={{ gridTemplateColumns: `repeat(${Math.min(metrics.length, 4)}, 1fr)` }}>
      {metrics.map((metric) => (
        <div key={metric.label} className="text-center">
          <p className={cn('text-3xl font-extrabold', colorMap[metric.color || 'default'])}>
            {metric.value}
          </p>
          <p className="text-xs text-slate-400 mt-1">{metric.label}</p>
        </div>
      ))}
    </div>
  )
}
