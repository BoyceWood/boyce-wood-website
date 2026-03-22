import type { Metadata } from 'next'
import { Roboto_Condensed, Inter } from 'next/font/google'
import './globals.css'

const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-display',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'Boyce Wood — Groupe électro-acoustique live | Nivelles',
  description: 'Boyce Wood, groupe cover électro-acoustique basé à Nivelles. Deux formules live pour festivals, mariages et événements ASBL en Wallonie. Devis gratuit sous 24h.',
  keywords: ['groupe live belgique', 'groupe mariage wallonie', 'cover band nivelles', 'groupe festival belgique', 'électro-acoustique live', 'boyce wood'],
  authors: [{ name: 'Boyce Wood' }],
  creator: 'Boyce Wood',
  openGraph: {
    type: 'website',
    locale: 'fr_BE',
    url: 'https://boycewood.vercel.app',
    siteName: 'Boyce Wood',
    title: 'Boyce Wood — Groupe électro-acoustique live | Nivelles',
    description: 'Groupe cover électro-acoustique pour festivals, mariages et événements en Wallonie. Devis gratuit sous 24h.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Boyce Wood — Groupe électro-acoustique live',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Boyce Wood — Groupe électro-acoustique live',
    description: 'Groupe cover électro-acoustique pour festivals, mariages et événements en Wallonie.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://boycewood.vercel.app',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={`${robotoCondensed.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  )
}
