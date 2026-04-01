'use client'

import { WizardData } from '@/lib/supabase/types'

interface Props {
  data: WizardData
  onChange: (updates: Partial<WizardData>) => void
}

const RENOVATION_OPTIONS = [
  { value: 'roof',     label: '🏠 Dach erneuert oder gedämmt' },
  { value: 'walls',    label: '🧱 Fassade gedämmt (WDVS)' },
  { value: 'windows',  label: '🪟 Fenster getauscht' },
  { value: 'heating',  label: '🔥 Heizung erneuert' },
  { value: 'basement', label: '🏚️ Kellerboden / -decke gedämmt' },
  { value: 'pv',       label: '☀️ Photovoltaik installiert' },
  { value: 'ventilation', label: '💨 Lüftungsanlage eingebaut' },
]

export default function Step4History({ data, onChange }: Props) {
  const renovations = data.previous_renovations ?? []

  const toggle = (value: string) => {
    const updated = renovations.includes(value)
      ? renovations.filter((r) => r !== value)
      : [...renovations, value]
    onChange({ previous_renovations: updated })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Bisherige Sanierungen</h2>
        <p className="text-gray-500">Was wurde an Ihrem Haus bereits gemacht? (Mehrfachauswahl möglich)</p>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => onChange({ previous_renovations: [] })}
          className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
            renovations.length === 0
              ? 'border-green-700 bg-green-50 text-green-800'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
          }`}
        >
          🔲 Noch nichts saniert
        </button>
        {RENOVATION_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all flex items-center gap-3 ${
              renovations.includes(opt.value)
                ? 'border-green-700 bg-green-50 text-green-800'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            <span className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
              renovations.includes(opt.value) ? 'bg-green-700 border-green-700 text-white' : 'border-gray-300'
            }`}>
              {renovations.includes(opt.value) && '✓'}
            </span>
            {opt.label}
          </button>
        ))}
      </div>

      {/* PV-Anlage Info */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        💡 <strong>Tipp:</strong> Auch wenn Sie bereits einzelne Maßnahmen umgesetzt haben, kann ein
        Sanierungsfahrplan lohnenswert sein – er hilft, die nächsten Schritte optimal zu planen und
        Fördergelder zu sichern.
      </div>
    </div>
  )
}
