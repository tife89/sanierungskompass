'use client'

import { WizardData } from '@/lib/supabase/types'

interface Props {
  data: WizardData
  onChange: (updates: Partial<WizardData>) => void
}

const HEATING_TYPES = [
  { value: 'gas',        label: 'Gasheizung',       icon: '🔥' },
  { value: 'oil',        label: 'Ölheizung',         icon: '🛢️' },
  { value: 'heat_pump',  label: 'Wärmepumpe',        icon: '♻️' },
  { value: 'district',   label: 'Fernwärme',          icon: '🏭' },
  { value: 'wood',       label: 'Holz / Pellets',    icon: '🪵' },
  { value: 'electric',   label: 'Elektroheizung',    icon: '⚡' },
]

export default function Step2Heating({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Ihre Heizung</h2>
        <p className="text-gray-500">Die Heizung ist oft das größte Einsparpotenzial.</p>
      </div>

      {/* Heizungstyp */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Welche Heizung haben Sie? <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {HEATING_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => onChange({ heating_type: type.value as WizardData['heating_type'] })}
              className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                data.heating_type === type.value
                  ? 'border-green-700 bg-green-50 text-green-800'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <span className="text-xl">{type.icon}</span>
              <span className="text-sm font-medium">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Baujahr Heizung */}
      <div>
        <label htmlFor="heating_year" className="block text-sm font-semibold text-gray-700 mb-2">
          Baujahr der Heizung (ca.)
        </label>
        <input
          id="heating_year"
          type="number"
          min={1960}
          max={2026}
          placeholder="z. B. 2005"
          value={data.heating_year ?? ''}
          onChange={(e) => onChange({ heating_year: Number(e.target.value) })}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
        />
        <p className="text-xs text-gray-400 mt-1">
          Steht oft auf dem Typenschild der Heizung oder in der Bedienungsanleitung.
        </p>
      </div>

      {/* Warmwasser */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Wird das Warmwasser separat von der Heizung erzeugt?
        </label>
        <div className="flex gap-3">
          {[
            { value: true,  label: 'Ja, separat' },
            { value: false, label: 'Nein, über Heizung' },
          ].map((opt) => (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => onChange({ hot_water_separate: opt.value })}
              className={`flex-1 py-3 rounded-xl border-2 font-medium text-sm transition-all ${
                data.hot_water_separate === opt.value
                  ? 'border-green-700 bg-green-50 text-green-800'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
