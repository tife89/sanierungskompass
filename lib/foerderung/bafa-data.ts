// BAFA Förderdaten – extrahiert aus dem BAFA MCP-Server
// Quelle: BAFA offizielle Förderrichtlinien 2025/2026
// Letzte Aktualisierung: 2025-12-01

export interface BafaMeasure {
  id: string
  name: string
  category: string
  baseRate: number
  iSFPBonus: number
  climaBonus: number
  maxEligibleCost: number
  maxEligibleCostWithISFP: number
  description: string
}

export interface BafaConditions {
  general: string[]
  iSFP: {
    description: string
    bonus: string
    condition: string
  }
  climaBonus: {
    description: string
    bonus: string
    condition: string
  }
}

export const BAFA_MEASURES: BafaMeasure[] = [
  {
    id: 'heat_pump',
    name: 'Heizungstausch – Wärmepumpe',
    category: 'Heizungstechnik',
    baseRate: 0.30,
    iSFPBonus: 0.05,
    climaBonus: 0.20,
    maxEligibleCost: 30000,
    maxEligibleCostWithISFP: 60000,
    description: 'Austausch von fossilen Heizsystemen durch elektrische Wärmepumpen',
  },
  {
    id: 'biomass',
    name: 'Heizungstausch – Biomasse',
    category: 'Heizungstechnik',
    baseRate: 0.10,
    iSFPBonus: 0.05,
    climaBonus: 0.00,
    maxEligibleCost: 30000,
    maxEligibleCostWithISFP: 60000,
    description: 'Austausch durch Biomasse-Heizungen (Holz-Pellets, etc.)',
  },
  {
    id: 'wall_insulation',
    name: 'Wärmedämmung Außenwand',
    category: 'Gebäudehülle',
    baseRate: 0.15,
    iSFPBonus: 0.05,
    climaBonus: 0.00,
    maxEligibleCost: 30000,
    maxEligibleCostWithISFP: 60000,
    description: 'Wärmedämmung der Außenwandflächen von Bestandsgebäuden',
  },
  {
    id: 'roof_insulation',
    name: 'Wärmedämmung Dach/Oberste Geschossdecke',
    category: 'Gebäudehülle',
    baseRate: 0.15,
    iSFPBonus: 0.05,
    climaBonus: 0.00,
    maxEligibleCost: 30000,
    maxEligibleCostWithISFP: 60000,
    description: 'Wärmedämmung von Dachflächen oder der obersten Geschossdecke',
  },
  {
    id: 'windows',
    name: 'Fenster und Außentüren',
    category: 'Gebäudehülle',
    baseRate: 0.15,
    iSFPBonus: 0.05,
    climaBonus: 0.00,
    maxEligibleCost: 30000,
    maxEligibleCostWithISFP: 60000,
    description: 'Erneuerung von Fenstern und Außentüren zu höheren Dämmanforderungen',
  },
  {
    id: 'ventilation',
    name: 'Lüftungsanlage mit Wärmerückgewinnung',
    category: 'Anlagentechnik',
    baseRate: 0.15,
    iSFPBonus: 0.05,
    climaBonus: 0.00,
    maxEligibleCost: 30000,
    maxEligibleCostWithISFP: 60000,
    description: 'Einbau von Lüftungsanlagen mit Wärmerückgewinnung',
  },
  {
    id: 'heating_optimization',
    name: 'Heizungsoptimierung',
    category: 'Anlagentechnik',
    baseRate: 0.15,
    iSFPBonus: 0.05,
    climaBonus: 0.00,
    maxEligibleCost: 30000,
    maxEligibleCostWithISFP: 60000,
    description: 'Optimierung bestehender Heizungsanlagen (Hydraulischer Abgleich etc.)',
  },
  {
    id: 'solar',
    name: 'Solarthermie',
    category: 'Erneuerbare Energien',
    baseRate: 0.10,
    iSFPBonus: 0.05,
    climaBonus: 0.00,
    maxEligibleCost: 30000,
    maxEligibleCostWithISFP: 60000,
    description: 'Installation von Solarthermie-Anlagen',
  },
]

export const BAFA_CONDITIONS: BafaConditions = {
  general: [
    'Maßnahmen müssen von Fachunternehmen durchgeführt werden',
    'Antragstellung vor Maßnahmenbeginn erforderlich',
    'Verwendung von Fachunternehmen oder Energieberatern verpflichtend',
    'Gebäude müssen älter als 5 Jahre sein',
  ],
  iSFP: {
    description: 'Individueller Sanierungsfahrplan (iSFP)',
    bonus: '5% zusätzliche Förderung',
    condition: 'Erstellung durch zugelassenen Energieberater',
  },
  climaBonus: {
    description: 'Klimageschwindigkeitsbonus',
    bonus: 'Bis zu 20% zusätzlich für Wärmepumpen',
    condition: 'Nur beim Austausch fossiler Heizsysteme (Öl, alte Gasheizung)',
  },
}
