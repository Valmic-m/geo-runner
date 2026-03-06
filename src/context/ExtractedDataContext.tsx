import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'

export interface ExtractedData {
  primaryCategory: string
  secondaryCategory: string
  audience: string
  recommendations: string[]
  missingTrustSignals: string[]
}

interface ExtractedDataContextValue {
  extractedData: ExtractedData | null
  setExtractedData: (data: ExtractedData) => void
  clearExtractedData: () => void
}

const ExtractedDataContext = createContext<ExtractedDataContextValue | null>(null)

export function ExtractedDataProvider({ children }: { children: ReactNode }) {
  const [extractedData, setData] = useState<ExtractedData | null>(null)

  const setExtractedData = useCallback((data: ExtractedData) => {
    setData(data)
  }, [])

  const clearExtractedData = useCallback(() => {
    setData(null)
  }, [])

  return (
    <ExtractedDataContext.Provider value={{ extractedData, setExtractedData, clearExtractedData }}>
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
