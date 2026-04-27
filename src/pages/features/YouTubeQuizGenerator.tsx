import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Youtube,
  Play,
  Sparkles,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Video,
  ListChecks,
  MessageSquare,
  Lightbulb,
  Languages,
  Mic,
  Target,
  Link as LinkIcon,
  Eye,
} from 'lucide-react'
import { ApiError } from '../../api/client'
import { generateYouTubeQuiz, YouTubeQuizSection } from '../../api/youtubeQuiz'
import { useSnackbar } from '../../hooks/useSnackbar'
import { LessonFlowBuilder } from './youtube-quiz/LessonFlowBuilder'
import { ClassroomUseFlow } from './youtube-quiz/ClassroomUseFlow'
import { QuickStartVideoSources } from './youtube-quiz/QuickStartVideoSources'
import { AICapabilityPreview } from './youtube-quiz/AICapabilityPreview'

interface QuizPreview {
  title: string
  summary: string
  sections: YouTubeQuizSection[]
}

const questionStyles = ['Multiple choice', 'Higher-order thinking', 'Quick check', 'Discussion prompt']


const referenceVideos = [
  {
    title: 'Photosynthesis Explained - Crash Course Biology',
    url: 'https://www.youtube.com/watch?v=sQK3Yr4Sc_k',
    thumbnail: 'https://img.youtube.com/vi/sQK3Yr4Sc_k/maxresdefault.jpg',
    gradeBand: 'Grades 9-10',
    subjectArea: 'Science & STEM',
    learningFocus: 'Concept comprehension',
    duration: '13:15',
    description: 'Perfect for biology units on plant processes and energy conversion.',
  },
  {
    title: 'The Water Cycle - Educational Video for Kids',
    url: 'https://www.youtube.com/watch?v=ncORPosDrjI',
    thumbnail: 'https://img.youtube.com/vi/ncORPosDrjI/maxresdefault.jpg',
    gradeBand: 'Grades 3-5',
    subjectArea: 'Science & STEM',
    learningFocus: 'Concept comprehension',
    duration: '7:13',
    description: 'Engaging explanation of the water cycle with visual animations.',
  },
  {
    title: 'Introduction to Fractions - Math Antics',
    url: 'https://www.youtube.com/watch?v=3XOt1fjWKi8',
    thumbnail: 'https://img.youtube.com/vi/3XOt1fjWKi8/maxresdefault.jpg',
    gradeBand: 'Grades 6-8',
    subjectArea: 'Mathematics',
    learningFocus: 'Concept comprehension',
    duration: '12:47',
    description: 'Clear introduction to fractions with step-by-step examples.',
  },
  {
    title: 'World War II: Crash Course World History',
    url: 'https://www.youtube.com/watch?v=Q78COTwT7nE',
    thumbnail: 'https://img.youtube.com/vi/Q78COTwT7nE/maxresdefault.jpg',
    gradeBand: 'Grades 11-12',
    subjectArea: 'Social Sciences',
    learningFocus: 'Critical analysis',
    duration: '15:42',
    description: 'Comprehensive overview of WWII with historical context and analysis.',
  },
  {
    title: 'The Scientific Method - Khan Academy',
    url: 'https://www.youtube.com/watch?v=yi0hwFDQTSQ',
    thumbnail: 'https://img.youtube.com/vi/yi0hwFDQTSQ/maxresdefault.jpg',
    gradeBand: 'Grades 6-8',
    subjectArea: 'Science & STEM',
    learningFocus: 'Lab skills & procedures',
    duration: '11:48',
    description: 'Step-by-step guide to the scientific method with real examples.',
  },
]

const pedagogyNotes = [
  {
    icon: MessageSquare,
    title: 'Pre-watch prompts',
    body: 'Set purpose before pressing play. Students note predictions or questions to activate prior knowledge.',
  },
  {
    icon: Mic,
    title: 'Listening evidence',
    body: 'Prompt oral summaries or think-pair-share moments between quiz sections to check comprehension.',
  },
  {
    icon: Lightbulb,
    title: 'Transfer & reflection',
    body: 'Wrap with a creative task: connect the video to real-world practice or design challenges.',
  },
]


const workflowSteps = [
  {
    icon: LinkIcon,
    title: 'Grab the lesson link',
    description: 'We pull transcripts, chapter markers, and engagement cues directly from the video metadata.',
  },
  {
    icon: Sparkles,
    title: 'Layer pedagogy intelligence',
    description: 'Question stems align to Webb’s DOK and Bloom’s taxonomy with SEL-aware scaffolds.',
  },
  {
    icon: ListChecks,
    title: 'Publish & share instantly',
    description: 'Export to Google Forms, LMS quizzes, or printable exit tickets with one click.',
  },
]

const YouTubeQuizGenerator = () => {
  const { toast } = useSnackbar()
  const [videoUrl, setVideoUrl] = useState('')
  const [gradeBand, setGradeBand] = useState('Grades 6-8')
  const [subjectArea, setSubjectArea] = useState('Science & STEM')
  const [learningFocus, setLearningFocus] = useState('Concept comprehension')
  const [language, setLanguage] = useState('English')
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Multiple choice', 'Higher-order thinking'])
  const [questionCount, setQuestionCount] = useState(6)
  const [isGenerating, setIsGenerating] = useState(false)
  const [quizPreview, setQuizPreview] = useState<QuizPreview | null>(null)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [urlError, setUrlError] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [appliedStrategy, setAppliedStrategy] = useState<string | null>(null)
  const navigate = useNavigate()

  const getVideoUrlValidationError = (url: string): string | null => {
    const trimmed = url.trim()
    if (!trimmed) return 'Please paste a valid YouTube watch/share/shorts URL.'
    try {
      const parsed = new URL(trimmed)
      const host = parsed.hostname.toLowerCase()
      const path = parsed.pathname
      const isYouTubeHost =
        host === 'youtube.com' ||
        host === 'www.youtube.com' ||
        host === 'm.youtube.com' ||
        host === 'youtu.be' ||
        host === 'www.youtu.be'
      if (!isYouTubeHost) return 'Please paste a valid YouTube watch/share/shorts URL.'
      if (host.includes('youtu.be')) return path.length > 1 ? null : 'Please paste a valid YouTube watch/share/shorts URL.'
      const isWatch = path === '/watch' && parsed.searchParams.get('v')
      const isShorts = /^\/shorts\/[^/]+/.test(path)
      const isEmbed = /^\/embed\/[^/]+/.test(path)
      return isWatch || isShorts || isEmbed ? null : 'Please paste a valid YouTube watch/share/shorts URL.'
    } catch {
      return 'Please paste a valid YouTube watch/share/shorts URL.'
    }
  }

  const isVideoUrlValid = getVideoUrlValidationError(videoUrl) === null

  const handleToggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((item) => item !== style) : [...prev, style]
    )
  }

  const handleUseReference = (video: typeof referenceVideos[0]) => {
    setVideoUrl(video.url)
    setGradeBand(video.gradeBand)
    setSubjectArea(video.subjectArea)
    setLearningFocus(video.learningFocus)
    
    // Auto-generate after a brief delay to allow state updates
    setTimeout(() => {
      handleGenerateQuizWithData(video)
    }, 100)
  }

  const handleGenerateQuiz = () => {
    const validationError = getVideoUrlValidationError(videoUrl)
    if (validationError) {
      setUrlError(validationError)
      toast.error(validationError)
      return
    }
    handleGenerateQuizWithData()
  }

  const handlePreview = () => {
    if (!hasGenerated || !quizPreview) return
    
    // Navigate to results page with the generated quiz data
    navigate('/youtube-quiz/results', {
      state: { quizData: quizPreview },
    })
  }

  const handleGenerateQuizWithData = async (videoData?: typeof referenceVideos[0]) => {
    setIsGenerating(true)
    setQuizPreview(null)
    setApiError(null)
    setUrlError(null)

    try {
      const response = await generateYouTubeQuiz({
        video_url: videoData?.url || videoUrl,
        grade_band: videoData?.gradeBand || gradeBand,
        subject_lens: videoData?.subjectArea || subjectArea,
        learning_focus: videoData?.learningFocus || learningFocus,
        quiz_language: language,
        question_styles: selectedStyles,
        question_count: questionCount,
      })

      const generatedQuiz: QuizPreview = {
        title: response.title,
        summary: response.summary,
        sections: response.sections,
      }

      setQuizPreview(generatedQuiz)
      setHasGenerated(true)

      // Navigate to results page after generation
      setTimeout(() => {
        navigate('/youtube-quiz/results', {
          state: { quizData: generatedQuiz },
        })
      }, 500)
    } catch (error) {
      console.error('Failed to generate YouTube quiz:', error)
      setHasGenerated(false)
      let message = 'Quiz generation failed. Please try again.'
      if (error instanceof ApiError) {
        if (error.status === 400) {
          message = 'Invalid request. Please check the YouTube link and form inputs.'
        } else if (error.status === 502) {
          message = 'Quiz generation failed on the server. Please retry in a moment.'
        } else if (typeof error.message === 'string' && error.message.trim()) {
          message = error.message
        }
      } else if (error instanceof Error && error.message) {
        if (error.message.includes('timeout') || error.message.includes('Network error')) {
          message = 'Cannot reach backend right now. Please check server connection and try again.'
        } else {
          message = error.message
        }
      }
      setApiError(message)
      toast.error(message)
    } finally {
      setIsGenerating(false)
    }
  }

  const progressHighlights = useMemo(
    () => [
      {
        label: 'Video comprehension rate',
        value: '87%',
        caption: 'Average score for last 14 generated quizzes.',
      },
      {
        label: 'Time saved per quiz',
        value: '28 min',
        caption: 'Compared with manual question design.',
      },
      {
        label: 'Student reflection prompts',
        value: 'Included',
        caption: 'Every quiz comes with SEL-aware reflection ideas.',
      },
    ],
    []
  )

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#ff4d4f] via-[#ff7756] to-[#ffb347] px-6 py-8 text-white shadow-xl">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              <Sparkles className="h-4 w-4" /> Learning with video
            </div>
            <h1 className="text-[28px] font-semibold leading-tight sm:text-[32px]">
              Build classroom-ready quizzes from any YouTube lesson in minutes.
            </h1>
            <p className="text-base text-white/80">
              We layer pedagogy-first question design, transcript analysis, and accessibility tools so video-based
              learning is purposeful for every student.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center gap-2 rounded-2xl bg-white/15 px-3 py-2">
                <GraduationCap className="h-5 w-5" /> Standards-aligned item templates
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-white/15 px-3 py-2">
                <Languages className="h-5 w-5" /> Multilingual subtitles support
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-white/15 px-3 py-2">
                <CheckCircle2 className="h-5 w-5" /> Auto differentiation pathways
              </div>
            </div>
          </div>

          <div className="grid w-full max-w-sm gap-3 rounded-2xl bg-white/10 p-4 text-white backdrop-blur">
            {progressHighlights.map((item) => (
              <div key={item.label} className="rounded-xl border border-white/20 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-white/70">{item.label}</p>
                <p className="mt-1 text-2xl font-semibold">{item.value}</p>
                <p className="mt-1 text-xs text-white/70">{item.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                  <Youtube className="h-6 w-6 text-red-500" />
                  Generate your quiz blueprint
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Paste a YouTube lesson, set your audience, and let our AI craft scaffolded question pathways.
                </p>
                {appliedStrategy && (
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Strategy applied: {appliedStrategy}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePreview}
                  disabled={!hasGenerated || isGenerating}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-red-500 bg-white px-4 py-2 text-sm font-semibold text-red-500 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:border-red-300 disabled:text-red-300"
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </button>
                <button
                  onClick={handleGenerateQuiz}
                  disabled={isGenerating || !videoUrl.trim() || !isVideoUrlValid}
                  className="inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-400 disabled:cursor-not-allowed disabled:bg-red-300"
                >
                  <Play className={`h-4 w-4 ${isGenerating ? 'animate-pulse' : ''}`} />
                  {isGenerating ? 'Analysing…' : 'Generate quiz'}
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-700">YouTube video link</label>
                <div className="mt-2 flex flex-col gap-3 md:flex-row">
                  <input
                    value={videoUrl}
                    onChange={(event) => {
                      const nextUrl = event.target.value
                      setVideoUrl(nextUrl)
                      setUrlError(nextUrl.trim() ? getVideoUrlValidationError(nextUrl) : null)
                      setApiError(null)
                      setHasGenerated(false)
                      setQuizPreview(null)
                    }}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className={`w-full rounded-xl bg-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 ${
                      urlError
                        ? 'border border-red-300 focus:border-red-400 focus:ring-red-100'
                        : 'border border-gray-200 focus:border-red-300 focus:ring-red-100'
                    }`}
                  />
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-3 text-xs text-red-500">
                    <Video className="h-4 w-4" /> Transcript & keywords extracted automatically
                  </div>
                </div>
                {(urlError || apiError) && (
                  <p className="mt-2 text-xs text-red-600">{urlError || apiError}</p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Grade band</label>
                  <select
                    value={gradeBand}
                    onChange={(event) => setGradeBand(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-100"
                  >
                    <option>Grades 3-5</option>
                    <option>Grades 6-8</option>
                    <option>Grades 9-10</option>
                    <option>Grades 11-12</option>
                    <option>Higher Education</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Subject lens</label>
                  <select
                    value={subjectArea}
                    onChange={(event) => setSubjectArea(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-100"
                  >
                    <option>Science & STEM</option>
                    <option>Mathematics</option>
                    <option>English Language Arts</option>
                    <option>Social Sciences</option>
                    <option>Creative Arts & Media</option>
                    <option>Career & Technical Education</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Learning focus</label>
                  <select
                    value={learningFocus}
                    onChange={(event) => setLearningFocus(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-100"
                  >
                    <option>Concept comprehension</option>
                    <option>Vocabulary development</option>
                    <option>Critical analysis</option>
                    <option>Lab skills & procedures</option>
                    <option>Project reflection</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Quiz language</label>
                  <select
                    value={language}
                    onChange={(event) => setLanguage(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-100"
                  >
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>Arabic</option>
                    <option>Hindi</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Question styles</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {questionStyles.map((style) => (
                      <button
                        key={style}
                        onClick={() => handleToggleStyle(style)}
                        type="button"
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                          selectedStyles.includes(style)
                            ? 'border-red-400 bg-red-50 text-red-600'
                            : 'border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-600'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="flex items-center justify-between text-sm font-semibold text-gray-700">
                    Question count
                    <span className="text-xs font-normal text-gray-500">{questionCount} prompts</span>
                  </label>
                  <input
                    type="range"
                    min={4}
                    max={12}
                    value={questionCount}
                    onChange={(event) => setQuestionCount(Number(event.target.value))}
                    className="mt-3 w-full accent-red-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">Slider adjusts pacing recommendations & differentiations.</p>
                </div>
              </div>
            </div>

            {/* Reference Videos Section */}
            <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <div className="flex items-center gap-2 mb-4">
                <LinkIcon className="h-5 w-5 text-red-500" />
                <h3 className="text-sm font-semibold text-gray-900">Try with example videos</h3>
              </div>
              <p className="text-xs text-gray-600 mb-4">
                Click any video below to automatically fill the form and generate a quiz instantly.
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {referenceVideos.map((video, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleUseReference(video)}
                    className="group flex items-start gap-3 rounded-xl border-2 border-gray-200 bg-white p-4 text-left transition hover:border-red-300 hover:shadow-md"
                  >
                    <div className="relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 opacity-0 transition group-hover:opacity-100">
                        <Play className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-red-600">
                        {video.title}
                      </h4>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span>{video.gradeBand}</span>
                        <span>•</span>
                        <span>{video.subjectArea}</span>
                        <span>•</span>
                        <span>{video.duration}</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-600 line-clamp-1">{video.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-4 rounded-2xl bg-gray-50/80 p-5 md:grid-cols-3">
              {workflowSteps.map((step) => {
                const Icon = step.icon
                return (
                  <div key={step.title} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-red-500 shadow-sm">
                        <Icon className="h-4 w-4" />
                      </div>
                      {step.title}
                    </div>
                    <p className="text-xs leading-relaxed text-gray-600">{step.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <LessonFlowBuilder onStrategyApplied={setAppliedStrategy} />
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-600">
              <BookOpen className="h-4 w-4 text-red-500" /> Sample classroom use
            </h3>
            <div className="mt-4 space-y-4 text-sm text-gray-700">
              <div className="rounded-2xl bg-red-50 p-4">
                <p className="font-semibold text-gray-900">Day-before preview</p>
                <p className="mt-1 text-gray-600">
                  Share the quiz as pre-work. Students collect unfamiliar vocab while watching at home, then tackle
                  higher-order prompts when class begins.
                </p>
              </div>
              <div className="rounded-2xl bg-orange-50 p-4">
                <p className="font-semibold text-gray-900">Station rotation</p>
                <p className="mt-1 text-gray-600">
                  Set up a media lab station featuring the clip, earbuds, and QR code access to the adaptive quiz.
                </p>
              </div>
              <div className="rounded-2xl bg-rose-50 p-4">
                <p className="font-semibold text-gray-900">Mini-documentary study</p>
                <p className="mt-1 text-gray-600">
                  Pair longer-form YouTube documentaries with reflection prompts to build media literacy and note-taking habits.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-600">
              <Target className="h-4 w-4 text-red-500" /> Pedagogical guardrails
            </h3>
            <ul className="mt-4 space-y-4 text-sm text-gray-600">
              {pedagogyNotes.map((note) => {
                const Icon = note.icon
                return (
                  <li key={note.title} className="flex gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{note.title}</p>
                      <p className="text-sm text-gray-600">{note.body}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          <QuickStartVideoSources />

          <AICapabilityPreview />
        </aside>
      </section>

      <ClassroomUseFlow />
    </div>
  )
}

export default YouTubeQuizGenerator


