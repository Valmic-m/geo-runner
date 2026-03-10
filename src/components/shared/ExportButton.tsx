import { useState, useRef, useEffect } from 'react'
import { Download, ChevronDown, FileText, Globe, Printer } from 'lucide-react'
import { useExport } from '@/hooks/useExport'
import { cn } from '@/lib/cn'

interface ExportButtonProps {
  content: string
  filename: string
  label?: string
  className?: string
  reportHtml?: string
}

export function ExportButton({ content, filename, label, className, reportHtml }: ExportButtonProps) {
  const { exportAsMarkdown, exportAsReport, printReport } = useExport()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  // Simple mode: no report data, just markdown export
  if (!reportHtml) {
    return (
      <button
        onClick={() => exportAsMarkdown(content, filename)}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium',
          'border border-border bg-surface shadow-sm hover:shadow-md active:scale-[0.97] transition-all duration-150',
          className,
        )}
      >
        <Download size={14} />
        {label || 'Export .md'}
      </button>
    )
  }

  // Dropdown mode: multiple export options
  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium',
          'border border-border bg-surface shadow-sm hover:shadow-md active:scale-[0.97] transition-all duration-150',
        )}
      >
        <Download size={14} />
        {label || 'Export'}
        <ChevronDown size={12} className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-52 rounded-lg border border-border bg-surface shadow-lg z-50 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
          <button
            onClick={() => { exportAsMarkdown(content, filename); setOpen(false) }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-text hover:bg-surface-alt transition-colors"
          >
            <FileText size={14} className="text-text-muted" />
            Export Markdown (.md)
          </button>
          <button
            onClick={() => { exportAsReport(reportHtml, filename.replace(/\.md$/, '')); setOpen(false) }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-text hover:bg-surface-alt transition-colors"
          >
            <Globe size={14} className="text-text-muted" />
            Download Report (.html)
          </button>
          <button
            onClick={() => { printReport(reportHtml); setOpen(false) }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-text hover:bg-surface-alt transition-colors"
          >
            <Printer size={14} className="text-text-muted" />
            Save as PDF (Print)
          </button>
        </div>
      )}
    </div>
  )
}
