import type { CompletedWorkflow } from '@/context/SessionContext'

export interface JourneyStep {
  label: string
  route: string
  workflowKey?: CompletedWorkflow
}

export interface JourneyDefinition {
  id: string
  steps: JourneyStep[]
}

export const NEW_CLIENT_JOURNEY: JourneyDefinition = {
  id: 'new-client',
  steps: [
    { label: 'Website Scan', route: '/setup/extract', workflowKey: 'website-extract' },
    { label: 'Generate Tests', route: '/setup/tests', workflowKey: 'generate-tests' },
    { label: 'Monthly Cycle', route: '/workflows/monthly', workflowKey: 'monthly' },
  ],
}

export const RETURNING_CLIENT_JOURNEY: JourneyDefinition = {
  id: 'returning-client',
  steps: [
    { label: 'Monthly Cycle', route: '/workflows/monthly', workflowKey: 'monthly' },
  ],
}

export const QUARTERLY_JOURNEY: JourneyDefinition = {
  id: 'quarterly',
  steps: [
    { label: 'Quarterly Review', route: '/workflows/quarterly', workflowKey: 'quarterly' },
  ],
}

export const ANNUAL_JOURNEY: JourneyDefinition = {
  id: 'annual',
  steps: [
    { label: 'Annual Reset', route: '/workflows/annual', workflowKey: 'annual' },
  ],
}
