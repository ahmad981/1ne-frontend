/**
 * Adapters: map backend capability JSON to frontend Marketing & Branding UI types.
 * Backend marketing_concepts returns { items: [ { title, description } ] } or { gradeLevel, concepts: [ { title, description } ] }
 */
import type { MarketingConcept } from './marketingUtils'

function ensureArray<T = string>(v: unknown): T[] {
  if (Array.isArray(v)) return v as T[]
  return []
}

function ensureString(v: unknown, fallback = ''): string {
  if (typeof v === 'string') return v
  return fallback
}

/** Backend: items[] with title, description OR concepts[] with title, description; optional gradeLevel */
export function mapMarketingConceptsResponseToUI(
  result: Record<string, unknown>,
  gradeLevel: string
): MarketingConcept[] {
  const items = ensureArray<Record<string, unknown>>(result.items || result.concepts)
  const level = ensureString(result.gradeLevel) || gradeLevel
  return items.map((item, i) => ({
    id: `mc-${i}-${ensureString(item.title).slice(0, 20).replace(/\s+/g, '-')}`,
    concept: ensureString(item.title),
    description: ensureString(item.description),
    gradeLevel: level,
    keyPrinciples: [],
    examples: [],
    activities: [],
    realWorldApplications: [],
    tools: [],
  }))
}
