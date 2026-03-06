import type { ClientGeoSnapshot } from '@/types/snapshot'

export interface CategoryPrecisionAnalysis {
  currentCategory: string
  secondaryCategory: string
  precision: 'precise' | 'broad' | 'vague' | 'misaligned'
  recommendations: string[]
  suggestedEntityDefinition: string
  positioningImprovements: string[]
}

export function analyzeCategoryPrecision(snapshot: ClientGeoSnapshot): CategoryPrecisionAnalysis {
  const { primaryCategory, secondaryCategory, audience, businessName } = snapshot
  const recommendations: string[] = []
  const positioningImprovements: string[] = []

  let precision: CategoryPrecisionAnalysis['precision'] = 'precise'

  if (!primaryCategory || primaryCategory.split(' ').length > 6) {
    precision = 'broad'
    recommendations.push('Primary category is too broad. Narrow to a specific, recognizable category label (2-4 words).')
  }

  if (!primaryCategory) {
    precision = 'vague'
    recommendations.push('No primary category defined. This is critical for AI recognition.')
  }

  const vagueTerms = ['solutions', 'services', 'group', 'company', 'agency', 'firm']
  if (vagueTerms.some((t) => primaryCategory.toLowerCase().includes(t) && primaryCategory.split(' ').length <= 2)) {
    precision = 'vague'
    recommendations.push(`"${primaryCategory}" is too generic. AI models need specific category labels like "digital marketing agency" not just "agency".`)
  }

  if (!secondaryCategory) {
    recommendations.push('Add a secondary category to strengthen category context.')
  }

  // Positioning improvements
  positioningImprovements.push(
    `Ensure "${primaryCategory}" appears consistently in: homepage title, about page, meta descriptions, and schema markup`,
    `Use the exact phrase "${primaryCategory}" in the first paragraph of your homepage`,
    'Add category context to all external profiles and directory listings',
    `Create content that directly associates ${businessName} with "${primaryCategory}"`,
  )

  if (audience) {
    positioningImprovements.push(`Explicitly connect "${primaryCategory}" to "${audience}" in your messaging`)
  }

  const suggestedEntityDefinition =
    `${businessName} is a ${primaryCategory}${secondaryCategory ? ` and ${secondaryCategory}` : ''} ` +
    `${audience ? `serving ${audience}` : ''}${snapshot.geoScope ? ` in ${snapshot.geoScope}` : ''}.`

  return {
    currentCategory: primaryCategory,
    secondaryCategory,
    precision,
    recommendations,
    suggestedEntityDefinition,
    positioningImprovements,
  }
}
