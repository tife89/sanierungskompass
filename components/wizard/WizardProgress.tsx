'use client'

const STEPS = [
  { label: 'Gebäude' },
  { label: 'Heizung' },
  { label: 'Hülle' },
  { label: 'Historie' },
  { label: 'Kontakt' },
]

export default function WizardProgress({ current }: { current: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {STEPS.map((step, i) => (
          <div key={i} className="flex flex-col items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                i < current
                  ? 'bg-green-700 border-green-700 text-white'
                  : i === current
                  ? 'bg-white border-green-700 text-green-700'
                  : 'bg-white border-gray-300 text-gray-400'
              }`}
            >
              {i < current ? '✓' : i + 1}
            </div>
            <span
              className={`text-xs mt-1 hidden sm:block ${
                i === current ? 'text-green-700 font-semibold' : 'text-gray-400'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
      {/* Verbindungslinie */}
      <div className="relative h-1 bg-gray-200 rounded mx-4 -mt-6 -z-10">
        <div
          className="h-1 bg-green-700 rounded transition-all duration-500"
          style={{ width: `${(current / (STEPS.length - 1)) * 100}%` }}
        />
      </div>
      <p className="text-sm text-gray-500 text-center mt-6">
        Schritt {current + 1} von {STEPS.length}
      </p>
    </div>
  )
}
