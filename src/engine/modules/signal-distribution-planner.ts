import type { Artifact } from '@/types/artifacts'
import { ARTIFACT_TEMPLATES } from '@/engine/constants/artifact-templates'

export interface DistributionAction {
  artifact: string
  target: string
  type: 'internal' | 'external'
  action: string
}

const VERTICAL_DIRECTORIES: Record<string, string[]> = {
  legal: ['Avvo', 'Justia', 'FindLaw', 'Martindale-Hubbell', 'Lawyers.com'],
  healthcare: ['Healthgrades', 'Zocdoc', 'Vitals', 'WebMD', 'RateMDs'],
  dental: ['Healthgrades', 'Zocdoc', 'DentalPlans.com', '1-800-DENTIST'],
  restaurant: ['Yelp', 'TripAdvisor', 'OpenTable', 'DoorDash', 'Google Maps'],
  food: ['Yelp', 'TripAdvisor', 'OpenTable', 'DoorDash', 'Google Maps'],
  hospitality: ['TripAdvisor', 'Booking.com', 'Yelp', 'Google Maps'],
  saas: ['G2', 'Capterra', 'TrustRadius', 'Product Hunt', 'GetApp'],
  software: ['G2', 'Capterra', 'TrustRadius', 'Product Hunt', 'GetApp'],
  technology: ['G2', 'Capterra', 'TrustRadius', 'Crunchbase', 'Product Hunt'],
  'real estate': ['Zillow', 'Realtor.com', 'Redfin', 'Homes.com', 'Trulia'],
  'home services': ['Angi', 'HomeAdvisor', 'Thumbtack', 'Houzz', 'Yelp'],
  plumbing: ['Angi', 'HomeAdvisor', 'Thumbtack', 'Yelp', 'BBB'],
  hvac: ['Angi', 'HomeAdvisor', 'Thumbtack', 'Yelp', 'BBB'],
  roofing: ['Angi', 'HomeAdvisor', 'Thumbtack', 'Yelp', 'BBB'],
  finance: ['NerdWallet', 'Bankrate', 'WalletHub', 'Investopedia', 'BBB'],
  accounting: ['Clutch', 'Expertise.com', 'BBB', 'Yelp', 'LinkedIn'],
  marketing: ['Clutch', 'DesignRush', 'Agency Spotter', 'UpCity', 'G2'],
  agency: ['Clutch', 'DesignRush', 'Agency Spotter', 'UpCity', 'G2'],
  consulting: ['Clutch', 'Expertise.com', 'LinkedIn', 'Crunchbase', 'BBB'],
  ecommerce: ['Trustpilot', 'Sitejabber', 'BBB', 'Google Shopping', 'Amazon'],
  retail: ['Yelp', 'Google Maps', 'BBB', 'Trustpilot', 'Facebook'],
  education: ['Niche', 'Course Report', 'SwitchUp', 'Class Central', 'LinkedIn Learning'],
  fitness: ['ClassPass', 'Mindbody', 'Yelp', 'Google Maps', 'Facebook'],
  beauty: ['Yelp', 'StyleSeat', 'Booksy', 'Google Maps', 'Facebook'],
  automotive: ['AutoTrader', 'Cars.com', 'CarGurus', 'Edmunds', 'Yelp'],
  insurance: ['NerdWallet', 'Policygenius', 'Insurify', 'BBB', 'Trustpilot'],
}

function getVerticalDirectories(category: string): string[] {
  const normalized = category.toLowerCase().trim()

  // Exact match
  if (VERTICAL_DIRECTORIES[normalized]) {
    return VERTICAL_DIRECTORIES[normalized]
  }

  // Partial match
  for (const [key, dirs] of Object.entries(VERTICAL_DIRECTORIES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return dirs
    }
  }

  // Default directories
  return ['Yelp', 'BBB', 'Trustpilot', 'LinkedIn', 'Google Maps']
}

export function ensureExternalDistribution(artifacts: Artifact[], category?: string): {
  artifacts: Artifact[]
  distributionActions: DistributionAction[]
} {
  const distributionActions: DistributionAction[] = []
  const verticalDirs = getVerticalDirectories(category ?? '')

  // Add external targets to all applicable artifacts
  for (const artifact of artifacts) {
    const template = ARTIFACT_TEMPLATES[artifact.type]

    // Internal deployments
    for (const target of artifact.deployment.targets) {
      distributionActions.push({
        artifact: artifact.title,
        target,
        type: 'internal',
        action: `Deploy ${artifact.title} to ${target}`,
      })
    }

    // External deployments
    if (template?.externalTargets) {
      for (const target of template.externalTargets) {
        distributionActions.push({
          artifact: artifact.title,
          target,
          type: 'external',
          action: `Distribute ${artifact.title} to ${target}`,
        })
      }
    }
  }

  // Check if at least one external action exists
  const hasExternal = distributionActions.some((a) => a.type === 'external')

  if (!hasExternal && artifacts.length > 0) {
    // Add vertical-specific directory actions
    distributionActions.push({
      artifact: 'Authority Content',
      target: 'LinkedIn article',
      type: 'external',
      action: 'Publish a summary of key improvements as a LinkedIn article to build external mentions',
    })
    for (const dir of verticalDirs.slice(0, 3)) {
      distributionActions.push({
        artifact: 'Directory Listing',
        target: dir,
        type: 'external',
        action: `Submit or update your business listing on ${dir} with consistent entity information`,
      })
    }
  }

  // Always add vertical directory recommendations if we have a category
  if (category) {
    const existingTargets = new Set(distributionActions.map(a => a.target))
    for (const dir of verticalDirs) {
      if (!existingTargets.has(dir)) {
        distributionActions.push({
          artifact: 'Business Profile',
          target: dir,
          type: 'external',
          action: `Claim or update your profile on ${dir} — a key directory for your industry`,
        })
      }
    }
  }

  return { artifacts, distributionActions }
}
