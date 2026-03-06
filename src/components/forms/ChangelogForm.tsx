import { useState, useEffect } from 'react'
import type { MonthlyChangeLog } from '@/types/changelog'
import { FormField } from '@/components/forms/FormField'
import { cn } from '@/lib/cn'

interface ChangelogFormProps {
  onChange: (changelog: MonthlyChangeLog | null) => void
}

const FIELDS: { key: keyof MonthlyChangeLog; label: string; placeholder: string }[] = [
  { key: 'newServicesProducts', label: 'New Services or Products', placeholder: 'e.g., Added emergency plumbing service, launched virtual consultations' },
  { key: 'newLocations', label: 'New Locations', placeholder: 'e.g., Opened satellite office at 456 Oak Ave' },
  { key: 'messagingChanges', label: 'Messaging Changes', placeholder: 'e.g., Updated tagline, revised homepage copy' },
  { key: 'pricingChanges', label: 'Pricing Changes', placeholder: 'e.g., Introduced tiered pricing, added free tier' },
  { key: 'complianceUpdates', label: 'Compliance Updates', placeholder: 'e.g., Updated privacy policy, new industry certifications' },
  { key: 'campaignsLaunched', label: 'Campaigns Launched', placeholder: 'e.g., Spring promotion, Google Ads campaign' },
  { key: 'priorityRevenueFocus', label: 'Priority Revenue Focus', placeholder: 'e.g., Enterprise clients, upselling existing accounts' },
]

export function ChangelogForm({ onChange }: ChangelogFormProps) {
  const [form, setForm] = useState<Record<keyof MonthlyChangeLog, string>>({
    newServicesProducts: '',
    newLocations: '',
    messagingChanges: '',
    pricingChanges: '',
    complianceUpdates: '',
    campaignsLaunched: '',
    priorityRevenueFocus: '',
  })

  const hasAnyContent = Object.values(form).some((v) => v.trim())

  useEffect(() => {
    if (hasAnyContent) {
      onChange(form as MonthlyChangeLog)
    } else {
      onChange(null)
    }
  }, [form, hasAnyContent, onChange])

  const updateField = (key: keyof MonthlyChangeLog, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const inputClass = cn(
    'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm',
    'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
    'placeholder:text-text-muted/50',
  )

  return (
    <div className="border border-border rounded-xl p-4 bg-surface space-y-3">
      {FIELDS.map(({ key, label, placeholder }) => (
        <FormField key={key} label={label}>
          <input
            type="text"
            value={form[key]}
            onChange={(e) => updateField(key, e.target.value)}
            placeholder={placeholder}
            className={inputClass}
          />
        </FormField>
      ))}
    </div>
  )
}
