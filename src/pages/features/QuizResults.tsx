import { useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Download,
  Share2,
  Eye,
  EyeOff,
  BookOpen,
  MessageSquare,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react'
import { useState } from 'react'
import { useSnackbar } from '../../hooks/useSnackbar'
import { YouTubeQuizQuestion, YouTubeQuizSection } from '../../api/youtubeQuiz'

interface QuizPreview {
  title: string
  summary: string
  sections: YouTubeQuizSection[]
}

const QuizResults = () => {
  const { toast } = useSnackbar()
  const location = useLocation()
  const navigate = useNavigate()
  const [showAnswers, setShowAnswers] = useState(false)
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

  const formatQuizForSharing = (data: QuizPreview, includeAnswers: boolean) => {
    const lines: string[] = [data.title, data.summary, '']
    data.sections.forEach((section, sectionIndex) => {
      lines.push(`${sectionIndex + 1}. ${section.heading}`)
      lines.push(section.details)
      section.questions.forEach((question, questionIndex) => {
        lines.push(`  ${questionIndex + 1}) ${question.prompt}`)
        if (question.style === 'multiple_choice' && question.options) {
          question.options.forEach((option, optionIndex) => {
            const optionLabel = String.fromCharCode(65 + optionIndex)
            lines.push(`     ${optionLabel}. ${option}`)
          })
          if (includeAnswers && typeof question.correct_option_index === 'number') {
            lines.push(`     Answer: ${String.fromCharCode(65 + question.correct_option_index)}`)
          }
        }
        if (includeAnswers) {
          if (question.style === 'quick_check' && question.answer !== undefined) {
            lines.push(`     Answer: ${String(question.answer)}`)
          }
          if ((question.style === 'higher_order' || question.style === 'discussion_prompt') && question.sample_answer) {
            lines.push(`     Sample answer: ${question.sample_answer}`)
          }
        }
      })
      lines.push('')
    })
    return lines.join('\n')
  }

  const handleShare = async () => {
    const shareText = formatQuizForSharing(quizData, showAnswers)
    try {
      if (navigator.share) {
        await navigator.share({
          title: quizData.title,
          text: shareText,
        })
        toast.success('Quiz shared successfully.')
        return
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText)
        toast.success('Quiz copied to clipboard.')
        return
      }
      toast.warning('Sharing is not supported on this browser.')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to share quiz.'
      toast.error(errorMessage)
    }
  }

  const handleExportPdf = () => {
    try {
      window.print()
      toast.success('Print dialog opened for PDF export.')
    } catch {
      toast.error('Unable to open print dialog for export.')
    }
  }

  const renderQuestion = (question: YouTubeQuizQuestion) => {
    if (question.style === 'multiple_choice') {
      return (
        <div className="mt-3 space-y-2">
          {question.options?.map((option, optionIdx) => {
            const isCorrect = showAnswers && optionIdx === question.correct_option_index
            return (
              <div
                key={`${question.id}-${optionIdx}`}
                className={`rounded-lg border px-3 py-2 text-sm ${
                  isCorrect ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-gray-200 bg-white text-gray-700'
                }`}
              >
                <span className="font-semibold mr-2">{String.fromCharCode(65 + optionIdx)}.</span>
                {option}
                {isCorrect && <CheckCircle2 className="ml-2 inline h-4 w-4" />}
              </div>
            )
          })}
        </div>
      )
    }

    if (question.style === 'quick_check') {
      return (
        <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-700">
          <p>
            <span className="font-semibold">Response type:</span> {question.expected_response_type || 'short_phrase'}
          </p>
          {showAnswers && (
            <p className="mt-1 text-emerald-700">
              <span className="font-semibold">Answer:</span> {String(question.answer)}
            </p>
          )}
        </div>
      )
    }

    return (
      <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-700">
        <p className="text-gray-600">Long response prompt.</p>
        {showAnswers && question.sample_answer && (
          <p className="mt-2">
            <span className="font-semibold text-gray-900">Sample answer:</span> {question.sample_answer}
          </p>
        )}
        {showAnswers && question.rubric_points && question.rubric_points.length > 0 && (
          <ul className="mt-2 list-disc pl-5 text-gray-700">
            {question.rubric_points.map((point, idx) => (
              <li key={`${question.id}-rubric-${idx}`}>{point}</li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8 print:space-y-4">
      <style>{'@media print { .print-hide { display: none !important; } .print-page-break { page-break-inside: avoid; } }'}</style>
      {/* Header */}
      <div className="flex items-center justify-between print-hide">
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
          <button
            onClick={() => setShowAnswers((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            {showAnswers ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showAnswers ? 'Hide answers' : 'Show answers'}
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
          <button
            onClick={handleExportPdf}
            className="inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400"
          >
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
            <div key={sectionIdx} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm print-page-break">
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
                        key={question.id || qIdx}
                        className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4"
                      >
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-semibold text-red-600">
                          {qIdx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{question.prompt}</p>
                          {renderQuestion(question)}
                        </div>
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
      <div className="rounded-3xl border border-gray-200 bg-gradient-to-r from-red-50 to-orange-50 p-6 print-hide">
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


