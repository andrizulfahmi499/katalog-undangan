'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useTheme } from '@/context/ThemeContext'
import { Navbar } from '@/components/landing/Navbar'
import { VideoHeroSection } from '@/components/landing/VideoHeroSection'

// Section di bawah fold — lazy load agar tidak block initial render
const IntroSection = dynamic(() => import('@/components/landing/IntroSection').then(m => ({ default: m.IntroSection })), { ssr: false })
const FeatureSection = dynamic(() => import('@/components/landing/FeatureSection').then(m => ({ default: m.FeatureSection })), { ssr: false })
const CatalogSection = dynamic(() => import('@/components/landing/CatalogSection').then(m => ({ default: m.CatalogSection })), { ssr: false })
const PricingSection = dynamic(() => import('@/components/landing/PricingSection').then(m => ({ default: m.PricingSection })), { ssr: false })
const OrderFormSection = dynamic(() => import('@/components/landing/OrderFormSection').then(m => ({ default: m.OrderFormSection })), { ssr: false })
const FAQSection = dynamic(() => import('@/components/landing/FAQSection').then(m => ({ default: m.FAQSection })), { ssr: false })
const Footer = dynamic(() => import('@/components/landing/Footer').then(m => ({ default: m.Footer })), { ssr: false })
const PhoneShowcase = dynamic(() => import('@/components/landing/PhoneShowcase').then(m => ({ default: m.PhoneShowcase })), { ssr: false })
const MagicFloatingNav = dynamic(() => import('@/components/landing/MagicFloatingNav').then(m => ({ default: m.MagicFloatingNav })), { ssr: false })
const Sidebar = dynamic(() => import('@/components/landing/Sidebar').then(m => ({ default: m.Sidebar })), { ssr: false })
const DearMyLoveClone = dynamic(() => import('@/components/landing/DearMyLoveClone').then(m => ({ default: m.DearMyLoveClone })), { ssr: false })
const ScrollProgressIndicator = dynamic(() => import('@/components/landing/animations/ScrollProgressIndicator').then(m => ({ default: m.ScrollProgressIndicator })), { ssr: false })

function StarryBackground() {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number; duration: number }>>([])

  useEffect(() => {
    const generated = Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      delay: Math.random() * 3,
      duration: Math.random() * 2 + 1.5,
    }))
    setStars(generated)
  }, [])

  return (
    <>
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
    </>
  )
}


export default function Home() {
  const { isLight } = useTheme()

  if (!isLight) {
    return <DearMyLoveClone />
  }

  return (
    <main className="min-h-screen relative overflow-hidden pb-20 md:pb-0">
      <ScrollProgressIndicator position="top" thickness={3} />
      <Sidebar />
      {/* === CSS Keyframes === */}
      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* === Fixed Background === */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#e0e5ec]" />
      </div>

      <Navbar />
      <div id="home">
        <VideoHeroSection />
      </div>
      <PhoneShowcase />
      <IntroSection />
      <div id="fitur">
        <FeatureSection />
      </div>
      <div id="catalog">
        <CatalogSection />
      </div>
      <div id="pricing">
        <PricingSection />
      </div>
      <div id="order">
        <OrderFormSection />
      </div>
      <div id="faq">
        <FAQSection />
      </div>
      <Footer />
      <MagicFloatingNav 
        whatsappNumber="6285299659458" 
        instagramUser="akainvitation"
        isLight={true}
      />
    </main>
  )
}
