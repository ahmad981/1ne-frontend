import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom'
import { TeacherToolsPageHeader, TeacherToolsWizardStepper, ContentSourcesPanel, Phase2Section } from '../components'
import { useContentSourcesForm } from '../hooks/useContentSourcesForm'
import { demoClasses } from '../demo/teacherToolsDemoData'
import { formatSourceSummary, generateWorksheetBlocks } from '../demo/generationFromSources'
import type { WorksheetBlock } from '../demo/topicAwareGenerators'
import { GRADES, SUBJECTS } from '../types'
import { newDemoId } from '../demo/newDemoId'
import { useTeacherToolsDemo } from '../TeacherToolsDemoProvider'
// @ts-expect-error — JS module
import { useSnackbar } from '../../../../hooks/useSnackbar'
// @ts-expect-error — JS module
import { CustomModal } from '../../../../components/shared/CustomModal'

const steps = ['Basics & sources', 'Content', 'Settings', 'Assign', 'Preview']

function classKeyForGrade(grade: string) {
  return demoClasses.find((c) => c.grade === grade)?.key ?? demoClasses[0]?.key ?? 'g8c'
}

export default function WorksheetCreate() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const templateToastRef = useRef(false)
  const { worksheetId } = useParams<{ worksheetId?: string }>()
  const isEdit = location.pathname.endsWith('/edit')
  const { toast } = useSnackbar()
  const { api } = useTeacherToolsDemo()
  const [step, setStep] = useState(0)
  const [title, setTitle] = useState('Practice worksheet')
  const [subject, setSubject] = useState<string>(SUBJECTS[3])
  const [grade, setGrade] = useState<string>(GRADES[3])
  const [format, setFormat] = useState<'printable_pdf' | 'interactive_digital'>('interactive_digital')
  const [blocks, setBlocks] = useState<WorksheetBlock[]>([])
  const [discardOpen, setDiscardOpen] = useState(false)
  const [loadedTopic, setLoadedTopic] = useState<string | undefined>(undefined)
  const [hydrateReady, setHydrateReady] = useState(!isEdit)
  const [publishPending, setPublishPending] = useState(false)
  const [usageMeta, setUsageMeta] = useState({ createdAt: '', usageCount: 0 })

  const sources = useContentSourcesForm({
    subject,
    grade,
    initialTopic: loadedTopic,
  })

  useEffect(() => {
    if (isEdit) return
    const titleParam = searchParams.get('title')
    if (titleParam) setTitle(titleParam)
    const sub = searchParams.get('subject')
    if (sub && SUBJECTS.includes(sub)) setSubject(sub)
    const gr = searchParams.get('grade')
    if (gr && GRADES.includes(gr)) setGrade(gr)
    const topic = searchParams.get('topic')
    if (topic) setLoadedTopic(topic)
    const fmt = searchParams.get('format')
    if (fmt === 'printable_pdf' || fmt === 'interactive_digital') setFormat(fmt)
    if (searchParams.get('fromTemplate') && !templateToastRef.current) {
      templateToastRef.current = true
      toast.success('Prefilled from template')
    }
  }, [isEdit, searchParams, toast])

  useEffect(() => {
    if (!isEdit || !worksheetId) {
      setHydrateReady(true)
      return
    }
    let cancelled = false
    setHydrateReady(false)
    ;(async () => {
      const w = await api.getWorksheet(worksheetId)
      if (cancelled) return
      if (!w) {
        toast.error('Worksheet not found')
        navigate('/teacher-tools/worksheet')
        return
      }
      setTitle(w.title)
      setSubject(w.subject)
      setGrade(w.grade)
      setFormat(w.format)
      setLoadedTopic(w.topic)
      setUsageMeta({ createdAt: w.createdAt, usageCount: w.usageCount })
      setHydrateReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [api, isEdit, navigate, toast, worksheetId])

  useEffect(() => {
    if (step !== 1) return
    setBlocks(generateWorksheetBlocks(sources.getGenerationContext()))
  }, [step, sources.generationSignature, sources.getGenerationContext]) // eslint-disable-line react-hooks/exhaustive-deps

  const regenerate = useCallback(() => {
    setBlocks(generateWorksheetBlocks(sources.getGenerationContext()))
    toast.success('Regenerated from sources')
  }, [sources.getGenerationContext, toast]) // eslint-disable-line react-hooks/exhaustive-deps

  const goList = () => navigate('/teacher-tools/worksheet')

  if (isEdit && !hydrateReady) {
    return (
      <div className="space-y-4 p-8 text-sm text-gray-600">
        <p>Loading worksheet…</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <TeacherToolsPageHeader
        title={isEdit ? 'Edit worksheet' : 'Create worksheet'}
        breadcrumbs={[
          { label: 'Teacher Tools', to: '/teacher-tools' },
          { label: 'Worksheet', to: '/teacher-tools/worksheet' },
          { label: isEdit ? 'Edit' : 'Create' },
        ]}
      />
      <TeacherToolsWizardStepper steps={steps} current={step} onStepClick={setStep} />
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        {step === 0 && (
          <div className="space-y-6">
            <div className="grid gap-3 md:grid-cols-2 text-sm">
              <label className="block font-medium text-gray-700">
                Title
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                />
              </label>
              <label className="block font-medium text-gray-700">
                Format
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as typeof format)}
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                >
                  <option value="interactive_digital">Interactive digital</option>
                  <option value="printable_pdf">Printable PDF</option>
                </select>
              </label>
              <label className="block">
                Subject
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                Grade
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                >
                  {GRADES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <ContentSourcesPanel subject={subject} grade={grade} model={sources} />
          </div>
        )}
        {step === 1 && (
          <div className="space-y-3 text-sm text-gray-800">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs text-gray-500">
                Blocks reflect topic and optional catalog grounding: {formatSourceSummary(sources.getGenerationContext())}
              </p>
              <button type="button" onClick={regenerate} className="text-xs font-semibold text-primary-600">
                Regenerate
              </button>
            </div>
            {blocks.map((b, i) => (
              <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs font-semibold text-gray-500">{b.type}</p>
                {'prompt' in b && <p className="mt-1">{b.prompt}</p>}
              </div>
            ))}
          </div>
        )}
        {step === 2 && <p className="text-sm text-gray-700">Answer key and printable layout options (preview).</p>}
        {step === 3 && (
          <Phase2Section title="Share with classes">
            <p className="text-sm text-gray-700">Control which classes receive this worksheet and when it unlocks.</p>
          </Phase2Section>
        )}
        {step === 4 && <p className="text-sm text-gray-700">Printable and digital student preview (preview).</p>}
      </div>

      <CustomModal
        open={discardOpen}
        close={() => setDiscardOpen(false)}
        title="Discard source selections?"
        primaryButtonText="Discard and leave"
        isDelete
        handleSave={() => {
          sources.resetSources()
          setDiscardOpen(false)
          goList()
        }}
      >
        <p className="py-3 text-sm text-gray-600">You changed content sources. Leave without publishing?</p>
      </CustomModal>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800"
        >
          Back
        </button>
        <button
          type="button"
          className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white"
          onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
        >
          Next
        </button>
        <button type="button" className="rounded-full border px-4 py-2 text-sm" onClick={() => toast.success('Draft saved')}>
          Save draft
        </button>
        <button
          type="button"
          disabled={publishPending}
          className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          onClick={async () => {
            const ctx = sources.getGenerationContext()
            const createdAt =
              isEdit && usageMeta.createdAt
                ? usageMeta.createdAt
                : new Date().toISOString().slice(0, 10)
            const payload = {
              title,
              topic: sources.combinedTopicLabel,
              subject,
              grade,
              format,
              status: 'published' as const,
              classes: [classKeyForGrade(grade)],
              createdAt,
              usageCount: isEdit ? usageMeta.usageCount : 0,
              sourceSummary: formatSourceSummary(ctx),
            }
            setPublishPending(true)
            try {
              if (isEdit && worksheetId) {
                const res = await api.updateWorksheet(worksheetId, payload)
                if (!res.ok) {
                  if (res.error === 'READ_ONLY') {
                    toast.error('Sample library items cannot be edited. Duplicate from the list first.')
                  } else {
                    toast.error('Could not save worksheet')
                  }
                  return
                }
                toast.success('Worksheet updated')
              } else {
                await api.createWorksheet({
                  id: newDemoId('ws'),
                  ...payload,
                })
                toast.success('Worksheet published')
              }
              goList()
            } finally {
              setPublishPending(false)
            }
          }}
        >
          {publishPending ? 'Saving…' : isEdit ? 'Save changes' : 'Publish'}
        </button>
      </div>
      <button
        type="button"
        onClick={() => {
          if (sources.isDirty) setDiscardOpen(true)
          else goList()
        }}
        className="text-sm font-semibold text-primary-600"
      >
        ← Back to list
      </button>
    </div>
  )
}
