import type { SignalKey } from '@/types/snapshot'
import type { ArtifactType } from '@/types/artifacts'

export interface SignalDefinition {
  key: SignalKey
  label: string
  weight: number
  criticalThreshold: number
  artifactType: ArtifactType
  description: string
}

export const SIGNAL_DEFINITIONS: SignalDefinition[] = [
  {
    key: 'entityClarity',
    label: 'Entity Clarity',
    weight: 0.15,
    criticalThreshold: 3,
    artifactType: 'entity-definition-block',
    description: 'How clearly the brand is defined as a distinct entity that AI models can identify and describe',
  },
  {
    key: 'brandMentions',
    label: 'Brand Mentions',
    weight: 0.08,
    criticalThreshold: 3,
    artifactType: 'authority-article-outline',
    description: 'Frequency and quality of brand mentions across the web',
  },
  {
    key: 'comparisonPresence',
    label: 'Comparison Presence',
    weight: 0.10,
    criticalThreshold: 3,
    artifactType: 'comparison-page-outline',
    description: 'Presence in comparison and alternatives content',
  },
  {
    key: 'faqCoverage',
    label: 'FAQ Coverage',
    weight: 0.10,
    criticalThreshold: 3,
    artifactType: 'faq-set',
    description: 'Breadth and depth of FAQ content addressing common queries',
  },
  {
    key: 'structuredData',
    label: 'Structured Data',
    weight: 0.08,
    criticalThreshold: 3,
    artifactType: 'schema-draft',
    description: 'Schema markup and structured data implementation',
  },
  {
    key: 'reviews',
    label: 'Reviews',
    weight: 0.08,
    criticalThreshold: 3,
    artifactType: 'review-request-script',
    description: 'Volume and quality of reviews across platforms',
  },
  {
    key: 'authoritySignals',
    label: 'Authority Signals',
    weight: 0.12,
    criticalThreshold: 3,
    artifactType: 'authority-article-outline',
    description: 'Indicators of topical authority and expertise',
  },
  {
    key: 'citations',
    label: 'Citations',
    weight: 0.10,
    criticalThreshold: 3,
    artifactType: 'authority-article-outline',
    description: 'Third-party citations and references from independent sources',
  },
  {
    key: 'gbpCompleteness',
    label: 'GBP Completeness',
    weight: 0.05,
    criticalThreshold: 3,
    artifactType: 'gbp-qa-set',
    description: 'Google Business Profile completeness and optimization',
  },
  {
    key: 'knowledgeGraphSignals',
    label: 'Knowledge Graph Signals',
    weight: 0.05,
    criticalThreshold: 3,
    artifactType: 'entity-definition-block',
    description: 'Signals that help AI models connect the brand to knowledge graph entities',
  },
  {
    key: 'messagingConsistency',
    label: 'Messaging Consistency',
    weight: 0.04,
    criticalThreshold: 3,
    artifactType: 'entity-definition-block',
    description: 'Consistency of brand messaging across all touchpoints',
  },
  {
    key: 'credibilitySignals',
    label: 'Credibility Signals',
    weight: 0.05,
    criticalThreshold: 3,
    artifactType: 'authority-article-outline',
    description: 'Trust indicators like certifications, awards, and endorsements',
  },
]

export const SIGNAL_MAP = Object.fromEntries(
  SIGNAL_DEFINITIONS.map((s) => [s.key, s])
) as Record<SignalKey, SignalDefinition>
