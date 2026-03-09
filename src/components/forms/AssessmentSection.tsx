import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { AssessmentQuestion as QuestionType, AssessmentAnswer, AssessmentCycle } from '@/types/assessment'
import { AssessmentQuestion } from './AssessmentQuestion'
import { cn } from '@/lib/cn'

interface AssessmentSectionProps {
  title: string
  questions: QuestionType[]
  answers: AssessmentAnswer[]
  onAnswer: (questionId: string, value: string) => void
  templateVars: Record<string, string>
  cycle: AssessmentCycle
  computedScore?: number | null
  scoreMax?: number
  defaultOpen?: boolean
}

function shouldShowQuestion(
  question: QuestionType,
  answers: AssessmentAnswer[],
  cycle: AssessmentCycle,
): boolean {
  // Filter by cycle: show if question cycle matches or is 'all'
  const cycleOrder: AssessmentCycle[] = ['monthly', 'quarterly', 'annual']
  const currentIdx = cycleOrder.indexOf(cycle)
  const questionIdx = question.cycle === 'all' ? 0 : cycleOrder.indexOf(question.cycle as AssessmentCycle)
  if (questionIdx > currentIdx) return false

  // Check conditional
  if (question.conditionalOn) {
    const parentAnswer = answers.find((a) => a.questionId === question.conditionalOn!.questionId)
    if (!parentAnswer || !question.conditionalOn.answerValues.includes(parentAnswer.value)) {
      return false
    }
  }

  return true
}

export function AssessmentSection({
  title,
  questions,
  answers,
  onAnswer,
  templateVars,
  cycle,
  computedScore,
  scoreMax = 5,
  defaultOpen = true,
}: AssessmentSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const answerMap = new Map(answers.map((a) => [a.questionId, a.value]))
  const visibleQuestions = questions.filter((q) => shouldShowQuestion(q, answers, cycle))
  const answeredCount = visibleQuestions.filter((q) => answerMap.has(q.id)).length
  const totalCount = visibleQuestions.length

  const scoreColor = computedScore === null || computedScore === undefined
    ? 'text-text-muted'
    : computedScore >= scoreMax * 0.7
      ? 'text-success'
      : computedScore >= scoreMax * 0.4
        ? 'text-warning'
        : 'text-danger'

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-surface-alt hover:bg-border/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span className="text-sm font-medium text-text">{title}</span>
          <span className="text-xs text-text-muted">
            {answeredCount}/{totalCount}
          </span>
        </div>
        {computedScore !== null && computedScore !== undefined && (
          <span className={cn('text-sm font-bold', scoreColor)}>
            {computedScore}/{scoreMax}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="px-4 py-2 divide-y divide-border/50">
          {visibleQuestions.length === 0 ? (
            <p className="text-xs text-text-muted py-3">No questions for this cycle.</p>
          ) : (
            visibleQuestions.map((q) => (
              <AssessmentQuestion
                key={q.id}
                question={q}
                value={answerMap.get(q.id)}
                onChange={(v) => onAnswer(q.id, v)}
                templateVars={templateVars}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}
