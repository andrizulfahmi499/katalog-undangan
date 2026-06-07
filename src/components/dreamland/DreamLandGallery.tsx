'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect, useCallback } from 'react'

const P = '/templates/dream-land'
const fadeUp = {
  hidden: { opacity: 0, filter: 'blur(6px)', transform: 'scale(0.4)' },
  visible: { opacity: 1, filter: 'blur(0px)', transform: 'scale(1)', transition: { duration: 0.8 } },
}

const STORAGE_KEY_PREFIX = 'dreamland-gallery-'
const MAX_PHOTOS = 12

interface Props {
  invitationId: string
  editable?: boolean
  photos?: string[]
}

function getStorageKey(invitationId: string) {
  return `${STORAGE_KEY_PREFIX}${invitationId}`
}

function loadPhotosFromStorage(invitationId: string): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(getStorageKey(invitationId))
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

function savePhotosToStorage(invitationId: string, photos: string[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(getStorageKey(invitationId), JSON.stringify(photos))
  } catch (e) {
    console.warn('Failed to save gallery photos to localStorage:', e)
  }
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

export default function DreamLandGallery({ invitationId, editable = false, photos: passedPhotos }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [photos, setPhotos] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [editIndex, setEditIndex] = useState<number | null>(null)

  // Load photos from localStorage on mount or use passedPhotos
  useEffect(() => {
    if (passedPhotos && passedPhotos.length > 0) {
      setPhotos(passedPhotos)
      return
    }
    const stored = loadPhotosFromStorage(invitationId)
    if (stored.length > 0) {
      setPhotos(stored)
    } else {
      setPhotos(DEFAULT_PHOTOS)
    }
  }, [invitationId, passedPhotos])

  const handleUpload = useCallback(async (files: FileList | null, replaceIndex?: number) => {
    if (!files || files.length === 0) return
    const newPhotos = [...photos]

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!file.type.startsWith('image/')) continue
      // Compress if needed (max 800KB per image for localStorage limits)
      const base64 = await fileToBase64(file)

      if (replaceIndex !== undefined && replaceIndex !== null) {
        newPhotos[replaceIndex] = base64
      } else if (newPhotos.length < MAX_PHOTOS) {
        newPhotos.push(base64)
      }
    }

    setPhotos(newPhotos)
    savePhotosToStorage(invitationId, newPhotos)
    setEditIndex(null)
  }, [photos, invitationId])

  const handleDelete = useCallback((index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index)
    setPhotos(newPhotos)
    savePhotosToStorage(invitationId, newPhotos)
  }, [photos, invitationId])

  const handleAddClick = () => {
    setEditIndex(null)
    fileInputRef.current?.click()
  }

  const handleReplaceClick = (index: number) => {
    setEditIndex(index)
    fileInputRef.current?.click()
  }

  return (
    <section ref={ref} className="grid h-max min-h-screen w-full place-items-center"
      style={{ backgroundImage: `url(${P}/bg-2.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="mb-10 mt-28 flex w-full flex-col items-center justify-center px-6 md:px-10">
        <motion.h2 variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="select-none text-center font-michelia text-[60px] leading-[64px] text-[#775D34]">
          Portrait of Us
        </motion.h2>
        <motion.p variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="mb-6 select-none text-center font-cormorant text-lg text-[#777]">
          {editable ? 'Klik foto untuk mengganti, atau tambah foto baru' : 'Tap to see more'}
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

        <motion.div variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="grid h-max w-full grid-cols-2 gap-2 md:gap-4">
          {photos.map((photo, i) => (
            <div key={i} className="aspect-square w-full rounded-lg relative overflow-hidden group">
              <button
                onClick={() => editable ? handleReplaceClick(i) : setLightbox(i)}
                className="w-full h-full"
              >
                <img alt={`Gallery ${i + 1}`} src={photo}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </button>

              {/* Edit overlay */}
              {editable && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleReplaceClick(i)}
                    className="p-2 rounded-full bg-white/90 text-[#775D34] hover:bg-white transition-colors shadow-lg"
                    title="Ganti foto"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(i)}
                    className="p-2 rounded-full bg-red-500/90 text-white hover:bg-red-600 transition-colors shadow-lg"
                    title="Hapus foto"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Add photo button */}
          {editable && photos.length < MAX_PHOTOS && (
            <button
              onClick={handleAddClick}
              className="aspect-square w-full rounded-lg border-2 border-dashed border-[#b1914f]/40 flex flex-col items-center justify-center gap-2 hover:border-[#b1914f] hover:bg-[#f6ead3]/30 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#b1914f]/60">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              <span className="font-cormorant text-sm text-[#b1914f]/60">Tambah Foto</span>
            </button>
          )}
        </motion.div>
      </div>

      {/* Lightbox (view only mode) */}
      {lightbox !== null && !editable && (
        <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center"
          onClick={() => setLightbox(null)}>
          <img src={photos[lightbox]} alt="" className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg" />
          <button className="absolute top-6 right-6 text-white text-3xl font-bold" onClick={() => setLightbox(null)}>×</button>
        </div>
      )}
    </section>
  )
}
