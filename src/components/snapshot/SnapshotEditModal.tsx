import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { SnapshotForm } from '@/components/forms/SnapshotForm'
import type { ClientGeoSnapshot } from '@/types/snapshot'

interface SnapshotEditModalProps {
  snapshot: ClientGeoSnapshot
  onSave: (snapshot: ClientGeoSnapshot) => void
  onClose: () => void
}

export function SnapshotEditModal({ snapshot, onSave, onClose }: SnapshotEditModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose()
  }

  const handleSubmit = (updated: ClientGeoSnapshot) => {
    onSave(updated)
    onClose()
  }

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-[5vh] overflow-y-auto"
    >
      <div className="w-full max-w-2xl bg-surface rounded-xl border border-border shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-text">Edit Client Snapshot</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-alt transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5">
          <SnapshotForm
            onSubmit={handleSubmit}
            initialSnapshot={snapshot}
            submitLabel="Save Snapshot"
          />
        </div>
      </div>
    </div>
  )
}
