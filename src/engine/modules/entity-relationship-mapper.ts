import type { ClientGeoSnapshot } from '@/types/snapshot'
import type { EntityGraph, EntityNode, EntityEdge } from '@/types/entity-map'

export function mapEntityRelationships(snapshot: ClientGeoSnapshot): EntityGraph {
  const nodes: EntityNode[] = []
  const edges: EntityEdge[] = []

  // Company node
  if (snapshot.businessName) {
    nodes.push({ name: snapshot.businessName, type: 'company' })
  }

  // Service/category nodes
  if (snapshot.primaryCategory) {
    nodes.push({ name: snapshot.primaryCategory, type: 'service' })
    edges.push({
      from: snapshot.businessName,
      to: snapshot.primaryCategory,
      relationship: 'provides',
    })
  }

  if (snapshot.secondaryCategory) {
    nodes.push({ name: snapshot.secondaryCategory, type: 'service' })
    edges.push({
      from: snapshot.businessName,
      to: snapshot.secondaryCategory,
      relationship: 'also provides',
    })
  }

  // Location node
  if (snapshot.geoScope) {
    const locations = snapshot.geoScope.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
    for (const loc of locations) {
      nodes.push({ name: loc, type: 'location' })
      edges.push({
        from: snapshot.businessName,
        to: loc,
        relationship: 'operates in',
      })
    }
  }

  // Audience as industry node
  if (snapshot.audience) {
    nodes.push({ name: snapshot.audience, type: 'industry' })
    edges.push({
      from: snapshot.businessName,
      to: snapshot.audience,
      relationship: 'serves',
    })
  }

  // Competitor nodes
  for (const comp of snapshot.competitors) {
    nodes.push({ name: comp.name, type: 'company' })
    edges.push({
      from: snapshot.businessName,
      to: comp.name,
      relationship: 'competes with',
    })
  }

  // Summary
  const summary = generateEntityMapSummary(snapshot, nodes, edges)

  // Schema recommendations
  const schemaRecommendations = [
    'Add Organization schema with @type, name, description, url, areaServed',
    `Add Service schema for "${snapshot.primaryCategory}"`,
    snapshot.secondaryCategory ? `Add Service schema for "${snapshot.secondaryCategory}"` : '',
    'Add sameAs links to all social profiles and external listings',
    'Add knowsAbout property linking to service categories',
    snapshot.geoScope ? `Add areaServed with GeoCircle or AdministrativeArea for ${snapshot.geoScope}` : '',
  ].filter(Boolean)

  // Content alignment checklist
  const contentAlignmentChecklist = [
    `Homepage mentions "${snapshot.primaryCategory}" in first paragraph`,
    `About page contains entity definition connecting ${snapshot.businessName} to ${snapshot.primaryCategory}`,
    'Service pages use consistent category terminology',
    'External profiles mirror the same entity description',
    `Meta descriptions include "${snapshot.primaryCategory}" and "${snapshot.businessName}"`,
    'Schema markup matches visible page content',
    'All pages reference the same geographic scope',
    snapshot.competitors.length > 0 ? 'Comparison content addresses key competitors' : '',
  ].filter(Boolean)

  return { nodes, edges, summary, schemaRecommendations, contentAlignmentChecklist }
}

function generateEntityMapSummary(
  snapshot: ClientGeoSnapshot,
  nodes: EntityNode[],
  edges: EntityEdge[],
): string {
  const lines = [
    `Entity Map for ${snapshot.businessName}`,
    '',
    `Company: ${snapshot.businessName}`,
    `Category: ${snapshot.primaryCategory}`,
  ]

  if (snapshot.secondaryCategory) lines.push(`Secondary: ${snapshot.secondaryCategory}`)
  if (snapshot.geoScope) lines.push(`Locations: ${snapshot.geoScope}`)
  if (snapshot.audience) lines.push(`Serves: ${snapshot.audience}`)
  if (snapshot.competitors.length > 0) lines.push(`Competes with: ${snapshot.competitors.map((c) => c.name).join(', ')}`)

  lines.push('', `Total entities: ${nodes.length}`, `Total relationships: ${edges.length}`)

  return lines.join('\n')
}
