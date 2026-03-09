import type { ArtifactType } from '@/types/artifacts'
import type { IndustryVertical } from '@/engine/constants/industry-weights'
import { getVerticalForCategory } from '@/engine/constants/industry-weights'

interface VerticalPromptAddition {
  faqTopics?: string[]
  comparisonCriteria?: string[]
  entityFocusAreas?: string[]
  authorityTopics?: string[]
  reviewPlatforms?: string[]
}

const VERTICAL_ADDITIONS: Partial<Record<IndustryVertical, VerticalPromptAddition>> = {
  'legal': {
    faqTopics: ['free consultation availability', 'contingency fees', 'case evaluation process', 'attorney credentials', 'case timelines', 'settlement vs trial'],
    comparisonCriteria: ['case results', 'fee structure', 'practice areas', 'attorney experience', 'client communication', 'online reviews'],
    entityFocusAreas: ['practice areas', 'bar admissions', 'notable case results', 'years of experience'],
    authorityTopics: ['legal guides for specific practice areas', 'know your rights articles', 'recent legal developments'],
    reviewPlatforms: ['Google', 'Avvo', 'Martindale-Hubbell', 'Lawyers.com', 'Yelp'],
  },
  'healthcare': {
    faqTopics: ['insurance accepted', 'appointment scheduling', 'telehealth availability', 'new patient process', 'after-hours care', 'patient portal'],
    comparisonCriteria: ['specialties', 'insurance networks', 'wait times', 'patient reviews', 'facility quality', 'credentials'],
    entityFocusAreas: ['board certifications', 'specialties', 'hospital affiliations', 'accepted insurance plans'],
    authorityTopics: ['patient education', 'condition guides', 'treatment options', 'preventive care'],
    reviewPlatforms: ['Google', 'Healthgrades', 'Vitals', 'WebMD', 'Zocdoc'],
  },
  'local-services': {
    faqTopics: ['service area coverage', 'pricing and estimates', 'emergency availability', 'licensing and insurance', 'warranty on work', 'scheduling process'],
    comparisonCriteria: ['pricing transparency', 'response time', 'licensing', 'warranty', 'reviews', 'years in business'],
    entityFocusAreas: ['service areas', 'license numbers', 'insurance coverage', 'years of operation'],
    authorityTopics: ['seasonal maintenance guides', 'DIY vs professional advice', 'common problem solutions'],
    reviewPlatforms: ['Google', 'Yelp', 'Angi', 'HomeAdvisor', 'BBB'],
  },
  'saas-tech': {
    faqTopics: ['pricing plans', 'free trial or demo', 'integrations', 'data security', 'onboarding process', 'API availability', 'customer support channels'],
    comparisonCriteria: ['features', 'pricing', 'ease of use', 'integrations', 'scalability', 'customer support', 'security certifications'],
    entityFocusAreas: ['target market', 'key integrations', 'security certifications', 'company size and funding'],
    authorityTopics: ['industry trend analysis', 'best practices guides', 'ROI calculators', 'case studies with metrics'],
    reviewPlatforms: ['G2', 'Capterra', 'TrustRadius', 'Product Hunt', 'Gartner'],
  },
  'ecommerce-retail': {
    faqTopics: ['shipping policies', 'return and exchange policy', 'payment methods', 'order tracking', 'sizing guides', 'bulk ordering'],
    comparisonCriteria: ['product quality', 'pricing', 'shipping speed', 'return policy', 'customer service', 'selection'],
    entityFocusAreas: ['product categories', 'brand story', 'sustainability practices', 'unique selling proposition'],
    authorityTopics: ['buying guides', 'product care guides', 'trend reports', 'gift guides'],
    reviewPlatforms: ['Google', 'Trustpilot', 'Amazon', 'BBB', 'Sitejabber'],
  },
  'professional-services': {
    faqTopics: ['engagement process', 'pricing structure', 'typical project timeline', 'team qualifications', 'reporting and communication', 'success metrics'],
    comparisonCriteria: ['expertise depth', 'industry experience', 'pricing model', 'case studies', 'team size', 'communication style'],
    entityFocusAreas: ['core services', 'industry specializations', 'notable clients', 'team credentials'],
    authorityTopics: ['industry insights', 'methodology frameworks', 'benchmark reports', 'how-to guides'],
    reviewPlatforms: ['Google', 'Clutch', 'UpCity', 'LinkedIn', 'GoodFirms'],
  },
  'food-dining': {
    faqTopics: ['reservations', 'dietary accommodations', 'private events', 'delivery options', 'parking', 'menu changes'],
    comparisonCriteria: ['cuisine quality', 'ambiance', 'service', 'price range', 'location', 'special dietary options'],
    entityFocusAreas: ['cuisine type', 'price range', 'signature dishes', 'chef background'],
    authorityTopics: ['recipes', 'food sourcing stories', 'seasonal menu highlights', 'behind-the-scenes content'],
    reviewPlatforms: ['Google', 'Yelp', 'TripAdvisor', 'OpenTable', 'DoorDash'],
  },
  'real-estate': {
    faqTopics: ['buying process', 'selling timeline', 'commission structure', 'market conditions', 'home valuation', 'first-time buyer programs'],
    comparisonCriteria: ['transaction volume', 'market knowledge', 'communication', 'negotiation track record', 'marketing strategy', 'client reviews'],
    entityFocusAreas: ['service areas', 'transaction volume', 'specialties', 'designations and certifications'],
    authorityTopics: ['market reports', 'neighborhood guides', 'home buying tips', 'investment analysis'],
    reviewPlatforms: ['Google', 'Zillow', 'Realtor.com', 'Yelp', 'Facebook'],
  },
  'beauty-wellness': {
    faqTopics: ['booking process', 'cancellation policy', 'service descriptions', 'preparation instructions', 'pricing', 'gift cards'],
    comparisonCriteria: ['service quality', 'cleanliness', 'pricing', 'ambiance', 'staff expertise', 'product brands used'],
    entityFocusAreas: ['services offered', 'certifications', 'product lines', 'years of experience'],
    authorityTopics: ['beauty tips', 'product recommendations', 'seasonal care guides', 'trend spotlights'],
    reviewPlatforms: ['Google', 'Yelp', 'StyleSeat', 'Booksy', 'Facebook'],
  },
  'education': {
    faqTopics: ['enrollment process', 'class schedules', 'pricing and financial aid', 'instructor qualifications', 'learning outcomes', 'age requirements'],
    comparisonCriteria: ['curriculum quality', 'instructor credentials', 'student outcomes', 'pricing', 'flexibility', 'accreditation'],
    entityFocusAreas: ['programs offered', 'accreditations', 'student outcomes', 'instructor qualifications'],
    authorityTopics: ['learning tips', 'study guides', 'career pathway content', 'skill development articles'],
    reviewPlatforms: ['Google', 'Facebook', 'Course Report', 'Niche', 'GreatSchools'],
  },
}

export function getVerticalPromptAddition(category: string, artifactType: ArtifactType): string {
  const vertical = getVerticalForCategory(category)
  const additions = VERTICAL_ADDITIONS[vertical]
  if (!additions) return ''

  switch (artifactType) {
    case 'faq-set':
      return additions.faqTopics
        ? `\n\nIndustry-specific topics to include:\n${additions.faqTopics.map((t) => `- ${t}`).join('\n')}`
        : ''
    case 'comparison-page-outline':
      return additions.comparisonCriteria
        ? `\n\nIndustry-relevant comparison criteria:\n${additions.comparisonCriteria.map((c) => `- ${c}`).join('\n')}`
        : ''
    case 'entity-definition-block':
      return additions.entityFocusAreas
        ? `\n\nKey areas to emphasize for this industry:\n${additions.entityFocusAreas.map((a) => `- ${a}`).join('\n')}`
        : ''
    case 'authority-article-outline':
      return additions.authorityTopics
        ? `\n\nRecommended authority topics for this industry:\n${additions.authorityTopics.map((t) => `- ${t}`).join('\n')}`
        : ''
    case 'review-request-script':
      return additions.reviewPlatforms
        ? `\n\nPriority review platforms for this industry:\n${additions.reviewPlatforms.map((p) => `- ${p}`).join('\n')}`
        : ''
    default:
      return ''
  }
}
