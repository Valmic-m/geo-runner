import type { SignalKey, PlatformKey } from './snapshot'
import type { ArtifactType } from './artifacts'

export interface SignalDiagnostic {
  signal: SignalKey
  score: number
  label: string
  status: 'critical' | 'weak' | 'moderate' | 'strong'
  recommendation: string
}

export interface ImplementationStep {
  step: number
  action: string
  detail: string
}

export interface Recommendation {
  priority: number
  signal: SignalKey
  artifactType: ArtifactType
  title: string
  description: string
  platform: PlatformKey | 'all'
  impact: 'high' | 'medium' | 'low'
  steps: ImplementationStep[]
  timeline: string
  successCriteria: string
}
