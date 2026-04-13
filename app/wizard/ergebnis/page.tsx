'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FundingRecommendation, RecommendedMeasure } from '@/lib/foerderung/recommendation-engine'
import { WizardData } from '@/lib/supabase/types'

export default function ErgebnisPage() {
  const router = useRouter()
  const [recommendation, setRecommendation] = useState<FundingRecommendation | null>(null)
  const [loading, setLoading] = useState(true)
  const [wizardData, setWizardData] = useState<WizardData | null>(null)
  const [selectedMeasures, setSelectedMeasures] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Wizard-Daten aus sessionStorage laden
    const stored = sessionStorage.getItem('sanierungskompass_wizard_data')
    if (!stored) {
      router.push('/wizard')
      return
    }

    const data: WizardData = JSON.parse(stored)
    setWizardData(data)

    // Förderempfehlungen berechnen
    fetch('/api/foerderung', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: stored,
    })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setRecommendation(result.recommendations)
          // Standardmäßig alle hoch-prioren Maßnahmen auswählen
          const highPriority = result.recommendations.measures
            .filter((m: RecommendedMeasure) => m.priority === 'hoch')
            .map((m: RecommendedMeasure) => m.id)
          setSelectedMeasures(new Set(highPriority))
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [router])

  const toggleMeasure = (id: string) => {
    setSelectedMeasures(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectedTotal = recommendation?.measures
    .filter(m => selectedMeasures.has(m.id))
    .reduce((sum, m) => ({
      min: sum.min + m.bpiEstimate.estimatedMinFunding,
      max: sum.max + m.bpiEstimate.estimatedMaxFunding,
    }), { min: 0, max: 0 })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Fördermöglichkeiten werden analysiert...</p>
          <p className="text-sm text-gray-400 mt-2">BAFA- und KfW-Programme werden geprüft</p>
        </div>
      </div>
    )
  }

  if (!recommendation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Keine Empfehlungen verfügbar.</p>
          <button
            onClick={() => router.push('/wizard')}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Zurück zum Wizard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-green-100 text-green-800 rounded-full px-4 py-2 text-sm font-medium mb-4">
            Analyse abgeschlossen
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Ihre Förderempfehlungen
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {recommendation.summary}
          </p>
        </div>

        {/* Gesamtübersicht Karte */}
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Empfohlene Maßnahmen</p>
              <p className="text-3xl font-bold text-gray-900">{recommendation.measures.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Geschätzte Förderung (ausgewählt)</p>
              <p className="text-3xl font-bold text-green-600">
                {selectedTotal ? `${selectedTotal.min.toLocaleString('de-DE')} – ${selectedTotal.max.toLocaleString('de-DE')} €` : '—'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Förderprogramme</p>
              <p className="text-3xl font-bold text-gray-900">
                {recommendation.climaBonusEligible ? 'BAFA + KfW + Klima' : 'BAFA + KfW'}
              </p>
            </div>
          </div>

          {recommendation.climaBonusEligible && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
              <strong>Klimageschwindigkeitsbonus:</strong> Da Sie aktuell mit {wizardData?.heating_type === 'gas' ? 'Gas' : 'Öl'} heizen,
              erhalten Sie beim Umstieg auf eine Wärmepumpe bis zu <strong>20% extra Förderung</strong>.
            </div>
          )}

          {recommendation.isfpRecommended && (
            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              <strong>Tipp – iSFP erstellen lassen:</strong> Mit einem individuellen Sanierungsfahrplan
              erhalten Sie <strong>+5% auf alle Maßnahmen</strong> und die förderfähigen Kosten verdoppeln sich
              bei Heizungsmaßnahmen auf 60.000 €. Ein Energieberater aus unserem Netzwerk kann das für Sie übernehmen.
            </div>
          )}
        </div>

        {/* Maßnahmen-Liste */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">Empfohlene Maßnahmen</h2>
        <p className="text-sm text-gray-500 mb-4">
          Wählen Sie die Maßnahmen aus, für die Sie einen Förderantrag stellen möchten:
        </p>

        <div className="space-y-4 mb-8">
          {recommendation.measures.map((measure) => (
            <MeasureCard
              key={measure.id}
              measure={measure}
              selected={selectedMeasures.has(measure.id)}
              onToggle={() => toggleMeasure(measure.id)}
            />
          ))}
        </div>

        {/* CTA Bereich */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Nächste Schritte</h2>
          <p className="text-gray-600 mb-6">
            Starten Sie den Förderantrag-Assistenten für Ihre ausgewählten Maßnahmen.
            Wir führen Sie Schritt für Schritt durch den Prozess.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                // Ausgewählte Maßnahmen speichern und zum Assistenten weiterleiten
                sessionStorage.setItem(
                  'sanierungskompass_selected_measures',
                  JSON.stringify(Array.from(selectedMeasures))
                )
                router.push('/foerderantrag')
              }}
              disabled={selectedMeasures.size === 0}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Förderantrag starten ({selectedMeasures.size} Maßnahme{selectedMeasures.size !== 1 ? 'n' : ''})
            </button>

            <button
              onClick={() => {
                // Energieberater-Matching anfragen
                router.push('/wizard/bestaetigung')
              }}
              className="flex-1 border-2 border-green-600 text-green-700 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors"
            >
              Erst Energieberater kontaktieren
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Maßnahmen-Karte Komponente ---

function MeasureCard({
  measure,
  selected,
  onToggle,
}: {
  measure: RecommendedMeasure
  selected: boolean
  onToggle: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  const priorityColors = {
    hoch: 'bg-red-100 text-red-700',
    mittel: 'bg-yellow-100 text-yellow-700',
    niedrig: 'bg-blue-100 text-blue-700',
  }

  const priorityLabels = {
    hoch: 'Hohe Priorität',
    mittel: 'Mittlere Priorität',
    niedrig: 'Empfehlung',
  }

  return (
    <div
      className={`bg-white rounded-xl border-2 transition-all ${
        selected ? 'border-green-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <button
            onClick={onToggle}
            className={`mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
              selected
                ? 'bg-green-600 border-green-600 text-white'
                : 'border-gray-300 hover:border-green-400'
            }`}
          >
            {selected && (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-semibold text-gray-900">{measure.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[measure.priority]}`}>
                {priorityLabels[measure.priority]}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-3">{measure.reason}</p>

            {/* Förderübersicht */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">BAFA-Förderrate:</span>
                <div className="font-semibold text-gray-900">
                  {Math.round(measure.bpiEstimate.bafaBaseRate * 100)}%
                  {measure.bpiEstimate.bafaMaxRate > measure.bpiEstimate.bafaBaseRate && (
                    <span className="text-green-600">
                      {' '}→ bis {Math.round(measure.bpiEstimate.bafaMaxRate * 100)}%
                    </span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Geschätzte Förderung:</span>
                <div className="font-semibold text-green-600">
                  {measure.bpiEstimate.estimatedMinFunding.toLocaleString('de-DE')} – {measure.bpiEstimate.estimatedMaxFunding.toLocaleString('de-DE')} €
                </div>
              </div>
            </div>

            {/* Erweiterte Details */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-3 text-sm text-green-600 hover:text-green-700 font-medium"
            >
              {expanded ? 'Weniger anzeigen ↑' : 'Details anzeigen ↓'}
            </button>

            {expanded && (
              <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                <div className="text-sm">
                  <p className="text-gray-500 mb-1">Geschätzte Kosten:</p>
                  <p className="text-gray-700">
                    {measure.estimatedCost.min.toLocaleString('de-DE')} – {measure.estimatedCost.max.toLocaleString('de-DE')} €
                  </p>
                  <p className="text-xs text-gray-400">{measure.estimatedCost.note}</p>
                </div>

                <div className="text-sm">
                  <p className="text-gray-500 mb-1">BAFA-Förderung im Detail:</p>
                  <ul className="text-gray-700 space-y-1">
                    <li>Basisförderung: {Math.round(measure.bpiEstimate.bafaBaseRate * 100)}%</li>
                    <li>Mit iSFP: {Math.round(measure.bpiEstimate.bafaWithISFP * 100)}% (+5%)</li>
                    {measure.bpiEstimate.bafaMaxRate > measure.bpiEstimate.bafaWithISFP && (
                      <li className="text-green-700 font-medium">
                        Mit Klimabonus: {Math.round(measure.bpiEstimate.bafaMaxRate * 100)}%
                      </li>
                    )}
                  </ul>
                </div>

                {measure.bpiEstimate.kfwPrograms.length > 0 && (
                  <div className="text-sm">
                    <p className="text-gray-500 mb-1">Passende KfW-Programme:</p>
                    <ul className="space-y-1">
                      {measure.bpiEstimate.kfwPrograms.map(kfw => (
                        <li key={kfw.programId} className="text-gray-700">
                          <span className="font-medium">{kfw.programName}</span>
                          <br />
                          <span className="text-xs text-gray-500">{kfw.detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
