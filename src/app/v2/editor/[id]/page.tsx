'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Heart, Layout, Users, MessageSquare, LogOut, Loader2,
  Palette, FileText, Calendar, Gift, Eye, Save, Music,
  Globe, ChevronRight, ExternalLink, CreditCard, X, Image,
  Smartphone, Monitor, CheckCircle
} from 'lucide-react'
import CollapsibleSection from '@/components/v2-editor/CollapsibleSection'
import ToggleSwitch from '@/components/v2-editor/ToggleSwitch'
import FormField, { TextInput, TextArea, SelectInput } from '@/components/v2-editor/FormField'
import TemplateModal from '@/components/v2-editor/TemplateModal'
import { useV2Auth } from '@/hooks/useV2Auth'

interface InvitationData {
  id: string
  templateSlug: string
  subdomain: string
  isOnline: boolean
  editorConfig: any
  ogTitle: string | null
  ogDescription: string | null
  ogImageUrl: string | null
  primaryColor: string
  headingFont: string
  bodyFont: string
  accentFont: string
  musicUrl: string | null
  musicEnabled: boolean
  dateLanguage: string
  coupleOrder: string
  events: any[]
  bankAccounts: any[]
  giftItems: any[]
  _count: { guests: number; rsvpEntries: number }
}

const TEMPLATE_NAMES: Record<string, string> = {
  'starry-sea': 'The Starry Sea',
  'kalyana': 'Kalyana',
  'blooming-garden': 'Blooming Garden',
  'nisha': 'Nisha Premium',
}

export default function EditorPage() {
  const router = useRouter()
  const params = useParams()
  const invitationId = params.id as string
  const { user, loading: authLoading } = useV2Auth()

  const [invitation, setInvitation] = useState<InvitationData | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [showTemplateModal, setShowTemplateModal] = useState(false)

  const editorConfig = useRef<any>({})
  const saveTimeout = useRef<NodeJS.Timeout | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const isLoading = authLoading && !invitation

  useEffect(() => {
    if (user) loadInvitation()
  }, [user, invitationId])

  const loadInvitation = async () => {
    try {
      const invRes = await fetch(`/api/v2/invitations/${invitationId}`)
      if (!invRes.ok) { router.push('/v2/dashboard'); return }

      const invData = await invRes.json()
      setInvitation(invData.data)
      editorConfig.current = typeof invData.data.editorConfig === 'string'
        ? JSON.parse(invData.data.editorConfig)
        : invData.data.editorConfig || {}
    } catch {
      router.push('/v2/dashboard')
    }
  }

  // Debounced auto-save
  const debouncedSave = useCallback(async (updates: Record<string, any>) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current)

    saveTimeout.current = setTimeout(async () => {
      setIsSaving(true)
      try {
        await fetch(`/api/v2/invitations/${invitationId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        })
        setLastSaved(new Date())
      } catch (err) {
        console.error('Auto-save failed:', err)
      } finally {
        setIsSaving(false)
      }
    }, 1000)
  }, [invitationId])

  const syncPreview = (newInv?: InvitationData, newConfig?: any) => {
    if (iframeRef.current?.contentWindow) {
      const invData = newInv || invitation
      if (!invData) return
      iframeRef.current.contentWindow.postMessage({
        type: 'UPDATE_INVITATION',
        payload: {
          ...invData,
          editorConfig: newConfig || editorConfig.current
        }
      }, '*')
    }
  }

  const updateConfig = (section: string, data: any) => {
    const updatedConfig = {
      ...editorConfig.current,
      [section]: { ...editorConfig.current[section], ...data },
    }
    editorConfig.current = updatedConfig
    syncPreview(undefined, updatedConfig)
    debouncedSave({ editorConfig: updatedConfig })
  }

  const updateField = (field: string, value: any) => {
    setInvitation(prev => {
      const newInv = prev ? { ...prev, [field]: value } : null
      syncPreview(newInv || undefined)
      return newInv
    })
    debouncedSave({ [field]: value })
  }

  const handleSave = async () => {
    if (!invitation) return
    setIsSaving(true)
    try {
      await fetch(`/api/v2/invitations/${invitationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          editorConfig: editorConfig.current,
          primaryColor: invitation.primaryColor,
          headingFont: invitation.headingFont,
          bodyFont: invitation.bodyFont,
          accentFont: invitation.accentFont,
          musicUrl: invitation.musicUrl,
          musicEnabled: invitation.musicEnabled,
          dateLanguage: invitation.dateLanguage,
          coupleOrder: invitation.coupleOrder,
          ogTitle: invitation.ogTitle,
          ogDescription: invitation.ogDescription,
        }),
      })
      setLastSaved(new Date())
    } catch {} finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/v2/auth/me', { method: 'DELETE' })
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#3A5A40]" />
      </div>
    )
  }

  if (!invitation) return null

  const config = editorConfig.current

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#3A5A40] min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-20">
        <div className="p-5 border-b border-white/10">
          <Link href="/v2/dashboard" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <Heart className="w-4 h-4 fill-white" />
            <span className="font-bold text-sm">Editor Undangan</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link
            href="/v2/dashboard"
            className="rounded-xl px-4 py-2.5 flex items-center gap-3 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Layout className="w-4 h-4" />
            <span className="text-sm">Dashboard</span>
          </Link>
          <div className="rounded-xl px-4 py-2.5 flex items-center gap-3 bg-white/15 text-white">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">Undangan</span>
          </div>
          <Link
            href={`/v2/guests/${invitationId}`}
            className="rounded-xl px-4 py-2.5 flex items-center gap-3 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Users className="w-4 h-4" />
            <span className="text-sm">Tamu</span>
          </Link>
          <Link
            href={`/v2/rsvp/${invitationId}`}
            className="rounded-xl px-4 py-2.5 flex items-center gap-3 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm">RSVP</span>
          </Link>
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full rounded-xl px-4 py-2.5 flex items-center gap-3 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-56 flex">
        {/* Editor Panel (left) */}
        <div className="w-[480px] min-h-screen border-r border-[#E8E0D4] bg-[#FAF7F2] overflow-y-auto">
          {/* Domain Info Bar */}
          <div className="bg-white border-b border-[#E8E0D4] px-5 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-[#8B7E6F]" />
                <span className="text-sm text-[#4A4A4A] font-medium">{invitation.subdomain}.editorundangan.id</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  invitation.isOnline
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-gray-50 text-gray-500 border border-gray-200'
                }`}>
                  {invitation.isOnline ? 'Online' : 'Draft'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isSaving && (
                  <span className="text-xs text-[#8B7E6F] flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Menyimpan...
                  </span>
                )}
                {lastSaved && !isSaving && (
                  <span className="text-xs text-[#8B7E6F] flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Tersimpan
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Activation Banner */}
          {user?.packageStatus !== 'paid' && (
            <div className="bg-amber-50 border-b border-amber-200 px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-amber-800">Aktifkan Undangan</p>
                <p className="text-xs text-amber-600">Rp 99.000 - Rp 149.000</p>
              </div>
              <Link
                href="/v2/packages"
                className="bg-amber-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-amber-700"
              >
                Bayar & Aktifkan
              </Link>
            </div>
          )}

          {/* Template Selector */}
          <div className="px-5 py-4">
            <div className="bg-white rounded-xl border border-[#E8E0D4] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#3A5A40]/10 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-[#3A5A40]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#2D2D2D]">{TEMPLATE_NAMES[invitation.templateSlug] || invitation.templateSlug}</p>
                  <p className="text-xs text-[#8B7E6F]">Template aktif</p>
                </div>
              </div>
              <button
                onClick={() => setShowTemplateModal(true)}
                className="text-xs font-semibold text-[#3A5A40] bg-[#3A5A40]/10 px-3 py-1.5 rounded-lg hover:bg-[#3A5A40]/20 transition-colors"
              >
                Ganti Template
              </button>
            </div>
          </div>

          {/* Editor Sections */}
          <div className="px-5 pb-6 space-y-3">
            {/* Section 1: Tema & Tampilan */}
            <CollapsibleSection
              icon={<Palette className="w-4 h-4" />}
              title="Tema & Tampilan"
              subtitle="Warna, font, musik, OG settings"
              defaultOpen={true}
            >
              <div className="space-y-4">
                {/* OG Settings */}
                <FormField label="Judul Saat Dibagikan">
                  <TextInput
                    value={invitation.ogTitle || ''}
                    onChange={(v) => updateField('ogTitle', v)}
                    placeholder="The Wedding of ..."
                  />
                </FormField>

                <FormField label="Deskripsi Saat Dibagikan">
                  <TextArea
                    value={invitation.ogDescription || ''}
                    onChange={(v) => updateField('ogDescription', v)}
                    placeholder="Undangan pernikahan..."
                    rows={2}
                  />
                </FormField>

                {/* Primary Color */}
                <FormField label="Warna Utama">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={invitation.primaryColor}
                      onChange={(e) => updateField('primaryColor', e.target.value)}
                      className="w-10 h-10 rounded-lg border border-[#D4C9B8] cursor-pointer"
                    />
                    <TextInput
                      value={invitation.primaryColor}
                      onChange={(v) => updateField('primaryColor', v)}
                      placeholder="#D0A77B"
                    />
                  </div>
                </FormField>

                {/* Fonts */}
                <FormField label="Font Heading">
                  <SelectInput
                    value={invitation.headingFont}
                    onChange={(v) => updateField('headingFont', v)}
                    options={[
                      { value: 'Great Vibes', label: 'Great Vibes' },
                      { value: 'Playfair Display', label: 'Playfair Display' },
                      { value: 'Cormorant Garamond', label: 'Cormorant Garamond' },
                      { value: 'Cinzel', label: 'Cinzel' },
                      { value: 'Dancing Script', label: 'Dancing Script' },
                    ]}
                  />
                </FormField>

                <FormField label="Font Body">
                  <SelectInput
                    value={invitation.bodyFont}
                    onChange={(v) => updateField('bodyFont', v)}
                    options={[
                      { value: 'Cabin', label: 'Cabin' },
                      { value: 'Josefin Sans', label: 'Josefin Sans' },
                      { value: 'Lato', label: 'Lato' },
                      { value: 'Open Sans', label: 'Open Sans' },
                      { value: 'Poppins', label: 'Poppins' },
                    ]}
                  />
                </FormField>

                <FormField label="Font Aksen">
                  <SelectInput
                    value={invitation.accentFont}
                    onChange={(v) => updateField('accentFont', v)}
                    options={[
                      { value: 'Cormorant Garamond', label: 'Cormorant Garamond' },
                      { value: 'Playfair Display', label: 'Playfair Display' },
                      { value: 'Lora', label: 'Lora' },
                      { value: 'EB Garamond', label: 'EB Garamond' },
                    ]}
                  />
                </FormField>

                {/* Couple Order */}
                <FormField label="Urutan Mempelai">
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateField('coupleOrder', 'groom-bride')}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        invitation.coupleOrder === 'groom-bride'
                          ? 'bg-[#3A5A40] text-white'
                          : 'bg-[#F0EBE3] text-[#4A4A4A] hover:bg-[#E8E0D4]'
                      }`}
                    >
                      Pria - Wanita
                    </button>
                    <button
                      onClick={() => updateField('coupleOrder', 'bride-groom')}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        invitation.coupleOrder === 'bride-groom'
                          ? 'bg-[#3A5A40] text-white'
                          : 'bg-[#F0EBE3] text-[#4A4A4A] hover:bg-[#E8E0D4]'
                      }`}
                    >
                      Wanita - Pria
                    </button>
                  </div>
                </FormField>

                {/* Date Language */}
                <FormField label="Bahasa Tanggal">
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateField('dateLanguage', 'id')}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        invitation.dateLanguage === 'id'
                          ? 'bg-[#3A5A40] text-white'
                          : 'bg-[#F0EBE3] text-[#4A4A4A] hover:bg-[#E8E0D4]'
                      }`}
                    >
                      Indonesia
                    </button>
                    <button
                      onClick={() => updateField('dateLanguage', 'en')}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        invitation.dateLanguage === 'en'
                          ? 'bg-[#3A5A40] text-white'
                          : 'bg-[#F0EBE3] text-[#4A4A4A] hover:bg-[#E8E0D4]'
                      }`}
                    >
                      English
                    </button>
                  </div>
                </FormField>

                {/* Music Toggle */}
                <ToggleSwitch
                  enabled={invitation.musicEnabled}
                  onChange={(v) => updateField('musicEnabled', v)}
                  label="Musik Latar"
                  description="Putar musik latar belakang"
                />

                {/* Auto Scroll Toggle */}
                <ToggleSwitch
                  enabled={config.ui?.autoScroll ?? false}
                  onChange={(v) => updateConfig('ui', { autoScroll: v })}
                  label="Tombol Auto Scroll"
                  description="Tampilkan tombol putar otomatis (smart scroll)"
                />
                {invitation.musicEnabled && (
                  <>
                    {/* Music Playlist */}
                    <FormField label="Playlist Musik">
                      <div className="space-y-1.5">
                        {[
                          { name: 'The Beatles - Something', url: '/templates/nisha/the-beatles-something.mp3' },
                          { name: 'Custom URL', url: '' },
                        ].map((track) => (
                          <button
                            key={track.name}
                            type="button"
                            onClick={() => {
                              if (track.url) updateField('musicUrl', track.url)
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-all ${
                              invitation.musicUrl === track.url
                                ? 'border-[#3A5A40] bg-[#3A5A40]/10 text-[#3A5A40] font-semibold'
                                : 'border-[#E8E0D4] bg-white text-[#2D2D2D] hover:border-[#3A5A40]/50'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <Music className="w-3.5 h-3.5" />
                              {track.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </FormField>
                    <FormField label="URL Musik (MP3)">
                      <TextInput
                        value={invitation.musicUrl || ''}
                        onChange={(v) => updateField('musicUrl', v || null)}
                        placeholder="https://.../song.mp3"
                      />
                    </FormField>
                  </>
                )}
              </div>
            </CollapsibleSection>

            {/* Section 2: Isi Undangan */}
            <CollapsibleSection
              icon={<FileText className="w-4 h-4" />}
              title="Isi Undangan"
              subtitle="Cover, mempelai, kutipan, countdown, dll"
            >
              <div className="space-y-4">
                {/* Cover */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-[#3A5A40] uppercase tracking-wider">Cover / Halaman Pembuka</p>
                  <FormField label="Label Atas">
                    <TextInput
                      value={config.cover?.labelAtas || ''}
                      onChange={(v) => updateConfig('cover', { labelAtas: v })}
                      placeholder="The Wedding Of"
                    />
                  </FormField>
                  <FormField label="Nama Pasangan">
                    <TextInput
                      value={config.cover?.namaPasangan || ''}
                      onChange={(v) => updateConfig('cover', { namaPasangan: v })}
                      placeholder="Andi & Bunga"
                    />
                  </FormField>
                  <FormField label="Tanggal">
                    <TextInput
                      value={config.cover?.tanggal || ''}
                      onChange={(v) => updateConfig('cover', { tanggal: v })}
                      placeholder="12 Desember 2025"
                    />
                  </FormField>
                  <FormField label="Teks Kepada">
                    <TextInput
                      value={config.cover?.teksKepada || ''}
                      onChange={(v) => updateConfig('cover', { teksKepada: v })}
                      placeholder="Kepada Yth."
                    />
                  </FormField>
                  <FormField label="Hashtag (Opsional)">
                    <TextInput
                      value={config.cover?.hashtag || ''}
                      onChange={(v) => updateConfig('cover', { hashtag: v })}
                      placeholder="#TheWeddingOf"
                    />
                  </FormField>
                  <FormField label="Label Tombol">
                    <TextInput
                      value={config.cover?.labelTombol || ''}
                      onChange={(v) => updateConfig('cover', { labelTombol: v })}
                      placeholder="Buka Undangan"
                    />
                  </FormField>
                  <ToggleSwitch
                    enabled={config.cover?.enabled ?? true}
                    onChange={(v) => updateConfig('cover', { enabled: v })}
                    label="Tampilkan Cover"
                  />
                </div>

                <div className="border-t border-[#F0EBE3]" />

                {/* Groom */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-[#3A5A40] uppercase tracking-wider">Mempelai Pria</p>
                  <ToggleSwitch
                    enabled={config.groom?.enabled ?? true}
                    onChange={(v) => updateConfig('groom', { enabled: v })}
                    label="Tampilkan Mempelai Pria"
                  />
                  <FormField label="Nama Lengkap">
                    <TextInput
                      value={config.groom?.namaLengkap || ''}
                      onChange={(v) => updateConfig('groom', { namaLengkap: v })}
                      placeholder="Nama lengkap mempelai pria"
                    />
                  </FormField>
                  <FormField label="Nama Panggilan">
                    <TextInput
                      value={config.groom?.namaPanggilan || ''}
                      onChange={(v) => updateConfig('groom', { namaPanggilan: v })}
                      placeholder="Nama panggilan"
                    />
                  </FormField>
                  <FormField label="Info Orang Tua">
                    <TextInput
                      value={config.groom?.orangTua || ''}
                      onChange={(v) => updateConfig('groom', { orangTua: v })}
                      placeholder="Putra dari Bpk. ... & Ibu ..."
                    />
                  </FormField>
                  <FormField label="Instagram">
                    <TextInput
                      value={config.groom?.instagram || ''}
                      onChange={(v) => updateConfig('groom', { instagram: v })}
                      placeholder="@username"
                    />
                  </FormField>
                  <FormField label="Foto URL">
                    <TextInput
                      value={config.groom?.fotoUrl || ''}
                      onChange={(v) => updateConfig('groom', { fotoUrl: v })}
                      placeholder="https://.../foto-pria.jpg"
                    />
                  </FormField>
                </div>

                <div className="border-t border-[#F0EBE3]" />

                {/* Bride */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-[#3A5A40] uppercase tracking-wider">Mempelai Wanita</p>
                  <ToggleSwitch
                    enabled={config.bride?.enabled ?? true}
                    onChange={(v) => updateConfig('bride', { enabled: v })}
                    label="Tampilkan Mempelai Wanita"
                  />
                  <FormField label="Nama Lengkap">
                    <TextInput
                      value={config.bride?.namaLengkap || ''}
                      onChange={(v) => updateConfig('bride', { namaLengkap: v })}
                      placeholder="Nama lengkap mempelai wanita"
                    />
                  </FormField>
                  <FormField label="Nama Panggilan">
                    <TextInput
                      value={config.bride?.namaPanggilan || ''}
                      onChange={(v) => updateConfig('bride', { namaPanggilan: v })}
                      placeholder="Nama panggilan"
                    />
                  </FormField>
                  <FormField label="Info Orang Tua">
                    <TextInput
                      value={config.bride?.orangTua || ''}
                      onChange={(v) => updateConfig('bride', { orangTua: v })}
                      placeholder="Putri dari Bpk. ... & Ibu ..."
                    />
                  </FormField>
                  <FormField label="Instagram">
                    <TextInput
                      value={config.bride?.instagram || ''}
                      onChange={(v) => updateConfig('bride', { instagram: v })}
                      placeholder="@username"
                    />
                  </FormField>
                  <FormField label="Foto URL">
                    <TextInput
                      value={config.bride?.fotoUrl || ''}
                      onChange={(v) => updateConfig('bride', { fotoUrl: v })}
                      placeholder="https://.../foto-wanita.jpg"
                    />
                  </FormField>
                </div>

                <div className="border-t border-[#F0EBE3]" />

                {/* Quotes */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-[#3A5A40] uppercase tracking-wider">Ayat / Kutipan</p>
                    <ToggleSwitch
                      enabled={config.quotes?.enabled ?? true}
                      onChange={(v) => updateConfig('quotes', { enabled: v })}
                    />
                  </div>
                  {config.quotes?.enabled !== false && (
                    <>
                      <FormField label="Teks Arab (opsional)">
                        <TextArea
                          value={config.quotes?.teksArab || ''}
                          onChange={(v) => updateConfig('quotes', { teksArab: v })}
                          placeholder="بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ"
                          rows={2}
                        />
                      </FormField>
                      <FormField label="Kutipan">
                        <TextArea
                          value={config.quotes?.kutipan || ''}
                          onChange={(v) => updateConfig('quotes', { kutipan: v })}
                          placeholder="Dan di antara tanda-tanda kekuasaan-Nya..."
                          rows={3}
                        />
                      </FormField>
                      <FormField label="Sumber">
                        <TextInput
                          value={config.quotes?.sumber || ''}
                          onChange={(v) => updateConfig('quotes', { sumber: v })}
                          placeholder="QS. Ar-Rum: 21"
                        />
                      </FormField>
                    </>
                  )}
                </div>

                <div className="border-t border-[#F0EBE3]" />

                {/* Countdown */}
                <div className="space-y-3">
                  <ToggleSwitch
                    enabled={config.countdown?.enabled ?? true}
                    onChange={(v) => updateConfig('countdown', { enabled: v })}
                    label="Countdown"
                    description="Hitung mundur menuju hari H"
                  />
                </div>

                <div className="border-t border-[#F0EBE3]" />

                {/* Amplop Digital */}
                <div className="space-y-3">
                  <ToggleSwitch
                    enabled={config.amplopDigital?.enabled ?? true}
                    onChange={(v) => updateConfig('amplopDigital', { enabled: v })}
                    label="Amplop Digital"
                    description="Tampilkan rekening bank untuk kado"
                  />
                </div>

                <div className="border-t border-[#F0EBE3]" />

                {/* Alamat Kado */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#4A4A4A]">Alamat Kirim Kado</p>
                    <ToggleSwitch
                      enabled={config.alamatKado?.enabled ?? false}
                      onChange={(v) => updateConfig('alamatKado', { enabled: v })}
                    />
                  </div>
                  {config.alamatKado?.enabled && (
                    <FormField label="Alamat Lengkap">
                      <TextArea
                        value={config.alamatKado?.address || ''}
                        onChange={(v) => updateConfig('alamatKado', { address: v })}
                        placeholder="Jl. ... RT/RW ..., Kelurahan ..., Kecamatan ..."
                        rows={3}
                      />
                    </FormField>
                  )}
                </div>

                <div className="border-t border-[#F0EBE3]" />

                {/* Penutup */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#4A4A4A]">Penutup</p>
                    <ToggleSwitch
                      enabled={config.penutup?.enabled ?? true}
                      onChange={(v) => updateConfig('penutup', { enabled: v })}
                    />
                  </div>
                  {config.penutup?.enabled !== false && (
                    <FormField label="Pesan Penutup">
                      <TextArea
                        value={config.penutup?.message || ''}
                        onChange={(v) => updateConfig('penutup', { message: v })}
                        placeholder="Terima kasih atas doa dan restunya..."
                        rows={3}
                      />
                    </FormField>
                  )}
                </div>
              </div>
            </CollapsibleSection>

            {/* Section 3: Acara (Events) */}
            <CollapsibleSection
              icon={<Calendar className="w-4 h-4" />}
              title="Acara"
              subtitle="Sesi acara pernikahan"
            >
              <EventsSection
                events={invitation.events}
                invitationId={invitationId}
                onUpdate={() => loadData()}
              />
            </CollapsibleSection>

            {/* Section 4: Kado (Gifts) */}
            <CollapsibleSection
              icon={<Gift className="w-4 h-4" />}
              title="Kado"
              subtitle="Daftar kado & rekening bank"
              badge={user?.packageStatus !== 'paid' ? 'Draft' : undefined}
            >
              {user?.packageStatus !== 'paid' && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-amber-700 font-medium">Fitur ini akan aktif setelah pembayaran berhasil.</p>
                </div>
              )}
              <GiftsSection
                invitationId={invitationId}
                bankAccounts={invitation.bankAccounts}
                giftItems={invitation.giftItems}
                onUpdate={() => loadData()}
              />
            </CollapsibleSection>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-[#E8E0D4] px-5 py-3 flex items-center justify-between">
            <a
              href={`/v2/i/${invitation.subdomain}?preview=true`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold text-[#3A5A40] bg-[#3A5A40]/10 px-4 py-2.5 rounded-xl hover:bg-[#3A5A40]/20 transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> Preview Full
            </a>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 text-sm font-semibold text-white bg-[#3A5A40] px-6 py-2.5 rounded-xl hover:bg-[#2D4732] transition-colors disabled:opacity-60"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="flex-1 bg-[#F0EBE3] flex items-center justify-center p-8 min-h-screen">
          <div className="w-[375px] h-[700px] bg-black rounded-[3rem] p-3 shadow-2xl">
            <div className="w-full h-full bg-white rounded-[2.4rem] overflow-hidden relative">
              {/* Phone notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10" />

              {/* Preview iframe */}
              <iframe
                ref={iframeRef}
                src={`/v2/i/${invitation.subdomain}?preview=true`}
                className="w-full h-full border-0"
                title="Preview Undangan"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Template Modal */}
      <TemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        currentSlug={invitation.templateSlug}
        onSelect={async (slug) => {
          await fetch(`/api/v2/invitations/${invitationId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ templateSlug: slug }),
          })
          setInvitation(prev => prev ? { ...prev, templateSlug: slug } : null)
          setShowTemplateModal(false)
        }}
      />
    </div>
  )
}

// ─── Events Sub-Section ──────────────────────────────────────────────────────────
function EventsSection({ events, invitationId, onUpdate }: { events: any[]; invitationId: string; onUpdate: () => void }) {
  const [localEvents, setLocalEvents] = useState(events || [])
  const [isEditing, setIsEditing] = useState<number | null>(null)

  useEffect(() => { setLocalEvents(events || []) }, [events])

  const updateEvent = async (index: number, field: string, value: any) => {
    const ev = localEvents[index]
    const updated = [...localEvents]
    updated[index] = { ...ev, [field]: value }
    setLocalEvents(updated)

    try {
      await fetch(`/api/v2/invitations/${invitationId}/events`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: ev.id,
          [field]: value,
        }),
      })
    } catch {}
  }

  return (
    <div className="space-y-4">
      {localEvents.map((ev: any, i: number) => (
        <div key={ev.id || i} className="bg-[#FAFAF8] rounded-xl border border-[#E8E0D4] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-[#2D2D2D]">{ev.eventName || `Sesi ${i + 1}`}</p>
            <span className="text-xs text-[#8B7E6F]">Sesi {i + 1} dari {localEvents.length}</span>
          </div>
          <FormField label="Nama Sesi">
            <TextInput value={ev.eventName || ''} onChange={(v) => updateEvent(i, 'eventName', v)} placeholder="Akad Nikah / Resepsi" />
          </FormField>
          <FormField label="Tanggal">
            <TextInput value={ev.date ? ev.date.split('T')[0] : ''} onChange={(v) => updateEvent(i, 'date', new Date(v).toISOString())} type="date" />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Mulai">
              <TextInput value={ev.startTime || ''} onChange={(v) => updateEvent(i, 'startTime', v)} placeholder="08:00" type="time" />
            </FormField>
            <FormField label="Selesai">
              <TextInput value={ev.endTime || ''} onChange={(v) => updateEvent(i, 'endTime', v)} placeholder="10:00" type="time" />
            </FormField>
          </div>
          <FormField label="Venue">
            <TextInput value={ev.venue || ''} onChange={(v) => updateEvent(i, 'venue', v)} placeholder="Masjid / Gedung ..." />
          </FormField>
          <FormField label="Alamat">
            <TextArea value={ev.address || ''} onChange={(v) => updateEvent(i, 'address', v)} placeholder="Alamat lengkap..." rows={2} />
          </FormField>
          <FormField label="Google Maps URL">
            <TextInput value={ev.mapsUrl || ''} onChange={(v) => updateEvent(i, 'mapsUrl', v)} placeholder="https://maps.google.com/..." />
          </FormField>
          <ToggleSwitch enabled={ev.isMainEvent ?? false} onChange={(v) => updateEvent(i, 'isMainEvent', v)} label="Acara Utama" />
          <ToggleSwitch enabled={ev.rsvpEnabled ?? true} onChange={(v) => updateEvent(i, 'rsvpEnabled', v)} label="RSVP Aktif" />
        </div>
      ))}
    </div>
  )
}

// ─── Gifts Sub-Section ──────────────────────────────────────────────────────────
function GiftsSection({ invitationId, bankAccounts, giftItems, onUpdate }: {
  invitationId: string; bankAccounts: any[]; giftItems: any[]; onUpdate: () => void
}) {
  const [showBankForm, setShowBankForm] = useState(false)
  const [bankForm, setBankForm] = useState({ bankName: '', accountNumber: '', accountName: '' })

  const addBank = async () => {
    try {
      await fetch(`/api/v2/invitations/${invitationId}/bank-accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bankForm),
      })
      setBankForm({ bankName: '', accountNumber: '', accountName: '' })
      setShowBankForm(false)
      onUpdate()
    } catch {}
  }

  const deleteBank = async (id: string) => {
    try {
      await fetch(`/api/v2/invitations/${invitationId}/bank-accounts?bankId=${id}`, { method: 'DELETE' })
      onUpdate()
    } catch {}
  }

  return (
    <div className="space-y-4">
      {/* Bank Accounts */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-[#3A5A40] uppercase tracking-wider">Rekening Bank</p>
          <button
            onClick={() => setShowBankForm(!showBankForm)}
            className="text-xs font-semibold text-[#3A5A40] bg-[#3A5A40]/10 px-2.5 py-1 rounded-lg hover:bg-[#3A5A40]/20"
          >
            + Tambah
          </button>
        </div>

        {bankAccounts?.length > 0 && (
          <div className="space-y-2 mb-3">
            {bankAccounts.map((acc: any) => (
              <div key={acc.id} className="bg-[#FAFAF8] rounded-lg border border-[#E8E0D4] p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#2D2D2D]">{acc.bankName}</p>
                  <p className="text-xs text-[#8B7E6F]">{acc.accountNumber} - {acc.accountName}</p>
                </div>
                <button onClick={() => deleteBank(acc.id)} className="text-red-400 hover:text-red-600 text-xs">Hapus</button>
              </div>
            ))}
          </div>
        )}

        {showBankForm && (
          <div className="bg-[#FAFAF8] rounded-lg border border-[#E8E0D4] p-3 space-y-2">
            <FormField label="Nama Bank">
              <TextInput value={bankForm.bankName} onChange={(v) => setBankForm({ ...bankForm, bankName: v })} placeholder="BCA / Mandiri / ..." />
            </FormField>
            <FormField label="No. Rekening">
              <TextInput value={bankForm.accountNumber} onChange={(v) => setBankForm({ ...bankForm, accountNumber: v })} placeholder="1234567890" />
            </FormField>
            <FormField label="Atas Nama">
              <TextInput value={bankForm.accountName} onChange={(v) => setBankForm({ ...bankForm, accountName: v })} placeholder="Nama pemilik rekening" />
            </FormField>
            <div className="flex gap-2">
              <button onClick={addBank} className="flex-1 bg-[#3A5A40] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#2D4732]">Simpan</button>
              <button onClick={() => setShowBankForm(false)} className="px-3 py-2 text-sm text-[#8B7E6F] bg-[#F0EBE3] rounded-lg hover:bg-[#E8E0D4]">Batal</button>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-[#F0EBE3]" />

      {/* Gift Items */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-[#3A5A40] uppercase tracking-wider">Daftar Kado</p>
          <button className="text-xs font-semibold text-[#3A5A40] bg-[#3A5A40]/10 px-2.5 py-1 rounded-lg hover:bg-[#3A5A40]/20">
            + Tambah Kado
          </button>
        </div>
        {giftItems?.length > 0 ? (
          <div className="space-y-2">
            {giftItems.map((item: any) => (
              <div key={item.id} className="bg-[#FAFAF8] rounded-lg border border-[#E8E0D4] p-3">
                <p className="text-sm font-semibold text-[#2D2D2D]">{item.itemName}</p>
                {item.buyUrl && <p className="text-xs text-[#3A5A40]">{item.buyUrl}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#B0A898] text-center py-4">Belum ada kado terdaftar</p>
        )}
      </div>
    </div>
  )
}
