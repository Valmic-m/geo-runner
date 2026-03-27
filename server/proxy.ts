import 'dotenv/config'
import express from 'express'
import { scrapeUrl } from './lib/jina'
import { extractBusinessInfo } from './lib/openai'
import { discoverCompetitors } from './lib/google-cse'

const app = express()
const PORT = 3001

app.use(express.json())

// ─── Existing: Raw HTML proxy (unchanged) ───────────────────────────
app.get('/api/fetch-url', async (req, res) => {
  const url = req.query.url as string

  if (!url) {
    res.status(400).json({ error: 'URL parameter is required' })
    return
  }

  try {
    new URL(url)
  } catch {
    res.status(400).json({ error: 'Invalid URL' })
    return
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    res.status(400).json({ error: 'URL must use http or https protocol' })
    return
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GEORunner/1.0)',
      },
    })

    if (!response.ok) {
      res.status(502).json({ error: `Failed to fetch URL: ${response.status} ${response.statusText}` })
      return
    }

    const html = await response.text()
    res.type('text/html').send(html)
  } catch (err) {
    res.status(502).json({ error: `Failed to fetch URL: ${err instanceof Error ? err.message : 'Unknown error'}` })
  }
})

// ─── NEW: Enhanced scraping via Jina Reader ─────────────────────────
app.post('/api/scrape', async (req, res) => {
  const { url } = req.body as { url?: string }

  if (!url) {
    res.status(400).json({ error: 'url is required' })
    return
  }

  try {
    const result = await scrapeUrl(url)
    res.json(result)
  } catch (err) {
    res.status(502).json({ error: `Scrape failed: ${err instanceof Error ? err.message : 'Unknown error'}` })
  }
})

// ─── NEW: LLM-powered business info extraction ─────────────────────
app.post('/api/analyze', async (req, res) => {
  const { markdown, url } = req.body as { markdown?: string; url?: string }

  if (!markdown) {
    res.status(400).json({ error: 'markdown content is required' })
    return
  }

  try {
    const analysis = await extractBusinessInfo(markdown, url || '')
    res.json(analysis)
  } catch (err) {
    res.status(502).json({ error: `Analysis failed: ${err instanceof Error ? err.message : 'Unknown error'}` })
  }
})

// ─── NEW: Competitor discovery via Google Custom Search ──────────────
app.post('/api/competitors', async (req, res) => {
  const { businessName, category, location, businessUrl } = req.body as {
    businessName?: string
    category?: string
    location?: string
    businessUrl?: string
  }

  if (!businessName || !category) {
    res.status(400).json({ error: 'businessName and category are required' })
    return
  }

  try {
    const competitors = await discoverCompetitors(businessName, category, location, businessUrl)
    res.json({ competitors })
  } catch (err) {
    res.status(502).json({ error: `Competitor discovery failed: ${err instanceof Error ? err.message : 'Unknown error'}` })
  }
})

// ─── NEW: Orchestrator — scrape + analyze + discover in one call ────
app.post('/api/extract-enhanced', async (req, res) => {
  const { url } = req.body as { url?: string }

  if (!url) {
    res.status(400).json({ error: 'url is required' })
    return
  }

  try {
    // Step 1: Scrape the website
    const scraped = await scrapeUrl(url)

    // Step 2: Also fetch raw HTML for the existing regex parser
    let rawHtml = ''
    try {
      const htmlResponse = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GEORunner/1.0)' },
      })
      if (htmlResponse.ok) {
        rawHtml = await htmlResponse.text()
      }
    } catch {
      // Raw HTML is optional — regex parser will just have less data
    }

    // Step 3: LLM analysis (if OpenAI is configured)
    let llmAnalysis = null
    try {
      llmAnalysis = await extractBusinessInfo(scraped.markdown, url)
    } catch (err) {
      console.warn('LLM analysis unavailable:', err instanceof Error ? err.message : err)
    }

    // Step 4: Competitor discovery (if Google CSE is configured and we have business info)
    let discoveredCompetitors: Awaited<ReturnType<typeof discoverCompetitors>> = []
    if (llmAnalysis?.businessName && llmAnalysis?.primaryCategory) {
      try {
        discoveredCompetitors = await discoverCompetitors(
          llmAnalysis.businessName,
          llmAnalysis.primaryCategory,
          llmAnalysis.location || undefined,
          url,
        )
      } catch (err) {
        console.warn('Competitor discovery unavailable:', err instanceof Error ? err.message : err)
      }
    }

    res.json({
      markdown: scraped.markdown,
      rawHtml,
      llmAnalysis,
      discoveredCompetitors,
      source: scraped.source,
    })
  } catch (err) {
    res.status(502).json({
      error: `Enhanced extraction failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
    })
  }
})

app.listen(PORT, () => {
  const hasOpenAI = !!process.env.OPENAI_API_KEY
  const hasGoogleCSE = !!process.env.GOOGLE_CSE_API_KEY && !!process.env.GOOGLE_CSE_ID
  console.log(`Proxy server running on http://localhost:${PORT}`)
  console.log(`  OpenAI:     ${hasOpenAI ? 'configured' : 'not configured (LLM analysis disabled)'}`)
  console.log(`  Google CSE: ${hasGoogleCSE ? 'configured' : 'not configured (competitor discovery disabled)'}`)
})
