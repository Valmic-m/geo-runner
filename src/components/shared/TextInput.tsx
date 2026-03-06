import { cn } from '@/lib/cn'

interface TextInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  template?: string
  required?: boolean
  rows?: number
}

export function TextInput({ label, value, onChange, placeholder, template, required, rows = 12 }: TextInputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text">
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </label>
      {template && !value && (
        <button
          type="button"
          onClick={() => onChange(template)}
          className="text-xs text-primary hover:text-primary-dark underline"
        >
          Load template
        </button>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? 'Paste content here...'}
        rows={rows}
        className={cn(
          'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm font-mono',
          'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
          'placeholder:text-text-muted/50 resize-y',
        )}
      />
    </div>
  )
}
