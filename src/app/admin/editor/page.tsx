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
import NeumorphicControlPanel from '@/components/editor/NeumorphicControlPanel'
import NeumorphicPreview from '@/components/editor/NeumorphicPreview'

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
  const [showNeumorphicEditor, setShowNeumorphicEditor] = useState(true)

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

  const FEATURE_BUTTONS = [
    { label: 'Pengaturan', icon: Settings2 },
    { label: 'Tema', icon: Palette },
    { label: 'Music', icon: Music2 },
    { label: 'Background', icon: ImageIcon },
    { label: 'RSVP', icon: MessageCircle },
    { label: 'Layar Sapa', icon: Layers },
    { label: 'Preview', icon: Eye },
    { label: 'Kirim', icon: Share2 },
    { label: 'Lucky Draw', icon: Zap },
  ]

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
    const newSection: SectionItem = {
      id: `section-${Date.now()}`,
      label: 'Bagian Baru',
      enabled: true,
    }
    setSections((prev) => [...prev, newSection])
  }, [])

  const handleDeleteSection = useCallback((id: string) => {
    setSections((prev) => prev.filter((section) => section.id !== id))
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

  const toggleSection = (id: string) => {
    handleToggleSection(id)
  }

  const handlePreviewMode = () => {
    const previewUrl = createdInvitation?.invitationLink || (createdInvitation ? `/invitation/${createdInvitation.id}` : form.invitationLink)
    window.open(previewUrl, '_blank')
  }

  const handleShare = () => {
    copyShareLink()
  }

  // Render Neumorphic Editor
  if (showNeumorphicEditor) {
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
              formData={form}
            />

            {/* Preview */}
            <NeumorphicPreview
              formData={form}
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
              onClick={handleSubmit}
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

  // Original Editor (fallback)
  const toggleSection = (id: string) => {
    setSections((prev) => prev.map((section) => (section.id === id ? { ...section, enabled: !section.enabled } : section)))
  }

  const previewMessage = currentTemplate.defaultMessage
    .replace('{link_undangan}', form.invitationLink || `${typeof window !== 'undefined' ? window.location.origin : ''}/invitation/preview`)
    .replace('{nama_tamu}', 'Nama Tamu')
    .replace('{event_name}', form.eventName)

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-sky-500 font-semibold">Admin Editor</p>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Buat Undangan Digital</h1>
            <p className="mt-3 max-w-2xl text-slate-600">Desain undangan modern minimalis dengan tema biru dan orange. Simpan undangan, lalu bagikan link preview ke tamu.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = '/admin/dashboard'}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali Dashboard
            </motion.button>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const previewUrl = createdInvitation?.invitationLink || (createdInvitation ? `/invitation/${createdInvitation.id}` : form.invitationLink)
                window.open(previewUrl, '_blank')
              }}
              disabled={!createdInvitation && !form.invitationLink}
              className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-sky-200 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Eye className="w-4 h-4" /> Lihat Preview
            </motion.button>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.4fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 rounded-[32px] bg-white p-8 shadow-xl"
          >
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Langkah 1</p>
              <h2 className="text-2xl font-bold text-slate-900">Isi Data Undangan</h2>
              <p className="text-slate-600">Pilih template, isi detail acara, lalu simpan undangan ke sistem admin.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {TEMPLATE_OPTIONS.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => handleTemplateSelect(template.id)}
                  className={`rounded-3xl border px-4 py-4 text-left transition-shadow ${selectedTemplateId === template.id ? 'border-sky-500 shadow-lg' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{template.title}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{template.category}</p>
                    </div>
                    <div className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${template.accent} shadow-inner`} />
                  </div>
                  <p className="mt-3 text-sm text-slate-500">{template.description}</p>
                </button>
              ))}
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Kontrol Seksi</p>
                  <h3 className="text-lg font-semibold text-slate-900">Apa yang ditampilkan tamu?</h3>
                </div>
                <button type="button" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                  <Plus className="w-4 h-4" /> Tambah Seksi
                </button>
              </div>
              <div className="mt-4 grid gap-3">
                {sections.map((section) => (
                  <div key={section.id} className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{section.label}</p>
                      <p className="text-sm text-slate-500">{section.enabled ? 'Tampil' : 'Tersembunyi'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleSection(section.id)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${section.enabled ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700'}`}
                      >
                        {section.enabled ? 'On' : 'Off'}
                      </button>
                      <button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Nama Undangan</span>
                  <input
                    value={form.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    type="text"
                    placeholder="Akbar & Madia"
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Jenis Acara</span>
                  <select
                    value={currentTemplate.category}
                    disabled
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                  >
                    <option>{currentTemplate.category}</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Judul Acara</span>
                  <input
                    value={form.eventName}
                    onChange={(e) => handleChange('eventName', e.target.value)}
                    type="text"
                    placeholder="Resepsi Pernikahan"
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Tanggal</span>
                  <input
                    value={form.eventDate}
                    onChange={(e) => handleChange('eventDate', e.target.value)}
                    type="date"
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="text-sm font-medium text-slate-700">Lokasi</span>
                  <input
                    value={form.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    type="text"
                    placeholder="Bali, Indonesia"
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Link Undangan</span>
                <input
                  value={form.invitationLink}
                  onChange={(e) => handleChange('invitationLink', e.target.value)}
                  type="url"
                  placeholder="https://id.akainvitation.com/akbar-and-madia"
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Pesan Undangan</span>
                <textarea
                  value={form.templateMessage}
                  onChange={(e) => handleChange('templateMessage', e.target.value)}
                  rows={6}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Pilih Member</span>
                <select
                  value={form.assignedMemberId}
                  onChange={(e) => handleChange('assignedMemberId', e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                >
                  {members.length === 0 ? (
                    <option value="">Tidak ada member tersedia</option>
                  ) : (
                    members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} • {member.email}
                      </option>
                    ))
                  )}
                </select>
              </label>

              {error && (
                <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-500">Biaya pembuatan undangan</p>
                  <p className="text-lg font-semibold text-slate-900">{form.costPoints} coin</p>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-400/30 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Menyimpan...' : 'Simpan Undangan'}
                </button>
              </div>
            </form>

            {createdInvitation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Undangan tersimpan</p>
                    <p className="mt-1 text-sm text-slate-600">Link undangan siap dibagikan ke tamu.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => window.open(createdInvitation.invitationLink, '_blank')}
                      className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
                    >
                      <Eye className="w-4 h-4" /> Lihat Preview
                    </button>
                    <button
                      type="button"
                      onClick={copyShareLink}
                      className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                    >
                      <Copy className="w-4 h-4" /> Salin Link
                    </button>
                  </div>
                </div>
                <div className="mt-5 rounded-3xl bg-white p-4 border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-600 text-xs uppercase tracking-[0.22em] font-semibold">
                    <LinkIcon className="w-4 h-4" /> Link Preview
                  </div>
                  <div className="mt-3 break-all text-sm text-slate-700">{createdInvitation.invitationLink}</div>
                </div>
              </motion.div>
            )}

            {successMessage && !error && (
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-[36px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white shadow-2xl"
          >
            <div className="relative overflow-hidden rounded-[32px] bg-slate-950 p-6 shadow-inner shadow-slate-900/40">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />
              <div className="absolute -left-16 bottom-20 h-36 w-36 rounded-full bg-orange-500/10 blur-3xl" />
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-white/10 text-sky-300 shadow-md shadow-slate-950/20">
                    <Sparkles className="w-6 h-6" />
                  </span>
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Preview Undangan</p>
                    <p className="text-2xl font-semibold text-white">{currentTemplate.heroLabel}</p>
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_15px_50px_rgba(7,24,39,0.45)] backdrop-blur-xl">
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-500/10 text-sky-200">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.32em] text-slate-400">{currentTemplate.category}</p>
                      <p className="font-semibold text-slate-100">{form.title}</p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-[26px] border border-slate-600/70 bg-slate-950/80 p-6 shadow-lg shadow-slate-950/40">
                    <div className={`mb-6 inline-flex rounded-full bg-gradient-to-r ${currentTemplate.accent} px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white shadow-sm shadow-slate-950/20`}>{currentTemplate.heroLine}</div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Acara</p>
                        <p className="mt-2 text-2xl font-semibold text-white">{form.eventName}</p>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-3xl bg-slate-900/80 p-4">
                          <div className="flex items-center gap-2 text-slate-300">
                            <CalendarDays className="w-4 h-4" />
                            <span className="text-xs uppercase tracking-[0.22em]">Tanggal</span>
                          </div>
                          <p className="mt-3 text-base font-semibold text-white">{form.eventDate}</p>
                        </div>
                        <div className="rounded-3xl bg-slate-900/80 p-4">
                          <div className="flex items-center gap-2 text-slate-300">
                            <MapPin className="w-4 h-4" />
                            <span className="text-xs uppercase tracking-[0.22em]">Lokasi</span>
                          </div>
                          <p className="mt-3 text-base font-semibold text-white">{form.location}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-7 rounded-3xl border border-slate-700/80 bg-slate-950/70 p-5">
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Undangan</p>
                      <p className="mt-3 text-sm leading-7 text-slate-200 whitespace-pre-line">{previewMessage}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Share Link</p>
                      <p className="text-sm text-slate-200">{form.invitationLink}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(form.invitationLink)}
                      className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                    >
                      <Copy className="w-4 h-4" /> Salin Preview Link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
