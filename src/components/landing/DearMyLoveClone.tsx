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
import {
  generateSectionRanges,
  ParallaxSection,
  FloralParallaxLayer,
  AnimatedRoseSVG,
  EASE_CUSTOM,
} from './animations/ParallaxEngine'

const JOSEFIN = "'Josefin Sans', sans-serif"
const ARAPEY = "'Arapey', Georgia, serif"
const LATO = "'Lato', sans-serif"

function DearMyLoveLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center leading-none select-none ${className}`}>
      <span style={{ fontFamily: JOSEFIN, letterSpacing: '0.35em', fontSize: '1em', fontWeight: 700 }} className="text-white uppercase">DEAR</span>
      <span style={{ fontFamily: ARAPEY, fontSize: '0.7em', fontStyle: 'italic', letterSpacing: '0.08em', lineHeight: 1 }} className="text-white/75 -mt-0.5">my</span>
      <span style={{ fontFamily: JOSEFIN, letterSpacing: '0.35em', fontSize: '1em', fontWeight: 700 }} className="text-white uppercase">LOVE</span>
    </div>
  )
}

const DEFAULT_PACKAGES = [
  { id: 1, name: 'Basic', price: '70.000', features: 'Masa aktif selamanya\nTanpa Batas Tamu\nGallery Foto Bebas', enabled: true },
  { id: 2, name: 'Premium', price: '100.000', features: 'Masa aktif selamanya\nTanpa Batas Tamu\nVideo Undangan Lengkap\nFilter Instagram', enabled: true },
  { id: 3, name: 'VIP', price: '150.000', features: 'Masa aktif selamanya\nBebas Custom\nCustom Domain Pilihan\nDesain Sesuai Keinginan\nPriority Support 24/7', enabled: true },
]

function PricingCard({ pkg, index }: { pkg: any; index: number }) {
  const isHL = index === 1
  const features = typeof pkg.features === 'string' ? pkg.features.split('\n').filter(Boolean) : (pkg.features || [])
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.9, delay: index * 0.15, ease: EASE_CUSTOM }}
      whileHover={{ y: -12, scale: 1.03, transition: { duration: 0.3 } }}
      className={`relative flex flex-col rounded-3xl p-7 transition-all duration-300 ${isHL ? 'bg-[#ededed] shadow-2xl shadow-black/40' : 'bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15'}`}
    >
      {isHL && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#172a26] text-[#ededed] text-[10px] font-bold px-4 py-1 rounded-full tracking-[0.2em] uppercase" style={{ fontFamily: JOSEFIN }}>✦ Populer</div>
      )}
      <div className="mb-5 text-center">
        <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl mb-3 ${isHL ? 'bg-[#172a26] text-white' : 'bg-white/20 text-white'}`}>
          {index === 0 ? <Sparkles className="w-5 h-5" /> : index === 1 ? <Crown className="w-5 h-5" /> : <Star className="w-5 h-5" />}
        </div>
        <h3 className={`text-xl font-bold tracking-widest uppercase ${isHL ? 'text-[#172a26]' : 'text-white'}`} style={{ fontFamily: JOSEFIN }}>{pkg.name}</h3>
      </div>
      <div className="text-center mb-6">
        <div className={`text-3xl font-bold ${isHL ? 'text-[#172a26]' : 'text-white'}`} style={{ fontFamily: ARAPEY }}>Rp {pkg.price}</div>
        <div className={`text-xs mt-1 tracking-widest uppercase ${isHL ? 'text-[#172a26]/50' : 'text-white/50'}`} style={{ fontFamily: LATO }}>per undangan</div>
      </div>
      <ul className="space-y-2.5 flex-1 mb-7">
        {features.map((feat: string, i: number) => (
          <li key={i} className="flex items-start gap-2">
            <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isHL ? 'text-[#172a26]' : 'text-[#ededed]/80'}`} />
            <span className={`text-sm ${isHL ? 'text-[#172a26]/80' : 'text-white/80'}`} style={{ fontFamily: LATO }}>{feat}</span>
          </li>
        ))}
      </ul>
      <a href="#pesan" className={`w-full py-3 rounded-full text-xs font-bold text-center tracking-widest uppercase transition-all ${isHL ? 'bg-[#172a26] text-white hover:bg-[#223e36]' : 'bg-white/15 text-white border border-white/30 hover:bg-white/25'}`} style={{ fontFamily: JOSEFIN }}>
        {isHL ? 'Pilih Paket Ini' : 'Mulai Sekarang'}
      </a>
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
    const t = setTimeout(() => setIsLoading(false), 2500)
    return () => clearTimeout(t)
  }, [])

  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
  const ranges = generateSectionRanges(11)

  // Y displacement for hero (slides out), middle CTA, and closing (slides in)
  const heroY = useTransform(smoothProgress, [0, 0.04, 0.05], [0, 0, 1000])
  const midY = useTransform(smoothProgress, [0.41, 0.42, 0.54, 0.55], [1000, 0, 0, 1000])
  const closingY = useTransform(smoothProgress, [0, 0.91, 0.92], [1000, 1000, 0])

  // Rose drawing progress for section 2
  const roseProgress = useTransform(smoothProgress, [ranges[2][0], ranges[2][3]], [0, 1])
  const roseProgressClamped = useTransform(roseProgress, v => Math.min(Math.max(v, 0), 1))

  const FIXED_CENTER = "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 md:gap-3 w-max"

  return (
    <main className="relative" style={{ fontFamily: ARAPEY, background: 'linear-gradient(160deg, #172a26 0%, #1a2f2a 60%, #1c352e 100%)' }}>
      <style jsx global>{`
        body { overflow-x: hidden; }
        html { overflow-x: hidden; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <Sidebar />

      <AnimatePresence>{isLoading && <SplashScreen />}</AnimatePresence>

      {/* Fixed Top Logo */}
      <div className="fixed left-6 top-6 z-40 flex h-14 items-center pointer-events-none">
        {logoUrl ? <img src={logoUrl} alt={siteName} className="h-8 w-auto" /> : <DearMyLoveLogo className="text-[14px] md:text-[16px]" />}
      </div>

      {/* Fixed background gradient */}
      <div className="fixed -z-50 h-screen w-screen bg-gradient-to-t from-[#172a26] to-[#223e36]" />

      {/* ═══ PART 1: CINEMATIC PARALLAX SCROLL ═══ */}
      <div className="hide-scrollbar relative h-[1600vh] w-screen max-w-screen-2xl overflow-hidden">

        {/* Floral Parallax Background */}
        <FloralParallaxLayer smoothProgress={smoothProgress} />

        {/* All parallax content — fixed center */}
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="relative select-none">

            {/* Section 0: Hero */}
            <ParallaxSection smoothProgress={smoothProgress} ranges={ranges} index={0} className={FIXED_CENTER + " z-50"} extraStyle={{ y: heroY }}>
              <h1 style={{ fontFamily: JOSEFIN }} className="mb-10 max-w-80 text-center text-4xl font-bold leading-[50px] tracking-widest text-white md:max-w-xl lg:text-5xl lg:leading-[62px]">
                YOUR ONE STOP WEDDING KIT
              </h1>
              <p style={{ fontFamily: ARAPEY }} className="max-w-80 text-center leading-7 text-white md:max-w-xl lg:text-lg lg:leading-9 xl:text-base xl:leading-7">
                Solusi all-in-one pernikahan impian Anda! Undangan digital, smart dashboard manajemen tamu, undangan fisik, dan souvenir.
              </p>
              <div className="mt-5 flex flex-col flex-wrap items-center justify-center gap-4 md:flex-row">
                <a href="#katalog" style={{ fontFamily: JOSEFIN }} className="rounded-full bg-white px-6 py-[10px] text-xs text-[#172a26] transition-all hover:bg-[#aaaaaa] md:text-sm">LIHAT CATALOG</a>
                <a href="#pesan" style={{ fontFamily: JOSEFIN }} className="rounded-full border-1 border-white bg-[#21302c] px-6 py-[10px] text-xs text-white transition-all hover:bg-white/20 md:text-sm">FORM CUSTOM</a>
              </div>
              <div className="breathing mt-8 flex w-full flex-col items-center">
                <p style={{ fontFamily: LATO }} className="text-sm text-white/50">scroll down</p>
                <svg viewBox="0 0 24 24" className="w-5 fill-white/50 -rotate-90"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
              </div>
            </ParallaxSection>

            {/* Section 1: Intro */}
            <ParallaxSection smoothProgress={smoothProgress} ranges={ranges} index={1} className={FIXED_CENTER}>
              <div className="flex flex-col items-center gap-10 lg:flex-row">
                <div className="relative h-48 w-72 overflow-hidden rounded-xl shadow-2xl shadow-[#172723] md:h-72 md:w-[400px] lg:rounded-2xl">
                  <img src="/templates/landing page/dreamylove/www.dearmylove.org/_next/static/media/bg-1.15acb11c.jpg" alt="Undangan" className="absolute inset-0 w-full h-full object-cover brightness-90" />
                </div>
                <div className="flex flex-col items-center gap-2 md:items-start md:gap-3 max-w-md">
                  <h2 style={{ fontFamily: JOSEFIN }} className="mb-4 max-w-80 text-center text-2xl font-bold leading-8 tracking-wide md:max-w-xl md:text-4xl lg:text-left xl:text-3xl">
                    Undang orang terkasih dengan cara yang istimewa!
                  </h2>
                  <p style={{ fontFamily: ARAPEY }} className="max-w-80 text-center leading-7 text-white md:max-w-xl md:text-left lg:text-lg lg:leading-9 xl:text-base xl:leading-7">
                    Kami mengubah cara Anda mengundang orang-orang tersayang ke momen terpenting hidup Anda. Undangan Anda bukan sekadar diperhatikan, tapi akan selalu dikenang.
                  </p>
                </div>
              </div>
            </ParallaxSection>

            {/* Section 2: Why Us? + Rose Drawing */}
            <ParallaxSection smoothProgress={smoothProgress} ranges={ranges} index={2} className={FIXED_CENTER}>
              <p style={{ fontFamily: JOSEFIN }} className="pb-10 text-center text-5xl md:text-7xl font-bold tracking-widest text-white">Why Us?</p>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <AnimatedRoseSVG scrollYProgress={roseProgressClamped} size={200} strokeColor="white" strokeWidth="20" />
              </div>
            </ParallaxSection>

            {/* Section 3: All-in-One */}
            <ParallaxSection smoothProgress={smoothProgress} ranges={ranges} index={3} className={FIXED_CENTER}>
              <h2 style={{ fontFamily: JOSEFIN }} className="mb-6 w-72 text-center text-2xl font-bold leading-6 tracking-wider md:w-[450px] md:text-4xl">All-in-One Solution</h2>
              <p style={{ fontFamily: ARAPEY }} className="max-w-80 text-center leading-7 text-white md:max-w-xl lg:text-lg lg:leading-9 xl:text-base xl:leading-8">
                Sistem terintegrasi kami memungkinkan Anda mengirim undangan sekaligus mengelola RSVP dan interaksi tamu dalam satu tempat. Dari pelacakan kehadiran hingga preferensi makanan, setiap detail diorganisir dengan mudah.
              </p>
            </ParallaxSection>

            {/* Section 4: Cloud-Based */}
            <ParallaxSection smoothProgress={smoothProgress} ranges={ranges} index={4} className={FIXED_CENTER}>
              <h2 style={{ fontFamily: JOSEFIN }} className="mb-6 w-72 text-center text-2xl font-bold leading-8 tracking-wider md:w-[450px] md:text-4xl">Mudah Digunakan, Dimana saja!</h2>
              <p style={{ fontFamily: ARAPEY }} className="max-w-80 text-center leading-7 text-white md:max-w-xl lg:text-lg lg:leading-9 xl:text-base xl:leading-8">
                Platform berbasis cloud kami memungkinkan akses kapan saja, di mana saja, tanpa khawatir kehilangan informasi. Data Anda aman dan selalu ter-backup.
              </p>
            </ParallaxSection>

            {/* Section 5: Support + CTA */}
            <ParallaxSection smoothProgress={smoothProgress} ranges={ranges} index={5} className={FIXED_CENTER + " z-50"} extraStyle={{ y: midY }}>
              <h2 style={{ fontFamily: JOSEFIN }} className="mb-6 w-72 text-center text-2xl font-bold leading-8 tracking-wider md:w-[450px] md:text-4xl">Layanan Bantuan yang Cepat Tanggap!</h2>
              <p style={{ fontFamily: ARAPEY }} className="max-w-80 text-center leading-7 text-white md:max-w-xl lg:text-lg lg:leading-9 xl:text-base xl:leading-8">
                Tim dedikasi kami siap mendampingi Anda di setiap langkah persiapan pernikahan. Kami memastikan pengalaman yang mulus dan bebas kekhawatiran.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-4 md:flex-row">
                <a href="#pesan" style={{ fontFamily: JOSEFIN }} className="rounded-full bg-[#dedede] px-6 py-[10px] text-xs text-[#172a26] transition-all hover:bg-[#aaaaaa] md:text-sm">FORM CUSTOM</a>
                <a href={`https://wa.me/${whatsappNumber}`} target="_blank" style={{ fontFamily: JOSEFIN }} className="rounded-full border-2 border-[#dedede] px-6 py-[10px] text-xs text-[#ededed] transition-all hover:border-[#aaaaaa] hover:text-[#aaaaaa] md:text-sm">HUBUNGI KAMI</a>
              </div>
            </ParallaxSection>

            {/* Section 6: Our Feature title */}
            <ParallaxSection smoothProgress={smoothProgress} ranges={ranges} index={6} className={FIXED_CENTER}>
              <p style={{ fontFamily: JOSEFIN }} className="pb-10 text-center text-5xl md:text-7xl font-bold tracking-widest text-white">Our Feature</p>
            </ParallaxSection>

            {/* Section 7: Smart Dashboard */}
            <ParallaxSection smoothProgress={smoothProgress} ranges={ranges} index={7} className={FIXED_CENTER + " top-[calc(50%-40px)]"}>
              <div className="flex flex-col items-center gap-10 lg:flex-row">
                <div className="relative h-40 w-72 overflow-hidden rounded-xl shadow-2xl shadow-[#172723] md:h-[270px] md:w-[496px] lg:rounded-2xl">
                  <img src="/templates/landing page/dreamylove/www.dearmylove.org/_next/static/media/bg-2.22faaa9a.jpg" alt="Dashboard" className="absolute inset-0 w-full h-full object-cover brightness-90" />
                </div>
                <div className="flex flex-col items-center gap-2 md:gap-3 max-w-md">
                  <h2 style={{ fontFamily: JOSEFIN }} className="mb-2 text-center text-2xl font-bold leading-8 tracking-wider md:text-4xl lg:text-left">Smart Dashboard</h2>
                  <p style={{ fontFamily: ARAPEY }} className="max-w-80 text-center leading-7 text-white md:max-w-xl lg:text-left lg:text-lg lg:leading-9 xl:text-base xl:leading-8">
                    Solusi lengkap manajemen pernikahan. Kirim undangan, lacak RSVP, kelola preferensi tamu, dan atur tempat duduk dengan mudah.
                  </p>
                  <div className="mt-4 hidden flex-wrap items-center gap-2 self-start lg:flex">
                    {['Guest Management', 'WA Blast', 'Table Management'].map(t => (
                      <div key={t} className="rounded-full bg-white px-3 py-1 text-sm text-[#25332f]">{t}</div>
                    ))}
                  </div>
                </div>
              </div>
            </ParallaxSection>

            {/* Section 8: E-Invitation */}
            <ParallaxSection smoothProgress={smoothProgress} ranges={ranges} index={8} className={FIXED_CENTER + " top-[calc(50%-40px)]"}>
              <div className="flex flex-col items-center gap-10 lg:flex-row">
                <div className="relative h-60 w-36 overflow-hidden rounded-xl shadow-2xl shadow-[#172723] md:h-[500px] md:w-72 lg:rounded-2xl">
                  <img src="/templates/landing page/dreamylove/www.dearmylove.org/_next/static/media/elgaze-1.f5a2b5ed.webp" alt="E-Invitation" className="absolute inset-0 w-full h-full object-cover brightness-90" />
                </div>
                <div className="flex flex-col items-center gap-2 md:gap-3 max-w-md">
                  <h2 style={{ fontFamily: JOSEFIN }} className="mb-2 text-center text-2xl font-bold leading-8 tracking-wider md:text-4xl lg:text-left">E-Invitation</h2>
                  <p style={{ fontFamily: ARAPEY }} className="max-w-80 text-center leading-7 text-white md:max-w-xl lg:text-left lg:text-lg lg:leading-9 xl:text-base xl:leading-8">
                    Setiap undangan digital kami rancang secara unik. Terintegrasi dengan dashboard pintar untuk memudahkan pengiriman dan pengelolaan respons.
                  </p>
                  <div className="mt-4 hidden flex-wrap items-center gap-2 self-start lg:flex">
                    {['Secure', 'Auto-Integrated', 'Animated', 'Full Custom'].map(t => (
                      <div key={t} className="rounded-full bg-white px-3 py-1 text-sm text-[#25332f]">{t}</div>
                    ))}
                  </div>
                </div>
              </div>
            </ParallaxSection>

            {/* Section 9: Physical Invitation */}
            <ParallaxSection smoothProgress={smoothProgress} ranges={ranges} index={9} className={FIXED_CENTER + " top-[calc(50%-40px)]"}>
              <div className="flex flex-col items-center gap-10 lg:flex-row">
                <div className="relative h-52 w-36 overflow-hidden rounded-xl shadow-2xl shadow-[#172723] md:h-[450px] md:w-80 lg:rounded-2xl">
                  <img src="/templates/landing page/dreamylove/www.dearmylove.org/_next/static/media/bg-1.15acb11c.jpg" alt="Physical" className="absolute inset-0 w-full h-full object-cover brightness-90" />
                </div>
                <div className="flex flex-col items-center gap-2 md:gap-3 max-w-md">
                  <h2 style={{ fontFamily: JOSEFIN }} className="mb-2 text-center text-2xl font-bold leading-8 tracking-wider md:text-4xl lg:text-left">Undangan Fisik</h2>
                  <p style={{ fontFamily: ARAPEY }} className="max-w-80 text-center leading-7 text-white md:max-w-xl lg:text-left lg:text-lg lg:leading-9 xl:text-base xl:leading-8">
                    Undangan fisik kami dirancang dengan kualitas tinggi. Setiap detail dikerjakan untuk tampil elegan, dari tekstur kertas hingga cetakan.
                  </p>
                  <div className="mt-4 hidden flex-wrap items-center gap-2 self-start lg:flex">
                    {['High Quality', 'Bespoke Design', 'Low MOQ'].map(t => (
                      <div key={t} className="rounded-full bg-white px-3 py-1 text-sm text-[#25332f]">{t}</div>
                    ))}
                  </div>
                </div>
              </div>
            </ParallaxSection>

            {/* Section 10: Closing */}
            <ParallaxSection smoothProgress={smoothProgress} ranges={ranges} index={10} className={FIXED_CENTER + " mt-[-60px] z-50"} extraStyle={{ y: closingY }}>
              <AnimatedRoseSVG scrollYProgress={useTransform(smoothProgress, [0.975, 1], [0, 1])} size={50} strokeColor="#ededed" strokeWidth="60" />
              <p style={{ fontFamily: ARAPEY }} className="max-w-80 text-center text-xl leading-7 text-white md:max-w-xl lg:text-lg lg:leading-9 xl:text-base xl:leading-7">
                Biar kami yang menangani rumitnya manajemen tamu, agar Anda bisa menikmati setiap momen istimewa.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-4 md:flex-row">
                <a href="#katalog" style={{ fontFamily: JOSEFIN }} className="rounded-full bg-[#dedede] px-6 py-[10px] text-xs text-[#172a26] transition-all hover:bg-[#aaaaaa] md:text-sm">LIHAT CATALOG</a>
                <a href="#pesan" style={{ fontFamily: JOSEFIN }} className="rounded-full bg-[#dedede] px-6 py-[10px] text-xs text-[#172a26] transition-all hover:bg-[#aaaaaa] md:text-sm">FORM CUSTOM</a>
                <a href={`https://wa.me/${whatsappNumber}`} target="_blank" style={{ fontFamily: JOSEFIN }} className="rounded-full border-2 border-[#dedede] px-6 py-[10px] text-xs text-[#ededed] transition-all hover:border-[#aaaaaa] hover:text-[#aaaaaa] md:text-sm">HUBUNGI KAMI</a>
              </div>
            </ParallaxSection>

          </div>
        </div>
      </div>

      {/* ═══ PART 2: NORMAL SCROLL SECTIONS ═══ */}
      <div className="relative z-10" style={{ background: 'linear-gradient(180deg, #172a26, #1a2f2a)' }}>
        <div className="flex flex-col items-center px-4 sm:px-6 pt-20 pb-36 gap-20 w-full max-w-5xl mx-auto">
          <div id="katalog" className="w-full"><CatalogSection /></div>

          <section id="pricing" className="w-full">
            <div className="text-center mb-10">
              <h2 style={{ fontFamily: JOSEFIN }} className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 tracking-[0.15em] uppercase">Pilih Paket Terbaik</h2>
              <p style={{ fontFamily: LATO }} className="text-white/45 text-xs tracking-widest">Harga terjangkau, fitur lengkap untuk pernikahan impian Anda</p>
            </div>
            <div className={`grid grid-cols-1 gap-5 ${pricingPackages.length >= 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
              {pricingPackages.map((pkg: any, i: number) => <PricingCard key={pkg.id || i} pkg={pkg} index={i} />)}
            </div>
          </section>

          <div id="pesan" className="w-full"><OrderFormSection /></div>
          <div id="faq" className="w-full"><FAQSection /></div>
        </div>
      </div>

      <MagicFloatingNav whatsappNumber={whatsappNumber} instagramUser={instagramUser} isLight={false} />
    </main>
  )
}
