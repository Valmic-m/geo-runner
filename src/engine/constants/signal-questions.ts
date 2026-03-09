import type { AssessmentQuestion } from '@/types/assessment'

export const SIGNAL_QUESTIONS: AssessmentQuestion[] = [
  // ── Entity Clarity ──────────────────────────────────────────────
  {
    id: 'ec-1',
    signalKey: 'entityClarity',
    text: 'When you search for "{{businessName}}" on an AI chatbot (ChatGPT, Gemini, etc.), does it know what the business does?',
    answerType: 'yes-partially-no',
    options: [
      { value: 'yes', label: 'Yes, accurately', scoreContribution: 1.0 },
      { value: 'partially', label: 'Partially / vague', scoreContribution: 0.5 },
      { value: 'no', label: 'No / never heard of it', scoreContribution: 0.0 },
    ],
    cycle: 'all',
    weight: 0.35,
    helpText: 'Try asking ChatGPT or Gemini: "What is {{businessName}}?" and see if the response is accurate.',
  },
  {
    id: 'ec-2',
    signalKey: 'entityClarity',
    text: 'Does the {{businessName}} website have a clear "About Us" page that states what the business does, who it serves, and where it operates?',
    answerType: 'yes-partially-no',
    options: [
      { value: 'yes', label: 'Yes, all three', scoreContribution: 1.0 },
      { value: 'partially', label: 'Some but not all', scoreContribution: 0.5 },
      { value: 'no', label: 'No About page or very vague', scoreContribution: 0.0 },
    ],
    cycle: 'annual',
    weight: 0.25,
  },
  {
    id: 'ec-3',
    signalKey: 'entityClarity',
    text: 'Is the business name, primary service, and service area clearly stated on the homepage?',
    answerType: 'yes-partially-no',
    options: [
      { value: 'yes', label: 'Yes, all visible', scoreContribution: 1.0 },
      { value: 'partially', label: 'Some missing', scoreContribution: 0.5 },
      { value: 'no', label: 'Not clear at all', scoreContribution: 0.0 },
    ],
    cycle: 'quarterly',
    weight: 0.2,
  },
  {
    id: 'ec-4',
    signalKey: 'entityClarity',
    text: 'Can you find {{businessName}} in a Google Knowledge Panel when you search the exact business name?',
    answerType: 'yes-no',
    options: [
      { value: 'yes', label: 'Yes', scoreContribution: 1.0 },
      { value: 'no', label: 'No', scoreContribution: 0.0 },
    ],
    cycle: 'quarterly',
    weight: 0.2,
  },

  // ── Brand Mentions ──────────────────────────────────────────────
  {
    id: 'bm-1',
    signalKey: 'brandMentions',
    text: 'When you search for "{{businessName}}" on Google (in quotes), approximately how many results appear?',
    answerType: 'count-range',
    options: [
      { value: 'under-100', label: 'Under 100', scoreContribution: 0.1 },
      { value: '100-1000', label: '100 - 1,000', scoreContribution: 0.4 },
      { value: '1000-10000', label: '1,000 - 10,000', scoreContribution: 0.7 },
      { value: 'over-10000', label: 'Over 10,000', scoreContribution: 1.0 },
    ],
    cycle: 'quarterly',
    weight: 0.4,
    helpText: 'Search Google for "{{businessName}}" with quotes and check the total result count.',
  },
  {
    id: 'bm-2',
    signalKey: 'brandMentions',
    text: 'Is {{businessName}} listed in any industry directories, review sites, or partner pages?',
    answerType: 'yes-partially-no',
    options: [
      { value: 'yes', label: 'Yes, multiple listings', scoreContribution: 1.0 },
      { value: 'partially', label: 'One or two', scoreContribution: 0.5 },
      { value: 'no', label: 'None that I know of', scoreContribution: 0.0 },
    ],
    cycle: 'all',
    weight: 0.35,
  },
  {
    id: 'bm-3',
    signalKey: 'brandMentions',
    text: 'Has {{businessName}} been mentioned in any articles, blogs, or news pieces (not written by the business)?',
    answerType: 'yes-no',
    options: [
      { value: 'yes', label: 'Yes', scoreContribution: 1.0 },
      { value: 'no', label: 'No', scoreContribution: 0.0 },
    ],
    cycle: 'quarterly',
    weight: 0.25,
  },

  // ── Comparison Presence ─────────────────────────────────────────
  {
    id: 'cp-1',
    signalKey: 'comparisonPresence',
    text: 'Does {{businessName}} appear in any "best of" or "top [category]" lists online?',
    answerType: 'yes-partially-no',
    options: [
      { value: 'yes', label: 'Yes, multiple lists', scoreContribution: 1.0 },
      { value: 'partially', label: 'One or two', scoreContribution: 0.5 },
      { value: 'no', label: 'None', scoreContribution: 0.0 },
    ],
    cycle: 'all',
    weight: 0.4,
    helpText: 'Search Google for "best {{category}}" or "top {{category}} companies" and see if you appear.',
  },
  {
    id: 'cp-2',
    signalKey: 'comparisonPresence',
    text: 'Does the {{businessName}} website have any comparison or "vs" content?',
    answerType: 'yes-no',
    options: [
      { value: 'yes', label: 'Yes', scoreContribution: 1.0 },
      { value: 'no', label: 'No', scoreContribution: 0.0 },
    ],
    cycle: 'quarterly',
    weight: 0.3,
  },
  {
    id: 'cp-3',
    signalKey: 'comparisonPresence',
    text: 'When you ask an AI "What are the best {{category}} companies?", is {{businessName}} included?',
    answerType: 'yes-sometimes-no',
    options: [
      { value: 'yes', label: 'Yes, consistently', scoreContribution: 1.0 },
      { value: 'sometimes', label: 'Sometimes', scoreContribution: 0.5 },
      { value: 'no', label: 'Never', scoreContribution: 0.0 },
    ],
    cycle: 'monthly',
    weight: 0.3,
  },

  // ── FAQ Coverage ────────────────────────────────────────────────
  {
    id: 'faq-1',
    signalKey: 'faqCoverage',
    text: 'Does the {{businessName}} website have a dedicated FAQ page or FAQ sections on service pages?',
    answerType: 'yes-partially-no',
    options: [
      { value: 'yes', label: 'Yes, dedicated FAQ page', scoreContribution: 1.0 },
      { value: 'partially', label: 'Some FAQ content but not comprehensive', scoreContribution: 0.5 },
      { value: 'no', label: 'No FAQ content', scoreContribution: 0.0 },
    ],
    cycle: 'all',
    weight: 0.4,
  },
  {
    id: 'faq-2',
    signalKey: 'faqCoverage',
    text: 'Approximately how many FAQ questions are published on the website?',
    answerType: 'count-range',
    options: [
      { value: '0', label: 'None', scoreContribution: 0.0 },
      { value: '1-5', label: '1-5', scoreContribution: 0.3 },
      { value: '6-15', label: '6-15', scoreContribution: 0.7 },
      { value: '16+', label: '16+', scoreContribution: 1.0 },
    ],
    cycle: 'quarterly',
    weight: 0.35,
  },
  {
    id: 'faq-3',
    signalKey: 'faqCoverage',
    text: 'Have you added or updated FAQ content this month?',
    answerType: 'yes-no',
    options: [
      { value: 'yes', label: 'Yes', scoreContribution: 1.0 },
      { value: 'no', label: 'No', scoreContribution: 0.3 },
    ],
    cycle: 'monthly',
    weight: 0.25,
  },

  // ── Structured Data ─────────────────────────────────────────────
  {
    id: 'sd-1',
    signalKey: 'structuredData',
    text: 'Does the website have JSON-LD schema markup? (Check with Google\'s Rich Results Test)',
    answerType: 'yes-partially-no',
    options: [
      { value: 'yes', label: 'Yes, multiple schema types', scoreContribution: 1.0 },
      { value: 'partially', label: 'Basic schema only', scoreContribution: 0.5 },
      { value: 'no', label: 'No schema markup', scoreContribution: 0.0 },
    ],
    cycle: 'quarterly',
    weight: 0.4,
    helpText: 'Go to search.google.com/test/rich-results and enter the website URL.',
  },
  {
    id: 'sd-2',
    signalKey: 'structuredData',
    text: 'Does the schema include Organization, Service/Product, and FAQ types?',
    answerType: 'count-range',
    options: [
      { value: 'none', label: 'None of these', scoreContribution: 0.0 },
      { value: '1', label: 'One type', scoreContribution: 0.3 },
      { value: '2', label: 'Two types', scoreContribution: 0.7 },
      { value: 'all', label: 'All three', scoreContribution: 1.0 },
    ],
    conditionalOn: { questionId: 'sd-1', answerValues: ['yes', 'partially'] },
    cycle: 'annual',
    weight: 0.35,
  },
  {
    id: 'sd-3',
    signalKey: 'structuredData',
    text: 'Does the schema include sameAs links to social profiles?',
    answerType: 'yes-no',
    options: [
      { value: 'yes', label: 'Yes', scoreContribution: 1.0 },
      { value: 'no', label: 'No', scoreContribution: 0.0 },
    ],
    conditionalOn: { questionId: 'sd-1', answerValues: ['yes', 'partially'] },
    cycle: 'annual',
    weight: 0.25,
  },

  // ── Reviews ─────────────────────────────────────────────────────
  {
    id: 'rv-1',
    signalKey: 'reviews',
    text: 'How many Google reviews does {{businessName}} have?',
    answerType: 'count-range',
    options: [
      { value: '0-5', label: '0-5', scoreContribution: 0.1 },
      { value: '5-20', label: '5-20', scoreContribution: 0.4 },
      { value: '20-50', label: '20-50', scoreContribution: 0.7 },
      { value: '50+', label: '50+', scoreContribution: 1.0 },
    ],
    cycle: 'all',
    weight: 0.4,
  },
  {
    id: 'rv-2',
    signalKey: 'reviews',
    text: 'What is the average star rating on Google?',
    answerType: 'count-range',
    options: [
      { value: 'none', label: 'No reviews yet', scoreContribution: 0.0 },
      { value: 'under-3', label: 'Under 3 stars', scoreContribution: 0.2 },
      { value: '3-4', label: '3 - 4 stars', scoreContribution: 0.6 },
      { value: '4+', label: '4+ stars', scoreContribution: 1.0 },
    ],
    cycle: 'quarterly',
    weight: 0.3,
  },
  {
    id: 'rv-3',
    signalKey: 'reviews',
    text: 'Has {{businessName}} received any new reviews in the past month?',
    answerType: 'yes-no',
    options: [
      { value: 'yes', label: 'Yes', scoreContribution: 1.0 },
      { value: 'no', label: 'No', scoreContribution: 0.2 },
    ],
    cycle: 'monthly',
    weight: 0.3,
  },

  // ── Authority Signals ───────────────────────────────────────────
  {
    id: 'as-1',
    signalKey: 'authoritySignals',
    text: 'Does {{businessName}} publish educational or thought-leadership content (blog, guides, whitepapers)?',
    answerType: 'yes-partially-no',
    options: [
      { value: 'yes', label: 'Yes, regularly', scoreContribution: 1.0 },
      { value: 'partially', label: 'Occasionally or outdated', scoreContribution: 0.5 },
      { value: 'no', label: 'No content', scoreContribution: 0.0 },
    ],
    cycle: 'all',
    weight: 0.4,
  },
  {
    id: 'as-2',
    signalKey: 'authoritySignals',
    text: 'Has anyone from {{businessName}} been quoted as an expert, spoken at events, or contributed guest articles?',
    answerType: 'yes-no',
    options: [
      { value: 'yes', label: 'Yes', scoreContribution: 1.0 },
      { value: 'no', label: 'No', scoreContribution: 0.0 },
    ],
    cycle: 'quarterly',
    weight: 0.3,
  },
  {
    id: 'as-3',
    signalKey: 'authoritySignals',
    text: 'Has new authority content been published this month?',
    answerType: 'yes-no',
    options: [
      { value: 'yes', label: 'Yes', scoreContribution: 1.0 },
      { value: 'no', label: 'No', scoreContribution: 0.2 },
    ],
    cycle: 'monthly',
    weight: 0.3,
  },

  // ── Citations ───────────────────────────────────────────────────
  {
    id: 'ct-1',
    signalKey: 'citations',
    text: 'Is {{businessName}} cited or referenced by independent third-party sources (media, directories, academic, government)?',
    answerType: 'yes-partially-no',
    options: [
      { value: 'yes', label: 'Yes, from multiple sources', scoreContribution: 1.0 },
      { value: 'partially', label: 'One or two mentions', scoreContribution: 0.5 },
      { value: 'no', label: 'None', scoreContribution: 0.0 },
    ],
    cycle: 'all',
    weight: 0.45,
  },
  {
    id: 'ct-2',
    signalKey: 'citations',
    text: 'Is {{businessName}} listed in authoritative industry directories or association member lists?',
    answerType: 'yes-no',
    options: [
      { value: 'yes', label: 'Yes', scoreContribution: 1.0 },
      { value: 'no', label: 'No', scoreContribution: 0.0 },
    ],
    cycle: 'quarterly',
    weight: 0.3,
  },
  {
    id: 'ct-3',
    signalKey: 'citations',
    text: 'Have any new third-party citations or mentions been gained this month?',
    answerType: 'yes-no',
    options: [
      { value: 'yes', label: 'Yes', scoreContribution: 1.0 },
      { value: 'no', label: 'No', scoreContribution: 0.2 },
    ],
    cycle: 'monthly',
    weight: 0.25,
  },

  // ── GBP Completeness ───────────────────────────────────────────
  {
    id: 'gbp-1',
    signalKey: 'gbpCompleteness',
    text: 'Does {{businessName}} have a claimed and verified Google Business Profile?',
    answerType: 'yes-no',
    options: [
      { value: 'yes', label: 'Yes', scoreContribution: 1.0 },
      { value: 'no', label: 'No', scoreContribution: 0.0 },
    ],
    cycle: 'all',
    weight: 0.35,
  },
  {
    id: 'gbp-2',
    signalKey: 'gbpCompleteness',
    text: 'How complete is the Google Business Profile?',
    answerType: 'multiple-choice',
    options: [
      { value: 'full', label: 'Fully complete (photos, hours, Q&A, posts, services)', scoreContribution: 1.0 },
      { value: 'mostly', label: 'Mostly complete (some sections empty)', scoreContribution: 0.6 },
      { value: 'basic', label: 'Just basic info (name, address, phone)', scoreContribution: 0.3 },
      { value: 'empty', label: 'Not set up / empty', scoreContribution: 0.0 },
    ],
    conditionalOn: { questionId: 'gbp-1', answerValues: ['yes'] },
    cycle: 'quarterly',
    weight: 0.4,
  },
  {
    id: 'gbp-3',
    signalKey: 'gbpCompleteness',
    text: 'Has the GBP been updated with new posts or photos this month?',
    answerType: 'yes-no',
    options: [
      { value: 'yes', label: 'Yes', scoreContribution: 1.0 },
      { value: 'no', label: 'No', scoreContribution: 0.2 },
    ],
    conditionalOn: { questionId: 'gbp-1', answerValues: ['yes'] },
    cycle: 'monthly',
    weight: 0.25,
  },

  // ── Knowledge Graph Signals ─────────────────────────────────────
  {
    id: 'kg-1',
    signalKey: 'knowledgeGraphSignals',
    text: 'Does {{businessName}} have a Wikipedia page or Wikidata entry?',
    answerType: 'yes-no',
    options: [
      { value: 'yes', label: 'Yes', scoreContribution: 1.0 },
      { value: 'no', label: 'No', scoreContribution: 0.0 },
    ],
    cycle: 'annual',
    weight: 0.3,
  },
  {
    id: 'kg-2',
    signalKey: 'knowledgeGraphSignals',
    text: 'Are the business\'s social profiles (LinkedIn, Facebook, etc.) linked together and consistent?',
    answerType: 'yes-partially-no',
    options: [
      { value: 'yes', label: 'Yes, all linked and consistent', scoreContribution: 1.0 },
      { value: 'partially', label: 'Some linked, some inconsistent', scoreContribution: 0.5 },
      { value: 'no', label: 'No social profiles or not linked', scoreContribution: 0.0 },
    ],
    cycle: 'quarterly',
    weight: 0.4,
  },
  {
    id: 'kg-3',
    signalKey: 'knowledgeGraphSignals',
    text: 'Does the website schema markup include sameAs or knowsAbout properties?',
    answerType: 'yes-no',
    options: [
      { value: 'yes', label: 'Yes', scoreContribution: 1.0 },
      { value: 'no', label: 'No / unsure', scoreContribution: 0.0 },
    ],
    cycle: 'annual',
    weight: 0.3,
  },

  // ── Messaging Consistency ───────────────────────────────────────
  {
    id: 'mc-1',
    signalKey: 'messagingConsistency',
    text: 'Is the business description consistent across the website, Google Business Profile, LinkedIn, and other profiles?',
    answerType: 'yes-partially-no',
    options: [
      { value: 'yes', label: 'Yes, all match', scoreContribution: 1.0 },
      { value: 'partially', label: 'Mostly, some outdated', scoreContribution: 0.5 },
      { value: 'no', label: 'No, different everywhere', scoreContribution: 0.0 },
    ],
    cycle: 'all',
    weight: 0.5,
  },
  {
    id: 'mc-2',
    signalKey: 'messagingConsistency',
    text: 'Is the same primary category and service language used across all profiles?',
    answerType: 'yes-no',
    options: [
      { value: 'yes', label: 'Yes', scoreContribution: 1.0 },
      { value: 'no', label: 'No', scoreContribution: 0.0 },
    ],
    cycle: 'quarterly',
    weight: 0.3,
  },
  {
    id: 'mc-3',
    signalKey: 'messagingConsistency',
    text: 'Have you updated any external profiles this month to align messaging?',
    answerType: 'yes-no',
    options: [
      { value: 'yes', label: 'Yes', scoreContribution: 1.0 },
      { value: 'no', label: 'No', scoreContribution: 0.3 },
    ],
    cycle: 'monthly',
    weight: 0.2,
  },

  // ── Credibility Signals ─────────────────────────────────────────
  {
    id: 'cs-1',
    signalKey: 'credibilitySignals',
    text: 'Does {{businessName}} display any certifications, licenses, or accreditations on the website?',
    answerType: 'yes-no',
    options: [
      { value: 'yes', label: 'Yes', scoreContribution: 1.0 },
      { value: 'no', label: 'No', scoreContribution: 0.0 },
    ],
    cycle: 'all',
    weight: 0.3,
  },
  {
    id: 'cs-2',
    signalKey: 'credibilitySignals',
    text: 'Does the website mention any awards, honors, or industry recognition?',
    answerType: 'yes-no',
    options: [
      { value: 'yes', label: 'Yes', scoreContribution: 1.0 },
      { value: 'no', label: 'No', scoreContribution: 0.0 },
    ],
    cycle: 'quarterly',
    weight: 0.25,
  },
  {
    id: 'cs-3',
    signalKey: 'credibilitySignals',
    text: 'Does the website feature endorsements, partner badges, or "as seen in" mentions?',
    answerType: 'yes-no',
    options: [
      { value: 'yes', label: 'Yes', scoreContribution: 1.0 },
      { value: 'no', label: 'No', scoreContribution: 0.0 },
    ],
    cycle: 'quarterly',
    weight: 0.25,
  },
  {
    id: 'cs-4',
    signalKey: 'credibilitySignals',
    text: 'Have any new credibility signals (certifications, awards, partnerships) been added this month?',
    answerType: 'yes-no',
    options: [
      { value: 'yes', label: 'Yes', scoreContribution: 1.0 },
      { value: 'no', label: 'No', scoreContribution: 0.3 },
    ],
    cycle: 'monthly',
    weight: 0.2,
  },
]
