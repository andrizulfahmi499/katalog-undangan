'use client'

import { useState, useEffect } from 'react'
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
  return (
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
        {/* Sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0221] via-[#2a0845] via-40% to-[#6b21a8]" />
        
        {/* Aurora glow */}
        <div
          className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full blur-[150px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(168,85,247,0.4) 0%, rgba(107,33,168,0.15) 50%, transparent 70%)',
            animation: 'glow 5s ease-in-out infinite',
          }}
        />

        {/* Stars */}
        <StarryBackground />

        {/* Mountain silhouettes */}
        <svg className="absolute bottom-0 left-0 w-full pointer-events-none" viewBox="0 0 1440 400" preserveAspectRatio="none" style={{ height: '35%' }}>
          <path d="M0,250 L100,180 L200,220 L350,120 L500,200 L650,100 L800,180 L950,90 L1100,170 L1250,110 L1350,190 L1440,150 L1440,400 L0,400Z" fill="#1a0533" opacity="0.9" />
          <path d="M0,300 L150,230 L300,270 L450,180 L600,250 L750,170 L900,240 L1050,160 L1200,230 L1350,185 L1440,220 L1440,400 L0,400Z" fill="#2d1054" opacity="0.85" />
          <path d="M0,340 L200,290 L400,320 L600,270 L800,310 L1000,260 L1200,300 L1440,280 L1440,400 L0,400Z" fill="#1e0a3c" opacity="0.95" />
        </svg>

        {/* Pine forest */}
        <svg className="absolute bottom-0 left-0 w-full pointer-events-none" viewBox="0 0 1440 250" preserveAspectRatio="none" style={{ height: '22%' }}>
          <g fill="#120726" opacity="0.7">
            <polygon points="50,250 65,120 80,250" />
            <polygon points="100,250 118,90 136,250" />
            <polygon points="170,250 185,130 200,250" />
            <polygon points="230,250 248,100 266,250" />
            <polygon points="310,250 325,140 340,250" />
            <polygon points="380,250 398,80 416,250" />
            <polygon points="460,250 475,120 490,250" />
            <polygon points="530,250 548,95 566,250" />
            <polygon points="620,250 635,130 650,250" />
            <polygon points="700,250 718,85 736,250" />
            <polygon points="780,250 795,125 810,250" />
            <polygon points="860,250 878,100 896,250" />
            <polygon points="940,250 955,130 970,250" />
            <polygon points="1020,250 1038,90 1056,250" />
            <polygon points="1100,250 1115,120 1130,250" />
            <polygon points="1170,250 1188,105 1206,250" />
            <polygon points="1250,250 1265,130 1280,250" />
            <polygon points="1330,250 1348,85 1366,250" />
            <polygon points="1400,250 1418,115 1436,250" />
          </g>
          <g fill="#0a0318" opacity="0.9">
            <polygon points="20,250 40,150 60,250" />
            <polygon points="80,250 102,110 124,250" />
            <polygon points="140,250 160,160 180,250" />
            <polygon points="210,250 235,100 260,250" />
            <polygon points="280,250 300,145 320,250" />
            <polygon points="350,250 375,90 400,250" />
            <polygon points="420,250 440,140 460,250" />
            <polygon points="490,250 515,105 540,250" />
            <polygon points="560,250 580,150 600,250" />
            <polygon points="630,250 655,95 680,250" />
            <polygon points="710,250 730,135 750,250" />
            <polygon points="780,250 805,100 830,250" />
            <polygon points="850,250 870,150 890,250" />
            <polygon points="920,250 945,90 970,250" />
            <polygon points="1000,250 1020,140 1040,250" />
            <polygon points="1060,250 1085,100 1110,250" />
            <polygon points="1130,250 1150,145 1170,250" />
            <polygon points="1200,250 1225,95 1250,250" />
            <polygon points="1270,250 1290,135 1310,250" />
            <polygon points="1340,250 1365,105 1390,250" />
            <polygon points="1410,250 1430,130 1440,250" />
          </g>
        </svg>
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Video Hero Section */}
      <VideoHeroSection />

      {/* Phone Showcase Section */}
      <PhoneShowcase />

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
