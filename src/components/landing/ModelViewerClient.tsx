'use client'

import { useState, useEffect } from 'react'

interface ModelViewerClientProps {
  src: string
  alt: string
  poster?: string
}

export default function ModelViewerClient({ src, alt, poster }: ModelViewerClientProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    // Check if custom elements are supported
    if (typeof customElements === 'undefined' || !customElements.get('model-viewer')) {
      setIsSupported(false)
    }
  }, [])

  if (!isSupported) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[280px] gap-4">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-2 border-[#a8d5c4]/30 rounded-full animate-pulse" />
          <div className="absolute inset-2 border border-[#a8d5c4]/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute inset-4 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#a8d5c4]/60">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
        </div>
        <div className="text-center">
          <p className="text-white/80 text-sm font-medium mb-1">3D Model Preview</p>
          <p className="text-white/40 text-xs">Open on desktop for full 3D experience</p>
        </div>
        <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#a8d5c4]">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <span className="text-white/60 text-xs">Desktop Only</span>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[280px] gap-3">
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p className="text-white/60 text-sm">3D preview unavailable</p>
        <p className="text-white/30 text-xs">Try refreshing the page</p>
      </div>
    )
  }

  return (
    <div className="relative" style={{ height: '320px' }}>
      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-3 bg-black/40 backdrop-blur-sm rounded-full px-5 py-3">
            <div className="w-5 h-5 border-2 border-[#a8d5c4] border-t-transparent rounded-full animate-spin" />
            <span className="text-white/80 text-xs uppercase tracking-wider">Loading Model...</span>
          </div>
        </div>
      )}

      {/* @ts-ignore */}
      <model-viewer
        src={src}
        alt={alt}
        poster={poster}
        camera-controls
        auto-rotate
        auto-rotate-delay="1000"
        rotation-per-second="20deg"
        shadow-intensity="1"
        shadow-softness="1"
        environment-image="neutral"
        exposure="0.8"
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />

      {/* Interaction hint */}
      {isLoaded && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-4 py-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#a8d5c4]">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span className="text-white/60 text-xs">Drag to rotate • Pinch to zoom</span>
          </div>
        </div>
      )}
    </div>
  )
}