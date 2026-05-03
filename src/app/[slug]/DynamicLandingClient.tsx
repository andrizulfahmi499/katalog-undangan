'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { Navbar } from '@/components/landing/Navbar'
import { VideoHeroSection } from '@/components/landing/VideoHeroSection'
import { IntroSection } from '@/components/landing/IntroSection'
import { FeatureSection } from '@/components/landing/FeatureSection'
import { CatalogSection } from '@/components/landing/CatalogSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { OrderFormSection } from '@/components/landing/OrderFormSection'
import { Footer } from '@/components/landing/Footer'
import { FloatingNav } from '@/components/landing/FloatingNav'
import { PhoneShowcase } from '@/components/landing/PhoneShowcase'
import { CustomLandingContext } from '@/context/CustomLandingContext'
import { DearMyLoveClone } from '@/components/landing/DearMyLoveClone'
import { CleanAppLanding } from '@/components/landing/cleanapp/CleanAppLanding'

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

export default function DynamicLandingClient({ config, member }: { config: any; member: any }) {
  const { isLight } = useTheme()

  // Check for CleanApp theme
  if (member.landingPageTheme === 'cleanapp') {
    // Pass initialConfig directly for faster loading (SSR data)
    return <CleanAppLanding
      slug={member.customSlug}
      memberId={member.id}
      initialConfig={config}
    />
  }

  // If member has explicitly chosen "neumorphism" OR if no theme is chosen but the global theme is "light" (legacy fallback)
  const isNeumorphism = member.landingPageTheme === 'neumorphism' || (!member.landingPageTheme && isLight)

  if (!isNeumorphism) {
    return (
      <CustomLandingContext.Provider value={{ config, member }}>
        <DearMyLoveClone />
      </CustomLandingContext.Provider>
    )
  }

  return (
    <CustomLandingContext.Provider value={{ config, member }}>
      <main className="min-h-screen relative overflow-hidden pb-20 md:pb-0">
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
        <VideoHeroSection />
        <PhoneShowcase />
        <IntroSection />
        <FeatureSection />
        <CatalogSection />
        <PricingSection />
        <OrderFormSection />
        <Footer />
        <FloatingNav />
      </main>
    </CustomLandingContext.Provider>
  )
}