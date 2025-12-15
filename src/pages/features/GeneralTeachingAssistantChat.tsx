import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Send,
  Bot,
  User,
  Copy,
  RefreshCw,
  Plus,
  Trash2,
  Loader2,
  Sparkles,
  CheckCircle2,
  History,
  X,
  Search,
  Calendar,
  MessageSquare,
  GraduationCap,
  BookOpen,
  FileText,
  Users,
  Target,
  Lightbulb,
  Edit,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  StopCircle,
  Zap,
  PenTool,
  ClipboardCheck,
  HeartHandshake,
  Upload,
  Paperclip,
  Image,
  File,
  Mic,
  MicOff,
  Volume2,
  Settings,
  ChevronDown,
  Brain,
  Gauge,
  Sparkles as SparklesIcon,
  HelpCircle,
  Accessibility,
  FileQuestion,
  AlignLeft,
  Bookmark,
  ChevronRight,
  Globe,
} from 'lucide-react'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

const GeneralTeachingAssistantChat = () => {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [historySearchQuery, setHistorySearchQuery] = useState('')
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editInputValue, setEditInputValue] = useState('')
  const [messageActionMenu, setMessageActionMenu] = useState<string | null>(null)
  const [canStopGeneration, setCanStopGeneration] = useState(false)
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set())
  const [dislikedMessages, setDislikedMessages] = useState<Set<string>>(new Set())
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [showUploadMenu, setShowUploadMenu] = useState(false)
  const [botMode, setBotMode] = useState<'fastest' | 'smartest' | 'critical-thinking'>('smartest')
  const [showModeMenu, setShowModeMenu] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [responseLength, setResponseLength] = useState<'short' | 'medium' | 'long'>('medium')
  const [webSearchEnabled, setWebSearchEnabled] = useState(false)
  const [showActionsMenu, setShowActionsMenu] = useState(false)
  const [showLengthMenu, setShowLengthMenu] = useState(false)
  const [customPrompts, setCustomPrompts] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const editTextareaRef = useRef<HTMLTextAreaElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const documentInputRef = useRef<HTMLInputElement>(null)
  const allFilesInputRef = useRef<HTMLInputElement>(null)

  // Load conversations from localStorage on mount
  useEffect(() => {
    const savedConversations = localStorage.getItem('general-teaching-assistant-conversations')
    const savedCurrentId = localStorage.getItem('general-teaching-assistant-current-conversation')
    
    if (savedConversations) {
      const parsed = JSON.parse(savedConversations).map((conv: any) => ({
        ...conv,
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
      }))
      setConversations(parsed)
      
      if (savedCurrentId && parsed.find((c: Conversation) => c.id === savedCurrentId)) {
        setCurrentConversationId(savedCurrentId)
        const currentConv = parsed.find((c: Conversation) => c.id === savedCurrentId)
        if (currentConv) {
          setMessages(currentConv.messages)
        }
      }
    }
  }, [])

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('general-teaching-assistant-conversations', JSON.stringify(conversations))
    }
  }, [conversations])

  // Save current conversation ID
  useEffect(() => {
    if (currentConversationId) {
      localStorage.setItem('general-teaching-assistant-current-conversation', currentConversationId)
    }
  }, [currentConversationId])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [inputValue])

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (messageActionMenu && !target.closest('.message-action-menu')) {
        setMessageActionMenu(null)
      }
      if (showUploadMenu && !target.closest('.upload-menu-container')) {
        setShowUploadMenu(false)
      }
      if (showModeMenu && !target.closest('.mode-menu-container')) {
        setShowModeMenu(false)
      }
      if (showActionsMenu && !target.closest('.actions-menu-container')) {
        setShowActionsMenu(false)
      }
      if (showLengthMenu && !target.closest('.length-menu-container')) {
        setShowLengthMenu(false)
      }
    }

    if (messageActionMenu || showUploadMenu || showModeMenu || showActionsMenu || showLengthMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [messageActionMenu, showUploadMenu, showModeMenu, showActionsMenu, showLengthMenu])

  // Auto-focus edit textarea when editing
  useEffect(() => {
    if (editingMessageId && editTextareaRef.current) {
      editTextareaRef.current.focus()
      editTextareaRef.current.style.height = 'auto'
      editTextareaRef.current.style.height = `${editTextareaRef.current.scrollHeight}px`
    }
  }, [editingMessageId, editInputValue])

  const generateConversationTitle = (firstMessage: string): string => {
    const words = firstMessage.split(' ').slice(0, 6).join(' ')
    return words.length > 50 ? words.substring(0, 50) + '...' : words
  }

  const createNewConversation = () => {
    setCurrentConversationId(null)
    setMessages([])
    setInputValue('')
  }

  const saveConversation = (newMessages: Message[]) => {
    if (newMessages.length === 0) return

    const now = new Date()
    const title = generateConversationTitle(newMessages[0].content)

    if (currentConversationId) {
      // Update existing conversation
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === currentConversationId
            ? {
                ...conv,
                messages: newMessages,
                title: newMessages.length > 1 ? title : conv.title,
                updatedAt: now,
              }
            : conv
        )
      )
    } else {
      // Create new conversation
      const newId = `conv-${Date.now()}`
      const newConversation: Conversation = {
        id: newId,
        title,
        messages: newMessages,
        createdAt: now,
        updatedAt: now,
      }
      setConversations((prev) => [newConversation, ...prev])
      setCurrentConversationId(newId)
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInputValue('')
    setIsLoading(true)
    setCanStopGeneration(true)

    // Save conversation after user message
    saveConversation(newMessages)

    // Simulate API call - TODO: Replace with actual API call
    const timeoutId = setTimeout(() => {
      const responseContent = generateMockResponse(userMessage.content)
      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      }

      const updatedMessages = [...newMessages, assistantMessage]
      setMessages(updatedMessages)
      setIsLoading(false)
      setCanStopGeneration(false)
      saveConversation(updatedMessages)
      
      // Play audio if enabled
      if (audioEnabled) {
        speakText(responseContent)
      }
    }, 1500)

    // Store timeout ID for stop functionality
    ;(window as any).currentGenerationTimeout = timeoutId
  }

  const handleStopGeneration = () => {
    if ((window as any).currentGenerationTimeout) {
      clearTimeout((window as any).currentGenerationTimeout)
      setIsLoading(false)
      setCanStopGeneration(false)
    }
  }

  const handleEditMessage = (messageId: string) => {
    const message = messages.find((m) => m.id === messageId)
    if (message && message.role === 'user') {
      setEditingMessageId(messageId)
      setEditInputValue(message.content)
      setMessageActionMenu(null)
    }
  }

  const handleSaveEdit = () => {
    if (!editingMessageId || !editInputValue.trim()) return

    const messageIndex = messages.findIndex((m) => m.id === editingMessageId)
    if (messageIndex !== -1) {
      const updatedMessages = [...messages]
      updatedMessages[messageIndex] = {
        ...updatedMessages[messageIndex],
        content: editInputValue.trim(),
        timestamp: new Date(),
      }
      // Remove all messages after the edited one
      const finalMessages = updatedMessages.slice(0, messageIndex + 1)
      setMessages(finalMessages)
      setEditingMessageId(null)
      setEditInputValue('')
      saveConversation(finalMessages)
    }
  }

  const handleCancelEdit = () => {
    setEditingMessageId(null)
    setEditInputValue('')
  }

  const handleDeleteMessage = (messageId: string) => {
    const messageIndex = messages.findIndex((m) => m.id === messageId)
    if (messageIndex !== -1) {
      const updatedMessages = messages.filter((m) => m.id !== messageId)
      setMessages(updatedMessages)
      setMessageActionMenu(null)
      saveConversation(updatedMessages)
    }
  }

  const handleRegenerateResponse = async () => {
    // Find the last assistant message
    const lastAssistantIndex = messages.map((m) => m.role).lastIndexOf('assistant')
    if (lastAssistantIndex === -1) return

    // Get the user message before the assistant response
    const userMessage = messages[lastAssistantIndex - 1]
    if (!userMessage) return

    // Remove the last assistant message
    const messagesUpToUser = messages.slice(0, lastAssistantIndex)
    setMessages(messagesUpToUser)
    setIsLoading(true)
    setCanStopGeneration(true)

    // Regenerate response
    const timeoutId = setTimeout(() => {
      const responseContent = generateMockResponse(userMessage.content)
      const newAssistantMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      }

      const updatedMessages = [...messagesUpToUser, newAssistantMessage]
      setMessages(updatedMessages)
      setIsLoading(false)
      setCanStopGeneration(false)
      saveConversation(updatedMessages)
      
      // Play audio if enabled
      if (audioEnabled) {
        speakText(responseContent)
      }
    }, 1500)

    ;(window as any).currentGenerationTimeout = timeoutId
  }

  const handleFeedback = (messageId: string, type: 'like' | 'dislike') => {
    if (type === 'like') {
      setLikedMessages((prev) => {
        const newSet = new Set(prev)
        if (newSet.has(messageId)) {
          newSet.delete(messageId)
        } else {
          newSet.add(messageId)
          setDislikedMessages((prevDislike) => {
            const newDislikeSet = new Set(prevDislike)
            newDislikeSet.delete(messageId)
            return newDislikeSet
          })
        }
        return newSet
      })
    } else {
      setDislikedMessages((prev) => {
        const newSet = new Set(prev)
        if (newSet.has(messageId)) {
          newSet.delete(messageId)
        } else {
          newSet.add(messageId)
          setLikedMessages((prevLike) => {
            const newLikeSet = new Set(prevLike)
            newLikeSet.delete(messageId)
            return newLikeSet
          })
        }
        return newSet
      })
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachedFiles((prev) => [...prev, ...files])
    setShowUploadMenu(false)
    // Reset input values
    if (imageInputRef.current) imageInputRef.current.value = ''
    if (documentInputRef.current) documentInputRef.current.value = ''
    if (allFilesInputRef.current) allFilesInputRef.current.value = ''
  }

  const handleRemoveFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image
    if (file.type.includes('pdf')) return FileText
    return File
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        // Convert audio to text (mock implementation)
        // In production, this would call a speech-to-text API
        setIsRecording(false)
        stream.getTracks().forEach((track) => track.stop())
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Could not access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
      // In production, process the audio and convert to text
      // For now, just simulate adding text
      setInputValue((prev) => prev + ' [Audio message transcribed]')
    }
  }

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled)
  }

  const speakText = (text: string) => {
    if ('speechSynthesis' in window && audioEnabled) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 1
      window.speechSynthesis.speak(utterance)
    }
  }

  const botModeConfig = {
    fastest: {
      label: 'Fastest',
      icon: Gauge,
      description: 'Quick responses, optimized for speed',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    smartest: {
      label: 'Smartest',
      icon: Brain,
      description: 'Balanced intelligence and speed',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    'critical-thinking': {
      label: 'Critical Thinking',
      icon: SparklesIcon,
      description: 'Deep analysis and reasoning',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
  }

  const responseLengthConfig = {
    short: { label: 'Short', description: 'Brief, concise responses' },
    medium: { label: 'Medium', description: 'Balanced detail' },
    long: { label: 'Long', description: 'Comprehensive, detailed responses' },
  }

  const handleResponseLengthChange = (length: 'short' | 'medium' | 'long') => {
    setResponseLength(length)
    setShowActionsMenu(false)
  }

  const toggleWebSearch = () => {
    setWebSearchEnabled(!webSearchEnabled)
  }

  const handleAction = (actionType: string) => {
    setShowActionsMenu(false)
    switch (actionType) {
      case 'questions':
        if (messages.length > 0) {
          const lastMessage = messages[messages.length - 1]
          if (lastMessage.role === 'assistant') {
            setInputValue(`Generate questions based on: ${lastMessage.content.substring(0, 100)}...`)
          }
        }
        break
      case 'summarize':
        if (messages.length > 0) {
          const lastMessage = messages[messages.length - 1]
          if (lastMessage.role === 'assistant') {
            setInputValue(`Summarize this: ${lastMessage.content.substring(0, 100)}...`)
          }
        }
        break
      case 'custom-prompts':
        // Open custom prompts modal or show saved prompts
        break
      default:
        break
    }
  }

  const saveCustomPrompt = (prompt: string) => {
    if (prompt.trim() && !customPrompts.includes(prompt.trim())) {
      setCustomPrompts((prev) => [...prev, prompt.trim()])
      localStorage.setItem('custom-prompts', JSON.stringify([...customPrompts, prompt.trim()]))
    }
  }

  // Load custom prompts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('custom-prompts')
    if (saved) {
      setCustomPrompts(JSON.parse(saved))
    }
  }, [])

  const generateMockResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    // Simple keyword-based responses for demo
    if (lowerMessage.includes('lesson plan') || lowerMessage.includes('lesson planning')) {
      return `I'd be happy to help you create a lesson plan! Here are some key components to consider:

**1. Learning Objectives**
- What should students know or be able to do by the end of the lesson?
- Make objectives specific, measurable, and aligned with standards

**2. Materials & Resources**
- What materials will you need?
- Are there any digital resources or handouts?

**3. Lesson Structure**
- **Introduction/Hook** (5-10 min): Engage students and activate prior knowledge
- **Direct Instruction** (15-20 min): Teach new concepts
- **Guided Practice** (10-15 min): Students practice with support
- **Independent Practice** (10-15 min): Students work independently
- **Closure** (5 min): Review and assess understanding

**4. Assessment**
- Formative: Exit tickets, observations, quick checks
- Summative: Quizzes, projects, presentations

Would you like me to help you create a specific lesson plan? Please share the subject, grade level, and topic!`
    } else if (lowerMessage.includes('assessment') || lowerMessage.includes('test') || lowerMessage.includes('quiz')) {
      return `Great question about assessments! Here are some effective assessment strategies:

**Formative Assessments** (during learning):
- Exit tickets
- Think-pair-share
- Quick polls or thumbs up/down
- One-minute papers
- Observation checklists

**Summative Assessments** (end of learning):
- Traditional tests and quizzes
- Projects and presentations
- Portfolios
- Performance tasks
- Essays or written responses

**Tips for Effective Assessment:**
1. Align assessments with learning objectives
2. Use a variety of assessment types
3. Provide timely feedback
4. Make assessments authentic and relevant
5. Consider different learning styles

What type of assessment are you looking to create? I can help you design something specific!`
    } else if (lowerMessage.includes('classroom management') || lowerMessage.includes('behavior')) {
      return `Classroom management is crucial for effective teaching! Here are some proven strategies:

**Proactive Strategies:**
- Establish clear expectations and routines from day one
- Build positive relationships with students
- Create an engaging learning environment
- Use positive reinforcement
- Implement consistent consequences

**Reactive Strategies:**
- Address issues privately when possible
- Use proximity and non-verbal cues
- Give choices: "You can work quietly here or move to this seat"
- Follow through with established consequences
- Involve parents/guardians when needed

**Key Principles:**
- Be fair and consistent
- Focus on the behavior, not the student
- Model the behavior you expect
- Celebrate small wins
- Take care of yourself - teacher burnout affects classroom management

What specific classroom management challenge are you facing? I can provide more targeted advice!`
    } else if (lowerMessage.includes('differentiation') || lowerMessage.includes('different learners')) {
      return `Differentiation is about meeting students where they are! Here are key strategies:

**Content Differentiation:**
- Vary the complexity of materials
- Use leveled texts or resources
- Provide multiple entry points

**Process Differentiation:**
- Offer different ways to learn (visual, auditory, kinesthetic)
- Use flexible grouping
- Provide scaffolds and supports

**Product Differentiation:**
- Allow choice in how students demonstrate learning
- Offer different project options
- Use tiered assignments

**Environment Differentiation:**
- Create flexible seating options
- Designate quiet spaces
- Organize materials for easy access

**Quick Tips:**
- Start small - differentiate one aspect at a time
- Use pre-assessments to understand student needs
- Provide choice boards or learning menus
- Don't try to differentiate everything every day

What subject and grade level are you working with? I can suggest specific differentiation strategies!`
    } else {
      return `I'm here to help you with your teaching needs! I can assist with:

📚 **Lesson Planning** - Create standards-aligned lesson plans
📝 **Assessment Design** - Develop formative and summative assessments
👥 **Classroom Management** - Strategies for positive classroom culture
🎯 **Differentiation** - Adapt instruction for diverse learners
💡 **Teaching Strategies** - Evidence-based instructional methods
📊 **Curriculum Alignment** - Align lessons with standards
🔧 **Resource Recommendations** - Suggest teaching tools and materials

What would you like help with today? Feel free to ask me anything about teaching, lesson planning, or classroom strategies!`
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyToClipboard = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formatTimestamp = (date: Date): string => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  const renderMarkdown = (text: string): JSX.Element => {
    // Simple markdown rendering - split by lines and handle basic formatting
    const lines = text.split('\n')
    return (
      <div className="space-y-2">
        {lines.map((line, idx) => {
          // Bold text
          if (line.startsWith('**') && line.endsWith('**')) {
            return (
              <p key={idx} className="font-semibold text-gray-900">
                {line.slice(2, -2)}
              </p>
            )
          }
          // List items
          if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
            return (
              <li key={idx} className="ml-4 list-disc text-gray-700">
                {line.trim().substring(1).trim()}
              </li>
            )
          }
          // Numbered lists
          if (/^\d+\./.test(line.trim())) {
            return (
              <li key={idx} className="ml-4 list-decimal text-gray-700">
                {line.trim().substring(line.trim().indexOf('.') + 1).trim()}
              </li>
            )
          }
          // Emoji headers
          if (/^[📚📝👥🎯💡📊🔧]/.test(line.trim())) {
            return (
              <p key={idx} className="font-semibold text-gray-900 mt-3">
                {line.trim()}
              </p>
            )
          }
          // Regular paragraph
          if (line.trim()) {
            return (
              <p key={idx} className="text-gray-700 leading-relaxed">
                {line}
              </p>
            )
          }
          return <br key={idx} />
        })}
      </div>
    )
  }

  const clearCurrentConversation = () => {
    if (currentConversationId) {
      setConversations((prev) => prev.filter((conv) => conv.id !== currentConversationId))
      setCurrentConversationId(null)
      localStorage.removeItem('general-teaching-assistant-current-conversation')
    }
    setMessages([])
  }

  const loadConversation = (conversationId: string) => {
    const conversation = conversations.find((conv) => conv.id === conversationId)
    if (conversation) {
      setCurrentConversationId(conversationId)
      setMessages(conversation.messages)
      setShowHistory(false)
    }
  }

  const deleteConversation = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setConversations((prev) => prev.filter((conv) => conv.id !== conversationId))
    if (currentConversationId === conversationId) {
      setCurrentConversationId(null)
      setMessages([])
      localStorage.removeItem('general-teaching-assistant-current-conversation')
    }
  }

  const deleteAllConversations = () => {
    if (window.confirm('Are you sure you want to delete all conversations? This cannot be undone.')) {
      setConversations([])
      setCurrentConversationId(null)
      setMessages([])
      localStorage.removeItem('general-teaching-assistant-conversations')
      localStorage.removeItem('general-teaching-assistant-current-conversation')
      setShowHistory(false)
    }
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
    conv.messages.some((msg) => msg.content.toLowerCase().includes(historySearchQuery.toLowerCase()))
  )

  const formatDate = (date: Date): string => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    if (days < 365) return `${Math.floor(days / 30)} months ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="flex h-screen flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-3 shadow-sm z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard/chatbots')}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-sm">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">General Teaching Assistant</h1>
              <p className="text-xs text-gray-500">Your versatile AI companion for teaching</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Bot Mode Selector */}
            <div className="relative mode-menu-container">
              <button
                onClick={() => setShowModeMenu(!showModeMenu)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  botModeConfig[botMode].borderColor
                } ${botModeConfig[botMode].bgColor} ${botModeConfig[botMode].color} border-2 hover:shadow-sm`}
              >
                {(() => {
                  const ModeIcon = botModeConfig[botMode].icon
                  return <ModeIcon className="h-4 w-4" />
                })()}
                <span>{botModeConfig[botMode].label}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              {showModeMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-gray-200 bg-white shadow-xl z-50 overflow-hidden mode-menu-container">
                  <div className="p-2">
                    {Object.entries(botModeConfig).map(([key, config]) => {
                      const ModeIcon = config.icon
                      return (
                        <button
                          key={key}
                          onClick={() => {
                            setBotMode(key as 'fastest' | 'smartest' | 'critical-thinking')
                            setShowModeMenu(false)
                          }}
                          className={`w-full flex items-start gap-3 p-3 rounded-lg transition ${
                            botMode === key
                              ? `${config.bgColor} ${config.borderColor} border-2`
                              : 'hover:bg-gray-50 border-2 border-transparent'
                          }`}
                        >
                          <ModeIcon className={`h-5 w-5 mt-0.5 ${config.color}`} />
                          <div className="flex-1 text-left">
                            <div className={`font-semibold ${config.color}`}>{config.label}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{config.description}</div>
                          </div>
                          {botMode === key && (
                            <CheckCircle2 className={`h-5 w-5 ${config.color}`} />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={createNewConversation}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                showHistory
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <History className="h-4 w-4" />
              History
              {conversations.length > 0 && (
                <span className="ml-1 rounded-full bg-blue-100 px-1.5 py-0.5 text-xs font-semibold text-blue-600">
                  {conversations.length}
                </span>
              )}
            </button>
            {messages.length > 0 && (
              <button
                onClick={clearCurrentConversation}
                className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area - Centered Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Messages Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-4xl px-4 py-8">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                  {/* Character Avatar Section */}
                  <div className="mb-8 text-center">
                    <div className="mb-6 flex justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 shadow-2xl ring-4 ring-white">
                          <GraduationCap className="h-12 w-12 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1">
                          <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
                        </div>
                      </div>
                    </div>
                    <div className="mb-2 flex items-center justify-center gap-2">
                      <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                        Hello! I'm General Teaching Assistant
                      </h2>
                      <button className="p-1 text-gray-400 hover:text-gray-600 transition">
                        <HelpCircle className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-sm font-medium text-purple-600 mb-6">Made for Teachers</p>
                    <div className="max-w-2xl mx-auto">
                      <p className="text-base text-gray-700 leading-relaxed">
                        Hello! I'm your AI instructional coach. You can ask any questions related to best practices in teaching or your work in a school building. Feel free to ask me for ideas for your classroom, research on best practices in pedagogy, behavior management strategies, or any general advice! The more specific your questions, the better my responses will be. How can I help you today?
                      </p>
                    </div>
                  </div>

                  {/* Sample Suggestions */}
                  <div className="w-full max-w-3xl mx-auto mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        'Draft a classroom contract covering respect and responsibility',
                        'Draft a grant proposal outline for classroom tech funding',
                        'Suggest classroom routines to build student ownership daily',
                        'Suggest 5 ways to incorporate mindfulness in classroom',
                      ].map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setInputValue(suggestion)
                            setTimeout(() => handleSendMessage(), 100)
                          }}
                          className="group relative rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-left shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md hover:bg-blue-50/50"
                        >
                          <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors">
                            {suggestion}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 pb-8">
                  {messages.map((message, index) => {
              const isLastMessage = index === messages.length - 1
              const isLastAssistantMessage = message.role === 'assistant' && isLastMessage
              const isEditing = editingMessageId === message.id

              return (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-sm">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <div className="flex flex-col gap-2 max-w-[85%]">
                    {isEditing && message.role === 'user' ? (
                      <div className="rounded-2xl border-2 border-blue-500 bg-white p-4 shadow-lg">
                        <textarea
                          ref={editTextareaRef}
                          value={editInputValue}
                          onChange={(e) => setEditInputValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault()
                              handleSaveEdit()
                            }
                            if (e.key === 'Escape') {
                              handleCancelEdit()
                            }
                          }}
                          className="w-full resize-none border-0 bg-transparent text-gray-900 focus:outline-none focus:ring-0"
                          rows={3}
                          autoFocus
                        />
                        <div className="mt-3 flex items-center justify-end gap-2">
                          <button
                            onClick={handleCancelEdit}
                            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveEdit}
                            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`group relative rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md'
                            : 'bg-white text-gray-900 shadow-sm border border-gray-200'
                        }`}
                      >
                        <div className={message.role === 'assistant' ? 'text-gray-700' : 'text-white'}>
                          {message.role === 'assistant' ? renderMarkdown(message.content) : message.content}
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className={`text-xs ${message.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                            {formatTimestamp(message.timestamp)}
                          </span>
                          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            {message.role === 'user' ? (
                              <>
                                <button
                                  onClick={() => handleEditMessage(message.id)}
                                  className={`p-1.5 rounded-lg transition ${
                                    message.role === 'user'
                                      ? 'text-blue-100 hover:text-white hover:bg-blue-700'
                                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                  }`}
                                  title="Edit message"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => copyToClipboard(message.content, message.id)}
                                  className={`p-1.5 rounded-lg transition ${
                                    message.role === 'user'
                                      ? 'text-blue-100 hover:text-white hover:bg-blue-700'
                                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                  }`}
                                  title="Copy message"
                                >
                                  {copiedMessageId === message.id ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </button>
                                <div className="relative">
                                  <button
                                    onClick={() =>
                                      setMessageActionMenu(messageActionMenu === message.id ? null : message.id)
                                    }
                                    className={`p-1.5 rounded-lg transition ${
                                      message.role === 'user'
                                        ? 'text-blue-100 hover:text-white hover:bg-blue-700'
                                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                    }`}
                                    title="More options"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </button>
                                  {messageActionMenu === message.id && (
                                    <div className="message-action-menu absolute right-0 top-full mt-1 w-48 rounded-lg border border-gray-200 bg-white shadow-lg z-10">
                                      <button
                                        onClick={() => handleDeleteMessage(message.id)}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                        Delete message
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleFeedback(message.id, 'like')}
                                  className={`p-1.5 rounded-lg transition ${
                                    likedMessages.has(message.id)
                                      ? 'text-green-600 bg-green-50'
                                      : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                                  }`}
                                  title="Good response"
                                >
                                  <ThumbsUp className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleFeedback(message.id, 'dislike')}
                                  className={`p-1.5 rounded-lg transition ${
                                    dislikedMessages.has(message.id)
                                      ? 'text-red-600 bg-red-50'
                                      : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                                  }`}
                                  title="Poor response"
                                >
                                  <ThumbsDown className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => copyToClipboard(message.content, message.id)}
                                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                                  title="Copy message"
                                >
                                  {copiedMessageId === message.id ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {isLastAssistantMessage && !isLoading && (
                      <div className="flex items-center gap-2 px-1">
                        <button
                          onClick={handleRegenerateResponse}
                          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          Regenerate response
                        </button>
                      </div>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-sm">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
              )
            })}
                  </div>
              )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-4 justify-start">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-sm">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="rounded-2xl bg-white px-4 py-3 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  <span className="text-sm text-gray-600 font-medium">Thinking...</span>
                  {canStopGeneration && (
                    <button
                      onClick={handleStopGeneration}
                      className="ml-2 flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100 transition"
                    >
                      <StopCircle className="h-3.5 w-3.5" />
                      Stop
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area - Redesigned */}
          <div className="border-t border-gray-200 bg-white">
            <div className="mx-auto max-w-4xl px-4 py-4">
              {/* Attached Files Display */}
              {attachedFiles.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {attachedFiles.map((file, index) => {
                    const FileIcon = getFileIcon(file)
                    return (
                      <div
                        key={index}
                        className="group flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
                      >
                        <FileIcon className="h-4 w-4 text-gray-600" />
                        <span className="max-w-[200px] truncate text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="ml-1 rounded p-0.5 text-gray-400 hover:text-red-600 transition"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Action Buttons Row */}
              <div className="mb-2 flex items-center gap-2 flex-wrap">
                {/* Upload Button */}
                <div className="relative upload-menu-container">
                  <button
                    onClick={() => setShowUploadMenu(!showUploadMenu)}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:border-gray-400"
                    title="Attach files"
                  >
                    <Paperclip className="h-4 w-4" />
                    <span className="hidden sm:inline">Attach</span>
                  </button>
                  {showUploadMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUploadMenu(false)}
                      />
                      <div className="absolute bottom-full left-0 mb-2 w-64 rounded-xl border border-gray-200 bg-white shadow-xl z-50 overflow-hidden upload-menu-container">
                        <div className="p-2">
                          <div className="mb-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Upload Options
                          </div>
                          <label
                            onClick={() => imageInputRef.current?.click()}
                            className="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition hover:bg-gray-50"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                              <Image className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">Images</div>
                              <div className="text-xs text-gray-500">JPG, PNG, GIF</div>
                            </div>
                            <input
                              ref={imageInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleFileSelect}
                              className="hidden"
                              multiple
                            />
                          </label>
                          <label
                            onClick={() => documentInputRef.current?.click()}
                            className="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition hover:bg-gray-50"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">Documents</div>
                              <div className="text-xs text-gray-500">PDF, DOC, DOCX</div>
                            </div>
                            <input
                              ref={documentInputRef}
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileSelect}
                              className="hidden"
                              multiple
                            />
                          </label>
                          <label
                            onClick={() => allFilesInputRef.current?.click()}
                            className="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition hover:bg-gray-50"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                              <File className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">All Files</div>
                              <div className="text-xs text-gray-500">Any file type</div>
                            </div>
                            <input
                              ref={allFilesInputRef}
                              type="file"
                              onChange={handleFileSelect}
                              className="hidden"
                              multiple
                            />
                          </label>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Mode Selector */}
                <div className="relative mode-menu-container">
                  <button
                    onClick={() => setShowModeMenu(!showModeMenu)}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                      botModeConfig[botMode].borderColor
                    } ${botModeConfig[botMode].bgColor} ${botModeConfig[botMode].color} border-gray-300 hover:shadow-sm`}
                  >
                    {(() => {
                      const ModeIcon = botModeConfig[botMode].icon
                      return <ModeIcon className="h-4 w-4" />
                    })()}
                    <span className="hidden sm:inline">{botModeConfig[botMode].label}</span>
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  {showModeMenu && (
                    <div className="absolute left-0 top-full mt-2 w-64 rounded-xl border border-gray-200 bg-white shadow-xl z-50 overflow-hidden mode-menu-container">
                      <div className="p-2">
                        {Object.entries(botModeConfig).map(([key, config]) => {
                          const ModeIcon = config.icon
                          return (
                            <button
                              key={key}
                              onClick={() => {
                                setBotMode(key as 'fastest' | 'smartest' | 'critical-thinking')
                                setShowModeMenu(false)
                              }}
                              className={`w-full flex items-start gap-3 p-3 rounded-lg transition ${
                                botMode === key
                                  ? `${config.bgColor} ${config.borderColor} border-2`
                                  : 'hover:bg-gray-50 border-2 border-transparent'
                              }`}
                            >
                              <ModeIcon className={`h-5 w-5 mt-0.5 ${config.color}`} />
                              <div className="flex-1 text-left">
                                <div className={`font-semibold ${config.color}`}>{config.label}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{config.description}</div>
                              </div>
                              {botMode === key && (
                                <CheckCircle2 className={`h-5 w-5 ${config.color}`} />
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Web Search Toggle */}
                <button
                  onClick={toggleWebSearch}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                    webSearchEnabled
                      ? 'border-blue-300 bg-blue-50 text-blue-600'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  title={webSearchEnabled ? 'Web search enabled' : 'Enable web search'}
                >
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">Web</span>
                </button>

                {/* Actions Menu */}
                <div className="relative actions-menu-container">
                  <button
                    onClick={() => setShowActionsMenu(!showActionsMenu)}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:border-gray-400"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Actions</span>
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  {showActionsMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowActionsMenu(false)}
                      />
                      <div className="absolute left-0 bottom-full mb-2 w-64 rounded-xl border border-gray-200 bg-white shadow-xl z-50 overflow-hidden actions-menu-container">
                        <div className="p-2">
                          <div className="mb-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Actions
                          </div>
                          <button
                            onClick={() => handleAction('questions')}
                            className="w-full flex items-center gap-3 rounded-lg p-3 text-left transition hover:bg-gray-50"
                          >
                            <FileQuestion className="h-5 w-5 text-blue-600" />
                            <div>
                              <div className="font-medium text-gray-900">Questions</div>
                              <div className="text-xs text-gray-500">Generate questions</div>
                            </div>
                          </button>
                          <div className="relative length-menu-container">
                            <button
                              onClick={() => setShowLengthMenu(!showLengthMenu)}
                              className="w-full flex items-center gap-3 rounded-lg p-3 text-left transition hover:bg-gray-50"
                            >
                              <AlignLeft className="h-5 w-5 text-green-600" />
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">Length</div>
                                <div className="text-xs text-gray-500">{responseLengthConfig[responseLength].description}</div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            </button>
                            {showLengthMenu && (
                              <div className="absolute left-full top-0 ml-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg z-50 length-menu-container">
                                {Object.entries(responseLengthConfig).map(([key, config]) => (
                                  <button
                                    key={key}
                                    onClick={() => {
                                      handleResponseLengthChange(key as 'short' | 'medium' | 'long')
                                      setShowLengthMenu(false)
                                    }}
                                    className={`w-full text-left px-3 py-2 text-sm transition hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                                      responseLength === key ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                                    }`}
                                  >
                                    {config.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleAction('summarize')}
                            className="w-full flex items-center gap-3 rounded-lg p-3 text-left transition hover:bg-gray-50"
                          >
                            <AlignLeft className="h-5 w-5 text-purple-600" />
                            <div>
                              <div className="font-medium text-gray-900">Summarize</div>
                              <div className="text-xs text-gray-500">Summarize content</div>
                            </div>
                          </button>
                          <button
                            onClick={() => handleAction('custom-prompts')}
                            className="w-full flex items-center gap-3 rounded-lg p-3 text-left transition hover:bg-gray-50"
                          >
                            <Bookmark className="h-5 w-5 text-amber-600" />
                            <div>
                              <div className="font-medium text-gray-900">Custom Prompts</div>
                              <div className="text-xs text-gray-500">Save prompts</div>
                            </div>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Input Field Row */}
              <div className="flex items-end gap-2">
                {/* Input Field */}
                <div className="flex-1 rounded-xl border-2 border-gray-300 bg-white shadow-sm transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything about teaching..."
                    rows={1}
                    className="w-full resize-none border-0 bg-transparent px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0"
                    disabled={isLoading}
                  />
                </div>

                {/* Microphone Button */}
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 transition-all ${
                    isRecording
                      ? 'border-red-300 bg-red-50 text-red-600 animate-pulse'
                      : 'border-gray-300 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                  title={isRecording ? 'Stop recording' : 'Record audio'}
                >
                  {isRecording ? (
                    <MicOff className="h-5 w-5" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </button>

                {/* Send Button */}
                <button
                  onClick={handleSendMessage}
                  disabled={(!inputValue.trim() && attachedFiles.length === 0) || isLoading}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
                  title="Send message"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Disclaimer */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                <Accessibility className="h-4 w-4" />
                <p>
                  AI may make mistakes. Check important info. Responses are generated by AI and may contain errors.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* History Sidebar */}
        {showHistory && (
          <>
            {/* Overlay for mobile */}
            <div
              className="fixed inset-0 bg-black/20 z-40 lg:hidden"
              onClick={() => setShowHistory(false)}
            />
            {/* Sidebar */}
            <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col lg:static lg:shadow-none lg:z-auto">
              {/* Sidebar Header */}
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Chat History
                  </h2>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition lg:hidden"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={historySearchQuery}
                    onChange={(e) => setHistorySearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {conversations.length > 0 && (
                  <button
                    onClick={deleteAllConversations}
                    className="mt-3 w-full text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Delete all conversations
                  </button>
                )}
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    {historySearchQuery ? (
                      <>
                        <Search className="h-12 w-12 text-gray-300 mb-3" />
                        <p className="text-sm text-gray-500">No conversations found</p>
                        <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                      </>
                    ) : (
                      <>
                        <History className="h-12 w-12 text-gray-300 mb-3" />
                        <p className="text-sm text-gray-500">No conversations yet</p>
                        <p className="text-xs text-gray-400 mt-1">Start a new chat to see it here</p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => loadConversation(conversation.id)}
                        className={`group relative p-3 rounded-lg cursor-pointer transition ${
                          currentConversationId === conversation.id
                            ? 'bg-blue-50 border border-blue-200'
                            : 'hover:bg-gray-50 border border-transparent hover:border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 truncate mb-1">
                              {conversation.title}
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                {conversation.messages.length}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(conversation.updatedAt)}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => deleteConversation(conversation.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 rounded transition"
                            title="Delete conversation"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default GeneralTeachingAssistantChat

