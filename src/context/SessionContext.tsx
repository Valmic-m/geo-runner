/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { EstimatedSignals } from '@/engine/analyzers/signal-estimator'
import type { ClientGeoSnapshot, Competitor } from '@/types/snapshot'
import { migrateCompetitors } from '@/lib/competitor-utils'

export interface ExtractedData {
  primaryCategory: string
  secondaryCategory: string
  audience: string
  recommendations: string[]
  missingTrustSignals: string[]
  geoScope: string
  revenueModel: string
  regulated: string
  competitors: Competitor[]
  businessNameCandidates: string[]
  estimatedSignals: EstimatedSignals
  estimatedFocusTier: string
  estimatedBottleneck: string
  // Enhanced extraction fields (optional)
  discoveredCompetitors?: Competitor[]
  llmConfidence?: Record<string, string>
  extractionSource?: 'enhanced' | 'basic'
  location?: string
}

export type CompletedWorkflow = 'website-extract' | 'monthly' | 'quarterly' | 'annual' | 'generate-tests'

interface SessionState {
  extractedData: ExtractedData | null
  lastSnapshot: ClientGeoSnapshot | null
  currentSnapshot: ClientGeoSnapshot | null
  completedWorkflows: CompletedWorkflow[]
}

const STORAGE_KEY = 'geo-runner-session'

function migrateSnapshot(snapshot: ClientGeoSnapshot | null): ClientGeoSnapshot | null {
  if (!snapshot) return null
  if (Array.isArray(snapshot.competitors) && snapshot.competitors.length > 0 && typeof snapshot.competitors[0] === 'string') {
    return { ...snapshot, competitors: migrateCompetitors(snapshot.competitors) }
  }
  return snapshot
}

function migrateExtractedData(data: ExtractedData | null): ExtractedData | null {
  if (!data) return null
  if (Array.isArray(data.competitors) && data.competitors.length > 0 && typeof data.competitors[0] === 'string') {
    return { ...data, competitors: migrateCompetitors(data.competitors) }
  }
  return data
}

function loadSession(): SessionState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        extractedData: migrateExtractedData(parsed.extractedData ?? null),
        lastSnapshot: migrateSnapshot(parsed.lastSnapshot ?? null),
        currentSnapshot: migrateSnapshot(parsed.currentSnapshot ?? null),
        completedWorkflows: parsed.completedWorkflows ?? [],
      }
    }
  } catch { /* ignore corrupt data */ }
  return { extractedData: null, lastSnapshot: null, currentSnapshot: null, completedWorkflows: [] }
}

function saveSession(state: SessionState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch { /* storage full or unavailable */ }
}

interface SessionContextValue {
  extractedData: ExtractedData | null
  setExtractedData: (data: ExtractedData) => void
  clearExtractedData: () => void
  lastSnapshot: ClientGeoSnapshot | null
  setLastSnapshot: (snapshot: ClientGeoSnapshot) => void
  currentSnapshot: ClientGeoSnapshot | null
  setCurrentSnapshot: (snapshot: ClientGeoSnapshot) => void
  completedWorkflows: CompletedWorkflow[]
  markWorkflowCompleted: (workflow: CompletedWorkflow) => void
  clearSession: () => void
}

const SessionCtx = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
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

  const setCurrentSnapshot = useCallback((snapshot: ClientGeoSnapshot) => {
    setSession((prev) => ({ ...prev, currentSnapshot: snapshot, lastSnapshot: snapshot }))
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
    const empty: SessionState = { extractedData: null, lastSnapshot: null, currentSnapshot: null, completedWorkflows: [] }
    setSession(empty)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return (
    <SessionCtx.Provider value={{
      extractedData: session.extractedData,
      setExtractedData,
      clearExtractedData,
      lastSnapshot: session.lastSnapshot,
      setLastSnapshot,
      currentSnapshot: session.currentSnapshot,
      setCurrentSnapshot,
      completedWorkflows: session.completedWorkflows,
      markWorkflowCompleted,
      clearSession,
    }}>
      {children}
    </SessionCtx.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionCtx)
  if (!context) {
    throw new Error('useSession must be used within SessionProvider')
  }
  return context
}

// Backwards-compatible alias
export const useExtractedData = useSession
export const ExtractedDataProvider = SessionProvider
