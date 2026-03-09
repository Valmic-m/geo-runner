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
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  primary: 'text-primary',
  default: 'text-text',
}

export function ResultsSummaryHeader({ metrics, className }: ResultsSummaryHeaderProps) {
  return (
    <div className={cn('grid gap-3 rounded-xl border border-border bg-surface p-4', className)} style={{ gridTemplateColumns: `repeat(${Math.min(metrics.length, 4)}, 1fr)` }}>
      {metrics.map((metric) => (
        <div key={metric.label} className="text-center">
          <p className={cn('text-2xl font-bold', colorMap[metric.color || 'default'])}>
            {metric.value}
          </p>
          <p className="text-xs text-text-muted mt-0.5">{metric.label}</p>
        </div>
      ))}
    </div>
  )
}
