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
        <div key={i} className="flex items-center">
          <button
            type="button"
            onClick={() => onStepClick(i)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
              i === currentStep
                ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-sm shadow-primary/20'
                : i < currentStep
                  ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                  : 'bg-surface-alt text-text-muted',
            )}
          >
            <span className={cn(
              'w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200',
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
          {i < steps.length - 1 && (
            <div className={cn(
              'w-4 h-px mx-0.5',
              i < currentStep ? 'bg-primary/30' : 'bg-border',
            )} />
          )}
        </div>
      ))}
    </div>
  )
}
