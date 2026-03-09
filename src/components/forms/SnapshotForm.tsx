import { useState, useMemo, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ClientGeoSnapshot, SignalScores, SignalKey, Competitor } from '@/types/snapshot'
import type { AssessmentAnswer, AssessmentCycle } from '@/types/assessment'
import { SIGNAL_DEFINITIONS } from '@/engine/constants/signal-definitions'
import { SIGNAL_QUESTIONS } from '@/engine/constants/signal-questions'
import { PLATFORM_QUESTIONS } from '@/engine/constants/platform-questions'
import { generateCompetitorQuestions } from '@/engine/constants/competitor-questions'
import { computeSignalScores, computePlatformVisibility, computeCompetitorDominance } from '@/engine/analyzers/assessment-scorer'
import { FIELD_HELP } from '@/engine/constants/field-help'
import { FormField } from '@/components/forms/FormField'
import { StepIndicator } from '@/components/forms/StepIndicator'
import { CategorySelect } from '@/components/forms/CategorySelect'
import { AssessmentSection } from '@/components/forms/AssessmentSection'
import { CompetitorInput } from '@/components/forms/CompetitorInput'
import { cn } from '@/lib/cn'
import type { EstimatedSignals } from '@/engine/analyzers/signal-estimator'

export interface SnapshotInitialData {
  primaryCategory?: string
  secondaryCategory?: string
  audience?: string
  geoScope?: string
  revenueModel?: string
  regulated?: string
  competitors?: Competitor[]
  businessNameCandidates?: string[]
  estimatedSignals?: EstimatedSignals
  estimatedFocusTier?: string
  estimatedBottleneck?: string
}

interface SnapshotFormProps {
  onSubmit: (snapshot: ClientGeoSnapshot) => void
  isRunning?: boolean
  initialData?: SnapshotInitialData
  initialSnapshot?: ClientGeoSnapshot
  previousSignals?: SignalScores
  submitLabel?: string
  cycle?: AssessmentCycle
}

const STEPS = ['Business Info', 'GEO Signals', 'AI Visibility', 'Focus & Notes']

const GEO_SCOPES = ['Local', 'Regional', 'National', 'International']
const REVENUE_MODELS = ['B2B', 'B2C', 'SaaS', 'E-commerce', 'Services', 'Other']
const REGULATED_OPTIONS = ['Yes', 'No', 'Partially']
const FOCUS_TIERS = ['Tier 1 - Foundation', 'Tier 2 - Growth', 'Tier 3 - Optimization']
const BOTTLENECK_OPTIONS = [
  'Entity clarity — AI doesn\'t know who we are',
  'No reviews — lack of review presence',
  'Missing schema — no structured data',
  'Weak authority — no third-party citations',
  'Poor comparison presence — not in "best of" content',
  'Inconsistent messaging — brand info varies across sites',
  'Other',
]

function buildFallbackSignals(estimated?: EstimatedSignals): Partial<SignalScores> {
  if (!estimated) return {}
  const scores = {} as Partial<SignalScores>
  for (const key of Object.keys(estimated) as SignalKey[]) {
    scores[key] = estimated[key].score
  }
  return scores
}

export function SnapshotForm({ onSubmit, isRunning, initialData, initialSnapshot, previousSignals, submitLabel, cycle = 'annual' }: SnapshotFormProps) {
  const hasPrefilledData = !!initialSnapshot || !!initialData?.estimatedSignals || !!(initialData?.primaryCategory || initialData?.secondaryCategory || initialData?.audience)
  const [step, setStep] = useState(0)

  // Business info fields
  const [businessName, setBusinessName] = useState(initialSnapshot?.businessName || initialData?.businessNameCandidates?.[0] || '')
  const [primaryCategory, setPrimaryCategory] = useState(initialSnapshot?.primaryCategory || initialData?.primaryCategory || '')
  const [secondaryCategory, setSecondaryCategory] = useState(initialSnapshot?.secondaryCategory || initialData?.secondaryCategory || '')
  const [audience, setAudience] = useState(initialSnapshot?.audience || initialData?.audience || '')
  const [geoScope, setGeoScope] = useState(initialSnapshot?.geoScope || initialData?.geoScope || '')
  const [revenueModel, setRevenueModel] = useState(initialSnapshot?.revenueModel || initialData?.revenueModel || '')
  const [regulated, setRegulated] = useState(initialSnapshot?.regulated || initialData?.regulated || '')
  const [competitors, setCompetitors] = useState<Competitor[]>(initialSnapshot?.competitors || initialData?.competitors || [])

  // Assessment answers
  const [answers, setAnswers] = useState<AssessmentAnswer[]>(initialSnapshot?.assessmentAnswers || [])

  // Focus & notes
  const [focusTier, setFocusTier] = useState(initialSnapshot?.focusTier || initialData?.estimatedFocusTier || '')
  const [primaryBottleneck, setPrimaryBottleneck] = useState(initialSnapshot?.primaryBottleneck || initialData?.estimatedBottleneck || '')
  const [notes, setNotes] = useState(initialSnapshot?.notes || '')

  // Template vars for question interpolation
  const templateVars = useMemo(() => ({
    businessName: businessName || '[Business Name]',
    category: primaryCategory || '[Category]',
    location: geoScope || '[Location]',
  }), [businessName, primaryCategory, geoScope])

  // Competitor questions generated dynamically
  const competitorQuestions = useMemo(
    () => generateCompetitorQuestions(competitors),
    [competitors],
  )

  // All questions combined for scoring
  const allSignalQuestions = SIGNAL_QUESTIONS
  const allPlatformQuestions = PLATFORM_QUESTIONS

  // Fallback scores from website scan estimates
  const fallbackSignals = useMemo(() => buildFallbackSignals(initialData?.estimatedSignals), [initialData?.estimatedSignals])

  // Live computed scores
  const computedSignals = useMemo(
    () => computeSignalScores(answers, allSignalQuestions, fallbackSignals),
    [answers, allSignalQuestions, fallbackSignals],
  )

  const computedVisibility = useMemo(
    () => computePlatformVisibility(answers, allPlatformQuestions),
    [answers, allPlatformQuestions],
  )

  const computedCompetitorDom = useMemo(
    () => computeCompetitorDominance(answers, competitorQuestions),
    [answers, competitorQuestions],
  )

  const handleAnswer = useCallback((questionId: string, value: string) => {
    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== questionId)
      return [...filtered, { questionId, value }]
    })
  }, [])

  // Group signal questions by signal for sections
  const signalGroups = useMemo(() => {
    const groups: { key: SignalKey; label: string; questions: typeof SIGNAL_QUESTIONS }[] = []
    for (const def of SIGNAL_DEFINITIONS) {
      const qs = allSignalQuestions.filter((q) => q.signalKey === def.key)
      if (qs.length > 0) {
        groups.push({ key: def.key, label: def.label, questions: qs })
      }
    }
    return groups
  }, [allSignalQuestions])

  // Group platform questions by platform
  const platformGroups = useMemo(() => {
    const platforms = [
      { key: 'chatgpt' as const, label: 'ChatGPT' },
      { key: 'gemini' as const, label: 'Google Gemini' },
      { key: 'claude' as const, label: 'Claude' },
      { key: 'perplexity' as const, label: 'Perplexity' },
      { key: 'aiOverviews' as const, label: 'AI Overviews' },
    ]
    return platforms.map((p) => ({
      ...p,
      questions: allPlatformQuestions.filter((q) => q.platformKey === p.key),
    }))
  }, [allPlatformQuestions])

  const canSubmit = businessName.trim() && primaryCategory.trim()

  const handleSubmit = () => {
    const snapshot: ClientGeoSnapshot = {
      businessName,
      primaryCategory,
      secondaryCategory,
      audience,
      geoScope,
      revenueModel,
      regulated,
      competitors,
      signals: computedSignals,
      platformVisibility: computedVisibility,
      competitorDominance: computedCompetitorDom,
      focusTier,
      primaryBottleneck,
      notes,
      assessmentAnswers: answers,
    }
    onSubmit(snapshot)
  }

  const inputClass = cn(
    'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm',
    'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
    'placeholder:text-text-muted/50',
  )

  const selectClass = cn(inputClass, 'appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23999%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E")] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-8')

  return (
    <div className="space-y-4">
      <StepIndicator steps={STEPS} currentStep={step} onStepClick={setStep} />

      <div className="border border-border rounded-xl p-4 bg-surface space-y-4">
        {hasPrefilledData && step === 0 && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm text-text">
            <span className="text-primary shrink-0 mt-0.5">&#x2713;</span>
            Fields were auto-filled from your website scan. Review and adjust as needed.
          </div>
        )}

        {step === 0 && (
          <>
            <FormField label="Business Name" helpText={FIELD_HELP.businessName} required>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g., Acme Plumbing Co."
                className={inputClass}
              />
            </FormField>

            <FormField label="Primary Category" helpText={FIELD_HELP.primaryCategory} required>
              <CategorySelect
                value={primaryCategory}
                onChange={setPrimaryCategory}
                placeholder="Search or select a category..."
              />
            </FormField>

            <FormField label="Secondary Category" helpText={FIELD_HELP.secondaryCategory}>
              <CategorySelect
                value={secondaryCategory}
                onChange={setSecondaryCategory}
                placeholder="Optional — search or select..."
              />
            </FormField>

            <FormField label="Target Audience" helpText={FIELD_HELP.audience}>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g., Small business owners in Austin, TX"
                className={inputClass}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Geographic Scope" helpText={FIELD_HELP.geoScope}>
                <select
                  value={geoScope}
                  onChange={(e) => setGeoScope(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Select...</option>
                  {GEO_SCOPES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </FormField>

              <FormField label="Revenue Model" helpText={FIELD_HELP.revenueModel}>
                <select
                  value={revenueModel}
                  onChange={(e) => setRevenueModel(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Select...</option>
                  {REVENUE_MODELS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </FormField>
            </div>

            <FormField label="Regulated Industry?" helpText={FIELD_HELP.regulated}>
              <select
                value={regulated}
                onChange={(e) => setRegulated(e.target.value)}
                className={selectClass}
              >
                <option value="">Select...</option>
                {REGULATED_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </FormField>

            <FormField label="Competitors" helpText="Add competitor websites to integrate them into your analysis, recommendations, and comparison content.">
              <CompetitorInput
                competitors={competitors}
                onChange={setCompetitors}
              />
            </FormField>
          </>
        )}

        {step === 1 && (
          <>
            <p className="text-xs text-text-muted">
              Answer the questions below to assess each GEO signal. Your scores are computed automatically based on your responses.
              {cycle === 'monthly' && ' Quick monthly check — fewer questions.'}
              {cycle === 'quarterly' && ' Quarterly review — moderate depth.'}
              {cycle === 'annual' && ' Full annual assessment — all questions.'}
            </p>
            <div className="space-y-3">
              {signalGroups.map((group) => (
                <AssessmentSection
                  key={group.key}
                  title={group.label}
                  questions={group.questions}
                  answers={answers}
                  onAnswer={handleAnswer}
                  templateVars={templateVars}
                  cycle={cycle}
                  computedScore={computedSignals[group.key]}
                  scoreMax={5}
                  defaultOpen={false}
                />
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-xs text-text-muted">
              Test your visibility on each AI platform by answering the guided questions below. Your visibility percentage is computed from your answers.
            </p>
            <div className="space-y-3">
              {platformGroups.map((group) => (
                <AssessmentSection
                  key={group.key}
                  title={group.label}
                  questions={group.questions}
                  answers={answers}
                  onAnswer={handleAnswer}
                  templateVars={templateVars}
                  cycle={cycle}
                  computedScore={computedVisibility[group.key]}
                  scoreMax={100}
                  defaultOpen={false}
                />
              ))}

              {competitors.length > 0 && competitorQuestions.length > 0 && (
                <AssessmentSection
                  title="Competitor Dominance"
                  questions={competitorQuestions}
                  answers={answers}
                  onAnswer={handleAnswer}
                  templateVars={templateVars}
                  cycle={cycle}
                  computedScore={computedCompetitorDom}
                  scoreMax={100}
                  defaultOpen={false}
                />
              )}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            {hasPrefilledData && (initialData?.estimatedFocusTier || initialData?.estimatedBottleneck) && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm text-text">
                <span className="text-primary shrink-0 mt-0.5">&#x2713;</span>
                Focus tier and bottleneck were auto-detected from your signal estimates.
              </div>
            )}

            <FormField label="Focus Tier" helpText={FIELD_HELP.focusTier}>
              <select
                value={focusTier}
                onChange={(e) => setFocusTier(e.target.value)}
                className={selectClass}
              >
                <option value="">Select...</option>
                {FOCUS_TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormField>

            <FormField label="Primary Bottleneck" helpText={FIELD_HELP.primaryBottleneck}>
              <select
                value={primaryBottleneck}
                onChange={(e) => setPrimaryBottleneck(e.target.value)}
                className={selectClass}
              >
                <option value="">Select...</option>
                {BOTTLENECK_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </FormField>

            <FormField label="Notes">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional context about the business or its GEO goals..."
                rows={4}
                className={cn(inputClass, 'resize-y')}
              />
            </FormField>
          </>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className={cn(
            'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            step > 0
              ? 'text-text hover:bg-surface-alt'
              : 'text-text-muted cursor-not-allowed',
          )}
        >
          <ChevronLeft size={16} /> Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-colors"
          >
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || isRunning}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              canSubmit && !isRunning
                ? 'bg-primary text-white hover:bg-primary-dark'
                : 'bg-border text-text-muted cursor-not-allowed',
            )}
          >
            {isRunning ? 'Running...' : (submitLabel || 'Run Analysis')}
          </button>
        )}
      </div>
    </div>
  )
}
