'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, UploadCloud, AlertCircle, Image as ImageIcon, Trash2 } from 'lucide-react'

type BackgroundManagerModalProps = {
  isOpen: boolean
  onClose: () => void
  currentBgColor?: string
  currentBgImage?: string
  onSave: (bgColor: string, bgImageBase64: string) => void
}

export default function BackgroundManagerModal({
  isOpen,
  onClose,
  currentBgColor = '#FFFFFF',
  currentBgImage = '',
  onSave,
}: BackgroundManagerModalProps) {
  const [bgColor, setBgColor] = useState(currentBgColor)
  const [bgImageBase64, setBgImageBase64] = useState(currentBgImage)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const PRESET_COLORS = [
    '#FFFFFF', '#F8FAFC', '#FFF7ED', '#FDF2F8', '#F0FDF4',
    '#EFF6FF', '#1E293B', '#0F172A', '#1A0A2E', '#0C1A0E',
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Ukuran file maksimal 5 MB.')
      return
    }
    setUploadError('')
    setIsUploading(true)
    const reader = new FileReader()
    reader.onloadend = () => {
      setBgImageBase64(reader.result as string)
      setIsUploading(false)
    }
    reader.onerror = () => {
      setUploadError('Gagal membaca file.')
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      const fakeEvent = { target: { files: [file] } } as any
      handleFileChange(fakeEvent)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Background Undangan</h2>
              <p className="text-sm text-slate-500 mt-1">Atur latar belakang keseluruhan halaman undangan.</p>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50">
            {/* Alert */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700">Merubah background ini akan merubah keseluruhan background halaman undangan.</p>
            </div>

            {/* Warna Latar */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Warna Latar Belakang</h3>
              <div className="flex flex-wrap gap-3 mb-4">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setBgColor(color)}
                    className={`w-10 h-10 rounded-xl border-2 transition-all ${bgColor === color ? 'border-pink-500 scale-110 shadow-lg' : 'border-slate-200 hover:border-pink-300'}`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-10 rounded-lg cursor-pointer border border-slate-200"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  placeholder="#FFFFFF"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-200 outline-none text-sm font-mono"
                />
              </div>
            </div>

            {/* Upload Gambar */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Gambar Background (Opsional)</h3>

              {bgImageBase64 ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img src={bgImageBase64} alt="Background Preview" className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-white text-slate-800 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
                    >
                      Ganti
                    </button>
                    <button
                      onClick={() => setBgImageBase64('')}
                      className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 bg-white rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:border-pink-300 hover:bg-pink-50/30 transition-colors cursor-pointer group"
                >
                  <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-pink-100 group-hover:text-pink-500 transition-colors mb-3">
                    {isUploading ? (
                      <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <UploadCloud className="w-7 h-7" />
                    )}
                  </div>
                  <p className="text-sm font-medium text-slate-700">{isUploading ? 'Memproses...' : 'Klik atau seret gambar ke sini'}</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP — Maks. 5 MB</p>
                </div>
              )}

              {uploadError && (
                <p className="text-sm text-red-500 mt-2 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> {uploadError}
                </p>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Preview */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Pratinjau</h3>
              <div
                className="w-full h-32 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center relative overflow-hidden"
                style={{
                  backgroundColor: bgColor,
                  backgroundImage: bgImageBase64 ? `url(${bgImageBase64})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {!bgImageBase64 && (
                  <div className="flex flex-col items-center gap-1 text-slate-400">
                    <ImageIcon className="w-6 h-6" />
                    <span className="text-xs">Pratinjau Background</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-slate-100 bg-white flex justify-end gap-3">
            <button onClick={onClose} className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors">
              Batal
            </button>
            <button
              onClick={() => onSave(bgColor, bgImageBase64)}
              className="px-8 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-pink-500/20"
            >
              Simpan Perubahan
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
