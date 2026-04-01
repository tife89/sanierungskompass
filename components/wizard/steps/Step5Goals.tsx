'use client'

import { WizardData } from '@/lib/supabase/types'

interface Props {
  data: WizardData
  onChange: (updates: Partial<WizardData>) => void
}

const GOALS = [
  { value: 'cost_reduction', label: '💰 Energiekosten dauerhaft senken' },
  { value: 'subsidies',      label: '🏛️ Fördergelder (BAFA/KfW) beantragen' },
  { value: 'comfort',        label: '😌 Wohnkomfort verbessern (Wärme, Lärm)' },
  { value: 'value',          label: '📈 Immobilienwert steigern' },
  { value: 'climate',        label: '🌱 CO₂-Fußabdruck reduzieren' },
]

export default function Step5Goals({ data, onChange }: Props) {
  const goals = data.goals ?? []

  const toggleGoal = (value: string) => {
    const updated = goals.includes(value as WizardData['goals'][0])
      ? goals.filter((g) => g !== value)
      : [...goals, value as WizardData['goals'][0]]
    onChange({ goals: updated })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Ihre Ziele & Kontakt</h2>
        <p className="text-gray-500">Fast geschafft! Was möchten Sie erreichen, und wie erreichen wir Sie?</p>
      </div>

      {/* Ziele */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Was sind Ihre Hauptziele? (Mehrfachauswahl)
        </label>
        <div className="space-y-2">
          {GOALS.map((goal) => (
            <button
              key={goal.value}
              type="button"
              onClick={() => toggleGoal(goal.value)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all flex items-center gap-3 ${
                goals.includes(goal.value as WizardData['goals'][0])
                  ? 'border-green-700 bg-green-50 text-green-800'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <span className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                goals.includes(goal.value as WizardData['goals'][0]) ? 'bg-green-700 border-green-700 text-white' : 'border-gray-300'
              }`}>
                {goals.includes(goal.value as WizardData['goals'][0]) && '✓'}
              </span>
              {goal.label}
            </button>
          ))}
        </div>
      </div>

      {/* Kontaktdaten */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-gray-800 mb-4">Ihre Kontaktdaten</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Vollständiger Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Vorname Nachname"
              value={data.contact_name ?? ''}
              onChange={(e) => onChange({ contact_name: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              E-Mail-Adresse <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="ihre@email.de"
              value={data.contact_email ?? ''}
              onChange={(e) => onChange({ contact_email: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Straße & Hausnummer</label>
              <input
                type="text"
                placeholder="Musterstr. 12"
                value={data.address_street ?? ''}
                onChange={(e) => onChange({ address_street: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">PLZ</label>
              <input
                type="text"
                placeholder="30159"
                maxLength={5}
                value={data.address_plz ?? ''}
                onChange={(e) => onChange({ address_plz: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Stadt</label>
            <input
              type="text"
              placeholder="Hannover"
              value={data.address_city ?? ''}
              onChange={(e) => onChange({ address_city: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* DSGVO-Einwilligung */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-gray-300 text-green-700 focus:ring-green-600"
            checked={!!data.marketing_consent}
            onChange={(e) => onChange({ marketing_consent: e.target.checked })}
          />
          <span className="text-sm text-gray-600">
            Ich bin einverstanden, dass die <strong>enercity AG</strong> mich auf Basis meines
            Sanierungsprofils mit personalisierten Angeboten (PV-Anlage, Wärmepumpe, Stromtarife)
            kontaktiert. Diese Einwilligung ist freiwillig und jederzeit widerrufbar.
          </span>
        </label>
        <p className="text-xs text-gray-400 pl-7">
          Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Daten durch Lynqtech GmbH zur
          Vermittlung eines Energieberaters zu. Details finden Sie in unserer{' '}
          <a href="#" className="underline">Datenschutzerklärung</a>.
        </p>
      </div>
    </div>
  )
}
