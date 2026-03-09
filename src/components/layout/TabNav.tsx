import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { Home, Globe, FlaskConical, Calendar, BarChart3, RotateCcw } from 'lucide-react'
import { useExtractedData } from '@/context/ExtractedDataContext'
import type { CompletedWorkflow } from '@/context/ExtractedDataContext'

const tabs: { to: string; label: string; icon: typeof Home; workflow?: CompletedWorkflow }[] = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/website-extract', label: 'Website Extract', icon: Globe, workflow: 'website-extract' },
  { to: '/generate-tests', label: 'Generate Tests', icon: FlaskConical, workflow: 'generate-tests' },
  { to: '/monthly', label: 'Monthly', icon: Calendar, workflow: 'monthly' },
  { to: '/quarterly', label: 'Quarterly', icon: BarChart3, workflow: 'quarterly' },
  { to: '/annual', label: 'Annual', icon: RotateCcw, workflow: 'annual' },
]

export function TabNav() {
  const { completedWorkflows } = useExtractedData()

  return (
    <nav className="max-w-7xl mx-auto px-4 flex gap-1 -mb-px overflow-x-auto">
      {tabs.map((tab) => {
        const isCompleted = tab.workflow ? completedWorkflows.includes(tab.workflow) : false
        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-muted hover:text-text hover:border-border',
              )
            }
          >
            <tab.icon size={16} />
            {tab.label}
            {isCompleted && (
              <span className="w-1.5 h-1.5 rounded-full bg-success shrink-0" title="Completed this session" />
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}
