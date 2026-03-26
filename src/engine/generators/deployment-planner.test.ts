import { describe, it, expect } from 'vitest'
import { createDeploymentPlan } from './deployment-planner'
import type { Artifact } from '@/types/artifacts'

function makeArtifact(overrides: Partial<Artifact> = {}): Artifact {
  return {
    type: 'entity-definition-block',
    title: 'Entity Definition',
    content: 'Acme is a plumbing company...',
    targetSignals: ['entityClarity'],
    deployment: {
      targets: ['homepage', 'about page'],
      priority: 'high',
      notes: '',
    },
    isExternalDistribution: false,
    ...overrides,
  }
}

describe('createDeploymentPlan', () => {
  it('returns empty array for no artifacts', () => {
    expect(createDeploymentPlan([])).toEqual([])
  })

  it('creates a step for each deployment target', () => {
    const artifacts = [makeArtifact({
      deployment: { targets: ['homepage', 'about page', 'blog'], priority: 'high', notes: '' },
    })]

    const steps = createDeploymentPlan(artifacts)
    expect(steps).toHaveLength(3)
  })

  it('assigns sequential order numbers', () => {
    const artifacts = [
      makeArtifact({ title: 'A', deployment: { targets: ['homepage'], priority: 'high', notes: '' } }),
      makeArtifact({ title: 'B', deployment: { targets: ['blog'], priority: 'medium', notes: '' } }),
    ]

    const steps = createDeploymentPlan(artifacts)
    expect(steps[0].order).toBe(1)
    expect(steps[1].order).toBe(2)
  })

  it('sorts high-priority artifacts first', () => {
    const artifacts = [
      makeArtifact({ title: 'Low', deployment: { targets: ['blog'], priority: 'low', notes: '' } }),
      makeArtifact({ title: 'High', deployment: { targets: ['homepage'], priority: 'high', notes: '' } }),
      makeArtifact({ title: 'Medium', deployment: { targets: ['about page'], priority: 'medium', notes: '' } }),
    ]

    const steps = createDeploymentPlan(artifacts)
    expect(steps[0].artifact).toBe('High')
    expect(steps[1].artifact).toBe('Medium')
    expect(steps[2].artifact).toBe('Low')
  })

  it('includes action with deployment instructions for known targets', () => {
    const artifacts = [makeArtifact({
      deployment: { targets: ['homepage'], priority: 'high', notes: '' },
    })]

    const steps = createDeploymentPlan(artifacts)
    expect(steps[0].action).toContain('homepage')
    expect(steps[0].action.length).toBeGreaterThan(20) // Should have how-to detail
  })

  it('preserves priority from artifact', () => {
    const artifacts = [makeArtifact({
      deployment: { targets: ['homepage'], priority: 'medium', notes: '' },
    })]

    const steps = createDeploymentPlan(artifacts)
    expect(steps[0].priority).toBe('medium')
  })
})
