import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sanierungskompass – Ihr Energieberater findet Sie",
  description:
    "Geben Sie Ihre Gebäudedaten ein und wir verbinden Sie mit einem qualifizierten Energieberater in Ihrer Nähe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="h-full">
      <body className="min-h-full flex flex-col bg-gray-50" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
        <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
            <span className="text-xl font-bold text-green-700">🏠 Sanierungskompass</span>
            <span className="text-gray-400 text-sm hidden sm:inline">von Lynqtech · enercity</span>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-400">
          © 2026 Lynqtech GmbH ·{" "}
          <a href="#" className="underline hover:text-gray-600">Impressum</a> ·{" "}
          <a href="#" className="underline hover:text-gray-600">Datenschutz</a> ·{" "}
          <a href="#" className="underline hover:text-gray-600">AGB</a>
        </footer>
      </body>
    </html>
  );
}
