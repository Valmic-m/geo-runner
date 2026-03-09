import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { useSession } from '@/context/SessionContext'
import type { JourneyDefinition } from '@/lib/journey-definitions'
import { cn } from '@/lib/cn'

interface JourneyBreadcrumbProps {
  journey: JourneyDefinition
  activeStepIndex: number
  hasResults?: boolean
}

export function JourneyBreadcrumb({ journey, activeStepIndex, hasResults }: JourneyBreadcrumbProps) {
  const { completedWorkflows } = useSession()

  // Don't show for single-step journeys without results
  if (journey.steps.length <= 1 && !hasResults) return null

  const steps = [
    ...journey.steps,
    ...(journey.steps.length > 1 || hasResults !== undefined ? [{ label: 'Results', route: '' }] : []),
  ]

  return (
    <div className="flex items-center gap-1 flex-wrap mb-2">
      {steps.map((step, i) => {
        const isActive = hasResults && i === steps.length - 1
          ? true
          : i === activeStepIndex && !hasResults
        const isCompleted = step.workflowKey
          ? completedWorkflows.includes(step.workflowKey)
          : hasResults && i === steps.length - 1
        const isPast = i < activeStepIndex || (hasResults && i < steps.length - 1)
        const isClickable = step.route && !isActive

        const content = (
          <span
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200',
              isActive
                ? 'bg-primary/10 text-primary ring-1 ring-primary/30'
                : isCompleted || isPast
                  ? 'bg-success/10 text-success'
                  : 'bg-surface-alt text-text-muted',
            )}
          >
            {isCompleted || isPast ? (
              <CheckCircle2 size={12} />
            ) : isActive ? (
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            ) : (
              <span className="w-4 h-4 rounded-full bg-border flex items-center justify-center text-[10px] font-bold">
                {i + 1}
              </span>
            )}
            {step.label}
          </span>
        )

        return (
          <div key={i} className="flex items-center">
            {isClickable ? (
              <Link to={step.route} className="hover:opacity-80 transition-opacity">
                {content}
              </Link>
            ) : (
              content
            )}
            {i < steps.length - 1 && (
              <div className={cn(
                'w-4 h-px mx-1',
                isPast || isCompleted ? 'bg-success/30' : 'bg-border',
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}
