import { NextRequest, NextResponse } from 'next/server'
import { generateRecommendations } from '@/lib/foerderung/recommendation-engine'
import { WizardData } from '@/lib/supabase/types'

export async function POST(request: NextRequest) {
  try {
    const data: WizardData = await request.json()

    // Empfehlungen generieren
    const recommendations = generateRecommendations(data)

    return NextResponse.json({
      success: true,
      recommendations,
    })
  } catch (error) {
    console.error('Förderberechnung Fehler:', error)
    return NextResponse.json(
      { success: false, error: 'Fehler bei der Förderberechnung' },
      { status: 500 }
    )
  }
}
