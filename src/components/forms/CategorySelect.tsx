import { useState, useRef, useEffect } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { BUSINESS_CATEGORIES } from '@/engine/constants/business-categories'
import { cn } from '@/lib/cn'

interface CategorySelectProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function CategorySelect({ value, onChange, placeholder = 'Search or select a category...', className }: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = search.trim()
    ? BUSINESS_CATEGORIES.filter(c => c.toLowerCase().includes(search.toLowerCase()))
    : [...BUSINESS_CATEGORIES]

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (category: string) => {
    onChange(category)
    setIsOpen(false)
    setSearch('')
  }

  const handleClear = () => {
    onChange('')
    setSearch('')
    inputRef.current?.focus()
  }

  const handleInputChange = (val: string) => {
    setSearch(val)
    // Also update the actual value for custom entries
    onChange(val)
    if (!isOpen) setIsOpen(true)
  }

  const handleFocus = () => {
    setIsOpen(true)
    setSearch(value)
  }

  const displayValue = isOpen ? search : value

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleFocus}
          placeholder={placeholder}
          className={cn(
            'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm pr-16',
            'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
            'placeholder:text-text-muted/50',
            className,
          )}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 rounded hover:bg-surface-alt text-text-muted"
            >
              <X size={14} />
            </button>
          )}
          <ChevronDown size={14} className={cn('text-text-muted transition-transform', isOpen && 'rotate-180')} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-lg border border-border bg-surface shadow-lg">
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-text-muted">
              No matches. Your custom entry will be used.
            </div>
          ) : (
            filtered.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleSelect(category)}
                className={cn(
                  'w-full text-left px-3 py-2 text-sm hover:bg-surface-alt transition-colors',
                  value === category && 'bg-primary/5 text-primary font-medium',
                )}
              >
                {category}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
