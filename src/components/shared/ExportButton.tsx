import { Download } from 'lucide-react'
import { useExport } from '@/hooks/useExport'
import { cn } from '@/lib/cn'

interface ExportButtonProps {
  content: string
  filename: string
  label?: string
  className?: string
}

export function ExportButton({ content, filename, label = 'Export .md', className }: ExportButtonProps) {
  const { exportAsMarkdown } = useExport()

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
      {label}
    </button>
  )
}
