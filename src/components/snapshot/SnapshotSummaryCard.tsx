import { Pencil, Building2, Users, MapPin, Target } from 'lucide-react'
import type { ClientGeoSnapshot } from '@/types/snapshot'
import { cn } from '@/lib/cn'

interface SnapshotSummaryCardProps {
  snapshot: ClientGeoSnapshot
  onEdit: () => void
  className?: string
}

export function SnapshotSummaryCard({ snapshot, onEdit, className }: SnapshotSummaryCardProps) {
  const signalValues = Object.values(snapshot.signals)
  const avgSignal = signalValues.length > 0
    ? (signalValues.reduce((a, b) => a + b, 0) / signalValues.length).toFixed(1)
    : '—'

  return (
    <div className={cn('border border-border rounded-xl bg-surface overflow-hidden shadow-sm', className)}>
      <div className="h-1 bg-gradient-to-r from-primary to-accent" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm text-text">Client Snapshot</h3>
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-dark active:scale-[0.97] transition-all duration-200 px-2.5 py-1.5 rounded-lg hover:bg-primary/5 hover:shadow-sm"
          >
            <Pencil size={13} />
            Edit
          </button>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-base font-extrabold tracking-tight text-text">{snapshot.businessName || 'Unnamed Business'}</span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-text-muted">
            <Building2 size={12} className="shrink-0" />
            <span className="truncate">{snapshot.primaryCategory || 'No category'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-text-muted">
            <Users size={12} className="shrink-0" />
            <span className="truncate">{snapshot.audience || 'No audience set'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-text-muted">
            <MapPin size={12} className="shrink-0" />
            <span className="truncate">{snapshot.geoScope || 'No scope set'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-text-muted">
            <Target size={12} className="shrink-0" />
            <span className="truncate">Avg signal: {avgSignal}/5</span>
          </div>
        </div>

        {snapshot.focusTier && (
          <div className="mt-3 pt-3 border-t border-border">
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium shadow-sm">
              {snapshot.focusTier}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
