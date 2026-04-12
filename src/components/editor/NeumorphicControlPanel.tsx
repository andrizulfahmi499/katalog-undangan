'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Type,
  Palette,
  Image as ImageIcon,
  Layers,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
} from 'lucide-react'

interface Section {
  id: string
  label: string
  enabled: boolean
}

interface ControlPanelProps {
  sections: Section[]
  onToggleSection: (id: string) => void
  onAddSection: () => void
  onDeleteSection: (id: string) => void
  onTextChange: (field: string, value: string) => void
  onColorChange: (field: string, value: string) => void
  onImageUpload: (file: File) => void
  formData: any
}

export default function NeumorphicControlPanel({
  sections,
  onToggleSection,
  onAddSection,
  onDeleteSection,
  onTextChange,
  onColorChange,
  onImageUpload,
  formData,
}: ControlPanelProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('text')

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId)
  }

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-[#E0E5EC] to-[#F0F4F8] rounded-3xl p-6 shadow-lg">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#2D3436] mb-2">Editor Undangan</h2>
        <p className="text-sm text-[#A3B1C6]">Customize setiap detail undangan Anda</p>
      </div>

      {/* Text Editor Section */}
      <motion.div
        className="mb-6 rounded-2xl bg-[#F0F4F8] p-5 shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF]"
        initial={false}
      >
        <button
          onClick={() => toggleSection('text')}
          className="w-full flex items-center justify-between text-[#2D3436] hover:text-[#6C5CE7] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#E0E5EC] shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]">
              <Type className="w-5 h-5 text-[#6C5CE7]" />
            </div>
            <span className="font-semibold">Text Editor</span>
          </div>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${expandedSection === 'text' ? 'rotate-180' : ''}`}
          />
        </button>

        {expandedSection === 'text' && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2D3436] mb-2">Judul Undangan</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => onTextChange('title', e.target.value)}
                placeholder="Masukkan judul..."
                className="w-full px-4 py-3 rounded-2xl bg-[#E0E5EC] text-[#2D3436] placeholder-[#A3B1C6] outline-none shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] focus:shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2D3436] mb-2">Nama Acara</label>
              <input
                type="text"
                value={formData.eventName}
                onChange={(e) => onTextChange('eventName', e.target.value)}
                placeholder="Resepsi Pernikahan..."
                className="w-full px-4 py-3 rounded-2xl bg-[#E0E5EC] text-[#2D3436] placeholder-[#A3B1C6] outline-none shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] focus:shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2D3436] mb-2">Lokasi</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => onTextChange('location', e.target.value)}
                placeholder="Bali, Indonesia..."
                className="w-full px-4 py-3 rounded-2xl bg-[#E0E5EC] text-[#2D3436] placeholder-[#A3B1C6] outline-none shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] focus:shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF] transition-all"
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Color Picker Section */}
      <motion.div
        className="mb-6 rounded-2xl bg-[#F0F4F8] p-5 shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF]"
        initial={false}
      >
        <button
          onClick={() => toggleSection('color')}
          className="w-full flex items-center justify-between text-[#2D3436] hover:text-[#6C5CE7] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#E0E5EC] shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]">
              <Palette className="w-5 h-5 text-[#6C5CE7]" />
            </div>
            <span className="font-semibold">Warna</span>
          </div>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${expandedSection === 'color' ? 'rotate-180' : ''}`}
          />
        </button>

        {expandedSection === 'color' && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2D3436] mb-3">Warna Utama</label>
              <div className="grid grid-cols-6 gap-3">
                {['#6C5CE7', '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181'].map((color) => (
                  <button
                    key={color}
                    onClick={() => onColorChange('primaryColor', color)}
                    className="w-full aspect-square rounded-2xl transition-all shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[3px_3px_6px_#A3B1C6,-3px_-3px_6px_#FFFFFF]"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2D3436] mb-2">Warna Background</label>
              <input
                type="color"
                value={formData.backgroundColor || '#FFFFFF'}
                onChange={(e) => onColorChange('backgroundColor', e.target.value)}
                className="w-full h-12 rounded-2xl cursor-pointer border-none shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]"
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Image Upload Section */}
      <motion.div
        className="mb-6 rounded-2xl bg-[#F0F4F8] p-5 shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF]"
        initial={false}
      >
        <button
          onClick={() => toggleSection('image')}
          className="w-full flex items-center justify-between text-[#2D3436] hover:text-[#6C5CE7] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#E0E5EC] shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]">
              <ImageIcon className="w-5 h-5 text-[#6C5CE7]" />
            </div>
            <span className="font-semibold">Gambar</span>
          </div>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${expandedSection === 'image' ? 'rotate-180' : ''}`}
          />
        </button>

        {expandedSection === 'image' && (
          <div className="mt-4">
            <label className="block">
              <div className="border-2 border-dashed border-[#A3B1C6] rounded-2xl p-6 text-center cursor-pointer hover:border-[#6C5CE7] transition-colors bg-[#E0E5EC] shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF]">
                <ImageIcon className="w-8 h-8 text-[#A3B1C6] mx-auto mb-2" />
                <p className="text-sm font-medium text-[#2D3436]">Upload Gambar</p>
                <p className="text-xs text-[#A3B1C6] mt-1">Drag & drop atau klik untuk memilih</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && onImageUpload(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>
        )}
      </motion.div>

      {/* Section Manager */}
      <motion.div
        className="rounded-2xl bg-[#F0F4F8] p-5 shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF]"
        initial={false}
      >
        <button
          onClick={() => toggleSection('sections')}
          className="w-full flex items-center justify-between text-[#2D3436] hover:text-[#6C5CE7] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#E0E5EC] shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]">
              <Layers className="w-5 h-5 text-[#6C5CE7]" />
            </div>
            <span className="font-semibold">Bagian</span>
          </div>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${expandedSection === 'sections' ? 'rotate-180' : ''}`}
          />
        </button>

        {expandedSection === 'sections' && (
          <div className="mt-4 space-y-3">
            {sections.map((section) => (
              <div
                key={section.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#E0E5EC] shadow-[3px_3px_6px_#A3B1C6,-3px_-3px_6px_#FFFFFF]"
              >
                <div className="flex items-center gap-3 flex-1">
                  <button
                    onClick={() => onToggleSection(section.id)}
                    className={`p-2 rounded-lg transition-all ${
                      section.enabled
                        ? 'bg-[#6C5CE7] text-white shadow-[4px_4px_8px_rgba(108,92,231,0.3),-4px_-4px_8px_#FFFFFF]'
                        : 'bg-[#E0E5EC] text-[#A3B1C6] shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]'
                    }`}
                  >
                    {section.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <span className="text-sm font-medium text-[#2D3436]">{section.label}</span>
                </div>
                <button
                  onClick={() => onDeleteSection(section.id)}
                  className="p-2 rounded-lg bg-[#E0E5EC] text-[#A3B1C6] hover:text-red-500 transition-colors shadow-[3px_3px_6px_#A3B1C6,-3px_-3px_6px_#FFFFFF]"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={onAddSection}
              className="w-full mt-3 py-3 rounded-xl bg-[#E0E5EC] text-[#6C5CE7] font-semibold flex items-center justify-center gap-2 shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[3px_3px_6px_#A3B1C6,-3px_-3px_6px_#FFFFFF] transition-all active:shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF]"
            >
              <Plus className="w-4 h-4" /> Tambah Bagian
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
