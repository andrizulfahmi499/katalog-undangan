'use client'

import { Navbar } from '@/components/landing/Navbar'
import { VideoHeroSection } from '@/components/landing/VideoHeroSection'
import { IntroSection } from '@/components/landing/IntroSection'
import { FeatureSection } from '@/components/landing/FeatureSection'
import { CatalogSection } from '@/components/landing/CatalogSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { Footer } from '@/components/landing/Footer'
import { FloatingNav } from '@/components/landing/FloatingNav'

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F5F0E8] via-[#E8DFD0] to-[#FDF9F3] animate-gradient-shift" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#F0E9E2]/50 via-[#F5F0E8]/30 to-[#E8DFD0]/50 animate-gradient-reverse" />
        {/* Floating orbs for depth */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#F5F0E8]/50 rounded-full blur-3xl animate-float-1" />
        <div className="absolute top-40 right-40 w-80 h-80 bg-[#E8DFD0]/40 rounded-full blur-3xl animate-float-2" />
        <div className="absolute bottom-40 left-1/3 w-96 h-96 bg-[#FDF9F3]/40 rounded-full blur-3xl animate-float-3" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#F0E9E2]/50 rounded-full blur-3xl animate-float-4" />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Video Hero Section */}
      <VideoHeroSection />

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
