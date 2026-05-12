'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect, useCallback } from 'react'

const P = '/templates/dream-land'

const fadeUp = {
  hidden: { opacity: 0, filter: 'blur(6px)', transform: 'scale(0.4)' },
  visible: { opacity: 1, filter: 'blur(0px)', transform: 'scale(1)', transition: { duration: 0.8 } },
}

const STORAGE_KEY_GROOM = 'dreamland-groom-photo-'
const STORAGE_KEY_BRIDE = 'dreamland-bride-photo-'

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function loadPhoto(key: string): string | null {
  if (typeof window === 'undefined') return null
  try { return localStorage.getItem(key) } catch { return null }
}

function savePhoto(key: string, data: string) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(key, data) } catch (e) { console.warn('Save photo failed:', e) }
}

interface CoupleData {
  name: string
  parents: string
  instagram?: string
  photo?: string
}

interface Props {
  groom: CoupleData
  bride: CoupleData
  invitationId: string
  editable?: boolean
}

function PersonSection({
  person, isGroom, invitationId, editable,
}: {
  person: CoupleData; isGroom: boolean; invitationId: string; editable?: boolean
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const fileRef = useRef<HTMLInputElement>(null)
  const storageKey = `${isGroom ? STORAGE_KEY_GROOM : STORAGE_KEY_BRIDE}${invitationId}`

  const [photoSrc, setPhotoSrc] = useState<string>(
    person.photo || `${P}/${isGroom ? 'groom-illustration' : 'bride-illustration'}.webp`
  )

  useEffect(() => {
    const stored = loadPhoto(storageKey)
    if (stored) setPhotoSrc(stored)
  }, [storageKey])

  const handleUpload = useCallback(async (files: FileList | null) => {
    if (!files || !files[0]) return
    const base64 = await fileToBase64(files[0])
    setPhotoSrc(base64)
    savePhoto(storageKey, base64)
  }, [storageKey])

  return (
    <section
      ref={ref}
      className={`relative flex h-screen w-full select-none flex-col ${isGroom ? 'items-start justify-center' : 'items-end justify-center'}`}
      style={{ backgroundImage: `url(${P}/bg-1.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Hidden file input for photo upload */}
      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => handleUpload(e.target.files)} />

      {/* Butterfly */}
      <div className={`absolute ${isGroom ? 'right-7 top-[30%]' : 'left-[-70px] top-[22%]'} w-[70px] md:w-[100px] lg:w-[70px] pointer-events-none z-10 animate-butterfly`}>
        <img src={`${P}/${isGroom ? 'butterfly-blue' : 'butterfly-pink'}.webp`} alt="butterfly" className="w-full" />
      </div>

      {/* Tree */}
      <motion.div
        initial={{ opacity: 0, filter: 'blur(6px)', y: 40 }}
        animate={inView ? { opacity: 1, filter: 'blur(0px)', y: 0 } : {}}
        transition={{ duration: 1 }}
        className={`pointer-events-none absolute ${isGroom ? 'bottom-[100px] right-[-220px]' : 'bottom-[160px] left-[-260px]'} select-none`}
      >
        <img src={`${P}/tree.webp`} alt="Tree"
          className="pointer-events-none w-[400px] md:w-[620px] lg:w-[400px] select-none" />
      </motion.div>

      {/* Flowers */}
      <img src={`${P}/flower-3.webp`} alt=""
        className={`pointer-events-none absolute ${isGroom ? 'bottom-0 left-[-150px]' : 'bottom-[50px] right-[-50px]'} z-10 w-[200px] md:w-[270px] lg:w-[200px] select-none`} />
      <img src={`${P}/flower-white.webp`} alt=""
        className={`pointer-events-none absolute ${isGroom ? 'bottom-[-40px] right-[-60px]' : 'bottom-[0px] left-[-90px]'} z-20 w-[200px] md:w-[300px] lg:w-[200px] select-none`} />
      <img src={`${P}/flower-pink.webp`} alt=""
        className={`pointer-events-none absolute ${isGroom ? 'bottom-[-100px] right-[30px] md:right-[90px]' : 'bottom-[-60px] left-[-30px] md:left-[30px]'} z-40 w-[140px] md:w-[180px] lg:w-[140px] select-none`} />
      <img src={`${P}/flower-yellow.webp`} alt=""
        className={`pointer-events-none absolute ${isGroom ? 'bottom-[-80px] right-[60px] md:right-[140px]' : 'bottom-[-40px] left-[140px]'} z-30 w-[190px] md:w-[280px] lg:w-[190px] select-none`} />
      <img src={`${P}/flower-violet.webp`} alt=""
        className={`pointer-events-none absolute ${isGroom ? 'bottom-[-80px] right-[220px] md:right-[360px]' : 'bottom-[80px] left-[180px] md:left-[280px]'} z-20 w-[120px] md:w-[150px] lg:w-[120px] select-none`} />

      {!isGroom && (
        <>
          <img src={`${P}/flower-4.webp`} alt="" className="pointer-events-none absolute bottom-[50px] right-[-50px] z-10 w-[230px] md:w-[300px] lg:w-[230px] select-none" />
          <img src={`${P}/fence-wood.webp`} alt="" className="pointer-events-none absolute bottom-[-60px] right-[-140px] z-10 w-[220px] md:w-[260px] lg:w-[220px] select-none" />
          <img src={`${P}/fence-wood.webp`} alt="" className="pointer-events-none absolute bottom-[-60px] right-[65px] md:right-[105px] lg:right-[65px] z-10 w-[220px] md:w-[260px] lg:w-[220px] select-none" />
          <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1 }}
            className="pointer-events-none absolute bottom-0 left-0 select-none">
            <img src={`${P}/hill-bot.webp`} alt="" className="pointer-events-none w-full select-none" />
          </motion.div>
        </>
      )}

      {/* Text content */}
      <div className={`relative z-10 ${isGroom ? 'mt-[-200px] mx-9' : 'mt-[-120px] px-6 md:px-12 lg:px-6'} flex flex-col ${isGroom ? 'items-start' : 'items-end'} justify-center gap-3`}>
        {isGroom && (
          <motion.h2 variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            className="whitespace-pre-line text-center font-michelia text-[38px] leading-[50px] text-[#775D34] md:text-[56px] md:leading-[66px] lg:text-[38px] lg:leading-[50px]">
            {"Together\nwith Their Families"}
          </motion.h2>
        )}
        {isGroom && (
          <motion.p variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            className="mb-20 max-w-80 whitespace-pre-line text-center font-cormorant text-lg leading-6 text-[#555] md:mb-36 md:max-w-[600px] md:text-2xl lg:mb-14 lg:max-w-80 lg:text-lg">
            Request the honor of your presence at the wedding celebration
          </motion.p>
        )}

        <motion.h3 variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className={`max-w-80 whitespace-pre-line font-cormorant text-3xl leading-8 text-[#775D34] md:text-4xl lg:text-3xl ${!isGroom ? 'text-right' : ''}`}>
          {person.name}
        </motion.h3>

        <motion.p variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className={`max-w-80 whitespace-pre-line font-cormorant leading-5 text-[#555] md:text-xl lg:text-base ${!isGroom ? 'text-right' : ''}`}>
          {person.parents}
        </motion.p>

        <motion.div variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className={`h-[1px] w-52 bg-[#555] md:w-72 lg:w-52 ${!isGroom ? 'self-end' : 'self-start'}`} />

        {person.instagram && (
          <motion.a variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            href={person.instagram} target="_blank"
            className={`max-w-80 font-cormorant leading-5 text-[#555] md:text-xl lg:text-base ${!isGroom ? 'text-right' : ''}`}>
            @{person.instagram.replace(/.*instagram\.com\//, '').replace(/\/$/, '') || 'instagram'}
          </motion.a>
        )}
      </div>

      {/* Illustrated person with upload overlay */}
      <motion.div
        initial={{ opacity: 0, filter: 'blur(6px)', x: isGroom ? 40 : -40 }}
        animate={inView ? { opacity: 1, filter: 'blur(0px)', x: 0 } : {}}
        transition={{ duration: 1 }}
        className={`absolute ${isGroom ? 'bottom-0 right-[-50px]' : 'bottom-0 left-0'} h-[480px] w-[380px] overflow-hidden md:h-[550px] md:w-[480px] lg:h-[480px] lg:w-[380px] group`}
      >
        <img
          src={photoSrc}
          alt={isGroom ? "Groom" : "Bride"}
          className={`absolute bottom-[-80px] ${isGroom ? 'right-0 scale-x-[-1]' : 'left-0 md:left-[40px]'} w-[400px] md:w-[430px] object-contain`}
        />

        {/* Upload overlay for editable mode */}
        {editable && (
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors cursor-pointer"
          >
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-2 bg-white/90 rounded-2xl px-6 py-4 shadow-lg">
              <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#775D34]">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
              <span className="font-cormorant text-[#775D34] font-semibold">
                Ganti Foto {isGroom ? 'Mempelai Pria' : 'Mempelai Wanita'}
              </span>
            </div>
          </button>
        )}
      </motion.div>
    </section>
  )
}

export default function DreamLandCouple({ groom, bride, invitationId, editable }: Props) {
  return (
    <>
      <PersonSection person={groom} isGroom={true} invitationId={invitationId} editable={editable} />
      <PersonSection person={bride} isGroom={false} invitationId={invitationId} editable={editable} />
    </>
  )
}
