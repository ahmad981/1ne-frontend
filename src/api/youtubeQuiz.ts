import { apiRequest } from './client'

export interface YouTubeQuizGenerateRequest {
  video_url: string
  grade_band: string
  subject_lens: string
  learning_focus: string
  quiz_language: string
  question_styles: string[]
  question_count: number
}

export interface YouTubeQuizSection {
  heading: string
  details: string
  questions: YouTubeQuizQuestion[]
}

export type QuestionStyle = 'multiple_choice' | 'higher_order' | 'quick_check' | 'discussion_prompt'
export type QuickCheckResponseType = 'one_word' | 'short_phrase' | 'true_false'

export interface YouTubeQuizQuestion {
  id: string
  style: QuestionStyle
  prompt: string
  options?: string[]
  correct_option_index?: number
  sample_answer?: string
  rubric_points?: string[]
  expected_response_type?: QuickCheckResponseType
  answer?: string | boolean
}

export interface YouTubeQuizGenerateResponse {
  title: string
  summary: string
  sections: YouTubeQuizSection[]
}

export const generateYouTubeQuiz = (payload: YouTubeQuizGenerateRequest) => {
  return apiRequest<YouTubeQuizGenerateResponse>('/v1/youtube-quiz/generate', {
    method: 'POST',
    body: payload,
  })
}

