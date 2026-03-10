import type { ArtifactType } from '@/types/artifacts'
import type { Competitor } from '@/types/snapshot'

export interface ArtifactTemplate {
  type: ArtifactType
  title: string
  description: string
  defaultDeployTargets: string[]
  externalTargets: string[]
  usageInstructions: string
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
    usageInstructions: 'HOW TO USE: Copy this prompt into ChatGPT or Claude to generate your entity definition. Then deploy the output to: 1) Your homepage About/hero section — use as the opening paragraph, 2) Your About page — use as the primary description, 3) LinkedIn company page "About" section — paste the same text, 4) All directory listings — use identical language for messaging consistency. The key is using the EXACT same text everywhere so AI models see a consistent entity definition.',
    promptTemplate: (name, category, audience) =>
      `Write a clear, factual entity definition block for ${name}.\n\nCategory: ${category}\nTarget audience: ${audience}\n\nThe block should include:\n1. A one-sentence company definition\n2. Primary service category\n3. Target audience\n4. Geographic scope\n5. Key differentiators\n6. Credentials or certifications\n\nFormat as a concise paragraph suitable for an About page, followed by structured bullet points. Use neutral, authoritative language that AI models would use when describing this company.`,
  },
  'faq-set': {
    type: 'faq-set',
    title: 'FAQ Set',
    description: 'Comprehensive FAQ content addressing common queries that AI models use to answer user questions',
    defaultDeployTargets: ['FAQ page', 'homepage', 'service pages'],
    externalTargets: ['Google Business Profile Q&A', 'community forums', 'industry knowledge bases'],
    usageInstructions: 'HOW TO USE: Copy this prompt into ChatGPT or Claude to generate your FAQ content. Then: 1) Create a dedicated FAQ page on your website and add all Q&As, 2) Implement FAQPage schema markup (JSON-LD) for each question-answer pair, 3) Post the top 10 most relevant Q&As to your Google Business Profile Q&A section, 4) Add contextual FAQ sections to related service/product pages, 5) Use answers as the basis for chatbot or support scripts.',
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
    usageInstructions: 'HOW TO USE: Copy this prompt into ChatGPT or Claude to generate your comparison content. Then: 1) Create a dedicated comparison landing page for each competitor pairing (e.g., "YourBrand vs Competitor"), 2) Write the full article based on this outline — keep the tone neutral and balanced, 3) Add the page to your site navigation under Resources or Blog, 4) Share on LinkedIn as an article and submit to industry review sites, 5) Link from relevant FAQ answers that mention alternatives.',
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
    usageInstructions: 'HOW TO USE: Copy this prompt into ChatGPT or Claude to generate your GBP Q&As. Then: 1) Go to your Google Business Profile → Q&A section, 2) Post each question yourself (from your personal Google account), 3) Answer each question from your business account with the generated answers, 4) Prioritize questions about services, areas served, and differentiators, 5) Monitor for new customer questions and respond within 24 hours.',
    promptTemplate: (name, category, audience) =>
      `Create a Google Business Profile Q&A set for ${name} (${category}).\n\nTarget audience: ${audience}\n\nGenerate 10 questions and answers covering:\n1. What does ${name} do?\n2. What areas does ${name} serve?\n3. What services does ${name} offer?\n4. How can I contact ${name}?\n5. What are ${name}'s hours?\n6. Does ${name} offer [specific service]?\n7. What should I expect when working with ${name}?\n8. Is ${name} certified/licensed for [service]?\n9. How does ${name} handle [common concern]?\n10. What sets ${name} apart from other ${category} providers?\n\nFormat for direct posting to GBP Q&A section.`,
  },
  'schema-draft': {
    type: 'schema-draft',
    title: 'Schema Markup Draft',
    description: 'Structured data markup that helps AI models understand entity relationships',
    defaultDeployTargets: ['homepage', 'service pages', 'about page'],
    externalTargets: [],
    usageInstructions: 'HOW TO USE: Copy this prompt into ChatGPT or Claude to generate your schema markup. Then: 1) Add the Organization JSON-LD to your homepage <head> section, 2) Add Service schema to each service/product page, 3) Add FAQPage schema to your FAQ page, 4) Test each page at search.google.com/test/rich-results to validate, 5) Fix any errors and re-test. If using WordPress, consider the Rank Math or Yoast SEO plugin for easier schema management.',
    promptTemplate: (name, category, audience) =>
      `Generate JSON-LD schema markup for ${name} (${category}).\n\nTarget audience: ${audience}\n\nInclude the following schema types:\n1. Organization schema with:\n   - name, description, url\n   - contactPoint\n   - areaServed\n   - serviceType\n   - sameAs (social profiles placeholder)\n2. LocalBusiness schema (if applicable)\n3. Service schema for primary offerings\n4. FAQPage schema structure\n5. Review/AggregateRating schema structure\n\nOutput as valid JSON-LD ready to embed in HTML <script> tags.`,
  },
  'review-request-script': {
    type: 'review-request-script',
    title: 'Review Acquisition Plan',
    description: 'Scripts and processes for systematically building review volume and quality',
    defaultDeployTargets: ['internal processes', 'email templates', 'follow-up workflows'],
    externalTargets: ['Google reviews', 'industry review sites', 'Trustpilot', 'G2/Capterra'],
    usageInstructions: 'HOW TO USE: Copy this prompt into ChatGPT or Claude to generate your review plan. Then: 1) Set up the email templates in your CRM or email tool, 2) Create a standard operating procedure: send review request 1-3 days after service, follow up once after 5 days, 3) Get your Google review link from your Google Business Profile (Share → Get more reviews), 4) Respond to ALL existing reviews first (shows engagement), 5) Track review count monthly — target 2-4 new reviews per month.',
    promptTemplate: (name, category, audience) =>
      `Create a review acquisition plan for ${name} (${category}).\n\nTarget audience: ${audience}\n\nInclude:\n1. Email template: post-service review request\n2. Email template: follow-up for non-responders\n3. Script: in-person review request\n4. List of priority review platforms for ${category}\n5. Monthly review volume targets\n6. Review response templates (positive and negative)\n7. Internal process for review monitoring\n\nKeep tone professional and compliant with platform guidelines. Never incentivize reviews.`,
  },
  'authority-article-outline': {
    type: 'authority-article-outline',
    title: 'Authority Article Outline',
    description: 'Thought leadership content that builds topical authority and generates citations',
    defaultDeployTargets: ['blog', 'resources section'],
    externalTargets: ['LinkedIn articles', 'industry publications', 'guest blog posts', 'newsletter pitches'],
    usageInstructions: 'HOW TO USE: Copy this prompt into ChatGPT or Claude to generate your article outlines. Then: 1) Write the first article (industry trend piece) and publish on your blog with a detailed author bio, 2) Add Person schema markup for the author with credentials and expertise, 3) Repurpose key insights as LinkedIn posts and articles, 4) Pitch the buyer\'s guide to 2-3 industry publications as a guest post, 5) Use the case study outline to write up a real client success story with measurable results.',
    promptTemplate: (name, category, audience, competitors) => {
      const compContext = competitors && competitors.length > 0
        ? `\n\nCompetitive landscape: position against ${competitors.map((c) => c.name).join(', ')}`
        : ''
      return `Create an authority article outline for ${name} to establish thought leadership in ${category}.\n\nTarget audience: ${audience}${compContext}\n\nGenerate 3 article outlines:\n\nArticle 1: "[Industry Trend] Guide for [Audience]"\n- Educational, non-promotional\n- Positions ${name} as knowledgeable authority\n- Include data points and research references\n\nArticle 2: "How to Choose the Right [Category] Provider"\n- Buyer's guide format\n- Neutral criteria that favor ${name}'s strengths\n- Comparison framework\n\nArticle 3: "[Case Study/Results] in [Category]"\n- Results-focused narrative\n- Methodology explanation\n- Transferable insights\n\nFor each: title, target word count, key sections, SEO target keywords, and distribution strategy.`
    },
  },
}
