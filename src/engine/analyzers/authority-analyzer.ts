import type { AuthoritySnapshot, CitationOpportunity } from '@/types/authority'

export interface AuthorityAnalysis {
  currentStrength: 'strong' | 'moderate' | 'weak' | 'minimal'
  gaps: string[]
  citationOpportunities: CitationOpportunity[]
  contentExpansionPlan: string[]
}

export function analyzeAuthority(authority: AuthoritySnapshot, category: string): AuthorityAnalysis {
  const totalSources =
    authority.currentAuthoritySources.length +
    authority.industryDirectories.length +
    authority.mediaPresence.length +
    authority.partnerMentions.length

  let currentStrength: AuthorityAnalysis['currentStrength']
  if (totalSources >= 15) currentStrength = 'strong'
  else if (totalSources >= 8) currentStrength = 'moderate'
  else if (totalSources >= 3) currentStrength = 'weak'
  else currentStrength = 'minimal'

  const gaps: string[] = []
  if (authority.industryDirectories.length === 0) gaps.push('No industry directory listings')
  if (authority.mediaPresence.length === 0) gaps.push('No media coverage or mentions')
  if (authority.partnerMentions.length === 0) gaps.push('No partner or co-marketing mentions')
  if (authority.certifications.length === 0) gaps.push('No certifications listed')
  if (authority.publications.length === 0) gaps.push('No published content or thought leadership')
  if (authority.speakingEngagements.length === 0) gaps.push('No speaking engagements or event participation')

  const citationOpportunities: CitationOpportunity[] = []

  if (authority.industryDirectories.length < 5) {
    citationOpportunities.push({
      source: `Top ${category} industry directories`,
      type: 'directory',
      effort: 'low',
      expectedImpact: 'medium',
      action: `List the business on 3-5 relevant ${category} directories`,
    })
  }

  if (authority.mediaPresence.length < 3) {
    citationOpportunities.push({
      source: 'Industry publications and blogs',
      type: 'media',
      effort: 'medium',
      expectedImpact: 'high',
      action: 'Pitch guest articles or expert commentary to industry publications',
    })
  }

  if (authority.partnerMentions.length < 2) {
    citationOpportunities.push({
      source: 'Partner and vendor websites',
      type: 'partner',
      effort: 'low',
      expectedImpact: 'medium',
      action: 'Request partner/vendor listings and co-marketing mentions',
    })
  }

  citationOpportunities.push({
    source: 'Professional associations',
    type: 'association',
    effort: 'low',
    expectedImpact: 'medium',
    action: `Join and get listed on relevant ${category} professional associations`,
  })

  if (authority.publications.length < 2) {
    citationOpportunities.push({
      source: 'LinkedIn and Medium articles',
      type: 'publication',
      effort: 'medium',
      expectedImpact: 'medium',
      action: 'Publish 2-3 thought leadership articles on LinkedIn or Medium',
    })
  }

  const contentExpansionPlan: string[] = [
    `Publish a comprehensive "${category} Guide" as a pillar content piece`,
    `Create a case study showcasing results in ${category}`,
    'Develop a resource page linking to industry research and standards',
    'Write comparison content covering key competitors',
    'Build a FAQ page addressing top 20 industry questions',
  ]

  if (authority.certifications.length > 0) {
    contentExpansionPlan.push(`Create a credentials page highlighting: ${authority.certifications.join(', ')}`)
  }

  return { currentStrength, gaps, citationOpportunities, contentExpansionPlan }
}
