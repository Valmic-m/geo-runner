import { HashRouter, Routes, Route } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ExtractedDataProvider } from '@/context/ExtractedDataContext'
import { HomePage } from '@/pages/HomePage'
import { MonthlyPage } from '@/pages/MonthlyPage'
import { QuarterlyPage } from '@/pages/QuarterlyPage'
import { AnnualPage } from '@/pages/AnnualPage'
import { GenerateTestsPage } from '@/pages/GenerateTestsPage'
import { WebsiteExtractPage } from '@/pages/WebsiteExtractPage'

function App() {
  return (
    <HashRouter>
      <ExtractedDataProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/monthly" element={<MonthlyPage />} />
          <Route path="/quarterly" element={<QuarterlyPage />} />
          <Route path="/annual" element={<AnnualPage />} />
          <Route path="/generate-tests" element={<GenerateTestsPage />} />
          <Route path="/website-extract" element={<WebsiteExtractPage />} />
        </Routes>
      </AppShell>
      </ExtractedDataProvider>
    </HashRouter>
  )
}

export default App
