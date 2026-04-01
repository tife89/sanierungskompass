import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-sm font-medium px-3 py-1 rounded-full mb-6">
          ✅ Kostenlos & unverbindlich
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
          Energieberater gefällig?<br />
          <span className="text-green-700">Wir finden den richtigen für Sie.</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
          Geben Sie Ihre Gebäudedaten ein – wir verbinden Sie mit einem qualifizierten
          Energieberater in Ihrer Nähe und bereiten alles für Ihren individuellen
          Sanierungsfahrplan vor.
        </p>
        <Link
          href="/wizard"
          className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors shadow-sm"
        >
          Jetzt kostenlos starten →
        </Link>
        <p className="text-sm text-gray-400 mt-3">Dauert ca. 5 Minuten · Keine Registrierung nötig</p>
      </div>

      {/* So funktioniert es */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">So funktioniert es</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { step: "1", icon: "📋", title: "Gebäudedaten eingeben", desc: "Unser Assistent führt Sie Schritt für Schritt durch alle relevanten Angaben." },
            { step: "2", icon: "🤝", title: "Energieberater zugeteilt", desc: "Wir finden automatisch einen qualifizierten Berater in Ihrer Region." },
            { step: "3", icon: "📄", title: "iSFP & Förderung", desc: "Ihr Berater erstellt den Sanierungsfahrplan – wir helfen bei der Förderbeantragung." },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-sm font-semibold text-green-700 mb-1">Schritt {item.step}</div>
              <div className="font-semibold text-gray-900 mb-1">{item.title}</div>
              <div className="text-sm text-gray-500">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Vorteile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { icon: "💰", text: "Bis zu 35 % Förderung mit iSFP-Bonus" },
          { icon: "⚡", text: "Berater innerhalb von 48h zugeteilt" },
          { icon: "🔒", text: "DSGVO-konform, Daten sicher in Deutschland" },
          { icon: "✅", text: "Nur BAFA-zertifizierte Energieberater" },
        ].map((item) => (
          <div key={item.text} className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4">
            <span className="text-2xl">{item.icon}</span>
            <span className="text-gray-700 font-medium">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
