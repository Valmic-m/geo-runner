import { Link } from 'react-router-dom'
import {
  Calendar,
  BarChart3,
  RotateCcw,
  Globe,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import { useSession } from '@/context/SessionContext'
import type { CompletedWorkflow } from '@/context/SessionContext'

const workflows: { to: string; icon: typeof Calendar; title: string; frequency: string; workflow: CompletedWorkflow }[] = [
  { to: '/workflows/monthly', icon: Calendar, title: 'Monthly Cycle', frequency: 'Every month', workflow: 'monthly' },
  { to: '/workflows/quarterly', icon: BarChart3, title: 'Quarterly Review', frequency: 'Every 3 months', workflow: 'quarterly' },
  { to: '/workflows/annual', icon: RotateCcw, title: 'Annual Reset', frequency: 'Yearly', workflow: 'annual' },
]

export function HomePage() {
  const { currentSnapshot, completedWorkflows } = useSession()

  return (
    <div className="space-y-8">
      {/* Client Context */}
      {currentSnapshot && (
        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface">
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wide">Current Client</p>
            <p className="text-lg font-bold text-text mt-0.5">{currentSnapshot.businessName}</p>
            <p className="text-xs text-text-muted">{currentSnapshot.primaryCategory}{currentSnapshot.geoScope ? ` \u00B7 ${currentSnapshot.geoScope}` : ''}</p>
          </div>
          <div className="flex items-center gap-3">
            {completedWorkflows.length > 0 && (
              <div className="flex items-center gap-1.5">
                {completedWorkflows.map((w) => (
                  <span key={w} className="flex items-center gap-1 text-xs text-success bg-success/10 px-2 py-0.5 rounded-full">
                    <CheckCircle2 size={10} />
                    {w.replace('-', ' ')}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/setup/extract"
          className="group p-6 rounded-xl border-2 border-border bg-surface hover:border-primary/30 hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Globe size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-text">New Client</h3>
              <p className="text-xs text-text-muted">Start with a website scan</p>
            </div>
          </div>
          <p className="text-sm text-text-muted">
            Scan a website to auto-detect categories, audience, and signal strengths. This builds your Client Snapshot automatically.
          </p>
          <div className="flex items-center gap-1 mt-4 text-sm font-medium text-primary group-hover:gap-2 transition-all">
            Start Website Scan <ArrowRight size={14} />
          </div>
        </Link>

        <Link
          to="/workflows/monthly"
          className="group p-6 rounded-xl border-2 border-border bg-surface hover:border-primary/30 hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-text">Returning Client</h3>
              <p className="text-xs text-text-muted">Run a monthly diagnostic</p>
            </div>
          </div>
          <p className="text-sm text-text-muted">
            {currentSnapshot
              ? `Continue with ${currentSnapshot.businessName}. Run the monthly cycle to score signals, generate artifacts, and get a deployment plan.`
              : 'Have a snapshot ready? Jump straight to the Monthly GEO Cycle for signal analysis, artifacts, and deployment planning.'}
          </p>
          <div className="flex items-center gap-1 mt-4 text-sm font-medium text-primary group-hover:gap-2 transition-all">
            Go to Monthly Cycle <ArrowRight size={14} />
          </div>
        </Link>
      </div>

      {/* How it works - compact */}
      <div>
        <h3 className="text-sm font-semibold text-text mb-3">How GEO Runner Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex gap-3 p-3 rounded-lg border border-border bg-surface">
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">1</div>
            <div>
              <p className="text-sm font-medium text-text">Scan & Score</p>
              <p className="text-xs text-text-muted">Analyze 12 AI visibility signals from your client's web presence</p>
            </div>
          </div>
          <div className="flex gap-3 p-3 rounded-lg border border-border bg-surface">
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">2</div>
            <div>
              <p className="text-sm font-medium text-text">Generate Artifacts</p>
              <p className="text-xs text-text-muted">Get ready-to-publish content: FAQs, schema, entity blocks, and more</p>
            </div>
          </div>
          <div className="flex gap-3 p-3 rounded-lg border border-border bg-surface">
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">3</div>
            <div>
              <p className="text-sm font-medium text-text">Deploy & Track</p>
              <p className="text-xs text-text-muted">Follow the deployment plan, then re-test visibility after 4-6 weeks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Progress */}
      <div>
        <h3 className="text-sm font-semibold text-text mb-3">Recurring Workflows</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {workflows.map((w) => {
            const isCompleted = completedWorkflows.includes(w.workflow)
            return (
              <Link
                key={w.to}
                to={w.to}
                className="flex items-center gap-3 p-4 rounded-xl border border-border bg-surface hover:border-primary/30 hover:shadow-sm transition-all"
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <w.icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-text">{w.title}</h4>
                    {isCompleted && <span className="w-2 h-2 rounded-full bg-success shrink-0" />}
                  </div>
                  <p className="text-xs text-text-muted">{w.frequency}</p>
                </div>
                <ArrowRight size={14} className="text-text-muted shrink-0" />
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
