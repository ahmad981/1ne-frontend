/**
 * Worksheet Display Component with MathJax rendering
 */
import React from 'react'
import { MathJax, MathJaxContext } from 'better-react-mathjax'
import { Worksheet, WorksheetQuestion } from '../../api/contentIngestion'

interface WorksheetDisplayProps {
  worksheet: Worksheet
  showAnswers?: boolean
}

const mathJaxConfig = {
  loader: { load: ['[tex]/html'] },
  tex: {
    packages: { '[+]': ['html'] },
    inlineMath: [['$', '$']],
    displayMath: [['$$', '$$']],
  },
}

export const WorksheetDisplay = ({ worksheet, showAnswers = false }: WorksheetDisplayProps) => {
  if (!worksheet) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">No worksheet data available</p>
      </div>
    )
  }
  
  return (
    <MathJaxContext config={mathJaxConfig}>
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-900">Worksheet</h2>
          {worksheet.topic_text && (
            <p className="text-gray-600 mt-1">Topic: {worksheet.topic_text}</p>
          )}
          {worksheet.grade && worksheet.subject && (
            <p className="text-sm text-gray-500 mt-1">
              {worksheet.grade} • {worksheet.subject}
            </p>
          )}
        </div>
        
        <div className="space-y-6">
          {(worksheet.questions || []).map((question, index) => (
            <div key={question.id} className="border rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <span className="font-semibold text-gray-700">{index + 1}.</span>
                <div className="flex-1">
                  {question.math_content ? (
                    <MathJax inline dynamic>
                      <p className="text-gray-900">{question.question}</p>
                    </MathJax>
                  ) : (
                    <p className="text-gray-900">{question.question}</p>
                  )}
                  
                  {question.type === 'mcq' && question.options && (
                    <div className="mt-3 space-y-2">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`p-2 rounded ${
                            showAnswers && option === question.correct_answer
                              ? 'bg-green-100 border border-green-300'
                              : 'bg-gray-50 border border-gray-200'
                          }`}
                        >
                          <span className="font-medium">{String.fromCharCode(65 + optIndex)}.</span>{' '}
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {showAnswers && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-semibold text-blue-900">Answer:</p>
                      {question.math_content ? (
                        <MathJax inline dynamic>
                          <p className="text-blue-700">{question.correct_answer}</p>
                        </MathJax>
                      ) : (
                        <p className="text-blue-700">{question.correct_answer}</p>
                      )}
                      {question.explanation && (
                        <p className="text-sm text-blue-600 mt-2">{question.explanation}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Points: {question.points} • Difficulty: {question.difficulty}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {showAnswers && worksheet.marking_scheme && (
          <div className="border-t pt-4 mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Marking Scheme</h3>
            <div className="space-y-2">
              {Object.entries(worksheet.marking_scheme || {}).map(([questionId, scheme]: [string, any]) => (
                <div key={questionId} className="text-sm">
                  <span className="font-medium">Q{questionId}:</span>{' '}
                  {scheme.points} points - {scheme.criteria || 'Standard marking'}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MathJaxContext>
  )
}
