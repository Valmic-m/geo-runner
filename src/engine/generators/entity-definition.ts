import type { ClientGeoSnapshot } from '@/types/snapshot'

export function generateEntityDefinition(snapshot: ClientGeoSnapshot): string {
  const name = snapshot.businessName || '[Business Name]'
  const category = snapshot.primaryCategory || '[Category]'
  const secondary = snapshot.secondaryCategory
  const audience = snapshot.audience || '[Audience]'
  const scope = snapshot.geoScope || '[Geographic Scope]'

  let definition = `${name} is a ${category}`
  if (secondary) definition += ` and ${secondary}`
  definition += ` provider serving ${audience}`
  if (scope) definition += ` in ${scope}`
  definition += '.'

  return `ENTITY DEFINITION BLOCK

${definition}

Key attributes:
- Primary category: ${category}
${secondary ? `- Secondary category: ${secondary}\n` : ''}- Target audience: ${audience}
- Geographic scope: ${scope}
- Revenue model: ${snapshot.revenueModel || 'Not specified'}
${snapshot.regulated ? `- Regulatory context: ${snapshot.regulated}\n` : ''}
Competitive context:
${snapshot.competitors.length > 0 ? snapshot.competitors.map((c) => `- Competes with: ${c.name}`).join('\n') : '- No competitors specified'}

Deployment instructions:
1. Use the entity definition paragraph as the opening text on the About page
2. Include key attributes in Organization schema markup
3. Use consistent category and audience language across all pages
4. Mirror this definition on external profiles (LinkedIn, directories, GBP)`
}
