import { cn } from '@/lib/cn'
import type { PlatformKey } from '@/types/snapshot'

interface PlatformBadgeProps {
  platform: PlatformKey | 'all'
  size?: 'sm' | 'md'
}

const platformStyles: Record<string, string> = {
  chatgpt: 'bg-chatgpt/10 text-chatgpt',
  gemini: 'bg-gemini/10 text-gemini',
  claude: 'bg-claude/10 text-claude',
  perplexity: 'bg-perplexity/10 text-perplexity',
  aiOverviews: 'bg-aiOverviews/10 text-aiOverviews',
  all: 'bg-primary/10 text-primary',
}

const platformLabels: Record<string, string> = {
  chatgpt: 'ChatGPT',
  gemini: 'Gemini',
  claude: 'Claude',
  perplexity: 'Perplexity',
  aiOverviews: 'AI Overviews',
  all: 'All Platforms',
}

export function PlatformBadge({ platform, size = 'sm' }: PlatformBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-medium',
      platformStyles[platform],
      size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1',
    )}>
      {platformLabels[platform]}
    </span>
  )
}
