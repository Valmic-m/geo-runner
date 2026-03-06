import { useState, useEffect } from 'react'
import type { AuthoritySnapshot } from '@/types/authority'
import { FormField } from '@/components/forms/FormField'
import { cn } from '@/lib/cn'

interface AuthorityFormProps {
  onChange: (authority: AuthoritySnapshot | null) => void
}

const FIELDS: { key: keyof AuthoritySnapshot; label: string; placeholder: string; helpText: string }[] = [
  { key: 'currentAuthoritySources', label: 'Current Authority Sources', placeholder: 'e.g., Industry blog contributions, podcast appearances, expert panels', helpText: 'Where does your business currently appear as an authority? List sites or channels.' },
  { key: 'industryDirectories', label: 'Industry Directories', placeholder: 'e.g., Yelp, BBB, Clutch, G2, industry-specific directories', helpText: 'Directories where your business is currently listed.' },
  { key: 'mediaPresence', label: 'Media Presence', placeholder: 'e.g., Local news features, trade publication mentions, press releases', helpText: 'Any media coverage or press mentions your business has received.' },
  { key: 'partnerMentions', label: 'Partner Mentions', placeholder: 'e.g., Listed on partner websites, co-marketing materials', helpText: 'Places where partners or affiliates mention your business.' },
  { key: 'certifications', label: 'Certifications', placeholder: 'e.g., ISO 9001, Google Partner, AWS Certified, industry licenses', helpText: 'Professional certifications, licenses, or accreditations.' },
  { key: 'awards', label: 'Awards', placeholder: 'e.g., Best of 2024, Industry Innovation Award, local business awards', helpText: 'Awards or recognitions the business has received.' },
  { key: 'speakingEngagements', label: 'Speaking Engagements', placeholder: 'e.g., Industry conferences, webinars, local events, workshops', helpText: 'Events where team members have spoken or presented.' },
  { key: 'publications', label: 'Publications', placeholder: 'e.g., Whitepapers, case studies, research reports, books', helpText: 'Published content that establishes expertise.' },
]

export function AuthorityForm({ onChange }: AuthorityFormProps) {
  const [form, setForm] = useState<Record<string, string>>({
    currentAuthoritySources: '',
    industryDirectories: '',
    mediaPresence: '',
    partnerMentions: '',
    certifications: '',
    awards: '',
    speakingEngagements: '',
    publications: '',
  })

  const hasAnyContent = Object.values(form).some((v) => v.trim())

  useEffect(() => {
    if (hasAnyContent) {
      const authority: AuthoritySnapshot = {
        currentAuthoritySources: splitCommas(form.currentAuthoritySources),
        industryDirectories: splitCommas(form.industryDirectories),
        mediaPresence: splitCommas(form.mediaPresence),
        partnerMentions: splitCommas(form.partnerMentions),
        certifications: splitCommas(form.certifications),
        awards: splitCommas(form.awards),
        speakingEngagements: splitCommas(form.speakingEngagements),
        publications: splitCommas(form.publications),
      }
      onChange(authority)
    } else {
      onChange(null)
    }
  }, [form, hasAnyContent, onChange])

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const inputClass = cn(
    'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm',
    'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
    'placeholder:text-text-muted/50',
  )

  return (
    <div className="border border-border rounded-xl p-4 bg-surface space-y-3">
      <p className="text-xs text-text-muted">Separate multiple items with commas.</p>
      {FIELDS.map(({ key, label, placeholder, helpText }) => (
        <FormField key={key} label={label} helpText={helpText}>
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

function splitCommas(value: string): string[] {
  return value.split(',').map((s) => s.trim()).filter(Boolean)
}
