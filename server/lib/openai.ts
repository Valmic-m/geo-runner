/**
 * OpenAI GPT-4o-mini client for structured business info extraction.
 */

import OpenAI from 'openai'
import { buildExtractionPrompt } from './prompts'

export interface LLMBusinessAnalysis {
  businessName: string
  primaryCategory: string
  secondaryCategory: string
  audience: string
  geoScope: string
  revenueModel: string
  regulated: string
  services: string[]
  differentiators: string[]
  location: string
  confidence: Record<string, 'high' | 'medium' | 'low'>
}

let client: OpenAI | null = null

function getClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not set in environment')
    }
    client = new OpenAI({ apiKey })
  }
  return client
}

export async function extractBusinessInfo(
  markdown: string,
  url: string,
): Promise<LLMBusinessAnalysis> {
  const openai = getClient()
  const prompt = buildExtractionPrompt(markdown, url)

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.1,
    max_tokens: 1000,
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new Error('OpenAI returned empty response')
  }

  const parsed = JSON.parse(content) as LLMBusinessAnalysis

  // Validate required fields exist
  return {
    businessName: parsed.businessName || '',
    primaryCategory: parsed.primaryCategory || '',
    secondaryCategory: parsed.secondaryCategory || '',
    audience: parsed.audience || '',
    geoScope: parsed.geoScope || '',
    revenueModel: parsed.revenueModel || '',
    regulated: parsed.regulated || '',
    services: Array.isArray(parsed.services) ? parsed.services : [],
    differentiators: Array.isArray(parsed.differentiators) ? parsed.differentiators : [],
    location: parsed.location || '',
    confidence: parsed.confidence || {},
  }
}
