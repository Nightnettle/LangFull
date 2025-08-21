import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans'
})

export const metadata: Metadata = {
  title: 'LangFull - Learn Languages the way you want to.',
  description:
    'Transform Documents into interactive language learning experiences with AI-powered vocabulary extraction and Anki card generation.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} font-sans`}>{children}</body>
    </html>
  )
}
