// Common business categories aligned with Google Business Profile categories
// Grouped by industry for easier browsing
export const BUSINESS_CATEGORIES = [
  // Legal
  'Personal Injury Attorney',
  'Criminal Defense Attorney',
  'Family Law Attorney',
  'Immigration Attorney',
  'Estate Planning Attorney',
  'Bankruptcy Attorney',
  'Employment Attorney',
  'Real Estate Attorney',
  'Business Attorney',
  'Tax Attorney',
  'Law Firm',

  // Medical / Healthcare
  'Dentist',
  'Orthodontist',
  'Chiropractor',
  'Physical Therapist',
  'Dermatologist',
  'Pediatrician',
  'Optometrist',
  'Veterinarian',
  'Mental Health Counselor',
  'Primary Care Physician',
  'Urgent Care Center',
  'Medical Spa',
  'Plastic Surgeon',
  'Pharmacy',
  'Home Health Care',

  // Home Services
  'Plumber',
  'Electrician',
  'HVAC Contractor',
  'Roofing Contractor',
  'General Contractor',
  'Landscaper',
  'Pest Control Service',
  'Cleaning Service',
  'Moving Company',
  'Painter',
  'Handyman',
  'Locksmith',
  'Pool Service',
  'Garage Door Service',
  'Window Installation',

  // Automotive
  'Auto Repair Shop',
  'Car Dealership',
  'Auto Body Shop',
  'Tire Shop',
  'Oil Change Service',
  'Car Wash',
  'Towing Service',

  // Food & Dining
  'Restaurant',
  'Italian Restaurant',
  'Mexican Restaurant',
  'Japanese Restaurant',
  'Chinese Restaurant',
  'Thai Restaurant',
  'Indian Restaurant',
  'Pizza Restaurant',
  'Bakery',
  'Coffee Shop',
  'Catering Service',
  'Food Truck',
  'Bar & Grill',

  // Professional Services
  'Accounting Firm',
  'CPA',
  'Financial Advisor',
  'Insurance Agency',
  'Marketing Agency',
  'Digital Marketing Agency',
  'SEO Agency',
  'Web Design Agency',
  'Graphic Design Studio',
  'PR Agency',
  'IT Services Company',
  'Managed IT Services',
  'Cybersecurity Firm',
  'Consulting Firm',
  'Staffing Agency',
  'Recruitment Agency',

  // Real Estate
  'Real Estate Agent',
  'Real Estate Brokerage',
  'Property Management Company',
  'Mortgage Broker',
  'Home Inspector',
  'Title Company',

  // Beauty & Wellness
  'Hair Salon',
  'Barber Shop',
  'Nail Salon',
  'Day Spa',
  'Massage Therapist',
  'Yoga Studio',
  'Gym',
  'Personal Trainer',
  'Tattoo Shop',

  // Education & Training
  'Tutoring Service',
  'Driving School',
  'Dance Studio',
  'Music School',
  'Preschool',
  'Daycare Center',
  'Test Prep Service',
  'Online Course Provider',
  'Language School',

  // Technology / SaaS
  'SaaS Company',
  'Software Development Company',
  'Mobile App Development',
  'Cloud Services Provider',
  'Data Analytics Company',
  'AI/ML Company',
  'E-commerce Platform',
  'CRM Software',
  'Project Management Tool',
  'Cybersecurity Software',

  // Retail & E-commerce
  'Clothing Store',
  'Jewelry Store',
  'Furniture Store',
  'Pet Store',
  'Florist',
  'Gift Shop',
  'Sporting Goods Store',
  'Electronics Store',
  'Bookstore',
  'Thrift Store',
  'Online Retailer',

  // Events & Entertainment
  'Wedding Planner',
  'Event Venue',
  'Photographer',
  'Videographer',
  'DJ Service',
  'Photo Booth Rental',
  'Party Rental',

  // Travel & Hospitality
  'Hotel',
  'Bed and Breakfast',
  'Travel Agency',
  'Tour Operator',
  'Vacation Rental',

  // Construction & Trades
  'Construction Company',
  'Architecture Firm',
  'Interior Designer',
  'Surveyor',
  'Civil Engineer',
  'Demolition Contractor',

  // Manufacturing
  'Manufacturing Company',
  'Custom Fabrication',
  'Print Shop',
  'Packaging Company',

  // Nonprofit & Community
  'Nonprofit Organization',
  'Church',
  'Community Center',
  'Charity',

  // Other
  'Storage Facility',
  'Funeral Home',
  'Dry Cleaner',
  'Laundromat',
  'Printing Service',
  'Sign Company',
  'Security Company',
] as const

export type BusinessCategory = (typeof BUSINESS_CATEGORIES)[number]
