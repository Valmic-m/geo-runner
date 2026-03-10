import type { PlatformKey, SignalKey } from '@/types/snapshot'

export interface PlatformConfig {
  key: PlatformKey
  label: string
  color: string
  prioritySignals: SignalKey[]
  description: string
  testUrl: string
}

export const PLATFORM_CONFIGS: PlatformConfig[] = [
  {
    key: 'chatgpt',
    label: 'ChatGPT',
    color: 'chatgpt',
    prioritySignals: ['comparisonPresence', 'authoritySignals', 'brandMentions', 'faqCoverage'],
    description: 'Prioritizes comparison pages, educational content, authority mentions, and blog coverage',
    testUrl: 'https://chat.openai.com',
  },
  {
    key: 'gemini',
    label: 'Gemini',
    color: 'gemini',
    prioritySignals: ['gbpCompleteness', 'structuredData', 'reviews', 'brandMentions'],
    description: 'Prioritizes Google Business Profile, schema markup, reviews, and SEO footprint',
    testUrl: 'https://gemini.google.com',
  },
  {
    key: 'claude',
    label: 'Claude',
    color: 'claude',
    prioritySignals: ['entityClarity', 'credibilitySignals', 'authoritySignals', 'messagingConsistency'],
    description: 'Prioritizes clear entity explanations, neutral authority content, and credibility signals',
    testUrl: 'https://claude.ai',
  },
  {
    key: 'perplexity',
    label: 'Perplexity',
    color: 'perplexity',
    prioritySignals: ['citations', 'authoritySignals', 'faqCoverage', 'comparisonPresence'],
    description: 'Prioritizes cited sources, authoritative content, FAQ coverage, and comparison presence',
    testUrl: 'https://perplexity.ai',
  },
  {
    key: 'aiOverviews',
    label: 'AI Overviews',
    color: 'aiOverviews',
    prioritySignals: ['structuredData', 'faqCoverage', 'reviews', 'gbpCompleteness'],
    description: 'Prioritizes schema markup, FAQ content, review signals, and Google Business Profile',
    testUrl: 'https://google.com',
  },
]

export const PLATFORM_MAP = Object.fromEntries(
  PLATFORM_CONFIGS.map((p) => [p.key, p])
) as Record<PlatformKey, PlatformConfig>
