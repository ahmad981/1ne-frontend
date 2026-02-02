/**
 * Worksheet Generator Page
 */
import React, { useState, useEffect } from 'react'
import { Loader2, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  fetchContentPacks,
  generateWorksheet,
  ContentPack,
  WorksheetGenerateRequest,
  Worksheet,
} from '../../api/contentIngestion'
import { WorksheetDisplay } from '../../components/contentIngestion/WorksheetDisplay'
import { useSnackbar } from '../../hooks/useSnackbar'

export const WorksheetGenerator = () => {
  const [packs, setPacks] = useState<ContentPack[]>([])
  const [selectedPack, setSelectedPack] = useState<string>('')
  const [topicText, setTopicText] = useState('')
  const [grade, setGrade] = useState('')
  const [subject, setSubject] = useState('')
  const [numQuestions, setNumQuestions] = useState(10)
  const [difficultyEasy, setDifficultyEasy] = useState(0.3)
  const [difficultyMedium, setDifficultyMedium] = useState(0.5)
  const [difficultyHard, setDifficultyHard] = useState(0.2)
  const [questionTypes, setQuestionTypes] = useState<string[]>(['mcq', 'short_answer'])
  const [generatedWorksheet, setGeneratedWorksheet] = useState<Worksheet | null>(null)
  const [generating, setGenerating] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useSnackbar()
  const navigate = useNavigate()
  
  useEffect(() => {
    loadPacks()
  }, [])
  
  const loadPacks = async () => {
    try {
      setLoading(true)
      const data = await fetchContentPacks({ is_active: true })
      setPacks(data || [])
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to load content packs'
      toast.error(errorMessage)
      console.error('Error loading content packs:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPack) {
      toast.error('Please select a content pack')
      return
    }
    
    if (!topicText.trim()) {
      toast.error('Please enter a topic')
      return
    }
    
    // Validate difficulty mix sums to 1.0
    const total = difficultyEasy + difficultyMedium + difficultyHard
    if (Math.abs(total - 1.0) > 0.01) {
      toast.error('Difficulty mix must sum to 1.0')
      return
    }
    
    try {
      setGenerating(true)
      
      const request: WorksheetGenerateRequest = {
        pack_id: selectedPack,
        topic_text: topicText,
        grade: grade || undefined,
        subject: subject || undefined,
        difficulty_mix: {
          easy: difficultyEasy,
          medium: difficultyMedium,
          hard: difficultyHard,
        },
        num_questions: numQuestions,
        question_types: questionTypes,
      }
      
      const worksheet = await generateWorksheet(request)
      setGeneratedWorksheet(worksheet)
      toast.success('Worksheet generated successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate worksheet')
    } finally {
      setGenerating(false)
    }
  }
  
  const selectedPackData = packs.find((p) => p.id === selectedPack)
  
  if (generatedWorksheet) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Generated Worksheet</h1>
            <button
              onClick={() => setGeneratedWorksheet(null)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Generate Another
            </button>
          </div>
          
          <WorksheetDisplay worksheet={generatedWorksheet} showAnswers={false} />
          
          <div className="mt-6 flex space-x-3">
            <button
              onClick={() => {
                setGeneratedWorksheet({ ...generatedWorksheet } as Worksheet)
                // Toggle showAnswers by creating new worksheet with answers visible
                navigate(`/worksheets/${generatedWorksheet.id}?answers=true`)
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              View with Answers
            </button>
            <button
              onClick={() => {
                // Print or export functionality
                window.print()
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Print / Export
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Generate Worksheet</h1>
          <p className="text-gray-600 mt-1">
            Generate worksheets from curriculum content using AI
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Pack *
              </label>
              {loading ? (
                <div className="flex items-center space-x-2 text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading packs...</span>
                </div>
              ) : (
                <select
                  value={selectedPack}
                  onChange={(e) => setSelectedPack(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a content pack...</option>
                  {(packs || []).map((pack) => (
                    <option key={pack.id} value={pack.id}>
                      {pack.name} {pack.subject ? `- ${pack.subject}` : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>
            
            {selectedPackData && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Pack:</strong> {selectedPackData.name}
                  {selectedPackData.subject && ` • ${selectedPackData.subject}`}
                  {selectedPackData.grade && ` • ${selectedPackData.grade}`}
                </p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic *
              </label>
              <input
                type="text"
                value={topicText}
                onChange={(e) => setTopicText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Fractions, Photosynthesis, World War II"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the topic or chapter you want to generate questions about
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade (optional)
                </label>
                <input
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Grade 5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject (optional)
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Mathematics"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value) || 10)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Mix (must sum to 1.0)
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Easy</label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={difficultyEasy}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0
                      setDifficultyEasy(val)
                      // Auto-adjust others to sum to 1.0
                      const remaining = 1.0 - val
                      const currentMedium = difficultyMedium
                      const currentHard = difficultyHard
                      const totalOther = currentMedium + currentHard
                      if (totalOther > 0) {
                        setDifficultyMedium((currentMedium / totalOther) * remaining)
                        setDifficultyHard((currentHard / totalOther) * remaining)
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Medium</label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={difficultyMedium}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0
                      setDifficultyMedium(val)
                      const remaining = 1.0 - difficultyEasy - val
                      setDifficultyHard(Math.max(0, remaining))
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Hard</label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={difficultyHard}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0
                      setDifficultyHard(val)
                      const remaining = 1.0 - difficultyEasy - val
                      setDifficultyMedium(Math.max(0, remaining))
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Total: {(difficultyEasy + difficultyMedium + difficultyHard).toFixed(2)}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Types
              </label>
              <div className="space-y-2">
                {['mcq', 'short_answer', 'essay', 'diagram', 'matching'].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={questionTypes.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setQuestionTypes([...questionTypes, type])
                        } else {
                          setQuestionTypes(questionTypes.filter((t) => t !== type))
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">
                      {type.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            <button
              type="submit"
              disabled={generating || !selectedPack || !topicText.trim()}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating Worksheet...</span>
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  <span>Generate Worksheet</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
