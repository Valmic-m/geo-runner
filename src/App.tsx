import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { SessionProvider } from '@/context/SessionContext'
import { HomePage } from '@/pages/HomePage'
import { MonthlyPage } from '@/pages/MonthlyPage'
import { QuarterlyPage } from '@/pages/QuarterlyPage'
import { AnnualPage } from '@/pages/AnnualPage'
import { GenerateTestsPage } from '@/pages/GenerateTestsPage'
import { WebsiteExtractPage } from '@/pages/WebsiteExtractPage'

function App() {
  return (
    <HashRouter>
      <SessionProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Setup routes */}
          <Route path="/setup/extract" element={<WebsiteExtractPage />} />
          <Route path="/setup/tests" element={<GenerateTestsPage />} />

          {/* Workflow routes */}
          <Route path="/workflows/monthly" element={<MonthlyPage />} />
          <Route path="/workflows/quarterly" element={<QuarterlyPage />} />
          <Route path="/workflows/annual" element={<AnnualPage />} />

          {/* Redirects from old paths */}
          <Route path="/website-extract" element={<Navigate to="/setup/extract" replace />} />
          <Route path="/generate-tests" element={<Navigate to="/setup/tests" replace />} />
          <Route path="/monthly" element={<Navigate to="/workflows/monthly" replace />} />
          <Route path="/quarterly" element={<Navigate to="/workflows/quarterly" replace />} />
          <Route path="/annual" element={<Navigate to="/workflows/annual" replace />} />
        </Routes>
      </AppShell>
      </SessionProvider>
    </HashRouter>
  )
}

export default App
