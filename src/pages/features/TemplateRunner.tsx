import { ChangeEvent, FormEvent, useEffect, useMemo, useState, useRef } from 'react'
import { ArrowLeft, Loader2, Copy, Check, RefreshCw, FileText, Send, ChevronDown, ChevronUp, Download, Printer, Edit, Languages, Volume2, Bookmark, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'
import { saveAs } from 'file-saver'
import { Link, useNavigate, useParams } from 'react-router-dom'
import TurndownService from 'turndown'

import { fetchTemplateDetail } from '../../api/templates'
import { TemplateResponse } from '../../api/types'
import { useTemplateStream } from '../../hooks/useTemplateStream'

type TemplateField = {
  name: string
  type: string
  label?: string
  placeholder?: string
  options?: string[]
  required?: boolean
  min?: number
  max?: number
  default?: string
}

const TemplateRunner = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [template, setTemplate] = useState<TemplateResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [parsedOutput, setParsedOutput] = useState<Record<string, any> | null>(null)
  const [copied, setCopied] = useState(false)
  const [showPromptEditor, setShowPromptEditor] = useState(true)
  const [showOutput, setShowOutput] = useState(false)
  
  // Use real streaming hook
  const { content: streamedContent, formattedContent, isStreaming, error: streamError, executionId, startStream, stopStream, reset: resetStream } = useTemplateStream()

  // Initialize Turndown service for HTML to Markdown conversion (future-proof)
  const turndownServiceRef = useRef<TurndownService | null>(null)
  
  useEffect(() => {
    // Initialize turndown service with optimal settings for markdown output
    turndownServiceRef.current = new TurndownService({
      headingStyle: 'atx', // Use ## for headings (not ===)
      codeBlockStyle: 'fenced', // Use ``` for code blocks
      bulletListMarker: '-', // Use - for bullet lists
      emDelimiter: '*', // Use * for emphasis
      strongDelimiter: '**', // Use ** for bold
      linkStyle: 'inlined', // Inline links [text](url)
      linkReferenceStyle: 'full', // Full reference links
    })

    // Add custom rules to preserve formatting
    if (turndownServiceRef.current) {
      // Preserve heading levels - ensure proper markdown format
      turndownServiceRef.current.addRule('heading', {
        filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        replacement: function (content, node) {
          const level = (node as HTMLElement).tagName.charAt(1)
          const prefix = '#'.repeat(parseInt(level))
          return `${prefix} ${content}\n\n`
        }
      })

      // Preserve list formatting with proper indentation
      turndownServiceRef.current.addRule('listItem', {
        filter: 'li',
        replacement: function (content, node, options) {
          let formattedContent = content
            .replace(/^\n+/, '') // remove leading newlines
            .replace(/\n+$/, '\n') // replace trailing newlines with just a single one
            .replace(/\n/gm, '\n    ') // indent nested content
          
          const parent = node.parentNode
          let prefix = options.bulletListMarker + ' '
          
          if (parent && parent.nodeName === 'OL') {
            const start = (parent as HTMLOListElement).start || 1
            const index = Array.prototype.indexOf.call(parent.children, node)
            prefix = (start + index) + '. '
          }
          
          return prefix + formattedContent + (node.nextSibling && !/\n$/.test(formattedContent) ? '\n' : '')
        }
      })
    }
  }, [])

  useEffect(() => {
    if (!slug) {
      setError('Template not found.')
      setLoading(false)
      return
    }

    const controller = new AbortController()
    setLoading(true)
    setError(null)

    fetchTemplateDetail(slug, controller.signal)
      .then((data) => {
        setTemplate(data)
        setParsedOutput(null)
        resetStream()
        setShowOutput(false)
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Unable to load template.')
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      })

    return () => controller.abort()
  }, [slug])

  const schemaFields = useMemo<TemplateField[]>(() => {
    if (!template?.inputSchema) {
      console.warn('Template has no inputSchema:', template)
      return []
    }
    
    const schema = template.inputSchema as any
    console.log('Parsing input_schema:', schema)
    
    // Check if it's already in the expected format (with fields array)
    if (schema.fields && Array.isArray(schema.fields)) {
      const fields = schema.fields.filter((field: any): field is TemplateField => 
        Boolean(field?.name && field?.type)
      )
      // Summative Assessment: ensure we do not show differentiation fields
      const filteredFields = template?.slug === 'summative_assessment'
        ? fields.filter((f) => !f.name.toLowerCase().includes('differentiation'))
        : fields
      console.log('Using fields array format:', filteredFields)
      return filteredFields
    }
    
    // Convert JSON Schema format to frontend format
    // Backend uses JSON Schema: { type: "object", properties: {...}, required: [...] }
    if (schema.type === 'object' && schema.properties) {
      const properties = schema.properties as Record<string, any>
      const required = Array.isArray(schema.required) ? schema.required : []
      
      const fields = Object.entries(properties).map(([name, prop]): TemplateField => {
        // Map JSON Schema types to frontend types
        let fieldType = 'text'
        if (prop.type === 'string') {
          if (prop.enum) {
            fieldType = 'select'
          } else if (prop.format === 'textarea' || 
                     name.toLowerCase().includes('description') || 
                     name.toLowerCase().includes('notes') ||
                     name.toLowerCase().includes('objective') ||
                     name.toLowerCase().includes('differentiation')) {
            fieldType = 'textarea'
          } else {
            fieldType = 'text'
          }
        } else if (prop.type === 'integer' || prop.type === 'number') {
          fieldType = 'number'
        } else if (prop.type === 'boolean') {
          fieldType = 'select' // We'll handle boolean as select with yes/no
        } else if (prop.type === 'array' && prop.items?.type === 'string') {
          fieldType = 'array' // Render as textarea; payload will split into string[]
        }
        
        // Format label from property name
        const label = prop.title || 
                     prop.description || 
                     name.replace(/_/g, ' ')
                         .replace(/\b\w/g, l => l.toUpperCase())
        
        return {
          name,
          type: fieldType,
          label,
          placeholder: prop.description || `Enter ${name.replace(/_/g, ' ')}`,
          required: required.includes(name),
          options: prop.enum || (prop.type === 'boolean' ? ['true', 'false'] : undefined),
          min: prop.minimum,
          max: prop.maximum,
          default: prop.default ? String(prop.default) : undefined,
        }
      }).filter((field): field is TemplateField => Boolean(field?.name && field?.type))
      
      // Summative Assessment: ensure we do not show differentiation fields
      const filteredFields = template?.slug === 'summative_assessment'
        ? fields.filter((f) => !f.name.toLowerCase().includes('differentiation'))
        : fields
      
      console.log('Converted JSON Schema to fields:', filteredFields)
      return filteredFields
    }
    
    console.warn('Unknown input_schema format:', schema)
    return []
  }, [template])

  // Initialize formValues synchronously with schemaFields
  const initialFormValues = useMemo(() => {
    if (schemaFields.length === 0) return {}
    const initial: Record<string, string> = {}
    schemaFields.forEach((field) => {
      // Use default value from schema if available, otherwise empty string
      initial[field.name] = field.default || ''
    })
    return initial
  }, [schemaFields])

  useEffect(() => {
    setFormValues(initialFormValues)
  }, [initialFormValues])

  const handleInputChange = (name: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  // Parse final content when streaming completes
  useEffect(() => {
    if (!isStreaming && streamedContent && executionId) {
      try {
        // Final parse when streaming is complete
        let parsed: any = null
        
        // First, try direct JSON parse
        try {
          parsed = JSON.parse(streamedContent.trim())
        } catch {
          // If that fails, try to extract the largest JSON object from the content
          const jsonMatches = streamedContent.match(/\{[\s\S]*\}/g)
          if (jsonMatches && jsonMatches.length > 0) {
            // Try the largest match (likely the complete object)
            const largestMatch = jsonMatches.reduce((a, b) => a.length > b.length ? a : b)
            try {
              parsed = JSON.parse(largestMatch)
            } catch {
              // If that fails, try the first match
              try {
                parsed = JSON.parse(jsonMatches[0])
              } catch {
                // Try to fix JS object notation
                try {
                  let fixedContent = streamedContent
                    .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
                    .replace(/'/g, '"')
                  parsed = JSON.parse(fixedContent)
                } catch {
                  parsed = null
                }
              }
            }
          }
        }
        
        if (parsed) {
          setParsedOutput(parsed)
        }
      } catch (err) {
        console.error('Failed to parse streamed content:', err)
      }
    }
  }, [isStreaming, streamedContent, executionId])

  useEffect(() => {
    if (streamError) {
      setSubmitError(streamError)
    }
  }, [streamError])

  // Professional auto-scroll during streaming (like ChatGPT)
  // Continuously scroll to bottom as content streams in
  useEffect(() => {
    if (isStreaming && formattedContent) {
      // Scroll to bottom smoothly as content streams
      const scrollToBottom = () => {
        // Get the streaming text element
        const streamingText = document.getElementById('streaming-text')
        const outputContainer = document.getElementById('ai-output-content')
        
        if (streamingText) {
          // Scroll the element into view at the bottom
          streamingText.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'end',
            inline: 'nearest'
          })
        } else if (outputContainer) {
          // Fallback: scroll the container
          outputContainer.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'end'
          })
        } else {
          // Final fallback: scroll window to bottom
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
          })
        }
      }
      
      // Use requestAnimationFrame for smooth, continuous scrolling
      const rafId = requestAnimationFrame(() => {
        scrollToBottom()
      })
      
      return () => {
        cancelAnimationFrame(rafId)
      }
    }
  }, [isStreaming, formattedContent])

  // Initial scroll to output when it first appears
  useEffect(() => {
    if (showOutput && !isStreaming) {
      setTimeout(() => {
        const outputElement = document.getElementById('ai-output')
        if (outputElement) {
          outputElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }, [showOutput])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitError(null)
    if (!template || !slug) return

    // Prevent duplicate API calls if already streaming
    if (isStreaming) {
      return
    }

    const missing = schemaFields.filter((field) => field.required && !formValues[field.name]?.trim())
    if (missing.length > 0) {
      setSubmitError(`Please fill in: ${missing.map((field) => field.label ?? field.name).join(', ')}`)
      return
    }

    // Collapse prompt editor and show output when generation starts
    setShowPromptEditor(false)
    setShowOutput(true)

    // Build payload from form values
    const payload: Record<string, unknown> = {}
    schemaFields.forEach((field) => {
      const raw = formValues[field.name]
      if (!raw || raw.trim() === '') {
        return
      }
      
      // Convert based on field type
      if (field.type === 'number') {
        const numericValue = Number(raw)
        payload[field.name] = Number.isNaN(numericValue) ? raw : numericValue
      } else if (field.type === 'select' && field.options) {
        // For select fields, use the value as-is
        // For boolean fields, convert string to boolean
        if (field.options.length === 2 && field.options.includes('true') && field.options.includes('false')) {
          payload[field.name] = raw === 'true'
        } else {
          payload[field.name] = raw
        }
      } else if (field.type === 'array') {
        // Array of strings: split by newline or comma
        payload[field.name] = raw.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
      } else {
        // Text, textarea, etc.
        payload[field.name] = raw.trim()
      }
    })

    // Normalize assessment-specific fields for backend schema
    if (payload.question_types) {
      const raw = String(payload.question_types)
      const tokens = raw
        .split(/[,;/]|and|\n/gi)
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
      const mapped = tokens.map((t) => {
        if (t.includes('mcq') || t.includes('multiple')) return 'MCQ'
        if (t.includes('short')) return 'short_answer'
        if (t.includes('essay')) return 'essay'
        if (t.includes('diagram') || t.includes('label')) return 'diagram'
        if (t.includes('match')) return 'matching'
        return ''
      }).filter(Boolean)
      if (mapped.length > 0) {
        payload.question_types = mapped
      } else {
        delete payload.question_types
      }
    }

    if (payload.difficulty) {
      payload.difficulty = String(payload.difficulty).toLowerCase()
    }

    if (payload.bloom_level) {
      payload.bloom_level = String(payload.bloom_level).toLowerCase()
    }

    // Start streaming
    startStream(slug, payload)
  }

  const handleRegenerate = () => {
    if (!template || !slug) return
    
    // Prevent duplicate API calls if already streaming
    if (isStreaming) {
      return
    }
    
    // Build payload from form values (same logic as handleSubmit)
    const payload: Record<string, unknown> = {}
    schemaFields.forEach((field) => {
      const raw = formValues[field.name]
      if (!raw || raw.trim() === '') {
        return
      }
      
      // Convert based on field type
      if (field.type === 'number') {
        const numericValue = Number(raw)
        payload[field.name] = Number.isNaN(numericValue) ? raw : numericValue
      } else if (field.type === 'select' && field.options) {
        if (field.options.length === 2 && field.options.includes('true') && field.options.includes('false')) {
          payload[field.name] = raw === 'true'
        } else {
          payload[field.name] = raw
        }
      } else if (field.type === 'array') {
        payload[field.name] = raw.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
      } else {
        payload[field.name] = raw.trim()
      }
    })

    // Normalize assessment-specific fields for backend schema
    if (payload.question_types) {
      const raw = String(payload.question_types)
      const tokens = raw
        .split(/[,;/]|and|\n/gi)
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
      const mapped = tokens.map((t) => {
        if (t.includes('mcq') || t.includes('multiple')) return 'MCQ'
        if (t.includes('short')) return 'short_answer'
        if (t.includes('essay')) return 'essay'
        if (t.includes('diagram') || t.includes('label')) return 'diagram'
        if (t.includes('match')) return 'matching'
        return ''
      }).filter(Boolean)
      if (mapped.length > 0) {
        payload.question_types = mapped
      } else {
        delete payload.question_types
      }
    }

    if (payload.difficulty) {
      payload.difficulty = String(payload.difficulty).toLowerCase()
    }

    if (payload.bloom_level) {
      payload.bloom_level = String(payload.bloom_level).toLowerCase()
    }
    
    // Reset and start new stream
    resetStream()
    setParsedOutput(null)
    setShowOutput(true)
    startStream(slug, payload)
  }

  // Convert parsed output to markdown format that matches the display exactly
  const convertParsedToMarkdown = (output: Record<string, any>): string => {
    // Sections to exclude
    const excludedSections = ['BLOOM_ALIGNMENT', 'bloom_alignment', 'SAFETY_PRECAUTIONS', 'safety_precautions', 'TEACHER_NOTES', 'teacher_notes']
    
    // Filter out excluded sections
    const filteredOutput = Object.fromEntries(
      Object.entries(output).filter(([key]) => !excludedSections.includes(key.toUpperCase()))
    )

    let markdown = ''
    
    // Helper to format values preserving markdown structure
    const formatValue = (val: any): string => {
      if (val === null || val === undefined) return ''
      
      if (typeof val === 'string') {
        // If it's already markdown-like with headings or lists, return as-is
        if (val.includes('##') || val.includes('# ') || val.includes('\n- ') || val.match(/^\s*[-•*]\s/m)) {
          return val
        }
        // Plain text - return as-is (will be formatted by section handler)
        return val.trim()
      }
      
      if (Array.isArray(val)) {
        return val
          .filter(item => item !== null && item !== undefined)
          .map(item => {
            if (typeof item === 'string') {
              // Check if it already has markdown formatting
              if (item.includes('**') || item.includes('- ')) {
                return item.trim()
              }
              return `- ${item.trim()}`
            } else if (typeof item === 'object') {
              // Handle objects in arrays - format as "**key**: value"
              const entries = Object.entries(item)
              if (entries.length === 1) {
                return `- ${entries[0][1]}`
              } else {
                // Multiple key-value pairs - format each
                return entries.map(([k, v]) => {
                  const keyFormatted = k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                  return `- **${keyFormatted}**: ${String(v).trim()}`
                }).join('\n')
              }
            }
            return `- ${String(item).trim()}`
          })
          .join('\n')
      }
      
      if (typeof val === 'object') {
        // Handle nested objects - convert to bullet list with bold keys
        return Object.entries(val)
          .map(([k, v]) => {
            const keyFormatted = k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
            if (typeof v === 'string') {
              return `- **${keyFormatted}**: ${v.trim()}`
            } else if (Array.isArray(v)) {
              const items = v.map(item => typeof item === 'string' ? item : String(item))
              return `- **${keyFormatted}**: ${items.join(', ')}`
            } else if (typeof v === 'object') {
              const nested = Object.entries(v).map(([nk, nv]) => `${nk}: ${nv}`).join(', ')
              return `- **${keyFormatted}**: ${nested}`
            }
            return `- **${keyFormatted}**: ${String(v)}`
          })
          .join('\n')
      }
      
      return String(val || '')
    }

    // Process each section maintaining exact format
    Object.entries(filteredOutput).forEach(([key, value]) => {
      // Skip empty values
      if (value === null || value === undefined || value === '') return
      
      // Format section title - convert to display format
      let sectionTitle = key
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
      
      // Determine heading level and format
      let heading = ''
      const keyLower = key.toLowerCase()
      if (keyLower.includes('title') || keyLower === 'lesson_title') {
        // H1 for titles
        heading = `# ${sectionTitle}`
      } else {
        // H2 for sections - uppercase like "LEARNING OBJECTIVE"
        heading = `## ${sectionTitle.toUpperCase().replace(/\s+/g, ' ')}`
      }
      
      markdown += `${heading}\n\n`
      
      // Format the content preserving structure
      if (typeof value === 'string') {
        // String content - check if already formatted
        if (value.includes('##') || value.includes('# ') || value.match(/^\s*[-•*]\s/m)) {
          // Already has markdown, use as-is
          markdown += `${value}\n\n`
        } else {
          // Plain text - split by lines and format
          const lines = value.split('\n').filter(line => line.trim())
          lines.forEach(line => {
            const trimmed = line.trim()
            if (trimmed) {
              // Check if it looks like a list item
              if (trimmed.match(/^[-•*]\s/) || trimmed.match(/^\d+\.\s/)) {
                markdown += `${trimmed}\n`
              } else {
                // Regular paragraph
                markdown += `${trimmed}\n\n`
              }
            }
          })
          if (lines.length > 0) markdown += '\n'
        }
      } else if (Array.isArray(value)) {
        // Array - format as bullet list
        value.forEach(item => {
          if (typeof item === 'string') {
            // Check if already formatted
            if (item.includes('**') || item.startsWith('- ')) {
              markdown += `${item.trim()}\n`
            } else {
              markdown += `- ${item.trim()}\n`
            }
          } else if (typeof item === 'object') {
            // Object in array - format with bold keys
            const entries = Object.entries(item)
            entries.forEach(([k, v]) => {
              const keyFormatted = k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
              if (typeof v === 'string') {
                markdown += `- **${keyFormatted}**: ${v.trim()}\n`
              } else {
                markdown += `- **${keyFormatted}**: ${String(v).trim()}\n`
              }
            })
          }
        })
        markdown += '\n'
      } else if (typeof value === 'object') {
        // Object - format as nested structure
        const formatted = formatValue(value)
        if (formatted) {
          markdown += `${formatted}\n\n`
        }
      } else {
        // Other types
        markdown += `${String(value)}\n\n`
      }
    })
    
    return markdown.trim()
  }

  const formatOutputForCopy = (output: Record<string, any>, templateSlug?: string): string => {
    // If we have formattedContent, prefer that (it's already in markdown)
    // Otherwise, convert parsed output to markdown
    return convertParsedToMarkdown(output)
  }

  /**
   * Future-proof copy function that works with any content format
   * Priority:
   * 1. formattedContent (already in markdown) - fastest and most accurate
   * 2. Extract from rendered HTML and convert to markdown - works with any HTML structure
   * 3. Convert parsedOutput to markdown - fallback for structured data
   */
  const handleCopyToClipboard = async () => {
    let textToCopy = ''
    
    try {
      // Method 1: Use formattedContent if available (already in markdown format)
      // This is the fastest and most accurate method
      if (formattedContent && formattedContent.trim()) {
        textToCopy = formattedContent
      }
      // Method 2: Extract from rendered HTML and convert to markdown
      // This works with any HTML structure and is future-proof
      else {
        const outputElement = document.getElementById('ai-output-content')
        if (outputElement && turndownServiceRef.current) {
          // Get the HTML content from the rendered output
          const htmlContent = outputElement.innerHTML
          
          // Convert HTML to markdown using turndown
          textToCopy = turndownServiceRef.current.turndown(htmlContent)
          
          // Clean up any extra whitespace
          textToCopy = textToCopy
            .replace(/\n{3,}/g, '\n\n') // Replace 3+ newlines with 2
            .trim()
        }
        // Method 3: Fallback - convert parsedOutput to markdown
        else if (parsedOutput) {
          textToCopy = formatOutputForCopy(parsedOutput, template?.slug)
        } else {
          return
        }
      }
      
      // Copy to clipboard
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      // Show "Copied" for 2 seconds like GPT
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      // Fallback: try using execCommand for older browsers
      try {
        const textArea = document.createElement('textarea')
        textArea.value = textToCopy
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (fallbackErr) {
        console.error('Fallback copy also failed:', fallbackErr)
      }
    }
  }

  const handleExport = async () => {
    // Get content to export
    let contentToExport = ''
    
    if (parsedOutput) {
      contentToExport = formatOutputForCopy(parsedOutput, template?.slug)
    } else if (formattedContent) {
      contentToExport = formattedContent
    } else {
      return
    }

    try {
      // Convert text to paragraphs for DOCX
      const paragraphs: Paragraph[] = []
      const lines = contentToExport.split('\n')
      
      for (const line of lines) {
        const trimmedLine = line.trim()
        
        if (!trimmedLine) {
          // Empty line
          paragraphs.push(new Paragraph({ text: '' }))
          continue
        }
        
        // Check for headers
        if (trimmedLine.startsWith('# ')) {
          paragraphs.push(
            new Paragraph({
              text: trimmedLine.substring(2),
              heading: HeadingLevel.HEADING_1,
            })
          )
        } else if (trimmedLine.startsWith('## ')) {
          paragraphs.push(
            new Paragraph({
              text: trimmedLine.substring(3),
              heading: HeadingLevel.HEADING_2,
            })
          )
        } else if (trimmedLine.startsWith('### ')) {
          paragraphs.push(
            new Paragraph({
              text: trimmedLine.substring(4),
              heading: HeadingLevel.HEADING_3,
            })
          )
        } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
          // Bullet point
          paragraphs.push(
            new Paragraph({
              text: trimmedLine.substring(2),
              bullet: { level: 0 },
            })
          )
        } else if (/^\d+\.\s/.test(trimmedLine)) {
          // Numbered list
          const match = trimmedLine.match(/^\d+\.\s(.+)/)
          if (match) {
            paragraphs.push(
              new Paragraph({
                text: match[1],
                numbering: { reference: 'default-numbering', level: 0 },
              })
            )
          }
        } else {
          // Regular paragraph
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: trimmedLine,
                }),
              ],
            })
          )
        }
      }

      // Create document
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: paragraphs.length > 0 ? paragraphs : [
              new Paragraph({
                children: [
                  new TextRun({
                    text: contentToExport,
                  }),
                ],
              }),
            ],
          },
        ],
      })

      // Generate and download
      const blob = await Packer.toBlob(doc)
      const fileName = `${template?.slug || 'output'}-${new Date().toISOString().split('T')[0]}.docx`
      saveAs(blob, fileName)
    } catch (err) {
      console.error('Failed to export:', err)
      // Fallback to plain text download
      const blob = new Blob([contentToExport], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${template?.slug || 'output'}.txt`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const handlePrint = () => {
    // Get the content element to print
    const outputElement = document.getElementById('ai-output-content')
    if (!outputElement) return

    // Create a new window for printing
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('Please allow popups to print')
      return
    }

    // Get the content HTML
    const content = outputElement.innerHTML
    
    // Create print-friendly HTML
    const printHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${template?.title || 'Generated Content'}</title>
          <style>
            @media print {
              @page {
                margin: 1in;
              }
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
              line-height: 1.8;
              color: #1f2937;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1 {
              font-size: 1.875rem;
              font-weight: 600;
              color: #111827;
              margin-top: 1.5rem;
              margin-bottom: 1rem;
            }
            h2 {
              font-size: 1.5rem;
              font-weight: 700;
              color: #111827;
              margin-top: 1.5rem;
              margin-bottom: 1rem;
            }
            h3 {
              font-size: 1.25rem;
              font-weight: 600;
              color: #111827;
              margin-top: 1.25rem;
              margin-bottom: 0.75rem;
            }
            h4 {
              font-size: 1.125rem;
              font-weight: 600;
              color: #1f2937;
              margin-top: 1rem;
              margin-bottom: 0.5rem;
            }
            p {
              font-size: 15px;
              line-height: 1.8;
              color: #1f2937;
              margin-bottom: 1rem;
            }
            ul, ol {
              margin-bottom: 1rem;
              padding-left: 1.5rem;
            }
            li {
              font-size: 15px;
              line-height: 1.8;
              color: #1f2937;
              margin-bottom: 0.25rem;
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `

    printWindow.document.write(printHTML)
    printWindow.document.close()

    // Wait for content to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
        // Close window after printing (optional)
        // printWindow.close()
      }, 250)
    }
  }


  const renderField = (field: TemplateField) => {
    const handleChange = (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => handleInputChange(field.name, event.target.value)

    // Ensure value is always a string for controlled components
    // Use initialFormValues as fallback to ensure consistent value
    const fieldValue = String(formValues[field.name] ?? initialFormValues[field.name] ?? field.default ?? '')

    const commonProps = {
      id: field.name,
      name: field.name,
      value: fieldValue,
      onChange: handleChange,
      required: field.required,
      className:
        'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder:text-gray-500',
    }

    if (field.type === 'textarea' || field.type === 'array') {
      return (
        <textarea 
          {...commonProps} 
          rows={field.type === 'array' ? 4 : 8} 
          placeholder={field.type === 'array' ? (field.placeholder || 'One item per line or comma-separated') : field.placeholder} 
          className={`${commonProps.className} resize-y min-h-[120px]`} 
        />
      )
    }

    if (field.type === 'select') {
      // Handle boolean fields specially (show Yes/No instead of true/false)
      const isBoolean = field.options?.length === 2 && 
                       field.options.includes('true') && 
                       field.options.includes('false')
      
      return (
        <select {...commonProps}>
          <option value="">Select {field.label ?? field.name}</option>
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>
              {isBoolean ? (option === 'true' ? 'Yes' : 'No') : option}
            </option>
          ))}
        </select>
      )
    }

    if (field.type === 'number') {
      return <input {...commonProps} type="number" min={field.min} max={field.max} placeholder={field.placeholder} />
    }

    return <input {...commonProps} type="text" placeholder={field.placeholder} />
  }

  const formatLessonFlow = (content: any): string => {
    if (typeof content === 'object' && content !== null) {
      const flow = content as Record<string, any>
      const steps = []
      
      if (flow.warm_up || flow.warmUp) {
        steps.push(`Step 1: Warm-Up / Hook\n${flow.warm_up || flow.warmUp || ''}`)
      }
      if (flow.main_instruction || flow.mainInstruction) {
        steps.push(`Step 2: Main Instruction\n${flow.main_instruction || flow.mainInstruction || ''}`)
      }
      if (flow.activity) {
        steps.push(`Step 3: Activity / Exploration\n${flow.activity || ''}`)
      }
      if (flow.closure) {
        steps.push(`Step 4: Closure / Reflection\n${flow.closure || ''}`)
      }
      
      return steps.join('\n\n')
    }
    return String(content || 'N/A')
  }

  // Format content like a Word document with proper typography
  const formatContentForDisplay = (content: any): React.ReactNode => {
    if (typeof content === 'string') {
      const lines = content.split('\n')
      const elements: React.ReactNode[] = []
      let currentParagraph: string[] = []
      let listItems: string[] = []
      let inList = false
      let listType: 'bullet' | 'number' | null = null

      lines.forEach((line, index) => {
        const trimmedLine = line.trim()
        
        // Detect markdown headings
        if (trimmedLine.match(/^#{1,6}\s/)) {
          if (currentParagraph.length > 0) {
            elements.push(
              <p key={`para-${index}`} className="mb-4 text-[15px] leading-[1.8] text-gray-800 font-normal">
                {currentParagraph.join(' ')}
              </p>
            )
            currentParagraph = []
          }
          if (inList && listItems.length > 0) {
            const ListComponent = listType === 'number' ? 'ol' : 'ul'
            elements.push(
              <ListComponent key={`list-${index}`} className={`mb-4 ml-6 space-y-1.5 ${listType === 'number' ? 'list-decimal' : 'list-disc'}`}>
                {listItems.map((item, i) => (
                  <li key={i} className="text-[15px] leading-[1.8] text-gray-800 pl-2">
                    {item.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '')}
                  </li>
                ))}
              </ListComponent>
            )
            listItems = []
            inList = false
          }
          const headingText = trimmedLine.replace(/^#{1,6}\s*/, '')
          const headingLevel = (trimmedLine.match(/^#+/) || [''])[0].length
          // Match project heading styles: h1=text-3xl font-semibold, h2=text-2xl font-bold, h3=text-xl font-semibold, h4=text-lg font-semibold
          let HeadingTag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' = 'h3'
          let headingClass = ''
          
          if (headingLevel === 1) {
            HeadingTag = 'h1'
            headingClass = 'mb-4 mt-6 text-3xl font-semibold text-gray-900 first:mt-0'
          } else if (headingLevel === 2) {
            HeadingTag = 'h2'
            headingClass = 'mb-4 mt-6 text-2xl font-bold text-gray-900'
          } else if (headingLevel === 3) {
            HeadingTag = 'h3'
            headingClass = 'mb-3 mt-5 text-xl font-semibold text-gray-900'
          } else if (headingLevel === 4) {
            HeadingTag = 'h4'
            headingClass = 'mb-2 mt-4 text-lg font-semibold text-gray-900'
          } else {
            HeadingTag = 'h5'
            headingClass = 'mb-2 mt-4 text-base font-semibold text-gray-900'
          }
          
          elements.push(
            <HeadingTag key={`heading-${index}`} className={headingClass}>
              {headingText}
            </HeadingTag>
          )
        }
        // Detect numbered list items
        else if (trimmedLine.match(/^\d+\.\s/)) {
          if (currentParagraph.length > 0) {
            elements.push(
              <p key={`para-${index}`} className="mb-4 text-[15px] leading-[1.8] text-gray-800 font-normal">
                {currentParagraph.join(' ')}
              </p>
            )
            currentParagraph = []
          }
          if (inList && listType && listItems.length > 0) {
            if (listType === 'bullet') {
              elements.push(
                <ul key={`list-${index}`} className="mb-4 ml-6 space-y-1.5 list-disc">
                  {listItems.map((item, i) => (
                    <li key={i} className="text-[15px] leading-[1.8] text-gray-800 pl-2">
                      {item.replace(/^[-•*]\s*/, '')}
                    </li>
                  ))}
                </ul>
              )
            } else {
              elements.push(
                <ol key={`list-${index}`} className="mb-4 ml-6 space-y-1.5 list-decimal">
                  {listItems.map((item, i) => (
                    <li key={i} className="text-[15px] leading-[1.8] text-gray-800 pl-2">
                      {item.replace(/^\d+\.\s*/, '')}
                    </li>
                  ))}
                </ol>
              )
            }
            listItems = []
          }
          inList = true
          listType = 'number'
          listItems.push(trimmedLine)
        }
        // Detect bullet list items
        else if (trimmedLine.match(/^[-•*]\s/)) {
          if (currentParagraph.length > 0) {
            elements.push(
              <p key={`para-${index}`} className="mb-4 text-[15px] leading-[1.8] text-gray-800 font-normal">
                {currentParagraph.join(' ')}
              </p>
            )
            currentParagraph = []
          }
          if (inList && listType && listItems.length > 0) {
            if (listType === 'number') {
              elements.push(
                <ol key={`list-${index}`} className="mb-4 ml-6 space-y-1.5 list-decimal">
                  {listItems.map((item, i) => (
                    <li key={i} className="text-[15px] leading-[1.8] text-gray-800 pl-2">
                      {item.replace(/^\d+\.\s*/, '')}
                    </li>
                  ))}
                </ol>
              )
            } else {
              elements.push(
                <ul key={`list-${index}`} className="mb-4 ml-6 space-y-1.5 list-disc">
                  {listItems.map((item, i) => (
                    <li key={i} className="text-[15px] leading-[1.8] text-gray-800 pl-2">
                      {item.replace(/^[-•*]\s*/, '')}
                    </li>
                  ))}
                </ul>
              )
            }
            listItems = []
          }
          inList = true
          listType = 'bullet'
          listItems.push(trimmedLine)
        }
        // Detect step patterns (Step 1:, Step 2:, etc.)
        else if (trimmedLine.match(/^Step\s+\d+:/i)) {
          if (currentParagraph.length > 0) {
            elements.push(
              <p key={`para-${index}`} className="mb-4 text-[15px] leading-[1.8] text-gray-800 font-normal">
                {currentParagraph.join(' ')}
              </p>
            )
            currentParagraph = []
          }
          if (inList && listItems.length > 0) {
            const ListComponent = listType === 'number' ? 'ol' : 'ul'
            elements.push(
              <ListComponent key={`list-${index}`} className={`mb-4 ml-6 space-y-1.5 ${listType === 'number' ? 'list-decimal' : 'list-disc'}`}>
                {listItems.map((item, i) => (
                  <li key={i} className="text-[15px] leading-[1.8] text-gray-800 pl-2">
                    {item.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '')}
                  </li>
                ))}
              </ListComponent>
            )
            listItems = []
            inList = false
          }
          const stepMatch = trimmedLine.match(/^(Step\s+\d+:\s*)(.+)/i)
          if (stepMatch) {
            elements.push(
              <div key={`step-${index}`} className="mb-3 mt-4">
                <h4 className="mb-2 text-lg font-semibold text-gray-900">
                  {stepMatch[1].trim()}
                </h4>
                <p className="text-[15px] leading-[1.8] text-gray-800 font-normal ml-4">
                  {stepMatch[2].trim()}
                </p>
              </div>
            )
          }
        }
        // Regular paragraph text
        else if (trimmedLine.length > 0) {
          if (inList && listItems.length > 0 && listType) {
            const ListComponent = listType === 'number' ? 'ol' : 'ul'
            elements.push(
              <ListComponent key={`list-${index}`} className={`mb-4 ml-6 space-y-1.5 ${listType === 'number' ? 'list-decimal' : 'list-disc'}`}>
                {listItems.map((item, i) => (
                  <li key={i} className="text-[15px] leading-[1.8] text-gray-800 pl-2">
                    {item.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '')}
                  </li>
                ))}
              </ListComponent>
            )
            listItems = []
            inList = false
            listType = null
          }
          currentParagraph.push(trimmedLine)
        }
        // Empty line - end current paragraph
        else if (trimmedLine.length === 0 && currentParagraph.length > 0) {
          elements.push(
            <p key={`para-${index}`} className="mb-4 text-[15px] leading-[1.8] text-gray-800 font-normal">
              {currentParagraph.join(' ')}
            </p>
          )
          currentParagraph = []
        }
      })

      // Handle remaining content
      if (currentParagraph.length > 0) {
        elements.push(
          <p key="para-final" className="mb-4 text-[15px] leading-[1.8] text-gray-800 font-normal">
            {currentParagraph.join(' ')}
          </p>
        )
      }
      if (inList && listItems.length > 0 && listType) {
        const ListComponent = listType === 'number' ? 'ol' : 'ul'
        elements.push(
          <ListComponent key="list-final" className={`mb-4 ml-6 space-y-1.5 ${listType === 'number' ? 'list-decimal' : 'list-disc'}`}>
            {listItems.map((item, i) => (
              <li key={i} className="text-[15px] leading-[1.8] text-gray-800 pl-2">
                {item.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '')}
              </li>
            ))}
          </ListComponent>
        )
      }

      return elements.length > 0 ? <div className="document-content">{elements}</div> : <p className="text-[15px] leading-[1.8] text-gray-800 font-normal">{content}</p>
    }

    // Handle object content
    if (typeof content === 'object' && content !== null) {
      if (Array.isArray(content)) {
        return (
          <ul className="mb-4 ml-6 space-y-2 list-disc">
            {content.map((item, i) => (
              <li key={i} className="text-[15px] leading-[1.8] text-gray-800 pl-2">
                {typeof item === 'object' ? JSON.stringify(item, null, 2) : String(item)}
              </li>
            ))}
          </ul>
        )
      }

      // Format object as key-value pairs with proper styling
      return (
        <div className="space-y-4">
          {Object.entries(content).map(([key, value], index) => (
            <div key={index} className="border-l-4 border-gray-300 pl-4 py-1">
              <h5 className="mb-2 text-base font-semibold text-gray-900 capitalize">
                {key.replace(/_/g, ' ')}
              </h5>
              <div className="text-[15px] leading-[1.8] text-gray-800">
                {typeof value === 'object' && value !== null ? (
                  <pre className="whitespace-pre-wrap font-sans text-sm bg-gray-50 p-3 rounded border border-gray-200">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                ) : (
                  <p className="font-normal">{String(value)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )
    }

    return <p className="text-[15px] leading-[1.8] text-gray-800 font-normal">{String(content)}</p>
  }

  const renderPreviewContent = () => {
    // Show placeholder if no result and not streaming
    if (!parsedOutput && !isStreaming && !streamedContent && !showOutput) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="mb-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Try a variety of inputs and input lengths to get the best results.
            </p>
          </div>
        </div>
      )
    }

    // Sections to exclude
    const excludedSections = ['BLOOM_ALIGNMENT', 'bloom_alignment', 'SAFETY_PRECAUTIONS', 'safety_precautions', 'TEACHER_NOTES', 'teacher_notes']

    // Show streaming or final content
    let contentToShow: Record<string, any> = {}
    let showStreamingContent = false
    
    // Priority: parsedOutput (completed) > streaming content > loading
    if (!isStreaming && parsedOutput) {
      // After streaming completes, show formatted parsed content with sections
      // This should remain visible permanently
      contentToShow = parsedOutput
    } else if (isStreaming && formattedContent && formattedContent.trim()) {
      // During streaming, use formattedContent directly from hook (updated on every chunk)
      // This ensures word-by-word display like Activity/ChatGPT
      showStreamingContent = true
      contentToShow = { _formatted_streaming: formattedContent }
    } else if (isStreaming && !formattedContent) {
      // Still streaming but no formatted content yet - show loading
      // Only show this during active streaming
      return (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
          <span>Generating your content...</span>
        </div>
      )
    } else if (!isStreaming && formattedContent && !parsedOutput) {
      // Streaming just completed but parsedOutput not ready yet - show formattedContent as fallback
      // This ensures content doesn't disappear during the brief moment between streaming end and parsing
      showStreamingContent = true
      contentToShow = { _formatted_streaming: formattedContent }
    } else if (!isStreaming && streamedContent && !formattedContent && !parsedOutput) {
      // Fallback: if we have raw content but no formatted, try to parse it
      // This should not happen, but handle gracefully - NEVER show raw JSON
      return (
        <div className="text-red-500 p-4">
          Error: Unable to format content. Please try again.
        </div>
      )
    }

    // Filter out excluded sections, but allow streaming sections
    const filteredContent = Object.entries(contentToShow).filter(
      ([section]) => !excludedSections.includes(section.toUpperCase()) && 
                     section !== '_streaming'
    )
    
    // If showing streaming content, format and display it EXACTLY like Activity
    // Activity uses dangerouslySetInnerHTML with formatLessonPlan - we do the same
    if (showStreamingContent && contentToShow._formatted_streaming) {
      // Convert markdown to HTML string (like Activity's formatLessonPlan)
      const formatMarkdownToHTML = (text: string): string => {
        if (!text) return ''
        
        // Convert markdown-style headers to HTML - match project font styles
        let formatted = text
          .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-semibold text-gray-900 mb-4 mt-6 first:mt-0">$1</h1>')
          .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-6">$1</h2>')
          .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold text-gray-900 mb-3 mt-5">$1</h3>')
          .replace(/^#### (.+)$/gm, '<h4 class="text-lg font-semibold text-gray-900 mb-2 mt-4">$1</h4>')
        
        // Convert bullet points - match project styles
        formatted = formatted.replace(/^- (.+)$/gm, '<li class="text-[15px] leading-[1.8] text-gray-800 mb-1">$1</li>')
        
        // Wrap consecutive list items in ul tags
        formatted = formatted.replace(/(<li class="text-\[15px\] leading-\[1\.8\] text-gray-800 mb-1">.*<\/li>\n?)+/g, (match) => {
          return '<ul class="mb-4 ml-6 space-y-1 list-disc">' + match + '</ul>'
        })
        
        // Convert bold text - match project styles
        formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
        
        // Convert numbered lists
        formatted = formatted.replace(/^\d+\.\s+(.+)$/gm, '<li class="text-[15px] leading-[1.8] text-gray-800 mb-1">$1</li>')
        
        // Split into paragraphs and format (like Activity)
        const lines = formatted.split('\n')
        const formattedLines: string[] = []
        let inList = false
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim()
          
          if (line.startsWith('<')) {
            // Already formatted HTML
            if (line.includes('</ul>')) {
              inList = false
            } else if (line.includes('<ul')) {
              inList = true
            }
            formattedLines.push(line)
          } else if (line) {
            // Regular text line
            if (!inList && !line.startsWith('<')) {
              formattedLines.push(`<p class="mb-4 text-[15px] leading-[1.8] text-gray-800">${line}</p>`)
            } else {
              formattedLines.push(line)
            }
          }
        }
        
        return formattedLines.join('\n')
      }
      
      const htmlContent = formatMarkdownToHTML(contentToShow._formatted_streaming)
      
      return (
        <div className="space-y-6 max-w-4xl">
          <div className="prose prose-gray max-w-none">
            <div 
              dangerouslySetInnerHTML={{__html: htmlContent}}
              className="streaming-content"
              id="streaming-text"
            />
            {/* Only show cursor during streaming, remove after completion */}
            {isStreaming && (
              <span className="inline-block w-0.5 h-5 bg-blue-500 ml-1 animate-pulse" />
            )}
          </div>
        </div>
      )
    }

    // After streaming completes, always show content if we have parsedOutput
    // Don't return null - ensure content remains visible
    if (filteredContent.length === 0 && !isStreaming && parsedOutput) {
      // If all sections were filtered out but we have parsedOutput, show a message
      return (
        <div className="text-sm text-gray-500 p-4">
          Content generated successfully. All sections were filtered out.
        </div>
      )
    }

    // If no content at all and not streaming, show nothing (but this shouldn't happen if parsedOutput exists)
    if (filteredContent.length === 0 && !isStreaming && !parsedOutput && !formattedContent) {
      return null
    }

    return (
      <div className="space-y-8 max-w-4xl">
        {filteredContent.length > 0 ? (
          filteredContent.map(([section, content]) => {
            const sectionTitle = section.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
            let displayContent = content

            // Format Lesson Flow section specially
            if (section.toLowerCase().includes('lesson_flow') || section.toLowerCase().includes('lesson flow')) {
              displayContent = formatLessonFlow(content)
            }

            return (
              <div key={section} className="pb-8 last:pb-0 border-b border-gray-200 last:border-b-0">
                {/* Main Section Heading - Match project heading style */}
                <h2 className="mb-6 text-2xl font-bold text-gray-900 tracking-tight leading-tight">
                  {sectionTitle}
                </h2>
                
                {/* Content Area - Use project font styles */}
                <div className="prose-document">
                  {formatContentForDisplay(displayContent)}
                </div>
              </div>
            )
          })
        ) : null}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          <p className="text-sm text-gray-500">Loading template...</p>
        </div>
      </div>
    )
  }

  if (error || !template) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600">{error ?? 'Template not found.'}</p>
          <button
            onClick={() => navigate('/templates')}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Templates
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-600">
            <li>
              <Link to="/templates" className="hover:text-gray-900">
                Templates
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">{template.title}</li>
          </ol>
        </nav>

        {/* Header with Title and Description */}
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">{template.title}</h1>
              {template.description && (
                <p className="text-sm text-gray-600">{template.description}</p>
              )}
          </div>
          {parsedOutput && !isStreaming && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyToClipboard()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-green-600" /> Copied
                  </>
                ) : (
                  <>
                      <Copy className="h-3.5 w-3.5" /> Copy
                  </>
                )}
              </button>
              <button
                onClick={handleRegenerate}
                disabled={isStreaming}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isStreaming ? 'animate-spin' : ''}`} />
                Regenerate
              </button>
            </div>
          )}
        </div>
      </div>

        {/* Prompt Editor Section - Collapsible */}
        {schemaFields.length > 0 && (
          <div className="mb-8">
            <button
              onClick={() => setShowPromptEditor(!showPromptEditor)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                {showPromptEditor ? (
                  <ChevronUp className="h-4 w-4 text-gray-600" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                )}
                <span className="text-sm font-medium text-gray-900">Prompt Editor</span>
              </div>
            </button>

            {showPromptEditor && (
              <div className="mt-4 border border-gray-200 rounded-lg p-6 bg-white">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {schemaFields.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <label htmlFor={field.name} className="block text-sm font-medium text-gray-900">
                        {field.label ?? field.name}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {renderField(field)}
                    </div>
                  ))}

                  {submitError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                      <p className="text-sm text-red-800">{submitError}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isStreaming || schemaFields.length === 0}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isStreaming ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Generate
                      </>
                    )}
                  </button>
                </form>
              </div>
              )}
            </div>
        )}

        {/* Output/Preview Section */}
        {schemaFields.length === 0 && (
          <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
            <p className="text-sm text-gray-500">This template does not define any input fields yet.</p>
          </div>
        )}

        {/* Output Display - Chat-like Message */}
        {(parsedOutput || isStreaming || formattedContent || showOutput) && (
          <div id="ai-output" className="mt-8">
            {/* AI Message Header */}
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Response:</h2>
              
              {/* Action Buttons Row */}
              <div className="flex items-center gap-2 flex-wrap mb-4">
                <button
                  onClick={() => handleCopyToClipboard()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  title="Copy"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-green-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleExport}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  title="Export as DOCX"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export
                </button>
                
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  title="Print content"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print
                </button>
                
                <button
                  onClick={() => setShowPromptEditor(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  title="Edit"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit
                </button>
                
                <div className="flex items-center gap-1 border-l border-gray-300 pl-2 ml-2">
                  <button
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Translate"
                  >
                    <Languages className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Read aloud"
                  >
                    <Volume2 className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Bookmark"
                  >
                    <Bookmark className="h-4 w-4 text-gray-600" />
                  </button>
            </div>
                
                <div className="flex items-center gap-1 border-l border-gray-300 pl-2 ml-2">
                  <button
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Like"
                  >
                    <ThumbsUp className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Dislike"
                  >
                    <ThumbsDown className="h-4 w-4 text-gray-600" />
                  </button>
          </div>
              </div>
            </div>

            {/* Output Content */}
            <div className="border border-gray-200 rounded-lg bg-white">
              <div id="ai-output-content" className="p-6">
            {renderPreviewContent()}
          </div>
        </div>

            {/* Review Prompt - Only show after completion, not during streaming */}
            {parsedOutput && !isStreaming && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  Please review the generated content to ensure it matches your expectations and classroom needs.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TemplateRunner

