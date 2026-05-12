'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'

const P = '/templates/dream-land'
const fadeUp = {
  hidden: { opacity: 0, filter: 'blur(6px)', transform: 'scale(0.4)' },
  visible: { opacity: 1, filter: 'blur(0px)', transform: 'scale(1)', transition: { duration: 0.8 } },
}

interface WishItem { name: string; date: string; message: string }
interface Props { wishes?: WishItem[] }

export default function DreamLandWishingWell({ wishes }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [showAll, setShowAll] = useState(false)

  const items: WishItem[] = wishes && wishes.length > 0 ? wishes : [
    { name: 'Dear My Love', date: '01-01-2026', message: 'Congratulations on your beautiful union! May your journey together be filled with love and joy.' },
    { name: 'Family & Friends', date: '01-01-2026', message: 'Wishing you a lifetime of happiness and love!' },
  ]

  const displayItems = showAll ? items : items.slice(0, 5)

  return (
    <section ref={ref} className="flex h-screen w-full select-none flex-col items-center justify-end"
      style={{ backgroundImage: `url(${P}/bg-1.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="flex flex-col items-center justify-center gap-2">
        <motion.h2 variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="text-[52px] leading-[56px] whitespace-pre-line text-center font-michelia text-[#775D34]">
          Wishing Well
        </motion.h2>
        <motion.p variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="mb-4 max-w-80 text-center font-cormorant leading-6 text-[#555]">
          Thank you for the time to send us your love.
        </motion.p>

        <div className="mb-2 flex items-center gap-2">
          <button onClick={() => setShowAll(false)}
            className={`relative px-3 py-[2px] rounded-full ${!showAll ? 'bg-[#9f3b89]' : ''}`}>
            <span className={`relative z-10 font-cormorantSemiBold ${!showAll ? 'text-white' : 'text-[#555]'}`}>See less</span>
          </button>
          <button onClick={() => setShowAll(true)}
            className={`relative px-3 py-[2px] rounded-full ${showAll ? 'bg-[#9f3b89]' : ''}`}>
            <span className={`relative z-10 font-cormorantSemiBold ${showAll ? 'text-white' : 'text-[#555]'}`}>See all</span>
          </button>
        </div>

        <div className="rounded-t-[40px] bg-[#F6EAD3] hide-scrollbar relative h-[calc(100vh-200px)] w-[calc(100%-48px)] max-w-[520px] overflow-y-auto pt-4 shadow-inner">
          {displayItems.map((item, i) => (
            <div key={i} className="mx-6 mb-4">
              <div className="flex items-center gap-1">
                <p className="font-cormorantSemiBold text-xl text-[#603625]">{item.name}</p>
                {i === 0 && (
                  <svg viewBox="0 0 24 24" className="w-5 fill-emerald-600">
                    <path fillRule="evenodd" clipRule="evenodd" d="M9.59 3.2c-.24.21-.37.31-.5.4a2.5 2.5 0 01-.98.4c-.15.04-.32.05-.63.07C6.68.14 6.28.17 5.94.29a2.5 2.5 0 00-1.65 1.65c-.12.33-.15.73-.21 1.54-.03.32-.04.48-.07.63a2.5 2.5 0 01-.41.99c-.09.13-.19.26-.4.49a3.5 3.5 0 00-.94 1.23 3.5 3.5 0 000 2.34c.15.32.41.63.93 1.24.21.24.31.37.4.5.2.3.34.63.41.99.03.15.04.32.07.63.06.8.09 1.2.21 1.54a2.5 2.5 0 001.65 1.65c.34.12.74.15 1.54.21.32.03.48.04.63.07.35.07.69.21.99.41.13.09.26.19.49.4.61.52.92.78 1.24.93a3.5 3.5 0 002.34 0c.32-.15.63-.41 1.24-.93.24-.21.37-.31.5-.4.3-.2.63-.34.99-.41.15-.03.32-.04.63-.07.8-.06 1.2-.09 1.54-.21a2.5 2.5 0 001.65-1.65c.12-.34.15-.74.21-1.54.03-.32.04-.48.07-.63.07-.35.21-.69.41-.99.09-.13.19-.26.4-.49.52-.61.78-.92.93-1.24a3.5 3.5 0 000-2.34 3.5 3.5 0 00-.93-1.24c-.21-.24-.31-.37-.4-.5a2.5 2.5 0 01-.41-.99c-.03-.15-.04-.32-.07-.63-.06-.8-.09-1.2-.21-1.54a2.5 2.5 0 00-1.65-1.65c-.34-.12-.74-.15-1.54-.21-.32-.03-.48-.04-.63-.07a2.5 2.5 0 01-.99-.41c-.13-.09-.26-.19-.49-.4A3.5 3.5 0 0013.17 2.27a3.5 3.5 0 00-2.34 0c-.32.15-.63.41-1.24.93zm6.78 6.66a.81.81 0 00-1.15-1.15l-4.85 4.85-1.6-1.6a.81.81 0 00-1.15 1.16l2.17 2.17a.81.81 0 001.15 0l5.43-5.43z"/>
                  </svg>
                )}
              </div>
              <p className="text-[#4f4741] mb-[2px] font-cormorant text-sm">{item.date}</p>
              <p className="whitespace-pre-wrap font-cormorant text-[17px] leading-5 text-[#603625]">{item.message}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
