'use client'

import { motion } from 'framer-motion'
import { HelpCircle, Sparkles } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { ScrollReveal } from './ScrollReveal'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const faqItems = [
  {
    question: 'Apa itu undangan website?',
    answer: 'Undangan website adalah undangan digital berbentuk link yang bisa dibuka di ponsel maupun laptop, lengkap dengan detail acara, galeri, RSVP, peta lokasi, dan musik.',
  },
  {
    question: 'Berapa lama proses pembuatan undangan website?',
    answer: 'Setelah data lengkap dikirim, proses pengerjaan biasanya cepat dan bisa disesuaikan dengan kebutuhan revisi serta tingkat custom pada tema yang dipilih.',
  },
  {
    question: 'Apakah desain undangan bisa disesuaikan?',
    answer: 'Bisa. Anda dapat memilih tema yang tersedia, lalu menyesuaikan nama mempelai, jadwal acara, foto, musik, galeri, ucapan, dan beberapa elemen tampilan.',
  },
  {
    question: 'Apakah tamu bisa langsung mengisi konfirmasi kehadiran?',
    answer: 'Bisa. Fitur RSVP memungkinkan tamu mengisi konfirmasi hadir secara online sehingga memudahkan Anda memantau jumlah tamu.',
  },
  {
    question: 'Bagaimana cara membagikan undangan website ke tamu?',
    answer: 'Anda cukup membagikan link undangan melalui WhatsApp, Instagram, Telegram, atau media sosial lainnya. Link tersebut bisa dibuka tanpa instal aplikasi tambahan.',
  },
  {
    question: 'Apakah undangan website bisa dibuka di semua perangkat?',
    answer: 'Ya. Undangan dirancang responsif sehingga nyaman dibuka melalui smartphone, tablet, maupun desktop.',
  },
]

export function FaqSection() {
  const { isLight } = useTheme()

  return (
    <section id="faq" className="relative py-24 overflow-hidden">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center justify-center gap-2">
              <Sparkles className={`h-6 w-6 ${isLight ? 'text-[#8b8fa3]' : 'text-[#aabbb2]'}`} />
              <h2 className={`text-4xl font-bold sm:text-5xl lg:text-6xl ${isLight ? 'text-[#2d3748]' : 'text-white'}`}>
                FAQ Undangan Website
              </h2>
              <Sparkles className={`h-6 w-6 ${isLight ? 'text-[#a0a4b8]' : 'text-[#ededed]'}`} />
            </div>
            <p className={`mx-auto max-w-3xl text-xl leading-relaxed ${isLight ? 'text-[#6b7280]' : 'text-purple-200/80'}`}>
              Pertanyaan yang paling sering ditanyakan calon pengantin sebelum memesan undangan website.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`mx-auto max-w-4xl rounded-[32px] p-4 sm:p-6 ${
              isLight
                ? 'bg-[#e0e5ec] shadow-[14px_14px_28px_#bec6d1,-14px_-14px_28px_#ffffff]'
                : 'border border-white/10 bg-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
            }`}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={item.question}
                  value={`faq-${index}`}
                  className={`rounded-[24px] border px-5 ${
                    isLight
                      ? 'border-[#d7dde6] bg-[#e7ecf2] shadow-[inset_4px_4px_10px_#c8d0db,inset_-4px_-4px_10px_#ffffff]'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <AccordionTrigger className={`gap-4 py-5 text-left text-base font-semibold hover:no-underline ${isLight ? 'text-[#2d3748]' : 'text-white'}`}>
                    <span className="flex items-center gap-3">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${isLight ? 'bg-[#e0e5ec] text-[#8b8fa3] shadow-[6px_6px_12px_#c4ccd7,-6px_-6px_12px_#ffffff]' : 'bg-white/10 text-[#FBCFE8]'}`}>
                        <HelpCircle className="h-5 w-5" />
                      </span>
                      {item.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className={`pb-5 pl-[3.25rem] pr-2 text-base leading-relaxed ${isLight ? 'text-[#6b7280]' : 'text-purple-200/80'}`}>
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  )
}
