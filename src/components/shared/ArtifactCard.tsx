import type { Artifact } from '@/types/artifacts'
import { CopyButton } from './CopyButton'
import { cn } from '@/lib/cn'

interface ArtifactCardProps {
  artifact: Artifact
}

export function ArtifactCard({ artifact }: ArtifactCardProps) {
  const priorityColors = {
    high: 'border-l-danger',
    medium: 'border-l-warning',
    low: 'border-l-success',
  }

  return (
    <div className={cn('border border-border rounded-lg bg-surface border-l-4 shadow-sm hover:shadow-md transition-all duration-200', priorityColors[artifact.deployment.priority])}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="font-medium text-sm">{artifact.title}</h4>
            <span className={cn(
              'text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ring-1 ring-inset',
              artifact.deployment.priority === 'high' ? 'bg-danger/10 text-danger ring-danger/20' :
              artifact.deployment.priority === 'medium' ? 'bg-warning/10 text-warning ring-warning/20' :
              'bg-success/10 text-success ring-success/20',
            )}>
              {artifact.deployment.priority} priority
            </span>
          </div>
          <CopyButton text={artifact.content} label="Copy Prompt" />
        </div>
        <pre className="text-xs text-gray-300 bg-gray-950 rounded-lg p-3 mt-3 whitespace-pre-wrap max-h-48 overflow-y-auto font-mono">
          {artifact.content}
        </pre>
        <div className="mt-3">
          <p className="text-xs font-medium text-text-muted mb-1">Deploy to:</p>
          <div className="flex flex-wrap gap-1">
            {artifact.deployment.targets.map((t) => (
              <span key={t} className="text-xs px-2 py-0.5 rounded bg-surface-alt text-text-muted shadow-sm">
                {t}
              </span>
            ))}
          </div>
        </div>
        {artifact.isExternalDistribution && (
          <p className="text-xs text-primary mt-2 font-medium">+ External distribution recommended</p>
        )}
      </div>
    </div>
  )
}
