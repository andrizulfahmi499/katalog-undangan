'use client'

import { useState, useRef, useEffect } from 'react'

interface Props {
  musicUrl: string
  autoPlay?: boolean
}

export default function RoyalGardenMusicPlayer({ musicUrl, autoPlay = true }: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      const playPromise = audioRef.current.play()
      if (playPromise) {
        playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
      }
    }
  }, [autoPlay])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
    }
  }

  return (
    <>
      <audio ref={audioRef} src={musicUrl} loop preload="auto" />
      <button
        onClick={togglePlay}
        className="fixed bottom-6 left-6 z-[90] w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a96e] to-[#b8956a] text-white shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:scale-105"
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? (
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white animate-pulse">
            <path d="M9 4h2v16H9V4zm4 0h2v16h-2V4z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </>
  )
}
