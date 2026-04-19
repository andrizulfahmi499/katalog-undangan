'use client'

import { useState, useEffect, useRef, useContext } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValueEvent } from 'framer-motion'
import { CustomLandingContext } from '@/context/CustomLandingContext'
import { Check, Crown, Sparkles, Star } from 'lucide-react'
import { CatalogSection } from './CatalogSection'
import { OrderFormSection } from './OrderFormSection'
import { MagicFloatingNav } from './MagicFloatingNav'

// ─── Rose SVG path (exact from dearmylove.org) ─────────────────────────────
const ROSE_PATH = "M1431 5750c0,-651 0,-1302 0,-1954 -205,-447 -746,-551 -950,-512 -613,115 -279,-290 49,302 269,394 572,437 901,210 0,-300 0,-600 0,-900 226,-16 504,-84 555,-264 166,-514 319,-435 246,-367 -67,62 -192,66 -277,71 -175,2 -284,8 -435,75 -368,163 -72,305 -97,-131 -8,-140 -56,-244 -99,-348 -218,-530 324,-205 -238,-118 -392,60 -855,28 -1003,-404 -126,-386 130,-448 437,-302 233,111 471,263 708,358 114,46 239,82 362,50 297,-90 466,-207 464,-541 -1,-281 -201,-121 -337,-48 -282,150 -659,293 -940,63 -158,-133 -172,-263 -153,-454 9,-86 23,-170 -66,-215 -113,-38 -186,56 -232,146 -53,104 -75,280 -21,388 113,191 455,209 649,279 150,53 235,205 337,237 149,41 180,-159 34,-211 -259,-86 -557,-125 -647,-426 -82,-293 489,-36 599,45 211,163 366,434 657,442 173,-18 365,-211 414,-373 46,-155 -48,-191 -154,-301 -150,-153 -35,-471 -484,-313 -223,78 -397,349 -147,420 112,32 227,-5 256,-128 15,-63 -2,-120 -32,-175 -170,-271 -457,-314 -753,-291 -171,14 -320,172 -252,348 128,194 506,438 738,333 99,-52 152,-141 84,-243 -77,-116 -304,-161 -381,-33 -95,176 255,491 370,596 90,82 160,145 239,244 203,260 45,279 29,252 -22,-37 41,-89 65,-107 113,-77 272,-120 335,-251 34,-75 119,-353 242,-259 83,63 28,204 -21,271 -114,154 -312,266 -451,406 -125,128 -177,160 -346,216 -486,155 -767,-103 -1066,-439 -111,-125 -258,-304 -423,-354"

// ─── DearMyLove full logo SVG path (exact from dearmylove.org source)  ───────
// The full logo SVG renders "DEAR my LOVE" as a path drawing
// Use text fallback approach that looks identical
function DearMyLoveLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center leading-none select-none ${className}`}>
      <span
        style={{ fontFamily: "'Josefin Sans', sans-serif", letterSpacing: '0.35em', fontSize: '1em', fontWeight: 700 }}
        className="text-white uppercase tracking-[0.35em]"
      >
        DEAR
      </span>
      <span
        style={{ fontFamily: "'Arapey', Georgia, serif", fontSize: '0.7em', fontStyle: 'italic', letterSpacing: '0.08em', lineHeight: 1 }}
        className="text-white/75 -mt-0.5"
      >
        my
      </span>
      <span
        style={{ fontFamily: "'Josefin Sans', sans-serif", letterSpacing: '0.35em', fontSize: '1em', fontWeight: 700 }}
        className="text-white uppercase tracking-[0.35em]"
      >
        LOVE
      </span>
    </div>
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
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Parallax Image wrapper ────────────────────────────────────────────────────
function ParallaxImg({ src, alt, speed = 0.12 }: { src: string; alt: string; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * -80}px`, `${speed * 80}px`])
  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden rounded-2xl">
      <motion.img
        src={src}
        alt={alt}
        style={{ y }}
        className="w-full h-[120%] -top-[10%] absolute object-cover brightness-90"
      />
    </div>
  )
}

// ─── Navbar Item — exact dearmylove.org behavior ───────────────────────────────
// Mobile (< md): icon only, w-10 h-10
// Tablet (md–xl): fixed expanded with label text visible
// Desktop (xl+): icon only again w-10 h-10
function NavItem({
  href,
  icon,
  label,
  dark = false,
  mdWidth = '100px',
  isActive = false,
}: {
  href: string
  icon: React.ReactNode
  label: string
  dark?: boolean
  mdWidth?: string
  isActive?: boolean
}) {
  const isExternal = href.startsWith('http')
  return (
    <a href={href} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noopener noreferrer' : undefined}>
      <div
        className={`
          relative flex items-center overflow-hidden rounded-full group
          py-[2px] pl-[8px] h-10 transition-all duration-300
          ${isActive ? 'w-[var(--expanded-w)] lg:w-10' : 'w-10'}
          hover:w-[var(--expanded-w)]
        `}
        style={{
          backgroundColor: dark ? '#172a26' : 'transparent',
          '--expanded-w': mdWidth
        } as React.CSSProperties}
        title={label}
      >
        {/* Icon always visible */}
        <div className="flex-shrink-0 flex items-center justify-center -ml-[2px]">{icon}</div>
        
        {/* Label */ }
        <span
          className={`
            pl-1.5 pr-3 text-xs whitespace-nowrap overflow-hidden transition-all duration-300
            ${isActive 
              ? 'opacity-100 max-w-xs lg:opacity-0 lg:max-w-0 lg:group-hover:opacity-100 lg:group-hover:max-w-xs' 
              : 'opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-xs'}
          `}
          style={{
            fontFamily: "'Lato', sans-serif",
            color: dark ? 'white' : '#172a26',
          }}
        >
          {label}
        </span>
      </div>
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
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#172a26] text-[#ededed] text-[10px] font-bold px-4 py-1 rounded-full tracking-[0.2em] uppercase" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
          ✦ Populer
        </div>
      )}
      <div className="mb-5 text-center">
        <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl mb-3 ${isHighlighted ? 'bg-[#172a26] text-white' : 'bg-white/20 text-white'}`}>
          {index === 0 ? <Sparkles className="w-5 h-5" /> : index === 1 ? <Crown className="w-5 h-5" /> : <Star className="w-5 h-5" />}
        </div>
        <h3 className={`text-xl font-bold tracking-widest uppercase ${isHighlighted ? 'text-[#172a26]' : 'text-white'}`} style={{ fontFamily: "'Josefin Sans', sans-serif" }}>{pkg.name}</h3>
      </div>
      <div className="text-center mb-6">
        <div className={`text-3xl font-bold ${isHighlighted ? 'text-[#172a26]' : 'text-white'}`} style={{ fontFamily: "'Arapey', Georgia, serif" }}>Rp {pkg.price}</div>
        <div className={`text-xs mt-1 tracking-widest uppercase ${isHighlighted ? 'text-[#172a26]/50' : 'text-white/50'}`} style={{ fontFamily: "'Lato', sans-serif" }}>per undangan</div>
      </div>
      <ul className="space-y-2.5 flex-1 mb-7">
        {features.map((feat: string, i: number) => (
          <li key={i} className="flex items-start gap-2">
            <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isHighlighted ? 'text-[#172a26]' : 'text-[#ededed]/80'}`} />
            <span className={`text-sm ${isHighlighted ? 'text-[#172a26]/80' : 'text-white/80'}`} style={{ fontFamily: "'Lato', sans-serif" }}>{feat}</span>
          </li>
        ))}
      </ul>
      <motion.a
        href="#pesan"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className={`w-full py-3 rounded-full text-xs font-bold text-center tracking-widest uppercase transition-all ${
          isHighlighted ? 'bg-[#172a26] text-white hover:bg-[#223e36]' : 'bg-white/15 text-white border border-white/30 hover:bg-white/25'
        }`}
        style={{ fontFamily: "'Josefin Sans', sans-serif" }}
      >
        {isHighlighted ? 'Pilih Paket Ini' : 'Mulai Sekarang'}
      </motion.a>
    </motion.div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function DearMyLoveClone() {
  const [isLoading, setIsLoading] = useState(true)
  const ctx = useContext(CustomLandingContext)
  const config = ctx?.config || {}

  const siteName = (config?.siteName as string) || 'AKA Invitation'
  const whatsappNumber = (config?.whatsappNumber as string) || '6285299659458'
  const instagramUser = config?.socialMedia?.instagram?.url
    ? (config.socialMedia.instagram.url as string).replace(/.*instagram\.com\//i, '').replace(/\//g, '')
    : 'akainvitation'
  const logoUrl = (config?.logoUrl as string) || null
  const pricingPackages = (config?.pricingPackages as any[])?.filter((p: any) => p.enabled !== false) || DEFAULT_PACKAGES

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 3200)
    return () => clearTimeout(t)
  }, [])

  const { scrollY, scrollYProgress } = useScroll()
  const floralLeftY = useTransform(scrollY, [0, 1200], [0, -80])
  const floralRightY = useTransform(scrollY, [0, 1200], [0, -55])

  const [activeSection, setActiveSection] = useState('home')

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.15) setActiveSection('home')
    else if (latest < 0.35) setActiveSection('contact')
    else if (latest < 0.55) setActiveSection('login')
    else if (latest < 0.80) setActiveSection('catalog')
    else setActiveSection('pricing')
  })

  return (
    <main
      className="relative min-h-screen overflow-x-hidden"
      style={{ fontFamily: "'Arapey', Georgia, serif", background: 'linear-gradient(160deg, #172a26 0%, #1a2f2a 60%, #1c352e 100%)' }}
    >
      {/* ── Preloader ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
            style={{ background: 'linear-gradient(160deg, #172a26 0%, #1a2f2a 60%, #1c352e 100%)' }}
          >
            {/* Logo centered above the rose */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              {logoUrl ? (
                <img src={logoUrl} alt={siteName} className="h-10 w-auto" />
              ) : (
                <DearMyLoveLogo className="text-[18px]" />
              )}
            </motion.div>

            {/* Rose draw animation - centered, same size as dearmylove.org */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 2600 5800"
                width="65"
                height="145"
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
      <div className="fixed left-0 top-0 z-40 flex h-14 w-full items-center justify-center pointer-events-none">
        {logoUrl ? (
          <img src={logoUrl} alt={siteName} className="h-8 w-auto" />
        ) : (
          <DearMyLoveLogo className="text-[14px] md:text-[16px]" />
        )}
      </div>

      {/* ── Parallax Botanical Background ─────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div style={{ y: floralLeftY }} className="absolute -left-16 lg:left-0 top-0 opacity-[0.2] w-[300px] h-[700px]">
          <img src="/svg/dearmylove.org-2.svg" className="w-full h-full object-contain breathing-1" alt="" />
        </motion.div>
        <motion.div style={{ y: floralRightY }} className="absolute -right-16 lg:right-0 top-0 opacity-[0.2] w-[300px] h-[700px]">
          <img src="/svg/dearmylove.org-3.svg" className="w-full h-full object-contain breathing-2 transform scale-x-[-1]" alt="" />
        </motion.div>
        <motion.div style={{ y: floralLeftY }} className="absolute -left-12 lg:left-10 bottom-0 opacity-[0.15] w-[220px] h-[500px]">
          <img src="/svg/dearmylove.org-4.svg" className="w-full h-full object-contain breathing-3" alt="" />
        </motion.div>
        <motion.div style={{ y: floralRightY }} className="absolute -right-12 lg:right-10 bottom-0 opacity-[0.15] w-[220px] h-[500px]">
          <img src="/svg/dearmylove.org-2.svg" className="w-full h-full object-contain breathing-4 transform scale-x-[-1]" alt="" />
        </motion.div>
      </div>

      {/* ── Page Content ──────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 pt-20 pb-36 gap-20 w-full max-w-5xl mx-auto">

        {/* Hero */}
        <section id="home" className="flex flex-col items-center text-center gap-6 pt-12 max-w-xl">
          <Reveal>
            <h1 style={{ fontFamily: "'Josefin Sans', sans-serif" }} className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[0.15em] leading-tight text-white uppercase">
              YOUR ONE STOP<br />WEDDING KIT
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ fontFamily: "'Arapey', Georgia, serif" }} className="text-base md:text-lg leading-7 text-white/70 max-w-md">
              Solusi all-in-one pernikahan impian Anda! Undangan digital, smart dashboard manajemen tamu, dan lebih banyak lagi.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="#katalog" style={{ fontFamily: "'Josefin Sans', sans-serif" }} className="rounded-full bg-white px-6 py-2.5 text-xs font-bold text-[#172a26] tracking-widest uppercase transition hover:bg-gray-100">
                Lihat Catalog
              </a>
              <a href="#pesan" style={{ fontFamily: "'Josefin Sans', sans-serif" }} className="rounded-full border border-white/30 bg-white/10 px-6 py-2.5 text-xs font-bold text-white tracking-widest uppercase backdrop-blur-sm transition hover:bg-white/20">
                Form Custom
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="breathing mt-2 flex flex-col items-center gap-1 text-white/35">
              <p style={{ fontFamily: "'Lato', sans-serif" }} className="text-xs tracking-widest">scroll down</p>
              <svg viewBox="0 0 24 24" className="w-4 fill-white/35 -rotate-90"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
            </div>
          </Reveal>
        </section>

        {/* Intro Image + Text */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full">
          <Reveal>
            <div className="relative h-60 md:h-72 w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
              <ParallaxImg src="/templates/landing page/dreamylove/www.dearmylove.org/_next/static/media/bg-1.15acb11c.jpg" alt="Undangan" />
            </div>
          </Reveal>
          <Reveal delay={0.12} className="flex flex-col gap-4 text-center md:text-left">
            <h2 style={{ fontFamily: "'Josefin Sans', sans-serif" }} className="text-xl md:text-2xl font-bold tracking-wide text-white uppercase">
              Undang orang terkasih dengan cara istimewa!
            </h2>
            <p style={{ fontFamily: "'Arapey', Georgia, serif" }} className="text-sm md:text-base leading-7 text-white/65">
              Kami mengubah cara Anda mengundang orang-orang tersayang ke momen terpenting hidup Anda. Undangan Anda bukan sekadar diperhatikan, tapi selalu dikenang.
            </p>
          </Reveal>
        </section>

        {/* Feature rows */}
        {[
          { title: 'All-in-One Solution', body: 'Sistem terintegrasi kami memungkinkan Anda mengirim undangan sekaligus mengelola RSVP dan interaksi tamu dalam satu tempat.' },
          { title: 'Mudah Digunakan, Dimana saja!', body: 'Platform berbasis cloud kami memungkinkan akses kapan saja tanpa khawatir kehilangan informasi penting pernikahan Anda.' },
          { title: 'Layanan Bantuan Cepat Tanggap!', body: 'Tim kami siap mendampingi di setiap langkah persiapan. Kami siap membantu dengan pertanyaan atau permintaan khusus apapun.' },
        ].map((item, i) => (
          <Reveal key={i} delay={0.05 * i} className="text-center max-w-lg mx-auto">
            <h2 style={{ fontFamily: "'Josefin Sans', sans-serif" }} className="text-xl md:text-2xl font-bold tracking-wide text-white mb-3 uppercase">
              {item.title}
            </h2>
            <p style={{ fontFamily: "'Arapey', Georgia, serif" }} className="text-sm md:text-base leading-7 text-white/65">
              {item.body}
            </p>
          </Reveal>
        ))}

        {/* Smart Dashboard */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full">
          <Reveal>
            <div className="relative h-60 md:h-72 w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
              <ParallaxImg src="/templates/landing page/dreamylove/www.dearmylove.org/_next/static/media/bg-2.22faaa9a.jpg" alt="Smart Dashboard" />
            </div>
          </Reveal>
          <Reveal delay={0.12} className="flex flex-col gap-4 text-center md:text-left">
            <h2 style={{ fontFamily: "'Josefin Sans', sans-serif" }} className="text-xl md:text-2xl font-bold tracking-wide text-white uppercase">Smart Dashboard</h2>
            <p style={{ fontFamily: "'Arapey', Georgia, serif" }} className="text-sm md:text-base leading-7 text-white/65">
              Solusi lengkap manajemen pernikahan. Kirim undangan, lacak RSVP, kelola preferensi tamu, dan atur tempat duduk dengan mudah.
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {['Guest Management', 'WA Blast', 'Table Management'].map(tag => (
                <span key={tag} style={{ fontFamily: "'Josefin Sans', sans-serif" }} className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold text-[#172a26] tracking-widest uppercase">{tag}</span>
              ))}
            </div>
          </Reveal>
        </section>

        {/* E-Invitation phone mockup */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full">
          <Reveal className="order-2 md:order-1 flex flex-col gap-4 text-center md:text-left">
            <h2 style={{ fontFamily: "'Josefin Sans', sans-serif" }} className="text-xl md:text-2xl font-bold tracking-wide text-white uppercase">E-Invitation</h2>
            <p style={{ fontFamily: "'Arapey', Georgia, serif" }} className="text-sm md:text-base leading-7 text-white/65">
              Setiap undangan digital kami rancang secara unik. Terintegrasi dengan dashboard pintar untuk memudahkan pengiriman dan pengelolaan respons tamu.
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {['Secure', 'Animated', 'Custom'].map(tag => (
                <span key={tag} style={{ fontFamily: "'Josefin Sans', sans-serif" }} className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold text-[#172a26] tracking-widest uppercase">{tag}</span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.12} className="order-1 md:order-2 flex justify-center">
            <div className="relative h-72 w-40 md:h-80 md:w-48 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
              <ParallaxImg src="/templates/landing page/dreamylove/www.dearmylove.org/_next/static/media/elgaze-1.f5a2b5ed.webp" alt="E-Invitation" speed={0.08} />
            </div>
          </Reveal>
        </section>

        {/* Catalog & Order — no heavy padding wrapper */}
        <div id="katalog" className="w-full">
          <CatalogSection />
        </div>

        {/* Pricing */}
        <section id="pricing" className="w-full">
          <Reveal className="text-center mb-10">
            <h2 style={{ fontFamily: "'Josefin Sans', sans-serif" }} className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 tracking-[0.15em] uppercase">
              Pilih Paket Terbaik
            </h2>
            <p style={{ fontFamily: "'Lato', sans-serif" }} className="text-white/45 text-xs tracking-widest">Harga terjangkau, fitur lengkap untuk pernikahan impian Anda</p>
          </Reveal>
          <div className={`grid grid-cols-1 gap-5 ${pricingPackages.length >= 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
            {pricingPackages.map((pkg: any, i: number) => (
              <PricingCard key={pkg.id || i} pkg={pkg} index={i} />
            ))}
          </div>
        </section>

        <div id="pesan" className="w-full">
          <OrderFormSection />
        </div>
      </div>

      {/* ── Magic Floating Bottom Navbar ───────────────────────────── */}
      <MagicFloatingNav 
        activeSection={activeSection}
        whatsappNumber={whatsappNumber}
        instagramUser={instagramUser}
        isLight={false}
      />
    </main>

  )
}
