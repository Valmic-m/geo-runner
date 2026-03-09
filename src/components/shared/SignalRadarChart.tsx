import type { SignalScores, SignalKey } from '@/types/snapshot'
import { SIGNAL_DEFINITIONS } from '@/engine/constants/signal-definitions'

interface SignalRadarChartProps {
  signals: SignalScores
  previousSignals?: SignalScores
  size?: number
}

const SHORT_LABELS: Record<SignalKey, string> = {
  entityClarity: 'Entity',
  brandMentions: 'Mentions',
  comparisonPresence: 'Compare',
  faqCoverage: 'FAQ',
  structuredData: 'Schema',
  reviews: 'Reviews',
  authoritySignals: 'Authority',
  citations: 'Citations',
  gbpCompleteness: 'GBP',
  knowledgeGraphSignals: 'KG',
  messagingConsistency: 'Messaging',
  credibilitySignals: 'Credibility',
}

export function SignalRadarChart({ signals, previousSignals, size = 280 }: SignalRadarChartProps) {
  const cx = size / 2
  const cy = size / 2
  const maxRadius = size * 0.35
  const labelRadius = size * 0.46
  const signalKeys = SIGNAL_DEFINITIONS.map((d) => d.key)
  const count = signalKeys.length
  const angleStep = (2 * Math.PI) / count

  function getPoint(index: number, value: number): [number, number] {
    const angle = (index * angleStep) - Math.PI / 2
    const r = (value / 5) * maxRadius
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)]
  }

  function getPolygonPoints(scores: SignalScores): string {
    return signalKeys.map((key, i) => getPoint(i, scores[key]).join(',')).join(' ')
  }

  // Grid rings at 1, 2, 3, 4, 5
  const rings = [1, 2, 3, 4, 5]

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {/* Grid rings */}
      {rings.map((level) => (
        <polygon
          key={level}
          points={signalKeys.map((_, i) => getPoint(i, level).join(',')).join(' ')}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={level === 5 ? 1.5 : 0.5}
          opacity={0.6}
        />
      ))}

      {/* Axis lines */}
      {signalKeys.map((_, i) => {
        const [x, y] = getPoint(i, 5)
        return (
          <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--color-border)" strokeWidth={0.5} opacity={0.4} />
        )
      })}

      {/* Previous signals (if provided) */}
      {previousSignals && (
        <polygon
          points={getPolygonPoints(previousSignals)}
          fill="var(--color-warning)"
          fillOpacity={0.1}
          stroke="var(--color-warning)"
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />
      )}

      {/* Current signals */}
      <polygon
        points={getPolygonPoints(signals)}
        fill="var(--color-primary)"
        fillOpacity={0.15}
        stroke="var(--color-primary)"
        strokeWidth={2}
      />

      {/* Data points */}
      {signalKeys.map((key, i) => {
        const [x, y] = getPoint(i, signals[key])
        return (
          <circle key={key} cx={x} cy={y} r={3} fill="var(--color-primary)" />
        )
      })}

      {/* Labels */}
      {signalKeys.map((key, i) => {
        const angle = (i * angleStep) - Math.PI / 2
        const lx = cx + labelRadius * Math.cos(angle)
        const ly = cy + labelRadius * Math.sin(angle)
        const textAnchor = Math.abs(Math.cos(angle)) < 0.1 ? 'middle' : Math.cos(angle) > 0 ? 'start' : 'end'
        return (
          <text
            key={key}
            x={lx}
            y={ly}
            textAnchor={textAnchor}
            dominantBaseline="central"
            className="text-[9px] fill-text-muted"
          >
            {SHORT_LABELS[key]}
          </text>
        )
      })}
    </svg>
  )
}
