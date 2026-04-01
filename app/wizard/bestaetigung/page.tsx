import Link from 'next/link'

export const metadata = {
  title: 'Anfrage eingegangen – Sanierungskompass',
}

export default function ConfirmationPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Ihre Anfrage ist eingegangen!
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
        Wir haben Ihre Gebäudedaten erhalten und suchen jetzt nach dem passenden
        Energieberater in Ihrer Region. Sie erhalten innerhalb von <strong>48 Stunden</strong>{' '}
        eine Bestätigung per E-Mail.
      </p>

      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8 text-left">
        <h2 className="font-bold text-green-900 mb-4">Was jetzt passiert:</h2>
        <div className="space-y-3">
          {[
            { icon: '🔍', text: 'Wir suchen einen passenden Energieberater in Ihrer PLZ-Region.' },
            { icon: '📧', text: 'Sie erhalten eine E-Mail mit den Kontaktdaten des Beraters.' },
            { icon: '📞', text: 'Der Berater meldet sich direkt bei Ihnen für einen Termin.' },
            { icon: '📄', text: 'Nach dem Vor-Ort-Termin erstellt er Ihren persönlichen Sanierungsfahrplan (iSFP).' },
          ].map((item) => (
            <div key={item.text} className="flex items-start gap-3">
              <span className="text-xl">{item.icon}</span>
              <span className="text-green-800 text-sm">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
        💡 <strong>Tipp:</strong> Mit einem iSFP erhalten Sie 5 % mehr Förderung bei BAFA und KfW.
        Bei einer Wärmepumpe für 25.000 € macht das <strong>1.250 € mehr</strong> an Förderung aus!
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 text-green-700 font-semibold hover:underline"
      >
        ← Zurück zur Startseite
      </Link>
    </div>
  )
}
