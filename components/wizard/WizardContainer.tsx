'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import WizardProgress from './WizardProgress'
import Step1Building from './steps/Step1Building'
import Step2Heating from './steps/Step2Heating'
import Step3Envelope from './steps/Step3Envelope'
import Step4History from './steps/Step4History'
import Step5Goals from './steps/Step5Goals'
import { WizardData } from '@/lib/supabase/types'

const TOTAL_STEPS = 5

function validateStep(step: number, data: WizardData): string | null {
  if (step === 0 && !data.building_type) return 'Bitte wählen Sie einen Gebäudetyp aus.'
  if (step === 0 && !data.year_built) return 'Bitte geben Sie das Baujahr ein.'
  if (step === 0 && !data.living_area_m2) return 'Bitte geben Sie die Wohnfläche ein.'
  if (step === 1 && !data.heating_type) return 'Bitte wählen Sie Ihren Heizungstyp aus.'
  if (step === 4 && !data.contact_name) return 'Bitte geben Sie Ihren Namen ein.'
  if (step === 4 && !data.contact_email) return 'Bitte geben Sie Ihre E-Mail-Adresse ein.'
  if (step === 4 && data.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact_email)) {
    return 'Bitte geben Sie eine gültige E-Mail-Adresse ein.'
  }
  return null
}

export default function WizardContainer() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<WizardData>({})
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const update = (updates: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...updates }))
    setError(null)
  }

  const next = () => {
    const validationError = validateStep(step, data)
    if (validationError) {
      setError(validationError)
      return
    }
    setError(null)
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const back = () => {
    setError(null)
    setStep((s) => Math.max(s - 1, 0))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const submit = async () => {
    const validationError = validateStep(step, data)
    if (validationError) {
      setError(validationError)
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Fehler beim Speichern.')
      // Wizard-Daten für Förderempfehlungen in sessionStorage speichern
      sessionStorage.setItem('sanierungskompass_wizard_data', JSON.stringify(data))
      // Zur Ergebnis-Seite mit Förderempfehlungen weiterleiten
      router.push('/wizard/ergebnis')
    } catch (err) {
      setError('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.')
    } finally {
      setSubmitting(false)
    }
  }

  const steps = [
    <Step1Building key={0} data={data} onChange={update} />,
    <Step2Heating  key={1} data={data} onChange={update} />,
    <Step3Envelope key={2} data={data} onChange={update} />,
    <Step4History  key={3} data={data} onChange={update} />,
    <Step5Goals    key={4} data={data} onChange={update} />,
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <WizardProgress current={step} />

      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-6">
        {steps[step]}
      </div>

      {/* Fehlermeldung */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 mb-4">
          ⚠️ {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={back}
            className="flex-1 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            ← Zurück
          </button>
        )}
        {step < TOTAL_STEPS - 1 ? (
          <button
            type="button"
            onClick={next}
            className="flex-1 py-3 rounded-xl bg-green-700 hover:bg-green-800 text-white font-semibold transition-colors"
          >
            Weiter →
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="flex-1 py-3 rounded-xl bg-green-700 hover:bg-green-800 disabled:bg-gray-300 text-white font-semibold transition-colors"
          >
            {submitting ? '⏳ Wird gesendet...' : '✅ Anfrage absenden'}
          </button>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center mt-4">
        🔒 Ihre Daten werden sicher und DSGVO-konform in Deutschland gespeichert.
      </p>
    </div>
  )
}
