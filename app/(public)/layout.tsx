import React from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navigation />
      <main>
        {children}
      </main>
      <Footer />
    </>
  )
} 