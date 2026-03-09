import type { SignalKey } from '@/types/snapshot'

export type IndustryVertical =
  | 'local-services'
  | 'legal'
  | 'healthcare'
  | 'saas-tech'
  | 'ecommerce-retail'
  | 'professional-services'
  | 'food-dining'
  | 'real-estate'
  | 'beauty-wellness'
  | 'education'
  | 'events-entertainment'
  | 'travel-hospitality'
  | 'construction'
  | 'general'

export interface IndustryWeightProfile {
  vertical: IndustryVertical
  label: string
  weights: Record<SignalKey, number>
}

// Default balanced weights (same as current READINESS_WEIGHTS)
const DEFAULT_WEIGHTS: Record<SignalKey, number> = {
  entityClarity: 0.15,
  brandMentions: 0.08,
  comparisonPresence: 0.10,
  faqCoverage: 0.10,
  structuredData: 0.08,
  reviews: 0.08,
  authoritySignals: 0.12,
  citations: 0.10,
  gbpCompleteness: 0.05,
  knowledgeGraphSignals: 0.05,
  messagingConsistency: 0.04,
  credibilitySignals: 0.05,
}

export const INDUSTRY_WEIGHT_PROFILES: IndustryWeightProfile[] = [
  {
    vertical: 'general',
    label: 'General / Default',
    weights: DEFAULT_WEIGHTS,
  },
  {
    vertical: 'local-services',
    label: 'Local Services (Plumber, HVAC, etc.)',
    weights: {
      entityClarity: 0.10,
      brandMentions: 0.06,
      comparisonPresence: 0.06,
      faqCoverage: 0.08,
      structuredData: 0.10,
      reviews: 0.18,
      authoritySignals: 0.06,
      citations: 0.06,
      gbpCompleteness: 0.18,
      knowledgeGraphSignals: 0.04,
      messagingConsistency: 0.04,
      credibilitySignals: 0.04,
    },
  },
  {
    vertical: 'legal',
    label: 'Legal',
    weights: {
      entityClarity: 0.14,
      brandMentions: 0.08,
      comparisonPresence: 0.08,
      faqCoverage: 0.10,
      structuredData: 0.06,
      reviews: 0.12,
      authoritySignals: 0.12,
      citations: 0.10,
      gbpCompleteness: 0.06,
      knowledgeGraphSignals: 0.04,
      messagingConsistency: 0.04,
      credibilitySignals: 0.06,
    },
  },
  {
    vertical: 'healthcare',
    label: 'Healthcare',
    weights: {
      entityClarity: 0.12,
      brandMentions: 0.06,
      comparisonPresence: 0.06,
      faqCoverage: 0.10,
      structuredData: 0.08,
      reviews: 0.14,
      authoritySignals: 0.10,
      citations: 0.08,
      gbpCompleteness: 0.08,
      knowledgeGraphSignals: 0.04,
      messagingConsistency: 0.04,
      credibilitySignals: 0.10,
    },
  },
  {
    vertical: 'saas-tech',
    label: 'SaaS / Technology',
    weights: {
      entityClarity: 0.18,
      brandMentions: 0.10,
      comparisonPresence: 0.14,
      faqCoverage: 0.08,
      structuredData: 0.06,
      reviews: 0.06,
      authoritySignals: 0.14,
      citations: 0.12,
      gbpCompleteness: 0.02,
      knowledgeGraphSignals: 0.04,
      messagingConsistency: 0.04,
      credibilitySignals: 0.02,
    },
  },
  {
    vertical: 'ecommerce-retail',
    label: 'E-commerce / Retail',
    weights: {
      entityClarity: 0.12,
      brandMentions: 0.10,
      comparisonPresence: 0.12,
      faqCoverage: 0.08,
      structuredData: 0.12,
      reviews: 0.14,
      authoritySignals: 0.08,
      citations: 0.08,
      gbpCompleteness: 0.04,
      knowledgeGraphSignals: 0.06,
      messagingConsistency: 0.04,
      credibilitySignals: 0.02,
    },
  },
  {
    vertical: 'professional-services',
    label: 'Professional Services (Agency, Consulting)',
    weights: {
      entityClarity: 0.16,
      brandMentions: 0.08,
      comparisonPresence: 0.10,
      faqCoverage: 0.08,
      structuredData: 0.06,
      reviews: 0.08,
      authoritySignals: 0.14,
      citations: 0.12,
      gbpCompleteness: 0.04,
      knowledgeGraphSignals: 0.04,
      messagingConsistency: 0.06,
      credibilitySignals: 0.04,
    },
  },
  {
    vertical: 'food-dining',
    label: 'Food & Dining',
    weights: {
      entityClarity: 0.08,
      brandMentions: 0.08,
      comparisonPresence: 0.08,
      faqCoverage: 0.06,
      structuredData: 0.10,
      reviews: 0.22,
      authoritySignals: 0.04,
      citations: 0.04,
      gbpCompleteness: 0.20,
      knowledgeGraphSignals: 0.04,
      messagingConsistency: 0.04,
      credibilitySignals: 0.02,
    },
  },
  {
    vertical: 'real-estate',
    label: 'Real Estate',
    weights: {
      entityClarity: 0.12,
      brandMentions: 0.08,
      comparisonPresence: 0.08,
      faqCoverage: 0.10,
      structuredData: 0.08,
      reviews: 0.14,
      authoritySignals: 0.10,
      citations: 0.08,
      gbpCompleteness: 0.10,
      knowledgeGraphSignals: 0.04,
      messagingConsistency: 0.04,
      credibilitySignals: 0.04,
    },
  },
  {
    vertical: 'beauty-wellness',
    label: 'Beauty & Wellness',
    weights: {
      entityClarity: 0.10,
      brandMentions: 0.06,
      comparisonPresence: 0.08,
      faqCoverage: 0.08,
      structuredData: 0.08,
      reviews: 0.20,
      authoritySignals: 0.06,
      citations: 0.06,
      gbpCompleteness: 0.16,
      knowledgeGraphSignals: 0.04,
      messagingConsistency: 0.04,
      credibilitySignals: 0.04,
    },
  },
  {
    vertical: 'education',
    label: 'Education & Training',
    weights: {
      entityClarity: 0.14,
      brandMentions: 0.08,
      comparisonPresence: 0.10,
      faqCoverage: 0.12,
      structuredData: 0.06,
      reviews: 0.12,
      authoritySignals: 0.12,
      citations: 0.08,
      gbpCompleteness: 0.04,
      knowledgeGraphSignals: 0.06,
      messagingConsistency: 0.04,
      credibilitySignals: 0.04,
    },
  },
  {
    vertical: 'events-entertainment',
    label: 'Events & Entertainment',
    weights: {
      entityClarity: 0.10,
      brandMentions: 0.10,
      comparisonPresence: 0.10,
      faqCoverage: 0.06,
      structuredData: 0.08,
      reviews: 0.18,
      authoritySignals: 0.08,
      citations: 0.06,
      gbpCompleteness: 0.10,
      knowledgeGraphSignals: 0.06,
      messagingConsistency: 0.04,
      credibilitySignals: 0.04,
    },
  },
  {
    vertical: 'travel-hospitality',
    label: 'Travel & Hospitality',
    weights: {
      entityClarity: 0.10,
      brandMentions: 0.08,
      comparisonPresence: 0.10,
      faqCoverage: 0.08,
      structuredData: 0.10,
      reviews: 0.20,
      authoritySignals: 0.06,
      citations: 0.06,
      gbpCompleteness: 0.12,
      knowledgeGraphSignals: 0.04,
      messagingConsistency: 0.04,
      credibilitySignals: 0.02,
    },
  },
  {
    vertical: 'construction',
    label: 'Construction & Trades',
    weights: {
      entityClarity: 0.10,
      brandMentions: 0.06,
      comparisonPresence: 0.06,
      faqCoverage: 0.08,
      structuredData: 0.08,
      reviews: 0.16,
      authoritySignals: 0.08,
      citations: 0.06,
      gbpCompleteness: 0.14,
      knowledgeGraphSignals: 0.04,
      messagingConsistency: 0.04,
      credibilitySignals: 0.10,
    },
  },
]

// Map business categories to industry verticals
const CATEGORY_TO_VERTICAL: Record<string, IndustryVertical> = {
  // Legal
  'Personal Injury Attorney': 'legal',
  'Criminal Defense Attorney': 'legal',
  'Family Law Attorney': 'legal',
  'Immigration Attorney': 'legal',
  'Estate Planning Attorney': 'legal',
  'Bankruptcy Attorney': 'legal',
  'Employment Attorney': 'legal',
  'Real Estate Attorney': 'legal',
  'Business Attorney': 'legal',
  'Tax Attorney': 'legal',
  'Law Firm': 'legal',

  // Healthcare
  'Dentist': 'healthcare',
  'Orthodontist': 'healthcare',
  'Chiropractor': 'healthcare',
  'Physical Therapist': 'healthcare',
  'Dermatologist': 'healthcare',
  'Pediatrician': 'healthcare',
  'Optometrist': 'healthcare',
  'Veterinarian': 'healthcare',
  'Mental Health Counselor': 'healthcare',
  'Primary Care Physician': 'healthcare',
  'Urgent Care Center': 'healthcare',
  'Medical Spa': 'healthcare',
  'Plastic Surgeon': 'healthcare',
  'Pharmacy': 'healthcare',
  'Home Health Care': 'healthcare',

  // Home Services
  'Plumber': 'local-services',
  'Electrician': 'local-services',
  'HVAC Contractor': 'local-services',
  'Roofing Contractor': 'local-services',
  'General Contractor': 'local-services',
  'Landscaper': 'local-services',
  'Pest Control Service': 'local-services',
  'Cleaning Service': 'local-services',
  'Moving Company': 'local-services',
  'Painter': 'local-services',
  'Handyman': 'local-services',
  'Locksmith': 'local-services',
  'Pool Service': 'local-services',
  'Garage Door Service': 'local-services',
  'Window Installation': 'local-services',

  // Automotive
  'Auto Repair Shop': 'local-services',
  'Car Dealership': 'local-services',
  'Auto Body Shop': 'local-services',
  'Tire Shop': 'local-services',
  'Oil Change Service': 'local-services',
  'Car Wash': 'local-services',
  'Towing Service': 'local-services',

  // Food & Dining
  'Restaurant': 'food-dining',
  'Italian Restaurant': 'food-dining',
  'Mexican Restaurant': 'food-dining',
  'Japanese Restaurant': 'food-dining',
  'Chinese Restaurant': 'food-dining',
  'Thai Restaurant': 'food-dining',
  'Indian Restaurant': 'food-dining',
  'Pizza Restaurant': 'food-dining',
  'Bakery': 'food-dining',
  'Coffee Shop': 'food-dining',
  'Catering Service': 'food-dining',
  'Food Truck': 'food-dining',
  'Bar & Grill': 'food-dining',

  // Professional Services
  'Accounting Firm': 'professional-services',
  'CPA': 'professional-services',
  'Financial Advisor': 'professional-services',
  'Insurance Agency': 'professional-services',
  'Marketing Agency': 'professional-services',
  'Digital Marketing Agency': 'professional-services',
  'SEO Agency': 'professional-services',
  'Web Design Agency': 'professional-services',
  'Graphic Design Studio': 'professional-services',
  'PR Agency': 'professional-services',
  'IT Services Company': 'professional-services',
  'Managed IT Services': 'professional-services',
  'Cybersecurity Firm': 'professional-services',
  'Consulting Firm': 'professional-services',
  'Staffing Agency': 'professional-services',
  'Recruitment Agency': 'professional-services',

  // Real Estate
  'Real Estate Agent': 'real-estate',
  'Real Estate Brokerage': 'real-estate',
  'Property Management Company': 'real-estate',
  'Mortgage Broker': 'real-estate',
  'Home Inspector': 'real-estate',
  'Title Company': 'real-estate',

  // Beauty & Wellness
  'Hair Salon': 'beauty-wellness',
  'Barber Shop': 'beauty-wellness',
  'Nail Salon': 'beauty-wellness',
  'Day Spa': 'beauty-wellness',
  'Massage Therapist': 'beauty-wellness',
  'Yoga Studio': 'beauty-wellness',
  'Gym': 'beauty-wellness',
  'Personal Trainer': 'beauty-wellness',
  'Tattoo Shop': 'beauty-wellness',

  // Education
  'Tutoring Service': 'education',
  'Driving School': 'education',
  'Dance Studio': 'education',
  'Music School': 'education',
  'Preschool': 'education',
  'Daycare Center': 'education',
  'Test Prep Service': 'education',
  'Online Course Provider': 'education',
  'Language School': 'education',

  // Technology / SaaS
  'SaaS Company': 'saas-tech',
  'Software Development Company': 'saas-tech',
  'Mobile App Development': 'saas-tech',
  'Cloud Services Provider': 'saas-tech',
  'Data Analytics Company': 'saas-tech',
  'AI/ML Company': 'saas-tech',
  'E-commerce Platform': 'saas-tech',
  'CRM Software': 'saas-tech',
  'Project Management Tool': 'saas-tech',
  'Cybersecurity Software': 'saas-tech',

  // Retail & E-commerce
  'Clothing Store': 'ecommerce-retail',
  'Jewelry Store': 'ecommerce-retail',
  'Furniture Store': 'ecommerce-retail',
  'Pet Store': 'ecommerce-retail',
  'Florist': 'ecommerce-retail',
  'Gift Shop': 'ecommerce-retail',
  'Sporting Goods Store': 'ecommerce-retail',
  'Electronics Store': 'ecommerce-retail',
  'Bookstore': 'ecommerce-retail',
  'Thrift Store': 'ecommerce-retail',
  'Online Retailer': 'ecommerce-retail',

  // Events & Entertainment
  'Wedding Planner': 'events-entertainment',
  'Event Venue': 'events-entertainment',
  'Photographer': 'events-entertainment',
  'Videographer': 'events-entertainment',
  'DJ Service': 'events-entertainment',
  'Photo Booth Rental': 'events-entertainment',
  'Party Rental': 'events-entertainment',

  // Travel & Hospitality
  'Hotel': 'travel-hospitality',
  'Bed and Breakfast': 'travel-hospitality',
  'Travel Agency': 'travel-hospitality',
  'Tour Operator': 'travel-hospitality',
  'Vacation Rental': 'travel-hospitality',

  // Construction
  'Construction Company': 'construction',
  'Architecture Firm': 'construction',
  'Interior Designer': 'construction',
  'Surveyor': 'construction',
  'Civil Engineer': 'construction',
  'Demolition Contractor': 'construction',

  // Manufacturing
  'Manufacturing Company': 'professional-services',
  'Custom Fabrication': 'professional-services',
  'Print Shop': 'local-services',
  'Packaging Company': 'professional-services',

  // Other
  'Storage Facility': 'local-services',
  'Funeral Home': 'local-services',
  'Dry Cleaner': 'local-services',
  'Laundromat': 'local-services',
  'Printing Service': 'local-services',
  'Sign Company': 'local-services',
  'Security Company': 'local-services',
  'Nonprofit Organization': 'professional-services',
  'Church': 'general',
  'Community Center': 'general',
  'Charity': 'general',
}

export function getVerticalForCategory(category: string): IndustryVertical {
  return CATEGORY_TO_VERTICAL[category] ?? 'general'
}

export function getWeightsForCategory(category: string): Record<SignalKey, number> {
  const vertical = getVerticalForCategory(category)
  const profile = INDUSTRY_WEIGHT_PROFILES.find((p) => p.vertical === vertical)
  return profile?.weights ?? DEFAULT_WEIGHTS
}

export function getVerticalLabel(category: string): string {
  const vertical = getVerticalForCategory(category)
  const profile = INDUSTRY_WEIGHT_PROFILES.find((p) => p.vertical === vertical)
  return profile?.label ?? 'General / Default'
}
