import { cn } from '@/lib/cn'

interface StepIndicatorProps {
  steps: string[]
  currentStep: number
  onStepClick: (step: number) => void
}

export function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-1">
      {steps.map((step, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onStepClick(i)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
            i === currentStep
              ? 'bg-primary text-white'
              : i < currentStep
                ? 'bg-primary/10 text-primary'
                : 'bg-surface-alt text-text-muted',
          )}
        >
          <span className={cn(
            'w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold',
            i === currentStep
              ? 'bg-white/20'
              : i < currentStep
                ? 'bg-primary/20'
                : 'bg-border',
          )}>
            {i + 1}
          </span>
          <span className="hidden sm:inline">{step}</span>
        </button>
      ))}
    </div>
  )
}
