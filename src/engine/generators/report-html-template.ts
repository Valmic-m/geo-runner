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

function timelineBadge(timeline: string): string {
  const colors: Record<string, { bg: string; text: string }> = {
    'This week': { bg: '#fef2f2', text: '#dc2626' },
    'Within 2 weeks': { bg: '#fffbeb', text: '#d97706' },
    'Within 30 days': { bg: '#f0fdf4', text: '#16a34a' },
  }
  const c = colors[timeline] || { bg: '#f9fafb', text: '#6b7280' }
  return `<span style="display:inline-block;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:600;background:${c.bg};color:${c.text};">${timeline}</span>`
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

  // Priority actions with implementation steps and success criteria
  const actionBlocks = data.priorityActions.map(a => {
    const stepsHtml = a.steps.length > 0
      ? `<div style="margin-top:8px;padding:12px;background:#f8fafc;border-radius:6px;border:1px solid #e5e7eb;">
          <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#64748b;font-weight:600;margin-bottom:6px;">Implementation Steps</p>
          <ol style="margin:0;padding-left:20px;font-size:13px;color:#374151;">
            ${a.steps.map(s => `<li style="padding:3px 0;"><strong>${escapeHtml(s.action)}</strong><br><span style="color:#6b7280;">${escapeHtml(s.detail)}</span></li>`).join('')}
          </ol>
        </div>`
      : ''
    const criteriaHtml = a.successCriteria
      ? `<div style="margin-top:6px;padding:8px 12px;background:#f0fdf4;border-radius:6px;border:1px solid #bbf7d0;font-size:12px;">
          <strong style="color:#16a34a;">Success Criteria:</strong> <span style="color:#15803d;">${escapeHtml(a.successCriteria)}</span>
        </div>`
      : ''
    return `
    <div style="margin-bottom:16px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      <div style="padding:12px 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid #e5e7eb;background:white;">
        <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:#3b82f6;color:white;font-size:13px;font-weight:700;flex-shrink:0;">${a.rank}</span>
        <div style="flex:1;">
          <strong style="font-size:14px;">${escapeHtml(a.title)}</strong><br>
          <span style="font-size:13px;color:#6b7280;">${escapeHtml(a.description)}</span>
        </div>
        <div style="display:flex;gap:8px;align-items:center;flex-shrink:0;">
          ${timelineBadge(a.timeline)}
          ${impactBadge(a.impact)}
        </div>
      </div>
      <div style="padding:12px 16px;">
        ${stepsHtml}
        ${criteriaHtml}
      </div>
    </div>`
  }).join('')

  // Artifacts with usage instructions
  const artifactBlocks = data.artifacts.map(a => `
    <div style="margin-bottom:16px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      <div style="padding:10px 16px;background:#f8fafc;border-bottom:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center;">
        <strong>${escapeHtml(a.title)}</strong>
        <span style="font-size:12px;color:#6b7280;">Deploy to: ${a.deployTo.join(', ')}</span>
      </div>
      ${a.usageInstructions ? `<div style="padding:12px 16px;background:#eff6ff;border-bottom:1px solid #bae6fd;font-size:13px;color:#1e40af;line-height:1.6;">${escapeHtml(a.usageInstructions)}</div>` : ''}
      <pre style="padding:16px;margin:0;font-size:13px;line-height:1.6;white-space:pre-wrap;word-wrap:break-word;background:white;">${escapeHtml(a.content)}</pre>
    </div>`).join('')

  const deploymentRows = data.deploymentSteps.map(d => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${d.order}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${escapeHtml(d.artifact)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${escapeHtml(d.target)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${impactBadge(d.priority)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">
        <span style="display:inline-block;width:16px;height:16px;border:2px solid #d1d5db;border-radius:3px;"></span>
      </td>
    </tr>`).join('')

  const distributionRows = data.distributionPlan.map(d => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${escapeHtml(d.action)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${escapeHtml(d.target)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">
        <span style="display:inline-block;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:600;background:${d.type === 'external' ? '#eff6ff' : '#f9fafb'};color:${d.type === 'external' ? '#2563eb' : '#6b7280'};">${d.type}</span>
      </td>
    </tr>`).join('')

  // Sprint actions grouped by timeline
  const timelineGroups = new Map<string, typeof data.sprintActions>()
  for (const s of data.sprintActions) {
    const group = timelineGroups.get(s.timeline) ?? []
    group.push(s)
    timelineGroups.set(s.timeline, group)
  }
  const timelineOrder = ['This week', 'Within 2 weeks', 'Within 30 days']
  const sprintSections = timelineOrder
    .filter(t => timelineGroups.has(t))
    .map(timeline => {
      const actions = timelineGroups.get(timeline)!
      const actionItems = actions.map(a => `
        <div style="margin-bottom:12px;padding:12px;background:#f8fafc;border-radius:6px;border:1px solid #e5e7eb;">
          <strong style="font-size:14px;">${escapeHtml(a.title)}</strong>
          <ol style="margin:6px 0 0;padding-left:20px;font-size:13px;color:#374151;">
            ${a.steps.map(step => `<li style="padding:2px 0;">${escapeHtml(step)}</li>`).join('')}
          </ol>
          <div style="margin-top:6px;font-size:12px;color:#16a34a;"><strong>Done when:</strong> ${escapeHtml(a.successCriteria)}</div>
        </div>
      `).join('')
      return `
        <div style="margin-bottom:20px;">
          <h3 style="font-size:15px;font-weight:600;color:#0f172a;margin-bottom:10px;">${timelineBadge(timeline)} ${timeline}</h3>
          ${actionItems}
        </div>`
    }).join('')

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

  <!-- Priority Action Plan with Implementation Steps -->
  ${data.priorityActions.length > 0 ? `
  <div class="section">
    <h2 class="section-title">Priority Action Plan</h2>
    ${actionBlocks}
  </div>` : ''}

  <!-- Sprint Actions by Timeline -->
  ${data.sprintActions.length > 0 ? `
  <div class="section">
    <h2 class="section-title">Implementation Sprint</h2>
    ${sprintSections}
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
