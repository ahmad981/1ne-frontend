import { useState, useCallback, useRef, useEffect } from 'react'
import { StreamEvent } from '../api/types'

interface UseTemplateStreamReturn {
  content: string // Accumulated JSON content from streaming
  formattedContent: string // Accumulated formatted text (like Activity)
  isStreaming: boolean
  error: string | null
  executionId: string | null
  startStream: (slug: string, data: Record<string, any>) => void
  stopStream: () => void
  reset: () => void
}

/**
 * Custom hook for handling template execution streaming via Server-Sent Events (SSE)
 * 
 * This hook manages the streaming connection, accumulates content chunks,
 * and handles all streaming events (meta, content, done, error).
 */
  // Extract formatted text from JSON chunk incrementally (like Activity)
  // Extract text values character-by-character as they appear - show content word-by-word
  // IMPORTANT: inputData parameter allows access to standards from input (not just output JSON)
  // CRITICAL: This function is called on EVERY chunk, so it must build incrementally
  // It should only add NEW content, not rebuild everything from scratch
// Helper: normalize TOON/partial JSON into valid JSON string
// - Quotes unquoted keys (including non-ASCII)
// - Removes trailing commas before closing braces/brackets
// - Balances missing closing braces
const normalizeToJson = (raw: string): string => {
  if (!raw) return ''
  let s = raw.trim()
  // Remove trailing commas before } or ]
  s = s.replace(/,\s*([}\]])/g, '$1')
  // Quote unquoted keys after { , [ or start
  s = s.replace(/([{\[,]\s*)([^\s"':{}[\]]+)\s*:/g, '$1"$2":')
  // Quote key at very start if missing
  s = s.replace(/^([^\s"'{\[]+)\s*:/, '{"$1":')
  // Balance braces
  const open = (s.match(/\{/g) || []).length
  const close = (s.match(/\}/g) || []).length
  if (open > close) {
    s += '}'.repeat(open - close)
  }
  return s
}

const buildFormattedFromParsed = (parsed: any): string => {
  let formatted = ''
  if (!parsed || typeof parsed !== 'object') return formatted

  // CRITICAL: Extract ALL fields that exist, even if incomplete (for streaming)
  // This ensures all available fields are shown, not just overview
  // IMPORTANT: Clean and validate all content before adding to formatted string
  
  // Helper to clean text (remove malformed JSON/TOON artifacts)
  const cleanText = (text: string): string => {
    if (!text || typeof text !== 'string') return ''
    // Remove common malformed patterns
    return text
      .replace(/^[:\s,{}[\]]+/, '')  // Remove leading delimiters
      .replace(/[:\s,{}[\]]+$/, '')  // Remove trailing delimiters
      .replace(/\s+/g, ' ')  // Normalize whitespace
      .trim()
  }
  
  if (parsed.overview) {
    const overview = cleanText(String(parsed.overview))
    if (overview && overview.length > 10) {
      formatted += `## OVERVIEW\n\n${overview}\n\n`
    }
  }

  // Extract learning goals - handle various field name variations
  const goals = parsed.learning_goals || parsed._goals || parsed.learningals || parsed.learning_go
  if (goals) {
    if (Array.isArray(goals) && goals.length > 0) {
      formatted += `## LEARNING OBJECTIVE\n\n`
      goals.forEach((g: string) => { 
        if (g && g.trim()) formatted += `- ${g.trim()}\n` 
      })
      formatted += `\n`
    } else if (typeof goals === 'string' && goals.trim()) {
      // Handle case where goals is a string instead of array
      formatted += `## LEARNING OBJECTIVE\n\n- ${goals.trim()}\n\n`
    }
  }

  // Extract materials
  if (parsed.materials) {
    if (Array.isArray(parsed.materials) && parsed.materials.length > 0) {
      formatted += `## REQUIRED MATERIALS\n\n`
      parsed.materials.forEach((m: any) => {
        const material = cleanText(String(m))
        if (material && material.length > 1 && !material.match(/^[:\s,{}[\]]+$/)) {
          formatted += `- ${material}\n`
        }
      })
      formatted += `\n`
    } else if (typeof parsed.materials === 'string') {
      const material = cleanText(parsed.materials)
      if (material && material.length > 1) {
        formatted += `## REQUIRED MATERIALS\n\n- ${material}\n\n`
      }
    }
  }

  // Extract steps - clean and validate each step
  if (parsed.steps && Array.isArray(parsed.steps) && parsed.steps.length > 0) {
    parsed.steps.forEach((step: any) => {
      if (step && typeof step === 'object') {
        const title = step.title ? cleanText(String(step.title)) : ''
        const desc = step.description ? cleanText(String(step.description)) : ''
        
        // Only add step if we have valid content
        if (title && title.length > 2 && !title.match(/^[:\s,{}[\]]+$/)) {
          formatted += `## ${title.toUpperCase()}\n\n`
          if (desc && desc.length > 5) {
            formatted += `${desc}\n\n`
          } else {
            formatted += `\n`
          }
        } else if (desc && desc.length > 10 && !desc.match(/^[:\s,{}[\]]+$/)) {
          // If no valid title but have description, use description as heading
          const shortTitle = desc.substring(0, 50).replace(/\.$/, '')
          formatted += `## ${shortTitle.toUpperCase()}\n\n${desc}\n\n`
        }
      }
    })
  }

  // Extract differentiation
  if (parsed.differentiation) {
    if (typeof parsed.differentiation === 'string') {
      const diff = cleanText(parsed.differentiation)
      if (diff && diff.length > 10 && !diff.match(/^[:\s,{}[\]]+$/)) {
        formatted += `## DIFFERENTIATION\n\n${diff}\n\n`
      }
    } else if (Array.isArray(parsed.differentiation) && parsed.differentiation.length > 0) {
      formatted += `## DIFFERENTIATION\n\n`
      parsed.differentiation.forEach((d: any) => {
        const diffItem = cleanText(String(d))
        if (diffItem && diffItem.length > 5 && !diffItem.match(/^[:\s,{}[\]]+$/)) {
          formatted += `- ${diffItem}\n`
        }
      })
      formatted += `\n`
    }
  }

  // Extract assessment
  if (parsed.assessment) {
    formatted += `## ASSESSMENT\n\n`
    if (typeof parsed.assessment === 'object') {
      const checks = parsed.assessment.checks_for_understanding || parsed.assessment.checks_understanding || parsed.assessment.checks
      if (checks && Array.isArray(checks) && checks.length > 0) {
        checks.forEach((c: any) => {
          const check = cleanText(String(c))
          if (check && check.length > 5 && !check.match(/^[:\s,{}[\]]+$/)) {
            formatted += `- ${check}\n`
          }
        })
      }
      if (parsed.assessment.rubric) {
        const rubric = cleanText(String(parsed.assessment.rubric))
        if (rubric && rubric.length > 5) {
          formatted += `\n**Rubric:** ${rubric}\n\n`
        }
      }
    } else if (typeof parsed.assessment === 'string') {
      const assessment = cleanText(parsed.assessment)
      if (assessment && assessment.length > 5 && !assessment.match(/^[:\s,{}[\]]+$/)) {
        formatted += `${assessment}\n\n`
      }
    }
  }

  // Extract teacher notes
  const teacherNotes = parsed.teacher_notes || parsed.teacher || parsed.teacher_note
  if (teacherNotes) {
    formatted += `## TEACHER NOTES\n\n`
    if (Array.isArray(teacherNotes)) {
      teacherNotes.forEach((n: any) => {
        const note = cleanText(String(n))
        if (note && note.length > 5 && !note.match(/^[:\s,{}[\]]+$/)) {
          formatted += `- ${note}\n`
        }
      })
    } else if (typeof teacherNotes === 'string') {
      const note = cleanText(teacherNotes)
      if (note && note.length > 5 && !note.match(/^[:\s,{}[\]]+$/)) {
        formatted += `${note}\n`
      }
    }
    formatted += `\n`
  }

  // Extract bloom alignment
  const bloomAlignment = parsed.bloom_alignment || parsed.bloom || parsed.bloom_taxonomy
  if (bloomAlignment) {
    if (Array.isArray(bloomAlignment) && bloomAlignment.length > 0) {
      formatted += `## BLOOM ALIGNMENT\n\n`
      bloomAlignment.forEach((item: any) => {
        if (item && typeof item === 'object') {
          const level = item.level ? cleanText(String(item.level)) : ''
          const desc = item.description ? cleanText(String(item.description)) : ''
          if (level && level.length > 1 && desc && desc.length > 5) {
            formatted += `- **${level}**: ${desc}\n`
          }
        } else if (typeof item === 'string') {
          const itemText = cleanText(item)
          if (itemText && itemText.length > 5 && !itemText.match(/^[:\s,{}[\]]+$/)) {
            formatted += `- ${itemText}\n`
          }
        }
      })
      formatted += `\n`
    } else if (typeof bloomAlignment === 'string') {
      const bloom = cleanText(bloomAlignment)
      if (bloom && bloom.length > 5 && !bloom.match(/^[:\s,{}[\]]+$/)) {
        formatted += `## BLOOM ALIGNMENT\n\n${bloom}\n\n`
      }
    }
  }

  return formatted
}

// Very loose TOON extractor for malformed/unquoted content
// Tries to pull key sections even if JSON parsing fails
const looseParseToon = (raw: string): any => {
  const obj: any = {}
  if (!raw) return obj
  // overview
  const ovMatch = raw.match(/overview\s*:\s*"?(.*?)(?:(?<!\\)",|\n|,|$)/s)
  if (ovMatch && ovMatch[1]) obj.overview = ovMatch[1].trim().replace(/\\"/g, '"')

  // goals variations - handle incomplete arrays (for streaming)
  // CRITICAL: Match even if array is not closed (for streaming)
  const goalsMatch = raw.match(/(learning_goals|learning_go|_goals|learningals)\s*:\s*\[(.*?)(?:\]|$)/s)
  if (goalsMatch && goalsMatch[2]) {
    // Handle incomplete arrays - extract items even if array is not closed
    const arrayContent = goalsMatch[2]
    const parts: string[] = []
    // Extract quoted strings (complete or incomplete) - handle streaming
    const quotedMatches = arrayContent.matchAll(/"([^"]*(?:\\.[^"]*)*)"?/g)
    for (const match of quotedMatches) {
      if (match[1] && match[1].trim()) {
        parts.push(match[1].replace(/\\"/g, '"').replace(/\\n/g, '\n').trim())
      }
    }
    // Also try unquoted strings (for malformed TOON) - split by comma
    if (parts.length === 0) {
      const unquotedParts = arrayContent.split(',').map(p => {
        const cleaned = p.trim().replace(/^"+|"+$/g, '').replace(/\\"/g, '"')
        return cleaned
      }).filter(p => p.length > 0)
      if (unquotedParts.length > 0) {
        parts.push(...unquotedParts)
      }
    }
    if (parts.length) obj.learning_goals = parts
  }

  // materials - handle incomplete arrays (for streaming)
  // CRITICAL: Match even if array is not closed (for streaming)
  const matMatch = raw.match(/materials\s*:\s*\[(.*?)(?:\]|$)/s)
  if (matMatch && matMatch[1]) {
    // Handle incomplete arrays - extract items even if array is not closed
    const arrayContent = matMatch[1]
    const parts: string[] = []
    // Extract quoted strings (complete or incomplete) - handle streaming
    const quotedMatches = arrayContent.matchAll(/"([^"]*(?:\\.[^"]*)*)"?/g)
    for (const match of quotedMatches) {
      if (match[1] && match[1].trim()) {
        parts.push(match[1].replace(/\\"/g, '"').replace(/\\n/g, '\n').trim())
      }
    }
    // Also try unquoted strings (for malformed TOON) - split by comma
    if (parts.length === 0) {
      const unquotedParts = arrayContent.split(',').map(p => {
        const cleaned = p.trim().replace(/^"+|"+$/g, '').replace(/\\"/g, '"')
        return cleaned
      }).filter(p => p.length > 0)
      if (unquotedParts.length > 0) {
        parts.push(...unquotedParts)
      }
    }
    if (parts.length) obj.materials = parts
  }

  // steps (titles/descriptions) - handle incomplete arrays (for streaming)
  // CRITICAL: Match even if array is not closed (for streaming)
  // Also handle malformed cases like "rsteps:[:" or "steps:[{"
  const stepsMatch = raw.match(/(?:^|\s)(?:r)?steps\s*:\s*\[(.*?)(?:\]|$)/s)
  if (stepsMatch && stepsMatch[1]) {
    // Handle incomplete arrays - extract steps even if array is not closed
    const stepsRaw = stepsMatch[1]
    // Split by { to find step objects (even if incomplete)
    // Filter out empty or very short chunks that are just delimiters
    const stepChunks = stepsRaw.split(/{/).filter(chunk => chunk.trim().length > 2)
    const steps: any[] = []
    stepChunks.forEach((chunk, idx) => {
      // Skip first empty chunk if any
      if (idx === 0 && !chunk.trim()) return
      
      // Extract title - handle various formats
      let title = ''
      const titlePatterns = [
        /title\s*:\s*"([^"]*(?:\\.[^"]*)*)"/,  // Quoted title
        /title\s*:\s*"([^"]*)/,  // Incomplete quoted title
        /title\s*:\s*([^,\n}]+)/,  // Unquoted title
      ]
      for (const pattern of titlePatterns) {
        const match = chunk.match(pattern)
        if (match && match[1] && match[1].trim()) {
          title = match[1].trim().replace(/\\"/g, '"').replace(/\\n/g, '\n')
          break
        }
      }
      
      // Extract description - handle various formats
      let desc = ''
      const descPatterns = [
        /description\s*:\s*"([^"]*(?:\\.[^"]*)*)"/,  // Quoted description
        /description\s*:\s*"([^"]*)/,  // Incomplete quoted description
        /description\s*:\s*([^,\n}]+)/,  // Unquoted description
      ]
      for (const pattern of descPatterns) {
        const match = chunk.match(pattern)
        if (match && match[1] && match[1].trim()) {
          desc = match[1].trim().replace(/\\"/g, '"').replace(/\\n/g, '\n')
          break
        }
      }
      
      // Only add step if we have meaningful content
      if (title && title.length > 1 && !title.match(/^[:\s,{}[\]]+$/)) {
        steps.push({ title, description: desc || '' })
      } else if (desc && desc.length > 5 && !desc.match(/^[:\s,{}[\]]+$/)) {
        // If no title but have description, use description as title
        steps.push({ title: desc.substring(0, 50), description: desc })
      }
    })
    if (steps.length) obj.steps = steps
  }

  // differentiation
  const diffMatch = raw.match(/differenti\w*\s*:\s*"?(.*?)(?:(?<!\\)",|\n|,|$)/s)
  if (diffMatch && diffMatch[1]) obj.differentiation = diffMatch[1].trim().replace(/\\"/g, '"')

  // assessment
  const assessMatch = raw.match(/assessment\s*:\s*{(.*?)}/s)
  if (assessMatch && assessMatch[1]) {
    const aRaw = assessMatch[1]
    const checksMatch = aRaw.match(/checks?_for?_understanding\s*:\s*\[(.*?)\]/s)
    const checks = checksMatch && checksMatch[1]
      ? checksMatch[1].split(/"\s*,\s*"|,\s*/).map(p => p.replace(/^"+|"+$/g, '').trim()).filter(Boolean)
      : []
    const rubricMatch = aRaw.match(/rubric\s*:\s*"?(.*?)(?:(?<!\\)",|\n|,|$)/s)
    obj.assessment = {}
    if (checks.length) obj.assessment.checks_for_understanding = checks
    if (rubricMatch && rubricMatch[1]) obj.assessment.rubric = rubricMatch[1].trim().replace(/\\"/g, '"')
  }

  // teacher notes
  const teacherMatch = raw.match(/teacher(?:_notes)?\s*:\s*"?(.*?)(?:(?<!\\)",|\n|,|$)/s)
  if (teacherMatch && teacherMatch[1]) obj.teacher_notes = [teacherMatch[1].trim().replace(/\\"/g, '"')]

  // bloom
  const bloomMatch = raw.match(/bloom_alignment|bloom\s*{(.*?)}/s)
  if (bloomMatch && bloomMatch[1]) {
    const bRaw = bloomMatch[1]
    const levelMatch = bRaw.match(/level\s*:\s*"?(.*?)(?:(?<!\\)",|\n|,|$)/s)
    const descMatch = bRaw.match(/description\s*:\s*"?(.*?)(?:(?<!\\)",|\n|,|$)/s)
    if (levelMatch && descMatch) {
      obj.bloom_alignment = [{ level: levelMatch[1].trim().replace(/\\"/g, '"'), description: descMatch[1].trim().replace(/\\"/g, '"') }]
    }
  }

  return obj
}

const extractFormattedText = (jsonContent: string, inputData?: Record<string, any>): string => {
  // Start with empty string - we'll build it incrementally
  // IMPORTANT: Extract fresh from current JSON/TOON state on every call
  // CRITICAL: Show content even if JSON/TOON is incomplete (for word-by-word streaming)
  // NOTE: Backend sends TOON format chunks, but we extract as if it's JSON (TOON is similar enough)
    
    try {
      // If content is empty, return empty (but allow incomplete JSON/TOON)
      if (!jsonContent || jsonContent.trim().length === 0) {
        return ''
      }
      
      // Allow incomplete JSON/TOON - don't require starting with '{'
      // This allows extraction even when content is still streaming in
      let formattedText = ''
      
      // First try: normalize to JSON and parse; if successful, build formatted immediately
      // CRITICAL: This runs on EVERY chunk, so it extracts incrementally as content streams
      // IMPORTANT: Don't return early - continue with regex extraction to get ALL fields
      let parsedFormatted = ''
      try {
        const normalized = normalizeToJson(jsonContent)
        const parsed = JSON.parse(normalized)
        parsedFormatted = buildFormattedFromParsed(parsed)
        // CRITICAL: Always use parsed formatted content - it extracts ALL available fields
        // The parsed object will have all fields that are available in the current chunk
        // Even if incomplete, we show what we have (word-by-word streaming)
        if (parsedFormatted && parsedFormatted.trim().length > 0) {
          formattedText = parsedFormatted
          // Return immediately - buildFormattedFromParsed extracts ALL available fields
          // No need for regex extraction if JSON parse succeeded
          return formattedText
        }
      } catch {
        // If JSON parse fails (incomplete/malformed), fall back to loose parsing
        try {
          const looseParsed = looseParseToon(jsonContent)
          parsedFormatted = buildFormattedFromParsed(looseParsed)
          // CRITICAL: Always use parsed formatted content - it extracts ALL available fields
          // The loose parsed object will have all fields that are available in the current chunk
          // Even if incomplete, we show what we have (word-by-word streaming)
          if (parsedFormatted && parsedFormatted.trim().length > 0) {
            formattedText = parsedFormatted
            // Return immediately - buildFormattedFromParsed extracts ALL available fields
            // No need for regex extraction if loose parse succeeded
            return formattedText
          }
        } catch {
          // ignore, fall back to regex extraction
        }
      }

      // Note: Loose parsing already handled above in the catch block
      // Continue with regex extraction below to get ALL fields incrementally
      
      // DEBUG: Log content format if substantial (first time only)
      if (jsonContent.length > 50 && formattedText.length === 0) {
        const preview = jsonContent.substring(0, 100)
        if (!preview.includes('"overview"') && !preview.includes('overview')) {
          // Might be TOON format or different structure - try to extract anyway
          console.log('Content preview (might be TOON):', preview)
        }
      }
  
  // Helper: Extract text value from JSON/TOON key (handles incomplete strings and unquoted keys)
  // CRITICAL: Must handle incomplete JSON/TOON for word-by-word streaming
  const extractValue = (key: string): string => {
    let regex: RegExp
    let match: RegExpMatchArray | null
    // Pattern 1: Complete string with closing quote (JSON format)
    regex = new RegExp(`"${key}"\\s*:\\s*"([^"]*(?:\\\\.[^"]*)*)"`, 's')
    match = jsonContent.match(regex)
    if (match && match[1]) {
      return match[1].replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\\\/g, '\\')
    }
    // Pattern 2: TOON format (unquoted key with quoted value)
    regex = new RegExp(`${key}\\s*:\\s*"([^"]*(?:\\\\.[^"]*)*)"`, 's')
    match = jsonContent.match(regex)
    if (match && match[1]) {
      return match[1].replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\\\/g, '\\')
    }
    // Pattern 3: Incomplete string (missing closing quote) JSON
    regex = new RegExp(`"${key}"\\s*:\\s*"([^"]*(?:\\\\.[^"]*)*)`, 's')
    match = jsonContent.match(regex)
    if (match && match[1]) {
      return match[1].replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\\\/g, '\\')
    }
    // Pattern 4: Incomplete string TOON (unquoted key)
    regex = new RegExp(`${key}\\s*:\\s*"([^"]*(?:\\\\.[^"]*)*)`, 's')
    match = jsonContent.match(regex)
    if (match && match[1]) {
      return match[1].replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\\\/g, '\\')
    }
    // Pattern 5: Unquoted value until comma/brace/newline (very loose)
    regex = new RegExp(`${key}\\s*:\\s*([^,\\n\\r}\\]]+)`, 's')
    match = jsonContent.match(regex)
    if (match && match[1]) {
      return match[1].trim().replace(/\\n/g, '\n')
    }
    return ''
  }
  
  // Extract Overview - show text as it streams (even incomplete)
  // CRITICAL: Show content word-by-word as it streams in, don't wait for complete JSON
  // Extract incrementally - show content character-by-character
  if (jsonContent.includes('"overview"') || jsonContent.includes('overview')) {
    // Extract overview text - handle incomplete JSON with multiple patterns
    let overviewText = ''
    
    // Pattern 1: Complete string with closing quote
    let overviewMatch = jsonContent.match(/"overview"\s*:\s*"([^"]*(?:\\.[^"]*)*)"\s*[,}]/s)
    if (overviewMatch && overviewMatch[1]) {
      overviewText = overviewMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\\\/g, '\\')
    } else {
      // Pattern 2: Incomplete string (no closing quote yet) - for streaming
      overviewMatch = jsonContent.match(/"overview"\s*:\s*"([^"]*(?:\\.[^"]*)*)/s)
      if (overviewMatch && overviewMatch[1]) {
        overviewText = overviewMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\\\/g, '\\')
      }
    }
    
    // Show content as soon as we have ANY characters (word-by-word streaming)
    if (overviewText && overviewText.length > 0) {
      // Add heading once
      if (!formattedText.includes('## OVERVIEW')) {
        formattedText += `## OVERVIEW\n\n`
      }
      
      // CRITICAL: Always show the latest overview text (incremental updates)
      // Replace existing overview section with new (longer) content
      const overviewSectionRegex = /## OVERVIEW\n\n(.*?)(?=\n\n## |$)/s
      const existingMatch = formattedText.match(overviewSectionRegex)
      const existingOverview = existingMatch ? existingMatch[1] : ''
      
      // Only update if we have more content (incremental streaming)
      if (overviewText.length > existingOverview.length) {
        if (existingOverview) {
          formattedText = formattedText.replace(overviewSectionRegex, `## OVERVIEW\n\n${overviewText}`)
        } else {
          formattedText += overviewText
        }
        
        // Add spacing if content is substantial
        if (overviewText.length > 10) {
          formattedText += '\n\n'
        }
      }
    }
  }
  
  // Extract Learning Goals - show items as they appear character-by-character
  // IMPORTANT: Only show heading AFTER we have content (word-by-word like Activity)
  if (jsonContent.includes('learning_goals')) {
    const goalsIndex = jsonContent.indexOf('"learning_goals"')
    if (goalsIndex !== -1) {
      const bracketIndex = jsonContent.indexOf('[', goalsIndex)
      if (bracketIndex !== -1) {
        // Extract array content (even if incomplete - no closing bracket)
        let arrayEnd = bracketIndex + 1
        let depth = 1
        while (arrayEnd < jsonContent.length && depth > 0) {
          const char = jsonContent[arrayEnd]
          if (char === '[') depth++
          if (char === ']') depth--
          if (depth === 0) break
          arrayEnd++
        }
        const arrayContent = jsonContent.substring(bracketIndex + 1, arrayEnd)
        
        // Extract all strings - use pattern that matches even incomplete strings
        let searchIndex = 0
        let hasContent = false
        let goalsText = ''
        
        while (searchIndex < arrayContent.length) {
          const quoteIndex = arrayContent.indexOf('"', searchIndex)
          if (quoteIndex === -1) break
          
          // Find end of string (closing quote or end of content)
          let stringEnd = quoteIndex + 1
          while (stringEnd < arrayContent.length) {
            const char = arrayContent[stringEnd]
            if (char === '"' && arrayContent[stringEnd - 1] !== '\\') {
              // Found closing quote
              const text = arrayContent.substring(quoteIndex + 1, stringEnd)
              if (text) {
                hasContent = true
                goalsText += `- ${text}\n`
              }
              searchIndex = stringEnd + 1
              break
            }
            if (char === ',' || char === ']') {
              // Incomplete string at end
              const text = arrayContent.substring(quoteIndex + 1, stringEnd)
              if (text) {
                hasContent = true
                goalsText += `- ${text}\n`
              }
              searchIndex = arrayContent.length
              break
            }
            stringEnd++
          }
          if (stringEnd >= arrayContent.length) {
            // Incomplete string at very end
            const text = arrayContent.substring(quoteIndex + 1)
            if (text) {
              hasContent = true
              goalsText += `- ${text}\n`
            }
            break
          }
        }
        
        // Show content as soon as we have ANY content (word-by-word streaming)
        // Don't wait for substantial content - show incrementally
        if (hasContent && goalsText.trim().length > 0) {
          if (!formattedText.includes('## LEARNING OBJECTIVE') && !formattedText.includes('## Learning Goals')) {
            formattedText += `## LEARNING OBJECTIVE\n\n`
          }
          // Replace existing goals with new (longer) content for incremental updates
          const goalsSectionRegex = /## LEARNING OBJECTIVE\n\n(.*?)(?=\n\n## |$)/s
          if (goalsSectionRegex.test(formattedText)) {
            formattedText = formattedText.replace(goalsSectionRegex, `## LEARNING OBJECTIVE\n\n${goalsText}`)
          } else {
            formattedText += goalsText
          }
          formattedText += `\n`
        }
      }
    }
  }
  
  // Extract Materials - show items as they appear character-by-character
  // IMPORTANT: Only show heading AFTER we have content (word-by-word like Activity)
  if (jsonContent.includes('materials')) {
    const materialsIndex = jsonContent.indexOf('"materials"')
    if (materialsIndex !== -1) {
      const bracketIndex = jsonContent.indexOf('[', materialsIndex)
      if (bracketIndex !== -1) {
        let arrayEnd = bracketIndex + 1
        let depth = 1
        while (arrayEnd < jsonContent.length && depth > 0) {
          const char = jsonContent[arrayEnd]
          if (char === '[') depth++
          if (char === ']') depth--
          if (depth === 0) break
          arrayEnd++
        }
        const arrayContent = jsonContent.substring(bracketIndex + 1, arrayEnd)
        const materialPattern = /"([^"]*)/g
        let materialMatch
        let hasContent = false
        let materialsText = ''
        while ((materialMatch = materialPattern.exec(arrayContent)) !== null) {
          if (materialMatch[1] && materialMatch[1].trim().length > 0) {
            hasContent = true
            materialsText += `- ${materialMatch[1]}\n`
          }
        }
        
        // Only show heading and content if we have substantial content (at least 5 chars per material)
        // This prevents headings from appearing before content streams in
        if (hasContent && materialsText.trim().length >= 5) {
          if (!formattedText.includes('## REQUIRED MATERIALS') && !formattedText.includes('## Materials')) {
            formattedText += `## REQUIRED MATERIALS\n\n`
          }
          formattedText += materialsText
          formattedText += `\n`
        }
      }
    }
  }
  
  // Extract Steps - show steps and descriptions as they stream character-by-character
  // IMPORTANT: Only show heading AFTER we have content (word-by-word like Activity)
  if (jsonContent.includes('"steps"')) {
    // Find all step objects - extract title and description (even incomplete)
    const steps: Array<{title: string, description: string}> = []
    // Match step objects - be very flexible with incomplete descriptions
    const stepPattern = /"title"\s*:\s*"([^"]+)"[^}]*"description"\s*:\s*"([^"]*)"?/g
    let stepMatch: RegExpExecArray | null
    while ((stepMatch = stepPattern.exec(jsonContent)) !== null) {
      const existing = steps.find(s => s.title === stepMatch![1])
      if (!existing) {
        steps.push({ title: stepMatch[1], description: stepMatch[2] || '' })
      } else if (stepMatch[2] && stepMatch[2].length > existing.description.length) {
        // Update with longer description (more content streamed)
        existing.description = stepMatch[2]
      }
    }
    // Also check for incomplete description at the end
    const incompleteDescMatch = jsonContent.match(/"description"\s*:\s*"([^"]*)$/)
    if (incompleteDescMatch && incompleteDescMatch[1]) {
      // Find the last step and update its description
      if (steps.length > 0) {
        const lastStep = steps[steps.length - 1]
        if (incompleteDescMatch[1].length > lastStep.description.length) {
          lastStep.description = incompleteDescMatch[1]
        }
      }
    }
    
    // Only show heading and steps if we have substantial content (at least one step with description)
    // This prevents headings from appearing before content streams in
    const hasSubstantialSteps = steps.length > 0 && steps.some(s => 
      (s.title && s.title.trim().length > 0) || 
      (s.description && s.description.trim().length >= 10)
    )
    if (hasSubstantialSteps) {
      if (!formattedText.includes('## Steps')) {
        formattedText += `## Steps\n\n`
    }
    // Format steps
    steps.forEach((step, i) => {
        if (step.title || (step.description && step.description.trim().length >= 10)) {
          formattedText += `${i + 1}. **${step.title || 'Step'}**`
          if (step.description && step.description.trim().length >= 10) {
            formattedText += `\n${step.description}`
          }
      formattedText += `\n\n`
        }
    })
    }
  }
  
  // Extract Differentiation - only show heading AFTER we have content
  if (jsonContent.includes('differentiation')) {
    const diffSection = jsonContent.match(/"differentiation"\s*:\s*\[(.*?)(?:\]|$)/s)
    if (diffSection) {
      let hasContent = false
      let diffText = ''
      const itemMatches = diffSection[1].matchAll(/"([^"]+)"/g)
      for (const match of itemMatches) {
        if (match[1] && match[1].trim().length > 0) {
          hasContent = true
          diffText += `- ${match[1]}\n`
        }
      }
      if (hasContent && diffText.trim().length > 0) {
        if (!formattedText.includes('## DIFFERENTIATION')) {
          formattedText += `## DIFFERENTIATION STRATEGIES\n\n`
        }
        formattedText += diffText
        formattedText += `\n`
      }
    }
  }
  
  // Extract Assessment - only show heading AFTER we have content
  if (jsonContent.includes('assessment')) {
    let hasAssessmentContent = false
    let assessmentText = ''
    
    const checksSection = jsonContent.match(/"checks_for_understanding"\s*:\s*\[(.*?)(?:\]|$)/s)
    if (checksSection) {
      const checkMatches = checksSection[1].matchAll(/"([^"]+)"/g)
      for (const match of checkMatches) {
        if (match[1] && match[1].trim().length > 0) {
          hasAssessmentContent = true
          if (!assessmentText.includes('### Checks for Understanding')) {
            assessmentText += `### Checks for Understanding\n\n`
          }
          assessmentText += `- ${match[1]}\n`
        }
      }
      if (assessmentText) assessmentText += `\n`
    }
    const rubricMatch = jsonContent.match(/"rubric"\s*:\s*"([^"]+)"/)
    if (rubricMatch && rubricMatch[1] && rubricMatch[1].trim().length > 0) {
      hasAssessmentContent = true
      assessmentText += `### Rubric\n\n${rubricMatch[1]}\n\n`
    }
    
    if (hasAssessmentContent && assessmentText.trim().length > 0) {
      if (!formattedText.includes('## ASSESSMENT')) {
        formattedText += `## ASSESSMENT\n\n`
      }
      formattedText += assessmentText
    }
  }
  
  // Extract Teacher Notes - only show heading AFTER we have content
  if (jsonContent.includes('teacher_notes')) {
    const notesSection = jsonContent.match(/"teacher_notes"\s*:\s*\[(.*?)(?:\]|$)/s)
    if (notesSection) {
      let hasContent = false
      let notesText = ''
      const noteMatches = notesSection[1].matchAll(/"([^"]+)"/g)
      for (const match of noteMatches) {
        if (match[1] && match[1].trim().length > 0) {
          hasContent = true
          notesText += `- ${match[1]}\n`
        }
      }
      if (hasContent && notesText.trim().length > 0) {
        if (!formattedText.includes('## TEACHER NOTES')) {
          formattedText += `## TEACHER NOTES\n\n`
        }
        formattedText += notesText
        formattedText += `\n`
      }
    }
  }
  
  // Extract Standards Aligned (like Activity) - get from input data, not output JSON
  // IMPORTANT: Standard comes from input_data, not from LLM output
  const hasStandardInInput = inputData?.standard || inputData?.standards_framework
  const standardFromInput = hasStandardInInput ? (inputData.standard || inputData.standards_framework) : null
  const subjectFromInput = inputData?.subject || extractValue('subject') || 'Subject'
  const gradeBandFromInput = inputData?.grade_band || extractValue('grade_band') || 'Grade'
  const constraintsFromInput = inputData?.constraints || inputData?.differentiation_notes || extractValue('constraints') || extractValue('differentiation_notes') || 'None specified'
  
  // Also check output JSON for standard (in case LLM includes it)
  const standardFromOutput = extractValue('standard') || extractValue('standards_framework')
  const standard = standardFromInput || standardFromOutput
  const subject = subjectFromInput
  const grade_band = gradeBandFromInput
  const constraints = constraintsFromInput
  
  // Show STANDARDS ALIGNED section if we have standard or subject/grade (like Activity)
  // IMPORTANT: Show standards section FIRST (from input), then stream rest of content word-by-word
  // This ensures standards appear immediately, but doesn't block streaming of other content
  const hasStandardValue = standard && standard.trim().length > 0
  const hasRealSubjectGrade = subject && grade_band && (subject !== 'Subject' || grade_band !== 'Grade')
  
  // Check if standard is recognized (basic validation)
  const commonStandardPrefixes = ['CCSS', 'UK', 'IB', 'AUSTRALIAN', 'CANADIAN', 'SINGAPORE', 'NEXT_GEN']
  const isStandardRecognized = hasStandardValue && commonStandardPrefixes.some(prefix => 
    standard.toUpperCase().startsWith(prefix)
  )
  
  // CRITICAL: Add standards section at the END, AFTER all other content
  // This ensures other content streams word-by-word first, then standards appear
  // Only add standards if we have substantial other content OR we have a standard
  const standardsSectionAdded = formattedText.includes('## STANDARDS ALIGNED')
  
  // IMPORTANT: Only add standards AFTER we have substantial other content streaming
  // This prevents standards from blocking the word-by-word streaming of other sections
  // CRITICAL: Wait for at least 500 characters of other content before showing standards
  // This ensures other content streams word-by-word first, then standards appear at the end
  const hasOtherContent = formattedText.length > 500 || 
    (formattedText.includes('## OVERVIEW') && formattedText.length > 200) ||
    (formattedText.includes('## LEARNING') && formattedText.length > 200)
  
  // Only show standards if we have substantial other content (ensures word-by-word streaming works first)
  if ((hasStandardValue && hasOtherContent) || (hasRealSubjectGrade && hasOtherContent && !standardsSectionAdded)) {
    // Add standards section at the end
    const standardsText = `## STANDARDS ALIGNED\n\n`
    if (hasStandardValue) {
      const standardText = standard.trim()
      if (isStandardRecognized) {
        // Recognized standard - show normally
        formattedText += `${standardsText}- **Relevant Standards**: [List applicable educational standards for ${subject} at ${grade_band} level that align with: ${standardText}]\n`
      } else {
        // Unrecognized standard - show message like user requested
        formattedText += `${standardsText}- **Relevant Standards**: [List applicable educational standards for ${subject} at ${grade_band} level]\n`
        formattedText += `- **Note**: The provided standard '${standardText}' may not be recognized or validated. Please adapt materials and recommendations as needed based on the constraints and available resources.\n`
      }
      formattedText += `- **General Standards**: [Include general educational standards for ${subject} at ${grade_band} level]\n\n`
    } else if (hasRealSubjectGrade) {
      formattedText += `${standardsText}- **Relevant Standards**: [List applicable educational standards for ${subject} at ${grade_band} level]\n`
      formattedText += `- **Note**: [Adapt materials and recommendations as needed based on: ${constraints}]\n\n`
    }
  }
  
  // Extract Lesson Sections (for LESSON_DESIGN category) - PROFESSIONAL DETAIL like Activity
  // FIXED: Properly extract and format, don't show raw JSON
  // Handle both array format and single object format
  if (jsonContent.includes('lesson_sections')) {
    // Try to extract lesson_sections - handle both array and single object
    let sections: Array<{id: string, title: string, goal: string, steps: Array<{label: string, duration: string, detail: string}>}> = []
    
    const sectionsIndex = jsonContent.indexOf('"lesson_sections"')
    if (sectionsIndex !== -1) {
      // Check if it's an array or single object
      const afterKey = jsonContent.substring(sectionsIndex)
      const bracketIndex = afterKey.indexOf('[')
      const braceIndex = afterKey.indexOf('{')
      
      // Determine if it's array or object
      const isArray = bracketIndex !== -1 && (braceIndex === -1 || bracketIndex < braceIndex)
      
      if (isArray && bracketIndex !== -1) {
        // Array format: "lesson_sections": [{...}, {...}]
        // Find the complete array (handle incomplete JSON during streaming)
        let arrayEnd = bracketIndex + 1
        let depth = 1
        let inString = false
        let escapeNext = false
        
        while (arrayEnd < jsonContent.length && depth > 0) {
          const char = jsonContent[arrayEnd]
          
          if (escapeNext) {
            escapeNext = false
            arrayEnd++
            continue
          }
          
          if (char === '\\') {
            escapeNext = true
            arrayEnd++
            continue
          }
          
          if (char === '"') {
            inString = !inString
          } else if (!inString) {
            if (char === '[') depth++
            if (char === ']') depth--
          }
          
          if (depth === 0) break
          arrayEnd++
        }
        
        const arrayContent = jsonContent.substring(bracketIndex + 1, arrayEnd)
        
        // Extract section objects - handle incomplete JSON (sections already declared above)
        
        // Find all section objects (even incomplete) - improved pattern
        let sectionStart = 0
        while (sectionStart < arrayContent.length) {
          const objStart = arrayContent.indexOf('{', sectionStart)
          if (objStart === -1) break
          
          // Find matching closing brace
          let objEnd = objStart + 1
          let objDepth = 1
          let objInString = false
          let objEscapeNext = false
          
          while (objEnd < arrayContent.length && objDepth > 0) {
            const char = arrayContent[objEnd]
            
            if (objEscapeNext) {
              objEscapeNext = false
              objEnd++
              continue
            }
            
            if (char === '\\') {
              objEscapeNext = true
              objEnd++
              continue
            }
            
            if (char === '"') {
              objInString = !objInString
            } else if (!objInString) {
              if (char === '{') objDepth++
              if (char === '}') objDepth--
            }
            
            if (objDepth === 0) break
            objEnd++
          }
          
          if (objDepth === 0) {
            const sectionContent = arrayContent.substring(objStart, objEnd)
            
            // Extract section fields
            const idMatch = sectionContent.match(/"id"\s*:\s*"([^"]+)"/)
            const titleMatch = sectionContent.match(/"title"\s*:\s*"([^"]*)"/)
            const goalMatch = sectionContent.match(/"goal"\s*:\s*"([^"]*)"/)
            
            if (idMatch) {
              const sectionId = idMatch[1]
              const sectionTitle = titleMatch ? titleMatch[1] : sectionId
              const sectionGoal = goalMatch ? goalMatch[1] : ''
              
              let section = sections.find(s => s.id === sectionId)
              if (!section) {
                section = { id: sectionId, title: sectionTitle, goal: sectionGoal, steps: [] }
                sections.push(section)
              } else {
                if (sectionGoal.length > section.goal.length) {
                  section.goal = sectionGoal
                }
              }
              
              // Extract steps for this section - handle nested arrays properly
              const stepsMatch = sectionContent.match(/"steps"\s*:\s*\[(.*?)(?:\]|$)/s)
              if (stepsMatch) {
                const stepsContent = stepsMatch[1]
                // Extract each step object - handle nested braces
                let stepStart = 0
                while (stepStart < stepsContent.length) {
                  const stepObjStart = stepsContent.indexOf('{', stepStart)
                  if (stepObjStart === -1) break
                  
                  // Find matching closing brace (handle nested objects)
                  let stepObjEnd = stepObjStart + 1
                  let stepDepth = 1
                  let stepInString = false
                  let stepEscapeNext = false
                  
                  while (stepObjEnd < stepsContent.length && stepDepth > 0) {
                    const char = stepsContent[stepObjEnd]
                    
                    if (stepEscapeNext) {
                      stepEscapeNext = false
                      stepObjEnd++
                      continue
                    }
                    
                    if (char === '\\') {
                      stepEscapeNext = true
                      stepObjEnd++
                      continue
                    }
                    
                    if (char === '"') {
                      stepInString = !stepInString
                    } else if (!stepInString) {
                      if (char === '{') stepDepth++
                      if (char === '}') stepDepth--
                    }
                    
                    if (stepDepth === 0) break
                    stepObjEnd++
                  }
                  
                  if (stepDepth === 0) {
                    const stepContent = stepsContent.substring(stepObjStart, stepObjEnd + 1)
                    
                    // Extract step fields - handle incomplete strings
                    const labelMatch = stepContent.match(/"label"\s*:\s*"([^"]*)"/)
                    const durationMatch = stepContent.match(/"duration"\s*:\s*"([^"]*)"/)
                    const detailMatch = stepContent.match(/"detail"\s*:\s*"([^"]*)"/)
                    
                    // Also try to get incomplete detail at the end
                    const incompleteDetailMatch = stepContent.match(/"detail"\s*:\s*"([^"]*)$/)
                    const finalDetail = incompleteDetailMatch && incompleteDetailMatch[1].length > (detailMatch ? detailMatch[1].length : 0)
                      ? incompleteDetailMatch[1]
                      : (detailMatch ? detailMatch[1] : '')
                    
                    if (labelMatch) {
                      const stepLabel = labelMatch[1]
                      const stepDuration = durationMatch ? durationMatch[1] : ''
                      const stepDetail = finalDetail
                      
                      const existingStep = section.steps.find(s => s.label === stepLabel)
                      if (!existingStep) {
                        section.steps.push({ label: stepLabel, duration: stepDuration, detail: stepDetail })
                      } else if (stepDetail.length > existingStep.detail.length) {
                        existingStep.detail = stepDetail
                      }
                    }
                  }
                  
                  stepStart = stepObjEnd + 1
                }
              }
            }
            
            sectionStart = objEnd + 1
          } else {
            break
          }
        }
        
        // Format sections professionally (like Activity's OPENING, GUIDED PRACTICE, etc.)
        // IMPORTANT: Only show section heading AFTER we have content (word-by-word like Activity)
        sections.forEach(section => {
          // Only format if section has goal or steps with actual content
          const hasGoal = section.goal && section.goal.trim().length > 0
          const hasSteps = section.steps.length > 0 && section.steps.some(s => (s.label && s.label.trim().length > 0) || (s.detail && s.detail.trim().length > 0))
          
          if (hasGoal || hasSteps) {
            // Map section IDs to professional titles
            const sectionTitleMap: Record<string, string> = {
              'opening': 'OPENING',
              'introduction': 'INTRODUCTION TO NEW MATERIAL',
              'guided_practice': 'GUIDED PRACTICE',
              'independent_practice': 'INDEPENDENT PRACTICE',
              'closing': 'CLOSING'
            }
            
            const professionalTitle = sectionTitleMap[section.id] || section.title.toUpperCase()
            
            // Check if we've already added this section heading
            const sectionHeading = `## ${professionalTitle}`
            if (!formattedText.includes(sectionHeading)) {
              formattedText += `${sectionHeading}\n\n`
            }
            
            // Only add goal if we haven't added it yet or if it's longer (more content streamed)
            if (hasGoal) {
              // Check if goal is already in formattedText (avoid duplicates)
              const existingGoalIndex = formattedText.indexOf(section.goal)
              if (existingGoalIndex === -1 || existingGoalIndex < formattedText.lastIndexOf(sectionHeading)) {
                formattedText += `${section.goal}\n\n`
              }
            }
            
            // Format steps with duration and detail (like Activity)
            // Only add steps that have content
            section.steps.forEach(step => {
              if (step.label && step.detail && step.detail.trim().length > 0) {
                const durationText = step.duration ? ` (${step.duration})` : ''
                formattedText += `- **${step.label}${durationText}**: ${step.detail}\n`
              } else if (step.label && step.label.trim().length > 0) {
                formattedText += `- **${step.label}**: ${step.detail || ''}\n`
              }
            })
    formattedText += `\n`
          }
        })
      }
    }
  }
  
      // If we still have no formatted text but have substantial content, try parsing as JSON/TOON
      if (formattedText.length === 0 && jsonContent.length > 50) {
        try {
          // Try to parse as JSON first, then try TOON format
          let parsed: any = null
          try {
            parsed = JSON.parse(jsonContent)
          } catch {
            // Not valid JSON, might be TOON format - convert TOON to JSON
            try {
              // Convert TOON format to JSON format
              // Pattern: key: -> "key": (for unquoted keys like overview: instead of "overview":)
              let toonAsJson = jsonContent.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
              parsed = JSON.parse(toonAsJson)
            } catch {
              // Not valid TOON either, might be incomplete - try to extract anyway with regex
              // This is already handled by the extraction logic above
            }
          }
          
          // If we successfully parsed, extract from parsed object
          if (parsed && typeof parsed === 'object') {
            if (parsed.overview) {
              formattedText += `## OVERVIEW\n\n${parsed.overview}\n\n`
            }
            if (parsed.learning_goals && Array.isArray(parsed.learning_goals) && parsed.learning_goals.length > 0) {
              formattedText += `## LEARNING OBJECTIVE\n\n`
              parsed.learning_goals.forEach((goal: string) => {
                if (goal) formattedText += `- ${goal}\n`
              })
              formattedText += `\n`
            }
            if (parsed.materials && Array.isArray(parsed.materials) && parsed.materials.length > 0) {
              formattedText += `## REQUIRED MATERIALS\n\n`
              parsed.materials.forEach((material: string) => {
                if (material) formattedText += `- ${material}\n`
              })
              formattedText += `\n`
            }
            // Add more fields as needed
          }
        } catch (parseError) {
          // Ignore parse errors - continue with regex extraction
        }
      }
      
      return formattedText
    } catch (error) {
      // If extraction fails, return empty string (don't crash)
      console.error('Error extracting formatted text:', error, 'JSON content length:', jsonContent?.length)
      // Try one more time with simple JSON/TOON parse
      try {
        let parsed: any = null
        try {
          parsed = JSON.parse(jsonContent)
        } catch {
          // Try TOON format conversion
          try {
            const toonAsJson = jsonContent.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
            parsed = JSON.parse(toonAsJson)
          } catch {
            // Ignore
          }
        }
        if (parsed && typeof parsed === 'object' && parsed.overview) {
          let formatted = `## OVERVIEW\n\n${parsed.overview}\n\n`
          if (parsed.learning_goals && Array.isArray(parsed.learning_goals)) {
            formatted += `## LEARNING OBJECTIVE\n\n`
            parsed.learning_goals.forEach((goal: string) => {
              if (goal) formatted += `- ${goal}\n`
            })
            formatted += `\n`
          }
          if (parsed.materials && Array.isArray(parsed.materials)) {
            formatted += `## REQUIRED MATERIALS\n\n`
            parsed.materials.forEach((material: string) => {
              if (material) formatted += `- ${material}\n`
            })
            formatted += `\n`
          }
          return formatted
        }
      } catch {
        // Ignore
      }
      return ''
    }
  }

export const useTemplateStream = (): UseTemplateStreamReturn => {
  const [content, setContent] = useState<string>('')
  const [formattedContent, setFormattedContent] = useState<string>('')
  const [isStreaming, setIsStreaming] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [executionId, setExecutionId] = useState<string | null>(null)
  
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const formattedContentRef = useRef<string>('') // Track formatted content for immediate updates
  const accumulatedContentRef = useRef<string>('') // Track accumulated JSON content (like Activity's accumulatedTexts)
  const inputDataRef = useRef<Record<string, any>>({}) // Track input data for standards extraction
  const previousFormattedRef = useRef<string>('') // Track previous formatted text to detect new content

  const stopStream = useCallback(() => {
    // Close the reader if it exists
    if (readerRef.current) {
      readerRef.current.cancel().catch(() => {
        // Ignore cancellation errors
      })
      readerRef.current = null
    }
    
    // Abort the fetch request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    
    setIsStreaming(false)
  }, [])

  const reset = useCallback(() => {
    stopStream()
    setContent('')
    setFormattedContent('')
    formattedContentRef.current = ''
    previousFormattedRef.current = ''
    accumulatedContentRef.current = ''
    setError(null)
    setExecutionId(null)
  }, [stopStream])

  const startStream = useCallback((slug: string, data: Record<string, any>) => {
    // Store input data for standards extraction BEFORE reset
    inputDataRef.current = data
    
    // Reset state
    reset()
    setIsStreaming(true)

    // Create abort controller for this request
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    // Build URL
    const DEFAULT_BASE_URL = 'http://localhost:8000/api'
    const API_BASE_URL = (import.meta.env.VITE_API_URL || DEFAULT_BASE_URL).replace(/\/$/, '')
    const url = `${API_BASE_URL}/v1/templates/${slug}/execute-stream`

    // Start fetch request
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify({ data }),
      signal: abortController.signal,
    })
      .then((response) => {
        if (!response.ok) {
          // Try to parse error response
          return response.text().then((errorText) => {
            let errorMessage = `Stream failed: ${response.statusText}`
            try {
              const errorJson = JSON.parse(errorText)
              if (errorJson.detail) {
                if (typeof errorJson.detail === 'string') {
                  errorMessage = errorJson.detail
                } else if (errorJson.detail.message) {
                  errorMessage = errorJson.detail.message
                } else if (errorJson.detail.missing) {
                  errorMessage = `Missing required fields: ${errorJson.detail.missing.join(', ')}`
                }
              }
            } catch {
              errorMessage = errorText || errorMessage
            }
            throw new Error(errorMessage)
          })
        }

        if (!response.body) {
          throw new Error('No response body received')
        }

        // Get reader from response stream
        const reader = response.body.getReader()
        readerRef.current = reader
        const decoder = new TextDecoder()
        let buffer = ''

        // Read stream
        const readStream = (): Promise<void> => {
          return reader.read().then(({ done, value }) => {
            if (done) {
              setIsStreaming(false)
              return
            }

            // Decode chunk and add to buffer
            buffer += decoder.decode(value, { stream: true })
            
            // Process complete lines (SSE format: "data: {...}\n\n")
            const lines = buffer.split('\n')
            buffer = lines.pop() || '' // Keep incomplete line in buffer

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                let event: StreamEvent | null = null
                try {
                  const jsonStr = line.slice(6) // Remove 'data: ' prefix
                  event = JSON.parse(jsonStr)
                } catch (parseError) {
                  // CRITICAL: Don't stop on parse errors - just log and continue (like Activity line 446-448)
                  console.warn('Error parsing SSE event (continuing):', parseError, 'Line:', line.substring(0, 100))
                  // Continue to next line - don't break the stream
                  continue
                }

                if (!event) {
                  console.warn('Event is null after parsing')
                  continue
                }
                
                // DEBUG: Log event type to verify events are being received
                if (event.type === 'content') {
                  console.log('Content event received, chunk length:', (event.chunk || '').length)
                } else {
                  console.log('SSE event received:', event.type)
                }

                try {
                  switch (event.type) {
                    case 'meta':
                      // First event - metadata (template info)
                      break

                    case 'content':
                      // EXACTLY like Activity: accumulate markdown immediately, update state immediately
                      // Backend now streams markdown word-by-word (not TOON), so just accumulate and display
                      // Activity: accumulatedTexts[variantIdx] += data.content (NO FILTERING)
                      const newChunk = event.chunk
                      
                      // CRITICAL: Ensure isStreaming is true when content arrives (like Activity line 372)
                      setIsStreaming(true)
                      
                      // CRITICAL: Accumulate ALL chunks - don't filter (like Activity)
                      // Activity doesn't filter - it accumulates everything including spaces, punctuation, etc.
                      if (newChunk && typeof newChunk === 'string') {
                        // Accumulate markdown chunk (word-by-word from backend)
                        accumulatedContentRef.current += newChunk
                        
                        // Backend now sends markdown directly (like Activity), so no extraction needed
                        // Just use accumulated markdown as-is - EXACTLY like Activity
                        formattedContentRef.current = accumulatedContentRef.current
                        setFormattedContent(accumulatedContentRef.current)
                        setContent(accumulatedContentRef.current)
                        
                        // DEBUG: Log first few chunks to verify they're arriving
                        if (accumulatedContentRef.current.length < 100) {
                          console.log('First chunk received:', newChunk.substring(0, 50))
                        }
                      } else {
                        console.warn('Received non-string chunk:', typeof newChunk, newChunk)
                      }
                      
                      // CRITICAL: Always continue reading - never stop on errors (like Activity/GPT)
                      // Activity continues even on parse errors (line 446-448: "Don't stop on parse errors, just log them")
                      // This ensures chunks are processed as fast as they arrive
                      break

                    case 'done':
                      // Stream complete - backend already sent markdown, just ensure state is set
                      // EXACTLY like Activity: no extraction needed, just use accumulated markdown
                      const finalContent = accumulatedContentRef.current
                      // CRITICAL: Use content as-is, don't trim (Activity doesn't trim)
                      if (finalContent && finalContent.length > 0) {
                        formattedContentRef.current = finalContent
                        setFormattedContent(finalContent)
                        setContent(finalContent)
                      }
                      
                      setIsStreaming(false)
                      if (event.execution_id) {
                        setExecutionId(event.execution_id)
                      }
                      break

                    case 'error':
                      // Error event - log but don't stop stream
                      console.error('Stream error event:', event)
                      setError(event.message || 'Stream error occurred')
                      setIsStreaming(false)
                      break

                    default:
                      // Unknown event type - log but continue
                      console.warn('Unknown event type:', event.type)
                      break
                  }
                } catch (eventError) {
                  // CRITICAL: Never stop streaming on errors - always continue (like Activity/GPT)
                  // Log error but continue processing next chunks
                  console.warn('Error processing event (continuing):', eventError)
                  // Continue to next line - don't break the stream
                }
              }
            }
            
            // CRITICAL: Always continue reading next chunk, even if there were errors
            // This ensures streaming never stops, even on parse/extraction errors
            // Activity uses while(true) - we use recursive readStream() calls
            readStream().catch(err => {
              console.error('Error in readStream (continuing):', err)
              // Even on error, try to continue - don't stop streaming
              setIsStreaming(false)
            })
            return
          }).catch((err) => {
            // Handle read errors
            if (err.name === 'AbortError') {
              // Request was aborted, this is expected
              setIsStreaming(false)
              return
            }
            setError(err.message || 'Error reading stream')
            setIsStreaming(false)
          })
        }

        // Start reading
        return readStream()
      })
      .catch((err) => {
        // Handle fetch errors
        if (err.name === 'AbortError') {
          // Request was aborted, this is expected
          setIsStreaming(false)
          return
        }
        setError(err.message || 'Failed to start stream')
        setIsStreaming(false)
      })
  }, [reset])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStream()
    }
  }, [stopStream])

  return {
    content,
    formattedContent,
    isStreaming,
    error,
    executionId,
    startStream,
    stopStream,
    reset,
  }
}

