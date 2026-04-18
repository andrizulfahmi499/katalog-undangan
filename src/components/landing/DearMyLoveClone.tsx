'use client'

import { useState, useEffect, useRef, useContext } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { CatalogSection } from './CatalogSection'
import { OrderFormSection } from './OrderFormSection'
import { CustomLandingContext } from '@/context/CustomLandingContext'
import { Check, Crown, Sparkles, Star } from 'lucide-react'

// ─── Fonts ─────────────────────────────────────────────────────────────────────
// Arapey = body serif font (className_5a0697 on <body>)
// Josefin Sans = heading font (className_af3812)
// Lato = small labels font (className_ef471e)
// All loaded via globals.css @font-face from local .woff2 files

// ─── Rose SVG path from dearmylove.org ─────────────────────────────────────────
const ROSE_PATH = "M1431 5750c0,-651 0,-1302 0,-1954 -205,-447 -746,-551 -950,-512 -613,115 -279,-290 49,302 269,394 572,437 901,210 0,-300 0,-600 0,-900 226,-16 504,-84 555,-264 166,-514 319,-435 246,-367 -67,62 -192,66 -277,71 -175,2 -284,8 -435,75 -368,163 -72,305 -97,-131 -8,-140 -56,-244 -99,-348 -218,-530 324,-205 -238,-118 -392,60 -855,28 -1003,-404 -126,-386 130,-448 437,-302 233,111 471,263 708,358 114,46 239,82 362,50 297,-90 466,-207 464,-541 -1,-281 -201,-121 -337,-48 -282,150 -659,293 -940,63 -158,-133 -172,-263 -153,-454 9,-86 23,-170 -66,-215 -113,-38 -186,56 -232,146 -53,104 -75,280 -21,388 113,191 455,209 649,279 150,53 235,205 337,237 149,41 180,-159 34,-211 -259,-86 -557,-125 -647,-426 -82,-293 489,-36 599,45 211,163 366,434 657,442 173,-18 365,-211 414,-373 46,-155 -48,-191 -154,-301 -150,-153 -35,-471 -484,-313 -223,78 -397,349 -147,420 112,32 227,-5 256,-128 15,-63 -2,-120 -32,-175 -170,-271 -457,-314 -753,-291 -171,14 -320,172 -252,348 128,194 506,438 738,333 99,-52 152,-141 84,-243 -77,-116 -304,-161 -381,-33 -95,176 255,491 370,596 90,82 160,145 239,244 203,260 45,279 29,252 -22,-37 41,-89 65,-107 113,-77 272,-120 335,-251 34,-75 119,-353 242,-259 83,63 28,204 -21,271 -114,154 -312,266 -451,406 -125,128 -177,160 -346,216 -486,155 -767,-103 -1066,-439 -111,-125 -258,-304 -423,-354"

// ─── DearMyLove Logo SVG (exact path from dearmylove.org) ─────────────────────
const LOGO_PATH = "M157.66 639.12c-7.75,-0.59 -17.29,-1.19 -28.47,-1.63 -11.33,-0.6 -23.84,-0.75 -37.7,-0.75l-54.55 0.75c-9.99,0.59 -23.7,0.74 -41.43,0.74 -1.05,0 -1.64,-1.64 -1.64,-4.91 0,-3.28 0.59,-4.91 1.64,-4.91 21.46,0 37.4,-1.34 47.54,-4.17 10.13,-2.68 17.29,-8.04 21.01,-16.08 3.73,-8.04 5.82,-20.24 5.82,-36.76l0 -382.52c0,-16.52 -1.79,-28.58 -5.37,-36.32 -3.58,-7.74 -10.43,-13.09 -20.72,-16.07 -10.28,-2.98 -26.08,-4.62 -47.54,-4.62 -1.19,0 -1.64,-1.63 -1.64,-4.91 0,-3.27 0.6,-4.91 1.64,-4.91l40.54 0.74c23.1,1.2 41.28,1.64 54.55,1.64 19.22,0 38.9,-0.89 58.72,-2.53 24.3,-1.19 40.84,-1.64 49.63,-1.64 57.98,0 109.25,11.02 153.81,33.05 44.72,22.03 79.29,52.09 103.88,90.04 24.59,37.96 36.81,80.67 36.81,128.01 0,53.43 -12.82,100.61 -38.45,141.69 -25.64,41.08 -59.91,72.63 -102.99,94.95 -43.07,22.33 -90.16,33.49 -141.44,33.49 -15.94,0 -33.98,-0.89 -53.8,-2.53l0.15 0.16zm2535.59 -472c-11.51,15.11 -22.15,27.68 -31.91,37.69 0,0.59 -0.3,0.89 -0.89,0.89 -3.88,3.87 -7.46,7.45 -10.73,10.72 -33.24,30.37 -66.33,45.54 -99.56,45.54 -11.03,0 -20.72,-2.23 -29.06,-6.7 -8.35,-4.46 -14.61,-9.52 -19.08,-15.33 -4.47,-5.8 -8.35,-13.99 -11.63,-24.41 -3.27,-10.41 -5.36,-18.9 -6.25,-25.3 -0.9,-6.4 -2.09,-15.63 -3.73,-27.68 -3.28,-27.54 -7.6,-47.18 -12.81,-58.79 -5.22,-11.61 -15.05,-17.42 -29.51,-17.42 -22.06,0 -50.82,26.2 -86.29,78.73 -6.71,10.57 -16.1,25.61 -28.17,45.55 -7.16,11.01 -12.37,19.2 -15.8,24.41 -3.43,5.21 -6.86,10.42 -10.44,15.33 -3.57,4.91 -6.7,8.18 -9.08,9.52 -2.54,1.34 -5.07,2.08 -7.9,2.08l-0.9 0.01c-9.98,-0.59 -19.07,-4.17 -27.42,-10.71 -11.03,-9.98 -16.54,-24.86 -16.54,-44.65 0,-3.28 0.3,-12.21 0.9,-26.5 6.11,-81.12 3.57,-127.56 -7.46,-139.17 -1.04,-1.04 -2.23,-1.63 -3.28,-1.63 -7.15,0 -17.28,6.4 -30.25,19.05 -12.97,12.65 -23.7,25.6 -31.89,38.99 -0.6,0.6 -1.05,1.05 -1.64,1.64 -15.5,24.26 -30.11,51.35 -43.97,81.12 -13.85,29.77 -23.7,54.92 -29.81,75.31 -4.47,15.49 -11.92,23.23 -22.35,23.23 -1.05,0 -2.24,-0.3 -3.28,-0.9 -7.16,-1.63 -13.12,-6.7 -17.89,-15.33 -4.62,-8.48 -6.25,-17.26 -4.62,-26.04 6.71,-31.41 18.19,-70.41 34.88,-116.84 16.54,-46.44 31.15,-81.12 43.96,-104.34 5.52,-9.38 13.27,-11.61 23.26,-6.55 7.15,3.28 12.37,9.68 15.35,19.06 2.97,9.37 2.38,20.69 -2.09,33.93 -1.64,4.47 -5.22,13.25 -10.73,26.5 0,1.04 0,1.94 -0.44,2.53 -0.3,0.6 -0.6,1.19 -0.9,2.08 -0.3,0.89 -0.74,1.49 -1.19,2.08 1.63,-2.83 3.27,-5.2 4.91,-7.44l0.9 -0.89c0.6,-1.04 1.34,-2.53 2.53,-4.17l0.9 -1.64c33.68,-49.71 65.72,-74.57 96.13,-74.57 9.39,0 17.44,3.57 24,10.72 11.03,12.2 17.28,35.27 18.62,69.51 1.35,34.23 0.45,65.93 -2.83,95.25 -1.64,27.54 -2.53,45.84 -2.53,54.63 3.87,-6.11 11.32,-18.01 22.35,-35.58 12.22,-19.35 21.76,-34.53 29.06,-45.54l0 -0.9 1.64 -2.53c8.79,-13.25 16.24,-23.96 22.35,-32.3 6.12,-8.33 14.61,-18.6 25.79,-31.1 11.03,-12.36 23.1,-21.74 36.06,-28.14 12.97,-6.4 26.38,-9.52 40.25,-9.52 11.62,0 21.76,2.38 30.25,7 8.49,4.76 15.2,10.12 19.82,16.07 4.77,6.11 8.8,14.89 12.37,26.5 3.58,11.61 5.96,20.99 7.01,28.13 1.04,7.15 2.53,17.42 4.17,30.66 3.28,25.9 7.16,44.5 11.63,55.52 4.47,11.01 11.92,16.52 22.36,16.52 22.65,0 45,-9.97 67.21,-29.77 0.6,0 0.9,-0.3 0.9,-0.89 21.9,-20.36 48.38,-54.07 79.33,-100.88 8.21,-17.01 16.85,-32.23 25.86,-45.58 3.28,-4.91 7.9,-7.88 13.71,-8.63 5.81,-0.75 11.47,0.44 16.99,3.72 6.11,3.87 9.99,9.52 11.63,16.96 1.63,7.45 0,16.23 -4.92,26.05 -24.3,41.97 -36.52,77.25 -36.52,105.97 0,21.58 5.52,32.3 16.55,32.3 14.9,0 34.28,-10.27 58.12,-30.66 19.83,-17.72 49.78,-49.12 89.57,-94.37 40.99,-46.44 69.46,-76.21 85.4,-89.45 11.63,-12.21 22.06,-13.84 31.45,-4.91 5.52,4.47 8.8,11.01 9.99,19.94 1.04,8.78 -0.6,16.08 -4.92,21.58z"

// ─── Botanical Floral SVG ──────────────────────────────────────────────────────
function FloralBotanical({ mirrored = false, className = '' }: { mirrored?: boolean; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 900"
      stroke="white"
      strokeWidth="1.2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={mirrored ? { transform: 'scaleX(-1)' } : undefined}
    >
      <ellipse cx="320" cy="280" rx="60" ry="70" strokeWidth="1.5"/>
      <ellipse cx="320" cy="280" rx="30" ry="35"/>
      <path d="M320 210 Q280 150 250 100 Q310 130 320 210z"/>
      <path d="M320 210 Q360 150 390 100 Q330 130 320 210z"/>
      <path d="M260 300 Q190 280 150 250 Q200 300 260 300z"/>
      <path d="M380 300 Q450 280 490 250 Q440 300 380 300z"/>
      <path d="M290 360 Q260 420 240 480 Q300 420 290 360z"/>
      <path d="M350 360 Q380 420 400 480 Q340 420 350 360z"/>
      <line x1="320" y1="270" x2="300" y2="240"/>
      <line x1="320" y1="270" x2="330" y2="238"/>
      <line x1="320" y1="270" x2="340" y2="242"/>
      <circle cx="300" cy="238" r="4" fill="white" fillOpacity="0.6"/>
      <circle cx="330" cy="236" r="4" fill="white" fillOpacity="0.6"/>
      <circle cx="341" cy="240" r="4" fill="white" fillOpacity="0.6"/>
      <path d="M230 450 Q140 500 80 580 Q120 520 200 480"/>
      <path d="M230 450 Q190 480 100 500"/>
      <path d="M200 500 Q130 560 90 630"/>
      <path d="M80 200 Q30 160 10 80 Q60 140 100 180 Q130 130 180 100 Q150 160 120 200 Q110 240 80 200z"/>
      <path d="M80 200 Q95 170 100 140"/>
      <path d="M160 60 Q220 20 300 10"/>
      <path d="M180 55 Q190 30 200 15"/>
      <path d="M220 40 Q230 20 245 10"/>
      <path d="M50 700 Q150 650 250 680 Q350 700 400 750"/>
      <path d="M150 660 Q160 620 200 600"/>
      <path d="M200 600 Q240 580 260 550"/>
      <path d="M260 550 Q280 530 270 500"/>
      <path d="M100 750 Q60 780 20 800"/>
      <path d="M100 750 Q120 780 130 820"/>
      <circle cx="400" cy="750" r="5" fill="white" fillOpacity="0.5"/>
      <circle cx="420" cy="730" r="3" fill="white" fillOpacity="0.4"/>
      <path d="M480 300 Q530 260 560 220 Q520 270 480 300z"/>
      <path d="M500 350 Q560 330 600 350 Q560 380 500 350z"/>
      <path d="M320 380 Q340 450 320 520 Q300 590 320 650 Q340 710 320 750"/>
    </svg>
  )
}

// ─── Default pricing ───────────────────────────────────────────────────────────
const DEFAULT_PACKAGES = [
  { id: 1, name: 'Basic', price: '70.000', features: 'Masa aktif selamanya\nTanpa Batas Tamu\nGallery Foto Bebas', enabled: true },
  { id: 2, name: 'Premium', price: '100.000', features: 'Masa aktif selamanya\nTanpa Batas Tamu\nVideo Undangan Lengkap\nFilter Instagram', enabled: true },
  { id: 3, name: 'VIP', price: '150.000', features: 'Masa aktif selamanya\nBebas Custom\nCustom Domain Pilihan\nDesain Sesuai Keinginan\nPriority Support 24/7', enabled: true },
]

// ─── Section Reveal (whileInView) ─────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Parallax wrapper using useScroll ─────────────────────────────────────────
function ParallaxImage({ src, alt, speed = 0.15 }: { src: string; alt: string; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * -100}px`, `${speed * 100}px`])

  return (
    <div ref={ref} className="relative overflow-hidden rounded-2xl shadow-2xl shadow-black/50 w-full h-full">
      <motion.div style={{ y }} className="absolute inset-0 scale-110">
        <Image src={src} alt={alt} fill className="object-cover brightness-90" />
      </motion.div>
    </div>
  )
}

// ─── Navbar Item (expandable, exact dearmylove.org behavior) ──────────────────
function NavItem({
  href,
  icon,
  label,
  dark = false,
  expandWidth = '98px',
}: {
  href: string
  icon: React.ReactNode
  label: string
  dark?: boolean
  expandWidth?: string
}) {
  return (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
      <motion.div
        className="group relative flex h-10 w-10 items-center overflow-hidden rounded-full py-[2px] pl-[5px] pr-[2px] transition-all duration-300 md:hover:w-auto"
        style={{ backgroundColor: dark ? '#172a26' : 'transparent' }}
        whileTap={{ scale: 0.92 }}
        title={label}
      >
        <div className="flex-shrink-0">{icon}</div>
        <motion.p
          className="hidden md:block text-xs ml-1.5 pr-3 whitespace-nowrap font-lato overflow-hidden max-w-0 group-hover:max-w-[120px] transition-all duration-300"
          style={{ color: dark ? 'white' : '#172a26' }}
        >
          {label}
        </motion.p>
      </motion.div>
    </a>
  )
}

// ─── Pricing Card ─────────────────────────────────────────────────────────────
function PricingCard({ pkg, index }: { pkg: any; index: number }) {
  const isHighlighted = index === 1
  const features = typeof pkg.features === 'string' ? pkg.features.split('\n').filter(Boolean) : (pkg.features || [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`relative flex flex-col rounded-3xl p-7 transition-all duration-300 ${
        isHighlighted
          ? 'bg-[#ededed] shadow-2xl shadow-black/40'
          : 'bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15'
      }`}
    >
      {isHighlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#172a26] text-[#ededed] text-[10px] font-josefin font-bold px-4 py-1 rounded-full tracking-[0.2em] uppercase">
          ✦ Populer
        </div>
      )}
      <div className="mb-5 text-center">
        <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl mb-3 ${isHighlighted ? 'bg-[#172a26] text-white' : 'bg-white/20 text-white'}`}>
          {index === 0 ? <Sparkles className="w-5 h-5" /> : index === 1 ? <Crown className="w-5 h-5" /> : <Star className="w-5 h-5" />}
        </div>
        <h3 className={`text-xl font-josefin font-bold tracking-widest uppercase ${isHighlighted ? 'text-[#172a26]' : 'text-white'}`}>{pkg.name}</h3>
      </div>
      <div className="text-center mb-6">
        <div className={`text-3xl font-arapey font-bold ${isHighlighted ? 'text-[#172a26]' : 'text-white'}`}>Rp {pkg.price}</div>
        <div className={`text-xs mt-1 font-lato tracking-widest uppercase ${isHighlighted ? 'text-[#172a26]/50' : 'text-white/50'}`}>per undangan</div>
      </div>
      <ul className="space-y-2.5 flex-1 mb-7">
        {features.map((feat: string, i: number) => (
          <li key={i} className="flex items-start gap-2">
            <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isHighlighted ? 'text-[#172a26]' : 'text-[#ededed]/80'}`} />
            <span className={`text-sm font-lato ${isHighlighted ? 'text-[#172a26]/80' : 'text-white/80'}`}>{feat}</span>
          </li>
        ))}
      </ul>
      <motion.a
        href="#pesan"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className={`w-full py-3 rounded-full text-xs font-josefin font-bold text-center tracking-widest uppercase transition-all ${
          isHighlighted ? 'bg-[#172a26] text-white hover:bg-[#223e36]' : 'bg-white/15 text-white border border-white/30 hover:bg-white/25'
        }`}
      >
        {isHighlighted ? 'Pilih Paket Ini' : 'Mulai Sekarang'}
      </motion.a>
    </motion.div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function DearMyLoveClone() {
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const ctx = useContext(CustomLandingContext)
  const config = ctx?.config || {}

  const siteName = (config?.siteName as string) || 'AKA Invitation'
  const whatsappNumber = (config?.whatsappNumber as string) || '6285299659458'
  const instagramUser = config?.socialMedia?.instagram?.url
    ? (config.socialMedia.instagram.url as string).replace(/.*instagram\.com\//i, '@').replace(/\//g, '')
    : '@akainvitation'
  const logoUrl = (config?.logoUrl as string) || null

  const pricingPackages = (config?.pricingPackages as any[])?.filter((p: any) => p.enabled !== false) || DEFAULT_PACKAGES

  // ── Preloader ────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 3000)
    return () => clearTimeout(t)
  }, [])

  // ── Parallax on background florals via scroll ─────────────────────
  const { scrollY } = useScroll()
  const floralLeftY = useTransform(scrollY, [0, 800], [0, -60])
  const floralRightY = useTransform(scrollY, [0, 800], [0, -40])

  return (
    <main
      ref={containerRef}
      className="relative min-h-screen overflow-x-hidden"
      style={{ fontFamily: "'Arapey', Georgia, serif", background: 'linear-gradient(to bottom, #172a26, #1a2f2a)' }}
    >
      {/* ── Preloader ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1, ease: 'easeInOut' } }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
            style={{ background: 'linear-gradient(to bottom, #172a26, #1a2f2a)' }}
          >
            {/* Logo at top */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute top-10 left-1/2 -translate-x-1/2"
            >
              {logoUrl ? (
                <img src={logoUrl} alt={siteName} className="h-8 w-auto" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" viewBox="0 0 5000 650" className="w-[160px] fill-white opacity-90">
                  <path d={LOGO_PATH} />
                </svg>
              )}
            </motion.div>

            {/* Rose SVG with stroke draw animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 2600 5800"
                width="70"
                stroke="#ededed"
                strokeWidth="50"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path className="rose-draw" d={ROSE_PATH} />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Fixed Top Logo ─────────────────────────────────────────── */}
      <div className="fixed left-0 top-0 z-50 flex h-14 w-full items-end justify-center px-3 pointer-events-none">
        {logoUrl ? (
          <img src={logoUrl} alt={siteName} className="mb-3 h-8 w-auto" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" viewBox="0 0 5000 650" className="mb-3 w-[160px] fill-white md:mb-0 md:w-[200px]">
            <path d={LOGO_PATH} />
          </svg>
        )}
      </div>

      {/* ── Fixed Background Botanical Florals (parallax) ─────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div style={{ y: floralLeftY }} className="absolute -left-20 -top-10 opacity-[0.18] w-[420px] h-[580px]">
          <FloralBotanical className="w-full h-full breathing-1" />
        </motion.div>
        <motion.div style={{ y: floralRightY }} className="absolute -right-20 -top-10 opacity-[0.18] w-[420px] h-[580px]">
          <FloralBotanical mirrored className="w-full h-full breathing-2" />
        </motion.div>
        <motion.div style={{ y: floralLeftY }} className="absolute -left-12 bottom-20 opacity-[0.10] w-[280px] h-[380px]">
          <FloralBotanical className="w-full h-full breathing-3" />
        </motion.div>
        <motion.div style={{ y: floralRightY }} className="absolute -right-12 bottom-20 opacity-[0.10] w-[280px] h-[380px]">
          <FloralBotanical mirrored className="w-full h-full breathing-4" />
        </motion.div>
      </div>

      {/* ── Page Content ──────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center px-6 pt-32 pb-48 gap-28 w-full">

        {/* Hero */}
        <section className="flex flex-col items-center text-center gap-8 max-w-2xl">
          <Reveal>
            <h1 style={{ fontFamily: "'Josefin Sans', sans-serif" }} className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[0.18em] leading-tight text-white uppercase">
              YOUR ONE STOP<br />WEDDING KIT
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ fontFamily: "'Arapey', Georgia, serif" }} className="text-base md:text-lg leading-8 text-white/75 max-w-xl">
              Solusi all-in-one pernikahan impian Anda! Undangan digital, smart dashboard manajemen tamu, undangan fisik, dan souvenir.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="#katalog" style={{ fontFamily: "'Josefin Sans', sans-serif" }} className="rounded-full bg-white px-7 py-2.5 text-xs font-bold text-[#172a26] tracking-widest uppercase transition hover:bg-gray-200">
                Lihat Catalog
              </Link>
              <Link href="#pesan" style={{ fontFamily: "'Josefin Sans', sans-serif" }} className="rounded-full border border-white/40 bg-white/10 px-7 py-2.5 text-xs font-bold text-white tracking-widest uppercase backdrop-blur-sm transition hover:bg-white/20">
                Form Custom
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="breathing mt-4 flex flex-col items-center gap-1 text-white/40">
              <p style={{ fontFamily: "'Lato', sans-serif" }} className="text-xs tracking-widest">scroll down</p>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-4 fill-white/40 -rotate-90">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
              </svg>
            </div>
          </Reveal>
        </section>

        {/* Intro Section */}
        <section className="flex flex-col lg:flex-row items-center gap-10 w-full max-w-4xl">
          <Reveal className="w-full lg:w-1/2">
            <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
              <ParallaxImage
                src="/templates/landing page/dreamylove/www.dearmylove.org/_next/static/media/bg-1.15acb11c.jpg"
                alt="Ilustrasi Undangan"
              />
            </div>
          </Reveal>
          <Reveal delay={0.15} className="flex-1">
            <div className="flex flex-col gap-5 text-center lg:text-left">
              <h2 style={{ fontFamily: "'Josefin Sans', sans-serif" }} className="text-2xl md:text-3xl font-bold tracking-wide text-white uppercase">
                Undang orang terkasih dengan cara yang istimewa!
              </h2>
              <p style={{ fontFamily: "'Arapey', Georgia, serif" }} className="text-base leading-7 text-white/70">
                Kami mengubah cara Anda mengundang orang-orang tersayang ke momen terpenting hidup Anda. Bersama kami, undangan Anda bukan sekadar diperhatikan, tapi akan selalu dikenang juga.
              </p>
            </div>
          </Reveal>
        </section>

        {/* Text sections */}
        {[
          { title: 'All-in-One Solution', body: 'Sistem terintegrasi kami memungkinkan Anda mengirim undangan sekaligus mengelola RSVP dan interaksi tamu dalam satu tempat.' },
          { title: 'Mudah Digunakan, Dimana saja!', body: 'Dengan platform berbasis cloud kami, akses rencana pernikahan Anda kapan saja, di mana saja, tanpa khawatir kehilangan informasi.' },
          { title: 'Layanan Bantuan yang Cepat Tanggap!', body: 'Tim dedikasi kami siap mendampingi Anda di setiap langkah persiapan pernikahan. Kami siap membantu dengan pertanyaan atau permintaan khusus Anda.' },
        ].map((item, i) => (
          <Reveal key={i} delay={i * 0.1} className="text-center max-w-xl">
            <h2 style={{ fontFamily: "'Josefin Sans', sans-serif" }} className="text-2xl md:text-3xl font-bold tracking-wide text-white mb-4 uppercase">
              {item.title}
            </h2>
            <p style={{ fontFamily: "'Arapey', Georgia, serif" }} className="text-base leading-7 text-white/70">
              {item.body}
            </p>
          </Reveal>
        ))}

        {/* Smart Dashboard */}
        <section className="flex flex-col lg:flex-row items-center gap-10 w-full max-w-4xl">
          <Reveal className="w-full lg:w-1/2">
            <div className="relative h-64 md:h-72 w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
              <ParallaxImage
                src="/templates/landing page/dreamylove/www.dearmylove.org/_next/static/media/bg-2.22faaa9a.jpg"
                alt="Smart Dashboard"
              />
            </div>
          </Reveal>
          <Reveal delay={0.15} className="flex-1">
            <div className="text-center lg:text-left flex flex-col gap-5">
              <h2 style={{ fontFamily: "'Josefin Sans', sans-serif" }} className="text-2xl md:text-3xl font-bold tracking-wide text-white uppercase">Smart Dashboard</h2>
              <p style={{ fontFamily: "'Arapey', Georgia, serif" }} className="text-base leading-7 text-white/70">
                Solusi lengkap manajemen pernikahan Anda. Kirim undangan, lacak RSVP, kelola preferensi tamu, dan atur tempat duduk dengan mudah.
              </p>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {['Guest Management', 'WA Blast', 'Table Management'].map(tag => (
                  <span key={tag} style={{ fontFamily: "'Josefin Sans', sans-serif" }} className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-[#25332f] tracking-widest uppercase">{tag}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* E-Invitation */}
        <section className="flex flex-col lg:flex-row-reverse items-center gap-10 w-full max-w-4xl">
          <Reveal className="w-full lg:w-auto">
            <div className="relative h-72 w-44 md:h-[480px] md:w-64 mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
              <ParallaxImage
                src="/templates/landing page/dreamylove/www.dearmylove.org/_next/static/media/elgaze-1.f5a2b5ed.webp"
                alt="E-Invitation"
                speed={0.08}
              />
            </div>
          </Reveal>
          <Reveal delay={0.15} className="flex-1">
            <div className="text-center lg:text-left flex flex-col gap-5">
              <h2 style={{ fontFamily: "'Josefin Sans', sans-serif" }} className="text-2xl md:text-3xl font-bold tracking-wide text-white uppercase">E-Invitation</h2>
              <p style={{ fontFamily: "'Arapey', Georgia, serif" }} className="text-base leading-7 text-white/70">
                Setiap undangan digital kami rancang secara unik. Terintegrasi dengan dashboard pintar, undangan ini memudahkan pengiriman dan pengelolaan respons.
              </p>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {['Secure', 'Animated', 'Custom'].map(tag => (
                  <span key={tag} style={{ fontFamily: "'Josefin Sans', sans-serif" }} className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-[#25332f] tracking-widest uppercase">{tag}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* Pricing */}
        <section id="pricing" className="w-full max-w-5xl">
          <Reveal className="text-center mb-12">
            <h2 style={{ fontFamily: "'Josefin Sans', sans-serif" }} className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-[0.18em] uppercase">
              Pilih Paket Terbaik
            </h2>
            <p style={{ fontFamily: "'Lato', sans-serif" }} className="text-white/50 text-sm tracking-widest">Harga terjangkau, fitur lengkap untuk pernikahan impian Anda</p>
          </Reveal>
          <div className={`grid grid-cols-1 gap-6 ${pricingPackages.length === 3 ? 'md:grid-cols-3' : pricingPackages.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
            {pricingPackages.map((pkg: any, i: number) => (
              <PricingCard key={pkg.id || i} pkg={pkg} index={i} />
            ))}
          </div>
        </section>

        {/* Catalog & Order */}
        <div id="katalog" className="w-full bg-white/5 rounded-[40px] p-6 md:p-12 shadow-2xl backdrop-blur-sm mt-8">
          <CatalogSection />
          <div id="pesan" className="mt-20">
            <OrderFormSection />
          </div>
        </div>
      </div>

      {/* ── Floating Bottom Navbar (exact dearmylove.org style) ────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 3.2, ease: 'easeOut' }}
        className="fixed bottom-12 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-[#ededed] px-2 py-2 shadow-xl"
      >
        {/* WhatsApp */}
        <NavItem
          href={`https://api.whatsapp.com/send/?phone=${whatsappNumber}&text=Halo%20Admin!%0AAku%20mau%20tanya%20tanya%20mengenai%20e-invitation..%0A`}
          label="contact us"
          expandWidth="114px"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 0 21 21" className="w-[26px] fill-[#172a26]">
              <path d="M16.8 5.7C14.4 2 9.5.9 5.7 3.2 2 5.5.8 10.5 3.2 14.2l.2.3-.8 3 3-.8.3.2c1.3.7 2.7 1.1 4.1 1.1 1.5 0 3-.4 4.3-1.2 3.7-2.4 4.8-7.3 2.5-11.1zm-2.1 7.7c-.4.6-.9 1-1.6 1.1-.4 0-.9.2-2.9-.6-1.7-.8-3.1-2.1-4.1-3.6-.6-.7-.9-1.6-1-2.5 0-.8.3-1.5.8-2 .2-.2.4-.3.6-.3H7c.2 0 .4 0 .5.4.2.5.7 1.7.7 1.8.1.1.1.3 0 .4.1.2 0 .4-.1.5-.1.1-.2.3-.3.4-.2.1-.3.3-.2.5.4.6.9 1.2 1.4 1.7.6.5 1.2.9 1.9 1.2.2.1.4.1.5-.1s.6-.7.8-.9c.2-.2.3-.2.5-.1l1.6.8c.2.1.4.2.5.3.1.3.1.7-.1 1z"/>
            </svg>
          }
        />

        {/* Instagram */}
        <NavItem
          href={`https://instagram.com/${instagramUser.replace('@', '')}`}
          label="visit ig"
          expandWidth="92px"
          icon={
            <svg viewBox="-3 -3 29 29" xmlns="http://www.w3.org/2000/svg" className="w-[26px] fill-[#172a26]">
              <path fillRule="nonzero" d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
            </svg>
          }
        />

        {/* Login (dark) */}
        <NavItem
          href="/login"
          label="sign in"
          dark
          expandWidth="88px"
          icon={
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-[22px] fill-[#E7E9E4]">
              <path fillRule="evenodd" d="M11 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3h-6zm1.293 6.293a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1 0 1.414l-3 3a1 1 0 0 1-1.414-1.414L13.586 13H5a1 1 0 1 1 0-2h8.586l-1.293-1.293a1 1 0 0 1 0-1.414z" clipRule="evenodd"/>
            </svg>
          }
        />

        {/* Catalog */}
        <NavItem
          href="#katalog"
          label="catalog"
          expandWidth="98px"
          icon={
            <svg className="w-[26px] fill-[#172a26]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
              <path d="M61.8,29.4l8.9,8.9l0,0c2,1.9,2,5.1,0,7l0,0L47.5,68.4V36.6l7.2-7.2C56.6,27.4,59.9,27.4,61.8,29.4z M80,62.5V75c0,2.8-2.2,5-5,5H43.8l22.5-22.5H75C77.8,57.5,80,59.8,80,62.5z M20,68.8V25c0-2.8,2.2-5,5-5h12.5c2.8,0,5,2.2,5,5v43.8 c0,6.2-5,11.2-11.2,11.2S20,75,20,68.8z M31.2,73.8c2.8,0,5-2.2,5-5s-2.2-5-5-5s-5,2.2-5,5S28.5,73.8,31.2,73.8z"/>
            </svg>
          }
        />

        {/* Pricing */}
        <NavItem
          href="#pricing"
          label="see pricing"
          expandWidth="116px"
          icon={
            <svg viewBox="-3 -1 21 21" xmlns="http://www.w3.org/2000/svg" className="w-[26px] fill-[#172a26]">
              <path strokeLinecap="round" strokeLinejoin="round" d="m13.842 11.52-4.389 4.388a1.112 1.112 0 0 1-1.567 0l-6.28-6.28a3.027 3.027 0 0 1-.771-1.892l.043-3.681A1.141 1.141 0 0 1 2 2.935L5.67 2.9a3.04 3.04 0 0 1 1.892.773l6.28 6.28a1.112 1.112 0 0 1 0 1.567zM3.826 5.133a.792.792 0 1 0-.792.792.792.792 0 0 0 .792-.792z"/>
            </svg>
          }
        />
      </motion.div>
    </main>
  )
}
