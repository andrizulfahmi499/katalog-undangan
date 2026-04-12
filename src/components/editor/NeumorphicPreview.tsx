'use client'

import { motion } from 'framer-motion'
import { Heart, Calendar, MapPin, Share2, Eye } from 'lucide-react'

interface PreviewProps {
  formData: any
  sections: any[]
  onPreviewMode?: () => void
  onShare?: () => void
}

export default function NeumorphicPreview({
  formData,
  sections,
  onPreviewMode,
  onShare,
}: PreviewProps) {
  const enabledSections = sections.filter((s) => s.enabled)

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-[#E0E5EC] to-[#F0F4F8] rounded-3xl p-6 shadow-lg">
      {/* Preview Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="rounded-3xl bg-[#F0F4F8] p-6 shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF] min-h-[600px] flex flex-col"
      >
        {/* Preview Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#A3B1C6] font-semibold">Preview Undangan</p>
            <h3 className="text-xl font-bold text-[#2D3436] mt-1">{formData.title || 'Undangan Anda'}</h3>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPreviewMode}
              className="p-3 rounded-xl bg-[#E0E5EC] text-[#6C5CE7] shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[3px_3px_6px_#A3B1C6,-3px_-3px_6px_#FFFFFF] transition-all active:shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF]"
            >
              <Eye className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShare}
              className="p-3 rounded-xl bg-[#E0E5EC] text-[#6C5CE7] shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[3px_3px_6px_#A3B1C6,-3px_-3px_6px_#FFFFFF] transition-all active:shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF]"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Invitation Card */}
        <motion.div
          className="flex-1 rounded-2xl bg-white p-8 shadow-[6px_6px_12px_rgba(163,177,198,0.2),-6px_-6px_12px_rgba(255,255,255,0.8)]"
          style={{
            backgroundColor: formData.backgroundColor || '#FFFFFF',
          }}
        >
          {/* Opening Section */}
          {enabledSections.some((s) => s.id === 'opening') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8 pb-8 border-b-2 border-[#E0E5EC]"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#6C5CE7]/10 mb-4">
                <Heart className="w-6 h-6 text-[#6C5CE7]" />
              </div>
              <h1 className="text-3xl font-bold text-[#2D3436] mb-2">{formData.title}</h1>
              <p className="text-[#A3B1C6] text-sm">Dengan hormat mengundang Anda</p>
            </motion.div>
          )}

          {/* Event Section */}
          {enabledSections.some((s) => s.id === 'event') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8 pb-8 border-b-2 border-[#E0E5EC]"
            >
              <h2 className="text-lg font-semibold text-[#2D3436] mb-4">{formData.eventName}</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#6C5CE7]/10">
                    <Calendar className="w-5 h-5 text-[#6C5CE7]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#A3B1C6] uppercase tracking-wider">Tanggal</p>
                    <p className="text-sm font-semibold text-[#2D3436]">{formData.eventDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#6C5CE7]/10">
                    <MapPin className="w-5 h-5 text-[#6C5CE7]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#A3B1C6] uppercase tracking-wider">Lokasi</p>
                    <p className="text-sm font-semibold text-[#2D3436]">{formData.location}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Gallery Section */}
          {enabledSections.some((s) => s.id === 'gallery') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 pb-8 border-b-2 border-[#E0E5EC]"
            >
              <h3 className="text-lg font-semibold text-[#2D3436] mb-4">Galeri</h3>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl bg-gradient-to-br from-[#6C5CE7]/20 to-[#6C5CE7]/5 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] flex items-center justify-center"
                  >
                    <span className="text-xs text-[#A3B1C6]">Foto {i}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* RSVP Section */}
          {enabledSections.some((s) => s.id === 'rsvp') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8 pb-8 border-b-2 border-[#E0E5EC]"
            >
              <h3 className="text-lg font-semibold text-[#2D3436] mb-4">RSVP</h3>
              <div className="space-y-2">
                <button className="w-full py-3 rounded-xl bg-[#6C5CE7] text-white font-semibold shadow-[4px_4px_8px_rgba(108,92,231,0.3),-4px_-4px_8px_#FFFFFF] hover:shadow-[3px_3px_6px_rgba(108,92,231,0.4),-3px_-3px_6px_#FFFFFF] transition-all active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
                  Konfirmasi Kehadiran
                </button>
              </div>
            </motion.div>
          )}

          {/* Gift Section */}
          {enabledSections.some((s) => s.id === 'gift') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8 pb-8 border-b-2 border-[#E0E5EC]"
            >
              <h3 className="text-lg font-semibold text-[#2D3436] mb-4">Hadiah</h3>
              <p className="text-sm text-[#A3B1C6] mb-4">Kirim hadiah Anda melalui link di bawah</p>
              <button className="w-full py-3 rounded-xl bg-[#E0E5EC] text-[#6C5CE7] font-semibold shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[3px_3px_6px_#A3B1C6,-3px_-3px_6px_#FFFFFF] transition-all active:shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF]">
                Kirim Hadiah
              </button>
            </motion.div>
          )}

          {/* Thanks Section */}
          {enabledSections.some((s) => s.id === 'thanks') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <p className="text-sm text-[#A3B1C6] mb-2">Terima kasih atas kehadiran Anda</p>
              <p className="text-lg font-semibold text-[#2D3436]">Wassalamu'alaikum Warahmatullahi Wabarakatuh</p>
            </motion.div>
          )}
        </motion.div>

        {/* Preview Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-[#A3B1C6] uppercase tracking-wider">Real-time Preview</p>
          <p className="text-xs text-[#A3B1C6] mt-1">Perubahan akan ditampilkan secara otomatis</p>
        </div>
      </motion.div>
    </div>
  )
}
