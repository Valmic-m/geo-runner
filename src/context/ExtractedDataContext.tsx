// Re-export everything from SessionContext for backwards compatibility
export {
  useExtractedData,
  useSession,
  ExtractedDataProvider,
  SessionProvider,
} from './SessionContext'

export type {
  ExtractedData,
  CompletedWorkflow,
} from './SessionContext'
