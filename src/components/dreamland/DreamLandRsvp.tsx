'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'

const P = '/templates/dream-land'
const fadeUp = {
  hidden: { opacity: 0, filter: 'blur(6px)', transform: 'scale(0.4)' },
  visible: { opacity: 1, filter: 'blur(0px)', transform: 'scale(1)', transition: { duration: 0.8 } },
}

interface Props {
  eventNames?: string[]
  rsvpMessage?: string
}

export default function DreamLandRsvp({ eventNames, rsvpMessage }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [attending, setAttending] = useState<boolean | null>(null)
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [wishes, setWishes] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const events = eventNames || ['Holy Matrimony', 'Reception', 'Tea Pai']

  const toggleEvent = (e: string) => {
    setSelectedEvents(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e])
  }

  return (
    <section ref={ref} className="relative z-50 flex h-max min-h-screen w-full select-none flex-col justify-center"
      style={{ backgroundImage: `url(${P}/bg-1.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="my-14 flex flex-col items-center justify-center gap-2">
        <motion.h2 variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="text-[52px] leading-[56px] whitespace-pre-line text-center font-michelia text-[#775D34]">
          RSVP Form
        </motion.h2>
        <motion.p variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="mb-8 max-w-80 whitespace-pre-line text-center font-cormorant leading-6 text-[#555] md:max-w-[520px] md:text-xl lg:max-w-80 lg:text-base">
          {rsvpMessage || 'Please kindly help us to prepare everything better by confirming your attendance to our wedding:'}
        </motion.p>

        <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.6 }}
          className="relative z-[100] flex h-max w-full max-w-[520px] flex-col items-center justify-start px-6">

          {submitted ? (
            <div className="text-center py-8">
              <p className="font-michelia text-[#775D34] text-2xl mb-2">Terima Kasih!</p>
              <p className="font-cormorant text-[#555]">Your response has been recorded.</p>
            </div>
          ) : (
            <>
              <p className="mb-2 font-cormorantSemiBold text-lg text-[#775D34]">Will you attend?</p>
              <div className="mb-6 flex items-center gap-2">
                {[false, true].map((val) => (
                  <button key={String(val)} onClick={() => setAttending(val)}
                    className="relative z-50 px-5 py-[2px] rounded-full transition-all">
                    {attending === val && (
                      <div className="bg-[#BABD91] absolute inset-0 rounded-full" />
                    )}
                    <span className={`relative z-10 font-cormorantSemiBold text-lg ${attending === val ? 'text-white' : 'text-[#555]'}`}>
                      {val ? 'Yes' : 'No'}
                    </span>
                  </button>
                ))}
              </div>

              {attending === true && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex flex-col items-center">
                  <p className="mb-2 font-cormorantSemiBold text-lg text-[#775D34]">Which event will you attend?</p>
                  <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
                    {events.map((e) => (
                      <button key={e} onClick={() => toggleEvent(e)}
                        className={`relative rounded-full border px-5 py-[2px] font-cormorantSemiBold text-lg transition-all ${
                          selectedEvents.includes(e) ? 'border-[#BABD91] bg-[#BABD91] text-white' : 'border-black/40 text-black/40'
                        }`}>
                        {e}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              <p className="mb-2 font-cormorantSemiBold text-lg text-[#775D34]">Any Wishes?</p>
              <textarea
                value={wishes} onChange={(e) => setWishes(e.target.value)}
                placeholder="Congrats.."
                className="w-full mb-4 font-cormorant text-lg rounded-lg border border-gray-300 px-3 py-2 resize-none bg-white/80 focus:outline-none focus:border-[#BABD91]"
                rows={3}
              />
              <button onClick={() => setSubmitted(true)}
                className="w-full rounded-full bg-[#BABD91] px-4 py-2 text-lg text-white font-cormorantSemiBold hover:bg-[#a5a87d] transition-colors">
                Submit
              </button>
            </>
          )}
        </motion.div>
      </div>
    </section>
  )
}
