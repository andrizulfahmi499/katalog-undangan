'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

const P = '/templates/dream-land'

const fadeUp = {
  hidden: { opacity: 0, filter: 'blur(6px)', transform: 'scale(0.4)' },
  visible: { opacity: 1, filter: 'blur(0px)', transform: 'scale(1)', transition: { duration: 0.8 } },
}

interface Props {
  targetDate: string
  calendarUrl?: string
}

export default function DreamLandCountdown({ targetDate, calendarUrl }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, new Date(targetDate).getTime() - Date.now())
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  const pills = [
    { val: time.days, label: 'Days', cls: 'breathing-1', pos: 'left-0 top-0' },
    { val: time.hours, label: 'Hours', cls: 'breathing-2', pos: 'right-0 top-11' },
    { val: time.minutes, label: 'Minutes', cls: 'breathing-3', pos: 'bottom-11 left-0' },
    { val: time.seconds, label: 'Seconds', cls: 'breathing-4', pos: 'bottom-0 right-0' },
  ]

  return (
    <section ref={ref} className="relative grid h-screen w-full place-items-center select-none"
      style={{ backgroundImage: `url(${P}/bg-4.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>

      {/* Bush ornaments */}
      <img src={`${P}/bush-right-2.webp`} alt="" className="pointer-events-none absolute bottom-8 left-[-100px] w-[200px] md:w-[300px] lg:w-[200px] select-none" style={{ transformOrigin: 'bottom', transform: 'scaleX(-2) scaleY(2)' }} />
      <img src={`${P}/bush-right-2.webp`} alt="" className="pointer-events-none absolute bottom-8 right-[-100px] w-[180px] md:w-[300px] lg:w-[180px] select-none" style={{ transformOrigin: 'bottom', transform: 'scaleX(1.7) scaleY(1.7)' }} />
      <img src={`${P}/flower-2.webp`} alt="" className="pointer-events-none absolute bottom-0 left-[-180px] z-20 w-[200px] md:w-[300px] lg:w-[200px] select-none" style={{ transformOrigin: 'left', transform: 'scale(2)' }} />
      <img src={`${P}/flower-3.webp`} alt="" className="pointer-events-none absolute bottom-10 right-60 w-[200px] md:w-[300px] lg:w-[200px] select-none" style={{ transformOrigin: 'right', transform: 'scaleX(-2) scaleY(2)' }} />
      <img src={`${P}/flower-bush.webp`} alt="" className="pointer-events-none absolute bottom-[-40px] right-[-60px] z-10 w-[200px] md:w-[340px] lg:w-[200px] select-none" style={{ transformOrigin: 'bottom', transform: 'scale(2.1)' }} />
      <img src={`${P}/flower-pink.webp`} alt="" className="pointer-events-none absolute bottom-[-40px] left-[-70px] z-30 w-[120px] select-none" />

      <div className="relative z-50 mt-[-60px] flex flex-col items-center justify-center gap-4 md:gap-10">
        <motion.h2 variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="px-4 text-center font-michelia text-[60px] leading-[64px] text-[#775D34] md:text-[74px] md:leading-[80px] lg:text-[60px] lg:leading-[64px] select-none">
          {"Save\nthe Date"}
        </motion.h2>

        {/* Countdown pills */}
        <div className="relative h-[350px] w-[240px] md:h-[460px] md:w-[360px] lg:h-[350px] lg:w-[240px] select-none">
          {pills.map((p) => (
            <div key={p.label} className={`${p.cls} absolute ${p.pos}`}>
              <motion.div
                initial={{ opacity: 0, filter: 'blur(6px)', y: 40 }}
                animate={inView ? { opacity: 1, filter: 'blur(0px)', y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-28 h-[138px] md:w-[170px] md:h-[200px] lg:w-28 lg:h-[138px] rounded-[50px] md:rounded-[70px] lg:rounded-[50px] bg-gradient-to-tr from-[#F6EAD3] to-[#ededed] shadow-lg flex flex-col items-center justify-center"
              >
                <div className="relative mt-[-40px] flex h-24 w-full flex-col items-center justify-end overflow-hidden">
                  <motion.p
                    key={p.val}
                    initial={{ opacity: 0, filter: 'blur(2px)', y: 40 }}
                    animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                    className="text-6xl md:text-[80px] lg:text-6xl text-[#775D34] absolute"
                  >
                    {String(p.val).padStart(2, '0')}
                  </motion.p>
                </div>
                <p className="text-xl md:text-2xl lg:text-xl font-cormorant italic">{p.label}</p>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Add to Calendar */}
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <a href={calendarUrl || '#'} download
            className="mt-6 flex items-center gap-2 rounded-full bg-[#F6EAD3] px-7 py-2 shadow-lg transition-all focus:bg-[#fce3b2] active:bg-[#fce3b2] font-cormorant italic text-[#777]">
            <svg className="w-[18px] fill-[#777]" viewBox="0 0 24 24">
              <path d="M2,19c0,1.7,1.3,3,3,3h14c1.7,0,3-1.3,3-3v-8H2V19z M19,4h-2V3c0-0.6-0.4-1-1-1s-1,0.4-1,1v1H9V3c0-0.6-0.4-1-1-1S7,2.4,7,3v1H5C3.3,4,2,5.3,2,7v2h20V7C22,5.3,20.7,4,19,4z" />
            </svg>
            Add to Calendar
          </a>
        </motion.div>
      </div>
    </section>
  )
}
