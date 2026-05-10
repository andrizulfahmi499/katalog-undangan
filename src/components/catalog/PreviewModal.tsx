'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Loader2 } from 'lucide-react'
import type { CatalogTheme } from '@/lib/catalogThemes'

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  theme: CatalogTheme | null
}

export default function PreviewModal({ isOpen, onClose, theme }: PreviewModalProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [mounted, setMounted] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen && theme) {
      setIsLoading(true)
      setHasError(false)
      timeoutRef.current = setTimeout(() => {
        setIsLoading(false)
        setHasError(true)
      }, 15000)
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [isOpen, theme])

  const handleIframeLoad = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsLoading(false)
    setHasError(false)
  }

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const modalContent = (
    <AnimatePresence>
      {isOpen && theme && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex flex-col items-center justify-center p-4"
          style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.7)' }}
          onClick={onClose}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-all"
            aria-label="Tutup preview"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Theme name */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white font-semibold text-sm bg-black/40 px-4 py-1.5 rounded-full">
            {theme.name}
          </div>

          {/* Phone mockup */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative"
            style={{ width: 320, height: 640 }}
          >
            {/* Phone frame */}
            <div className="absolute inset-0 rounded-[40px] border-[8px] border-gray-800 bg-gray-800 shadow-2xl overflow-hidden">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-800 rounded-b-2xl z-10" />

              {/* Screen */}
              <div className="absolute inset-0 rounded-[32px] overflow-hidden bg-white">
                {isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-10">
                    <Loader2 className="w-8 h-8 animate-spin text-rose-400 mb-3" />
                    <p className="text-sm text-gray-500">Memuat preview...</p>
                  </div>
                )}

                {hasError ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 p-6 text-center z-10">
                    <p className="text-sm text-gray-600 mb-4">Preview tidak dapat dimuat</p>
                    <a
                      href={theme.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Buka di tab baru
                    </a>
                  </div>
                ) : (
                  <iframe
                    src={theme.previewUrl}
                    className="w-full h-full border-0"
                    onLoad={handleIframeLoad}
                    title={`Preview ${theme.name}`}
                  />
                )}
              </div>
            </div>

            {/* Home button */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-600 rounded-full" />
          </motion.div>

          {/* Open in new tab link & Close Button */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full font-medium text-sm transition-colors border border-white/30 backdrop-blur-sm"
            >
              Tutup Preview
            </button>
            <a
              href={theme.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Buka di tab baru
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  if (!mounted) return null
  return createPortal(modalContent, document.body)
}
