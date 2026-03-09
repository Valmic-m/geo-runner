import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { LayoutDashboard, ScanSearch, Workflow } from 'lucide-react'
import { SubNav } from './SubNav'
import type { CompletedWorkflow } from '@/context/SessionContext'

interface NavGroup {
  to?: string
  label: string
  icon: typeof LayoutDashboard
  pathPrefix?: string
  children?: { to: string; label: string; workflow?: CompletedWorkflow }[]
}

const navGroups: NavGroup[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  {
    label: 'Setup',
    icon: ScanSearch,
    pathPrefix: '/setup',
    children: [
      { to: '/setup/extract', label: 'Website Scan', workflow: 'website-extract' },
      { to: '/setup/tests', label: 'AI Visibility Tests', workflow: 'generate-tests' },
    ],
  },
  {
    label: 'Workflows',
    icon: Workflow,
    pathPrefix: '/workflows',
    children: [
      { to: '/workflows/monthly', label: 'Monthly Cycle', workflow: 'monthly' },
      { to: '/workflows/quarterly', label: 'Quarterly Review', workflow: 'quarterly' },
      { to: '/workflows/annual', label: 'Annual Reset', workflow: 'annual' },
    ],
  },
]

export function TabNav() {
  const location = useLocation()

  const activeGroup = navGroups.find((group) => {
    if (group.to) return location.pathname === group.to || location.pathname === ''
    if (group.pathPrefix) return location.pathname.startsWith(group.pathPrefix)
    return false
  })

  return (
    <div>
      <nav className="max-w-7xl mx-auto px-4 flex gap-1 -mb-px">
        {navGroups.map((group) => {
          const isActive = group === activeGroup
          const to = group.to || group.children?.[0]?.to || '/'

          return (
            <NavLink
              key={group.label}
              to={to}
              end={group.to === '/'}
              className={() =>
                cn(
                  'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-muted hover:text-text hover:bg-surface-alt/50 rounded-t-lg',
                )
              }
            >
              <span className={cn(
                'p-1 rounded-md transition-colors duration-200',
                isActive && 'bg-primary/10',
              )}>
                <group.icon size={16} />
              </span>
              {group.label}
            </NavLink>
          )
        })}
      </nav>

      {activeGroup?.children && (
        <div className="border-t border-border/50 bg-surface pt-3">
          <SubNav items={activeGroup.children} />
        </div>
      )}
    </div>
  )
}
