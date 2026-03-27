/**
 * LLM prompt templates for business info extraction.
 */

// Import the categories list at build time — this gets embedded in the prompt
// so the LLM picks from known categories when possible.
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

let categoriesList: string[] = []
try {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const catFile = readFileSync(
    resolve(__dirname, '../../src/engine/constants/business-categories.ts'),
    'utf-8',
  )
  // Extract the string array values from the TS file
  const matches = catFile.match(/'([^']+)'/g)
  if (matches) {
    categoriesList = matches.map((m) => m.replace(/'/g, ''))
  }
} catch {
  // Categories list not available — LLM will infer freely
}

export function buildExtractionPrompt(markdown: string, url: string): string {
  const categoriesSection = categoriesList.length > 0
    ? `\nKNOWN CATEGORIES (pick from this list when a good match exists, or use a custom value if none fits):\n${categoriesList.join(', ')}\n`
    : ''

  return `You are analyzing a business website to extract structured information for a GEO (Generative Engine Optimization) assessment tool.

Given the following website content (in markdown format) from ${url}, extract the business information below.

RULES:
- Only extract what is clearly stated or strongly implied. Do not guess or hallucinate.
- For each field, assign a confidence level: "high" (clearly stated), "medium" (strongly implied), "low" (inferred/uncertain).
- For primaryCategory and secondaryCategory: pick from the KNOWN CATEGORIES list when possible. If no good match, use a descriptive category name.
- For geoScope: return one of "Local", "Regional", "National", "International", or "" if unclear.
- For revenueModel: return one of "B2B", "B2C", "SaaS", "E-commerce", "Services", "Other", or "" if unclear.
- For regulated: return "Yes", "No", "Partially", or "" if unclear.
- For audience: describe the target customer/client in 1-2 sentences.
- For location: extract the city, state/province, or region if mentioned. Return "" if no location found.
${categoriesSection}
WEBSITE CONTENT:
${markdown.slice(0, 15000)}

Respond with ONLY valid JSON in this exact format:
{
  "businessName": "string",
  "primaryCategory": "string",
  "secondaryCategory": "string",
  "audience": "string",
  "geoScope": "Local|Regional|National|International|",
  "revenueModel": "B2B|B2C|SaaS|E-commerce|Services|Other|",
  "regulated": "Yes|No|Partially|",
  "services": ["string array of main services/products offered"],
  "differentiators": ["string array of unique selling points"],
  "location": "string (city, state/region)",
  "confidence": {
    "businessName": "high|medium|low",
    "primaryCategory": "high|medium|low",
    "secondaryCategory": "high|medium|low",
    "audience": "high|medium|low",
    "geoScope": "high|medium|low",
    "revenueModel": "high|medium|low",
    "regulated": "high|medium|low",
    "location": "high|medium|low"
  }
}`
}
