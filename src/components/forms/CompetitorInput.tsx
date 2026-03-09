import { useState } from 'react'
import { Plus, X, Loader2, Globe, Building2 } from 'lucide-react'
import type { Competitor } from '@/types/snapshot'
import { extractCompetitorName } from '@/lib/competitor-utils'
import { fetchUrlContent } from '@/lib/fetch-url'
import { parseWebsiteContent } from '@/engine/parsers/website-parser'
import { cn } from '@/lib/cn'

interface CompetitorInputProps {
  competitors: Competitor[]
  onChange: (competitors: Competitor[]) => void
  maxCompetitors?: number
}

export function CompetitorInput({ competitors, onChange, maxCompetitors = 5 }: CompetitorInputProps) {
  const [newUrl, setNewUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const inputClass = cn(
    'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm',
    'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
    'placeholder:text-text-muted/50',
  )

  const handleAdd = async () => {
    const url = newUrl.trim()
    if (!url) return

    // Normalize URL
    const normalized = url.startsWith('http') ? url : `https://${url}`
    const name = extractCompetitorName(normalized)

    // Check for duplicates
    if (competitors.some((c) => c.name.toLowerCase() === name.toLowerCase() || c.url === normalized)) {
      setError('This competitor is already added.')
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      const fetched = await fetchUrlContent(normalized)
      const parsed = parseWebsiteContent(fetched.plainText, fetched.rawHtml)

      const competitor: Competitor = {
        url: normalized,
        name,
        category: parsed.data?.detectedCategories[0],
        description: parsed.data
          ? `${parsed.data.detectedCategories.slice(0, 2).join(', ')}${parsed.data.hasLocalFocus ? ' (local)' : ''}`
          : undefined,
      }

      onChange([...competitors, competitor])
      setNewUrl('')
    } catch {
      // Fetch failed — still add with just the name from URL
      onChange([...competitors, { url: normalized, name }])
      setNewUrl('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = (index: number) => {
    onChange(competitors.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className="space-y-3">
      {/* Existing competitors */}
      {competitors.length > 0 && (
        <div className="space-y-2">
          {competitors.map((comp, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2 rounded-lg border border-border bg-surface-alt"
            >
              <Building2 size={14} className="text-text-muted shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">{comp.name}</p>
                {comp.url && (
                  <p className="text-xs text-text-muted truncate">{comp.url}</p>
                )}
                {comp.description && (
                  <p className="text-xs text-text-muted">{comp.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="p-1 rounded text-text-muted hover:text-danger hover:bg-danger/10 transition-colors shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add new competitor */}
      {competitors.length < maxCompetitors && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={newUrl}
                onChange={(e) => { setNewUrl(e.target.value); setError(null) }}
                onKeyDown={handleKeyDown}
                placeholder="https://competitor.com"
                className={cn(inputClass, 'pl-9')}
                disabled={isLoading}
              />
            </div>
            <button
              type="button"
              onClick={handleAdd}
              disabled={!newUrl.trim() || isLoading}
              className={cn(
                'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                newUrl.trim() && !isLoading
                  ? 'bg-primary text-white hover:bg-primary-dark'
                  : 'bg-border text-text-muted cursor-not-allowed',
              )}
            >
              {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Add
            </button>
          </div>
          {error && <p className="text-xs text-danger">{error}</p>}
          <p className="text-xs text-text-muted">
            Enter a competitor website URL. We'll extract their name and category automatically.
          </p>
        </div>
      )}

      {competitors.length >= maxCompetitors && (
        <p className="text-xs text-text-muted">Maximum {maxCompetitors} competitors reached.</p>
      )}
    </div>
  )
}
