import type { ClientGeoSnapshot, PlatformKey } from '@/types/snapshot'

/**
 * Generate 2-3 quick test queries for a single platform.
 * Used for inline guidance in the AI Visibility step.
 */
export function generateQuickTestPrompts(
  businessName: string,
  category: string,
  location: string,
  _platform: PlatformKey,
): string[] {
  const name = businessName || '[Business Name]'
  const cat = category || '[Category]'
  const loc = location || '[Location]'

  const prompts: string[] = [
    `What are the best ${cat} companies?`,
    `Tell me about ${name}`,
  ]

  if (loc && loc !== '[Location]') {
    prompts.push(`Best ${cat} in ${loc}`)
  } else {
    prompts.push(`Is ${name} a good ${cat} company?`)
  }

  return prompts
}

export interface TestPrompt {
  platform: PlatformKey
  category: string
  prompt: string
}

export function generateTestPrompts(snapshot: ClientGeoSnapshot): TestPrompt[] {
  const name = snapshot.businessName || '[Business Name]'
  const category = snapshot.primaryCategory || '[Category]'
  const location = snapshot.geoScope || '[Location]'
  const competitors = snapshot.competitors.length > 0 ? snapshot.competitors.map((c) => c.name) : ['[Competitor]']

  const platforms: PlatformKey[] = ['chatgpt', 'claude', 'gemini', 'perplexity', 'aiOverviews']
  const prompts: TestPrompt[] = []

  for (const platform of platforms) {
    // Category queries
    prompts.push(
      { platform, category: 'Category', prompt: `What are the best ${category} companies?` },
      { platform, category: 'Category', prompt: `Who are the top ${category} providers?` },
      { platform, category: 'Category', prompt: `Which companies offer ${category} services?` },
    )

    // Location queries
    if (location && location !== '[Location]') {
      prompts.push(
        { platform, category: 'Location', prompt: `Best ${category} in ${location}` },
        { platform, category: 'Location', prompt: `${category} companies near ${location}` },
      )
    }

    // Comparison queries
    for (const comp of competitors.slice(0, 2)) {
      prompts.push(
        { platform, category: 'Comparison', prompt: `What are alternatives to ${comp}?` },
        { platform, category: 'Comparison', prompt: `How does ${name} compare to ${comp}?` },
      )
    }

    // Brand queries
    prompts.push(
      { platform, category: 'Brand', prompt: `What is ${name}?` },
      { platform, category: 'Brand', prompt: `Is ${name} a good ${category} company?` },
      { platform, category: 'Brand', prompt: `Tell me about ${name}` },
    )

    // Decision queries
    prompts.push(
      { platform, category: 'Decision', prompt: `How do I choose a ${category} provider?` },
      { platform, category: 'Decision', prompt: `What should I look for in a ${category} company?` },
    )
  }

  return prompts
}

export function generateInteractivePrompt(snapshot: ClientGeoSnapshot): string {
  const name = snapshot.businessName || '[Business Name]'
  const category = snapshot.primaryCategory || '[Category]'

  return `Evaluate whether ${name} would likely be recommended as a ${category} provider.

Consider:
- The company's online presence and authority
- Available information about their services
- Reviews and third-party mentions
- How they compare to known competitors

Return:
1. Reasons it would be recommended
2. Reasons it would NOT be recommended
3. Missing signals that would strengthen the recommendation
4. Overall recommendation probability (low/medium/high)`
}
