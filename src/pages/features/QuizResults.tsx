import { useLocation, useNavigate } from 'react-router-dom'
import {
  Youtube,
  ArrowLeft,
  Download,
  Share2,
  CheckCircle2,
  BookOpen,
  MessageSquare,
  Lightbulb,
} from 'lucide-react'

interface QuizPreview {
  title: string
  summary: string
  sections: Array<{
    heading: string
    details: string
    questions: string[]
  }>
}

const QuizResults = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const quizData = location.state?.quizData as QuizPreview | null

  if (!quizData) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No quiz data found. Please generate a quiz first.</p>
          <button
            onClick={() => navigate('/youtube-quiz')}
            className="mt-4 rounded-full bg-red-500 px-6 py-2 text-sm font-semibold text-white hover:bg-red-400"
          >
            Go to Quiz Generator
          </button>
        </div>
      </div>
    )
  }

  const sectionIcons = {
    'Key idea check': BookOpen,
    'Application & transfer': Lightbulb,
    'Discussion launcher': MessageSquare,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/youtube-quiz')}
            className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Generator
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{quizData.title}</h1>
            <p className="mt-1 text-sm text-gray-600">{quizData.summary}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            <Share2 className="h-4 w-4" />
            Share
          </button>
          <button className="inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400">
            <Download className="h-4 w-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Quiz Sections */}
      <div className="space-y-6">
        {quizData.sections.map((section, sectionIdx) => {
          const Icon = sectionIcons[section.heading as keyof typeof sectionIcons] || BookOpen
          return (
            <div key={sectionIdx} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-900">{section.heading}</h2>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                      {section.questions.length} questions
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{section.details}</p>
                  <div className="mt-4 space-y-3">
                    {section.questions.map((question, qIdx) => (
                      <div
                        key={qIdx}
                        className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4"
                      >
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-semibold text-red-600">
                          {qIdx + 1}
                        </div>
                        <p className="flex-1 text-sm font-medium text-gray-900">{question}</p>
                        <button className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                          Edit
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Action Footer */}
      <div className="rounded-3xl border border-gray-200 bg-gradient-to-r from-red-50 to-orange-50 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Ready to use this quiz?</h3>
            <p className="mt-1 text-sm text-gray-600">
              Export as PDF, share with colleagues, or customize questions before assigning to students.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/youtube-quiz')}
              className="rounded-full border-2 border-red-500 bg-white px-6 py-2 text-sm font-semibold text-red-500 hover:bg-red-50"
            >
              Generate Another
            </button>
            <button className="rounded-full bg-red-500 px-6 py-2 text-sm font-semibold text-white hover:bg-red-400">
              Save to Library
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizResults


