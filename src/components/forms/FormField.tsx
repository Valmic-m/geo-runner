import type { ReactNode } from 'react'
import { Tooltip } from '@/components/shared/Tooltip'

interface FormFieldProps {
  label: string
  helpText?: string
  required?: boolean
  children: ReactNode
}

export function FormField({ label, helpText, required, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-text">
        {label}
        {required && <span className="text-danger">*</span>}
        {helpText && <Tooltip content={helpText} />}
      </label>
      {children}
    </div>
  )
}
