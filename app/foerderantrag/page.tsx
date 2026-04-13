'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { WizardData } from '@/lib/supabase/types'
import { generateRecommendations, RecommendedMeasure } from '@/lib/foerderung/recommendation-engine'

type AssistantStep = 'uebersicht' | 'dokumente' | 'antrag' | 'pruefung' | 'abgeschlossen'

const STEPS: { id: AssistantStep; label: string }[] = [
  { id: 'uebersicht', label: 'Übersicht' },
  { id: 'dokumente', label: 'Dokumente' },
  { id: 'antrag', label: 'Antrag' },
  { id: 'pruefung', label: 'Prüfung' },
  { id: 'abgeschlossen', label: 'Fertig' },
]

export default function FoerderantragPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<AssistantStep>('uebersicht')
  const [wizardData, setWizardData] = useState<WizardData | null>(null)
  const [selectedMeasures, setSelectedMeasures] = useState<RecommendedMeasure[]>([])
  const [activeMeasure, setActiveMeasure] = useState<string | null>(null)

  useEffect(() => {
    const storedData = sessionStorage.getItem('sanierungskompass_wizard_data')
    const storedMeasures = sessionStorage.getItem('sanierungskompass_selected_measures')

    if (!storedData) {
      router.push('/wizard')
      return
    }

    const data: WizardData = JSON.parse(storedData)
    setWizardData(data)

    const recommendations = generateRecommendations(data)
    const measureIds: string[] = storedMeasures ? JSON.parse(storedMeasures) : []

    const filtered = recommendations.measures.filter(m => measureIds.includes(m.id))
    setSelectedMeasures(filtered)
    if (filtered.length > 0) {
      setActiveMeasure(filtered[0].id)
    }
  }, [router])

  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep)
  const active = selectedMeasures.find(m => m.id === activeMeasure)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {STEPS.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center gap-2 ${i <= currentStepIndex ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    i < currentStepIndex
                      ? 'bg-green-600 text-white'
                      : i === currentStepIndex
                        ? 'bg-green-100 text-green-700 border-2 border-green-600'
                        : 'bg-gray-100 text-gray-400'
                  }`}>
                    {i < currentStepIndex ? '✓' : i + 1}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">{step.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-8 sm:w-16 h-0.5 mx-2 ${
                    i < currentStepIndex ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Schritt 1: Übersicht */}
        {currentStep === 'uebersicht' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Förderantrag-Assistent</h1>
            <p className="text-gray-600 mb-6">
              Wir führen Sie Schritt für Schritt durch die Antragstellung für Ihre ausgewählten Maßnahmen.
            </p>

            {/* Maßnahmen-Tabs */}
            {selectedMeasures.length > 1 && (
              <div className="flex gap-2 mb-6 overflow-x-auto">
                {selectedMeasures.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setActiveMeasure(m.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      activeMeasure === m.id
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300'
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            )}

            {active && (
              <div className="space-y-6">
                {/* Förderprogramm-Auswahl */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Verfügbare Förderprogramme für: {active.name}
                  </h2>

                  {/* BAFA */}
                  <div className="border border-green-200 rounded-lg p-4 mb-4 bg-green-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-green-800">BAFA – BEG Einzelmaßnahmen</h3>
                        <p className="text-sm text-green-700 mt-1">Nicht rückzahlbarer Zuschuss</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-700">
                          {Math.round(active.bpiEstimate.bafaBaseRate * 100)}%
                          {active.bpiEstimate.bafaMaxRate > active.bpiEstimate.bafaBaseRate && (
                            <span className="text-sm font-normal"> bis {Math.round(active.bpiEstimate.bafaMaxRate * 100)}%</span>
                          )}
                        </p>
                        <p className="text-sm text-green-600">Förderrate</p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-white rounded p-2">
                        <span className="text-gray-500">Geschätzte Förderung:</span>
                        <p className="font-semibold">
                          {active.bpiEstimate.estimatedMinFunding.toLocaleString('de-DE')} – {active.bpiEstimate.estimatedMaxFunding.toLocaleString('de-DE')} €
                        </p>
                      </div>
                      <div className="bg-white rounded p-2">
                        <span className="text-gray-500">Max. förderfähige Kosten:</span>
                        <p className="font-semibold">30.000 € (60.000 € mit iSFP)</p>
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-green-700">
                      <strong>Antrag bei:</strong> BAFA (Bundesamt für Wirtschaft und Ausfuhrkontrolle)
                      <br />
                      <strong>Verfahren:</strong> Online-Antrag vor Maßnahmenbeginn
                    </div>
                  </div>

                  {/* KfW Programme */}
                  {active.bpiEstimate.kfwPrograms.map(kfw => (
                    <div key={kfw.programId} className="border border-blue-200 rounded-lg p-4 mb-4 bg-blue-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-blue-800">{kfw.programName}</h3>
                          <p className="text-sm text-blue-700 mt-1">{kfw.type}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          kfw.type === 'Zuschuss'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {kfw.detail}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-blue-700">
                        <strong>Antrag bei:</strong> KfW (über Hausbank oder Online-Portal)
                      </div>
                    </div>
                  ))}
                </div>

                {/* Wichtige Hinweise */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                  <h3 className="font-semibold text-amber-800 mb-3">Wichtige Hinweise</h3>
                  <ul className="space-y-2 text-sm text-amber-700">
                    <li className="flex gap-2">
                      <span className="flex-shrink-0">⚠️</span>
                      <span>Der Förderantrag muss <strong>vor Beginn der Maßnahme</strong> gestellt werden.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="flex-shrink-0">📋</span>
                      <span>Sie benötigen ein Angebot eines Fachunternehmens für die Antragstellung.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="flex-shrink-0">🏠</span>
                      <span>Das Gebäude muss mindestens 5 Jahre alt sein.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="flex-shrink-0">💡</span>
                      <span>BAFA-Zuschuss und KfW-Kredit können <strong>kombiniert</strong> werden.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => router.push('/wizard/ergebnis')}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                ← Zurück zu den Empfehlungen
              </button>
              <button
                onClick={() => setCurrentStep('dokumente')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700"
              >
                Weiter: Dokumente vorbereiten →
              </button>
            </div>
          </div>
        )}

        {/* Schritt 2: Dokumente */}
        {currentStep === 'dokumente' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Dokumente vorbereiten</h1>
            <p className="text-gray-600 mb-6">
              Folgende Unterlagen benötigen Sie für die Antragstellung. Sammeln Sie diese, bevor Sie fortfahren.
            </p>

            <div className="space-y-4">
              <DocumentChecklist
                title="Pflichtdokumente"
                items={[
                  {
                    label: 'Personalausweis / Ausweiskopie',
                    hint: 'Für die Identifikation beim BAFA/KfW-Portal',
                  },
                  {
                    label: 'Grundbuchauszug oder Eigentümernachweis',
                    hint: 'Nachweis, dass Sie Eigentümer des Gebäudes sind',
                  },
                  {
                    label: 'Angebot eines Fachunternehmens',
                    hint: 'Detailliertes Angebot für die geplanten Maßnahmen mit Kostenaufstellung',
                  },
                  {
                    label: 'Fotos des aktuellen Zustands',
                    hint: 'Dokumentation des Ist-Zustands (Heizung, Fenster, Fassade je nach Maßnahme)',
                  },
                ]}
              />

              <DocumentChecklist
                title="Empfohlene Dokumente"
                items={[
                  {
                    label: 'Energieausweis (falls vorhanden)',
                    hint: 'Zeigt den energetischen Ist-Zustand des Gebäudes',
                  },
                  {
                    label: 'Individueller Sanierungsfahrplan (iSFP)',
                    hint: 'Bringt +5% mehr Förderung – kann über unsere Energieberater erstellt werden',
                  },
                  {
                    label: 'Grundrisse / Baupläne',
                    hint: 'Hilfreich für genaue Flächenberechnung',
                  },
                ]}
              />
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentStep('uebersicht')}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                ← Zurück
              </button>
              <button
                onClick={() => setCurrentStep('antrag')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700"
              >
                Weiter: Antrag ausfüllen →
              </button>
            </div>
          </div>
        )}

        {/* Schritt 3: Antrag */}
        {currentStep === 'antrag' && wizardData && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Antragsdaten prüfen</h1>
            <p className="text-gray-600 mb-6">
              Wir haben die Daten aus Ihrem Gebäude-Check vorausgefüllt. Bitte prüfen und ergänzen Sie die Angaben.
            </p>

            <div className="space-y-6">
              {/* Vorausgefüllte Gebäudedaten */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Gebäudedaten (vorausgefüllt)</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <DataRow label="Gebäudetyp" value={
                    wizardData.building_type === 'EFH' ? 'Einfamilienhaus' :
                    wizardData.building_type === 'DHH' ? 'Doppelhaushälfte' : 'Reihenhaus'
                  } />
                  <DataRow label="Baujahr" value={String(wizardData.year_built || '—')} />
                  <DataRow label="Wohnfläche" value={`${wizardData.living_area_m2 || '—'} m²`} />
                  <DataRow label="Stockwerke" value={String(wizardData.floors || '—')} />
                  <DataRow label="Heizungstyp" value={
                    ({ gas: 'Gasheizung', oil: 'Ölheizung', heat_pump: 'Wärmepumpe', district: 'Fernwärme', wood: 'Holzheizung', electric: 'Elektroheizung', other: 'Sonstige' } as Record<string, string>)[wizardData.heating_type || ''] || '—'
                  } />
                  <DataRow label="Heizung Baujahr" value={String(wizardData.heating_year || '—')} />
                </div>
              </div>

              {/* Kontaktdaten */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Antragsteller</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <DataRow label="Name" value={wizardData.contact_name || '—'} />
                  <DataRow label="E-Mail" value={wizardData.contact_email || '—'} />
                  <DataRow label="Adresse" value={
                    [wizardData.address_street, `${wizardData.address_plz || ''} ${wizardData.address_city || ''}`]
                      .filter(Boolean).join(', ') || '—'
                  } />
                  <DataRow label="Telefon" value={wizardData.contact_phone || '—'} />
                </div>
              </div>

              {/* Zusätzliche Felder für Förderantrag */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Ergänzende Angaben für den Antrag</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      IBAN (für Auszahlung des Zuschusses)
                    </label>
                    <input
                      type="text"
                      placeholder="DE00 0000 0000 0000 0000 00"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Geplanter Maßnahmenbeginn
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Geschätzte Gesamtkosten der Maßnahme (€)
                    </label>
                    <input
                      type="number"
                      placeholder="z.B. 25000"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name des Fachunternehmens
                    </label>
                    <input
                      type="text"
                      placeholder="Firma des beauftragten Handwerkers"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentStep('dokumente')}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                ← Zurück
              </button>
              <button
                onClick={() => setCurrentStep('pruefung')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700"
              >
                Weiter: Antrag prüfen →
              </button>
            </div>
          </div>
        )}

        {/* Schritt 4: Prüfung */}
        {currentStep === 'pruefung' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Antrag prüfen</h1>
            <p className="text-gray-600 mb-6">
              Bitte prüfen Sie alle Angaben sorgfältig. Im nächsten Schritt werden Sie zum
              offiziellen BAFA/KfW-Portal weitergeleitet.
            </p>

            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Zusammenfassung</h2>

              {selectedMeasures.map(m => (
                <div key={m.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{m.name}</p>
                    <p className="text-sm text-gray-500">{m.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {m.bpiEstimate.estimatedMinFunding.toLocaleString('de-DE')} – {m.bpiEstimate.estimatedMaxFunding.toLocaleString('de-DE')} €
                    </p>
                    <p className="text-xs text-gray-500">geschätzte Förderung</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-yellow-800 mb-2">Hinweis zur Weiterleitung</h3>
              <p className="text-sm text-yellow-700">
                Im nächsten Schritt leiten wir Sie zum offiziellen Antragsportal weiter.
                Ihre vorausgefüllten Daten werden Ihnen als PDF-Zusammenfassung bereitgestellt,
                die Sie beim Ausfüllen des offiziellen Antrags verwenden können.
              </p>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentStep('antrag')}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                ← Zurück bearbeiten
              </button>
              <button
                onClick={() => setCurrentStep('abgeschlossen')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700"
              >
                Zum BAFA/KfW-Portal →
              </button>
            </div>
          </div>
        )}

        {/* Schritt 5: Abgeschlossen */}
        {currentStep === 'abgeschlossen' && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Ihre Unterlagen sind bereit!
            </h1>
            <p className="text-gray-600 max-w-lg mx-auto mb-8">
              Wir haben eine PDF-Zusammenfassung mit allen vorausgefüllten Daten erstellt.
              Nutzen Sie diese beim Ausfüllen des offiziellen Antrags auf dem BAFA- oder KfW-Portal.
            </p>

            <div className="space-y-3 max-w-md mx-auto">
              <a
                href="https://fms.bafa.de/BafaFrame/beg"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                BAFA-Antragsportal öffnen ↗
              </a>
              <a
                href="https://www.kfw.de/inlandsfoerderung/Privatpersonen/Bestehende-Immobilie/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full border-2 border-blue-600 text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                KfW-Antragsportal öffnen ↗
              </a>
            </div>

            <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6 max-w-lg mx-auto text-left">
              <h3 className="font-semibold text-green-800 mb-2">Brauchen Sie Unterstützung?</h3>
              <p className="text-sm text-green-700 mb-3">
                Ein zertifizierter Energieberater aus unserem Netzwerk kann Sie persönlich
                bei der Antragstellung unterstützen und einen iSFP erstellen.
              </p>
              <button
                onClick={() => router.push('/wizard/bestaetigung')}
                className="text-sm font-medium text-green-700 hover:text-green-800"
              >
                Energieberater kontaktieren →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// --- Hilfskomponenten ---

function DocumentChecklist({ title, items }: { title: string; items: { label: string; hint: string }[] }) {
  const [checked, setChecked] = useState<Set<number>>(new Set())

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <label key={i} className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={checked.has(i)}
              onChange={() => {
                setChecked(prev => {
                  const next = new Set(prev)
                  if (next.has(i)) next.delete(i)
                  else next.add(i)
                  return next
                })
              }}
              className="mt-1 w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <div>
              <p className={`font-medium ${checked.has(i) ? 'text-green-700 line-through' : 'text-gray-900'}`}>
                {item.label}
              </p>
              <p className="text-sm text-gray-500">{item.hint}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-gray-500">{label}:</span>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  )
}
