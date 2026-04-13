// KfW Förderdaten – extrahiert aus dem KfW MCP-Server
// Quelle: KfW offizielle Förderrichtlinien 2025/2026

export interface KfwProgram {
  id: string
  name: string
  type: 'Kredit' | 'Zuschuss'
  category: string
  description: string
  maxLoanAmount: number | null
  interestRate: number | null
  subsidyRates?: {
    baseGrant: number
    [key: string]: number | string
  }
  eligibleMeasures: string[]
  notes: string
  isActive: boolean
}

// Nur aktive Programme (keine auslaufenden)
export const KFW_PROGRAMS: KfwProgram[] = [
  {
    id: '358',
    name: 'KfW 358 – Ergänzungskredit Einzelmaßnahmen',
    type: 'Kredit',
    category: 'BEG - Einzelmaßnahmen',
    description: 'Zinsgünstiger Kredit für einzelne energetische Maßnahmen an Wohngebäuden',
    maxLoanAmount: 120000,
    interestRate: 2.75,
    eligibleMeasures: [
      'Fenstertausch', 'Dachdämmung', 'Wanddämmung',
      'Kellerdeckendämmung', 'Heizungsanlage', 'Lüftungsanlage', 'Solarthermie',
    ],
    notes: 'Für einzelne energetische Sanierungsmaßnahmen',
    isActive: true,
  },
  {
    id: '359',
    name: 'KfW 359 – Kredit für Komplettsanierung',
    type: 'Kredit',
    category: 'BEG - Vollsanierung',
    description: 'Kredit für umfassende energetische Sanierungen zum KfW-Effizienzhaus Standard',
    maxLoanAmount: 150000,
    interestRate: 2.45,
    eligibleMeasures: [
      'Gesamtsanierung zu Effizienzhaus', 'Wärmepumpe',
      'Biomasse-Heizung', 'Solaranlage',
    ],
    notes: 'Umfassende Sanierung mit Effizienzhaus-Standard',
    isActive: true,
  },
  {
    id: '261',
    name: 'KfW 261/262 – Effizienzhaus-Kredit',
    type: 'Kredit',
    category: 'BEG - Effizienzhaus',
    description: 'Kredit für Wohngebäude, die Effizienzhaus-Standards erreichen',
    maxLoanAmount: 150000,
    interestRate: 2.35,
    eligibleMeasures: [
      'Effizienzhaus Sanierung', 'Wärmepumpe', 'Solaranlage', 'Geothermie',
    ],
    notes: 'Pro Wohneinheit bis 150.000 EUR',
    isActive: true,
  },
  {
    id: '458',
    name: 'KfW 458 – Heizungsförderung (Zuschuss)',
    type: 'Zuschuss',
    category: 'BEG - Heizung',
    description: 'Nicht rückzahlbarer Zuschuss für Heizungsaustausch',
    maxLoanAmount: null,
    interestRate: null,
    subsidyRates: {
      baseGrant: 30,
      heatPumpBonus: 5,
      speedBonus: 10,
      installationBonus: 5,
      combinationBonus: 5,
      maxTotal: 70,
    },
    eligibleMeasures: [
      'Wärmepumpe', 'Biomasse-Heizung', 'Solarthermie',
      'Wärmenetze', 'Hybrid-Heizung',
    ],
    notes: '30% Basis + bis zu 40% Bonuszuschläge = max 70%',
    isActive: true,
  },
  {
    id: '459',
    name: 'KfW 459 – Zuschuss Einzelmaßnahmen',
    type: 'Zuschuss',
    category: 'BEG - Einzelmaßnahmen',
    description: 'Nicht rückzahlbarer Zuschuss für einzelne energetische Maßnahmen',
    maxLoanAmount: null,
    interestRate: null,
    subsidyRates: {
      baseGrant: 15,
      plusBuildingStandard: 10,
      maxTotal: 25,
    },
    eligibleMeasures: [
      'Fenstertausch', 'Dachdämmung', 'Wanddämmung',
      'Kellerdeckendämmung', 'Lüftungsanlage',
    ],
    notes: '15% Basis + 10% für KfW-Standard = max 25%',
    isActive: true,
  },
]
