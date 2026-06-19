'use client'

import { useState, useRef, useEffect } from 'react'

const DEFAULT_MUSIC = '/templates/eden/audio.mp3'

interface Props {
  musicUrl?: string
  autoPlay?: boolean
}

export default function EdenPurpleMusicPlayer({ musicUrl, autoPlay = true }: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const src = musicUrl?.trim() || DEFAULT_MUSIC

  useEffect(() => {
    if (!autoPlay) return
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0.5
    const tryPlay = () => {
      audio.play().then(() => setIsPlaying(true)).catch(() => {
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
    const t = setTimeout(tryPlay, 300)
    return () => clearTimeout(t)
  }, [autoPlay])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) { audio.pause(); setIsPlaying(false) }
    else { audio.play().then(() => setIsPlaying(true)).catch(() => {}) }
  }

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" />
      <div className="fixed bottom-5 left-5 z-[120]">
        <button
          onClick={toggle}
          className="grid h-12 w-12 place-items-center rounded-full shadow-lg transition-transform hover:scale-110"
          style={{ background: 'linear-gradient(135deg, #9b6dd7 0%, #7c4dbd 100%)' }}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" className="w-5 fill-white">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-5 fill-white">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>
    </>
  )
}
