import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { WizardData } from '@/lib/supabase/types'

// Service-Role-Client für Server-Seite (kann RLS umgehen)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body: WizardData = await req.json()

    // Pflichtfelder prüfen
    if (!body.contact_email) {
      return NextResponse.json({ error: 'E-Mail ist erforderlich.' }, { status: 400 })
    }
    if (!body.building_type || !body.year_built) {
      return NextResponse.json({ error: 'Gebäudedaten unvollständig.' }, { status: 400 })
    }

    // Eigene IDs generieren, damit wir kein SELECT nach INSERT brauchen
    // (RLS erlaubt nur INSERT, kein SELECT für anonyme Nutzer)
    const buildingId = crypto.randomUUID()
    const leadId = crypto.randomUUID()

    // 1. Gebäude speichern
    const { error: buildingError } = await supabase
      .from('buildings')
      .insert({
        id:              buildingId,
        address_street:  body.address_street,
        address_plz:     body.address_plz,
        address_city:    body.address_city,
        type:            body.building_type,
        year_built:      body.year_built,
        living_area_m2:  body.living_area_m2,
        floors:          body.floors,
        details: {
          heating_type:         body.heating_type,
          heating_year:         body.heating_year,
          hot_water_separate:   body.hot_water_separate,
          roof_insulated:       body.roof_insulated,
          roof_insulation_year: body.roof_insulation_year,
          wall_insulated:       body.wall_insulated,
          wall_insulation_year: body.wall_insulation_year,
          window_type:          body.window_type,
          window_year:          body.window_year,
          basement_insulated:   body.basement_insulated,
          previous_renovations: body.previous_renovations,
          has_pv:               body.has_pv,
        },
      })

    if (buildingError) throw buildingError

    // 2. Lead speichern
    const { error: leadError } = await supabase
      .from('leads')
      .insert({
        id:                leadId,
        building_id:       buildingId,
        status:            'submitted',
        contact_name:      body.contact_name,
        contact_email:     body.contact_email,
        contact_phone:     body.contact_phone,
        goals:             body.goals,
        preferred_contact: body.preferred_contact ?? 'email',
        marketing_consent: body.marketing_consent ?? false,
      })

    if (leadError) throw leadError

    // 3. Consent-Eintrag (DSGVO-Audit-Log)
    await supabase.from('consents').insert([
      {
        lead_id:        leadId,
        consent_type:   'platform',
        granted:        true,
        policy_version: '1.0',
      },
      ...(body.marketing_consent
        ? [{
            lead_id:        leadId,
            consent_type:   'enercity_marketing',
            granted:        true,
            policy_version: '1.0',
          }]
        : []),
    ])

    return NextResponse.json({ success: true, lead_id: leadId }, { status: 201 })

  } catch (error) {
    console.error('Lead creation error:', error)
    return NextResponse.json({ error: 'Interner Fehler. Bitte erneut versuchen.' }, { status: 500 })
  }
}
