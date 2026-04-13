// Empfehlungslogik: Wizard-Daten → passende Förderprogramme
// Analysiert das Gebäude und empfiehlt konkrete Maßnahmen mit Förderschätzungen

import { WizardData } from '../supabase/types'
import { BAFA_MEASURES, BafaMeasure } from './bafa-data'
import { KFW_PROGRAMS, KfwProgram } from './kfw-data'

// --- Typen ---

export interface RecommendedMeasure {
  id: string
  name: string
  category: string
  priority: 'hoch' | 'mittel' | 'niedrig'
  reason: string
  bpiEstimate: FundingEstimate  // BAFA/KfW Förderung
  estimatedCost: CostRange
}

export interface FundingEstimate {
  bafaBaseRate: number
  bafaWithISFP: number
  bafaMaxRate: number          // inkl. aller Boni
  kfwPrograms: KfwMatch[]
  estimatedMinFunding: number  // in Euro
  estimatedMaxFunding: number  // in Euro
}

export interface KfwMatch {
  programId: string
  programName: string
  type: 'Kredit' | 'Zuschuss'
  detail: string
}

export interface CostRange {
  min: number
  max: number
  note: string
}

export interface FundingRecommendation {
  measures: RecommendedMeasure[]
  totalEstimatedFunding: { min: number; max: number }
  hasFossilHeating: boolean
  climaBonusEligible: boolean
  isfpRecommended: boolean
  summary: string
}

// --- Kostenschätzungen nach Gebäudetyp (grobe Richtwerte) ---

const COST_ESTIMATES: Record<string, (area: number) => CostRange> = {
  heat_pump: (area) => ({
    min: 15000,
    max: Math.max(25000, area * 150),
    note: 'Luft-Wasser-Wärmepumpe inkl. Installation',
  }),
  biomass: () => ({
    min: 12000,
    max: 25000,
    note: 'Pelletheizung inkl. Lager und Installation',
  }),
  wall_insulation: (area) => ({
    min: Math.round(area * 0.8 * 80),
    max: Math.round(area * 0.8 * 180),
    note: 'WDVS Außenwand (geschätzt nach Wohnfläche)',
  }),
  roof_insulation: (area) => ({
    min: Math.round(area * 0.6 * 60),
    max: Math.round(area * 0.6 * 150),
    note: 'Dachdämmung (geschätzt nach Wohnfläche)',
  }),
  windows: (area) => ({
    min: Math.round(area * 0.15 * 500),
    max: Math.round(area * 0.15 * 1000),
    note: '3-fach Verglasung (geschätzte Fensteranzahl)',
  }),
  ventilation: () => ({
    min: 5000,
    max: 12000,
    note: 'Zentrale Lüftung mit Wärmerückgewinnung',
  }),
  heating_optimization: () => ({
    min: 1500,
    max: 5000,
    note: 'Hydraulischer Abgleich, Pumpentausch',
  }),
  solar: () => ({
    min: 4000,
    max: 12000,
    note: 'Solarthermie-Anlage',
  }),
}

// --- Hauptfunktion ---

export function generateRecommendations(data: WizardData): FundingRecommendation {
  const measures: RecommendedMeasure[] = []
  const area = data.living_area_m2 || 120

  // Fossil-Heizung? → Klimabonus möglich
  const hasFossil = data.heating_type === 'gas' || data.heating_type === 'oil'
  const hasOldHeating = data.heating_year ? data.heating_year < 2005 : hasFossil

  // 1. Heizungstausch prüfen
  if (hasFossil || data.heating_type === 'electric') {
    const heatPump = BAFA_MEASURES.find(m => m.id === 'heat_pump')!
    const costRange = COST_ESTIMATES.heat_pump(area)

    measures.push({
      id: 'heat_pump',
      name: heatPump.name,
      category: heatPump.category,
      priority: 'hoch',
      reason: hasFossil
        ? `Ihre ${data.heating_type === 'gas' ? 'Gas' : data.heating_type === 'oil' ? 'Öl' : 'Elektro'}-Heizung${hasOldHeating ? ` (Baujahr ${data.heating_year || 'unbekannt'})` : ''} kann durch eine Wärmepumpe ersetzt werden. Beim Wechsel von fossiler Heizung erhalten Sie den Klimageschwindigkeitsbonus.`
        : 'Eine Wärmepumpe spart langfristig Heizkosten und wird stark gefördert.',
      bpiEstimate: calculateBafaFunding(heatPump, costRange, hasFossil),
      estimatedCost: costRange,
    })
  } else if (hasOldHeating && data.heating_type !== 'heat_pump') {
    // Alte Heizung die nicht fossil ist → Optimierung empfehlen
    const opt = BAFA_MEASURES.find(m => m.id === 'heating_optimization')!
    const costRange = COST_ESTIMATES.heating_optimization(area)
    measures.push({
      id: 'heating_optimization',
      name: opt.name,
      category: opt.category,
      priority: 'mittel',
      reason: 'Eine Optimierung der bestehenden Heizung kann Energiekosten senken.',
      bpiEstimate: calculateBafaFunding(opt, costRange, false),
      estimatedCost: costRange,
    })
  }

  // 2. Wanddämmung
  if (!data.wall_insulated) {
    const measure = BAFA_MEASURES.find(m => m.id === 'wall_insulation')!
    const costRange = COST_ESTIMATES.wall_insulation(area)
    measures.push({
      id: 'wall_insulation',
      name: measure.name,
      category: measure.category,
      priority: 'hoch',
      reason: 'Ihre Außenwände sind nicht gedämmt. Wanddämmung hat das größte Energiesparpotenzial.',
      bpiEstimate: calculateBafaFunding(measure, costRange, false),
      estimatedCost: costRange,
    })
  }

  // 3. Dachdämmung
  if (!data.roof_insulated) {
    const measure = BAFA_MEASURES.find(m => m.id === 'roof_insulation')!
    const costRange = COST_ESTIMATES.roof_insulation(area)
    measures.push({
      id: 'roof_insulation',
      name: measure.name,
      category: measure.category,
      priority: 'hoch',
      reason: 'Ihr Dach ist nicht gedämmt. Über das Dach geht besonders viel Wärme verloren.',
      bpiEstimate: calculateBafaFunding(measure, costRange, false),
      estimatedCost: costRange,
    })
  }

  // 4. Fenster
  if (data.window_type === 'single' || data.window_type === 'double') {
    const measure = BAFA_MEASURES.find(m => m.id === 'windows')!
    const costRange = COST_ESTIMATES.windows(area)
    const isOld = data.window_year ? data.window_year < 2000 : true
    measures.push({
      id: 'windows',
      name: measure.name,
      category: measure.category,
      priority: data.window_type === 'single' ? 'hoch' : 'mittel',
      reason: data.window_type === 'single'
        ? 'Einfachverglasung verliert sehr viel Wärme. Ein Wechsel auf 3-fach-Verglasung spart erheblich Energie.'
        : `Ihre Doppelverglasung${isOld ? ` (${data.window_year || 'älteres Baujahr'})` : ''} kann durch moderne 3-fach-Verglasung ersetzt werden.`,
      bpiEstimate: calculateBafaFunding(measure, costRange, false),
      estimatedCost: costRange,
    })
  }

  // 5. Lüftung (empfehlen wenn Dämmung geplant)
  if (!data.wall_insulated || !data.roof_insulated) {
    const measure = BAFA_MEASURES.find(m => m.id === 'ventilation')!
    const costRange = COST_ESTIMATES.ventilation(area)
    measures.push({
      id: 'ventilation',
      name: measure.name,
      category: measure.category,
      priority: 'niedrig',
      reason: 'Bei umfassender Dämmung empfiehlt sich eine Lüftungsanlage für gesundes Raumklima und Energieeffizienz.',
      bpiEstimate: calculateBafaFunding(measure, costRange, false),
      estimatedCost: costRange,
    })
  }

  // Gesamtförderung berechnen
  const totalMin = measures.reduce((sum, m) => sum + m.bpiEstimate.estimatedMinFunding, 0)
  const totalMax = measures.reduce((sum, m) => sum + m.bpiEstimate.estimatedMaxFunding, 0)

  // iSFP empfehlen wenn >= 2 Maßnahmen
  const isfpRecommended = measures.length >= 2

  // Zusammenfassung generieren
  const highPriority = measures.filter(m => m.priority === 'hoch')
  const summary = generateSummary(measures, totalMin, totalMax, hasFossil, isfpRecommended)

  return {
    measures,
    totalEstimatedFunding: { min: totalMin, max: totalMax },
    hasFossilHeating: hasFossil,
    climaBonusEligible: hasFossil,
    isfpRecommended,
    summary,
  }
}

// --- Hilfsfunktionen ---

function calculateBafaFunding(
  measure: BafaMeasure,
  costRange: CostRange,
  isFossilSwitch: boolean,
): FundingEstimate {
  const bafaBase = measure.baseRate
  const bafaISFP = bafaBase + measure.iSFPBonus
  const bafaMax = bafaBase + measure.iSFPBonus + (isFossilSwitch ? measure.climaBonus : 0)

  // KfW Programme finden
  const kfwMatches = findKfwPrograms(measure.id)

  // Förderbeträge schätzen
  const maxCost = Math.min(costRange.max, measure.maxEligibleCost)
  const maxCostISFP = Math.min(costRange.max, measure.maxEligibleCostWithISFP)

  const minFunding = Math.round(Math.min(costRange.min, measure.maxEligibleCost) * bafaBase)
  const maxFunding = Math.round(maxCostISFP * bafaMax)

  return {
    bafaBaseRate: bafaBase,
    bafaWithISFP: bafaISFP,
    bafaMaxRate: bafaMax,
    kfwPrograms: kfwMatches,
    estimatedMinFunding: minFunding,
    estimatedMaxFunding: maxFunding,
  }
}

function findKfwPrograms(measureId: string): KfwMatch[] {
  const matches: KfwMatch[] = []

  // Mapping: unsere Maßnahmen-IDs → KfW-Suchbegriffe
  const measureKeywords: Record<string, string[]> = {
    heat_pump: ['Wärmepumpe', 'Heizungsanlage', 'Heizungsaustausch'],
    biomass: ['Biomasse', 'Heizungsanlage', 'Heizungsaustausch'],
    wall_insulation: ['Wanddämmung', 'Dach- und Wanddämmung'],
    roof_insulation: ['Dachdämmung', 'Dach- und Wanddämmung'],
    windows: ['Fenstertausch', 'Fenster und Türen'],
    ventilation: ['Lüftungsanlage', 'Lüftung'],
    heating_optimization: ['Heizungsanlage'],
    solar: ['Solarthermie', 'Solaranlage'],
  }

  const keywords = measureKeywords[measureId] || []

  for (const program of KFW_PROGRAMS) {
    if (!program.isActive) continue

    const isMatch = program.eligibleMeasures.some(em =>
      keywords.some(kw => em.toLowerCase().includes(kw.toLowerCase()))
    )

    if (isMatch) {
      let detail = ''
      if (program.type === 'Kredit') {
        detail = `Kredit bis ${(program.maxLoanAmount || 0).toLocaleString('de-DE')} € zu ${program.interestRate}% p.a.`
      } else if (program.subsidyRates) {
        const maxTotal = program.subsidyRates.maxTotal
        detail = `Zuschuss bis ${maxTotal}%`
      }

      matches.push({
        programId: program.id,
        programName: program.name,
        type: program.type,
        detail,
      })
    }
  }

  return matches
}

function generateSummary(
  measures: RecommendedMeasure[],
  totalMin: number,
  totalMax: number,
  hasFossil: boolean,
  isfpRecommended: boolean,
): string {
  const highCount = measures.filter(m => m.priority === 'hoch').length
  const parts: string[] = []

  if (highCount > 0) {
    parts.push(`Wir haben ${highCount} Maßnahme${highCount > 1 ? 'n' : ''} mit hoher Priorität für Ihr Gebäude identifiziert.`)
  }

  parts.push(
    `Die geschätzte Gesamtförderung liegt zwischen ${totalMin.toLocaleString('de-DE')} € und ${totalMax.toLocaleString('de-DE')} €.`
  )

  if (hasFossil) {
    parts.push('Da Sie aktuell fossil heizen, haben Sie Anspruch auf den Klimageschwindigkeitsbonus (+20% bei Wärmepumpe).')
  }

  if (isfpRecommended) {
    parts.push('Mit einem individuellen Sanierungsfahrplan (iSFP) können Sie zusätzlich 5% mehr Förderung erhalten.')
  }

  return parts.join(' ')
}
