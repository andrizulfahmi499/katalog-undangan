'use client'

import { useMemo } from 'react'

const P = '/templates/royal-garden'

const PETAL_IMAGES = [
  `${P}/flw3.webp`,
  `${P}/flw9.webp`,
  `${P}/flwwwwwwwwww4.webp`,
]

export default function RoyalGardenFloatingElements() {
  const petals = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: 8 + Math.random() * 10,
      delay: Math.random() * 8,
      size: 16 + Math.random() * 20,
      image: PETAL_IMAGES[i % PETAL_IMAGES.length],
      opacity: 0.3 + Math.random() * 0.3,
    }))
  }, [])

  return (
    <div className="fixed inset-0 z-[80] pointer-events-none overflow-hidden">
      {petals.map((p) => (
        <img
          key={p.id}
          src={p.image}
          alt=""
          className="absolute rg-petal"
          style={{
            left: p.left,
            top: '-40px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
            objectFit: 'contain',
          }}
        />
      ))}

      {/* Butterflies */}
      <img
        src={`${P}/rus.webp`}
        alt=""
        className="absolute rg-butterfly"
        style={{ top: '15%', left: '10%', width: '30px', opacity: 0.5 }}
      />
      <img
        src={`${P}/rus.webp`}
        alt=""
        className="absolute rg-butterfly"
        style={{ top: '40%', right: '8%', width: '24px', opacity: 0.4, animationDelay: '3s' }}
      />
      <img
        src={`${P}/rus.webp`}
        alt=""
        className="absolute rg-butterfly"
        style={{ top: '70%', left: '20%', width: '28px', opacity: 0.35, animationDelay: '6s' }}
      />
    </div>
  )
}
