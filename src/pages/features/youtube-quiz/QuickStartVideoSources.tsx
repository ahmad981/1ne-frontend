import { useState } from 'react'
import { Youtube, Play, CheckCircle2 } from 'lucide-react'
import { useSnackbar } from '../../../hooks/useSnackbar'

interface DemoVideo {
  title: string
  gradeBand: string
  subject: string
  duration: string
  tags: string[]
  transcript: boolean
  bestQuizType: string
}

interface Channel {
  id: string
  name: string
  focus: string
  gradeBand: string
  cardCls: string
  activeCls: string
  videos: DemoVideo[]
}

// TODO: Replace with backend API response later.
const CHANNELS: Channel[] = [
  {
    id: 'crashcourse',
    name: 'CrashCourse EDU',
    focus: 'Standards-aligned humanities and science explainers',
    gradeBand: 'Grades 6–12',
    cardCls: 'border-gray-100 bg-gray-50 hover:border-purple-300',
    activeCls: 'border-purple-400 bg-purple-50',
    videos: [
      {
        title: 'The French Revolution — CrashCourse World History',
        gradeBand: 'Grades 9–10',
        subject: 'Social Sciences',
        duration: '12:41',
        tags: ['History', 'Revolution', 'Europe'],
        transcript: true,
        bestQuizType: 'Higher-order thinking + Discussion',
      },
      {
        title: 'Mitosis vs Meiosis — CrashCourse Biology',
        gradeBand: 'Grades 9–10',
        subject: 'Science & STEM',
        duration: '11:02',
        tags: ['Biology', 'Cell division', 'Genetics'],
        transcript: true,
        bestQuizType: 'Multiple choice + Quick check',
      },
      {
        title: 'The Civil War — CrashCourse US History',
        gradeBand: 'Grades 10–11',
        subject: 'Social Sciences',
        duration: '14:23',
        tags: ['American History', 'Politics', 'Conflict'],
        transcript: true,
        bestQuizType: 'Critical analysis + Discussion',
      },
    ],
  },
  {
    id: 'numberphile',
    name: 'Numberphile Classroom',
    focus: 'Conceptual mathematics storytelling',
    gradeBand: 'Grades 7–12',
    cardCls: 'border-gray-100 bg-gray-50 hover:border-blue-300',
    activeCls: 'border-blue-400 bg-blue-50',
    videos: [
      {
        title: "Why Can't You Divide by Zero?",
        gradeBand: 'Grades 6–8',
        subject: 'Mathematics',
        duration: '7:21',
        tags: ['Division', 'Number theory', 'Concept'],
        transcript: true,
        bestQuizType: 'Multiple choice + Open-ended',
      },
      {
        title: 'The Fibonacci Sequence — Hidden in Nature',
        gradeBand: 'Grades 7–9',
        subject: 'Mathematics',
        duration: '9:14',
        tags: ['Patterns', 'Sequences', 'Nature'],
        transcript: true,
        bestQuizType: 'Higher-order thinking + Discussion',
      },
      {
        title: 'What is the Riemann Hypothesis?',
        gradeBand: 'Grades 11–12',
        subject: 'Mathematics',
        duration: '15:48',
        tags: ['Advanced maths', 'Primes', 'Unsolved'],
        transcript: false,
        bestQuizType: 'Discussion + Higher-order thinking',
      },
    ],
  },
  {
    id: 'khan',
    name: 'Khan Academy Science',
    focus: 'Mastery-based STEM progression',
    gradeBand: 'Grades 4–12',
    cardCls: 'border-gray-100 bg-gray-50 hover:border-green-300',
    activeCls: 'border-green-400 bg-green-50',
    videos: [
      {
        title: "Newton's Laws of Motion — Introduction",
        gradeBand: 'Grades 8–9',
        subject: 'Science & STEM',
        duration: '8:36',
        tags: ['Physics', 'Forces', 'Newton'],
        transcript: true,
        bestQuizType: 'Quick check + Multiple choice',
      },
      {
        title: 'The Periodic Table — Elements & Trends',
        gradeBand: 'Grades 9–10',
        subject: 'Science & STEM',
        duration: '10:55',
        tags: ['Chemistry', 'Periodic table', 'Elements'],
        transcript: true,
        bestQuizType: 'Multiple choice + Vocabulary',
      },
      {
        title: 'DNA Replication — In Detail',
        gradeBand: 'Grades 10–11',
        subject: 'Science & STEM',
        duration: '13:02',
        tags: ['Biology', 'DNA', 'Genetics'],
        transcript: true,
        bestQuizType: 'Multiple choice + Quick check',
      },
    ],
  },
  {
    id: 'ted-ed',
    name: 'TED-Ed Lessons',
    focus: 'Curiosity-driven interdisciplinary content',
    gradeBand: 'Grades 6–12',
    cardCls: 'border-gray-100 bg-gray-50 hover:border-red-300',
    activeCls: 'border-red-400 bg-red-50',
    videos: [
      {
        title: 'How to Make Your Writing Suspenseful',
        gradeBand: 'Grades 7–9',
        subject: 'English Language Arts',
        duration: '4:43',
        tags: ['Writing', 'Craft', 'Narrative'],
        transcript: true,
        bestQuizType: 'Discussion + Higher-order thinking',
      },
      {
        title: 'The Science of Symmetry',
        gradeBand: 'Grades 6–8',
        subject: 'Mathematics',
        duration: '5:12',
        tags: ['Patterns', 'Maths', 'Nature'],
        transcript: true,
        bestQuizType: 'Open-ended + Multiple choice',
      },
      {
        title: 'How Pandemics Spread',
        gradeBand: 'Grades 9–11',
        subject: 'Science & STEM',
        duration: '6:28',
        tags: ['Biology', 'Public health', 'History'],
        transcript: true,
        bestQuizType: 'Discussion + Critical analysis',
      },
    ],
  },
  {
    id: 'natgeo',
    name: 'National Geographic Education',
    focus: 'Visual storytelling — geography, ecology, and culture',
    gradeBand: 'Grades 5–10',
    cardCls: 'border-gray-100 bg-gray-50 hover:border-yellow-300',
    activeCls: 'border-yellow-400 bg-yellow-50',
    videos: [
      {
        title: 'Climate Change 101 — Causes and Effects',
        gradeBand: 'Grades 7–9',
        subject: 'Science & STEM',
        duration: '3:52',
        tags: ['Climate', 'Environment', 'Geography'],
        transcript: true,
        bestQuizType: 'Multiple choice + Discussion',
      },
      {
        title: 'Ocean Ecosystems — Life Beneath the Waves',
        gradeBand: 'Grades 5–7',
        subject: 'Science & STEM',
        duration: '5:34',
        tags: ['Ocean', 'Biodiversity', 'Ecology'],
        transcript: true,
        bestQuizType: 'Quick check + Concept comprehension',
      },
      {
        title: 'Deforestation — Causes and Solutions',
        gradeBand: 'Grades 8–10',
        subject: 'Science & STEM',
        duration: '4:17',
        tags: ['Environment', 'Forests', 'Sustainability'],
        transcript: false,
        bestQuizType: 'Higher-order thinking + Discussion',
      },
    ],
  },
  {
    id: 'scishow',
    name: 'SciShow Kids',
    focus: 'Accessible STEM for early learners',
    gradeBand: 'Grades K–5',
    cardCls: 'border-gray-100 bg-gray-50 hover:border-orange-300',
    activeCls: 'border-orange-400 bg-orange-50',
    videos: [
      {
        title: 'Why Do We Have Seasons?',
        gradeBand: 'Grades 2–4',
        subject: 'Science & STEM',
        duration: '3:22',
        tags: ['Earth science', 'Seasons', 'Space'],
        transcript: true,
        bestQuizType: 'Quick check + Multiple choice',
      },
      {
        title: 'What is a Volcano?',
        gradeBand: 'Grades 1–3',
        subject: 'Science & STEM',
        duration: '2:58',
        tags: ['Geology', 'Volcanoes', 'Earth'],
        transcript: true,
        bestQuizType: 'Quick check + Vocabulary',
      },
      {
        title: 'The Water Cycle Explained Simply',
        gradeBand: 'Grades 3–5',
        subject: 'Science & STEM',
        duration: '4:05',
        tags: ['Water cycle', 'Weather', 'Environment'],
        transcript: true,
        bestQuizType: 'Multiple choice + Concept comprehension',
      },
    ],
  },
]

interface Props {
  onDemoVideoSelected?: (videoTitle: string) => void
}

export function QuickStartVideoSources({ onDemoVideoSelected }: Props) {
  const { toast } = useSnackbar()
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null)
  const [selectedDemoVideo, setSelectedDemoVideo] = useState<string | null>(null)

  const handleSelectVideo = (videoTitle: string) => {
    setSelectedDemoVideo(videoTitle)
    toast.success(`"${videoTitle}" selected for quiz generation.`)
    onDemoVideoSelected?.(videoTitle)
  }

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-600">
        <Youtube className="h-4 w-4 text-red-500" />
        Quick Start Video Sources
      </h3>
      <p className="mt-1 text-xs text-gray-500">
        Select a channel to browse recommended videos.
      </p>

      {selectedDemoVideo && (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
          <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">Selected: {selectedDemoVideo}</span>
        </div>
      )}

      <div className="mt-4 space-y-2">
        {CHANNELS.map((ch) => {
          const isActive = activeChannelId === ch.id
          return (
            <div key={ch.id}>
              <button
                onClick={() => setActiveChannelId(isActive ? null : ch.id)}
                className={`w-full rounded-2xl border-2 p-3 text-left transition-all ${
                  isActive ? ch.activeCls : ch.cardCls
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{ch.name}</p>
                    <p className="text-[10px] uppercase tracking-wide text-gray-500">{ch.gradeBand}</p>
                    <p className="mt-1 text-xs text-gray-600 leading-snug">{ch.focus}</p>
                  </div>
                  <span className="mt-0.5 flex-shrink-0 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    {isActive ? '▲' : '▼'}
                  </span>
                </div>
              </button>

              {isActive && (
                <div className="mt-2 space-y-2 pl-1">
                  {ch.videos.map((v, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
                    >
                      <p className="text-xs font-semibold leading-snug text-gray-900">{v.title}</p>

                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {v.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-2 grid grid-cols-2 gap-x-3 text-[10px] text-gray-500">
                        <span>{v.gradeBand}</span>
                        <span>{v.duration}</span>
                        <span>{v.subject}</span>
                        <span className={v.transcript ? 'text-green-600' : 'text-gray-400'}>
                          {v.transcript ? '✓ Transcript' : 'No transcript'}
                        </span>
                      </div>

                      <p className="mt-1.5 text-[10px] text-gray-500">
                        Best quiz:{' '}
                        <span className="font-medium text-gray-700">{v.bestQuizType}</span>
                      </p>

                      <button
                        onClick={() => handleSelectVideo(v.title)}
                        className={`mt-2 w-full rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                          selectedDemoVideo === v.title
                            ? 'bg-green-500 text-white'
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                      >
                        {selectedDemoVideo === v.title ? (
                          <span className="flex items-center justify-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Selected
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-1">
                            <Play className="h-3 w-3" /> Use this video
                          </span>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
