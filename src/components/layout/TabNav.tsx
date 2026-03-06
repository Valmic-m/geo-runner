import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { Calendar, BarChart3, RotateCcw, FlaskConical, Globe } from 'lucide-react'

const tabs = [
  { to: '/', label: 'Home', icon: BarChart3 },
  { to: '/monthly', label: 'Monthly', icon: Calendar },
  { to: '/quarterly', label: 'Quarterly', icon: BarChart3 },
  { to: '/annual', label: 'Annual', icon: RotateCcw },
  { to: '/generate-tests', label: 'Generate Tests', icon: FlaskConical },
  { to: '/website-extract', label: 'Website Extract', icon: Globe },
]

export function TabNav() {
  return (
    <nav className="max-w-7xl mx-auto px-4 flex gap-1 -mb-px overflow-x-auto">
      {tabs.map((tab) => (
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
        </NavLink>
      ))}
    </nav>
  )
}
