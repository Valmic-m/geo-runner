import { useState, type ReactNode } from 'react'
import { BookOpen } from 'lucide-react'
import { TabNav } from './TabNav'
import { ReferenceDrawer } from './ReferenceDrawer'
import { useSession } from '@/context/SessionContext'

export function AppShell({ children }: { children: ReactNode }) {
  const { completedWorkflows, currentSnapshot, clearSession } = useSession()
  const hasSession = completedWorkflows.length > 0 || !!currentSnapshot
  const [referenceOpen, setReferenceOpen] = useState(false)

  return (
    <div className="min-h-screen bg-surface-alt">
      <header className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-text">GEO Runner</h1>
            <p className="text-xs text-text-muted">Generative Engine Optimization Workflow Tool</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setReferenceOpen(true)}
              className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text px-3 py-1 rounded-full border border-border hover:border-primary/30 transition-colors"
              title="GEO Reference Guide"
            >
              <BookOpen size={13} />
              Reference
            </button>
            {hasSession && (
              <button
                onClick={clearSession}
                className="text-xs text-text-muted hover:text-danger px-3 py-1 rounded-full border border-border hover:border-danger/30 transition-colors"
              >
                Clear Session
              </button>
            )}
            <div className="text-xs text-text-muted bg-surface-alt px-3 py-1 rounded-full border border-border">
              {currentSnapshot
                ? currentSnapshot.businessName
                : hasSession
                  ? `${completedWorkflows.length} workflow${completedWorkflows.length > 1 ? 's' : ''} completed`
                  : 'No client loaded'}
            </div>
          </div>
        </div>
        <TabNav />
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="border-t border-border bg-surface mt-8">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <p className="text-xs text-text-muted text-center">
            AI outputs must be reviewed before publishing. Avoid unverifiable claims. Regulated industries require caution.
          </p>
        </div>
      </footer>

      {referenceOpen && <ReferenceDrawer onClose={() => setReferenceOpen(false)} />}
    </div>
  )
}
