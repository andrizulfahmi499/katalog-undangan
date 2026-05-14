'use client'

import { motion } from 'framer-motion'

interface Props {
  streamingUrl?: string
  filterUrl?: string
}

export default function RoyalGardenStreaming({ 
  streamingUrl = 'https://www.youtube.com/watch?v=Ynj_L5TCyws',
  filterUrl = 'https://instagram.com' 
}: Props) {
  return (
    <section className="relative py-20 px-6 overflow-hidden" style={{ background: 'linear-gradient(180deg, #f5efe3 0%, #efe6d5 100%)' }}>
      <div className="max-w-md mx-auto space-y-12">
        {/* Live Streaming */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-[#d4c5a9]/40 p-8 shadow-lg">
            <h3 className="font-great-vibes text-[#5a4a2f] text-3xl md:text-4xl mb-3">Join Live Streaming</h3>
            <div className="rg-divider mb-4" />
            <p className="font-cormorant text-[#7a6b52] text-sm mb-6">
              For family and friends who would like to witness our special moment virtually
            </p>
            <a
              href={streamingUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#c9a96e] to-[#b8956a] px-6 py-3 text-white font-cinzel text-xs tracking-[0.15em] uppercase shadow-md hover:shadow-lg transition-all duration-300"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
              Live Streaming
            </a>
          </div>
        </motion.div>

        {/* Live Moment / Instagram Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-[#d4c5a9]/40 p-8 shadow-lg">
            <h3 className="font-great-vibes text-[#5a4a2f] text-3xl md:text-4xl mb-3">Live Moment</h3>
            <div className="rg-divider mb-4" />
            <p className="font-cormorant text-[#7a6b52] text-sm mb-6">
              Don&apos;t miss this beautiful moment! We have provided a special Instagram filter that you can use
            </p>
            <a
              href={filterUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#e8b4b8] to-[#d4a0a4] px-6 py-3 text-white font-cinzel text-xs tracking-[0.15em] uppercase shadow-md hover:shadow-lg transition-all duration-300"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Gunakan Filter
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
