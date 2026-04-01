// Wizard-Daten – alle Gebäudeinformationen die wir sammeln
export interface WizardData {
  // Step 1: Gebäude
  building_type?: 'EFH' | 'DHH' | 'RH'
  year_built?: number
  living_area_m2?: number
  floors?: number

  // Step 2: Heizung
  heating_type?: 'gas' | 'oil' | 'heat_pump' | 'district' | 'wood' | 'electric' | 'other'
  heating_year?: number
  hot_water_separate?: boolean

  // Step 3: Gebäudehülle
  roof_insulated?: boolean
  roof_insulation_year?: number
  wall_insulated?: boolean
  wall_insulation_year?: number
  window_type?: 'single' | 'double' | 'triple'
  window_year?: number
  basement_insulated?: boolean

  // Step 4: Sanierungshistorie
  previous_renovations?: string[]
  has_pv?: boolean

  // Step 5: Ziele & Kontakt
  goals?: ('cost_reduction' | 'subsidies' | 'comfort' | 'value' | 'climate')[]
  contact_name?: string
  contact_email?: string
  contact_phone?: string
  address_street?: string
  address_plz?: string
  address_city?: string
  preferred_contact?: 'email' | 'phone'
  marketing_consent?: boolean
}

export interface Lead {
  id: string
  status: 'submitted' | 'matched' | 'accepted' | 'isfp_completed'
  created_at: string
  building_data: WizardData
}
