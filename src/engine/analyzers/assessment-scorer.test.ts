import { describe, it, expect } from 'vitest'
import { computeSignalScores, computePlatformVisibility, computeCompetitorDominance } from './assessment-scorer'
import type { AssessmentQuestion, AssessmentAnswer } from '@/types/assessment'

function makeQuestion(overrides: Partial<AssessmentQuestion> = {}): AssessmentQuestion {
  return {
    id: 'q1',
    signalKey: 'entityClarity',
    text: 'Test question',
    answerType: 'yes-no',
    options: [
      { value: 'yes', label: 'Yes', scoreContribution: 1.0 },
      { value: 'no', label: 'No', scoreContribution: 0.0 },
    ],
    cycle: 'monthly',
    weight: 1,
    ...overrides,
  }
}

describe('computeSignalScores', () => {
  it('returns fallback scores when no answers provided', () => {
    const result = computeSignalScores([], [], { entityClarity: 3 })
    expect(result.entityClarity).toBe(3)
  })

  it('returns 0 for signals with no answers and no fallback', () => {
    const result = computeSignalScores([], [])
    expect(result.entityClarity).toBe(0)
    expect(result.reviews).toBe(0)
  })

  it('computes score from answers mapped to 1-5 scale', () => {
    const questions = [makeQuestion({ id: 'q1', signalKey: 'entityClarity', weight: 1 })]
    const answers: AssessmentAnswer[] = [{ questionId: 'q1', value: 'yes' }]

    const result = computeSignalScores(answers, questions)
    // scoreContribution 1.0 → 1 + 1.0 * 4 = 5
    expect(result.entityClarity).toBe(5)
  })

  it('scores 1 when scoreContribution is 0', () => {
    const questions = [makeQuestion({ id: 'q1', signalKey: 'entityClarity', weight: 1 })]
    const answers: AssessmentAnswer[] = [{ questionId: 'q1', value: 'no' }]

    const result = computeSignalScores(answers, questions)
    // scoreContribution 0.0 → 1 + 0 * 4 = 1
    expect(result.entityClarity).toBe(1)
  })

  it('skips zero-weight gating questions', () => {
    const questions = [
      makeQuestion({ id: 'gate', signalKey: 'entityClarity', weight: 0 }),
      makeQuestion({ id: 'real', signalKey: 'entityClarity', weight: 1 }),
    ]
    const answers: AssessmentAnswer[] = [
      { questionId: 'gate', value: 'yes' },
      { questionId: 'real', value: 'no' },
    ]

    const result = computeSignalScores(answers, questions)
    expect(result.entityClarity).toBe(1)
  })

  it('skips conditional questions when condition not met', () => {
    const questions = [
      makeQuestion({ id: 'parent', signalKey: 'entityClarity', weight: 1 }),
      makeQuestion({
        id: 'child',
        signalKey: 'entityClarity',
        weight: 1,
        conditionalOn: { questionId: 'parent', answerValues: ['yes'] },
      }),
    ]
    const answers: AssessmentAnswer[] = [
      { questionId: 'parent', value: 'no' },
      { questionId: 'child', value: 'yes' },
    ]

    const result = computeSignalScores(answers, questions)
    // Only parent answer counts (no=0), child skipped
    expect(result.entityClarity).toBe(1)
  })

  it('returns all 12 signal keys', () => {
    const result = computeSignalScores([], [])
    const keys = Object.keys(result)
    expect(keys).toHaveLength(12)
    expect(keys).toContain('entityClarity')
    expect(keys).toContain('credibilitySignals')
  })
})

describe('computePlatformVisibility', () => {
  it('returns fallback when no answers', () => {
    const result = computePlatformVisibility([], [], { chatgpt: 50 })
    expect(result.chatgpt).toBe(50)
  })

  it('returns 0 for platforms with no answers and no fallback', () => {
    const result = computePlatformVisibility([], [])
    expect(result.chatgpt).toBe(0)
    expect(result.gemini).toBe(0)
  })

  it('computes visibility percentage from answers', () => {
    const questions = [makeQuestion({ id: 'p1', platformKey: 'chatgpt', signalKey: undefined, weight: 1 })]
    const answers: AssessmentAnswer[] = [{ questionId: 'p1', value: 'yes' }]

    const result = computePlatformVisibility(answers, questions)
    expect(result.chatgpt).toBe(100) // scoreContribution 1.0 * 100
  })

  it('returns all 5 platform keys', () => {
    const result = computePlatformVisibility([], [])
    expect(Object.keys(result)).toHaveLength(5)
    expect(result).toHaveProperty('chatgpt')
    expect(result).toHaveProperty('claude')
    expect(result).toHaveProperty('gemini')
    expect(result).toHaveProperty('perplexity')
    expect(result).toHaveProperty('aiOverviews')
  })
})

describe('computeCompetitorDominance', () => {
  it('returns 0 when no answers', () => {
    expect(computeCompetitorDominance([], [])).toBe(0)
  })

  it('computes percentage from answers', () => {
    const questions = [makeQuestion({ id: 'c1', weight: 1 })]
    const answers: AssessmentAnswer[] = [{ questionId: 'c1', value: 'yes' }]

    const result = computeCompetitorDominance(answers, questions)
    expect(result).toBe(100)
  })
})
