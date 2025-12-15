import { useState } from 'react'
import {
  BookOpen,
  FileText,
  Sparkles,
  Download,
  RefreshCw,
  TrendingUp,
  Users,
  Target,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  MessageSquare,
  PenTool,
  BarChart3,
  BookMarked,
  GraduationCap,
  Award,
  Clock,
  Search,
  Filter,
  Star,
  Lock,
  Quote,
  Layers,
  Eye,
  Brain,
  Palette,
  Music,
  Zap,
  Compass,
} from 'lucide-react'

interface ThemeAnalysis {
  themes: {
    theme: string
    description: string
    evidence: string[]
    significance: string
  }[]
  motifs: string[]
  symbols: {
    symbol: string
    meaning: string
    examples: string[]
  }[]
}

interface CharacterAnalysis {
  characters: {
    name: string
    role: string
    traits: string[]
    development: string
    relationships: string[]
    quotes: string[]
  }[]
}

interface LiteraryDevices {
  devices: {
    type: string
    examples: string[]
    effect: string
  }[]
}

interface DiscussionPrompts {
  literal: string[]
  inferential: string[]
  evaluative: string[]
  creative: string[]
}

const LiteratureAnalysisExpert = () => {
  const [activeTab, setActiveTab] = useState<'theme' | 'character' | 'devices' | 'discussion' | 'compare' | 'essay'>('theme')
  const [textInput, setTextInput] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [gradeLevel, setGradeLevel] = useState('9')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [themeAnalysis, setThemeAnalysis] = useState<ThemeAnalysis | null>(null)
  const [characterAnalysis, setCharacterAnalysis] = useState<CharacterAnalysis | null>(null)
  const [literaryDevices, setLiteraryDevices] = useState<LiteraryDevices | null>(null)
  const [discussionPrompts, setDiscussionPrompts] = useState<DiscussionPrompts | null>(null)

  const handleThemeAnalysis = async () => {
    if (!textInput.trim() && !title.trim()) return
    setIsAnalyzing(true)
    
    setTimeout(() => {
      const mockAnalysis: ThemeAnalysis = {
        themes: [
          {
            theme: 'The Power of Knowledge',
            description: 'The text explores how knowledge can be both liberating and dangerous, showing characters who seek understanding despite risks.',
            evidence: [
              'Character pursues forbidden knowledge despite warnings',
              'Discovery leads to both enlightenment and consequences',
              'Knowledge creates power dynamics between characters',
            ],
            significance: 'This theme connects to the human desire for understanding and the ethical implications of seeking truth.',
          },
          {
            theme: 'Identity and Self-Discovery',
            description: 'Characters struggle with questions of who they are and who they want to become, often through conflict and growth.',
            evidence: [
              'Protagonist questions their place in the world',
              'External conflicts mirror internal identity struggles',
              'Character transformation reveals true self',
            ],
            significance: 'The theme reflects universal questions about personal identity and the journey of self-discovery.',
          },
        ],
        motifs: [
          'Light and darkness as symbols of knowledge and ignorance',
          'Journey/quest representing personal growth',
          'Mirrors and reflections showing self-examination',
        ],
        symbols: [
          {
            symbol: 'The Ancient Book',
            meaning: 'Represents forbidden knowledge and the power of written word',
            examples: [
              'Appears at moments of critical decision-making',
              'Characters are drawn to it despite warnings',
              'Its contents change those who read it',
            ],
          },
          {
            symbol: 'The Bridge',
            meaning: 'Represents transition, connection, and the passage from one state to another',
            examples: [
              'Characters cross it at pivotal moments',
              'It connects two different worlds or states of being',
              'Crossing requires courage and commitment',
            ],
          },
        ],
      }
      setThemeAnalysis(mockAnalysis)
      setIsAnalyzing(false)
    }, 2000)
  }

  const handleCharacterAnalysis = async () => {
    if (!textInput.trim() && !title.trim()) return
    setIsAnalyzing(true)
    
    setTimeout(() => {
      const mockAnalysis: CharacterAnalysis = {
        characters: [
          {
            name: 'Protagonist',
            role: 'Main character, hero/heroine',
            traits: ['Curious', 'Determined', 'Compassionate', 'Impulsive'],
            development: 'Begins as naive and uncertain, but through trials and challenges, grows into a confident leader who understands the weight of responsibility.',
            relationships: [
              'Mentor: Seeks guidance and wisdom',
              'Rival: Competes with but ultimately respects',
              'Friend: Provides emotional support and loyalty',
            ],
            quotes: [
              '"I must know the truth, no matter the cost."',
              '"We are stronger together than we are alone."',
              '"The greatest journey begins with a single step."',
            ],
          },
          {
            name: 'Antagonist',
            role: 'Opposing force, creates conflict',
            traits: ['Ambitious', 'Cunning', 'Charismatic', 'Flawed'],
            development: 'Initially appears as a clear villain, but reveals complexity and motivations that challenge simple moral judgments.',
            relationships: [
              'Protagonist: Complex dynamic of opposition and understanding',
              'Followers: Commands loyalty through fear and manipulation',
            ],
            quotes: [
              '"Power is not given, it is taken."',
              '"Every choice has a consequence."',
            ],
          },
        ],
      }
      setCharacterAnalysis(mockAnalysis)
      setIsAnalyzing(false)
    }, 2000)
  }

  const handleLiteraryDevices = async () => {
    if (!textInput.trim() && !title.trim()) return
    setIsAnalyzing(true)
    
    setTimeout(() => {
      const mockDevices: LiteraryDevices = {
        devices: [
          {
            type: 'Metaphor',
            examples: [
              '"Her smile was a ray of sunshine"',
              '"Time is a thief"',
              '"The classroom was a battlefield"',
            ],
            effect: 'Creates vivid imagery and helps readers understand abstract concepts through concrete comparisons.',
          },
          {
            type: 'Foreshadowing',
            examples: [
              'Early mention of storm clouds before conflict',
              'Character\'s unease about a decision that later proves significant',
              'Symbolic objects that reappear at crucial moments',
            ],
            effect: 'Builds suspense and prepares readers for future events, creating anticipation and deeper engagement.',
          },
          {
            type: 'Irony',
            examples: [
              'Situational: Character achieves goal but loses what they valued most',
              'Verbal: Character says opposite of what they mean',
              'Dramatic: Reader knows something characters do not',
            ],
            effect: 'Adds complexity, humor, or tragedy, and highlights the gap between appearance and reality.',
          },
          {
            type: 'Symbolism',
            examples: [
              'Red rose representing love and passion',
              'Broken mirror symbolizing fractured identity',
              'Light/dark imagery throughout the text',
            ],
            effect: 'Adds layers of meaning, allowing readers to interpret deeper significance beyond literal events.',
          },
          {
            type: 'Alliteration',
            examples: [
              '"The wild wind whispered warnings"',
              '"Silent shadows slipped slowly"',
            ],
            effect: 'Creates rhythm, emphasizes certain words, and makes phrases more memorable.',
          },
        ],
      }
      setLiteraryDevices(mockDevices)
      setIsAnalyzing(false)
    }, 2000)
  }

  const handleDiscussionPrompts = async () => {
    if (!textInput.trim() && !title.trim()) return
    setIsAnalyzing(true)
    
    setTimeout(() => {
      const mockPrompts: DiscussionPrompts = {
        literal: [
          'What is the main conflict in this text?',
          'Who are the main characters and what are their roles?',
          'Where and when does the story take place?',
          'What are the key events in the plot?',
        ],
        inferential: [
          'Why do you think the author chose this setting?',
          'What can we infer about the character\'s motivations from their actions?',
          'How does the author use symbolism to convey deeper meaning?',
          'What themes emerge from the characters\' interactions?',
        ],
        evaluative: [
          'Do you agree with the protagonist\'s decisions? Why or why not?',
          'How effective is the author\'s use of literary devices?',
          'What message is the author trying to convey, and is it successful?',
          'How does this text compare to other works you\'ve read?',
        ],
        creative: [
          'Rewrite the ending from a different character\'s perspective',
          'Create a dialogue between two characters that didn\'t interact in the text',
          'Design a book cover that represents the main themes',
          'Write a letter from one character to another explaining their actions',
        ],
      }
      setDiscussionPrompts(mockPrompts)
      setIsAnalyzing(false)
    }, 2000)
  }

  const tabs = [
    { id: 'theme', label: 'Theme Analysis', icon: Compass },
    { id: 'character', label: 'Character Analysis', icon: Users },
    { id: 'devices', label: 'Literary Devices', icon: Palette },
    { id: 'discussion', label: 'Discussion Prompts', icon: MessageSquare },
    { id: 'compare', label: 'Text Comparison', icon: Layers },
    { id: 'essay', label: 'Essay Planning', icon: PenTool },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">Literature Analysis Expert</h1>
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    <Star className="h-3 w-3" /> 4.7★
                  </span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    <Lock className="inline h-3 w-3 mr-1" /> Premium
                  </span>
                </div>
                <p className="mt-2 text-purple-100">
                  Deep literary analysis tools for theme exploration, character development, literary devices, 
                  and discussion prompts for classic and contemporary texts.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <Compass className="h-4 w-4" />
                <span>Theme Exploration</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <Users className="h-4 w-4" />
                <span>Character Analysis</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <Palette className="h-4 w-4" />
                <span>Literary Devices</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <MessageSquare className="h-4 w-4" />
                <span>Discussion Prompts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Texts Analyzed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">189</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <FileText className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Themes Identified</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">456</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <Compass className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Characters Analyzed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">723</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Discussion Prompts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">1,234</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
              <MessageSquare className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-6">
          {/* Theme Analysis Tab */}
          {activeTab === 'theme' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., To Kill a Mockingbird"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author (Optional)
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g., Harper Lee"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade Level
                    </label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                    >
                      {[6, 7, 8, 9, 10, 11, 12].map((grade) => (
                        <option key={grade} value={grade}>
                          Grade {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Paste Text or Enter Context
                    </label>
                    <textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Paste text excerpt, describe the work, or provide context for theme analysis..."
                      rows={10}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                    />
                    <button
                      onClick={handleThemeAnalysis}
                      disabled={(!textInput.trim() && !title.trim()) || isAnalyzing}
                      className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Analyze Themes
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-4 max-h-[800px] overflow-y-auto">
                  {themeAnalysis ? (
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Compass className="h-5 w-5 text-purple-600" />
                          Themes
                        </h3>
                        <div className="space-y-6">
                          {themeAnalysis.themes.map((theme, idx) => (
                            <div key={idx} className="bg-white rounded-xl p-5 border border-purple-200">
                              <h4 className="text-lg font-bold text-gray-900 mb-2">{theme.theme}</h4>
                              <p className="text-sm text-gray-700 mb-3">{theme.description}</p>
                              <div className="mb-3">
                                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Evidence:</p>
                                <ul className="space-y-1">
                                  {theme.evidence.map((ev, evIdx) => (
                                    <li key={evIdx} className="text-sm text-gray-600 flex items-start gap-2">
                                      <Quote className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                      <span>{ev}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="rounded-lg bg-purple-50 p-3 border border-purple-200">
                                <p className="text-xs font-semibold text-purple-700 mb-1">Significance:</p>
                                <p className="text-sm text-purple-800">{theme.significance}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Layers className="h-5 w-5 text-indigo-600" />
                          Motifs
                        </h3>
                        <ul className="space-y-2">
                          {themeAnalysis.motifs.map((motif, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 bg-white rounded-lg p-3 border border-indigo-200">
                              <CheckCircle2 className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                              <span>{motif}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Eye className="h-5 w-5 text-blue-600" />
                          Symbols
                        </h3>
                        <div className="space-y-4">
                          {themeAnalysis.symbols.map((symbol, idx) => (
                            <div key={idx} className="bg-white rounded-xl p-5 border border-blue-200">
                              <h4 className="text-base font-bold text-gray-900 mb-2">{symbol.symbol}</h4>
                              <p className="text-sm text-gray-700 mb-3 font-medium">{symbol.meaning}</p>
                              <div>
                                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Examples:</p>
                                <ul className="space-y-1">
                                  {symbol.examples.map((ex, exIdx) => (
                                    <li key={exIdx} className="text-sm text-gray-600 flex items-start gap-2">
                                      <span className="text-blue-600 mt-0.5">•</span>
                                      <span>{ex}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" />
                        Download Theme Analysis Report
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                      <Compass className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-600">
                        Enter text information and click "Analyze Themes" to explore themes, motifs, and symbols
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Character Analysis Tab */}
          {activeTab === 'character' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., The Great Gatsby"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Character Name or Text Context
                    </label>
                    <textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Enter character name, paste text excerpts, or provide context for character analysis..."
                      rows={12}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                    />
                    <button
                      onClick={handleCharacterAnalysis}
                      disabled={(!textInput.trim() && !title.trim()) || isAnalyzing}
                      className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Analyze Characters
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-4 max-h-[800px] overflow-y-auto">
                  {characterAnalysis ? (
                    <div className="space-y-6">
                      {characterAnalysis.characters.map((character, idx) => (
                        <div key={idx} className="rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
                          <div className="bg-white rounded-xl p-6 border border-purple-200">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900">{character.name}</h3>
                                <p className="text-sm text-purple-600 font-medium mt-1">{character.role}</p>
                              </div>
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                                <Users className="h-6 w-6" />
                              </div>
                            </div>

                            <div className="mb-4">
                              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Character Traits:</p>
                              <div className="flex flex-wrap gap-2">
                                {character.traits.map((trait, traitIdx) => (
                                  <span key={traitIdx} className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                                    {trait}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="mb-4">
                              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Character Development:</p>
                              <p className="text-sm text-gray-700 leading-relaxed">{character.development}</p>
                            </div>

                            <div className="mb-4">
                              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Relationships:</p>
                              <ul className="space-y-1">
                                {character.relationships.map((rel, relIdx) => (
                                  <li key={relIdx} className="text-sm text-gray-600 flex items-start gap-2">
                                    <span className="text-purple-600 mt-0.5">•</span>
                                    <span>{rel}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Key Quotes:</p>
                              <div className="space-y-2">
                                {character.quotes.map((quote, quoteIdx) => (
                                  <div key={quoteIdx} className="rounded-lg bg-purple-50 p-3 border-l-4 border-purple-400">
                                    <p className="text-sm text-gray-700 italic">{quote}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" />
                        Download Character Analysis Report
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-600">
                        Enter character information and analyze traits, development, and relationships
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Literary Devices Tab */}
          {activeTab === 'devices' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Romeo and Juliet"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Paste Text Excerpt
                    </label>
                    <textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Paste text excerpt to identify literary devices..."
                      rows={12}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                    />
                    <button
                      onClick={handleLiteraryDevices}
                      disabled={(!textInput.trim() && !title.trim()) || isAnalyzing}
                      className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Identifying...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Identify Literary Devices
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-4 max-h-[800px] overflow-y-auto">
                  {literaryDevices ? (
                    <div className="space-y-4">
                      {literaryDevices.devices.map((device, idx) => (
                        <div key={idx} className="rounded-2xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
                          <div className="bg-white rounded-xl p-5 border border-indigo-200">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                                <Palette className="h-5 w-5" />
                              </div>
                              <h3 className="text-lg font-bold text-gray-900">{device.type}</h3>
                            </div>
                            <div className="mb-4">
                              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Examples:</p>
                              <ul className="space-y-2">
                                {device.examples.map((ex, exIdx) => (
                                  <li key={exIdx} className="text-sm text-gray-700 bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                                    <Quote className="h-4 w-4 text-indigo-600 inline mr-2" />
                                    {ex}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="rounded-lg bg-indigo-50 p-3 border border-indigo-200">
                              <p className="text-xs font-semibold text-indigo-700 mb-1">Effect:</p>
                              <p className="text-sm text-indigo-800">{device.effect}</p>
                            </div>
                          </div>
                        </div>
                      ))}

                      <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" />
                        Download Literary Devices Report
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                      <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-600">
                        Paste text to identify literary devices and their effects
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Discussion Prompts Tab */}
          {activeTab === 'discussion' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., 1984"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade Level
                    </label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                    >
                      {[6, 7, 8, 9, 10, 11, 12].map((grade) => (
                        <option key={grade} value={grade}>
                          Grade {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text Context or Excerpt
                    </label>
                    <textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Enter text context, themes, or paste excerpt to generate discussion prompts..."
                      rows={10}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                    />
                    <button
                      onClick={handleDiscussionPrompts}
                      disabled={(!textInput.trim() && !title.trim()) || isAnalyzing}
                      className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Generate Discussion Prompts
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-4 max-h-[800px] overflow-y-auto">
                  {discussionPrompts ? (
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Target className="h-5 w-5 text-blue-600" />
                          Literal Questions
                        </h3>
                        <ul className="space-y-2">
                          {discussionPrompts.literal.map((prompt, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 bg-white rounded-lg p-3 border border-blue-200">
                              <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span>{prompt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Brain className="h-5 w-5 text-indigo-600" />
                          Inferential Questions
                        </h3>
                        <ul className="space-y-2">
                          {discussionPrompts.inferential.map((prompt, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 bg-white rounded-lg p-3 border border-indigo-200">
                              <MessageSquare className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                              <span>{prompt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Award className="h-5 w-5 text-purple-600" />
                          Evaluative Questions
                        </h3>
                        <ul className="space-y-2">
                          {discussionPrompts.evaluative.map((prompt, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 bg-white rounded-lg p-3 border border-purple-200">
                              <MessageSquare className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                              <span>{prompt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-pink-50 to-rose-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-pink-600" />
                          Creative Prompts
                        </h3>
                        <ul className="space-y-2">
                          {discussionPrompts.creative.map((prompt, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 bg-white rounded-lg p-3 border border-pink-200">
                              <Lightbulb className="h-4 w-4 text-pink-600 mt-0.5 flex-shrink-0" />
                              <span>{prompt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" />
                        Download Discussion Prompts
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-600">
                        Enter text information to generate discussion prompts at multiple cognitive levels
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Text Comparison Tab */}
          {activeTab === 'compare' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-amber-50 to-orange-50 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Layers className="h-6 w-6 text-amber-600" />
                  Text Comparison Tool
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Compare themes, characters, literary devices, and styles across multiple texts.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Text 1</label>
                    <input
                      type="text"
                      placeholder="Title or author"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
                    />
                    <textarea
                      placeholder="Text excerpt or context..."
                      rows={6}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Text 2</label>
                    <input
                      type="text"
                      placeholder="Title or author"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
                    />
                    <textarea
                      placeholder="Text excerpt or context..."
                      rows={6}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
                    />
                  </div>
                </div>
                <button className="mt-4 w-full rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-700 flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Compare Texts
                </button>
              </div>
            </div>
          )}

          {/* Essay Planning Tab */}
          {activeTab === 'essay' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <PenTool className="h-6 w-6 text-green-600" />
                  Essay Planning Assistant
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Generate thesis statements, outline structures, and supporting evidence for literary analysis essays.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Essay Topic or Question</label>
                    <input
                      type="text"
                      placeholder="e.g., Analyze the theme of power in..."
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Text Information</label>
                    <textarea
                      placeholder="Enter text title, author, and key points to analyze..."
                      rows={6}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Essay Type</label>
                    <select className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100">
                      <option>Literary Analysis</option>
                      <option>Character Analysis</option>
                      <option>Theme Analysis</option>
                      <option>Comparative Essay</option>
                      <option>Argumentative Essay</option>
                    </select>
                  </div>
                  <button className="w-full rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 flex items-center justify-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Generate Essay Plan
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Features Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Additional Premium Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 mb-4">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Text Complexity Analysis</h3>
            <p className="text-sm text-gray-600">
              Analyze reading level, vocabulary complexity, and text structure for appropriate grade placement.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 mb-4">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Standards Alignment</h3>
            <p className="text-sm text-gray-600">
              All analysis tools align with Common Core ELA standards and state-specific curriculum requirements.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-4">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress Tracking</h3>
            <p className="text-sm text-gray-600">
              Track student engagement with texts, analysis quality, and discussion participation over time.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-cyan-50 to-teal-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600 mb-4">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Chat</h3>
            <p className="text-sm text-gray-600">
              Get instant answers to literature questions and receive personalized teaching recommendations.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-teal-50 to-green-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600 mb-4">
              <Download className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Export & Share</h3>
            <p className="text-sm text-gray-600">
              Export analysis reports, discussion prompts, and essay plans in multiple formats for easy sharing.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Differentiation Tools</h3>
            <p className="text-sm text-gray-600">
              Automatically generate differentiated analysis activities for students at various reading levels.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiteratureAnalysisExpert



