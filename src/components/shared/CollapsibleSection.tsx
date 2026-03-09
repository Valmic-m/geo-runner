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
      'border border-border rounded-lg bg-surface overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200',
      priority === 'high' && 'border-l-[3px] border-l-primary',
      priority === 'low' && 'opacity-80',
    )}>
      <button
        onClick={() => setOpen(!open)}
        className="group w-full flex items-center justify-between px-4 py-3 text-left hover:bg-surface-alt transition-all duration-200"
      >
        <div className="flex items-center gap-2">
          {open
            ? <ChevronDown size={16} className="group-hover:text-primary transition-colors duration-200" />
            : <ChevronRight size={16} className="group-hover:text-primary transition-colors duration-200" />
          }
          <span className={cn('font-medium text-sm', priority === 'low' && 'text-text-muted')}>{title}</span>
          {badge && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium shadow-sm">
              {badge}
            </span>
          )}
        </div>
      </button>
      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
