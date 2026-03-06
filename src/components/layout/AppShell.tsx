import type { ReactNode } from 'react'
import { TabNav } from './TabNav'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-alt">
      <header className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-text">GEO Runner</h1>
            <p className="text-xs text-text-muted">Generative Engine Optimization Workflow Tool</p>
          </div>
          <div className="text-xs text-text-muted bg-surface-alt px-3 py-1 rounded-full border border-border">
            Stateless - No data stored
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
    </div>
  )
}
