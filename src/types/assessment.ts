import type { SignalKey, PlatformKey } from './snapshot'

export type AnswerType = 'yes-no' | 'yes-partially-no' | 'yes-sometimes-no' | 'multiple-choice' | 'count-range'

export type AssessmentCycle = 'monthly' | 'quarterly' | 'annual'

export interface AnswerOption {
  value: string
  label: string
  scoreContribution: number
}

export interface AssessmentQuestion {
  id: string
  signalKey?: SignalKey
  platformKey?: PlatformKey
  text: string
  answerType: AnswerType
  options: AnswerOption[]
  conditionalOn?: { questionId: string; answerValues: string[] }
  cycle: AssessmentCycle | 'all'
  weight: number
  helpText?: string
}

export interface AssessmentAnswer {
  questionId: string
  value: string
}

export interface AssessmentSession {
  answers: AssessmentAnswer[]
  computedSignals: import('./snapshot').SignalScores
  computedVisibility: import('./snapshot').PlatformVisibility
  computedCompetitorDominance: number
  cycle: AssessmentCycle
}
