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
      <defs>
        <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <filter id="radarGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Grid rings */}
      {rings.map((level) => (
        <polygon
          key={level}
          points={signalKeys.map((_, i) => getPoint(i, level).join(',')).join(' ')}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={level === 5 ? 1.5 : 0.5}
          strokeDasharray={level < 5 ? '3 3' : 'none'}
          opacity={0.5}
        />
      ))}

      {/* Axis lines */}
      {signalKeys.map((_, i) => {
        const [x, y] = getPoint(i, 5)
        return (
          <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--color-border)" strokeWidth={0.5} opacity={0.3} />
        )
      })}

      {/* Previous signals (if provided) */}
      {previousSignals && (
        <polygon
          points={getPolygonPoints(previousSignals)}
          fill="var(--color-warning)"
          fillOpacity={0.08}
          stroke="var(--color-warning)"
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />
      )}

      {/* Current signals */}
      <polygon
        points={getPolygonPoints(signals)}
        fill="url(#radarFill)"
        stroke="url(#radarStroke)"
        strokeWidth={2}
        filter="url(#radarGlow)"
      />

      {/* Data points */}
      {signalKeys.map((key, i) => {
        const [x, y] = getPoint(i, signals[key])
        return (
          <circle
            key={key}
            cx={x} cy={y} r={4}
            fill="var(--color-primary)"
            stroke="white"
            strokeWidth={2}
          />
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
            className="text-[9px] fill-text-muted font-medium"
          >
            {SHORT_LABELS[key]}
          </text>
        )
      })}
    </svg>
  )
}
