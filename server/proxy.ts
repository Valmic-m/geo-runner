import express from 'express'

const app = express()
const PORT = 3001

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

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`)
})
