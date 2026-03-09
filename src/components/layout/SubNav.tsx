import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { useSession } from '@/context/SessionContext'
import type { CompletedWorkflow } from '@/context/SessionContext'

interface SubNavItem {
  to: string
  label: string
  workflow?: CompletedWorkflow
}

interface SubNavProps {
  items: SubNavItem[]
}

export function SubNav({ items }: SubNavProps) {
  const { completedWorkflows } = useSession()

  return (
    <div className="max-w-7xl mx-auto px-4 pb-3 flex gap-2">
      {items.map((item) => {
        const isCompleted = item.workflow ? completedWorkflows.includes(item.workflow) : false
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-sm shadow-primary/25'
                  : 'bg-surface-alt text-text-muted hover:text-text hover:bg-border hover:shadow-sm',
              )
            }
          >
            {item.label}
            {isCompleted && (
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse shrink-0" title="Completed this session" />
            )}
          </NavLink>
        )
      })}
    </div>
  )
}
