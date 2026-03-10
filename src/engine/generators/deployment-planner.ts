import type { Artifact } from '@/types/artifacts'

export interface DeploymentStep {
  order: number
  artifact: string
  target: string
  priority: 'high' | 'medium' | 'low'
  action: string
}

const TARGET_HOWTO: Record<string, string> = {
  'homepage': 'Add to the main content area or About section of your homepage. If using a CMS, update the relevant content block.',
  'about page': 'Replace or update the primary description paragraph on your About page with the generated content.',
  'service pages': 'Add relevant sections to each service/product page. Match the entity definition and FAQs to each page\'s topic.',
  'FAQ page': 'Create or update your FAQ page with the generated Q&As. Add FAQPage schema markup in JSON-LD format.',
  'blog': 'Publish as a new blog post with proper author markup, categories, and internal links to related service pages.',
  'resources section': 'Add to your resources or guides section. Link from relevant service pages and navigation.',
  'comparison landing page': 'Create a new page under /compare/ or /vs/ URL path. Link from your homepage and relevant service pages.',
  'Google Business Profile': 'Log into Google Business Profile Manager. Navigate to Q&A, Posts, or Info sections as appropriate.',
  'internal processes': 'Save to your team\'s shared drive or project management tool. Assign owners and set up recurring reminders.',
  'email templates': 'Import into your email tool (Mailchimp, HubSpot, etc.) or save as templates in your CRM.',
  'follow-up workflows': 'Set up automated follow-up sequences in your CRM or email automation tool with the provided templates.',
}

function getDeployAction(artifactTitle: string, target: string): string {
  const howto = TARGET_HOWTO[target]
  if (howto) {
    return `Deploy ${artifactTitle} to ${target}: ${howto}`
  }
  return `Deploy ${artifactTitle} to ${target}`
}

export function createDeploymentPlan(artifacts: Artifact[]): DeploymentStep[] {
  const steps: DeploymentStep[] = []
  let order = 1

  const sorted = [...artifacts].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.deployment.priority] - priorityOrder[b.deployment.priority]
  })

  for (const artifact of sorted) {
    for (const target of artifact.deployment.targets) {
      steps.push({
        order: order++,
        artifact: artifact.title,
        target,
        priority: artifact.deployment.priority,
        action: getDeployAction(artifact.title, target),
      })
    }
  }

  return steps
}
