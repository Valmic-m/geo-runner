import { Link } from 'react-router-dom'
import {
  Calendar,
  BarChart3,
  RotateCcw,
  FlaskConical,
  Globe,
  ClipboardList,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react'
import { SIGNAL_DEFINITIONS, SIGNAL_MAP } from '@/engine/constants/signal-definitions'
import { PLATFORM_CONFIGS } from '@/engine/constants/platform-config'

const steps = [
  {
    icon: ClipboardList,
    title: 'Create a Client Snapshot',
    description:
      'Fill out the Client GEO Snapshot template with business info and signal scores (1-5 each). New client? Start with Website Extract to identify categories and gaps first.',
    link: { to: '/website-extract', label: 'Website Extract' },
  },
  {
    icon: FlaskConical,
    title: 'Run AI Visibility Tests',
    description:
      'Generate test prompts for ChatGPT, Claude, and Gemini. Run them on each platform to see if the client is mentioned, recommended, or absent. This is your baseline.',
    link: { to: '/generate-tests', label: 'Generate Tests' },
  },
  {
    icon: Calendar,
    title: 'Run a Monthly Cycle',
    description:
      'Paste the snapshot into the Monthly workflow. Get signal diagnostics, content artifacts (FAQs, schema, entity blocks), and a deployment plan telling you where to publish each piece.',
    link: { to: '/monthly', label: 'Monthly Cycle' },
  },
  {
    icon: ArrowUpRight,
    title: 'Deploy & Measure',
    description:
      'Publish artifacts on-site and on external platforms. Re-run AI tests after 4-6 weeks to track movement. Use Quarterly and Annual workflows for deeper reviews.',
    link: null,
  },
]

const workflows = [
  {
    to: '/website-extract',
    icon: Globe,
    title: 'Website Extract',
    badge: 'Start here (new clients)',
    when: 'First time with a new client',
    description:
      'Analyze website content to extract categories, audience, differentiators, and missing trust signals.',
    inputs: 'Pasted website content',
    outputs: 'Categories, audience, differentiators, missing signals, recommendations',
  },
  {
    to: '/generate-tests',
    icon: FlaskConical,
    title: 'Generate AI Tests',
    badge: null,
    when: 'After creating a snapshot, and monthly to track progress',
    description: 'Produce test prompts to check visibility on ChatGPT, Claude, and Gemini.',
    inputs: 'Client GEO Snapshot',
    outputs: 'Platform-specific test prompts + interactive evaluation prompt',
  },
  {
    to: '/monthly',
    icon: Calendar,
    title: 'Monthly GEO Cycle',
    badge: 'Start here (returning clients)',
    when: 'Every month',
    description:
      'Full diagnostic: signal analysis, artifact generation, deployment plan, and sprint actions.',
    inputs: 'Client GEO Snapshot + Monthly Change Log',
    outputs: 'Readiness score, signal diagnostics, content artifacts, deployment plan, updated snapshot',
  },
  {
    to: '/quarterly',
    icon: BarChart3,
    title: 'Quarterly Authority Review',
    badge: null,
    when: 'Every 3 months',
    description:
      'Deep authority analysis with citation opportunities, entity mapping, and content expansion.',
    inputs: 'Client GEO Snapshot + Authority Snapshot',
    outputs: 'Authority gaps, citation targets, entity map, content expansion plan',
  },
  {
    to: '/annual',
    icon: RotateCcw,
    title: 'Annual GEO Reset',
    badge: null,
    when: 'Yearly',
    description:
      'Full reset: category precision review, entity redefinition, positioning refresh, knowledge graph mapping.',
    inputs: 'Client GEO Snapshot + Website Excerpts',
    outputs: 'Category audit, entity definitions, positioning plan, knowledge graph mapping',
  },
]

const signalsByTier = (() => {
  const sorted = [...SIGNAL_DEFINITIONS].sort((a, b) => b.weight - a.weight)
  return {
    high: sorted.filter((s) => s.weight >= 0.1),
    medium: sorted.filter((s) => s.weight >= 0.08 && s.weight < 0.1),
    supporting: sorted.filter((s) => s.weight < 0.08),
  }
})()

const tiers = [
  { key: 'high' as const, label: 'High Impact', borderColor: 'border-l-primary' },
  { key: 'medium' as const, label: 'Medium Impact', borderColor: 'border-l-yellow-500' },
  { key: 'supporting' as const, label: 'Supporting', borderColor: 'border-l-border' },
]

export function HomePage() {
  return (
    <div className="space-y-10">
      {/* Section 1: Hero */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-text">GEO Runner</h2>
        <p className="text-text-muted mt-3">
          AI platforms like ChatGPT, Claude, and Gemini now influence buying decisions by
          recommending brands directly to users. Generative Engine Optimization (GEO) is the
          practice of strengthening the signals these AI models use to decide which brands to
          mention, recommend, and trust.
        </p>
        <p className="text-sm text-text-muted mt-2">
          This tool analyzes your client's AI visibility across 12 key signals, identifies gaps,
          and generates ready-to-deploy content artifacts to close them.
        </p>
      </div>

      {/* Section 2: Getting Started */}
      <div>
        <h3 className="text-lg font-semibold text-text mb-4">Getting Started</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="relative p-4 rounded-xl border border-border bg-surface"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </div>
                <step.icon size={18} className="text-primary shrink-0" />
                <h4 className="font-semibold text-sm text-text">{step.title}</h4>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">{step.description}</p>
              {step.link && (
                <Link
                  to={step.link.to}
                  className="inline-block mt-3 text-xs font-medium text-primary hover:underline"
                >
                  {step.link.label} &rarr;
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: The 12 Signals */}
      <div>
        <h3 className="text-lg font-semibold text-text mb-1">The 12 GEO Signals</h3>
        <p className="text-xs text-text-muted mb-4">
          AI models evaluate brands across these signals to decide who to recommend. Each is scored
          1-5. The tool identifies your weakest signals and generates targeted content to strengthen
          them.
        </p>
        <div className="space-y-3">
          {tiers.map((tier) => (
            <div key={tier.key}>
              <div className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">
                {tier.label}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {signalsByTier[tier.key].map((signal) => (
                  <div
                    key={signal.key}
                    className={`border-l-2 ${tier.borderColor} bg-surface rounded-r-lg px-3 py-2`}
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-medium text-text">{signal.label}</span>
                      <span className="text-xs text-text-muted">
                        {Math.round(signal.weight * 100)}%
                      </span>
                    </div>
                    <p className="text-xs text-text-muted mt-0.5">{signal.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Platform Priorities */}
      <div>
        <h3 className="text-lg font-semibold text-text mb-1">Each AI Platform Is Different</h3>
        <p className="text-xs text-text-muted mb-4">
          ChatGPT, Gemini, and Claude weigh signals differently. The tool tailors recommendations
          and artifacts to each platform's priorities.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLATFORM_CONFIGS.map((platform) => (
            <div
              key={platform.key}
              className={`border-t-2 border-${platform.color} rounded-xl border border-border bg-surface p-4`}
            >
              <h4 className={`font-semibold text-sm text-${platform.color}`}>{platform.label}</h4>
              <p className="text-xs text-text-muted mt-1">{platform.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {platform.prioritySignals.map((key) => (
                  <span
                    key={key}
                    className="text-xs bg-bg px-2 py-0.5 rounded-full text-text-muted"
                  >
                    {SIGNAL_MAP[key].label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: Workflows */}
      <div>
        <h3 className="text-lg font-semibold text-text mb-4">Workflows</h3>
        <div className="space-y-3">
          {workflows.map((w, i) => (
            <Link
              key={w.to}
              to={w.to}
              className="flex items-start gap-4 p-4 rounded-xl border border-border bg-surface hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <w.icon size={16} className="text-primary shrink-0" />
                  <h4 className="font-semibold text-sm text-text">{w.title}</h4>
                  {w.badge && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                      {w.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-muted mt-1">{w.description}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-text-muted">
                  <span>
                    <span className="font-medium text-text">When:</span> {w.when}
                  </span>
                  <span>
                    <span className="font-medium text-text">Inputs:</span> {w.inputs}
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-1">
                  <span className="font-medium text-text">What you get:</span> {w.outputs}
                </p>
              </div>
              <ChevronRight size={16} className="text-text-muted shrink-0 mt-1" />
            </Link>
          ))}
        </div>
      </div>

      {/* Section 6: Disclaimer */}
      <div className="bg-surface border border-border rounded-lg p-4 text-center">
        <p className="text-xs text-text-muted">
          This tool is stateless. No client data is stored. Paste your Client GEO Snapshot each run
          and save results externally.
        </p>
      </div>
    </div>
  )
}
