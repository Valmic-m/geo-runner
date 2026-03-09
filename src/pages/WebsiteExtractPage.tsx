import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, Globe, ChevronDown, ChevronUp, Loader2, ArrowRight, FlaskConical, Calendar, CheckCircle2, HelpCircle, AlertCircle } from 'lucide-react'
import type { SignalConfidence } from '@/engine/analyzers/signal-estimator'
import { SIGNAL_DEFINITIONS } from '@/engine/constants/signal-definitions'
import { CollapsibleSection } from '@/components/shared/CollapsibleSection'
import { CopyButton } from '@/components/shared/CopyButton'
import { ExportButton } from '@/components/shared/ExportButton'
import { useWorkflow } from '@/hooks/useWorkflow'
import { runWebsiteExtractWorkflow } from '@/engine/workflows/website-extract-workflow'
import type { WebsiteExtractInput, WebsiteExtractOutput } from '@/engine/workflows/website-extract-workflow'
import { useExtractedData } from '@/context/ExtractedDataContext'
import { fetchUrlContent } from '@/lib/fetch-url'
import { cn } from '@/lib/cn'

export function WebsiteExtractPage() {
  const navigate = useNavigate()
  const { setExtractedData } = useExtractedData()
  const [url, setUrl] = useState('')
  const [isFetching, setIsFetching] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [showManualPaste, setShowManualPaste] = useState(false)
  const [manualContent, setManualContent] = useState('')

  const { result, error, isRunning, run } = useWorkflow<WebsiteExtractInput, WebsiteExtractOutput>(runWebsiteExtractWorkflow)

  // Store extracted data in context when analysis completes
  useEffect(() => {
    if (result) {
      setExtractedData({
        primaryCategory: result.analysis.categories[0] || '',
        secondaryCategory: result.analysis.categories[1] || '',
        audience: result.analysis.audience.join(', '),
        recommendations: result.analysis.recommendations,
        missingTrustSignals: result.analysis.missingTrustSignals,
        geoScope: result.geoScope,
        revenueModel: result.revenueModel,
        regulated: result.regulated,
        competitors: result.competitors,
        businessNameCandidates: result.businessNameCandidates,
        estimatedSignals: result.estimatedSignals,
        estimatedFocusTier: result.estimatedFocusTier,
        estimatedBottleneck: result.estimatedBottleneck,
      })
    }
  }, [result, setExtractedData])

  const handleFetchAndAnalyze = async () => {
    setFetchError(null)
    setIsFetching(true)
    try {
      const fetched = await fetchUrlContent(url)
      if (!fetched.plainText.trim()) {
        throw new Error('No content could be extracted from this URL')
      }
      setIsFetching(false)
      run({ websiteContent: fetched.plainText, rawHtml: fetched.rawHtml })
    } catch (err) {
      setIsFetching(false)
      setFetchError(err instanceof Error ? err.message : 'Failed to fetch URL')
    }
  }

  const handleManualAnalyze = () => {
    run({ websiteContent: manualContent })
  }

  const confidenceIcon = (confidence: SignalConfidence) => {
    switch (confidence) {
      case 'high': return <CheckCircle2 size={12} className="text-success shrink-0" />
      case 'medium': return <AlertCircle size={12} className="text-warning shrink-0" />
      case 'low': return <HelpCircle size={12} className="text-text-muted shrink-0" />
      case 'unknown': return <HelpCircle size={12} className="text-text-muted/50 shrink-0" />
    }
  }

  const isLoading = isFetching || isRunning

  const exportContent = result
    ? [
        '# Website Content Analysis',
        '',
        '## Detected Categories',
        ...(result.analysis.categories.length > 0 ? result.analysis.categories.map((c) => `- ${c}`) : ['- None detected']),
        '',
        '## Detected Audience',
        ...(result.analysis.audience.length > 0 ? result.analysis.audience.map((a) => `- ${a}`) : ['- None detected']),
        '',
        '## Differentiators',
        ...(result.analysis.differentiators.length > 0 ? result.analysis.differentiators.map((d) => `- ${d}`) : ['- None detected']),
        '',
        `## Content Tone: ${result.analysis.tone}`,
        '',
        '## Missing Trust Signals',
        ...result.analysis.missingTrustSignals.map((s) => `- ${s}`),
        '',
        '## Recommendations',
        ...result.analysis.recommendations.map((r) => `- ${r}`),
      ].join('\n')
    : ''

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-text">Website Content Extract</h2>
        <p className="text-sm text-text-muted mt-1">Enter a website URL to automatically scan and analyze content for categories, audience, differentiators, and missing trust signals.</p>
        <p className="text-xs text-text-muted mt-1">Recommended starting point for new clients. The tool extracts information needed to fill out a Client GEO Snapshot.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text">
              Website URL <span className="text-danger ml-1">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className={cn(
                    'w-full rounded-lg border border-border bg-surface pl-9 pr-3 py-2 text-sm',
                    'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
                    'placeholder:text-text-muted/50',
                  )}
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleFetchAndAnalyze}
            disabled={!url.trim() || isLoading}
            className={cn(
              'w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
              url.trim() && !isLoading
                ? 'bg-primary text-white hover:bg-primary-dark'
                : 'bg-border text-text-muted cursor-not-allowed',
            )}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {isFetching ? 'Fetching website...' : 'Analyzing...'}
              </>
            ) : (
              <>
                <Play size={16} /> Scan & Analyze Website
              </>
            )}
          </button>

          {(fetchError || error) && (
            <div className="text-sm text-danger bg-danger/10 rounded-lg p-3">
              {fetchError || error}
            </div>
          )}

          <div className="border-t border-border pt-3">
            <button
              type="button"
              onClick={() => setShowManualPaste(!showManualPaste)}
              className="flex items-center gap-1 text-xs text-text-muted hover:text-text transition-colors"
            >
              {showManualPaste ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              Or paste content manually
            </button>

            {showManualPaste && (
              <div className="mt-3 space-y-3">
                <textarea
                  value={manualContent}
                  onChange={(e) => setManualContent(e.target.value)}
                  placeholder="Copy and paste the main content from the client's website here (homepage, about page, service pages)..."
                  rows={12}
                  className={cn(
                    'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm font-mono',
                    'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
                    'placeholder:text-text-muted/50 resize-y',
                  )}
                />
                <button
                  onClick={handleManualAnalyze}
                  disabled={!manualContent.trim() || isLoading}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                    manualContent.trim() && !isLoading
                      ? 'bg-surface-alt text-text border border-border hover:bg-border'
                      : 'bg-border text-text-muted cursor-not-allowed',
                  )}
                >
                  <Play size={14} /> Analyze Pasted Content
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {!result && (
            <div className="text-center py-20 text-text-muted text-sm border border-dashed border-border rounded-lg">
              Enter a website URL and scan it to see the analysis.
            </div>
          )}

          {result && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-text">Website Analysis</h3>
                <div className="flex gap-2">
                  <CopyButton text={exportContent} label="Copy All" />
                  <ExportButton content={exportContent} filename="geo-website-extract" />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border bg-surface">
                <div className="text-sm">
                  <span className="font-medium">Content Tone:</span>{' '}
                  <span className={cn(
                    result.analysis.tone === 'heavily promotional' ? 'text-danger' :
                    result.analysis.tone === 'moderately promotional' ? 'text-warning' : 'text-success',
                  )}>
                    {result.analysis.tone}
                  </span>
                </div>
              </div>

              <CollapsibleSection title="Detected Categories" badge={`${result.analysis.categories.length}`}>
                {result.analysis.categories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.analysis.categories.map((c, i) => (
                      <span key={i} className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary">{c}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-warning">No clear categories detected. The website needs explicit category positioning.</p>
                )}
              </CollapsibleSection>

              <CollapsibleSection title="Detected Audience" badge={`${result.analysis.audience.length}`}>
                {result.analysis.audience.length > 0 ? (
                  <ul className="space-y-1">
                    {result.analysis.audience.map((a, i) => (
                      <li key={i} className="text-sm">{a}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-warning">Target audience is unclear from the content.</p>
                )}
              </CollapsibleSection>

              <CollapsibleSection title="Differentiators" badge={`${result.analysis.differentiators.length}`}>
                {result.analysis.differentiators.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.analysis.differentiators.map((d, i) => (
                      <span key={i} className="text-sm px-3 py-1 rounded-full bg-surface-alt text-text">{d}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-warning">No clear differentiators detected.</p>
                )}
              </CollapsibleSection>

              <CollapsibleSection title="Missing Trust Signals" badge={`${result.analysis.missingTrustSignals.length}`}>
                <ul className="space-y-1">
                  {result.analysis.missingTrustSignals.map((s, i) => (
                    <li key={i} className="text-sm text-danger flex items-start gap-2">
                      <span className="mt-0.5">&#x26A0;</span> {s}
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="Recommendations" badge={`${result.analysis.recommendations.length}`}>
                <ul className="space-y-2">
                  {result.analysis.recommendations.map((r, i) => (
                    <li key={i} className="text-sm p-3 rounded-lg bg-surface-alt">{r}</li>
                  ))}
                </ul>
              </CollapsibleSection>

              {result.analysis.schemaTypes.length > 0 && (
                <CollapsibleSection title="Schema Markup Detected" badge={`${result.analysis.schemaTypes.length} types`}>
                  <div className="flex flex-wrap gap-2">
                    {result.analysis.schemaTypes.map((t, i) => (
                      <span key={i} className="text-sm px-3 py-1 rounded-full bg-success/10 text-success">{t}</span>
                    ))}
                  </div>
                </CollapsibleSection>
              )}

              {result.analysis.detectedLocations.length > 0 && (
                <CollapsibleSection title="Detected Locations" badge={`${result.analysis.detectedLocations.length}`}>
                  <ul className="space-y-1">
                    {result.analysis.detectedLocations.map((l, i) => (
                      <li key={i} className="text-sm">{l}</li>
                    ))}
                  </ul>
                </CollapsibleSection>
              )}

              <CollapsibleSection title="Estimated GEO Signals" badge="Auto-scored" defaultOpen={false}>
                <p className="text-xs text-text-muted mb-3">
                  These scores are auto-estimated from your website scan. They will pre-fill the snapshot form.
                  Green = high confidence, yellow = medium, gray = needs manual verification.
                </p>
                <div className="space-y-2">
                  {SIGNAL_DEFINITIONS.map((signal) => {
                    const est = result.estimatedSignals[signal.key]
                    return (
                      <div key={signal.key} className="flex items-center gap-2 py-1.5 border-b border-border/50 last:border-0">
                        {confidenceIcon(est.confidence)}
                        <span className="text-sm font-medium w-40 shrink-0">{signal.label}</span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(n => (
                            <div key={n} className={cn(
                              'w-5 h-5 rounded text-xs flex items-center justify-center font-medium',
                              n <= est.score ? 'bg-primary/20 text-primary' : 'bg-surface-alt text-text-muted/30',
                            )}>{n}</div>
                          ))}
                        </div>
                        <span className="text-xs text-text-muted ml-2 truncate">{est.reason}</span>
                      </div>
                    )
                  })}
                </div>
              </CollapsibleSection>

              {/* What's Next? */}
              <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-5 space-y-4">
                <h3 className="font-semibold text-text flex items-center gap-2">
                  <ArrowRight size={18} className="text-primary" />
                  What's Next?
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                    <p className="text-sm text-text">Your scan results will <strong>auto-fill the entire Client Snapshot</strong> — categories, signals, focus tier, and more.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                    <p className="text-sm text-text"><strong>Review and adjust</strong> any auto-estimated values, then run the <strong>full GEO diagnostic</strong>.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                    <p className="text-sm text-text">The diagnostic will generate <strong>ready-to-publish content</strong> to improve your AI visibility.</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    onClick={() => navigate('/monthly')}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
                  >
                    <Calendar size={16} />
                    Continue to Monthly Cycle
                    <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={() => navigate('/generate-tests')}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border text-text text-sm font-medium hover:bg-surface-alt transition-colors"
                  >
                    <FlaskConical size={16} />
                    Generate AI Tests First
                  </button>
                </div>
                <p className="text-xs text-text-muted">Your scan results will auto-fill the snapshot form — just review and run.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
