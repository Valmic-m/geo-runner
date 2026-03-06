import type { SignalKey } from './snapshot'

export type ArtifactType =
  | 'entity-definition-block'
  | 'faq-set'
  | 'comparison-page-outline'
  | 'gbp-qa-set'
  | 'schema-draft'
  | 'review-request-script'
  | 'authority-article-outline'

export interface DeploymentInstruction {
  targets: string[]
  priority: 'high' | 'medium' | 'low'
  notes: string
}

export interface Artifact {
  type: ArtifactType
  title: string
  content: string
  targetSignals: SignalKey[]
  deployment: DeploymentInstruction
  isExternalDistribution: boolean
}
