import type { ClientGeoSnapshot } from '@/types/snapshot'
import type { TestPrompt } from '@/engine/generators/test-prompt-generator'
import { parseSnapshot } from '@/engine/parsers/snapshot-parser'
import { generateTestPrompts, generateInteractivePrompt } from '@/engine/generators/test-prompt-generator'

export interface GenerateTestsInput {
  snapshotText: string
}

export interface GenerateTestsOutput {
  snapshot: ClientGeoSnapshot
  testPrompts: TestPrompt[]
  interactivePrompt: string
}

export function runGenerateTestsWorkflow(input: GenerateTestsInput): GenerateTestsOutput {
  const snapshotResult = parseSnapshot(input.snapshotText)
  if (!snapshotResult.data) {
    throw new Error(`Failed to parse snapshot: ${snapshotResult.errors.join(', ')}`)
  }
  const snapshot = snapshotResult.data

  return {
    snapshot,
    testPrompts: generateTestPrompts(snapshot),
    interactivePrompt: generateInteractivePrompt(snapshot),
  }
}
