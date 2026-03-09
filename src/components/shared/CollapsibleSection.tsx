import { useState, type ReactNode } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'

interface CollapsibleSectionProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
  badge?: string
  priority?: 'high' | 'normal' | 'low'
}

export function CollapsibleSection({ title, children, defaultOpen = true, badge, priority = 'normal' }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={cn(
      'border border-border rounded-lg bg-surface overflow-hidden',
      priority === 'high' && 'border-l-2 border-l-primary',
      priority === 'low' && 'opacity-80',
    )}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-surface-alt transition-colors"
      >
        <div className="flex items-center gap-2">
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span className={cn('font-medium text-sm', priority === 'low' && 'text-text-muted')}>{title}</span>
          {badge && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              {badge}
            </span>
          )}
        </div>
      </button>
      <div className={cn('px-4 pb-4', !open && 'hidden')}>
        {children}
      </div>
    </div>
  )
}
