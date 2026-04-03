'use client'

import { Navbar } from '@/components/landing/Navbar'
import { VideoHeroSection } from '@/components/landing/VideoHeroSection'
import { HeroSection } from '@/components/landing/HeroSection'
import { IntroSection } from '@/components/landing/IntroSection'
import { FeatureSection } from '@/components/landing/FeatureSection'
import { CatalogSection } from '@/components/landing/CatalogSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { Footer } from '@/components/landing/Footer'
import { FloatingNav } from '@/components/landing/FloatingNav'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      {/* Navbar */}
      <Navbar />

      {/* Video Hero Section */}
      <VideoHeroSection />

      {/* Hero Section */}
      <HeroSection />

      {/* Intro Section */}
      <IntroSection />

      {/* Feature Section */}
      <FeatureSection />

      {/* Catalog Section */}
      <CatalogSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Footer */}
      <Footer />

      {/* Floating Navigation */}
      <FloatingNav />
    </main>
  )
}
