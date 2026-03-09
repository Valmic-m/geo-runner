import { Copy, Check } from 'lucide-react'
import { useClipboard } from '@/hooks/useClipboard'
import { cn } from '@/lib/cn'

interface CopyButtonProps {
  text: string
  label?: string
  className?: string
}

export function CopyButton({ text, label = 'Copy', className }: CopyButtonProps) {
  const { copied, copy } = useClipboard()

  return (
    <button
      onClick={() => copy(text)}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium',
        'border border-border bg-surface shadow-sm hover:shadow-md active:scale-[0.97] transition-all duration-150',
        copied && 'text-success border-success/30',
        className,
      )}
    >
      {copied ? <Check size={14} className="animate-scale-in" /> : <Copy size={14} />}
      {copied ? 'Copied!' : label}
    </button>
  )
}
