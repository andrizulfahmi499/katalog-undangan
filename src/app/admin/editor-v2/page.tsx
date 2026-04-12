'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Save, Share2, Eye, ArrowLeft } from 'lucide-react'
import NeumorphicControlPanel from '@/components/editor/NeumorphicControlPanel'
import NeumorphicPreview from '@/components/editor/NeumorphicPreview'

interface Section {
  id: string
  label: string
  enabled: boolean
}

const DEFAULT_SECTIONS: Section[] = [
  { id: 'opening', label: 'Opening', enabled: true },
  { id: 'quotes', label: 'Quotes', enabled: true },
  { id: 'groom', label: 'Groom', enabled: true },
  { id: 'bride', label: 'Bride', enabled: true },
  { id: 'event', label: 'Event', enabled: true },
  { id: 'gallery', label: 'Gallery', enabled: true },
  { id: 'rsvp', label: 'RSVP', enabled: true },
  { id: 'gift', label: 'Gift', enabled: true },
  { id: 'thanks', label: 'Thanks', enabled: true },
]

export default function EditorV2Page() {
  const [sections, setSections] = useState<Section[]>(DEFAULT_SECTIONS)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState({
    title: 'Akbar & Madia',
    eventName: 'Resepsi Pernikahan',
    eventDate: new Date().toISOString().slice(0, 10),
    location: 'Bali, Indonesia',
    backgroundColor: '#FFFFFF',
    primaryColor: '#6C5CE7',
  })

  const handleTextChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleColorChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleImageUpload = useCallback((file: File) => {
    console.log('Image uploaded:', file.name)
    // TODO: Implement image upload to AWS S3
  }, [])

  const handleToggleSection = useCallback((id: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, enabled: !section.enabled } : section
      )
    )
  }, [])

  const handleAddSection = useCallback(() => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      label: 'Bagian Baru',
      enabled: true,
    }
    setSections((prev) => [...prev, newSection])
  }, [])

  const handleDeleteSection = useCallback((id: string) => {
    setSections((prev) => prev.filter((section) => section.id !== id))
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // TODO: Implement save to database
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccessMessage('Undangan berhasil disimpan!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handlePreviewMode = () => {
    // TODO: Implement full-screen preview mode
    console.log('Preview mode')
  }

  const handleShare = () => {
    // TODO: Implement share dialog
    console.log('Share')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0E5EC] via-[#F0F4F8] to-[#E0E5EC] py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <p className="text-sm uppercase tracking-widest text-[#6C5CE7] font-semibold">Editor Undangan</p>
            <h1 className="text-4xl font-bold text-[#2D3436] mt-2">Buat Undangan Digital</h1>
            <p className="text-[#A3B1C6] mt-2 max-w-2xl">
              Desain undangan modern dengan neumorphism style. Customize setiap detail dan lihat preview secara real-time.
            </p>
          </div>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/admin/dashboard'}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#E0E5EC] text-[#2D3436] font-semibold shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] hover:shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] transition-all active:shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF]"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </motion.button>
        </motion.div>

        {/* Main Editor Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6 mb-8"
        >
          {/* Control Panel */}
          <NeumorphicControlPanel
            sections={sections}
            onToggleSection={handleToggleSection}
            onAddSection={handleAddSection}
            onDeleteSection={handleDeleteSection}
            onTextChange={handleTextChange}
            onColorChange={handleColorChange}
            onImageUpload={handleImageUpload}
            formData={formData}
          />

          {/* Preview */}
          <NeumorphicPreview
            formData={formData}
            sections={sections}
            onPreviewMode={handlePreviewMode}
            onShare={handleShare}
          />
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-end"
        >
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePreviewMode}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#E0E5EC] text-[#6C5CE7] font-semibold shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] hover:shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] transition-all active:shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF]"
          >
            <Eye className="w-5 h-5" />
            Preview
          </motion.button>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#E0E5EC] text-[#6C5CE7] font-semibold shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] hover:shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] transition-all active:shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF]"
          >
            <Share2 className="w-5 h-5" />
            Share
          </motion.button>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-[#6C5CE7] to-[#7B68EE] text-white font-semibold shadow-[6px_6px_12px_rgba(108,92,231,0.3),-6px_-6px_12px_#FFFFFF] hover:shadow-[4px_4px_8px_rgba(108,92,231,0.4),-4px_-4px_8px_#FFFFFF] transition-all active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2),inset_-4px_-4px_8px_rgba(255,255,255,0.5)] disabled:opacity-60"
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </motion.button>
        </motion.div>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed bottom-8 right-8 px-6 py-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold shadow-lg"
          >
            {successMessage}
          </motion.div>
        )}
      </div>
    </div>
  )
}
