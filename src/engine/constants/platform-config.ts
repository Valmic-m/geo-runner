import type { PlatformKey, SignalKey } from '@/types/snapshot'

export interface PlatformConfig {
  key: PlatformKey
  label: string
  color: string
  prioritySignals: SignalKey[]
  description: string
}

export const PLATFORM_CONFIGS: PlatformConfig[] = [
  {
    key: 'chatgpt',
    label: 'ChatGPT',
    color: 'chatgpt',
    prioritySignals: ['comparisonPresence', 'authoritySignals', 'brandMentions', 'faqCoverage'],
    description: 'Prioritizes comparison pages, educational content, authority mentions, and blog coverage',
  },
  {
    key: 'gemini',
    label: 'Gemini',
    color: 'gemini',
    prioritySignals: ['gbpCompleteness', 'structuredData', 'reviews', 'brandMentions'],
    description: 'Prioritizes Google Business Profile, schema markup, reviews, and SEO footprint',
  },
  {
    key: 'claude',
    label: 'Claude',
    color: 'claude',
    prioritySignals: ['entityClarity', 'credibilitySignals', 'authoritySignals', 'messagingConsistency'],
    description: 'Prioritizes clear entity explanations, neutral authority content, and credibility signals',
  },
]

export const PLATFORM_MAP = Object.fromEntries(
  PLATFORM_CONFIGS.map((p) => [p.key, p])
) as Record<PlatformKey, PlatformConfig>
