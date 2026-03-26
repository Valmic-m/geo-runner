import { describe, it, expect } from 'vitest'
import { parseWebsiteContent } from './website-parser'

describe('parseWebsiteContent', () => {
  it('returns error for empty content', () => {
    const result = parseWebsiteContent('')
    expect(result.success).toBe(false)
    expect(result.errors).toContain('Website content is required')
  })

  it('returns error for whitespace-only content', () => {
    const result = parseWebsiteContent('   ')
    expect(result.success).toBe(false)
  })

  it('detects known business categories in content', () => {
    const result = parseWebsiteContent('We are the best Plumber in the area. Our Electrician services are top notch.')
    expect(result.success).toBe(true)
    expect(result.data!.detectedCategories).toContain('Plumber')
    expect(result.data!.detectedCategories).toContain('Electrician')
  })

  it('detects promotional tone', () => {
    const result = parseWebsiteContent('We are the best and leading provider. Our top-rated premier service is unmatched.')
    expect(result.success).toBe(true)
    expect(result.data!.tone).toContain('promotional')
  })

  it('detects neutral tone', () => {
    const result = parseWebsiteContent('Our company provides plumbing services to residential customers in the greater metro area.')
    expect(result.success).toBe(true)
    expect(result.data!.tone).toContain('neutral')
  })

  it('detects schema markup from HTML', () => {
    const html = '<script type="application/ld+json">{"@type":"Organization","name":"Test"}</script>'
    const result = parseWebsiteContent('Test content', html)

    expect(result.success).toBe(true)
    expect(result.data!.hasSchemaMarkup).toBe(true)
    expect(result.data!.schemaTypes).toContain('Organization')
  })

  it('detects FAQ content', () => {
    const html = '<h2>FAQ</h2><script type="application/ld+json">{"@type":"FAQPage"}</script>'
    const text = 'FAQ\nQ: What services do you offer?\nA: We offer plumbing.'
    const result = parseWebsiteContent(text, html)

    expect(result.success).toBe(true)
    expect(result.data!.hasFaqContent).toBe(true)
  })

  it('detects review/testimonial content', () => {
    const result = parseWebsiteContent('What our clients say: Great service! 5 stars rated.')
    expect(result.success).toBe(true)
    expect(result.data!.hasReviewContent).toBe(true)
    expect(result.data!.reviewMentionCount).toBeGreaterThan(0)
  })

  it('detects local focus from address tags', () => {
    const html = '<address>123 Main St, San Diego, CA 92101</address>'
    const result = parseWebsiteContent('Local plumbing service', html)

    expect(result.success).toBe(true)
    expect(result.data!.hasLocalFocus).toBe(true)
    expect(result.data!.detectedLocations.length).toBeGreaterThan(0)
  })

  it('infers revenue model', () => {
    const result = parseWebsiteContent('Our services include consultation. Contact us for a free estimate. Schedule an appointment today.')
    expect(result.success).toBe(true)
    expect(result.data!.revenueModelIndicator).toBe('Services')
  })

  it('detects certifications and awards', () => {
    const result = parseWebsiteContent('We are certified and licensed. Winner of the 2024 award for excellence. Recognized by the industry.')
    expect(result.success).toBe(true)
    expect(result.data!.hasCertifications).toBe(true)
    expect(result.data!.hasAwards).toBe(true)
  })

  it('detects comparison content', () => {
    const result = parseWebsiteContent('See how we compare vs competitors. Our comparison shows clear advantages.')
    expect(result.success).toBe(true)
    expect(result.data!.hasComparisonContent).toBe(true)
  })

  it('extracts business name from HTML metadata', () => {
    const html = '<meta property="og:site_name" content="Acme Services"><title>Acme Services | Home</title>'
    const result = parseWebsiteContent('Welcome to our site', html)

    expect(result.success).toBe(true)
    expect(result.data!.businessNameCandidates).toContain('Acme Services')
  })

  it('extracts social profiles from HTML', () => {
    const html = '<a href="https://linkedin.com/company/acme">LinkedIn</a><a href="https://facebook.com/acme">Facebook</a>'
    const result = parseWebsiteContent('Follow us on social media', html)

    expect(result.success).toBe(true)
    expect(result.data!.socialProfiles.length).toBeGreaterThanOrEqual(2)
  })

  it('analyzes schema completeness', () => {
    const html = `
      <script type="application/ld+json">{"@type":"Organization","name":"Test","contactPoint":{},"sameAs":[]}</script>
      <script type="application/ld+json">{"@type":"FAQPage"}</script>
    `
    const result = parseWebsiteContent('Test', html)

    expect(result.success).toBe(true)
    expect(result.data!.schemaCompleteness.hasOrganization).toBe(true)
    expect(result.data!.schemaCompleteness.hasFaqPage).toBe(true)
    expect(result.data!.schemaCompleteness.score).toBeGreaterThan(0)
  })

  it('analyzes content depth', () => {
    const html = '<h1>Title</h1><h2>Section</h2><p>Words here</p><img src="test.jpg" alt="test"><a href="/about">About</a>'
    const result = parseWebsiteContent('Title Section Words here', html)

    expect(result.success).toBe(true)
    expect(result.data!.contentDepth.headingCount).toBeGreaterThanOrEqual(2)
    expect(result.data!.contentDepth.imageCount).toBeGreaterThanOrEqual(1)
    expect(result.data!.contentDepth.internalLinkCount).toBeGreaterThanOrEqual(1)
  })
})
