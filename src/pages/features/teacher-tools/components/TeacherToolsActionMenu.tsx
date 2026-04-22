import { useEffect, useRef, useState } from 'react'
import { MoreHorizontal } from 'lucide-react'

export interface ActionItem {
  key: string
  label: string
  onClick: () => void
  danger?: boolean
}

interface Props {
  actions: ActionItem[]
}

export function TeacherToolsActionMenu({ actions }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
        aria-label="Actions"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-1 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
          {actions.map((a) => (
            <button
              key={a.key}
              type="button"
              onClick={() => {
                a.onClick()
                setOpen(false)
              }}
              className={`block w-full px-3 py-2 text-left text-sm ${
                a.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
