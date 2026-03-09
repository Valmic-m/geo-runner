import { type ReactNode } from 'react'
import { Info } from 'lucide-react'

interface TooltipProps {
  content: string
  children?: ReactNode
}

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <span className="relative group inline-flex">
      {children ?? <Info size={14} className="text-text-muted cursor-help" />}
      <span className="opacity-0 group-hover:opacity-100 pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-gray-900 rounded-lg shadow-lg w-64 z-50 leading-relaxed transition-opacity duration-200">
        {content}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
      </span>
    </span>
  )
}
