'use client'

import { useState, useEffect, useContext } from 'react'
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion'
import { CustomLandingContext } from '@/context/CustomLandingContext'
import { Check, Crown, Sparkles, Star } from 'lucide-react'
import { CatalogSection } from './CatalogSection'
import { OrderFormSection } from './OrderFormSection'
import { MagicFloatingNav } from './MagicFloatingNav'
import { FAQSection } from './FAQSection'
import { Sidebar } from './Sidebar'
import { SplashScreen } from './SplashScreen'
import { ParallaxBackground } from './ParallaxBackground'
import { ScrollFocus } from './ScrollFocus'

// ─── Rose SVG path (exact from dearmylove.org) ─────────────────────────────
const ROSE_PATH = "M1431 5750c0,-651 0,-1302 0,-1954 -205,-447 -746,-551 -950,-512 -613,115 -279,-290 49,302 269,394 572,437 901,210 0,-300 0,-600 0,-900 226,-16 504,-84 555,-264 166,-514 319,-435 246,-367 -67,62 -192,66 -277,71 -175,2 -284,8 -435,75 -368,163 -72,305 -97,-131 -8,-140 -56,-244 -99,-348 -218,-530 324,-205 -238,-118 -392,60 -855,28 -1003,-404 -126,-386 130,-448 437,-302 233,111 471,263 708,358 114,46 239,82 362,50 297,-90 466,-207 464,-541 -1,-281 -201,-121 -337,-48 -282,150 -659,293 -940,63 -158,-133 -172,-263 -153,-454 9,-86 23,-170 -66,-215 -113,-38 -186,56 -232,146 -53,104 -75,280 -21,388 113,191 455,209 649,279 150,53 235,205 337,237 149,41 180,-159 34,-211 -259,-86 -557,-125 -647,-426 -82,-293 489,-36 599,45 211,163 366,434 657,442 173,-18 365,-211 414,-373 46,-155 -48,-191 -154,-301 -150,-153 -35,-471 -484,-313 -223,78 -397,349 -147,420 112,32 227,-5 256,-128 15,-63 -2,-120 -32,-175 -170,-271 -457,-314 -753,-291 -171,14 -320,172 -252,348 128,194 506,438 738,333 99,-52 152,-141 84,-243 -77,-116 -304,-161 -381,-33 -95,176 255,491 370,596 90,82 160,145 239,244 203,260 45,279 29,252 -22,-37 41,-89 65,-107 113,-77 272,-120 335,-251 34,-75 119,-353 242,-259 83,63 28,204 -21,271 -114,154 -312,266 -451,406 -125,128 -177,160 -346,216 -486,155 -767,-103 -1066,-439 -111,-125 -258,-304 -423,-354"

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

const DEFAULT_PACKAGES = [
  { id: 1, name: 'Basic', price: '70.000', features: 'Masa aktif selamanya\nTanpa Batas Tamu\nGallery Foto Bebas', enabled: true },
  { id: 2, name: 'Premium', price: '100.000', features: 'Masa aktif selamanya\nTanpa Batas Tamu\nVideo Undangan Lengkap\nFilter Instagram', enabled: true },
  { id: 3, name: 'VIP', price: '150.000', features: 'Masa aktif selamanya\nBebas Custom\nCustom Domain Pilihan\nDesain Sesuai Keinginan\nPriority Support 24/7', enabled: true },
]

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

function SignatureDraw() {
  const { scrollYProgress } = useScroll()
  const pathLength = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  return (
    <div className="flex flex-col items-center gap-6 mt-10">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 2600 5800"
        width="65"
        stroke="#ededed"
        strokeWidth="50"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path 
          d={ROSE_PATH} 
          style={{ pathLength }}
        />
      </svg>
      <p className="max-w-80 text-center text-xl leading-7 text-white/80" style={{ fontFamily: "'Arapey', Georgia, serif" }}>
        Dear My Love,<br /> biar kami yang menangani rumitnya manajemen tamu, agar Anda bisa menikmati setiap momen istimewa Anda.
      </p>
    </div>
  )
}

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
    const t = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(t)
  }, [])

  return (
    <main className="relative min-h-[1600vh] w-full overflow-hidden selection:bg-white/20">
      {/* ── Background Gradient Asli ──────────────────────────────── */}
      <div className="fixed -z-50 h-screen w-screen bg-gradient-to-t from-[#172a26] to-[#223e36]"></div>

      <AnimatePresence>
        {isLoading && <SplashScreen />}
      </AnimatePresence>

      <Sidebar />
      <ParallaxBackground />

      {/* ── Fixed Top Logo ────────────────────────────────────────── */}
      <div className="fixed left-0 top-0 z-50 flex h-14 w-full items-end justify-center px-3 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.2 }}
        >
          {logoUrl ? (
            <img src={logoUrl} alt={siteName} className="mb-3 w-[160px] md:mb-0 md:w-[200px]" />
          ) : (
            <DearMyLoveLogo className="text-[20px] md:text-[24px] mb-3 md:mb-0" />
          )}
        </motion.div>
      </div>

      {/* ── Page Content ──────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center pt-[30vh] pb-36 gap-40 w-full max-w-6xl mx-auto px-4">
        
        {/* Hero Section */}
        <section id="home" className="flex flex-col items-center text-center w-full">
          <ScrollFocus isHero={true} className="flex flex-col items-center">
            <h1 className="mb-10 max-w-80 text-center text-4xl font-bold leading-[50px] tracking-widest text-white md:max-w-xl lg:text-5xl lg:leading-[62px] xl:mb-5 uppercase" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
              YOUR ONE STOP<br/>WEDDING KIT
            </h1>
            <p className="max-w-80 text-center leading-7 text-white md:max-w-xl lg:text-lg lg:leading-9 xl:text-base xl:leading-7" style={{ fontFamily: "'Arapey', Georgia, serif" }}>
              Solusi all-in-one pernikahan impian Anda! Undangan digital, smart dashboard manajemen tamu, undangan fisik, dan souvenir.
            </p>
            <div className="relative mt-5 flex max-w-md flex-col flex-wrap items-center justify-center gap-4 md:flex-row">
              <a href="#katalog" className="rounded-full bg-white px-6 py-[10px] text-xs font-bold text-[#172a26] transition-all hover:bg-[#aaaaaa] md:text-sm tracking-widest uppercase" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                LIHAT CATALOG
              </a>
              <a href="#pesan" className="rounded-full border border-white bg-[#21302c] px-6 py-[10px] text-xs font-bold text-white transition-all hover:bg-white/20 md:text-sm tracking-widest uppercase" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                FORM CUSTOM
              </a>
            </div>
            <div className="breathing mt-20 flex w-full flex-col items-center justify-center gap-2 text-white/50">
              <p className="text-[10px] tracking-[0.4em] uppercase" style={{ fontFamily: "'Lato', sans-serif" }}>scroll down</p>
              <svg viewBox="0 0 24 24" className="w-5 fill-white/50 -rotate-90"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
            </div>
          </ScrollFocus>
        </section>

        {/* Section: Undang orang terkasih */}
        <section className="flex flex-col items-center gap-10 lg:flex-row w-full justify-center">
          <ScrollFocus>
            <div className="relative h-48 w-72 overflow-hidden rounded-xl shadow-2xl shadow-[#172723] md:h-72 md:w-[400px] lg:rounded-2xl">
              <img src="https://dearmylove.org/_next/static/media/slide5.85f5144d.jpg" alt="Ilustrasi Undangan" className="absolute inset-0 z-0 h-full w-full object-cover brightness-90" />
            </div>
          </ScrollFocus>
          <ScrollFocus className="flex w-max max-w-md flex-col items-center gap-2 md:items-start md:gap-3">
            <h2 className="mb-4 max-w-80 text-center text-2xl font-bold leading-8 tracking-widest text-white md:max-w-xl md:text-4xl lg:text-left xl:text-3xl uppercase" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
              Undang orang terkasih dengan cara yang istimewa!
            </h2>
            <p className="max-w-80 text-center leading-7 text-white/80 md:max-w-xl md:text-left lg:text-lg lg:leading-9 xl:text-base xl:leading-7" style={{ fontFamily: "'Arapey', Georgia, serif" }}>
              Kami mengubah cara Anda mengundang orang-orang tersayang ke momen terpenting hidup Anda. Bersama kami, undangan Anda bukan sekadar diperhatikan, tapi akan selalu dikenang juga. Mengapa? Karena kami percaya setiap undangan harus menceritakan kisah—kisah Anda.
            </p>
          </ScrollFocus>
        </section>

        {/* Cinematic Intro: Why Us? */}
        <ScrollFocus className="flex flex-col justify-center items-center relative w-full my-20">
          <div className="relative text-center space-y-4 w-full flex justify-center items-center">
            <motion.img 
              initial={{ opacity: 0, y: 50, rotate: -20 }}
              whileInView={{ opacity: 1, y: 0, rotate: -12 }}
              transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
              src="/svg/dearmylove.org-5.svg" 
              className="absolute -top-16 left-[10%] w-[120px] md:w-[180px] opacity-60 pointer-events-none" 
            />
            <motion.img 
              initial={{ opacity: 0, y: -50, rotate: 20 }}
              whileInView={{ opacity: 1, y: 0, rotate: 12 }}
              transition={{ duration: 1.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              src="/svg/dearmylove.org-6.svg" 
              className="absolute -bottom-20 right-[10%] w-[150px] md:w-[220px] opacity-60 pointer-events-none" 
            />
            <h2 className="text-6xl md:text-8xl text-white font-serif relative z-10" style={{ fontFamily: "'Arapey', serif" }}>Why Us?</h2>
          </div>
        </ScrollFocus>

        {/* Features Text Blocks */}
        <div className="flex flex-col gap-32 w-full items-center">
          <ScrollFocus className="flex flex-col items-center">
            <h2 className="mb-6 w-72 text-center text-2xl font-bold leading-6 tracking-widest text-white md:w-[450px] md:text-4xl uppercase" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>All-in-One Solution</h2>
            <p className="max-w-80 text-center leading-7 text-white/80 md:max-w-xl lg:text-lg lg:leading-9 xl:text-base xl:leading-8" style={{ fontFamily: "'Arapey', Georgia, serif" }}>Kami paham bahwa pengelolaan pernikahan bisa menjadi rumit. Sistem terintegrasi kami memungkinkan Anda mengirim undangan sekaligus mengelola RSVP dan interaksi tamu dalam satu tempat.</p>
          </ScrollFocus>

          <ScrollFocus className="flex flex-col items-center">
            <h2 className="mb-6 w-72 text-center text-2xl font-bold leading-8 tracking-widest text-white md:w-[450px] md:text-4xl uppercase" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Mudah Digunakan, Dimana saja!</h2>
            <p className="max-w-80 text-center leading-7 text-white/80 md:max-w-xl lg:text-lg lg:leading-9 xl:text-base xl:leading-8" style={{ fontFamily: "'Arapey', Georgia, serif" }}>Dengan platform berbasis cloud kami, akses rencana pernikahan Anda kapan saja, di mana saja, tanpa khawatir kehilangan informasi.</p>
          </ScrollFocus>

          <ScrollFocus className="flex flex-col items-center">
            <h2 className="mb-6 w-72 text-center text-2xl font-bold leading-8 tracking-widest text-white md:w-[450px] md:text-4xl uppercase" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Layanan Bantuan Cepat Tanggap!</h2>
            <p className="max-w-80 text-center leading-7 text-white/80 md:max-w-xl lg:text-lg lg:leading-9 xl:text-base xl:leading-8" style={{ fontFamily: "'Arapey', Georgia, serif" }}>Tenang saja, tim dedikasi kami siap mendampingi Anda di setiap langkah persiapan pernikahan. Kami siap membantu dengan pertanyaan atau permintaan khusus Anda.</p>
            <div className="relative mt-8 flex max-w-md flex-col flex-wrap items-center justify-center gap-4 md:flex-row">
              <a href="#pesan" className="rounded-full bg-[#dedede] px-6 py-[10px] text-xs font-bold text-[#172a26] transition-all hover:bg-[#aaaaaa] md:text-sm tracking-widest uppercase" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>FORM CUSTOM</a>
              <a href={`https://api.whatsapp.com/send/?phone=${whatsappNumber}`} target="_blank" rel="noreferrer" className="rounded-full border-2 border-[#dedede] px-6 py-[10px] text-xs font-bold text-white transition-all hover:border-[#aaaaaa] md:text-sm tracking-widest uppercase" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>HUBUNGI KAMI</a>
            </div>
          </ScrollFocus>
        </div>

        {/* Section: Smart Dashboard */}
        <section className="flex flex-col items-center gap-10 lg:flex-row w-full justify-center mt-20">
          <ScrollFocus>
            <div className="relative h-40 w-72 overflow-hidden rounded-xl shadow-2xl shadow-[#172723] md:h-[270px] md:w-[496px] lg:rounded-2xl">
              <img src="https://dearmylove.org/_next/static/media/smart-dashboard.33a83380.jpg" alt="Smart Dashboard" className="absolute inset-0 z-0 h-full w-full object-cover brightness-90" />
            </div>
          </ScrollFocus>
          <ScrollFocus className="flex w-max max-w-md flex-col items-center gap-2 md:gap-3">
            <h2 className="mb-2 w-72 text-center text-2xl font-bold leading-8 tracking-widest text-white md:w-[450px] md:text-4xl lg:text-left uppercase" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Smart Dashboard</h2>
            <p className="max-w-80 text-center leading-7 text-white/80 md:max-w-xl lg:text-left lg:text-lg lg:leading-9 xl:text-base xl:leading-8" style={{ fontFamily: "'Arapey', Georgia, serif" }}>adalah solusi lengkap manajemen pernikahan Anda. Kirim undangan, lacak undangan fisik, lacak RSVP, kelola preferensi tamu, dan atur tempat duduk dengan mudah.</p>
            <div className="mt-4 hidden flex-wrap items-center gap-2 self-start lg:flex">
              {['Guest Management', 'WA Blast', 'Table Management', 'D-Day Registration'].map(tag => (
                <div key={tag} className="rounded-full bg-white px-3 py-1 text-sm font-bold text-[#25332f] tracking-wider" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>{tag}</div>
              ))}
            </div>
          </ScrollFocus>
        </section>

        {/* Section: E-Invitation */}
        <section className="flex flex-col items-center gap-10 lg:flex-row w-full justify-center mt-20">
          <ScrollFocus className="flex w-max max-w-md flex-col items-center gap-2 md:gap-3 lg:items-end lg:text-right">
            <h2 className="mb-2 w-72 text-center text-2xl font-bold leading-8 tracking-widest text-white md:w-[450px] md:text-4xl lg:text-right uppercase" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>E-Invitation</h2>
            <p className="max-w-80 text-center leading-7 text-white/80 md:max-w-xl lg:text-right lg:text-lg lg:leading-9 xl:text-base xl:leading-8" style={{ fontFamily: "'Arapey', Georgia, serif" }}>Setiap undangan digital kami rancang secara unik. Terintegrasi dengan dashboard pintar, undangan ini memudahkan pengiriman dan pengelolaan respons. Lacak RSVP secara real-time dan informasikan pembaruan kepada tamu.</p>
            <div className="mt-4 hidden flex-wrap items-center justify-end gap-2 self-end lg:flex">
              {['Non-Tamperable & Secure', 'Auto-Integrated System', 'Alive and Animated', 'Full Custom'].map(tag => (
                <div key={tag} className="rounded-full bg-white px-3 py-1 text-sm font-bold text-[#25332f] tracking-wider" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>{tag}</div>
              ))}
            </div>
          </ScrollFocus>
          <ScrollFocus>
            <div className="relative h-60 w-36 overflow-hidden rounded-xl shadow-2xl shadow-[#172723] md:h-[500px] md:w-72 lg:rounded-2xl">
              <img src="https://dearmylove.org/_next/static/media/e-invitation.60e593b6.png" alt="E-Invitation" className="absolute inset-0 z-0 h-full w-full object-cover brightness-90" />
            </div>
          </ScrollFocus>
        </section>

        {/* Section: Undangan Fisik */}
        <section className="flex flex-col items-center gap-10 lg:flex-row w-full justify-center mt-20">
          <ScrollFocus>
            <div className="relative h-52 w-36 overflow-hidden rounded-xl shadow-2xl shadow-[#172723] md:h-[450px] md:w-80 lg:rounded-2xl">
              <img src="https://dearmylove.org/_next/static/media/keep-sake-juan-filene.fc94eb79.jpg" alt="Undangan Fisik" className="absolute inset-0 z-0 h-full w-full object-cover brightness-90" />
            </div>
          </ScrollFocus>
          <ScrollFocus className="flex w-max max-w-md flex-col items-center gap-2 md:gap-3 lg:items-start lg:text-left">
            <h2 className="mb-2 w-72 text-center text-2xl font-bold leading-8 tracking-widest text-white md:w-[450px] md:text-4xl lg:text-left uppercase" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Undangan Fisik</h2>
            <p className="max-w-80 text-center leading-7 text-white/80 md:max-w-xl lg:text-left lg:text-lg lg:leading-9 xl:text-base xl:leading-8" style={{ fontFamily: "'Arapey', Georgia, serif" }}>Undangan fisik kami dirancang dan dibuat dengan kualitas tinggi. Setiap bagian, dari amplop hingga kartu, dikerjakan untuk tampil elegan. Kami fokus pada detail kecil yang menjadikan setiap undangan unik dan istimewa.</p>
            <div className="mt-4 hidden flex-wrap items-center gap-2 self-start lg:flex">
              {['High Quality Material', 'Bespoke Design', 'Low Minimal Quantity', 'Integrated with Smart Dashboard'].map(tag => (
                <div key={tag} className="rounded-full bg-white px-3 py-1 text-sm font-bold text-[#25332f] tracking-wider" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>{tag}</div>
              ))}
            </div>
          </ScrollFocus>
        </section>

        {/* Final CTA */}
        <ScrollFocus className="flex flex-col items-center mt-32 gap-6 w-full">
           <div className="relative flex max-w-md flex-col flex-wrap items-center justify-center gap-4 md:flex-row w-full">
              <a href="#katalog" className="rounded-full bg-[#dedede] px-6 py-[10px] text-xs font-bold text-[#172a26] transition-all hover:bg-[#aaaaaa] md:text-sm tracking-widest uppercase" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>LIHAT CATALOG</a>
              <a href="#pesan" className="rounded-full bg-[#dedede] px-6 py-[10px] text-xs font-bold text-[#172a26] transition-all hover:bg-[#aaaaaa] md:text-sm tracking-widest uppercase" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>FORM CUSTOM</a>
              <a href={`https://api.whatsapp.com/send/?phone=${whatsappNumber}`} target="_blank" rel="noreferrer" className="rounded-full border-2 border-[#dedede] px-6 py-[10px] text-xs font-bold text-white transition-all hover:border-[#aaaaaa] md:text-sm tracking-widest uppercase" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>HUBUNGI KAMI</a>
            </div>
        </ScrollFocus>

        {/* Catalog Section (Functional) */}
        <div id="katalog" className="w-full">
          <CatalogSection />
        </div>

        {/* Pricing Section (Functional with enhanced cards) */}
        <section id="pricing" className="w-full">
          <ScrollFocus className="text-center mb-16">
            <h2 style={{ fontFamily: "'Josefin Sans', sans-serif" }} className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-[0.2em] uppercase">
              Pilih Paket Terbaik
            </h2>
            <p style={{ fontFamily: "'Lato', sans-serif" }} className="text-white/40 text-xs tracking-[0.3em] uppercase">Investasi untuk momen sekali seumur hidup</p>
          </ScrollFocus>
          <div className={`grid grid-cols-1 gap-8 ${pricingPackages.length >= 3 ? 'lg:grid-cols-3' : 'md:grid-cols-2'}`}>
            {pricingPackages.map((pkg: any, i: number) => (
              <PricingCard key={pkg.id || i} pkg={pkg} index={i} />
            ))}
          </div>
        </section>

        {/* Order Form (Functional) */}
        <div id="pesan" className="w-full">
          <OrderFormSection />
        </div>
        
        {/* FAQ (Functional) */}
        <div id="faq" className="w-full">
          <FAQSection />
        </div>

        {/* Signature Drawing Closing */}
        <ScrollFocus className="w-full">
          <SignatureDraw />
        </ScrollFocus>

        <div className="flex flex-wrap gap-4 justify-center mt-10">
          <motion.a 
            href="#katalog" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ fontFamily: "'Josefin Sans', sans-serif" }} 
            className="rounded-full bg-white px-8 py-3 text-xs font-bold text-[#172a26] tracking-widest uppercase transition"
          >
            Lihat Catalog
          </motion.a>
          <motion.a 
            href="https://api.whatsapp.com/send/?phone=6281221835774" 
            target="_blank"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ fontFamily: "'Josefin Sans', sans-serif" }} 
            className="rounded-full border-2 border-white/50 px-8 py-3 text-xs font-bold text-white tracking-widest uppercase transition"
          >
            Hubungi Kami
          </motion.a>
        </div>

      </div>

      {/* ── Magic Floating Bottom Navbar ───────────────────────────── */}
      <MagicFloatingNav 
        activeSection={"home"}
        whatsappNumber={whatsappNumber}
        instagramUser={instagramUser}
        isLight={false}
      />
    </main>
  )
}
