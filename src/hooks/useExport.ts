import { useCallback } from 'react'

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function useExport() {
  const exportAsMarkdown = useCallback((content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown' })
    downloadBlob(blob, filename.endsWith('.md') ? filename : `${filename}.md`)
  }, [])

  const exportAsJson = useCallback((data: unknown, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    downloadBlob(blob, filename.endsWith('.json') ? filename : `${filename}.json`)
  }, [])

  const exportAsHtml = useCallback((content: string, title: string, filename: string) => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; color: #1a1a1a; line-height: 1.6; }
  h1, h2, h3 { color: #0f172a; }
  h1 { border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; }
  h2 { margin-top: 2rem; color: #334155; }
  pre { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; overflow-x: auto; font-size: 0.875rem; }
  ul { padding-left: 1.5rem; }
  li { margin: 0.25rem 0; }
  strong { color: #0f172a; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; }
  .critical { background: #fef2f2; color: #dc2626; }
  .weak { background: #fffbeb; color: #d97706; }
  .moderate { background: #f0fdf4; color: #16a34a; }
  .strong { background: #eff6ff; color: #2563eb; }
</style>
</head>
<body>
${markdownToHtml(content)}
</body>
</html>`
    const blob = new Blob([html], { type: 'text/html' })
    downloadBlob(blob, filename.endsWith('.html') ? filename : `${filename}.html`)
  }, [])

  return { exportAsMarkdown, exportAsJson, exportAsHtml }
}

function markdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/```[\s\S]*?```/g, (match) => {
      const code = match.replace(/```\w*\n?/, '').replace(/\n?```$/, '')
      return `<pre>${code}</pre>`
    })
    .replace(/\n\n/g, '\n<br>\n')
}
