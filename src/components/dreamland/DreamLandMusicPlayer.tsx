'use client'

import { useState, useRef, useEffect } from 'react'

const DEFAULT_MUSIC = '/templates/dream-land/miracle-riley.mp3'

interface Props {
  musicUrl?: string
  accentColor?: string
  autoPlay?: boolean
}

export default function DreamLandMusicPlayer({
  musicUrl,
  accentColor = '#BABD91',
  autoPlay = true,
}: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const src = musicUrl?.trim() || DEFAULT_MUSIC

  useEffect(() => {
    if (!autoPlay) return
    // Try to auto-play immediately
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0.5
    const tryPlay = () => {
      audio.play().then(() => setIsPlaying(true)).catch(() => {
        // Browser blocks autoplay, wait for user interaction
        const resume = () => {
          audio.play().then(() => setIsPlaying(true)).catch(() => {})
          document.removeEventListener('click', resume)
          document.removeEventListener('touchstart', resume)
          document.removeEventListener('scroll', resume)
        }
        document.addEventListener('click', resume, { once: true })
        document.addEventListener('touchstart', resume, { once: true })
        document.addEventListener('scroll', resume, { once: true })
      })
    }
    // Small delay to ensure component is mounted
    const t = setTimeout(tryPlay, 300)
    return () => clearTimeout(t)
  }, [autoPlay])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {})
    }
  }

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" />
      <div
        className="fixed bottom-5 left-5 z-[120] grid h-12 w-12 place-items-center rounded-full shadow-lg"
        style={{ backgroundColor: accentColor }}
      >
        <button
          onClick={toggle}
          className="grid h-9 w-9 place-items-center rounded-full bg-gray-200/80 hover:bg-gray-200 transition-colors"
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" className="w-4 fill-[#656565]">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 32 32" className="w-4 fill-[#ff4a89]">
              <path d="M5.92 24.096q0 1.088 0.928 1.728 0.512 0.288 1.088 0.288 0.448 0 0.896-0.224l16.16-8.064q0.48-0.256 0.8-0.736t0.288-1.088-0.288-1.056-0.8-0.736l-16.16-8.064q-0.448-0.224-0.896-0.224-0.544 0-1.088 0.288-0.928 0.608-0.928 1.728v16.16z" />
            </svg>
          )}
        </button>
      </div>
    </>
  )
}
