'use client'

import { Navbar } from '@/components/landing/Navbar'
import { VideoHeroSection } from '@/components/landing/VideoHeroSection'
import { IntroSection } from '@/components/landing/IntroSection'
import { FeatureSection } from '@/components/landing/FeatureSection'
import { CatalogSection } from '@/components/landing/CatalogSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { OrderFormSection } from '@/components/landing/OrderFormSection'
import { Footer } from '@/components/landing/Footer'
import { FloatingNav } from '@/components/landing/FloatingNav'

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden pb-20 md:pb-0" style={{ backgroundColor: '#F7F7F8' }}>
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F7F7F8] via-[#FFFFFF] to-[#F0F4F8] animate-gradient-shift" />
        {/* Floating orbs for depth - soft pastel colors */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#A5B4FC]/20 rounded-full blur-3xl animate-float-1" />
        <div className="absolute top-40 right-40 w-80 h-80 bg-[#C4B5FD]/20 rounded-full blur-3xl animate-float-2" />
        <div className="absolute bottom-40 left-1/3 w-96 h-96 bg-[#FBCFE8]/20 rounded-full blur-3xl animate-float-3" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#A5B4FC]/15 rounded-full blur-3xl animate-float-4" />
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

      {/* Order Form Section */}
      <OrderFormSection />

      {/* Footer */}
      <Footer />

      {/* Floating Navigation */}
      <FloatingNav />
    </main>
  )
}
