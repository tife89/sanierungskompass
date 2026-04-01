'use client'

import { WizardData } from '@/lib/supabase/types'

interface Props {
  data: WizardData
  onChange: (updates: Partial<WizardData>) => void
}

const BUILDING_TYPES = [
  { value: 'EFH', label: 'Einfamilienhaus', icon: '🏡' },
  { value: 'DHH', label: 'Doppelhaushälfte', icon: '🏘️' },
  { value: 'RH',  label: 'Reihenhaus', icon: '🏠' },
]

export default function Step1Building({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Ihr Gebäude</h2>
        <p className="text-gray-500">Erzählen Sie uns etwas über Ihr Haus.</p>
      </div>

      {/* Gebäudetyp */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Welche Art von Gebäude ist es? <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {BUILDING_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => onChange({ building_type: type.value as WizardData['building_type'] })}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                data.building_type === type.value
                  ? 'border-green-700 bg-green-50 text-green-800'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl">{type.icon}</span>
              <span className="text-sm font-medium">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Baujahr */}
      <div>
        <label htmlFor="year_built" className="block text-sm font-semibold text-gray-700 mb-2">
          Baujahr des Gebäudes <span className="text-red-500">*</span>
        </label>
        <input
          id="year_built"
          type="number"
          min={1900}
          max={2024}
          placeholder="z. B. 1978"
          value={data.year_built ?? ''}
          onChange={(e) => onChange({ year_built: Number(e.target.value) })}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
        />
        <p className="text-xs text-gray-400 mt-1">
          Zu finden in Ihrer Wohngebäudeversicherung oder im Grundbuch.
        </p>
      </div>

      {/* Wohnfläche */}
      <div>
        <label htmlFor="living_area" className="block text-sm font-semibold text-gray-700 mb-2">
          Wohnfläche (in m²) <span className="text-red-500">*</span>
        </label>
        <input
          id="living_area"
          type="number"
          min={20}
          max={2000}
          placeholder="z. B. 140"
          value={data.living_area_m2 ?? ''}
          onChange={(e) => onChange({ living_area_m2: Number(e.target.value) })}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
        />
      </div>

      {/* Stockwerke */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Wie viele Stockwerke hat das Gebäude?
        </label>
        <div className="flex gap-3">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChange({ floors: n })}
              className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                data.floors === n
                  ? 'border-green-700 bg-green-50 text-green-800'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              {n}{n === 4 ? '+' : ''}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
