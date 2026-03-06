export interface EntityNode {
  name: string
  type: 'company' | 'person' | 'service' | 'product' | 'location' | 'certification' | 'industry'
}

export interface EntityEdge {
  from: string
  to: string
  relationship: string
}

export interface EntityGraph {
  nodes: EntityNode[]
  edges: EntityEdge[]
  summary: string
  schemaRecommendations: string[]
  contentAlignmentChecklist: string[]
}
