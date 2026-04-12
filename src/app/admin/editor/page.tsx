'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Copy,
  Link as LinkIcon,
  Save,
  Eye,
  Share2,
  Plus,
  Type,
  Palette,
  Image as ImageIcon,
  Layers,
  Trash2,
  EyeOff,
  ChevronDown,
} from 'lucide-react'
import { TEMPLATE_OPTIONS, type TemplateOption } from '@/lib/invitationTemplates'

type Member = {
  id: string
  name: string
  email: string
  whatsapp: string
  creditPoints: number
  status: string
}

type SectionItem = {
  id: string
  label: string
  enabled: boolean
}

export default function AdminEditorPage() {
  const [adminId, setAdminId] = useState<string>('')
  const [members, setMembers] = useState<Member[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(TEMPLATE_OPTIONS[0].id)
  const [createdInvitation, setCreatedInvitation] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [form, setForm] = useState({
    title: 'Akbar & Madia',
    eventName: 'Resepsi Pernikahan',
    eventDate: new Date().toISOString().slice(0, 10),
    location: 'Bali, Indonesia',
    invitationLink: '',
    templateMessage: TEMPLATE_OPTIONS[0].defaultMessage,
    assignedMemberId: '',
    costPoints: 20,
    backgroundColor: '#FFFFFF',
    primaryColor: '#6C5CE7',
  })

  const [sections, setSections] = useState<SectionItem[]>([
    { id: 'opening', label: 'Opening', enabled: true },
    { id: 'quotes', label: 'Quotes', enabled: true },
    { id: 'groom', label: 'Groom', enabled: true },
    { id: 'bride', label: 'Bride', enabled: true },
    { id: 'event', label: 'Event', enabled: true },
    { id: 'maps', label: 'Maps', enabled: false },
    { id: 'countdown', label: 'Countdown', enabled: true },
    { id: 'yangMengundang', label: 'Yang Mengundang', enabled: true },
    { id: 'turutMengundang', label: 'Turut Mengundang', enabled: true },
    { id: 'gallery', label: 'Gallery', enabled: true },
    { id: 'rsvp', label: 'RSVP', enabled: true },
    { id: 'gift', label: 'Gift', enabled: true },
    { id: 'thanks', label: 'Thanks', enabled: true },
  ])

  const currentTemplate = useMemo(
    () => TEMPLATE_OPTIONS.find((template) => template.id === selectedTemplateId) ?? TEMPLATE_OPTIONS[0],
    [selectedTemplateId]
  )

  useEffect(() => {
    const storedAdminId = localStorage.getItem('adminId')
    if (!storedAdminId) {
      window.location.href = '/login'
      return
    }
    setAdminId(storedAdminId)
  }, [])

  useEffect(() => {
    if (adminId) {
      fetchMembers()
    }
  }, [adminId])

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      templateMessage: currentTemplate.defaultMessage,
    }))
  }, [currentTemplate.id])

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/admin/members?_t=' + Date.now(), { cache: 'no-store' })
      const data = await response.json()
      if (data.success) {
        setMembers(data.data)
        if (!form.assignedMemberId && data.data.length > 0) {
          setForm((prev) => ({ ...prev, assignedMemberId: data.data[0].id }))
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleChange = (key: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleTextChange = useCallback((field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleColorChange = useCallback((field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleToggleSection = useCallback((id: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, enabled: !section.enabled } : section
      )
    )
  }, [])

  const handleTemplateSelect = (id: string) => {
    setSelectedTemplateId(id)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSaving(true)
    setError('')
    setSuccessMessage('')
    setCreatedInvitation(null)

    if (!form.assignedMemberId) {
      setError('Pilih member yang akan menerima undangan terlebih dahulu.')
      setIsSaving(false)
      return
    }

    try {
      const payload: any = {
        title: form.title,
        eventName: form.eventName,
        eventDate: form.eventDate,
        location: form.location,
        templateMessage: form.templateMessage,
        templateId: selectedTemplateId,
        costPoints: form.costPoints,
        assignedMemberId: form.assignedMemberId,
        createdById: adminId,
      }

      if (form.invitationLink.trim()) {
        payload.invitationLink = form.invitationLink.trim()
      }

      const response = await fetch('/api/admin/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        setError(data.error || 'Gagal menyimpan undangan. Periksa kembali data Anda.')
      } else {
        setSuccessMessage('Undangan berhasil disimpan!')
        setCreatedInvitation(data.data)
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan undangan')
    } finally {
      setIsSaving(false)
    }
  }

  const copyShareLink = async () => {
    const link = createdInvitation?.invitationLink || (form.invitationLink.trim() ? form.invitationLink.trim() : `${window.location.origin}/invitation/preview`)
    if (!link) return
    await navigator.clipboard.writeText(link)
    setSuccessMessage('Link undangan berhasil disalin.')
  }

  // NEUMORPHIC EDITOR UI
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
          <div className="h-full overflow-y-auto bg-gradient-to-br from-[#E0E5EC] to-[#F0F4F8] rounded-3xl p-6 shadow-lg">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#2D3436] mb-2">Editor Undangan</h2>
              <p className="text-sm text-[#A3B1C6]">Customize setiap detail undangan Anda</p>
            </div>

            {/* Text Editor Section */}
            <div className="mb-6 rounded-2xl bg-[#F0F4F8] p-5 shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#E0E5EC] shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]">
                  <Type className="w-5 h-5 text-[#6C5CE7]" />
                </div>
                <span className="font-semibold text-[#2D3436]">Text Editor</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#2D3436] mb-2">Judul Undangan</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => handleTextChange('title', e.target.value)}
                    placeholder="Masukkan judul..."
                    className="w-full px-4 py-3 rounded-2xl bg-[#E0E5EC] text-[#2D3436] placeholder-[#A3B1C6] outline-none shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] focus:shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2D3436] mb-2">Nama Acara</label>
                  <input
                    type="text"
                    value={form.eventName}
                    onChange={(e) => handleTextChange('eventName', e.target.value)}
                    placeholder="Resepsi Pernikahan..."
                    className="w-full px-4 py-3 rounded-2xl bg-[#E0E5EC] text-[#2D3436] placeholder-[#A3B1C6] outline-none shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] focus:shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2D3436] mb-2">Lokasi</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => handleTextChange('location', e.target.value)}
                    placeholder="Bali, Indonesia..."
                    className="w-full px-4 py-3 rounded-2xl bg-[#E0E5EC] text-[#2D3436] placeholder-[#A3B1C6] outline-none shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] focus:shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Color Picker Section */}
            <div className="mb-6 rounded-2xl bg-[#F0F4F8] p-5 shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#E0E5EC] shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]">
                  <Palette className="w-5 h-5 text-[#6C5CE7]" />
                </div>
                <span className="font-semibold text-[#2D3436]">Warna</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#2D3436] mb-3">Warna Utama</label>
                  <div className="grid grid-cols-6 gap-3">
                    {['#6C5CE7', '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181'].map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorChange('primaryColor', color)}
                        className="w-full aspect-square rounded-2xl transition-all shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[3px_3px_6px_#A3B1C6,-3px_-3px_6px_#FFFFFF]"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section Manager */}
            <div className="rounded-2xl bg-[#F0F4F8] p-5 shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#E0E5EC] shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]">
                  <Layers className="w-5 h-5 text-[#6C5CE7]" />
                </div>
                <span className="font-semibold text-[#2D3436]">Bagian</span>
              </div>
              
              <div className="space-y-3">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#E0E5EC] shadow-[3px_3px_6px_#A3B1C6,-3px_-3px_6px_#FFFFFF]"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => handleToggleSection(section.id)}
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
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="h-full overflow-y-auto bg-gradient-to-br from-[#E0E5EC] to-[#F0F4F8] rounded-3xl p-6 shadow-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl bg-[#F0F4F8] p-6 shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF] min-h-[600px] flex flex-col"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#A3B1C6] font-semibold">Preview Undangan</p>
                  <h3 className="text-xl font-bold text-[#2D3436] mt-1">{form.title || 'Undangan Anda'}</h3>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-xl bg-[#E0E5EC] text-[#6C5CE7] shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[3px_3px_6px_#A3B1C6,-3px_-3px_6px_#FFFFFF] transition-all active:shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF]"
                  >
                    <Eye className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-xl bg-[#E0E5EC] text-[#6C5CE7] shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[3px_3px_6px_#A3B1C6,-3px_-3px_6px_#FFFFFF] transition-all active:shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF]"
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              <motion.div
                className="flex-1 rounded-2xl overflow-hidden shadow-[6px_6px_12px_rgba(163,177,198,0.2),-6px_-6px_12px_rgba(255,255,255,0.8)]"
                style={{ backgroundColor: form.backgroundColor || '#FFFFFF' }}
              >
                {/* Opening Section - Phinisi Style */}
                {sections.find(s => s.id === 'opening')?.enabled && (
                  <div
                    className="relative w-full overflow-hidden"
                    style={{
                      backgroundImage: 'url(https://assets.satumomen.com/images/invitation/bg-section-90534941775604513.jpg)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      minHeight: '520px',
                    }}
                  >
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/20" />

                    {/* Frame Left */}
                    <motion.div
                      initial={{ x: -80, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      className="absolute left-0 top-0 h-full w-16 pointer-events-none z-10"
                      style={{
                        background: 'linear-gradient(to right, rgba(120,40,40,0.85) 0%, rgba(120,40,40,0.3) 60%, transparent 100%)',
                      }}
                    >
                      <div className="h-full w-full flex flex-col justify-between py-4 pl-2">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="w-3 h-3 rounded-full bg-yellow-300/60" />
                        ))}
                      </div>
                    </motion.div>

                    {/* Frame Right */}
                    <motion.div
                      initial={{ x: 80, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      className="absolute right-0 top-0 h-full w-16 pointer-events-none z-10"
                      style={{
                        background: 'linear-gradient(to left, rgba(120,40,40,0.85) 0%, rgba(120,40,40,0.3) 60%, transparent 100%)',
                      }}
                    >
                      <div className="h-full w-full flex flex-col justify-between py-4 pr-2 items-end">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="w-3 h-3 rounded-full bg-yellow-300/60" />
                        ))}
                      </div>
                    </motion.div>

                    {/* Content */}
                    <div className="relative z-20 flex flex-col items-center justify-between h-full px-8 pt-8 pb-10" style={{ minHeight: '520px' }}>
                      {/* Top: Wedding Title */}
                      <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="text-center mt-4 mb-auto"
                      >
                        <p className="text-white/90 text-sm tracking-widest uppercase mb-2">
                          The Wedding Of
                        </p>
                        <h1
                          className="text-white font-bold leading-tight"
                          style={{
                            fontSize: '2.8rem',
                            fontFamily: 'Georgia, serif',
                            textShadow: '0 2px 12px rgba(0,0,0,0.4)',
                          }}
                        >
                          {form.title}
                        </h1>
                      </motion.div>

                      {/* Bottom: Guest Card + Button */}
                      <div className="w-full flex flex-col items-center gap-4">
                        {/* Guest Card */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.8, delay: 0.6 }}
                          className="text-center px-5 py-4 rounded-xl w-full max-w-[240px]"
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.77)',
                            backdropFilter: 'blur(2px)',
                          }}
                        >
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="text-gray-700 text-sm mb-1"
                          >
                            Kepada Yth.<br />Bapak/Ibu/Saudara/i
                          </motion.p>
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                            className="font-bold text-base mb-1"
                            style={{ color: form.primaryColor || '#6C5CE7' }}
                          >
                            Tamu Undangan
                          </motion.p>
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.0 }}
                            className="text-gray-600 text-sm"
                          >
                            di Tempat
                          </motion.p>
                        </motion.div>

                        {/* Open Invitation Button */}
                        <motion.button
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.1 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.97 }}
                          className="px-8 py-2.5 rounded-full text-white text-sm font-semibold shadow-lg"
                          style={{ backgroundColor: form.primaryColor || '#6C5CE7' }}
                        >
                          Open Invitation
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rest of sections */}
                <div className="p-6">
                {sections.find(s => s.id === 'event')?.enabled && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8 pb-8 border-b-2 border-[#E0E5EC]"
                  >
                    <h2 className="text-lg font-semibold text-[#2D3436] mb-4">{form.eventName}</h2>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#6C5CE7]/10">
                          <span className="text-xs text-[#A3B1C6] uppercase tracking-wider">Tanggal</span>
                        </div>
                        <p className="text-sm font-semibold text-[#2D3436]">{form.eventDate}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#6C5CE7]/10">
                          <span className="text-xs text-[#A3B1C6] uppercase tracking-wider">Lokasi</span>
                        </div>
                        <p className="text-sm font-semibold text-[#2D3436]">{form.location}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {sections.find(s => s.id === 'rsvp')?.enabled && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8 pb-8 border-b-2 border-[#E0E5EC]"
                  >
                    <h3 className="text-lg font-semibold text-[#2D3436] mb-4">RSVP</h3>
                    <button className="w-full py-3 rounded-xl bg-[#6C5CE7] text-white font-semibold shadow-[4px_4px_8px_rgba(108,92,231,0.3),-4px_-4px_8px_#FFFFFF] hover:shadow-[3px_3px_6px_rgba(108,92,231,0.4),-3px_-3px_6px_#FFFFFF] transition-all">
                      Konfirmasi Kehadiran
                    </button>
                  </motion.div>
                )}

                {sections.find(s => s.id === 'thanks')?.enabled && (
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
                </div>
              </motion.div>
            </motion.div>
          </div>
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
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-[#6C5CE7] to-[#7B68EE] text-white font-semibold shadow-[6px_6px_12px_rgba(108,92,231,0.3),-6px_-6px_12px_#FFFFFF] hover:shadow-[4px_4px_8px_rgba(108,92,231,0.4),-4px_-4px_8px_#FFFFFF] transition-all active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2),inset_-4px_-4px_8px_rgba(255,255,255,0.5)] disabled:opacity-60"
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </motion.button>
        </motion.div>

        {/* Messages */}
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

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed bottom-8 right-8 px-6 py-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 font-semibold shadow-lg"
          >
            {error}
          </motion.div>
        )}
      </div>
    </div>
  )
}