'use client'
import { motion } from 'framer-motion'

const ASSET = '/images/themes/dreamy-javanese'

interface Props {
  verse?: string
  source?: string
}

export default function DJQuote({ verse, source }: Props) {
  const defaultVerse = 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang.'
  
  return (
    <section className="relative w-full py-20 flex flex-col items-center" style={{ backgroundColor: '#2f2115' }}>
      {/* Batik pattern bg */}
      <img src={`${ASSET}/paperize.png`} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-lg px-8 text-center"
      >
        <img src={`${ASSET}/quotes_decor_13.png`} alt="" className="w-36 mx-auto mb-8 opacity-70" />
        
        <p className="font-dreamy-body text-lg md:text-xl leading-relaxed text-[#eedcbd] italic">
          &ldquo;{verse || defaultVerse}&rdquo;
        </p>
        
        <p className="font-dreamy-title mt-8 text-[#d0ba96] tracking-[0.2em] text-xs uppercase">
          {source || '(QS. Ar-Rum: 21)'}
        </p>
        
        <img src={`${ASSET}/quotes_decor_13.png`} alt="" className="w-36 mx-auto mt-8 opacity-70 rotate-180" />
      </motion.div>
    </section>
  )
}
