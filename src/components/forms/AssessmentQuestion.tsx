import type { AssessmentQuestion as QuestionType } from '@/types/assessment'
import { cn } from '@/lib/cn'
import { HelpCircle } from 'lucide-react'
import { Tooltip } from '@/components/shared/Tooltip'

interface AssessmentQuestionProps {
  question: QuestionType
  value?: string
  onChange: (value: string) => void
  templateVars: Record<string, string>
}

function interpolate(text: string, vars: Record<string, string>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] || `[${key}]`)
}

export function AssessmentQuestion({ question, value, onChange, templateVars }: AssessmentQuestionProps) {
  const questionText = interpolate(question.text, templateVars)

  return (
    <div className="py-3 first:pt-0 last:pb-0">
      <div className="flex items-start gap-2 mb-2">
        <p className="text-sm text-text flex-1">{questionText}</p>
        {question.helpText && (
          <Tooltip content={interpolate(question.helpText, templateVars)}>
            <HelpCircle size={14} className="text-text-muted shrink-0 mt-0.5 cursor-help" />
          </Tooltip>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {question.options.map((option) => {
          const isSelected = value === option.value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors',
                isSelected
                  ? 'bg-primary text-white border-primary'
                  : 'bg-surface border-border text-text-muted hover:border-primary/40 hover:text-text',
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
