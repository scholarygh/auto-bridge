import React from 'react'
import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Auto-Bridge | Premium Car Marketplace',
  description: 'Discover, buy, and sell premium cars with confidence. Auto-Bridge connects car enthusiasts with trusted sellers across the country.',
  keywords: 'cars, automotive, marketplace, buy cars, sell cars, premium vehicles',
  authors: [{ name: 'Auto-Bridge Team' }],

  openGraph: {
    title: 'Auto-Bridge | Premium Car Marketplace',
    description: 'Discover, buy, and sell premium cars with confidence.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Auto-Bridge | Premium Car Marketplace',
    description: 'Discover, buy, and sell premium cars with confidence.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
} 