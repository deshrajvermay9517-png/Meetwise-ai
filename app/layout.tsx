import type { Metadata } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-dm-serif',
  display: 'swap',
})

import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Meetwise — AI Meeting Notes, Summaries & Transcripts',
  description: 'Turn your meeting recordings into summaries, transcripts, action items, and searchable knowledge instantly with Meetwise.',
  keywords: ['AI meeting notes', 'meeting summaries', 'action items', 'searchable meeting transcripts', 'transcription', 'meeting analytics'],
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  openGraph: {
    title: 'Meetwise — AI Meeting Notes & Summaries',
    description: 'Every meeting, understood. Turn any audio or recording into action items, speaker sentiment, and searchable transcripts.',
    type: 'website',
    url: 'https://meetwise.app',
    siteName: 'Meetwise',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meetwise — AI Meeting Notes & Summaries',
    description: 'Turn any audio or recording into action items, speaker sentiment, and searchable transcripts.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerif.variable}`}>
      <body>
        {children}

        {/* Optional Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}

        {/* Optional Google AdSense */}
        {process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        )}
      </body>
    </html>
  )
}
