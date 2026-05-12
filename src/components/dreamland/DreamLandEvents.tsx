'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const P = '/templates/dream-land'
const fadeUp = {
  hidden: { opacity: 0, filter: 'blur(6px)', transform: 'scale(0.4)' },
  visible: { opacity: 1, filter: 'blur(0px)', transform: 'scale(1)', transition: { duration: 0.8 } },
}

interface EventData {
  title: string
  day: string
  month: string
  date: string
  year: string
  time: string
  venue: string
  address: string
  mapsUrl?: string
}

interface Props {
  events: EventData[]
}

function HolyMatrimonyScene({ event }: { event: EventData }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} id="event0"
      style={{ backgroundImage: `url(${P}/bg-5.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      className="relative grid h-screen w-full select-none place-items-center overflow-hidden">
      <motion.div initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1 }}
        className="pointer-events-none absolute left-0 top-6 z-20 select-none">
        <img src={`${P}/bird-2.webp`} alt="Dove" className="w-[130px] md:w-[140px]" />
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1 }}
        className="pointer-events-none absolute bottom-[120px] right-10 z-20 select-none">
        <img src={`${P}/bird-1.webp`} alt="Dove" className="w-[70px] md:w-[120px] lg:w-[70px]" />
      </motion.div>
      <motion.img initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1 }}
        src={`${P}/cathedral.webp`} alt="Cathedral"
        className="pointer-events-none absolute bottom-[-105px] left-[-90px] z-10 w-[340px] md:w-[600px] lg:w-[340px] select-none" />
      <motion.div initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1 }}
        className="pointer-events-none absolute bottom-0 right-0 z-20 select-none">
        <img src={`${P}/bush-right-1.webp`} alt="Bush" className="w-[180px] md:w-[500px] lg:w-[180px]" />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1 }}
        className="pointer-events-none absolute bottom-0 right-0 z-10 select-none">
        <img src={`${P}/bush-right-2.webp`} alt="Bush" className="w-[180px] md:w-[400px] lg:w-[180px]" style={{ transformOrigin: 'bottom left' }} />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1 }}
        className="pointer-events-none absolute bottom-0 right-[-100px] select-none">
        <img src={`${P}/tree.webp`} alt="Tree" className="w-[280px] md:w-[540px] lg:w-[280px]" style={{ transformOrigin: 'bottom left' }} />
      </motion.div>
      <img src={`${P}/groom-bride.webp`} alt="Couple" className="pointer-events-none absolute bottom-1 right-[110px] z-20 w-[80px] md:w-[140px] lg:w-[80px] select-none" style={{ filter: 'blur(1px)', opacity: 0.9 }} />
      <EventContent event={event} inView={inView} />
    </section>
  )
}

function TeaPaiScene({ event }: { event: EventData }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref}
      style={{ backgroundImage: `url(${P}/bg-6.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      className="relative grid h-screen w-full select-none place-items-center overflow-hidden">
      <motion.div initial={{ opacity: 0, y: -40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1 }}
        className="pointer-events-none absolute left-0 top-0 z-10 select-none">
        <img src={`${P}/chinese-fans.webp`} alt="Chinese Fans" className="w-full" />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: -40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1 }}
        className="pointer-events-none absolute right-0 top-0 select-none">
        <img src={`${P}/lantern.png`} alt="Lantern" className="w-[110px] md:w-[200px] lg:w-[110px]" style={{ transformOrigin: 'top center', transform: 'rotate(-2deg)' }} />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: -40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1 }}
        className="pointer-events-none absolute left-[-16px] top-0 select-none">
        <img src={`${P}/lantern.png`} alt="Lantern" className="w-[110px] md:w-[200px] lg:w-[110px]" style={{ transformOrigin: 'top center', transform: 'rotate(-2deg)' }} />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1 }}
        className="pointer-events-none absolute bottom-0 left-0 select-none">
        <img src={`${P}/bush-full.webp`} alt="Bush" className="w-full" />
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.4 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.8 }}
        className="pointer-events-none absolute bottom-6 right-4 select-none md:bottom-16 md:right-14 lg:bottom-6 lg:right-4">
        <img src={`${P}/tea-pot.webp`} alt="Tea Pot" className="w-[170px] md:w-[280px] lg:w-[170px]" />
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.4 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.8 }}
        className="pointer-events-none absolute bottom-6 left-[-20px] select-none">
        <img src={`${P}/folding-fan.webp`} alt="Fan" className="w-[130px] md:w-[250px] lg:w-[130px]" />
      </motion.div>
      <EventContent event={event} inView={inView} />
    </section>
  )
}

function ReceptionScene({ event }: { event: EventData }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref}
      style={{ backgroundImage: `url(${P}/bg-9.webp)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      className="relative grid h-screen w-full select-none place-items-center overflow-hidden">
      <div className="absolute right-5 top-[140px] w-[80px] md:w-[120px] lg:w-[80px] pointer-events-none z-10 animate-butterfly">
        <img src={`${P}/butterfly-blue.webp`} alt="butterfly" className="w-full" />
      </div>
      <div className="absolute bottom-[50%] left-[70px] w-[50px] md:w-[80px] lg:w-[50px] pointer-events-none z-10 animate-butterfly" style={{ animationDelay: '2s' }}>
        <img src={`${P}/butterfly-pink.webp`} alt="butterfly" className="w-full" />
      </div>
      <motion.div initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1 }}
        className="pointer-events-none absolute bottom-[250px] right-2 z-40 select-none">
        <img src={`${P}/bird-1.webp`} alt="Dove" className="w-[90px] md:w-[100px] lg:w-[90px]" />
      </motion.div>
      <img src={`${P}/gazebo.webp`} alt="Gazebo" className="pointer-events-none absolute bottom-4 right-8 z-30 w-[120px] md:w-[220px] lg:w-[120px] select-none" />
      <img src={`${P}/chair.webp`} alt="Chair" className="pointer-events-none absolute bottom-4 right-40 z-30 w-[80px] md:w-[140px] lg:w-[80px] select-none" />
      <img src={`${P}/flower-bush.webp`} alt="Bush" className="pointer-events-none absolute bottom-12 right-20 z-20 w-[210px] md:w-[370px] lg:w-[210px] select-none" />
      <img src={`${P}/tree.webp`} alt="Tree" className="pointer-events-none absolute bottom-4 left-[-190px] z-10 w-[350px] md:w-[500px] lg:w-[350px] select-none" />
      <img src={`${P}/flower-3.webp`} alt="Flower" className="pointer-events-none absolute bottom-[-130px] left-[-130px] z-30 w-[300px] md:w-[420px] lg:w-[300px] select-none" />
      <img src={`${P}/grass-bot.webp`} alt="Grass" className="pointer-events-none absolute bottom-0 left-0 w-full select-none" />
      <EventContent event={event} inView={inView} />
    </section>
  )
}

function EventContent({ event, inView }: { event: EventData; inView: boolean }) {
  return (
    <div className="!mt-[-150px] relative z-50 flex flex-col items-center justify-center gap-5 md:gap-8">
      <motion.h2 variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
        className="whitespace-pre-line text-center font-michelia text-[44px] leading-[50px] text-[#775D34] md:text-[64px] md:leading-[70px] lg:text-[44px] lg:leading-[50px]">
        {event.title}
      </motion.h2>
      <div className="ml-5 flex items-center justify-center gap-4 md:ml-8 lg:ml-5">
        <motion.p variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="text-center font-cormorant text-xl text-[#555] md:text-2xl lg:text-xl">{event.day}</motion.p>
        <div className="flex flex-col items-center justify-center">
          <motion.p variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            className="text-center font-cormorant text-xl text-[#555]">{event.month}</motion.p>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}
            className="my-[-24px] text-center font-cormorantSemiBold text-[90px] text-[#555] md:text-[110px] lg:text-[90px]">{event.date}</motion.div>
          <motion.p variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            className="text-center font-cormorant text-xl text-[#555]">{event.year}</motion.p>
        </div>
        <motion.p variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="whitespace-pre-line text-left font-cormorant text-base text-[#555] md:text-2xl lg:text-base">{event.time}</motion.p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <motion.p variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="whitespace-pre-line text-center font-cormorantSemiBold text-xl leading-[26px] text-[#555]">{event.venue}</motion.p>
        <motion.p variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="max-w-80 text-center font-cormorant text-[#000] md:max-w-[420px] md:text-lg">{event.address}</motion.p>
      </div>
      {event.mapsUrl && (
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <a className="flex items-center gap-2 rounded-full border border-gray-500 bg-white/60 px-4 py-[2px] text-lg shadow-lg font-cormorant text-[#555]"
            href={event.mapsUrl} target="_blank" rel="noreferrer">
            <svg viewBox="0 0 64 64" className="w-[18px] fill-gray-500">
              <path d="M32,0C18.746,0,8,10.746,8,24c0,5.219,1.711,10.008,4.555,13.93c0.051,0.094,0.059,0.199,0.117,0.289l16,24C29.414,63.332,30.664,64,32,64s2.586-0.668,3.328-1.781l16-24c0.059-0.09,0.066-0.195,0.117-0.289C54.289,34.008,56,29.219,56,24C56,10.746,45.254,0,32,0z M32,32c-4.418,0-8-3.582-8-8s3.582-8,8-8s8,3.582,8,8S36.418,32,32,32z"/>
            </svg>
            See maps
          </a>
        </motion.div>
      )}
    </div>
  )
}

export default function DreamLandEvents({ events }: Props) {
  const scenes = [HolyMatrimonyScene, TeaPaiScene, ReceptionScene]
  return (
    <>
      {events.map((event, i) => {
        const Scene = scenes[i % scenes.length]
        return <Scene key={i} event={event} />
      })}
    </>
  )
}
