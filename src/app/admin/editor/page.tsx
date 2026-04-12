'use client'

import { Suspense, useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import {
  ArrowLeft,
  Save,
  Eye,
  Share2,
  Plus,
  Type,
  Palette,
  Image as ImageIcon,
  Layers,
  Trash2,
  GripVertical,
  Settings,
  Music,
  Monitor,
  Send,
  Users,
  Mail,
  X,
  Check,
} from 'lucide-react'
import { TEMPLATE_OPTIONS } from '@/lib/invitationTemplates'
import {
  defaultEditorConfig,
  editorConfigToJson,
  parseEditorConfig,
  defaultTemplateId,
  type InvitationEditorConfig,
} from '@/lib/invitationEditorConfig'

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
  expanded?: boolean
  content?: Record<string, string>
}

type EditModalState = {
  open: boolean
  sectionId: string
  label: string
  content: Record<string, string>
}

function AdminEditorPageInner() {
  const searchParams = useSearchParams()
  const editingInvitationId = searchParams.get('id')

  const [adminId, setAdminId] = useState<string>('')
  const [members, setMembers] = useState<Member[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(defaultTemplateId())
  const [createdInvitation, setCreatedInvitation] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [invitationType, setInvitationType] = useState(false) // false=scroll, true=paged
  const [editModal, setEditModal] = useState<EditModalState>({
    open: false, sectionId: '', label: '', content: {}
  })
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [activeToolPanel, setActiveToolPanel] = useState<'tema' | 'music' | 'background' | 'luckyDraw' | null>(null)
  const [isLoadingInvitation, setIsLoadingInvitation] = useState(false)
  const [luckyDraw, setLuckyDraw] = useState({ enabled: false, title: 'Lucky Draw' })

  const refTextBlock = useRef<HTMLDivElement>(null)
  const refMemberSave = useRef<HTMLDivElement>(null)
  const refSectionsBlock = useRef<HTMLDivElement>(null)

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
    backgroundImageUrl: '',
    musicUrl: '',
    musicEnabled: false,
  })

  const [sections, setSections] = useState<SectionItem[]>(() => defaultEditorConfig().sections)

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
    if (!adminId || !editingInvitationId) return
    let cancelled = false
    setIsLoadingInvitation(true)
    setError('')
    fetch(`/api/admin/invitations/${editingInvitationId}?_t=${Date.now()}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        if (!data.success || !data.data) {
          setError(data.error || 'Gagal memuat undangan.')
          return
        }
        const inv = data.data
        const ec = parseEditorConfig(inv.editorConfig)
        const d = new Date(inv.eventDate)
        const eventDateStr = Number.isNaN(d.getTime())
          ? new Date().toISOString().slice(0, 10)
          : d.toISOString().slice(0, 10)
        setForm({
          title: inv.title ?? '',
          eventName: inv.eventName ?? '',
          eventDate: eventDateStr,
          location: inv.location ?? '',
          invitationLink: inv.invitationLink ?? '',
          templateMessage: inv.templateMessage ?? TEMPLATE_OPTIONS[0].defaultMessage,
          assignedMemberId: inv.assignedMemberId ?? '',
          costPoints: inv.costPoints ?? 20,
          backgroundColor: ec.ui.backgroundColor,
          primaryColor: ec.ui.primaryColor,
          backgroundImageUrl: ec.ui.backgroundImageUrl,
          musicUrl: ec.ui.musicUrl,
          musicEnabled: ec.ui.musicEnabled,
        })
        setSections(ec.sections)
        setSelectedTemplateId(inv.templateId || defaultTemplateId())
        setIsActive(ec.isActive)
        setInvitationType(ec.invitationType === 'paged')
        setLuckyDraw(ec.luckyDraw)
        setCreatedInvitation(inv)
      })
      .catch(() => {
        if (!cancelled) setError('Gagal memuat undangan.')
      })
      .finally(() => {
        if (!cancelled) setIsLoadingInvitation(false)
      })
    return () => {
      cancelled = true
    }
  }, [adminId, editingInvitationId])

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

  const handleOpenEdit = useCallback((section: SectionItem) => {
    setEditModal({
      open: true,
      sectionId: section.id,
      label: section.label,
      content: { ...(section.content ?? {}) },
    })
  }, [])

  const handleSaveEdit = useCallback(() => {
    setSections((prev) =>
      prev.map((s) => s.id === editModal.sectionId ? { ...s, content: editModal.content } : s)
    )
    setEditModal({ open: false, sectionId: '', label: '', content: {} })
  }, [editModal])

  const handleDeleteSection = useCallback((id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const handleTemplateSelect = (id: string) => {
    setSelectedTemplateId(id)
    const t = TEMPLATE_OPTIONS.find((opt) => opt.id === id)
    if (t) {
      setForm((prev) => ({ ...prev, templateMessage: t.defaultMessage }))
    }
  }

  const buildEditorConfig = useCallback((): InvitationEditorConfig => {
    return {
      version: 1,
      sections,
      ui: {
        primaryColor: form.primaryColor,
        backgroundColor: form.backgroundColor,
        backgroundImageUrl: form.backgroundImageUrl,
        musicUrl: form.musicUrl,
        musicEnabled: form.musicEnabled,
      },
      isActive,
      invitationType: invitationType ? 'paged' : 'scroll',
      luckyDraw,
    }
  }, [
    sections,
    form.primaryColor,
    form.backgroundColor,
    form.backgroundImageUrl,
    form.musicUrl,
    form.musicEnabled,
    isActive,
    invitationType,
    luckyDraw,
  ])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSaving(true)
    setError('')
    setSuccessMessage('')

    if (!form.assignedMemberId) {
      setError('Pilih member yang akan menerima undangan terlebih dahulu.')
      setIsSaving(false)
      return
    }

    const editorPayload = editorConfigToJson(buildEditorConfig())

    try {
      if (editingInvitationId) {
        const response = await fetch(`/api/admin/invitations/${editingInvitationId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: form.title,
            eventName: form.eventName,
            eventDate: form.eventDate,
            location: form.location,
            templateMessage: form.templateMessage,
            templateId: selectedTemplateId,
            invitationLink: form.invitationLink.trim(),
            editorConfig: editorPayload,
            status: isActive ? 'published' : 'draft',
          }),
        })
        const data = await response.json()
        if (!response.ok || !data.success) {
          setError(data.error || 'Gagal memperbarui undangan.')
        } else {
          setSuccessMessage('Undangan berhasil diperbarui!')
          setCreatedInvitation(data.data)
        }
      } else {
        setCreatedInvitation(null)
        const payload: Record<string, unknown> = {
          title: form.title,
          eventName: form.eventName,
          eventDate: form.eventDate,
          location: form.location,
          templateMessage: form.templateMessage,
          templateId: selectedTemplateId,
          costPoints: form.costPoints,
          assignedMemberId: form.assignedMemberId,
          createdById: adminId,
          editorConfig: editorPayload,
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
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan undangan'
      setError(msg)
    } finally {
      setIsSaving(false)
    }
  }

  const copyShareLink = useCallback(async () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const id = createdInvitation?.id || editingInvitationId
    const link =
      form.invitationLink.trim() ||
      (id ? `${origin}/invitation/${id}` : `${origin}/invitation/preview`)
    if (!link) return
    await navigator.clipboard.writeText(link)
    setSuccessMessage('Link undangan berhasil disalin.')
  }, [createdInvitation?.id, editingInvitationId, form.invitationLink])

  const scrollToRef = (r: React.RefObject<HTMLDivElement | null>) => {
    r.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleGridMenuAction = useCallback(
    (menuId: string) => {
      setActiveMenu(menuId)
      if (menuId === 'pengaturan') {
        setActiveToolPanel(null)
        scrollToRef(refTextBlock)
        setTimeout(() => scrollToRef(refMemberSave), 400)
      } else if (menuId === 'tema') {
        setActiveToolPanel((p) => (p === 'tema' ? null : 'tema'))
      } else if (menuId === 'music') {
        setActiveToolPanel((p) => (p === 'music' ? null : 'music'))
      } else if (menuId === 'background') {
        setActiveToolPanel((p) => (p === 'background' ? null : 'background'))
      } else if (menuId === 'rsvp') {
        setActiveToolPanel(null)
        const sec = sections.find((s) => s.id === 'rsvp')
        if (sec) handleOpenEdit(sec)
        else scrollToRef(refSectionsBlock)
      } else if (menuId === 'layarSapa') {
        setActiveToolPanel(null)
        const sec = sections.find((s) => s.id === 'opening')
        if (sec) handleOpenEdit(sec)
        else scrollToRef(refSectionsBlock)
      } else if (menuId === 'preview') {
        setActiveToolPanel(null)
        const origin = window.location.origin
        const id = createdInvitation?.id || editingInvitationId
        const url =
          form.invitationLink.trim() ||
          (id ? `${origin}/invitation/${id}` : '')
        if (url) window.open(url, '_blank', 'noopener,noreferrer')
      } else if (menuId === 'kirim') {
        setActiveToolPanel(null)
        void copyShareLink()
      } else if (menuId === 'luckyDraw') {
        setActiveToolPanel((p) => (p === 'luckyDraw' ? null : 'luckyDraw'))
      }
    },
    [sections, handleOpenEdit, copyShareLink, createdInvitation?.id, editingInvitationId, form.invitationLink]
  )

  const GRID_MENUS = [
    { id: 'pengaturan', domId: 'menuPengaturan', label: 'Pengaturan', color: '#458AF7', icon: Settings },
    { id: 'tema', domId: 'menuTema', label: 'Tema', color: '#4FAB5E', icon: Palette },
    { id: 'music', domId: 'menuMusic', label: 'Music', color: '#FF7940', icon: Music },
    { id: 'background', domId: 'menuBackground', label: 'Background', color: '#F745BC', icon: ImageIcon },
    { id: 'rsvp', domId: 'menuRsvp', label: 'RSVP', color: '#2FC6DA', icon: Mail },
    { id: 'layarSapa', domId: 'menuLayarSapa', label: 'Layar Sapa', color: '#ED6160', icon: Monitor },
    { id: 'preview', domId: 'menuPreview', label: 'Preview', color: '#FF7940', icon: Eye },
    { id: 'kirim', domId: 'menuKirim', label: 'Kirim', color: '#77C749', icon: Send },
    { id: 'luckyDraw', domId: 'menuBukuTamu', label: 'Lucky Draw', color: '#7445F7', icon: Users },
  ]

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
              {editingInvitationId && (
                <p className="text-xs text-[#6C5CE7] font-semibold mt-2">Mode edit · ID: {editingInvitationId}</p>
              )}
            </div>

            {isLoadingInvitation && (
              <div className="mb-4 rounded-xl bg-[#E0E5EC] px-4 py-3 text-sm text-[#2D3436] shadow-[inset_3px_3px_6px_#A3B1C6,inset_-3px_-3px_6px_#FFFFFF]">
                Memuat undangan…
              </div>
            )}

            {/* Text Editor Section */}
            <div
              ref={refTextBlock}
              className="mb-6 rounded-2xl bg-[#F0F4F8] p-5 shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF]"
            >
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

            {/* Grid Menu */}
            <div className="mb-6 rounded-2xl bg-[#F0F4F8] p-4 shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF]">
              <div className="grid grid-cols-3 gap-2">
                {GRID_MENUS.map((menu) => {
                  const Icon = menu.icon
                  const isHighlighted =
                    activeMenu === menu.id ||
                    (menu.id === 'tema' && activeToolPanel === 'tema') ||
                    (menu.id === 'music' && activeToolPanel === 'music') ||
                    (menu.id === 'background' && activeToolPanel === 'background') ||
                    (menu.id === 'luckyDraw' && activeToolPanel === 'luckyDraw')
                  return (
                    <motion.button
                      key={menu.id}
                      id={menu.domId}
                      type="button"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleGridMenuAction(menu.id)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                        isHighlighted
                          ? 'bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#A3B1C6,inset_-3px_-3px_6px_#FFFFFF]'
                          : 'bg-[#E0E5EC] shadow-[3px_3px_6px_#A3B1C6,-3px_-3px_6px_#FFFFFF]'
                      }`}
                    >
                      <Icon className="w-5 h-5" style={{ color: menu.color }} />
                      <span className="text-xs font-medium text-[#2D3436]">{menu.label}</span>
                    </motion.button>
                  )
                })}
              </div>

              <AnimatePresence>
                {activeToolPanel === 'tema' && (
                  <motion.div
                    key="panel-tema"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 overflow-hidden rounded-xl bg-[#E0E5EC] p-4 shadow-[inset_3px_3px_6px_#A3B1C6,inset_-3px_-3px_6px_#FFFFFF]"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-[#2D3436]">Pilih tema</span>
                      <button
                        type="button"
                        onClick={() => setActiveToolPanel(null)}
                        className="text-xs text-[#A3B1C6] hover:text-[#2D3436]"
                      >
                        Tutup
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {TEMPLATE_OPTIONS.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => handleTemplateSelect(t.id)}
                          className={`text-left rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                            selectedTemplateId === t.id
                              ? 'bg-[#6C5CE7] text-white'
                              : 'bg-[#F0F4F8] text-[#2D3436] hover:bg-[#6C5CE7]/15'
                          }`}
                        >
                          {t.title}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeToolPanel === 'music' && (
                  <motion.div
                    key="panel-music"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 overflow-hidden rounded-xl bg-[#E0E5EC] p-4 shadow-[inset_3px_3px_6px_#A3B1C6,inset_-3px_-3px_6px_#FFFFFF]"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-[#2D3436]">Musik</span>
                      <button
                        type="button"
                        onClick={() => setActiveToolPanel(null)}
                        className="text-xs text-[#A3B1C6] hover:text-[#2D3436]"
                      >
                        Tutup
                      </button>
                    </div>
                    <label className="block text-xs font-medium text-[#2D3436] mb-1">URL audio (mp3/ogg)</label>
                    <input
                      type="url"
                      value={form.musicUrl}
                      onChange={(e) => handleTextChange('musicUrl', e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-xl bg-[#F0F4F8] text-sm outline-none mb-3 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]"
                    />
                    <label className="flex items-center gap-2 text-sm text-[#2D3436]">
                      <input
                        type="checkbox"
                        checked={form.musicEnabled}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, musicEnabled: e.target.checked }))
                        }
                      />
                      Aktifkan musik di undangan
                    </label>
                  </motion.div>
                )}

                {activeToolPanel === 'background' && (
                  <motion.div
                    key="panel-bg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 overflow-hidden rounded-xl bg-[#E0E5EC] p-4 shadow-[inset_3px_3px_6px_#A3B1C6,inset_-3px_-3px_6px_#FFFFFF]"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-[#2D3436]">Background</span>
                      <button
                        type="button"
                        onClick={() => setActiveToolPanel(null)}
                        className="text-xs text-[#A3B1C6] hover:text-[#2D3436]"
                      >
                        Tutup
                      </button>
                    </div>
                    <label className="block text-xs font-medium text-[#2D3436] mb-1">Warna latar preview</label>
                    <input
                      type="color"
                      value={form.backgroundColor}
                      onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                      className="w-full h-10 rounded-xl cursor-pointer mb-3"
                    />
                    <label className="block text-xs font-medium text-[#2D3436] mb-1">URL gambar latar (opsional)</label>
                    <input
                      type="url"
                      value={form.backgroundImageUrl}
                      onChange={(e) => handleTextChange('backgroundImageUrl', e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-xl bg-[#F0F4F8] text-sm outline-none shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]"
                    />
                  </motion.div>
                )}

                {activeToolPanel === 'luckyDraw' && (
                  <motion.div
                    key="panel-lucky"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 overflow-hidden rounded-xl bg-[#E0E5EC] p-4 shadow-[inset_3px_3px_6px_#A3B1C6,inset_-3px_-3px_6px_#FFFFFF]"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-[#2D3436]">Lucky Draw</span>
                      <button
                        type="button"
                        onClick={() => setActiveToolPanel(null)}
                        className="text-xs text-[#A3B1C6] hover:text-[#2D3436]"
                      >
                        Tutup
                      </button>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-[#2D3436] mb-3">
                      <input
                        type="checkbox"
                        checked={luckyDraw.enabled}
                        onChange={(e) =>
                          setLuckyDraw((prev) => ({ ...prev, enabled: e.target.checked }))
                        }
                      />
                      Aktifkan Lucky Draw
                    </label>
                    <label className="block text-xs font-medium text-[#2D3436] mb-1">Judul</label>
                    <input
                      type="text"
                      value={luckyDraw.title}
                      onChange={(e) =>
                        setLuckyDraw((prev) => ({ ...prev, title: e.target.value }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#F0F4F8] text-sm outline-none shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Status & Tipe Undangan */}
            <div className="mb-6 space-y-3">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-[3px_3px_6px_#A3B1C6,-3px_-3px_6px_#FFFFFF]">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-emerald-700">Status Undangan</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isActive ? 'bg-emerald-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                    {isActive ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={`relative w-12 h-6 rounded-full transition-all ${isActive ? 'bg-emerald-500' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${isActive ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 border border-amber-200 shadow-[3px_3px_6px_#A3B1C6,-3px_-3px_6px_#FFFFFF]">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-amber-700">Tipe Undangan</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-amber-400 text-white">
                    {invitationType ? 'Paged' : 'Scroll'}
                  </span>
                </div>
                <button
                  onClick={() => setInvitationType(!invitationType)}
                  className={`relative w-12 h-6 rounded-full transition-all ${invitationType ? 'bg-amber-500' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${invitationType ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>

            {/* Section Manager - Accordion with Drag */}
            <div
              ref={refSectionsBlock}
              className="rounded-2xl bg-[#F0F4F8] p-5 shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#E0E5EC] shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]">
                    <Layers className="w-5 h-5 text-[#6C5CE7]" />
                  </div>
                  <span className="font-semibold text-[#2D3436]">Bagian Undangan</span>
                </div>
              </div>
              
              <Reorder.Group axis="y" values={sections} onReorder={setSections} className="space-y-2">
                {sections.map((section) => (
                  <Reorder.Item key={section.id} value={section}>
                    <div className="rounded-xl bg-[#E0E5EC] shadow-[3px_3px_6px_#A3B1C6,-3px_-3px_6px_#FFFFFF] overflow-hidden">
                      {/* Section Header */}
                      <div className="flex items-center gap-2 px-3 py-2">
                        <div className="cursor-grab active:cursor-grabbing text-[#A3B1C6]">
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-[#2D3436] flex-1">{section.label}</span>
                        <button
                          onClick={() => handleToggleSection(section.id)}
                          className={`relative w-10 h-5 rounded-full transition-all flex-shrink-0 ${section.enabled ? 'bg-[#6C5CE7]' : 'bg-gray-300'}`}
                        >
                          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${section.enabled ? 'left-5' : 'left-0.5'}`} />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(section)}
                          className="px-2 py-1 rounded-lg bg-[#6C5CE7] text-white text-xs font-semibold shadow-[2px_2px_4px_rgba(108,92,231,0.3)] hover:opacity-90 transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSection(section.id)}
                          className="p-1 rounded-lg bg-[#E0E5EC] text-red-400 shadow-[2px_2px_4px_#A3B1C6,-2px_-2px_4px_#FFFFFF] hover:text-red-600 transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>

              {/* Tambah Halaman */}
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSections(prev => [...prev, { id: `section-${Date.now()}`, label: 'Halaman Baru', enabled: true, content: {} }])}
                className="w-full mt-4 py-3 rounded-xl bg-[#6C5CE7] text-white font-semibold flex items-center justify-center gap-2 shadow-[4px_4px_8px_rgba(108,92,231,0.3),-4px_-4px_8px_#FFFFFF] hover:opacity-90 transition-all"
              >
                <Plus className="w-4 h-4" /> Tambah Halaman
              </motion.button>
            </div>

            {/* Member & Save */}
            <div
              ref={refMemberSave}
              className="mt-6 rounded-2xl bg-[#F0F4F8] p-5 shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF]"
            >
              <label className="block text-sm font-medium text-[#2D3436] mb-2">Pilih Member</label>
              <select
                value={form.assignedMemberId}
                onChange={(e) => handleChange('assignedMemberId', e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#E0E5EC] text-[#2D3436] outline-none shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] mb-4"
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
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={isSaving}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#6C5CE7] to-[#7B68EE] text-white font-semibold flex items-center justify-center gap-2 shadow-[6px_6px_12px_rgba(108,92,231,0.3),-6px_-6px_12px_#FFFFFF] disabled:opacity-60"
              >
                <Save className="w-5 h-5" />
                {isSaving ? 'Menyimpan...' : editingInvitationId ? 'Perbarui undangan' : 'Simpan Undangan'}
              </motion.button>
              {error && <p className="mt-3 text-sm text-red-500 text-center">{error}</p>}
              {successMessage && <p className="mt-3 text-sm text-emerald-600 text-center">{successMessage}</p>}
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
              <div className="mb-6 flex items-center justify-between relative z-10">
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#A3B1C6] font-semibold">Preview Undangan</p>
                  <h3 className="text-xl font-bold text-[#2D3436] mt-1">{form.title || 'Undangan Anda'}</h3>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const origin = window.location.origin
                      const id = createdInvitation?.id || editingInvitationId
                      const url =
                        form.invitationLink.trim() ||
                        (id ? `${origin}/invitation/${id}` : '')
                      if (url) window.open(url, '_blank', 'noopener,noreferrer')
                    }}
                    className="p-3 rounded-xl bg-[#E0E5EC] text-[#6C5CE7] shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[3px_3px_6px_#A3B1C6,-3px_-3px_6px_#FFFFFF] transition-all active:shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] cursor-pointer"
                  >
                    <Eye className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copyShareLink}
                    className="p-3 rounded-xl bg-[#E0E5EC] text-[#6C5CE7] shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[3px_3px_6px_#A3B1C6,-3px_-3px_6px_#FFFFFF] transition-all active:shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] cursor-pointer"
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
                      backgroundImage: form.backgroundImageUrl.trim()
                        ? `url(${form.backgroundImageUrl.trim()})`
                        : 'url(https://assets.satumomen.com/images/invitation/bg-section-90534941775604513.jpg)',
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

        {/* Edit Modal */}
        <AnimatePresence>
          {editModal.open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
              onClick={(e) => { if (e.target === e.currentTarget) setEditModal({ open: false, sectionId: '', label: '', content: {} }) }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#E0E5EC] rounded-3xl p-6 w-full max-w-lg mx-4 shadow-[12px_12px_24px_#A3B1C6,-12px_-12px_24px_#FFFFFF] max-h-[80vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#2D3436]">Edit {editModal.label}</h3>
                  <button
                    onClick={() => setEditModal({ open: false, sectionId: '', label: '', content: {} })}
                    className="p-2 rounded-xl bg-[#E0E5EC] text-[#A3B1C6] shadow-[3px_3px_6px_#A3B1C6,-3px_-3px_6px_#FFFFFF] hover:text-red-400 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  {Object.entries(editModal.content).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-[#2D3436] mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                      {(value as string).length > 80 ? (
                        <textarea
                          value={value as string}
                          onChange={(e) => setEditModal(prev => ({ ...prev, content: { ...prev.content, [key]: e.target.value } }))}
                          rows={3}
                          className="w-full px-4 py-3 rounded-2xl bg-[#E0E5EC] text-[#2D3436] outline-none shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] resize-none"
                        />
                      ) : (
                        <input
                          type="text"
                          value={value as string}
                          onChange={(e) => setEditModal(prev => ({ ...prev, content: { ...prev.content, [key]: e.target.value } }))}
                          className="w-full px-4 py-3 rounded-2xl bg-[#E0E5EC] text-[#2D3436] outline-none shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF]"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setEditModal({ open: false, sectionId: '', label: '', content: {} })}
                    className="flex-1 py-3 rounded-2xl bg-[#E0E5EC] text-[#2D3436] font-semibold shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[3px_3px_6px_#A3B1C6,-3px_-3px_6px_#FFFFFF] transition-all"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#6C5CE7] to-[#7B68EE] text-white font-semibold flex items-center justify-center gap-2 shadow-[4px_4px_8px_rgba(108,92,231,0.3),-4px_-4px_8px_#FFFFFF] hover:opacity-90 transition-all"
                  >
                    <Check className="w-4 h-4" /> Simpan
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
            {isSaving ? 'Menyimpan...' : editingInvitationId ? 'Perbarui' : 'Simpan'}
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

export default function AdminEditorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E0E5EC] to-[#F0F4F8] text-[#2D3436] font-medium">
          Memuat editor…
        </div>
      }
    >
      <AdminEditorPageInner />
    </Suspense>
  )
}