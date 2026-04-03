'use client'

import { Navbar } from '@/components/landing/Navbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { IntroSection } from '@/components/landing/IntroSection'
import { FeatureSection } from '@/components/landing/FeatureSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { Footer } from '@/components/landing/Footer'
import { WaveDivider } from '@/components/landing/WaveDivider'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Wave Divider */}
      <WaveDivider color="#FFF9E6" />

      {/* Intro Section */}
      <IntroSection />

      {/* Wave Divider */}
      <WaveDivider color="white" />

      {/* Feature Section */}
      <FeatureSection />

      {/* Wave Divider */}
      <WaveDivider color="#FFF9E6" />

      {/* Pricing Section */}
      <PricingSection />

      {/* Footer */}
      <Footer />
    </main>
  )
}
