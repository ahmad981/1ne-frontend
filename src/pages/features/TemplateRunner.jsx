import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Loader2, Copy, Check, RefreshCw, FileText, Send } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { executeTemplate, fetchTemplateDetail } from '../../api/templates'

const TemplateRunner = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [template, setTemplate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formValues, setFormValues] = useState({})
  const [submitError, setSubmitError] = useState(null)
  const [result, setResult] = useState(null)
  const [executing, setExecuting] = useState(false)
  const [regenerateCount, setRegenerateCount] = useState(0)
  const [copied, setCopied] = useState(false)
  const [streamingContent, setStreamingContent] = useState({})
  const [isStreaming, setIsStreaming] = useState(false)

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
        setResult(null)
        setStreamingContent({})
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

  const schemaFields = useMemo(() => {
    if (!template?.inputSchema) return []
    const fields = template.inputSchema?.fields
    if (!Array.isArray(fields)) return []
    return fields.filter((field) => Boolean(field?.name && field?.type))
  }, [template])

  // Initialize formValues synchronously with schemaFields
  const initialFormValues = useMemo(() => {
    if (schemaFields.length === 0) return {}
    const initial = {}
    schemaFields.forEach((field) => {
      // Use default value from schema if available, otherwise empty string
      initial[field.name] = field.default || ''
    })
    return initial
  }, [schemaFields])

  useEffect(() => {
    setFormValues(initialFormValues)
  }, [initialFormValues])

  const handleInputChange = (name, value) => {
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  // Simulate streaming effect like ChatGPT/Claude
  const streamText = (text, section, onComplete) => {
    const words = text.split(' ')
    let currentIndex = 0
    let currentText = ''

    const streamInterval = setInterval(() => {
      if (currentIndex < words.length) {
        currentText += (currentIndex > 0 ? ' ' : '') + words[currentIndex]
        setStreamingContent((prev) => ({
          ...prev,
          [section]: currentText,
        }))
        currentIndex++
      } else {
        clearInterval(streamInterval)
        onComplete()
      }
    }, 30) // Adjust speed here (lower = faster)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError(null)
    if (!template || !slug) return

    const missing = schemaFields.filter((field) => field.required && !formValues[field.name]?.trim())
    if (missing.length > 0) {
      setSubmitError(`Please fill in: ${missing.map((field) => field.label ?? field.name).join(', ')}`)
      return
    }

    const payload = {}
    schemaFields.forEach((field) => {
      const raw = formValues[field.name]
      if (!raw) return
      if (field.type === 'number') {
        const numericValue = Number(raw)
        payload[field.name] = Number.isNaN(numericValue) ? raw : numericValue
      } else {
        payload[field.name] = raw
      }
    })

    setExecuting(true)
    setIsStreaming(true)
    setStreamingContent({})
    setRegenerateCount(0)
    
    try {
      const response = await executeTemplate(slug, payload, 0)
      setResult(response)
      setSubmitError(null)

      // Stream each section
      if (response.result.professionalOutput) {
        const sections = Object.entries(response.result.professionalOutput)
        let completedSections = 0

        sections.forEach(([section, content], index) => {
          const contentText = typeof content === 'object' && content !== null
            ? JSON.stringify(content, null, 2)
            : String(content || '')

          setTimeout(() => {
            streamText(contentText, section, () => {
              completedSections++
              if (completedSections === sections.length) {
                setIsStreaming(false)
              }
            })
          }, index * 500) // Stagger sections
        })
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to run template.')
      setIsStreaming(false)
    } finally {
      setExecuting(false)
    }
  }

  const handleRegenerate = async () => {
    if (!template || !slug) return
    
    setExecuting(true)
    setIsStreaming(true)
    setStreamingContent({})
    const newCount = regenerateCount + 1
    setRegenerateCount(newCount)
    
    const payload = {}
    schemaFields.forEach((field) => {
      const raw = formValues[field.name]
      if (!raw) return
      if (field.type === 'number') {
        const numericValue = Number(raw)
        payload[field.name] = Number.isNaN(numericValue) ? raw : numericValue
      } else {
        payload[field.name] = raw
      }
    })
    
    try {
      const response = await executeTemplate(slug, payload, newCount)
      setResult(response)
      setSubmitError(null)

      // Stream each section
      if (response.result.professionalOutput) {
        const sections = Object.entries(response.result.professionalOutput)
        let completedSections = 0

        sections.forEach(([section, content], index) => {
          const contentText = typeof content === 'object' && content !== null
            ? JSON.stringify(content, null, 2)
            : String(content || '')

          setTimeout(() => {
            streamText(contentText, section, () => {
              completedSections++
              if (completedSections === sections.length) {
                setIsStreaming(false)
              }
            })
          }, index * 500)
        })
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to regenerate.')
      setIsStreaming(false)
    } finally {
      setExecuting(false)
    }
  }

  const formatOutputForCopy = (output, templateSlug) => {
    // Sections to exclude
    const excludedSections = ['BLOOM_ALIGNMENT', 'bloom_alignment', 'SAFETY_PRECAUTIONS', 'safety_precautions', 'TEACHER_NOTES', 'teacher_notes']
    
    // Filter out excluded sections
    const filteredOutput = Object.fromEntries(
      Object.entries(output).filter(([key]) => !excludedSections.includes(key.toUpperCase()))
    )

    if (templateSlug === 'general-lesson-plan') {
      // Format for lesson plan structure
      const formatValue = (val) => {
        if (typeof val === 'object' && val !== null) {
          if (Array.isArray(val)) {
            return val.map(item => `- ${item}`).join('\n')
          }
          return Object.entries(val)
            .map(([k, v]) => `${k}: ${v}`)
            .join('\n')
        }
        return String(val || 'N/A')
      }

      const formatLessonFlowSteps = (flow) => {
        if (!flow || typeof flow !== 'object') return 'N/A'
        
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
      
      return `# Lesson Plan

## ${filteredOutput.lesson_overview || filteredOutput['Lesson Overview'] || 'Lesson Overview'}

### Learning Intentions / Objectives
${formatValue(filteredOutput.learning_intentions || filteredOutput['Learning Intentions / Objectives'] || 'N/A')}

### Success Criteria
${formatValue(filteredOutput.success_criteria || filteredOutput['Success Criteria'] || 'N/A')}

### Required Materials
${formatValue(filteredOutput.required_materials || filteredOutput['Required Materials'] || 'N/A')}

### Lesson Flow

${formatLessonFlowSteps(filteredOutput.lesson_flow || filteredOutput['Lesson Flow'] || {})}

### Differentiation Strategies

#### A. Support (Struggling Learners / ESL)
${formatValue(filteredOutput.differentiation?.support || filteredOutput['Differentiation']?.support || 'N/A')}

#### B. Extension (Advanced Learners)
${formatValue(filteredOutput.differentiation?.extension || filteredOutput['Differentiation']?.extension || 'N/A')}

### Formative Assessment
${formatValue(filteredOutput.formative_assessment || filteredOutput['Formative Assessment'] || 'N/A')}
`
    }
    
    // Default format for other templates
    return Object.entries(filteredOutput)
      .map(([key, value]) => {
        let formattedValue = typeof value === 'object' && value !== null
          ? JSON.stringify(value, null, 2)
          : String(value || 'N/A')
        
        // Format Lesson Flow if present
        if (key.toLowerCase().includes('lesson_flow') || key.toLowerCase().includes('lesson flow')) {
          formattedValue = formatLessonFlow(value)
        }
        
        return `## ${key}\n\n${formattedValue}\n`
      })
      .join('\n---\n\n')
  }

  const handleCopyToClipboard = async () => {
    if (!result?.result?.professionalOutput) return
    
    const textToCopy = formatOutputForCopy(result.result.professionalOutput, template?.slug)
    
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }


  const renderField = (field) => {
    const handleChange = (event) => handleInputChange(field.name, event.target.value)

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
        'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder:text-gray-400',
    }

    if (field.type === 'textarea') {
      return <textarea {...commonProps} rows={4} placeholder={field.placeholder} className={`${commonProps.className} resize-none`} />
    }

    if (field.type === 'select') {
      return (
        <select {...commonProps}>
          <option value="">Select {field.label ?? field.name}</option>
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
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

  const formatLessonFlow = (content) => {
    if (typeof content === 'object' && content !== null) {
      const flow = content
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
  const formatContentForDisplay = (content) => {
    if (typeof content === 'string') {
      const lines = content.split('\n')
      const elements = []
      let currentParagraph = []
      let listItems = []
      let inList = false
      let listType = null

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
          const HeadingTag = headingLevel <= 2 ? 'h3' : headingLevel <= 4 ? 'h4' : 'h5'
          const headingClass = headingLevel <= 2 
            ? 'mb-3 mt-6 text-xl font-bold text-gray-900 first:mt-0'
            : headingLevel <= 4
            ? 'mb-2.5 mt-5 text-lg font-semibold text-gray-900'
            : 'mb-2 mt-4 text-base font-semibold text-gray-900'
          
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
    if (!result?.result?.professionalOutput && !isStreaming) {
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
    const displayContent = result?.result?.professionalOutput || {}
    const contentToShow = isStreaming ? streamingContent : displayContent

    // Filter out excluded sections
    const filteredContent = Object.entries(contentToShow).filter(
      ([section]) => !excludedSections.includes(section.toUpperCase())
    )

    return (
      <div className="space-y-8 max-w-4xl font-serif">
        {filteredContent.map(([section, content]) => {
          const sectionTitle = section.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
          let displayContent = content
          const isStreamingThis = isStreaming && streamingContent[section] !== undefined

          // Format Lesson Flow section specially
          if (section.toLowerCase().includes('lesson_flow') || section.toLowerCase().includes('lesson flow')) {
            displayContent = formatLessonFlow(content)
          }

          return (
            <div key={section} className="pb-8 last:pb-0 border-b border-gray-200 last:border-b-0">
              {/* Main Section Heading - Word Document Style */}
              <h2 className="mb-6 text-2xl font-bold text-gray-900 tracking-tight leading-tight">
                {sectionTitle}
              </h2>
              
              {/* Content Area with Word-like formatting */}
              <div className="prose-document">
                {isStreamingThis ? (
                  <div className="text-[15px] leading-[1.8] text-gray-800 whitespace-pre-wrap font-normal">
                    {typeof displayContent === 'string' ? displayContent : String(displayContent || '')}
                    <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse" />
                  </div>
                ) : (
                  formatContentForDisplay(displayContent)
                )}
              </div>
            </div>
          )
        })}
        {isStreaming && Object.keys(streamingContent).length === 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Generating your lesson plan...</span>
          </div>
        )}
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
    <div className="flex h-[calc(100vh-5rem)] flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/templates')}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-base font-semibold text-gray-900">{template.title}</h1>
              {template.description && (
                <p className="text-xs text-gray-500 mt-0.5">{template.description}</p>
              )}
            </div>
          </div>
          {result?.result?.professionalOutput && !isStreaming && (
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
                    <Copy className="h-3.5 w-3.5" /> Copy All
                  </>
                )}
              </button>
              <button
                onClick={handleRegenerate}
                disabled={executing}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${executing ? 'animate-spin' : ''}`} />
                Regenerate
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Split Screen Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Form (30%) */}
        <div className="w-[30%] border-r border-gray-200 bg-gray-50 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              {schemaFields.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">This template does not define any input fields yet.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {schemaFields.map((field) => (
                    <div key={field.name} className="space-y-1.5">
                      <label htmlFor={field.name} className="block text-xs font-medium text-gray-700">
                        {field.label ?? field.name}
                        {field.required && <span className="text-red-500 ml-0.5">*</span>}
                      </label>
                      {renderField(field)}
                    </div>
                  ))}

                  {submitError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                      <p className="text-xs text-red-800">{submitError}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={executing || schemaFields.length === 0}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {executing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Generate Lesson Plan
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Preview (70%) */}
        <div className="w-[70%] bg-white flex flex-col">
          <div className="border-b border-gray-200 px-6 py-2.5 bg-gray-50 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${isStreaming ? 'bg-green-500 animate-pulse' : result?.result?.professionalOutput ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="text-xs font-medium text-gray-700">Preview</span>
              {isStreaming && (
                <span className="text-xs text-gray-500 ml-auto">Generating...</span>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {renderPreviewContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TemplateRunner

