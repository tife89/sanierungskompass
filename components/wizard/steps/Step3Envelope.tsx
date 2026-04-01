'use client'

import { WizardData } from '@/lib/supabase/types'

interface Props {
  data: WizardData
  onChange: (updates: Partial<WizardData>) => void
}

export default function Step3Envelope({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Gebäudehülle</h2>
        <p className="text-gray-500">Dach, Wände und Fenster – hier steckt oft viel Potenzial.</p>
      </div>

      {/* Dach */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
        <div className="font-semibold text-gray-800 flex items-center gap-2">🏠 Dach</div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">Ist das Dach / die Dachgeschossdecke gedämmt?</label>
          <div className="flex gap-3">
            {[
              { value: true,  label: '✅ Ja' },
              { value: false, label: '❌ Nein / Nicht sicher' },
            ].map((opt) => (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => onChange({ roof_insulated: opt.value })}
                className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                  data.roof_insulated === opt.value
                    ? 'border-green-700 bg-green-50 text-green-800'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        {data.roof_insulated && (
          <div>
            <label className="block text-sm text-gray-600 mb-1">Jahr der Dachdämmung (ca.)</label>
            <input
              type="number"
              min={1970}
              max={2026}
              placeholder="z. B. 2010"
              value={data.roof_insulation_year ?? ''}
              onChange={(e) => onChange({ roof_insulation_year: Number(e.target.value) })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
        )}
      </div>

      {/* Außenwände */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
        <div className="font-semibold text-gray-800 flex items-center gap-2">🧱 Außenwände</div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">Sind die Außenwände gedämmt?</label>
          <div className="flex gap-3">
            {[
              { value: true,  label: '✅ Ja' },
              { value: false, label: '❌ Nein / Nicht sicher' },
            ].map((opt) => (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => onChange({ wall_insulated: opt.value })}
                className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                  data.wall_insulated === opt.value
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

      {/* Fenster */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
        <div className="font-semibold text-gray-800 flex items-center gap-2">🪟 Fenster</div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">Welche Verglasung haben Ihre Fenster?</label>
          <div className="space-y-2">
            {[
              { value: 'single', label: 'Einfachverglasung (sehr alt, Zugluft spürbar)' },
              { value: 'double', label: 'Zweifachverglasung (Standard)' },
              { value: 'triple', label: 'Dreifachverglasung (sehr gut isolierend)' },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ window_type: opt.value as WizardData['window_type'] })}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  data.window_type === opt.value
                    ? 'border-green-700 bg-green-50 text-green-800'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Baujahr der Fenster (ca.)</label>
          <input
            type="number"
            min={1950}
            max={2026}
            placeholder="z. B. 1995"
            value={data.window_year ?? ''}
            onChange={(e) => onChange({ window_year: Number(e.target.value) })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>
      </div>
    </div>
  )
}
