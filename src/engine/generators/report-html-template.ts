import type { ReportData } from './report-builder'

function statusColor(status: string): string {
  switch (status) {
    case 'critical': return '#dc2626'
    case 'weak': return '#d97706'
    case 'moderate': return '#16a34a'
    case 'strong': return '#2563eb'
    default: return '#6b7280'
  }
}

function statusBg(status: string): string {
  switch (status) {
    case 'critical': return '#fef2f2'
    case 'weak': return '#fffbeb'
    case 'moderate': return '#f0fdf4'
    case 'strong': return '#eff6ff'
    default: return '#f9fafb'
  }
}

function impactBadge(impact: string): string {
  const colors: Record<string, { bg: string; text: string }> = {
    high: { bg: '#fef2f2', text: '#dc2626' },
    medium: { bg: '#fffbeb', text: '#d97706' },
    low: { bg: '#f0fdf4', text: '#16a34a' },
  }
  const c = colors[impact] || colors.low
  return `<span style="display:inline-block;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:600;background:${c.bg};color:${c.text};text-transform:uppercase;">${impact}</span>`
}

function scoreBar(score: number, max: number, status: string): string {
  const pct = (score / max) * 100
  return `
    <div style="display:flex;align-items:center;gap:8px;">
      <div style="flex:1;height:8px;background:#e5e7eb;border-radius:4px;overflow:hidden;">
        <div style="width:${pct}%;height:100%;background:${statusColor(status)};border-radius:4px;"></div>
      </div>
      <span style="font-size:13px;font-weight:600;color:${statusColor(status)};min-width:28px;">${score}/${max}</span>
    </div>`
}

function visibilityBar(score: number): string {
  const color = score >= 60 ? '#16a34a' : score >= 30 ? '#d97706' : '#dc2626'
  return `
    <div style="display:flex;align-items:center;gap:8px;">
      <div style="flex:1;height:8px;background:#e5e7eb;border-radius:4px;overflow:hidden;">
        <div style="width:${score}%;height:100%;background:${color};border-radius:4px;"></div>
      </div>
      <span style="font-size:13px;font-weight:600;color:${color};min-width:32px;">${score}%</span>
    </div>`
}

export function renderReportHtml(data: ReportData): string {
  const readinessColor = data.readinessScore >= 60 ? '#16a34a' : data.readinessScore >= 40 ? '#d97706' : '#dc2626'

  const signalRows = data.signalScores.map(s => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">
        <span style="font-weight:500;">${s.label}</span>
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;width:200px;">
        ${scoreBar(s.score, s.max, s.status)}
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">
        <span style="display:inline-block;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:600;background:${statusBg(s.status)};color:${statusColor(s.status)};text-transform:uppercase;">${s.status}</span>
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;color:#6b7280;">${s.recommendation}</td>
    </tr>`).join('')

  const platformRows = data.platformVisibility.map(p => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-weight:500;">${p.platform}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;width:250px;">
        ${visibilityBar(p.score)}
      </td>
    </tr>`).join('')

  const actionRows = data.priorityActions.map(a => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">
        <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:#3b82f6;color:white;font-size:12px;font-weight:700;">${a.rank}</span>
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">
        <strong>${a.title}</strong><br>
        <span style="font-size:13px;color:#6b7280;">${a.description}</span>
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">${a.timeline}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">${impactBadge(a.impact)}</td>
    </tr>`).join('')

  const artifactBlocks = data.artifacts.map(a => `
    <div style="margin-bottom:16px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      <div style="padding:10px 16px;background:#f8fafc;border-bottom:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center;">
        <strong>${a.title}</strong>
        <span style="font-size:12px;color:#6b7280;">Deploy to: ${a.deployTo.join(', ')}</span>
      </div>
      <pre style="padding:16px;margin:0;font-size:13px;line-height:1.6;white-space:pre-wrap;word-wrap:break-word;background:white;">${escapeHtml(a.content)}</pre>
    </div>`).join('')

  const deploymentRows = data.deploymentSteps.map(d => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${d.order}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${d.artifact}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${d.target}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${impactBadge(d.priority)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">
        <span style="display:inline-block;width:16px;height:16px;border:2px solid #d1d5db;border-radius:3px;"></span>
      </td>
    </tr>`).join('')

  const distributionRows = data.distributionPlan.map(d => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${d.action}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${d.target}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">
        <span style="display:inline-block;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:600;background:${d.type === 'external' ? '#eff6ff' : '#f9fafb'};color:${d.type === 'external' ? '#2563eb' : '#6b7280'};">${d.type}</span>
      </td>
    </tr>`).join('')

  const sprintList = data.sprintActions.map(s => `<li style="padding:4px 0;">${s}</li>`).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${data.title} - ${data.businessName}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    color: #1a1a2e;
    line-height: 1.6;
    background: #f8fafc;
  }
  .page {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 24px;
    background: white;
    min-height: 100vh;
  }
  .header {
    padding: 40px 0 24px;
    border-bottom: 3px solid #3b82f6;
    margin-bottom: 32px;
  }
  .header h1 { font-size: 28px; font-weight: 700; color: #0f172a; }
  .header-meta { display: flex; gap: 24px; margin-top: 8px; font-size: 14px; color: #64748b; }
  .section { margin-bottom: 36px; }
  .section-title {
    font-size: 18px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 2px solid #e5e7eb;
  }
  .summary-box {
    background: #f0f9ff;
    border: 1px solid #bae6fd;
    border-radius: 8px;
    padding: 20px;
    font-size: 15px;
    line-height: 1.7;
    color: #0c4a6e;
  }
  .readiness-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 20px;
    border-radius: 9999px;
    font-size: 20px;
    font-weight: 700;
  }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th {
    text-align: left;
    padding: 10px 12px;
    background: #f8fafc;
    border-bottom: 2px solid #e5e7eb;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #64748b;
    font-weight: 600;
  }
  .sprint-list { list-style: none; padding: 0; }
  .sprint-list li { padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
  .footer {
    padding: 24px 0;
    border-top: 1px solid #e5e7eb;
    margin-top: 48px;
    font-size: 12px;
    color: #94a3b8;
    text-align: center;
  }
  .print-btn {
    position: fixed;
    top: 16px;
    right: 16px;
    padding: 10px 20px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(59,130,246,0.3);
    z-index: 100;
  }
  .print-btn:hover { background: #2563eb; }
  @media print {
    .print-btn { display: none; }
    body { background: white; }
    .page { padding: 0; }
    .header { padding-top: 0; }
    .section { page-break-inside: avoid; }
    table { page-break-inside: auto; }
    tr { page-break-inside: avoid; }
  }
</style>
</head>
<body>
<button class="print-btn" onclick="window.print()">Save as PDF</button>
<div class="page">
  <div class="header">
    <h1>${data.title}</h1>
    <div class="header-meta">
      <span><strong>${data.businessName}</strong></span>
      <span>${data.category}${data.geoScope ? ` &middot; ${data.geoScope}` : ''}</span>
      <span>${data.date}</span>
    </div>
  </div>

  <!-- Readiness Score -->
  <div class="section" style="text-align:center;padding:16px 0;">
    <p style="font-size:13px;text-transform:uppercase;letter-spacing:0.05em;color:#64748b;margin-bottom:8px;">AI Recommendation Readiness</p>
    <span class="readiness-badge" style="background:${data.readinessScore >= 60 ? '#f0fdf4' : data.readinessScore >= 40 ? '#fffbeb' : '#fef2f2'};color:${readinessColor};">
      ${data.readinessScore}% &mdash; ${data.readinessLabel}
    </span>
  </div>

  <!-- Executive Summary -->
  <div class="section">
    <h2 class="section-title">Executive Summary</h2>
    <div class="summary-box">${data.executiveSummary}</div>
  </div>

  <!-- Signal Scorecard -->
  <div class="section">
    <h2 class="section-title">Signal Scorecard</h2>
    <table>
      <thead>
        <tr>
          <th>Signal</th>
          <th>Score</th>
          <th>Status</th>
          <th>Recommendation</th>
        </tr>
      </thead>
      <tbody>${signalRows}</tbody>
    </table>
  </div>

  <!-- Platform Visibility -->
  ${data.platformVisibility.some(p => p.score > 0) ? `
  <div class="section">
    <h2 class="section-title">Platform Visibility</h2>
    <table>
      <thead>
        <tr>
          <th>Platform</th>
          <th>Visibility Score</th>
        </tr>
      </thead>
      <tbody>${platformRows}</tbody>
    </table>
  </div>` : ''}

  <!-- Priority Action Plan -->
  ${data.priorityActions.length > 0 ? `
  <div class="section">
    <h2 class="section-title">Priority Action Plan</h2>
    <table>
      <thead>
        <tr>
          <th style="text-align:center;width:48px;">#</th>
          <th>Action</th>
          <th>Timeline</th>
          <th>Impact</th>
        </tr>
      </thead>
      <tbody>${actionRows}</tbody>
    </table>
  </div>` : ''}

  <!-- Sprint Actions -->
  ${data.sprintActions.length > 0 ? `
  <div class="section">
    <h2 class="section-title">This Month's Sprint</h2>
    <ul class="sprint-list">${sprintList}</ul>
  </div>` : ''}

  <!-- Artifacts -->
  ${data.artifacts.length > 0 ? `
  <div class="section">
    <h2 class="section-title">Ready-to-Deploy Artifacts</h2>
    ${artifactBlocks}
  </div>` : ''}

  <!-- Distribution Plan -->
  ${data.distributionPlan.length > 0 ? `
  <div class="section">
    <h2 class="section-title">Distribution Plan</h2>
    <table>
      <thead>
        <tr>
          <th>Action</th>
          <th>Target</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>${distributionRows}</tbody>
    </table>
  </div>` : ''}

  <!-- Deployment Checklist -->
  ${data.deploymentSteps.length > 0 ? `
  <div class="section">
    <h2 class="section-title">Deployment Checklist</h2>
    <table>
      <thead>
        <tr>
          <th style="text-align:center;width:48px;">Order</th>
          <th>Artifact</th>
          <th>Target</th>
          <th>Priority</th>
          <th style="text-align:center;width:48px;">Done</th>
        </tr>
      </thead>
      <tbody>${deploymentRows}</tbody>
    </table>
  </div>` : ''}

  <div class="footer">
    Generated by GEO Runner &middot; ${data.date}
  </div>
</div>
</body>
</html>`
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
