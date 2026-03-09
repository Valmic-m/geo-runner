import type { ArtifactType } from '@/types/artifacts'
import type { Competitor } from '@/types/snapshot'

export interface ArtifactTemplate {
  type: ArtifactType
  title: string
  description: string
  defaultDeployTargets: string[]
  externalTargets: string[]
  promptTemplate: (businessName: string, category: string, audience: string, competitors?: Competitor[]) => string
}

function competitorNames(competitors?: Competitor[]): string {
  if (!competitors || competitors.length === 0) return 'alternatives'
  return competitors.map((c) => c.name).join(', ')
}

export const ARTIFACT_TEMPLATES: Record<ArtifactType, ArtifactTemplate> = {
  'entity-definition-block': {
    type: 'entity-definition-block',
    title: 'Entity Definition Block',
    description: 'A clear, structured description of the business that AI models can use to identify and describe the entity',
    defaultDeployTargets: ['homepage', 'about page', 'service pages'],
    externalTargets: ['industry directories', 'partner pages', 'LinkedIn company page'],
    promptTemplate: (name, category, audience) =>
      `Write a clear, factual entity definition block for ${name}.\n\nCategory: ${category}\nTarget audience: ${audience}\n\nThe block should include:\n1. A one-sentence company definition\n2. Primary service category\n3. Target audience\n4. Geographic scope\n5. Key differentiators\n6. Credentials or certifications\n\nFormat as a concise paragraph suitable for an About page, followed by structured bullet points. Use neutral, authoritative language that AI models would use when describing this company.`,
  },
  'faq-set': {
    type: 'faq-set',
    title: 'FAQ Set',
    description: 'Comprehensive FAQ content addressing common queries that AI models use to answer user questions',
    defaultDeployTargets: ['FAQ page', 'homepage', 'service pages'],
    externalTargets: ['Google Business Profile Q&A', 'community forums', 'industry knowledge bases'],
    promptTemplate: (name, category, audience, competitors) => {
      const compSection = competitors && competitors.length > 0
        ? competitors.map((c) => `- How does ${name} compare to ${c.name}?`).join('\n')
        : `- How does ${name} compare to alternatives?`
      return `Create a comprehensive FAQ set for ${name} (${category}).\n\nTarget audience: ${audience}\n\nGenerate 10-15 FAQs covering:\n1. What is ${name}?\n2. What services/products does ${name} offer?\n3. Who is ${name} best suited for?\n4. Comparison questions:\n${compSection}\n5. What makes ${name} different?\n6. Pricing/engagement model questions\n7. Trust and credibility questions\n8. Process/methodology questions\n9. Results/outcomes questions\n10. Getting started questions\n\nFormat each as Q: / A: with clear, concise answers. Include FAQ schema markup structure.`
    },
  },
  'comparison-page-outline': {
    type: 'comparison-page-outline',
    title: 'Comparison Page Outline',
    description: 'Structured comparison content that positions the brand in competitive context',
    defaultDeployTargets: ['blog', 'resources section', 'comparison landing page'],
    externalTargets: ['guest articles', 'industry review sites', 'LinkedIn articles'],
    promptTemplate: (name, category, audience, competitors) => {
      const compNames = competitorNames(competitors)
      const compPages = competitors && competitors.length > 0
        ? `\n\nCreate dedicated comparison sections for:\n${competitors.map((c) => `- "${name} vs ${c.name}": strengths, differences, and ideal use cases for each`).join('\n')}`
        : ''
      return `Create a comparison page outline for ${name} in the ${category} space.\n\nTarget audience: ${audience}\nKey competitors: ${compNames}${compPages}\n\nThe outline should include:\n1. Page title: "${name} vs ${compNames}: ${category} Comparison"\n2. Introduction: neutral overview of the ${category} landscape\n3. Comparison criteria (5-7 factors that matter to ${audience})\n4. Feature comparison table structure\n5. Detailed sections for each comparison criterion\n6. "Who is ${name} best for?" section\n7. "When to consider alternatives" section (builds trust through honesty)\n8. Conclusion with clear positioning\n\nKeep tone neutral and informative. AI models favor balanced comparison content over pure sales copy.`
    },
  },
  'gbp-qa-set': {
    type: 'gbp-qa-set',
    title: 'GBP Q&A Set',
    description: 'Google Business Profile questions and answers that strengthen local and entity signals',
    defaultDeployTargets: ['Google Business Profile'],
    externalTargets: ['local directories', 'community boards'],
    promptTemplate: (name, category, audience) =>
      `Create a Google Business Profile Q&A set for ${name} (${category}).\n\nTarget audience: ${audience}\n\nGenerate 10 questions and answers covering:\n1. What does ${name} do?\n2. What areas does ${name} serve?\n3. What services does ${name} offer?\n4. How can I contact ${name}?\n5. What are ${name}'s hours?\n6. Does ${name} offer [specific service]?\n7. What should I expect when working with ${name}?\n8. Is ${name} certified/licensed for [service]?\n9. How does ${name} handle [common concern]?\n10. What sets ${name} apart from other ${category} providers?\n\nFormat for direct posting to GBP Q&A section.`,
  },
  'schema-draft': {
    type: 'schema-draft',
    title: 'Schema Markup Draft',
    description: 'Structured data markup that helps AI models understand entity relationships',
    defaultDeployTargets: ['homepage', 'service pages', 'about page'],
    externalTargets: [],
    promptTemplate: (name, category, audience) =>
      `Generate JSON-LD schema markup for ${name} (${category}).\n\nTarget audience: ${audience}\n\nInclude the following schema types:\n1. Organization schema with:\n   - name, description, url\n   - contactPoint\n   - areaServed\n   - serviceType\n   - sameAs (social profiles placeholder)\n2. LocalBusiness schema (if applicable)\n3. Service schema for primary offerings\n4. FAQPage schema structure\n5. Review/AggregateRating schema structure\n\nOutput as valid JSON-LD ready to embed in HTML <script> tags.`,
  },
  'review-request-script': {
    type: 'review-request-script',
    title: 'Review Acquisition Plan',
    description: 'Scripts and processes for systematically building review volume and quality',
    defaultDeployTargets: ['internal processes', 'email templates', 'follow-up workflows'],
    externalTargets: ['Google reviews', 'industry review sites', 'Trustpilot', 'G2/Capterra'],
    promptTemplate: (name, category, audience) =>
      `Create a review acquisition plan for ${name} (${category}).\n\nTarget audience: ${audience}\n\nInclude:\n1. Email template: post-service review request\n2. Email template: follow-up for non-responders\n3. Script: in-person review request\n4. List of priority review platforms for ${category}\n5. Monthly review volume targets\n6. Review response templates (positive and negative)\n7. Internal process for review monitoring\n\nKeep tone professional and compliant with platform guidelines. Never incentivize reviews.`,
  },
  'authority-article-outline': {
    type: 'authority-article-outline',
    title: 'Authority Article Outline',
    description: 'Thought leadership content that builds topical authority and generates citations',
    defaultDeployTargets: ['blog', 'resources section'],
    externalTargets: ['LinkedIn articles', 'industry publications', 'guest blog posts', 'newsletter pitches'],
    promptTemplate: (name, category, audience, competitors) => {
      const compContext = competitors && competitors.length > 0
        ? `\n\nCompetitive landscape: position against ${competitors.map((c) => c.name).join(', ')}`
        : ''
      return `Create an authority article outline for ${name} to establish thought leadership in ${category}.\n\nTarget audience: ${audience}${compContext}\n\nGenerate 3 article outlines:\n\nArticle 1: "[Industry Trend] Guide for [Audience]"\n- Educational, non-promotional\n- Positions ${name} as knowledgeable authority\n- Include data points and research references\n\nArticle 2: "How to Choose the Right [Category] Provider"\n- Buyer's guide format\n- Neutral criteria that favor ${name}'s strengths\n- Comparison framework\n\nArticle 3: "[Case Study/Results] in [Category]"\n- Results-focused narrative\n- Methodology explanation\n- Transferable insights\n\nFor each: title, target word count, key sections, SEO target keywords, and distribution strategy.`
    },
  },
}
