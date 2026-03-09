import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { EstimatedSignals } from '@/engine/analyzers/signal-estimator'
import type { ClientGeoSnapshot } from '@/types/snapshot'

export interface ExtractedData {
  primaryCategory: string
  secondaryCategory: string
  audience: string
  recommendations: string[]
  missingTrustSignals: string[]
  geoScope: string
  revenueModel: string
  regulated: string
  competitors: string[]
  businessNameCandidates: string[]
  estimatedSignals: EstimatedSignals
  estimatedFocusTier: string
  estimatedBottleneck: string
}

export type CompletedWorkflow = 'website-extract' | 'monthly' | 'quarterly' | 'annual' | 'generate-tests'

interface SessionState {
  extractedData: ExtractedData | null
  lastSnapshot: ClientGeoSnapshot | null
  completedWorkflows: CompletedWorkflow[]
}

const STORAGE_KEY = 'geo-runner-session'

function loadSession(): SessionState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore corrupt data */ }
  return { extractedData: null, lastSnapshot: null, completedWorkflows: [] }
}

function saveSession(state: SessionState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch { /* storage full or unavailable */ }
}

interface ExtractedDataContextValue {
  extractedData: ExtractedData | null
  setExtractedData: (data: ExtractedData) => void
  clearExtractedData: () => void
  lastSnapshot: ClientGeoSnapshot | null
  setLastSnapshot: (snapshot: ClientGeoSnapshot) => void
  completedWorkflows: CompletedWorkflow[]
  markWorkflowCompleted: (workflow: CompletedWorkflow) => void
  clearSession: () => void
}

const ExtractedDataContext = createContext<ExtractedDataContextValue | null>(null)

export function ExtractedDataProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionState>(loadSession)

  useEffect(() => {
    saveSession(session)
  }, [session])

  const setExtractedData = useCallback((data: ExtractedData) => {
    setSession((prev) => ({ ...prev, extractedData: data }))
  }, [])

  const clearExtractedData = useCallback(() => {
    setSession((prev) => ({ ...prev, extractedData: null }))
  }, [])

  const setLastSnapshot = useCallback((snapshot: ClientGeoSnapshot) => {
    setSession((prev) => ({ ...prev, lastSnapshot: snapshot }))
  }, [])

  const markWorkflowCompleted = useCallback((workflow: CompletedWorkflow) => {
    setSession((prev) => ({
      ...prev,
      completedWorkflows: prev.completedWorkflows.includes(workflow)
        ? prev.completedWorkflows
        : [...prev.completedWorkflows, workflow],
    }))
  }, [])

  const clearSession = useCallback(() => {
    const empty: SessionState = { extractedData: null, lastSnapshot: null, completedWorkflows: [] }
    setSession(empty)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return (
    <ExtractedDataContext.Provider value={{
      extractedData: session.extractedData,
      setExtractedData,
      clearExtractedData,
      lastSnapshot: session.lastSnapshot,
      setLastSnapshot,
      completedWorkflows: session.completedWorkflows,
      markWorkflowCompleted,
      clearSession,
    }}>
      {children}
    </ExtractedDataContext.Provider>
  )
}

export function useExtractedData() {
  const context = useContext(ExtractedDataContext)
  if (!context) {
    throw new Error('useExtractedData must be used within ExtractedDataProvider')
  }
  return context
}
