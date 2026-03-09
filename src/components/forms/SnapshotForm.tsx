import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ClientGeoSnapshot, SignalScores, SignalKey } from '@/types/snapshot'
import { SIGNAL_DEFINITIONS } from '@/engine/constants/signal-definitions'
import { FIELD_HELP } from '@/engine/constants/field-help'
import { FormField } from '@/components/forms/FormField'
import { StepIndicator } from '@/components/forms/StepIndicator'
import { SignalScoreInput } from '@/components/forms/SignalScoreInput'
import { CategorySelect } from '@/components/forms/CategorySelect'
import { cn } from '@/lib/cn'
import type { EstimatedSignals } from '@/engine/analyzers/signal-estimator'

export interface SnapshotInitialData {
  primaryCategory?: string
  secondaryCategory?: string
  audience?: string
  geoScope?: string
  revenueModel?: string
  regulated?: string
  competitors?: string[]
  businessNameCandidates?: string[]
  estimatedSignals?: EstimatedSignals
  estimatedFocusTier?: string
  estimatedBottleneck?: string
}

interface SnapshotFormProps {
  onSubmit: (snapshot: ClientGeoSnapshot) => void
  isRunning?: boolean
  initialData?: SnapshotInitialData
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

function buildInitialSignals(estimated?: EstimatedSignals): SignalScores {
  if (!estimated) {
    return {
      entityClarity: 0, brandMentions: 0, comparisonPresence: 0, faqCoverage: 0,
      structuredData: 0, reviews: 0, authoritySignals: 0, citations: 0,
      gbpCompleteness: 0, knowledgeGraphSignals: 0, messagingConsistency: 0, credibilitySignals: 0,
    }
  }
  const scores = {} as SignalScores
  for (const key of Object.keys(estimated) as SignalKey[]) {
    scores[key] = estimated[key].score
  }
  return scores
}

export function SnapshotForm({ onSubmit, isRunning, initialData }: SnapshotFormProps) {
  const hasPrefilledData = !!initialData?.estimatedSignals || !!(initialData?.primaryCategory || initialData?.secondaryCategory || initialData?.audience)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    businessName: initialData?.businessNameCandidates?.[0] || '',
    primaryCategory: initialData?.primaryCategory || '',
    secondaryCategory: initialData?.secondaryCategory || '',
    audience: initialData?.audience || '',
    geoScope: initialData?.geoScope || '',
    revenueModel: initialData?.revenueModel || '',
    regulated: initialData?.regulated || '',
    competitors: initialData?.competitors?.join(', ') || '',
    signals: buildInitialSignals(initialData?.estimatedSignals),
    chatgpt: 0,
    gemini: 0,
    claude: 0,
    competitorDominance: 0,
    focusTier: initialData?.estimatedFocusTier || '',
    primaryBottleneck: initialData?.estimatedBottleneck || '',
    notes: '',
  })

  const updateField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const updateSignal = (key: keyof SignalScores, value: number) => {
    setForm((prev) => ({ ...prev, signals: { ...prev.signals, [key]: value } }))
  }

  const canSubmit = form.businessName.trim() && form.primaryCategory.trim()

  const handleSubmit = () => {
    const snapshot: ClientGeoSnapshot = {
      businessName: form.businessName,
      primaryCategory: form.primaryCategory,
      secondaryCategory: form.secondaryCategory,
      audience: form.audience,
      geoScope: form.geoScope,
      revenueModel: form.revenueModel,
      regulated: form.regulated,
      competitors: form.competitors.split(',').map((s) => s.trim()).filter(Boolean),
      signals: form.signals,
      platformVisibility: {
        chatgpt: form.chatgpt,
        gemini: form.gemini,
        claude: form.claude,
      },
      competitorDominance: form.competitorDominance,
      focusTier: form.focusTier,
      primaryBottleneck: form.primaryBottleneck,
      notes: form.notes,
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
                value={form.businessName}
                onChange={(e) => updateField('businessName', e.target.value)}
                placeholder="e.g., Acme Plumbing Co."
                className={inputClass}
              />
            </FormField>

            <FormField label="Primary Category" helpText={FIELD_HELP.primaryCategory} required>
              <CategorySelect
                value={form.primaryCategory}
                onChange={(v) => updateField('primaryCategory', v)}
                placeholder="Search or select a category..."
              />
            </FormField>

            <FormField label="Secondary Category" helpText={FIELD_HELP.secondaryCategory}>
              <CategorySelect
                value={form.secondaryCategory}
                onChange={(v) => updateField('secondaryCategory', v)}
                placeholder="Optional — search or select..."
              />
            </FormField>

            <FormField label="Target Audience" helpText={FIELD_HELP.audience}>
              <input
                type="text"
                value={form.audience}
                onChange={(e) => updateField('audience', e.target.value)}
                placeholder="e.g., Small business owners in Austin, TX"
                className={inputClass}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Geographic Scope" helpText={FIELD_HELP.geoScope}>
                <select
                  value={form.geoScope}
                  onChange={(e) => updateField('geoScope', e.target.value)}
                  className={selectClass}
                >
                  <option value="">Select...</option>
                  {GEO_SCOPES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </FormField>

              <FormField label="Revenue Model" helpText={FIELD_HELP.revenueModel}>
                <select
                  value={form.revenueModel}
                  onChange={(e) => updateField('revenueModel', e.target.value)}
                  className={selectClass}
                >
                  <option value="">Select...</option>
                  {REVENUE_MODELS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </FormField>
            </div>

            <FormField label="Regulated Industry?" helpText={FIELD_HELP.regulated}>
              <select
                value={form.regulated}
                onChange={(e) => updateField('regulated', e.target.value)}
                className={selectClass}
              >
                <option value="">Select...</option>
                {REGULATED_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </FormField>
          </>
        )}

        {step === 1 && (
          <>
            {hasPrefilledData && initialData?.estimatedSignals ? (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm text-text">
                <span className="text-primary shrink-0 mt-0.5">&#x2713;</span>
                Signals were auto-estimated from your website scan. Review and adjust as needed.
                Confidence: green = high, yellow = medium, gray = needs manual check.
              </div>
            ) : (
              <p className="text-xs text-text-muted">
                Rate each signal from 1 (not present) to 5 (strong). Hover the info icon for guidance on how to assess each one.
              </p>
            )}
            <div className="divide-y divide-border">
              {SIGNAL_DEFINITIONS.map((signal) => (
                <SignalScoreInput
                  key={signal.key}
                  label={signal.label}
                  description={FIELD_HELP[signal.key] || signal.description}
                  value={form.signals[signal.key]}
                  onChange={(v) => updateSignal(signal.key, v)}
                  confidence={initialData?.estimatedSignals?.[signal.key]?.confidence}
                  reason={initialData?.estimatedSignals?.[signal.key]?.reason}
                />
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-xs text-text-muted">
              Test your visibility on each AI platform by asking 10 relevant questions about your category. Count how many mention your business.
            </p>

            <div className="grid grid-cols-1 gap-4">
              <FormField label="ChatGPT Inclusion %" helpText={FIELD_HELP.chatgptInclusion}>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={form.chatgpt || ''}
                    onChange={(e) => updateField('chatgpt', Number(e.target.value))}
                    placeholder="0"
                    className={cn(inputClass, 'w-24')}
                  />
                  <span className="text-sm text-text-muted">%</span>
                </div>
              </FormField>

              <FormField label="Gemini Inclusion %" helpText={FIELD_HELP.geminiInclusion}>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={form.gemini || ''}
                    onChange={(e) => updateField('gemini', Number(e.target.value))}
                    placeholder="0"
                    className={cn(inputClass, 'w-24')}
                  />
                  <span className="text-sm text-text-muted">%</span>
                </div>
              </FormField>

              <FormField label="Claude Inclusion %" helpText={FIELD_HELP.claudeInclusion}>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={form.claude || ''}
                    onChange={(e) => updateField('claude', Number(e.target.value))}
                    placeholder="0"
                    className={cn(inputClass, 'w-24')}
                  />
                  <span className="text-sm text-text-muted">%</span>
                </div>
              </FormField>

              <FormField label="Competitor Dominance %" helpText={FIELD_HELP.competitorDominance}>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={form.competitorDominance || ''}
                    onChange={(e) => updateField('competitorDominance', Number(e.target.value))}
                    placeholder="0"
                    className={cn(inputClass, 'w-24')}
                  />
                  <span className="text-sm text-text-muted">%</span>
                </div>
              </FormField>

              <FormField label="Competitors" helpText={FIELD_HELP.competitors}>
                <input
                  type="text"
                  value={form.competitors}
                  onChange={(e) => updateField('competitors', e.target.value)}
                  placeholder="e.g., Competitor A, Competitor B, Competitor C"
                  className={inputClass}
                />
              </FormField>
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
                value={form.focusTier}
                onChange={(e) => updateField('focusTier', e.target.value)}
                className={selectClass}
              >
                <option value="">Select...</option>
                {FOCUS_TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormField>

            <FormField label="Primary Bottleneck" helpText={FIELD_HELP.primaryBottleneck}>
              <select
                value={form.primaryBottleneck}
                onChange={(e) => updateField('primaryBottleneck', e.target.value)}
                className={selectClass}
              >
                <option value="">Select...</option>
                {BOTTLENECK_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </FormField>

            <FormField label="Notes">
              <textarea
                value={form.notes}
                onChange={(e) => updateField('notes', e.target.value)}
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
            {isRunning ? 'Running...' : 'Run Analysis'}
          </button>
        )}
      </div>
    </div>
  )
}
