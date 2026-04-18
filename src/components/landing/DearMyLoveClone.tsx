'use client'

import { useState, useEffect, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { CatalogSection } from './CatalogSection'
import { OrderFormSection } from './OrderFormSection'
import { CustomLandingContext } from '@/context/CustomLandingContext'
import { Check, Star, Crown, Sparkles } from 'lucide-react'

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
}

// ─── Rose SVG (exact path from dearmylove.org) ────────────────────────────────
const RoseSVG = ({ className = '' }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 2600 5800"
    stroke="#ededed"
    strokeWidth="50"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M1431 5750c0,-651 0,-1302 0,-1954 -205,-447 -746,-551 -950,-512 -613,115 -279,-290 49,302 269,394 572,437 901,210 0,-300 0,-600 0,-900 226,-16 504,-84 555,-264 166,-514 319,-435 246,-367 -67,62 -192,66 -277,71 -175,2 -284,8 -435,75 -368,163 -72,305 -97,-131 -8,-140 -56,-244 -99,-348 -218,-530 324,-205 -238,-118 -392,60 -193,218 -124,651 125,835 -303,115 -606,230 -909,345 -105,-237 -182,-488 -158,-748 16,-176 70,-349 181,-490 252,-323 686,-430 1079,-413 -37,-163 -88,-323 -142,-481 -230,-673 -576,-901 -793,-944 -236,-47 -307,46 -295,72 -15,-16 -21,-35 -22,-56 -8,-120 162,-291 450,-251 303,42 665,259 931,655 93,138 173,293 239,455 207,-264 499,-448 807,-453 124,-2 251,29 364,92 227,127 379,363 426,631 47,268 -9,573 -163,838 146,-28 291,-57 437,-85 75,-339 36,-758 -193,-1014 -112,-127 -262,-208 -428,-228 -176,-21 -370,24 -553,100 -1,-3 -2,-6 -3,-9 52,-99 139,-185 234,-237 256,-141 589,-94 808,93 231,196 333,511 321,826 297,-45 594,-90 891,-135 -29,-161 -90,-316 -178,-453 -268,-417 -737,-635 -1197,-668 158,-243 397,-434 672,-529 291,-100 628,-88 905,38 305,138 543,399 660,705 82,214 107,449 82,683 338,6 676,12 1014,18 -97,-346 -318,-661 -621,-865 -259,-173 -574,-255 -882,-236 88,-215 240,-406 434,-540 258,-178 581,-258 896,-220 306,36 601,181 822,402 169,169 291,379 360,606 137,443 76,939 -160,1342 -233,398 -619,683 -1049,793" />
  </svg>
)

// ─── Large Floral Background SVG (line-art botanical from dearmylove.org) ─────
const FloralBotanical = ({ className = '', mirrored = false }: { className?: string, mirrored?: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 800 900"
    stroke="white"
    strokeWidth="1.2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={mirrored ? { transform: 'scaleX(-1)' } : {}}
  >
    {/* Main hibiscus flower center */}
    <ellipse cx="320" cy="280" rx="60" ry="70" strokeWidth="1.5"/>
    <ellipse cx="320" cy="280" rx="30" ry="35"/>
    {/* Petals */}
    <path d="M320 210 Q280 150 250 100 Q310 130 320 210z"/>
    <path d="M320 210 Q360 150 390 100 Q330 130 320 210z"/>
    <path d="M260 300 Q190 280 150 250 Q200 300 260 300z"/>
    <path d="M380 300 Q450 280 490 250 Q440 300 380 300z"/>
    <path d="M290 360 Q260 420 240 480 Q300 420 290 360z"/>
    <path d="M350 360 Q380 420 400 480 Q340 420 350 360z"/>
    {/* Stamen lines */}
    <line x1="320" y1="270" x2="300" y2="240"/>
    <line x1="320" y1="270" x2="330" y2="238"/>
    <line x1="320" y1="270" x2="340" y2="242"/>
    <circle cx="300" cy="238" r="4" fill="white" fillOpacity="0.6"/>
    <circle cx="330" cy="236" r="4" fill="white" fillOpacity="0.6"/>
    <circle cx="341" cy="240" r="4" fill="white" fillOpacity="0.6"/>
    {/* Leaves and branches */}
    <path d="M230 450 Q140 500 80 580 Q120 520 200 480"/>
    <path d="M230 450 Q190 480 100 500"/>
    <path d="M200 500 Q130 560 90 630"/>
    <path d="M200 500 Q150 530 80 540"/>
    {/* Large leaf top left */}
    <path d="M80 200 Q30 160 10 80 Q60 140 100 180 Q130 130 180 100 Q150 160 120 200 Q110 240 80 200z" strokeWidth="1.2"/>
    <path d="M80 200 Q95 170 100 140"/>
    {/* Top branch with small leaves */}
    <path d="M160 60 Q220 20 300 10"/>
    <path d="M180 55 Q190 30 200 15"/>
    <path d="M220 40 Q230 20 245 10"/>
    <path d="M160 60 Q150 80 130 100"/>
    {/* Bottom botanical branch */}
    <path d="M50 700 Q150 650 250 680 Q350 700 400 750"/>
    <path d="M150 660 Q160 620 200 600"/>
    <path d="M200 600 Q240 580 260 550"/>
    <path d="M260 550 Q280 530 270 500"/>
    {/* Leaf cluster bottom */}
    <path d="M100 750 Q60 780 20 800"/>
    <path d="M80 760 Q50 790 10 820"/>
    <path d="M100 750 Q120 780 130 820"/>
    {/* Small botanical details */}
    <circle cx="400" cy="750" r="5" fill="white" fillOpacity="0.5"/>
    <circle cx="420" cy="730" r="3" fill="white" fillOpacity="0.4"/>
    <circle cx="440" cy="760" r="4" fill="white" fillOpacity="0.5"/>
    {/* Vine lines */}
    <path d="M400 400 Q450 380 500 400 Q480 430 440 430 Q400 420 400 400z"/>
    <path d="M430 410 Q460 390 490 410"/>
    {/* Extra leaf details right side */}
    <path d="M480 300 Q530 260 560 220 Q520 270 480 300z"/>
    <path d="M480 300 Q520 290 550 310"/>
    <path d="M500 350 Q560 330 600 350 Q560 380 500 350z"/>
    {/* Spiral stem */}
    <path d="M320 380 Q340 450 320 520 Q300 590 320 650 Q340 710 320 750 Q310 780 320 820"/>
  </svg>
)

// ─── Default pricing packages ─────────────────────────────────────────────────
const DEFAULT_PACKAGES = [
  {
    id: 1,
    name: 'Basic',
    price: '70.000',
    features: 'Masa aktif selamanya\nTanpa Batas Tamu\nGallery Foto Bebas',
    enabled: true
  },
  {
    id: 2,
    name: 'Premium',
    price: '100.000',
    features: 'Masa aktif selamanya\nTanpa Batas Tamu\nVideo Undangan Lengkap\nFilter Instagram',
    enabled: true
  },
  {
    id: 3,
    name: 'VIP',
    price: '150.000',
    features: 'Masa aktif selamanya\nBebas Custom\nCustom Domain Pilihan\nDesain Sesuai Keinginan\nPriority Support 24/7',
    enabled: true
  }
]

// ─── Pricing Card Component ───────────────────────────────────────────────────
function PricingCard({ pkg, index }: { pkg: any; index: number }) {
  const isHighlighted = index === 1
  const features = typeof pkg.features === 'string'
    ? pkg.features.split('\n').filter(Boolean)
    : (pkg.features || [])

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`relative flex flex-col rounded-3xl p-7 transition-all duration-300 ${
        isHighlighted
          ? 'bg-[#ededed] shadow-2xl shadow-black/40 border border-[#ededed]/20'
          : 'bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15'
      }`}
    >
      {isHighlighted && (
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#172a26] text-[#ededed] text-xs font-bold px-4 py-1.5 rounded-full tracking-widest uppercase"
        >
          ✦ Populer
        </motion.div>
      )}

      <div className="mb-5 text-center">
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-3 ${
          isHighlighted ? 'bg-[#172a26] text-white' : 'bg-white/20 text-white'
        }`}>
          {index === 0 ? <Sparkles className="w-5 h-5" /> : index === 1 ? <Crown className="w-5 h-5" /> : <Star className="w-5 h-5" />}
        </div>
        <h3 className={`text-xl font-bold tracking-wide ${isHighlighted ? 'text-[#172a26]' : 'text-white'}`}>
          {pkg.name}
        </h3>
      </div>

      <div className="text-center mb-6">
        <div className={`text-3xl font-bold ${isHighlighted ? 'text-[#172a26]' : 'text-white'}`}>
          Rp {pkg.price}
        </div>
        <div className={`text-sm mt-1 ${isHighlighted ? 'text-[#172a26]/60' : 'text-white/60'}`}>
          per undangan
        </div>
      </div>

      <ul className="space-y-3 flex-1 mb-7">
        {features.map((feat: string, i: number) => (
          <li key={i} className="flex items-start gap-2">
            <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isHighlighted ? 'text-[#172a26]' : 'text-[#ededed]/80'}`} />
            <span className={`text-sm ${isHighlighted ? 'text-[#172a26]/80' : 'text-white/80'}`}>{feat}</span>
          </li>
        ))}
      </ul>

      <motion.a
        href="#pesan"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className={`w-full py-3 rounded-full text-sm font-semibold text-center transition-all ${
          isHighlighted
            ? 'bg-[#172a26] text-white hover:bg-[#223e36]'
            : 'bg-white/15 text-white border border-white/30 hover:bg-white/25'
        }`}
      >
        {isHighlighted ? 'Pilih Paket Ini' : 'Mulai Sekarang'}
      </motion.a>
    </motion.div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function DearMyLoveClone() {
  const [isLoading, setIsLoading] = useState(true)
  const [rosePath, setRosePath] = useState(0)
  const ctx = useContext(CustomLandingContext)
  const config = ctx?.config || {}

  const whatsappNumber = config?.whatsappNumber || '6285299659458'
  const instagramUser = config?.socialMedia?.instagram?.url
    ? config.socialMedia.instagram.url.replace(/.*instagram\.com\//i, '@').replace(/\//g, '')
    : '@akainvitation'

  const pricingPackages = config?.pricingPackages?.filter((p: any) => p.enabled !== false) || DEFAULT_PACKAGES

  // Preloader
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2800)
    return () => clearTimeout(timer)
  }, [])

  // Animate rose path drawing
  useEffect(() => {
    if (!isLoading) return
    const interval = setInterval(() => {
      setRosePath(p => Math.min(p + 2, 100))
    }, 30)
    return () => clearInterval(interval)
  }, [isLoading])

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#172a26] to-[#1e3630] overflow-x-hidden font-sans">

      {/* ── Preloader ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.9, ease: 'easeInOut' } }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-[#172a26] to-[#1e3630]"
          >
            {/* Logo top */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute top-10 left-1/2 -translate-x-1/2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" viewBox="0 0 5000 650" className="w-[160px] fill-white">
                <path d="M157.66 639.12c-7.75,-0.59 -17.29,-1.19 -28.47,-1.63 -11.33,-0.6 -23.84,-0.75 -37.7,-0.75l-54.55 0.75c-9.99,0.59 -23.7,0.74 -41.43,0.74 -1.05,0 -1.64,-1.64 -1.64,-4.91 0,-3.28 0.59,-4.91 1.64,-4.91 21.46,0 37.4,-1.34 47.54,-4.17 10.13,-2.68 17.29,-8.04 21.01,-16.08 3.73,-8.04 5.82,-20.24 5.82,-36.76l0 -382.52c0,-16.52 -1.79,-28.58 -5.37,-36.32 -3.58,-7.74 -10.43,-13.09 -20.72,-16.07 -10.28,-2.98 -26.08,-4.62 -47.54,-4.62 -1.19,0 -1.64,-1.63 -1.64,-4.91 0,-3.27 0.6,-4.91 1.64,-4.91l40.54 0.74c23.1,1.2 41.28,1.64 54.55,1.64 19.22,0 38.9,-0.89 58.72,-2.53 24.3,-1.19 40.84,-1.64 49.63,-1.64 57.98,0 109.25,11.02 153.81,33.05 44.72,22.03 79.29,52.09 103.88,90.04 24.59,37.96 36.81,80.67 36.81,128.01 0,53.43 -12.82,100.61 -38.45,141.69 -25.64,41.08 -59.91,72.63 -102.99,94.95 -43.07,22.33 -90.16,33.49 -141.44,33.49 -15.94,0 -33.98,-0.89 -53.8,-2.53l0.15 0.16zm2535.59 -472c-11.51,15.11 -22.15,27.68 -31.91,37.69 0,0.59 -0.3,0.89 -0.89,0.89 -3.88,3.87 -7.46,7.45 -10.73,10.72 -33.24,30.37 -66.33,45.54 -99.56,45.54 -11.03,0 -20.72,-2.23 -29.06,-6.7 -8.35,-4.46 -14.61,-9.52 -19.08,-15.33 -4.47,-5.8 -8.35,-13.99 -11.63,-24.41 -3.27,-10.41 -5.36,-18.9 -6.25,-25.3 -0.9,-6.4 -2.09,-15.63 -3.73,-27.68 -3.28,-27.54 -7.6,-47.18 -12.81,-58.79 -5.22,-11.61 -15.05,-17.42 -29.51,-17.42 -22.06,0 -50.82,26.2 -86.29,78.73 -6.71,10.57 -16.1,25.61 -28.17,45.55 -7.16,11.01 -12.37,19.2 -15.8,24.41 -3.43,5.21 -6.86,10.42 -10.44,15.33 -3.57,4.91 -6.7,8.18 -9.08,9.52 -2.54,1.34 -5.07,2.08 -7.9,2.08l-0.9 0.01c-9.98,-0.59 -19.07,-4.17 -27.42,-10.71 -11.03,-9.98 -16.54,-24.86 -16.54,-44.65 0,-3.28 0.3,-12.21 0.9,-26.5 6.11,-81.12 3.57,-127.56 -7.46,-139.17 -1.04,-1.04 -2.23,-1.63 -3.28,-1.63 -7.15,0 -17.28,6.4 -30.25,19.05 -12.97,12.65 -23.7,25.6 -31.89,38.99 -0.6,0.6 -1.05,1.05 -1.64,1.64 -15.5,24.26 -30.11,51.35 -43.97,81.12 -13.85,29.77 -23.7,54.92 -29.81,75.31 -4.47,15.49 -11.92,23.23 -22.35,23.23 -1.05,0 -2.24,-0.3 -3.28,-0.9 -7.16,-1.63 -13.12,-6.7 -17.89,-15.33 -4.62,-8.48 -6.25,-17.26 -4.62,-26.04 6.71,-31.41 18.19,-70.41 34.88,-116.84 16.54,-46.44 31.15,-81.12 43.96,-104.34 5.52,-9.38 13.27,-11.61 23.26,-6.55 7.15,3.28 12.37,9.68 15.35,19.06 2.97,9.37 2.38,20.69 -2.09,33.93 -1.64,4.47 -5.22,13.25 -10.73,26.5 0,1.04 0,1.94 -0.44,2.53 -0.3,0.6 -0.6,1.19 -0.9,2.08 -0.3,0.89 -0.74,1.49 -1.19,2.08 1.63,-2.83 3.27,-5.2 4.91,-7.44l0.9 -0.89c0.6,-1.04 1.34,-2.53 2.53,-4.17l0.9 -1.64c33.68,-49.71 65.72,-74.57 96.13,-74.57 9.39,0 17.44,3.57 24,10.72 11.03,12.2 17.28,35.27 18.62,69.51 1.35,34.23 0.45,65.93 -2.83,95.25 -1.64,27.54 -2.53,45.84 -2.53,54.63 3.87,-6.11 11.32,-18.01 22.35,-35.58 12.22,-19.35 21.76,-34.53 29.06,-45.54l0 -0.9 1.64 -2.53c8.79,-13.25 16.24,-23.96 22.35,-32.3 6.12,-8.33 14.61,-18.6 25.79,-31.1 11.03,-12.36 23.1,-21.74 36.06,-28.14 12.97,-6.4 26.38,-9.52 40.25,-9.52 11.62,0 21.76,2.38 30.25,7 8.49,4.76 15.2,10.12 19.82,16.07 4.77,6.11 8.8,14.89 12.37,26.5 3.58,11.61 5.96,20.99 7.01,28.13 1.04,7.15 2.53,17.42 4.17,30.66 3.28,25.9 7.16,44.5 11.63,55.52 4.47,11.01 11.92,16.52 22.36,16.52 22.65,0 45,-9.97 67.21,-29.77 0.6,0 0.9,-0.3 0.9,-0.89 21.9,-20.36 48.38,-54.07 79.33,-100.88 8.21,-17.01 16.85,-32.23 25.86,-45.58 3.28,-4.91 7.9,-7.88 13.71,-8.63 5.81,-0.75 11.47,0.44 16.99,3.72 6.11,3.87 9.99,9.52 11.63,16.96 1.63,7.45 0,16.23 -4.92,26.05 -24.3,41.97 -36.52,77.25 -36.52,105.97 0,21.58 5.52,32.3 16.55,32.3 14.9,0 34.28,-10.27 58.12,-30.66 19.83,-17.72 49.78,-49.12 89.57,-94.37 40.99,-46.44 69.46,-76.21 85.4,-89.45 11.63,-12.21 22.06,-13.84 31.45,-4.91 5.52,4.47 8.8,11.01 9.99,19.94 1.04,8.78 -0.6,16.08 -4.92,21.58 -12.67,15.48 -25.63,34.38 -38.6,56.71 -12.97,22.33 -23.55,41.38 -31.45,57.16 -8.05,15.78 -18.63,38.25 -31.89,67.42 -19.97,41.38 -34.88,71.15 -44.72,89.45 0,1.2 -1.34,4.17 -4.17,9.08 33.69,2.83 75.12,8.49 124,17.42 48.88,8.78 90.91,17.26 126.08,25.3 23.64,5.4 54.4,12.55 92.34,21.53l37.64 -212.35c2.24,-14.29 3.28,-23.51 3.28,-27.38 0,-11.61 -3.28,-19.5 -9.99,-23.52 -6.56,-4.17 -18.18,-6.25 -34.87,-6.25 -1.05,0 -1.64,-1.63 -1.64,-4.91 0,-3.27 0.59,-4.91 1.64,-4.91l37.26 0.74c22.06,1.2 39.79,1.64 53.06,1.64 13.26,0 31.44,-0.6 54.69,-1.64l39.05 -0.74c1.04,0 1.64,1.64 1.64,4.91 0,3.28 -0.6,4.91 -1.64,4.91 -15.5,0 -26.98,1.49 -34.43,4.62 -7.45,3.12 -13.11,8.63 -16.99,16.52 -3.87,8.04 -7.15,20.24 -9.99,36.91l-40.76 229.99c61.85,14.53 110.06,25.66 144.48,33.17 36.77,8.16 83.39,17.6 139.72,28.75 -1.82,-12.91 -2.74,-26.31 -2.74,-40.21 0,-16.52 1.94,-36.92 5.82,-61.33 8.79,-50.75 27.27,-96.44 55.14,-137.08 27.88,-40.48 62.6,-72.48 104.03,-95.7 41.43,-23.22 85.4,-34.83 131.9,-34.83 39.79,0 74.22,8.78 103.29,26.49 29.06,17.72 51.27,42.13 66.76,73.24 15.51,31.25 23.26,66.97 23.26,107.31 0,20.99 -1.94,41.08 -5.82,60.43 -6.63,38.27 -18.39,73.12 -35.23,104.72 16.49,-6.44 32.31,-13.96 47.44,-22.56 53.82,-30.6 95.92,-73.16 126.43,-127.53l-34.92 -143.95c-5.51,-22.03 -11.92,-37.36 -19.08,-46l-0.14 -0.15c-7.16,-8.49 -17.74,-12.8 -31.45,-12.8 -1.64,0 -2.54,-1.64 -2.54,-4.91 0,-3.28 0.75,-4.91 2.54,-4.91l39.79 0.74c17.74,1.19 30.7,1.64 39.05,1.64 19.38,0 41.14,-0.6 65.42,-1.64l37.27 -0.74c1.64,0 2.53,1.63 2.53,4.91 0,3.27 -0.89,4.91 -2.53,4.91 -15.51,0 -27.42,2.53 -35.63,7.44 -8.2,4.91 -12.52,13.55 -12.52,25.75 0,4.91 0.9,10.72 2.54,17.42l87.04 363.61 -57.98 81.12 208.21 -409.16c8.34,-16.52 12.37,-30.66 12.37,-42.27 0,-13.84 -4.92,-24.56 -14.91,-32.29 -9.99,-7.75 -23.25,-11.62 -39.79,-11.62 -1.64,0 -2.53,-1.63 -2.53,-4.91 0,-3.27 0.89,-4.91 2.53,-4.91l39.05 0.74c21.01,1.2 40.84,1.64 59.76,1.64 10.44,0 22.96,-0.59 37.26,-1.64l35.63 -0.74c2.23,0 3.28,1.64 3.28,4.91 0,3.28 -1.05,4.91 -3.28,4.91 -18.78,0 -35.92,5.81 -51.42,17.42 -15.5,11.61 -32.64,35.28 -51.42,71.3l-218.04 418.24c-1.64,2.82 -5.22,4.16 -10.73,4.16 -6.71,0 -10.59,-1.34 -11.63,-4.16l-67.44 -278.07c-30.7,49.2 -71.47,88.31 -122.43,117.17 -22.7,12.88 -46.87,23.5 -72.5,31.84 -2.85,4.34 -5.81,8.61 -8.87,12.81 -29.8,40.93 -65.72,72.18 -107.45,94.06 -41.73,21.89 -84.65,32.75 -128.91,32.75 -39.35,0 -73.18,-8.93 -101.65,-26.94l-0.01 0.14c-28.47,-17.86 -50.22,-42.72 -65.13,-74.12 -6.9,-14.54 -12.21,-30.01 -15.91,-46.38l-2.57 -0.5c-57.97,-11.31 -106.27,-21.29 -144.72,-29.77 -35.03,-7.86 -82.92,-18.94 -143.91,-33.34l-23.16 130.67c-1.64,10.42 -2.54,19.36 -2.54,26.5 0,10.42 2.38,17.56 7.01,21.13 4.77,3.58 13.11,5.37 25.34,5.37l21.61 -0.01c40.84,0 76.75,-10.12 107.75,-30.21 31,-20.1 58.87,-51.51 83.76,-93.92 0.6,-0.59 1.64,-0.74 3.28,-0.74 4.47,0 6.41,1.04 5.81,3.28 -13.86,51.34 -23.54,93.61 -29.06,126.65 -1.19,4.47 -2.68,7.59 -4.62,9.53 -1.93,1.93 -4.77,2.83 -8.64,2.83l-353.22 0c-1.19,0 -1.64,-1.64 -1.64,-4.91l0.29 -0.16c0,-3.27 0.6,-4.91 1.64,-4.91 15.51,0 26.98,-1.34 34.43,-4.17 7.45,-2.83 12.97,-8.03 16.55,-15.78 3.57,-7.74 7,-20.24 10.43,-37.21l26.98 -152.23c-39.94,-9.31 -72.15,-16.77 -96.58,-22.49 -35.63,-8.34 -78.4,-16.82 -128.17,-25.6 -49.78,-8.78 -91.51,-14.59 -125.2,-17.42 -33.68,58.05 -71.39,110.3 -113.12,156.88 -41.72,46.58 -83.16,83.05 -124.44,109.24 -41.14,26.2 -77.8,39.3 -109.85,39.3 -15.5,0 -28.46,-1.94 -38.9,-5.81 -10.58,-3.87 -18.03,-8.93 -22.8,-15.33 -4.77,-6.4 -8.05,-12.35 -9.99,-17.86 -1.93,-5.51 -2.83,-11.61 -2.83,-18.16l0 -5.81c1.64,-27.68 11.47,-56.41 29.36,-86.46 18.03,-30.07 41.88,-57.6 71.68,-82.46 35.92,-29.32 77.2,-52.09 124,-68.32 46.65,-16.22 95.83,-24.71 147.25,-25.3 3.88,-7.15 8.35,-14.89 13.27,-23.22 9.39,-17.12 23.99,-46.88 43.96,-89.45 21.61,-46.88 38.75,-81.71 51.42,-104.33 -2.24,2.23 -3.88,3.87 -4.92,4.91 -21.01,23.81 -37.11,41.67 -48.14,53.88 -11.03,12.2 -25.33,26.34 -42.77,42.72 -17.44,16.22 -32.94,28.13 -46.5,35.57 -13.57,7.45 -26.38,11.16 -38.61,11.16 -36.96,0 -55.59,-23.21 -55.59,-69.5 0,-7.77 0.76,-15.86 2.27,-24.31zm1245.9 355.26c-22.56,3.21 -46.05,4.96 -70.45,5.27 -39.2,0.59 -81.83,-1.64 -127.73,-6.55 -16.85,-1.8 -34.52,-4.04 -53.01,-6.72 5.32,17.4 12.15,33.44 20.53,48.09 22.95,40.33 55.44,60.43 97.47,60.43 39.2,0 73.92,-18.31 104.03,-55.07l-0.01 0.15c11.05,-13.49 20.77,-28.68 29.17,-45.6zm-256.54 -28.18c21.13,3.18 41.16,5.8 60.13,7.85 45.31,4.91 87.34,7.14 126.09,6.7 27.73,-0.21 54.19,-2.39 79.39,-6.55 9.94,-24.49 17.5,-52.1 22.71,-82.91 4.48,-24.26 6.71,-51.05 6.71,-80.38 0,-61.32 -11.62,-111.77 -34.87,-151.52 -23.25,-39.74 -55.59,-59.68 -97.02,-59.68 -41.43,0 -74.67,18.3 -104.48,55.07 -29.8,36.76 -50.07,86.33 -60.5,148.69 -4.48,29.32 -6.71,55.82 -6.71,79.48 0,30.28 2.85,58.04 8.55,83.25zm-1192.06 132.12c38.15,0 87.48,-25.6 147.99,-76.65 60.51,-51.05 116.7,-118.03 168.71,-200.78 -33.68,1.04 -66.17,5.8 -97.47,14.14 -31.15,8.34 -59.02,18.9 -83.31,31.85 -24.3,12.95 -46.65,27.54 -67.22,43.91 -20.42,16.22 -37.26,33.34 -50.52,51.35 -13.27,17.86 -23.7,35.87 -31.45,53.87 -7.75,17.86 -11.63,35.13 -11.63,51.8 0.6,20.39 8.8,30.66 24.9,30.66l0 -0.15zm2081.6 3.27c0,-3.27 0.75,-4.91 2.54,-4.91 15.5,0 26.97,-1.34 34.43,-4.17 7.45,-2.83 12.96,-8.03 16.54,-15.78 3.58,-7.74 7.01,-20.24 10.43,-37.21l67.22 -383.41c2.24,-10.42 3.28,-19.94 3.28,-28.13 0,-11.61 -3.13,-19.35 -9.54,-23.22 -6.41,-3.87 -17.88,-5.8 -34.43,-5.8 -1.04,0 -1.64,-1.64 -1.64,-4.91 0,-3.28 0.6,-4.91 1.64,-4.91l325.95 0c4.47,0 6.11,2.53 4.91,7.44l-17.44 110.89c0,1.63 -1.04,2.53 -3.27,2.53 -1.64,0 -3.14,-0.45 -4.62,-1.19 -1.34,-0.9 -2.09,-1.49 -2.09,-2.09 -2.23,-30.36 -12.96,-54.62 -32.34,-72.93 -19.37,-18.16 -44.26,-27.38 -74.67,-27.38l-14.9 0c-16.1,0 -27.72,1.19 -34.87,3.71 -7.16,2.54 -12.37,7 -15.35,13.7 -2.98,6.7 -5.96,17.71 -8.65,33.19l-67.22 379.24c-1.64,9.97 -2.53,18.16 -2.53,24.86 0,11.01 2.98,18.45 9.09,22.32 6.11,3.87 17.14,5.81 33.23,5.81l21.62 0c32.04,0 63.64,-10.27 94.49,-31.11 30.85,-20.84 56.63,-48.37 77.05,-83.19 0.6,-1.64 2.54,-2.09 5.82,-1.2 3.27,0.75 4.47,1.79 3.27,2.83 -8.79,28.72 -18.18,67.87 -28.17,117.58 -1.04,4.91 -2.53,8.34 -4.17,9.97 -1.64,1.64 -4.77,2.54 -9.09,2.54l-344.13 0c-1.64,0 -2.53,-1.64 -2.53,-4.91l0.14 -0.16z"/>
              </svg>
            </motion.div>

            {/* Animated Rose */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-[80px] h-[180px]"
            >
              <RoseSVG className="w-full h-full" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Fixed Top Logo ─────────────────────────────────────────────────── */}
      <div className="fixed left-0 top-0 z-50 flex h-14 w-full items-end justify-center px-3 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" viewBox="0 0 5000 650" className="mb-3 w-[160px] fill-white md:mb-0 md:w-[200px]">
          <path d="M157.66 639.12c-7.75,-0.59 -17.29,-1.19 -28.47,-1.63 -11.33,-0.6 -23.84,-0.75 -37.7,-0.75l-54.55 0.75c-9.99,0.59 -23.7,0.74 -41.43,0.74 -1.05,0 -1.64,-1.64 -1.64,-4.91 0,-3.28 0.59,-4.91 1.64,-4.91 21.46,0 37.4,-1.34 47.54,-4.17 10.13,-2.68 17.29,-8.04 21.01,-16.08 3.73,-8.04 5.82,-20.24 5.82,-36.76l0 -382.52c0,-16.52 -1.79,-28.58 -5.37,-36.32 -3.58,-7.74 -10.43,-13.09 -20.72,-16.07 -10.28,-2.98 -26.08,-4.62 -47.54,-4.62 -1.19,0 -1.64,-1.63 -1.64,-4.91 0,-3.27 0.6,-4.91 1.64,-4.91l40.54 0.74c23.1,1.2 41.28,1.64 54.55,1.64 19.22,0 38.9,-0.89 58.72,-2.53 24.3,-1.19 40.84,-1.64 49.63,-1.64 57.98,0 109.25,11.02 153.81,33.05 44.72,22.03 79.29,52.09 103.88,90.04 24.59,37.96 36.81,80.67 36.81,128.01 0,53.43 -12.82,100.61 -38.45,141.69 -25.64,41.08 -59.91,72.63 -102.99,94.95 -43.07,22.33 -90.16,33.49 -141.44,33.49 -15.94,0 -33.98,-0.89 -53.8,-2.53l0.15 0.16zm2535.59 -472c-11.51,15.11 -22.15,27.68 -31.91,37.69 0,0.59 -0.3,0.89 -0.89,0.89 -3.88,3.87 -7.46,7.45 -10.73,10.72 -33.24,30.37 -66.33,45.54 -99.56,45.54 -11.03,0 -20.72,-2.23 -29.06,-6.7 -8.35,-4.46 -14.61,-9.52 -19.08,-15.33 -4.47,-5.8 -8.35,-13.99 -11.63,-24.41 -3.27,-10.41 -5.36,-18.9 -6.25,-25.3 -0.9,-6.4 -2.09,-15.63 -3.73,-27.68 -3.28,-27.54 -7.6,-47.18 -12.81,-58.79 -5.22,-11.61 -15.05,-17.42 -29.51,-17.42 -22.06,0 -50.82,26.2 -86.29,78.73 -6.71,10.57 -16.1,25.61 -28.17,45.55 -7.16,11.01 -12.37,19.2 -15.8,24.41 -3.43,5.21 -6.86,10.42 -10.44,15.33 -3.57,4.91 -6.7,8.18 -9.08,9.52 -2.54,1.34 -5.07,2.08 -7.9,2.08l-0.9 0.01c-9.98,-0.59 -19.07,-4.17 -27.42,-10.71 -11.03,-9.98 -16.54,-24.86 -16.54,-44.65 0,-3.28 0.3,-12.21 0.9,-26.5 6.11,-81.12 3.57,-127.56 -7.46,-139.17 -1.04,-1.04 -2.23,-1.63 -3.28,-1.63 -7.15,0 -17.28,6.4 -30.25,19.05 -12.97,12.65 -23.7,25.6 -31.89,38.99 -0.6,0.6 -1.05,1.05 -1.64,1.64 -15.5,24.26 -30.11,51.35 -43.97,81.12 -13.85,29.77 -23.7,54.92 -29.81,75.31 -4.47,15.49 -11.92,23.23 -22.35,23.23 -1.05,0 -2.24,-0.3 -3.28,-0.9 -7.16,-1.63 -13.12,-6.7 -17.89,-15.33 -4.62,-8.48 -6.25,-17.26 -4.62,-26.04 6.71,-31.41 18.19,-70.41 34.88,-116.84 16.54,-46.44 31.15,-81.12 43.96,-104.34 5.52,-9.38 13.27,-11.61 23.26,-6.55 7.15,3.28 12.37,9.68 15.35,19.06 2.97,9.37 2.38,20.69 -2.09,33.93 -1.64,4.47 -5.22,13.25 -10.73,26.5 0,1.04 0,1.94 -0.44,2.53 -0.3,0.6 -0.6,1.19 -0.9,2.08 -0.3,0.89 -0.74,1.49 -1.19,2.08 1.63,-2.83 3.27,-5.2 4.91,-7.44l0.9 -0.89c0.6,-1.04 1.34,-2.53 2.53,-4.17l0.9 -1.64c33.68,-49.71 65.72,-74.57 96.13,-74.57 9.39,0 17.44,3.57 24,10.72 11.03,12.2 17.28,35.27 18.62,69.51 1.35,34.23 0.45,65.93 -2.83,95.25 -1.64,27.54 -2.53,45.84 -2.53,54.63 3.87,-6.11 11.32,-18.01 22.35,-35.58 12.22,-19.35 21.76,-34.53 29.06,-45.54l0 -0.9 1.64 -2.53c8.79,-13.25 16.24,-23.96 22.35,-32.3 6.12,-8.33 14.61,-18.6 25.79,-31.1 11.03,-12.36 23.1,-21.74 36.06,-28.14 12.97,-6.4 26.38,-9.52 40.25,-9.52 11.62,0 21.76,2.38 30.25,7 8.49,4.76 15.2,10.12 19.82,16.07 4.77,6.11 8.8,14.89 12.37,26.5 3.58,11.61 5.96,20.99 7.01,28.13 1.04,7.15 2.53,17.42 4.17,30.66 3.28,25.9 7.16,44.5 11.63,55.52 4.47,11.01 11.92,16.52 22.36,16.52 22.65,0 45,-9.97 67.21,-29.77 0.6,0 0.9,-0.3 0.9,-0.89 21.9,-20.36 48.38,-54.07 79.33,-100.88 8.21,-17.01 16.85,-32.23 25.86,-45.58 3.28,-4.91 7.9,-7.88 13.71,-8.63 5.81,-0.75 11.47,0.44 16.99,3.72 6.11,3.87 9.99,9.52 11.63,16.96 1.63,7.45 0,16.23 -4.92,26.05 -24.3,41.97 -36.52,77.25 -36.52,105.97 0,21.58 5.52,32.3 16.55,32.3 14.9,0 34.28,-10.27 58.12,-30.66 19.83,-17.72 49.78,-49.12 89.57,-94.37 40.99,-46.44 69.46,-76.21 85.4,-89.45 11.63,-12.21 22.06,-13.84 31.45,-4.91 5.52,4.47 8.8,11.01 9.99,19.94 1.04,8.78 -0.6,16.08 -4.92,21.58 -12.67,15.48 -25.63,34.38 -38.6,56.71 -12.97,22.33 -23.55,41.38 -31.45,57.16 -8.05,15.78 -18.63,38.25 -31.89,67.42 -19.97,41.38 -34.88,71.15 -44.72,89.45 0,1.2 -1.34,4.17 -4.17,9.08 33.69,2.83 75.12,8.49 124,17.42 48.88,8.78 90.91,17.26 126.08,25.3 23.64,5.4 54.4,12.55 92.34,21.53l37.64 -212.35c2.24,-14.29 3.28,-23.51 3.28,-27.38 0,-11.61 -3.28,-19.5 -9.99,-23.52 -6.56,-4.17 -18.18,-6.25 -34.87,-6.25 -1.05,0 -1.64,-1.63 -1.64,-4.91 0,-3.27 0.59,-4.91 1.64,-4.91l37.26 0.74c22.06,1.2 39.79,1.64 53.06,1.64 13.26,0 31.44,-0.6 54.69,-1.64l39.05 -0.74c1.04,0 1.64,1.64 1.64,4.91 0,3.28 -0.6,4.91 -1.64,4.91 -15.5,0 -26.98,1.49 -34.43,4.62 -7.45,3.12 -13.11,8.63 -16.99,16.52 -3.87,8.04 -7.15,20.24 -9.99,36.91l-40.76 229.99c61.85,14.53 110.06,25.66 144.48,33.17 36.77,8.16 83.39,17.6 139.72,28.75z"/>
        </svg>
      </div>

      {/* ── Background Large Floral Frames ─────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Left botanical */}
        <motion.div
          animate={{ rotate: [-1.5, 1.5, -1.5], y: [-6, 6, -6] }}
          transition={{ repeat: Infinity, duration: 11, ease: 'easeInOut' }}
          className="absolute -left-16 -top-8 opacity-[0.18] w-[420px] h-[520px]"
        >
          <FloralBotanical className="w-full h-full" />
        </motion.div>

        {/* Right botanical (large, mirrored) */}
        <motion.div
          animate={{ rotate: [1.5, -1.5, 1.5], y: [6, -6, 6] }}
          transition={{ repeat: Infinity, duration: 13, ease: 'easeInOut' }}
          className="absolute -right-16 -top-8 opacity-[0.18] w-[420px] h-[520px]"
        >
          <FloralBotanical className="w-full h-full" mirrored />
        </motion.div>

        {/* Bottom left small botanical */}
        <motion.div
          animate={{ rotate: [-2, 2, -2], y: [-4, 4, -4] }}
          transition={{ repeat: Infinity, duration: 15, ease: 'easeInOut' }}
          className="absolute -left-10 bottom-20 opacity-[0.12] w-[280px] h-[360px]"
        >
          <FloralBotanical className="w-full h-full" />
        </motion.div>

        {/* Bottom right small botanical */}
        <motion.div
          animate={{ rotate: [2, -2, 2], y: [4, -4, 4] }}
          transition={{ repeat: Infinity, duration: 17, ease: 'easeInOut' }}
          className="absolute -right-10 bottom-20 opacity-[0.12] w-[280px] h-[360px]"
        >
          <FloralBotanical className="w-full h-full" mirrored />
        </motion.div>
      </div>

      {/* ── Page Content ───────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center justify-center pt-32 pb-40 px-6 gap-24 relative z-10 w-full">

        {/* Hero Section */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="flex flex-col items-center justify-center gap-8 text-center"
        >
          <motion.h1 variants={fadeInUp} className="max-w-80 font-bold mb-4 leading-tight tracking-[0.1em] text-white text-4xl md:max-w-xl lg:text-5xl lg:leading-[62px]">
            YOUR ONE STOP WEDDING KIT
          </motion.h1>
          <motion.p variants={fadeInUp} className="max-w-80 leading-7 text-white/80 text-base md:max-w-xl md:text-lg">
            Solusi all-in-one pernikahan impian Anda! Undangan digital, smart dashboard manajemen tamu, undangan fisik, dan souvenir.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-4 mt-4">
            <Link href="#katalog" className="rounded-full bg-white px-6 py-[10px] text-sm font-semibold text-[#172a26] transition-all hover:bg-gray-200">
              LIHAT CATALOG
            </Link>
            <Link href="#pesan" className="rounded-full border border-white bg-[#21302c] px-6 py-[10px] text-sm font-semibold text-white transition-all hover:bg-white/20">
              FORM CUSTOM
            </Link>
          </motion.div>
          <motion.div variants={fadeInUp} className="flex flex-col items-center gap-1 mt-2 text-white/40 text-xs tracking-widest">
            <span>scroll down</span>
            <motion.span
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-lg"
            >↓</motion.span>
          </motion.div>
        </motion.div>

        {/* Intro Section */}
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="flex flex-col lg:flex-row items-center justify-center gap-10 mt-16"
        >
          <motion.div variants={fadeInUp} className="relative h-48 w-72 md:h-72 md:w-[400px] overflow-hidden rounded-xl lg:rounded-2xl shadow-2xl shadow-[#172723]">
            <Image
              src="/templates/landing page/dreamylove/www.dearmylove.org/_next/static/media/bg-1.15acb11c.jpg"
              alt="Ilustrasi Undangan"
              fill
              className="absolute -z-20 object-cover brightness-90"
            />
          </motion.div>
          <motion.div variants={fadeInUp} className="flex w-max max-w-md flex-col items-center gap-4 md:items-start text-center md:text-left text-white">
            <h2 className="text-2xl font-bold md:text-4xl">Undang orang terkasih dengan cara yang istimewa!</h2>
            <p className="text-base leading-relaxed text-gray-200">Kami mengubah cara Anda mengundang orang-orang tersayang ke momen terpenting hidup Anda. Bersama kami, undangan Anda bukan sekadar diperhatikan, tapi akan selalu dikenang juga.</p>
          </motion.div>
        </motion.section>

        {/* All-in-One Text Sections */}
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="flex flex-col items-center justify-center gap-24 py-16 text-center text-white"
        >
          {[
            { title: 'All-in-One Solution', body: 'Kami paham bahwa pengelolaan pernikahan bisa menjadi rumit. Sistem terintegrasi kami memungkinkan Anda mengirim undangan sekaligus mengelola RSVP dan interaksi tamu dalam satu tempat.' },
            { title: 'Mudah Digunakan, Dimana saja!', body: 'Dengan platform berbasis cloud kami, akses rencana pernikahan Anda kapan saja, di mana saja, tanpa khawatir kehilangan informasi.' },
            { title: 'Layanan Bantuan yang Cepat Tanggap!', body: 'Tenang saja, tim dedikasi kami siap mendampingi Anda di setiap langkah persiapan pernikahan. Kami siap membantu dengan pertanyaan atau permintaan khusus Anda.' }
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="flex flex-col items-center gap-4">
              <h2 className="text-3xl font-bold md:text-4xl">{item.title}</h2>
              <p className="max-w-xl text-gray-200 leading-relaxed text-base md:text-lg">{item.body}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* Smart Dashboard Section */}
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="flex flex-col lg:flex-row items-center justify-center gap-10"
        >
          <motion.div variants={fadeInUp} className="relative h-40 w-72 md:h-[270px] md:w-[496px] overflow-hidden rounded-xl lg:rounded-2xl shadow-2xl shadow-[#172723]">
            <Image
              src="/templates/landing page/dreamylove/www.dearmylove.org/_next/static/media/bg-2.22faaa9a.jpg"
              alt="Smart Dashboard"
              fill
              className="absolute -z-20 object-cover brightness-90"
            />
          </motion.div>
          <motion.div variants={fadeInUp} className="flex w-max max-w-md flex-col items-center gap-4 md:items-start text-center lg:text-left text-white">
            <h2 className="text-2xl font-bold md:text-4xl">Smart Dashboard</h2>
            <p className="text-base leading-relaxed text-gray-200">adalah solusi lengkap manajemen pernikahan Anda. Kirim undangan, lacak undangan fisik, lacak RSVP, kelola preferensi tamu, dan atur tempat duduk dengan mudah.</p>
            <div className="mt-4 hidden flex-wrap items-center gap-2 self-start lg:flex">
              {['Guest Management', 'WA Blast', 'Table Management'].map(tag => (
                <span key={tag} className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#25332f]">{tag}</span>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* E-Invitation Section */}
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="flex flex-col lg:flex-row items-center justify-center gap-10"
        >
          <motion.div variants={fadeInUp} className="relative h-60 w-36 md:h-[500px] md:w-72 overflow-hidden rounded-xl lg:rounded-2xl shadow-2xl shadow-[#172723]">
            <Image
              src="/templates/landing page/dreamylove/www.dearmylove.org/_next/static/media/elgaze-1.f5a2b5ed.webp"
              alt="E-Invitation"
              fill
              className="absolute -z-20 object-cover brightness-90"
            />
          </motion.div>
          <motion.div variants={fadeInUp} className="flex w-max max-w-md flex-col items-center gap-4 md:items-start text-center lg:text-left text-white">
            <h2 className="text-2xl font-bold md:text-4xl">E-Invitation</h2>
            <p className="text-base leading-relaxed text-gray-200">Setiap undangan digital kami rancang secara unik. Terintegrasi dengan dashboard pintar, undangan ini memudahkan pengiriman dan pengelolaan respons.</p>
            <div className="mt-4 hidden flex-wrap items-center gap-2 self-start lg:flex">
              {['Secure', 'Animated', 'Custom'].map(tag => (
                <span key={tag} className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#25332f]">{tag}</span>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* ── Pricing Section ──────────────────────────────────────────────── */}
        <motion.section
          id="pricing"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="w-full max-w-5xl"
        >
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-wide">PILIH PAKET TERBAIK</h2>
            <p className="text-white/60 text-base">Harga terjangkau, fitur lengkap untuk pernikahan impian Anda</p>
          </motion.div>
          <div className={`grid grid-cols-1 gap-6 ${pricingPackages.length === 3 ? 'md:grid-cols-3' : pricingPackages.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
            {pricingPackages.map((pkg: any, i: number) => (
              <PricingCard key={pkg.id || i} pkg={pkg} index={i} />
            ))}
          </div>
        </motion.section>

        {/* ── Catalog & Order Form ─────────────────────────────────────────── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="w-full bg-white/5 rounded-[40px] p-6 md:p-12 shadow-2xl backdrop-blur-sm mt-12"
          id="katalog"
        >
          <CatalogSection />
          <div id="pesan" className="mt-20">
            <OrderFormSection />
          </div>
        </motion.div>
      </div>

      {/* ── Floating Bottom Navbar ─────────────────────────────────────────── */}
      <div className="fixed bottom-10 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#ededed] shadow-lg px-2 py-2">
        {/* WhatsApp */}
        <motion.a
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.92 }}
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-gray-300"
          title={`WhatsApp: +${whatsappNumber}`}
        >
          <svg viewBox="-2 0 21 21" className="w-[22px] fill-[#172a26] transition-all group-hover:fill-[#25332f]" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.8 5.7C14.4 2 9.5.9 5.7 3.2 2 5.5.8 10.5 3.2 14.2l.2.3-.8 3 3-.8.3.2c1.3.7 2.7 1.1 4.1 1.1 1.5 0 3-.4 4.3-1.2 3.7-2.4 4.8-7.3 2.5-11.1zm-2.1 7.7c-.4.6-.9 1-1.6 1.1-.4 0-.9.2-2.9-.6-1.7-.8-3.1-2.1-4.1-3.6-.6-.7-.9-1.6-1-2.5 0-.8.3-1.5.8-2 .2-.2.4-.3.6-.3H7c.2 0 .4 0 .5.4.2.5.7 1.7.7 1.8.1.1.1.3 0 .4.1.2 0 .4-.1.5-.1.1-.2.3-.3.4-.2.1-.3.3-.2.5.4.6.9 1.2 1.4 1.7.6.5 1.2.9 1.9 1.2.2.1.4.1.5-.1s.6-.7.8-.9c.2-.2.3-.2.5-.1l1.6.8c.2.1.4.2.5.3.1.3.1.7-.1 1z"/>
          </svg>
        </motion.a>

        {/* Instagram */}
        <motion.a
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.92 }}
          href={`https://instagram.com/${instagramUser.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-gray-300"
          title={`Instagram: ${instagramUser}`}
        >
          <svg viewBox="-3 -3 29 29" className="w-[26px] fill-[#172a26] transition-all group-hover:fill-[#25332f]" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="nonzero" d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
          </svg>
        </motion.a>

        {/* Login (dark button, center) */}
        <motion.a
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          href="/login"
          className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-[#172a26] transition-all hover:bg-[#223e36]"
          title="Login Member"
        >
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="20" className="fill-[#E7E9E4] transition-all">
            <path fillRule="evenodd" d="M11 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3h-6zm1.293 6.293a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1 0 1.414l-3 3a1 1 0 0 1-1.414-1.414L13.586 13H5a1 1 0 1 1 0-2h8.586l-1.293-1.293a1 1 0 0 1 0-1.414z" clipRule="evenodd"/>
          </svg>
        </motion.a>

        {/* Catalog */}
        <motion.a
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.92 }}
          href="#katalog"
          className="group relative flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-gray-300"
          title="Lihat Katalog"
        >
          <svg width="26" className="fill-[#172a26] transition-all group-hover:fill-[#25332f]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <path d="M61.8,29.4l8.9,8.9l0,0c2,1.9,2,5.1,0,7l0,0L47.5,68.4V36.6l7.2-7.2C56.6,27.4,59.9,27.4,61.8,29.4z M80,62.5V75c0,2.8-2.2,5-5,5H43.8l22.5-22.5H75C77.8,57.5,80,59.8,80,62.5z M20,68.8V25c0-2.8,2.2-5,5-5h12.5c2.8,0,5,2.2,5,5v43.8 c0,6.2-5,11.2-11.2,11.2S20,75,20,68.8z M31.2,73.8c2.8,0,5-2.2,5-5s-2.2-5-5-5s-5,2.2-5,5S28.5,73.8,31.2,73.8z"/>
          </svg>
        </motion.a>

        {/* Pricing */}
        <motion.a
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.92 }}
          href="#pricing"
          className="group relative flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-gray-300"
          title="Harga"
        >
          <svg viewBox="-3 -1 21 21" xmlns="http://www.w3.org/2000/svg" width="26" className="fill-[#172a26] transition-all group-hover:fill-[#25332f]">
            <path strokeLinecap="round" strokeLinejoin="round" d="m13.842 11.52-4.389 4.388a1.112 1.112 0 0 1-1.567 0l-6.28-6.28a3.027 3.027 0 0 1-.771-1.892l.043-3.681A1.141 1.141 0 0 1 2 2.935L5.67 2.9a3.04 3.04 0 0 1 1.892.773l6.28 6.28a1.112 1.112 0 0 1 0 1.567zM3.826 5.133a.792.792 0 1 0-.792.792.792.792 0 0 0 .792-.792z"/>
          </svg>
        </motion.a>
      </div>

    </main>
  )
}
