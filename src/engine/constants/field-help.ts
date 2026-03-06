export const FIELD_HELP: Record<string, string> = {
  // Business basics
  businessName: 'The official business or brand name as it should appear in AI responses.',
  primaryCategory: 'The main business type — what would someone search for to find this business? (e.g., "Personal Injury Attorney", "Italian Restaurant", "Plumber"). This is used to generate AI test prompts and content.',
  secondaryCategory: 'An optional secondary business type if the business spans multiple areas (e.g., a law firm might be "Personal Injury Attorney" + "Workers Compensation Attorney").',
  audience: 'Who is the ideal customer? (e.g., "Small business owners", "Homeowners in Dallas", "Enterprise IT managers").',
  geoScope: 'The geographic area the business serves.',
  revenueModel: 'How the business generates revenue.',
  regulated: 'Whether the business operates in a regulated industry (healthcare, finance, legal, etc.).',

  // Signal scores - "how to assess" guidance
  entityClarity: 'Can AI models clearly identify and describe your business? Search for your brand on ChatGPT/Gemini/Claude — does it know what you do? Score 1 if AI has no idea, 5 if it accurately describes your business.',
  brandMentions: 'How often is your brand mentioned across the web? Check Google for your brand name in quotes. Score 1 if almost no mentions exist, 5 if you appear frequently on third-party sites.',
  comparisonPresence: 'Does your business appear in "best of" or comparison content? Search "[your category] vs" or "best [your category]". Score 1 if you never appear, 5 if you are included in multiple comparison articles.',
  faqCoverage: 'Does your website have comprehensive FAQ content? Score 1 if no FAQs exist, 5 if you have detailed FAQs covering common customer questions.',
  structuredData: 'Does your website use schema markup (JSON-LD)? Check with Google\'s Rich Results Test. Score 1 if none exists, 5 if you have Organization, Service, FAQ, and Review schema.',
  reviews: 'How is your review presence? Check Google, Yelp, G2, etc. Score 1 if fewer than 5 reviews, 5 if 50+ reviews with 4+ star average across platforms.',
  authoritySignals: 'Are there indicators that your business is an authority? (Guest posts, speaking events, industry publications.) Score 1 if none, 5 if strong authority presence.',
  citations: 'Is your business cited or referenced by independent sources? Score 1 if no third-party citations, 5 if regularly cited by industry publications, news, or research.',
  gbpCompleteness: 'How complete is your Google Business Profile? Score 1 if not claimed, 5 if fully optimized with photos, hours, Q&A, posts, and categories.',
  knowledgeGraphSignals: 'Does your business appear in Google\'s Knowledge Panel? Score 1 if no knowledge panel, 5 if you have a complete knowledge panel with key details.',
  messagingConsistency: 'Is your brand messaging consistent across your website, social media, directories, and profiles? Score 1 if messaging varies widely, 5 if consistent everywhere.',
  credibilitySignals: 'Do you have trust indicators like certifications, awards, or endorsements? Score 1 if none, 5 if multiple certifications, awards, and endorsements are displayed.',

  // AI Visibility
  chatgptInclusion: 'Ask ChatGPT 10 relevant questions about your service category and area. Count how many responses mention your business. That percentage is your approximate inclusion rate.',
  geminiInclusion: 'Ask Google Gemini 10 relevant questions about your service category and area. Count how many responses mention your business. That percentage is your approximate inclusion rate.',
  claudeInclusion: 'Ask Claude 10 relevant questions about your service category and area. Count how many responses mention your business. That percentage is your approximate inclusion rate.',
  competitorDominance: 'Of the AI responses that mention businesses in your category, what percentage mention competitors instead of you? High dominance means competitors are getting recommended more.',

  // Focus
  focusTier: 'Tier 1 (Foundation): New to GEO, needs basics like entity definitions and schema. Tier 2 (Growth): Basics done, building authority and citations. Tier 3 (Optimization): Strong presence, fine-tuning for maximum visibility.',
  primaryBottleneck: 'The single biggest issue holding back AI visibility right now.',
  competitors: 'List your main competitors that appear in AI responses for your category.',
}
