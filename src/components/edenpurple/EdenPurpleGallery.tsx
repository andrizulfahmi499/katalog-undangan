'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect, useCallback } from 'react'

const P = '/templates/eden/images'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
}

const STORAGE_KEY_PREFIX = 'eden-gallery-'
const MAX_PHOTOS = 12

interface Props {
  invitationId: string
  editable?: boolean
  photos?: string[]
}

function getStorageKey(id: string) { return `${STORAGE_KEY_PREFIX}${id}` }

function loadPhotos(id: string): string[] {
  if (typeof window === 'undefined') return []
  try { const r = localStorage.getItem(getStorageKey(id)); if (r) return JSON.parse(r) } catch {}
  return []
}

function savePhotos(id: string, photos: string[]) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(getStorageKey(id), JSON.stringify(photos)) } catch {}
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const DEFAULT_PHOTOS = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
  'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80',
  'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&q=80',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80',
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80',
]

export default function EdenPurpleGallery({ invitationId, editable = false, photos: passedPhotos }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [photos, setPhotos] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (passedPhotos && passedPhotos.length > 0) { setPhotos(passedPhotos); return }
    const stored = loadPhotos(invitationId)
    setPhotos(stored.length > 0 ? stored : DEFAULT_PHOTOS)
  }, [invitationId, passedPhotos])

  const handleUpload = useCallback(async (files: FileList | null, replaceIndex?: number) => {
    if (!files || files.length === 0) return
    const newPhotos = [...photos]
    for (let i = 0; i < files.length; i++) {
      if (!files[i].type.startsWith('image/')) continue
      const base64 = await fileToBase64(files[i])
      if (replaceIndex !== undefined && replaceIndex !== null) { newPhotos[replaceIndex] = base64 }
      else if (newPhotos.length < MAX_PHOTOS) { newPhotos.push(base64) }
    }
    setPhotos(newPhotos)
    savePhotos(invitationId, newPhotos)
    setEditIndex(null)
  }, [photos, invitationId])

  const handleDelete = useCallback((index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index)
    setPhotos(newPhotos)
    savePhotos(invitationId, newPhotos)
  }, [photos, invitationId])

  const nextSlide = () => setCurrentIndex(prev => (prev + 1) % Math.max(1, photos.length))
  const prevSlide = () => setCurrentIndex(prev => (prev - 1 + photos.length) % Math.max(1, photos.length))

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center py-20"
      style={{ background: 'linear-gradient(180deg, #ede4f7 0%, #e8dff5 50%, #f5f0ff 100%)' }}
    >
      {/* Butterfly decorations */}
      <motion.div
        animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[8%] left-[5%] w-[40px] md:w-[60px] pointer-events-none z-20"
      >
        <img src={`${P}/butterfly-left.jpg`} alt="butterfly" className="w-full" />
      </motion.div>
      <motion.div
        animate={{ y: [0, -8, 0], x: [0, -5, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute top-[8%] right-[5%] w-[40px] md:w-[60px] pointer-events-none z-20"
      >
        <img src={`${P}/butterfly-right.jpg`} alt="butterfly" className="w-full" />
      </motion.div>

      {/* Bush decorations */}
      <img src={`${P}/bush-left.jpg`} alt="" className="absolute bottom-0 left-0 w-[180px] md:w-[280px] pointer-events-none select-none z-10" />
      <img src={`${P}/bush-right.jpg`} alt="" className="absolute bottom-0 right-0 w-[180px] md:w-[280px] pointer-events-none select-none z-10" />

      <div className="relative z-30 flex flex-col items-center gap-6 px-4 w-full max-w-lg">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-[#5b3a8c] text-3xl md:text-4xl font-bold text-center"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Cuplikan Kisah Kami
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-[#8b6db5] text-sm text-center"
          style={{ fontFamily: "'Urbanist', sans-serif" }}
        >
          {editable ? 'Klik foto untuk mengganti, atau tambah foto baru' : 'Galeri foto kami'}
        </motion.p>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={editIndex === null}
          className="hidden"
          onChange={(e) => handleUpload(e.target.files, editIndex ?? undefined)}
        />

        {/* Gallery carousel */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="relative w-full aspect-[3/4] max-w-sm rounded-2xl overflow-hidden shadow-xl"
        >
          {photos.length > 0 && (
            <>
              <img
                src={photos[currentIndex]}
                alt={`Gallery ${currentIndex + 1}`}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
              />

              {/* Navigation arrows */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={() => editable ? null : prevSlide()}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 flex items-center justify-center z-10 hover:bg-white transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 fill-[#5b3a8c]">
                      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => editable ? null : nextSlide()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 flex items-center justify-center z-10 hover:bg-white transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 fill-[#5b3a8c]">
                      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                    </svg>
                  </button>
                </>
              )}

              {/* Edit overlay */}
              {editable && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 hover:opacity-100 z-20">
                  <button
                    onClick={() => { setEditIndex(currentIndex); fileInputRef.current?.click() }}
                    className="p-2 rounded-full bg-white/90 text-[#5b3a8c] hover:bg-white transition-colors shadow-lg"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(currentIndex)}
                    className="p-2 rounded-full bg-red-500/90 text-white hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Dots indicator */}
              {photos.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {photos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </motion.div>

        {/* Thumbnail strip */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="flex gap-2 overflow-x-auto w-full pb-2"
        >
          {photos.map((photo, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                i === currentIndex ? 'border-[#9b6dd7] shadow-md' : 'border-transparent opacity-60'
              }`}
            >
              <img src={photo} alt="" className="w-full h-full object-cover" />
            </button>
          ))}

          {/* Add photo button */}
          {editable && photos.length < MAX_PHOTOS && (
            <button
              onClick={() => { setEditIndex(null); fileInputRef.current?.click() }}
              className="w-14 h-14 md:w-16 md:h-16 rounded-lg border-2 border-dashed border-[#9b6dd7]/40 flex items-center justify-center flex-shrink-0 hover:border-[#9b6dd7] transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#9b6dd7]/60">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
            </button>
          )}
        </motion.div>
      </div>
    </section>
  )
}
