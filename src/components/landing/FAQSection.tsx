'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { ScrollReveal } from './ScrollReveal'
import { StaggerContainer } from './animations/StaggerContainer'

const faqs = [
  {
    question: "Apa itu undangan website?",
    answer: "Undangan website adalah versi digital dari undangan fisik yang dapat diakses melalui link internet. Tamu Anda bisa melihat detail acara, lokasi (Google Maps), RSVP online, hingga galeri foto dalam satu halaman interaktif."
  },
  {
    question: "Berapa lama proses pembuatannya?",
    answer: "Proses pembuatan sangat cepat! Setelah Anda melakukan pembayaran dan mengisi data melalui formulir yang tersedia, undangan Anda akan otomatis jadi dalam hitungan menit saja."
  },
  {
    question: "Apakah bisa revisi data setelah jadi?",
    answer: "Tentu saja! Anda bisa mengubah data kapan saja melalui dashboard member selama masa aktif paket Anda masih berlaku."
  },
  {
    question: "Bagaimana cara tamu mengisi RSVP?",
    answer: "Tamu cukup mengisi nama dan kehadiran pada form RSVP di undangan Anda. Anda bisa memantau semua tamu yang akan hadir melalui dashboard member."
  },
  {
    question: "Berapa lama masa aktif undangan?",
    answer: "Masa aktif tergantung pada paket yang Anda pilih. Kami menyediakan paket mulai dari 3 bulan hingga 1 tahun setelah hari H acara."
  }
]

export function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const { isLight } = useTheme()

  return (
    <section id="faq" className="py-24 px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-black mb-4 tracking-[0.2em] uppercase ${
              isLight ? 'text-[#4b5563]' : 'text-white'
            }`} style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
              FAQ
            </h2>
            <p className={`max-w-2xl mx-auto tracking-wide ${
              isLight ? 'text-gray-600' : 'text-white/60'
            }`} style={{ fontFamily: "'Arapey', serif" }}>
              Pertanyaan yang sering ditanyakan mengenai layanan undangan digital kami.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer staggerDelay={80} className="space-y-4">
          {faqs.map((faq, index) => {
            // Child variant for stagger animation
            const childVariant = {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 }
            }

            return (
              <motion.div
                key={index}
                variants={childVariant}
                className={`rounded-2xl p-0.5 overflow-hidden transition-all duration-300 ${
                  isLight 
                    ? 'bg-[#e0e5ec] shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]' 
                    : 'bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15'
                }`}
              >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full text-left px-6 py-5 flex items-center justify-between group transition-all"
              >
                <span className={`font-bold transition-colors ${
                  isLight ? 'text-[#4b5563] group-hover:text-[#9B1FE8]' : 'text-white group-hover:text-[#a8d5c4]'
                }`} style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className={`w-5 h-5 ${isLight ? 'text-gray-500' : 'text-white/50'}`} />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className={`px-6 pb-5 border-t pt-4 leading-relaxed tracking-wide ${
                      isLight ? 'text-gray-600 border-white/20' : 'text-white/70 border-white/5'
                    }`} style={{ fontFamily: "'Arapey', serif" }}>
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            )
          })}
        </StaggerContainer>
      </div>
    </section>
  )
}
