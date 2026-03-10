import type { ClientGeoSnapshot, SignalKey } from '@/types/snapshot'
import type { MonthlyChangeLog } from '@/types/changelog'
import type { Recommendation, ImplementationStep } from '@/types/recommendations'
import { SIGNAL_DEFINITIONS } from '@/engine/constants/signal-definitions'
import { PLATFORM_CONFIGS } from '@/engine/constants/platform-config'

export function generateRecommendations(
  snapshot: ClientGeoSnapshot,
  _changelog?: MonthlyChangeLog,
): Recommendation[] {
  const recommendations: Recommendation[] = []

  const weakSignals = SIGNAL_DEFINITIONS.filter(
    (def) => snapshot.signals[def.key] < def.criticalThreshold
  ).sort((a, b) => {
    const scoreA = snapshot.signals[a.key]
    const scoreB = snapshot.signals[b.key]
    const priorityA = a.weight * (5 - scoreA)
    const priorityB = b.weight * (5 - scoreB)
    return priorityB - priorityA
  })

  for (const def of weakSignals) {
    const score = snapshot.signals[def.key]
    const impact = score <= 1 ? 'high' : score <= 2 ? 'high' : 'medium'

    const relevantPlatform = PLATFORM_CONFIGS.find((p) =>
      p.prioritySignals.includes(def.key)
    )

    recommendations.push({
      priority: def.weight * (5 - score),
      signal: def.key,
      artifactType: def.artifactType,
      title: `Improve ${def.label}`,
      description: getActionDescription(def.key, score, snapshot),
      platform: relevantPlatform?.key ?? 'all',
      impact,
      steps: getImplementationSteps(def.key, snapshot),
      timeline: getTimeline(impact),
      successCriteria: getSuccessCriteria(def.key, snapshot),
    })
  }

  // Platform-specific recommendations
  for (const platform of PLATFORM_CONFIGS) {
    const visibility = snapshot.platformVisibility[platform.key]
    if (visibility < 30) {
      const weakPlatformSignals = platform.prioritySignals.filter(
        (sig) => snapshot.signals[sig] < 3
      )
      if (weakPlatformSignals.length > 0 && !recommendations.some((r) => r.platform === platform.key)) {
        const primarySignal = weakPlatformSignals[0]
        const impact: 'high' | 'medium' | 'low' = 'high'
        recommendations.push({
          priority: 0.5,
          signal: primarySignal,
          artifactType: SIGNAL_DEFINITIONS.find((d) => d.key === primarySignal)!.artifactType,
          title: `Boost ${platform.label} visibility`,
          description: `${platform.label} visibility is at ${visibility}%. Focus on: ${weakPlatformSignals.map((s) => SIGNAL_DEFINITIONS.find((d) => d.key === s)?.label).join(', ')}`,
          platform: platform.key,
          impact,
          steps: getPlatformSteps(platform.label, weakPlatformSignals, snapshot),
          timeline: getTimeline(impact),
          successCriteria: `${platform.label} visibility score reaches 30%+ within 30 days`,
        })
      }
    }
  }

  return recommendations.sort((a, b) => b.priority - a.priority)
}

function getTimeline(impact: 'high' | 'medium' | 'low'): string {
  switch (impact) {
    case 'high': return 'This week'
    case 'medium': return 'Within 2 weeks'
    case 'low': return 'Within 30 days'
  }
}

function getActionDescription(key: SignalKey, score: number, snapshot: ClientGeoSnapshot): string {
  const name = snapshot.businessName || 'the business'
  const category = snapshot.primaryCategory || 'the category'
  const compNames = snapshot.competitors.length > 0
    ? snapshot.competitors.map((c) => c.name).join(', ')
    : 'alternatives'

  const descriptions: Record<string, string> = {
    entityClarity: `Create a clear entity definition block for ${name} as a ${category} provider. Deploy across homepage, about page, and external profiles.`,
    brandMentions: `Increase brand mentions for ${name} through guest articles, directory listings, and partner mentions.`,
    comparisonPresence: snapshot.competitors.length > 0
      ? `Create comparison pages: ${snapshot.competitors.slice(0, 3).map((c) => `${name} vs ${c.name}`).join(', ')}. Position ${name} against ${compNames} in the ${category} space.`
      : `Create comparison content positioning ${name} against alternatives in the ${category} space.`,
    faqCoverage: `Build comprehensive FAQ content covering common ${category} queries that AI models use to answer questions.`,
    structuredData: `Implement Organization, Service, and FAQ schema markup for ${name}.`,
    reviews: `Launch a review acquisition campaign targeting Google, industry platforms, and relevant review sites.`,
    authoritySignals: `Publish thought leadership content establishing ${name} as an authority in ${category}.`,
    citations: `Build third-party citations through directory listings, media mentions, and industry associations.`,
    gbpCompleteness: `Complete and optimize Google Business Profile for ${name} including Q&A, posts, and photos.`,
    knowledgeGraphSignals: `Strengthen knowledge graph connections through consistent structured data and entity relationships.`,
    messagingConsistency: `Align messaging about ${name} across all touchpoints: website, profiles, directories, and social media.`,
    credibilitySignals: `Add credibility indicators: certifications, awards, endorsements, and partnership badges.`,
  }

  return descriptions[key] ?? `Improve ${key} signal (currently ${score}/5).`
}

function getImplementationSteps(key: SignalKey, snapshot: ClientGeoSnapshot): ImplementationStep[] {
  const name = snapshot.businessName || 'the business'
  const category = snapshot.primaryCategory || 'the category'

  const stepsMap: Record<string, { action: string; detail: string }[]> = {
    entityClarity: [
      { action: 'Draft entity definition paragraph', detail: `Write a 2-3 sentence factual description of ${name} covering: what it is, what it does, who it serves, and where it operates.` },
      { action: 'Deploy to homepage and about page', detail: 'Add the entity definition to your homepage hero section and as the opening paragraph on your About page.' },
      { action: 'Update meta descriptions', detail: 'Rewrite your homepage and key page meta descriptions to include the entity definition language.' },
      { action: 'Add Organization schema markup', detail: 'Implement JSON-LD Organization schema with name, description, URL, and areaServed matching your entity definition.' },
      { action: 'Mirror on external profiles', detail: 'Copy the same entity definition to LinkedIn company page, Google Business Profile description, and all directory listings.' },
    ],
    brandMentions: [
      { action: 'Identify 5 target publications', detail: `Research blogs, industry publications, and news sites in the ${category} space that accept guest contributions.` },
      { action: 'Pitch guest articles', detail: `Write and pitch 2-3 articles that naturally mention ${name} with a link back to your site.` },
      { action: 'Update directory listings', detail: 'Claim and complete profiles on industry directories, ensuring consistent brand name usage.' },
      { action: 'Request partner mentions', detail: 'Ask partners, vendors, and clients to mention or link to your business on their websites.' },
      { action: 'Set up brand monitoring', detail: `Use Google Alerts for "${name}" to track new mentions and identify unlinked brand references.` },
    ],
    comparisonPresence: [
      { action: 'Identify top 3 competitors', detail: snapshot.competitors.length > 0
        ? `Create comparison content for: ${snapshot.competitors.slice(0, 3).map(c => c.name).join(', ')}.`
        : `Research the top 3 alternatives in ${category} that prospects compare against.` },
      { action: 'Create comparison landing pages', detail: `Build dedicated "${name} vs [Competitor]" pages with honest feature comparisons, pricing, and use case fit.` },
      { action: 'Write a buyer\'s guide', detail: `Create a "How to Choose the Best ${category}" guide with comparison criteria that highlights ${name}'s strengths.` },
      { action: 'Add comparison schema', detail: 'Implement structured data on comparison pages to help AI models understand the competitive positioning.' },
      { action: 'Distribute comparison content', detail: 'Share comparison articles on LinkedIn, submit to industry review sites, and link from relevant FAQ answers.' },
    ],
    faqCoverage: [
      { action: 'Research common questions', detail: `Use Google\'s "People Also Ask" and AI platforms to find the top 15-20 questions about ${category}.` },
      { action: 'Write comprehensive FAQ answers', detail: `Create clear, factual answers that specifically mention ${name} and its approach to each topic.` },
      { action: 'Deploy FAQ page with schema', detail: 'Build a dedicated FAQ page and implement FAQPage schema markup for each Q&A pair.' },
      { action: 'Post to Google Business Profile Q&A', detail: 'Add your top 10 most relevant FAQs to your Google Business Profile Q&A section.' },
      { action: 'Embed FAQs across relevant pages', detail: 'Add contextual FAQ sections to service pages, product pages, and blog posts where relevant.' },
    ],
    structuredData: [
      { action: 'Audit existing schema', detail: 'Test your site with Google Rich Results Test and Schema.org validator to identify current markup and gaps.' },
      { action: 'Implement Organization schema', detail: `Add JSON-LD Organization schema to your homepage with name, description, URL, logo, contactPoint, and sameAs links.` },
      { action: 'Add Service/Product schema', detail: 'Implement Service or Product schema on each service/product page with descriptions and offers.' },
      { action: 'Add FAQ schema', detail: 'Implement FAQPage schema on any page with Q&A content.' },
      { action: 'Validate and monitor', detail: 'Run all pages through Rich Results Test, fix errors, and set up ongoing monitoring in Google Search Console.' },
    ],
    reviews: [
      { action: 'Identify priority review platforms', detail: `Find the top 3 review sites for ${category} (e.g., Google, industry-specific sites, Trustpilot).` },
      { action: 'Create review request email template', detail: 'Write a professional post-service email requesting reviews, with direct links to your review profiles.' },
      { action: 'Implement review request workflow', detail: 'Set up a consistent process: send review request 1-3 days after service completion, follow up once after 5 days.' },
      { action: 'Respond to all existing reviews', detail: 'Write thoughtful responses to every existing review (positive and negative) to show engagement.' },
      { action: 'Set monthly review targets', detail: 'Aim for 2-4 new reviews per month. Track progress and adjust messaging if response rates are low.' },
    ],
    authoritySignals: [
      { action: 'Plan authority content calendar', detail: `Outline 3 articles establishing ${name} as a thought leader in ${category}: an industry trend piece, a how-to guide, and a case study.` },
      { action: 'Publish first authority article', detail: 'Write and publish the industry trend article on your blog with proper author markup and expertise signals.' },
      { action: 'Secure guest publication', detail: 'Pitch one article to an industry publication or blog that your target audience reads.' },
      { action: 'Build author entity', detail: 'Create a detailed author bio page linking to LinkedIn, publications, and credentials. Add Person schema markup.' },
      { action: 'Cross-promote content', detail: 'Share articles on LinkedIn, industry forums, and newsletters. Repurpose key points into social posts.' },
    ],
    citations: [
      { action: 'Audit existing citations', detail: `Search for "${name}" across directories, review sites, and industry databases. Note inconsistencies.` },
      { action: 'Submit to major directories', detail: 'Claim or create listings on the top 5 directories for your industry with consistent NAP (Name, Address, Phone) data.' },
      { action: 'Pursue media mentions', detail: 'Register on HARO/Connectively, respond to journalist queries in your area of expertise to earn citations.' },
      { action: 'Join industry associations', detail: 'Become a member of relevant industry associations and get listed in their member directories.' },
      { action: 'Create linkable resources', detail: `Publish original research, data, or tools related to ${category} that others will naturally cite and reference.` },
    ],
    gbpCompleteness: [
      { action: 'Complete all GBP fields', detail: `Fill in every field: business description, categories, attributes, hours, service areas, and products/services for ${name}.` },
      { action: 'Add photos and virtual tour', detail: 'Upload 10+ high-quality photos (exterior, interior, team, products/services). Consider adding a 360° virtual tour.' },
      { action: 'Post Q&A content', detail: 'Add 10+ self-generated Q&As addressing common customer questions about your services.' },
      { action: 'Create regular GBP posts', detail: 'Publish weekly Google Posts with updates, offers, and events to signal an active business.' },
      { action: 'Enable all features', detail: 'Activate messaging, booking (if applicable), and product catalog. Respond to all reviews within 24 hours.' },
    ],
    knowledgeGraphSignals: [
      { action: 'Verify structured data connections', detail: 'Ensure your Organization schema includes sameAs links to all official profiles (LinkedIn, Wikipedia, Crunchbase, etc.).' },
      { action: 'Create or update Wikipedia presence', detail: 'If eligible, create a Wikipedia article or ensure Wikidata entry exists with correct entity information.' },
      { action: 'Strengthen entity associations', detail: `Link ${name} to related entities (founders, parent company, industry) through structured data and content.` },
      { action: 'Claim knowledge panels', detail: 'If a Google Knowledge Panel exists, claim it. If not, submit entity information through Google\'s knowledge panel request process.' },
      { action: 'Cross-reference across platforms', detail: 'Ensure all major platforms (LinkedIn, Crunchbase, BBB, directories) contain identical entity information.' },
    ],
    messagingConsistency: [
      { action: 'Create brand messaging document', detail: `Write a single-source brand description, tagline, and value propositions for ${name} that all content should align to.` },
      { action: 'Audit website messaging', detail: 'Review homepage, about page, and service pages for conflicting descriptions, outdated info, or inconsistent positioning.' },
      { action: 'Update external profiles', detail: 'Align LinkedIn, Google Business Profile, directory listings, and social bios to use the same core messaging.' },
      { action: 'Standardize email and collateral', detail: 'Update email signatures, proposals, and sales collateral to match the approved brand messaging.' },
      { action: 'Document and share guidelines', detail: 'Create a brief brand voice guide and share with team members who create content or manage profiles.' },
    ],
    credibilitySignals: [
      { action: 'Inventory existing credentials', detail: `List all certifications, awards, partnerships, and endorsements that ${name} has earned.` },
      { action: 'Display trust badges on website', detail: 'Add certification logos, award badges, and partnership emblems to your homepage, footer, and relevant service pages.' },
      { action: 'Add credential schema markup', detail: 'Implement schema markup for certifications and awards (e.g., hasCredential, award properties).' },
      { action: 'Pursue new credibility signals', detail: `Research relevant industry certifications, awards programs, and partnership opportunities for ${category}.` },
      { action: 'Collect and showcase testimonials', detail: 'Gather client testimonials with specific results/outcomes and display them with proper Review schema markup.' },
    ],
  }

  const steps = stepsMap[key] ?? [
    { action: `Audit current ${key} status`, detail: `Review the current state of ${key} for ${name}.` },
    { action: `Create improvement plan`, detail: `Develop specific actions to improve ${key} from current score.` },
    { action: `Implement changes`, detail: `Execute the improvement plan across all relevant touchpoints.` },
    { action: `Verify and monitor`, detail: `Confirm changes are live and set up monitoring for ongoing tracking.` },
  ]

  return steps.map((s, i) => ({ step: i + 1, action: s.action, detail: s.detail }))
}

function getSuccessCriteria(key: SignalKey, snapshot: ClientGeoSnapshot): string {
  const name = snapshot.businessName || 'the business'

  const criteria: Record<string, string> = {
    entityClarity: `Entity definition deployed to homepage, about page, and 2+ external profiles with matching Organization schema`,
    brandMentions: `3+ new brand mentions from external sources within 30 days, tracked via Google Alerts`,
    comparisonPresence: `At least 2 comparison pages published and indexed, with comparison schema markup validated`,
    faqCoverage: `15+ FAQ answers published with FAQPage schema, top 10 posted to Google Business Profile Q&A`,
    structuredData: `Organization, Service, FAQ, and Review schema all passing Google Rich Results validation`,
    reviews: `5+ new reviews within 30 days across at least 2 platforms, with 100% response rate`,
    authoritySignals: `2+ authority articles published (1 on-site, 1 external) with proper author markup`,
    citations: `5+ new directory listings or third-party citations with consistent NAP data`,
    gbpCompleteness: `All GBP fields completed, 10+ photos uploaded, 10+ Q&As posted, weekly posts active`,
    knowledgeGraphSignals: `All sameAs links verified, Wikidata entry exists or submitted, entity information consistent across platforms`,
    messagingConsistency: `Brand messaging document created, all external profiles updated to match, team briefed on guidelines`,
    credibilitySignals: `Trust badges displayed on homepage and service pages, credential schema markup validated, 3+ testimonials with Review schema`,
  }

  return criteria[key] ?? `${name}'s ${key} signal improved to 3+/5 within 30 days`
}

function getPlatformSteps(
  platformLabel: string,
  weakSignals: SignalKey[],
  snapshot: ClientGeoSnapshot,
): ImplementationStep[] {
  const signalLabels = weakSignals.map(s => SIGNAL_DEFINITIONS.find(d => d.key === s)?.label ?? s)

  return [
    { step: 1, action: `Audit ${platformLabel} presence`, detail: `Search for "${snapshot.businessName}" on ${platformLabel} and document what appears (or doesn't).` },
    { step: 2, action: `Address weak signals`, detail: `Focus on improving: ${signalLabels.join(', ')}. These are the signals ${platformLabel} prioritizes.` },
    { step: 3, action: `Optimize content for ${platformLabel}`, detail: `Ensure your entity definition, FAQs, and structured data align with how ${platformLabel} sources and displays information.` },
    { step: 4, action: `Re-test on ${platformLabel}`, detail: `After implementing changes, test again by asking ${platformLabel} about your business and category to verify improvement.` },
  ]
}
