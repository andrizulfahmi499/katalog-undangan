'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Mail, CreditCard, LogOut, Plus, Edit, Trash2, ArrowLeft, Palette, FileText, Settings, Layout, X, Menu, Home, UserPlus, Clock, Sparkles, CalendarDays, ChevronRight, ExternalLink, Activity, Eye, Smartphone, Layers } from 'lucide-react'
import { TEMPLATE_OPTIONS, type TemplateOption } from '@/lib/invitationTemplates'
import OGImageUploader from '@/components/admin/OGImageUploader'
import ImagePreview from '@/components/admin/ImagePreview'

const DEFAULT_PRICING_PACKAGES = [
  { id: 1, name: 'Basic', price: '70.000', features: 'Masa aktif selamanya\nTanpa Batas Tamu\nGallery Foto Bebas', enabled: true },
  { id: 2, name: 'Premium', price: '100.000', features: 'Masa aktif selamanya\nTanpa Batas Tamu\nVideo Undangan Lengkap\nFilter Instagram', enabled: true },
  { id: 3, name: 'VIP', price: '150.000', features: 'Masa aktif selamanya\nBebas Custom\nCustom Domain Pilihan\nDesain Sesuai Keinginan\nPriority Support 24/7', enabled: true }
]

type Member = {
  id: string
  name: string
  email: string
  whatsapp: string
  creditPoints: number
  status: string
  landingPageEnabled?: boolean
  landingPageTheme?: string
  landingPageConfig?: any
  createdAt: string
}

type Invitation = {
  id: string
  title: string
  eventName: string
  eventDate: string
  location: string
  invitationLink: string
  invitationDomain: string
  costPoints: number
  status: string
  templateId?: string | null
  editorConfig?: any
  assignedMember: {
    id: string
    name: string
    email: string
  }
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'members' | 'invitations' | 'templates' | 'settings'>('dashboard')
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [members, setMembers] = useState<Member[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [globalThemeSetting, setGlobalThemeSetting] = useState<'default' | 'light' | 'cleanapp'>('default')
  const [globalFaviconSetting, setGlobalFaviconSetting] = useState<string>('/favicon-rose.svg')
  const [catalogLayout, setCatalogLayout] = useState<'grid' | 'thumbnail'>('grid')
  const [isSavingGlobalTheme, setIsSavingGlobalTheme] = useState(false)
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [showAddInvitationModal, setShowAddInvitationModal] = useState(false)
  const [currentAdminId, setCurrentAdminId] = useState<string>('')
  const [showEditMemberModal, setShowEditMemberModal] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [editMemberActiveTab, setEditMemberActiveTab] = useState<'profile' | 'theme'>('profile')
  const [editMemberForm, setEditMemberForm] = useState({
    name: '',
    email: '',
    whatsapp: '',
    password: '',
    creditPoints: 0,
    status: 'active',
    landingPageEnabled: false,
    landingPageTheme: 'default'
  })

  // Theme Config state
  const [selectedMemberForTheme, setSelectedMemberForTheme] = useState<string>('')
  const [themeConfigTab, setThemeConfigTab] = useState<'text' | 'images' | 'colors' | 'features' | 'pricing' | 'faq' | 'templates'>('text')
  const [themeConfig, setThemeConfig] = useState<any>(null)
  const [isSavingThemeConfig, setIsSavingThemeConfig] = useState(false)
  const [isLoadingThemeConfig, setIsLoadingThemeConfig] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [previewKey, setPreviewKey] = useState(0)

  // Iframe Preview Modal state
  const [previewIframeUrl, setPreviewIframeUrl] = useState<string | null>(null)
  const [previewIframeTitle, setPreviewIframeTitle] = useState('')
  const [previewIframeDevice, setPreviewIframeDevice] = useState<'mobile' | 'desktop'>('mobile')

  // Templates state
  const [templates, setTemplates] = useState<TemplateOption[]>(TEMPLATE_OPTIONS)
  const [showEditTemplateModal, setShowEditTemplateModal] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<TemplateOption | null>(null)
  const [editTemplateForm, setEditTemplateForm] = useState({
    title: '',
    category: 'Pernikahan' as 'Pernikahan' | 'Ultah',
    accent: '',
    description: '',
    heroLabel: '',
    heroLine: '',
    defaultMessage: ''
  })

  // Get admin ID from localStorage
  useEffect(() => {
    const storedAdminId = localStorage.getItem('adminId')
    if (storedAdminId) {
      setCurrentAdminId(storedAdminId)
    } else {
      // Redirect to login if no admin ID found
      window.location.href = '/login'
    }
  }, [])

  // New member form state
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    whatsapp: '',
    password: '',
    creditPoints: 0,
    landingPageEnabled: false,
    landingPageTheme: 'default',
  })

  // Pricing packages for new member
  const [newMemberPricing, setNewMemberPricing] = useState(DEFAULT_PRICING_PACKAGES.map(p => ({ ...p })))

  // Pricing packages for edit member
  const [editMemberPricing, setEditMemberPricing] = useState(DEFAULT_PRICING_PACKAGES.map(p => ({ ...p })))

  // Helper function to calculate color contrast ratio for accessibility
  const calculateContrastRatio = (color1: string, color2: string): number => {
    // Convert hex to RGB
    const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null
    }

    // Calculate relative luminance
    const getLuminance = (r: number, g: number, b: number): number => {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
    }

    const rgb1 = hexToRgb(color1)
    const rgb2 = hexToRgb(color2)

    if (!rgb1 || !rgb2) return 0

    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)

    const lighter = Math.max(lum1, lum2)
    const darker = Math.min(lum1, lum2)

    return (lighter + 0.05) / (darker + 0.05)
  }

  // New invitation form state
  const [newInvitation, setNewInvitation] = useState({
    title: '',
    eventName: '',
    eventDate: '',
    location: '',
    invitationLink: '',
    templateMessage: '',
    costPoints: 20,
    assignedMemberId: '',
  })

  useEffect(() => {
    fetchMembers()
    fetchInvitations()
    fetchGlobalTheme()
  }, [])

  useEffect(() => {
    if (selectedMemberForTheme) {
      fetchThemeConfig(selectedMemberForTheme)
    } else {
      setThemeConfig(null)
    }
  }, [selectedMemberForTheme])

  const fetchGlobalTheme = async () => {
    try {
      const res = await fetch('/api/admin/settings')
      const data = await res.json()
      if (data.success && data.data) {
        setGlobalThemeSetting(data.data.landingPageTheme)
        setGlobalFaviconSetting(data.data.landingPageFavicon || '/favicon-rose.svg')
        if (data.data.catalogLayout) setCatalogLayout(data.data.catalogLayout)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const fetchThemeConfig = async (memberId: string) => {
    setIsLoadingThemeConfig(true)
    try {
      const res = await fetch(`/api/admin/theme-config?memberId=${memberId}`)
      const data = await res.json()
      if (data.success && data.data) {
        setThemeConfig(data.data.config)
      }
    } catch (e) {
      console.error('Error fetching theme config:', e)
      alert('Failed to load theme configuration')
    } finally {
      setIsLoadingThemeConfig(false)
    }
  }

  const saveThemeConfig = async () => {
    if (!selectedMemberForTheme || !themeConfig) return

    setIsSavingThemeConfig(true)
    try {
      const res = await fetch('/api/admin/theme-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: selectedMemberForTheme,
          config: themeConfig
        })
      })

      const data = await res.json()
      if (data.success) {
        alert('Theme configuration saved successfully!')
      } else {
        alert(data.error || 'Failed to save theme configuration')
      }
    } catch (e) {
      console.error('Error saving theme config:', e)
      alert('Failed to save theme configuration')
    } finally {
      setIsSavingThemeConfig(false)
    }
  }

  const resetThemeConfig = async () => {
    if (!selectedMemberForTheme) return

    const confirmed = confirm(
      'Are you sure you want to reset the theme configuration to default values? This action cannot be undone.'
    )

    if (!confirmed) return

    setIsSavingThemeConfig(true)
    try {
      // Import default config
      const { DEFAULT_CLEANAPP_CONFIG } = await import('@/lib/schemas/cleanapp-theme')

      // Save default config to database
      const res = await fetch('/api/admin/theme-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: selectedMemberForTheme,
          config: DEFAULT_CLEANAPP_CONFIG
        })
      })

      const data = await res.json()
      if (data.success) {
        // Update local state with default config
        setThemeConfig(DEFAULT_CLEANAPP_CONFIG)
        alert('Theme configuration has been reset to default values!')
      } else {
        alert(data.error || 'Failed to reset theme configuration')
      }
    } catch (e) {
      console.error('Error resetting theme config:', e)
      alert('Failed to reset theme configuration')
    } finally {
      setIsSavingThemeConfig(false)
    }
  }

  const saveGlobalTheme = async (theme: 'default' | 'light' | 'cleanapp') => {
    setIsSavingGlobalTheme(true)
    setGlobalThemeSetting(theme)
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          landingPageTheme: theme,
          landingPageFavicon: globalFaviconSetting,
          catalogLayout,
        })
      })
      alert('Pengaturan landing page berhasil disimpan! Semua pengunjung akan melihat perubahan ini.')
    } catch (e) {
      alert('Gagal menyimpan pengaturan')
    } finally {
      setIsSavingGlobalTheme(false)
    }
  }

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!['image/svg+xml', 'image/png', 'image/x-icon', 'image/vnd.microsoft.icon'].includes(file.type)) {
      alert('Hanya mendukung file SVG, PNG, atau ICO')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setGlobalFaviconSetting(event.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const resetFavicon = () => {
    setGlobalFaviconSetting('/favicon-rose.svg')
  }

  const fetchMembers = async () => {
    try {
      const response = await fetch(`/api/admin/members?_t=${Date.now()}`, { cache: 'no-store' })
      const data = await response.json()
      if (data.success) {
        setMembers(data.data)
      }
    } catch (error) {
      console.error('Error fetching members:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchInvitations = async () => {
    try {
      const response = await fetch(`/api/admin/invitations?_t=${Date.now()}`, { cache: 'no-store' })
      const data = await response.json()
      if (data.success) {
        setInvitations(data.data)
      }
    } catch (error) {
      console.error('Error fetching invitations:', error)
    }
  }

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        ...newMember,
        landingPageConfig: newMember.landingPageEnabled ? {
          pricingPackages: newMemberPricing
        } : undefined
      }
      const response = await fetch('/api/admin/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        fetchMembers()
        setShowAddMemberModal(false)
        setNewMember({ name: '', email: '', whatsapp: '', password: '', creditPoints: 0, landingPageEnabled: false, landingPageTheme: 'default' })
        setNewMemberPricing(DEFAULT_PRICING_PACKAGES.map(p => ({ ...p })))
      } else {
        alert(data.error || 'Gagal menambah member')
      }
    } catch (error) {
      console.error('Error adding member:', error)
      alert('Terjadi kesalahan saat menambah member')
    }
  }

  const openEditModal = (member: Member) => {
    setEditingMember(member)
    setEditMemberActiveTab('profile')
    setSelectedMemberForTheme(member.id)
    setEditMemberForm({
      name: member.name,
      email: member.email,
      whatsapp: member.whatsapp,
      password: '',
      creditPoints: member.creditPoints,
      status: member.status || 'active',
      landingPageEnabled: member.landingPageEnabled || false,
      landingPageTheme: member.landingPageTheme || 'default'
    })
    // Load existing pricing from config, or use defaults
    const existingPricing = (member.landingPageConfig as any)?.pricingPackages
    if (existingPricing && existingPricing.length > 0) {
      setEditMemberPricing(existingPricing)
    } else {
      setEditMemberPricing(DEFAULT_PRICING_PACKAGES.map(p => ({ ...p })))
    }
    setShowEditMemberModal(true)
  }

  const handleEditMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingMember) return

    try {
      const updateData: any = {
        name: editMemberForm.name,
        email: editMemberForm.email,
        whatsapp: editMemberForm.whatsapp,
        creditPoints: editMemberForm.creditPoints,
        status: editMemberForm.status,
        landingPageEnabled: editMemberForm.landingPageEnabled,
        landingPageTheme: editMemberForm.landingPageTheme,
        landingPageConfig: editMemberForm.landingPageEnabled ? {
          pricingPackages: editMemberPricing
        } : undefined
      }

      if (editMemberForm.password) {
        updateData.password = editMemberForm.password
      }

      const response = await fetch(`/api/admin/members/${editingMember.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (data.success) {
        fetchMembers()
        setShowEditMemberModal(false)
        setEditingMember(null)
      } else {
        alert(data.error || 'Gagal mengupdate member')
      }
    } catch (error) {
      console.error('Error updating member:', error)
      alert('Terjadi kesalahan saat mengupdate member')
    }
  }

  const handleAddInvitation = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if admin ID is available
    if (!currentAdminId) {
      alert('Admin ID tidak tersedia. Silakan refresh halaman.')
      return
    }

    try {
      const response = await fetch('/api/admin/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newInvitation,
          createdById: currentAdminId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        fetchInvitations()
        fetchMembers() // Refresh to update credit points
        setShowAddInvitationModal(false)
        setNewInvitation({
          title: '',
          eventName: '',
          eventDate: '',
          location: '',
          invitationLink: '',
          templateMessage: '',
          costPoints: 20,
          assignedMemberId: '',
        })
      } else {
        alert(data.error || 'Gagal menambah undangan')
      }
    } catch (error) {
      console.error('Error adding invitation:', error)
      alert('Terjadi kesalahan saat menambah undangan')
    }
  }

  // Template functions
  const openEditTemplateModal = (template: TemplateOption) => {
    setEditingTemplate(template)
    setEditTemplateForm({
      title: template.title,
      category: template.category,
      accent: template.accent,
      description: template.description,
      heroLabel: template.heroLabel,
      heroLine: template.heroLine,
      defaultMessage: template.defaultMessage
    })
    setShowEditTemplateModal(true)
  }

  const handleEditTemplate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTemplate) return

    try {
      // Update template in local state
      const updatedTemplates = templates.map(template =>
        template.id === editingTemplate.id
          ? { ...template, ...editTemplateForm }
          : template
      )
      setTemplates(updatedTemplates)

      // Here you would typically save to a database or file
      // For now, we'll just update the local state
      alert('Template berhasil diupdate! (Perubahan tersimpan di memory browser)')

      setShowEditTemplateModal(false)
      setEditingTemplate(null)
    } catch (error) {
      console.error('Error updating template:', error)
      alert('Terjadi kesalahan saat mengupdate template')
    }
  }

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Yakin ingin menghapus member ini?')) return

    const previousMembers = [...members]
    setMembers(members.filter((m) => m.id !== id)) // optimistic update

    try {
      const response = await fetch(`/api/admin/members/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Optionally fetchMembers() here if you want to ensure perfect sync
      } else {
        throw new Error(data.error || 'Gagal menghapus member')
      }
    } catch (error: any) {
      console.error('Error deleting member:', error)
      alert(error?.message || 'Gagal menghapus member')
      setMembers(previousMembers) // rollback if error
    }
  }

  const handleDeleteInvitation = async (id: string) => {
    if (!confirm('Yakin ingin menghapus undangan ini? Mengembalikan credit points member.')) return

    try {
      const response = await fetch(`/api/admin/invitations/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok && data.success) {
        fetchInvitations()
        fetchMembers() // Refresh members credit points
      } else {
        throw new Error(data.error || 'Gagal menghapus undangan')
      }
    } catch (error: any) {
      console.error('Error deleting invitation:', error)
      alert(error?.message || 'Gagal menghapus undangan')
    }
  }


  const handleLogout = () => {
    // Clear admin data from localStorage
    localStorage.removeItem('adminId')
    localStorage.removeItem('adminName')
    localStorage.removeItem('adminEmail')
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-[#F7F9FB] flex text-gray-800" style={{ fontFamily: "'Lato', sans-serif" }}>
      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-white border-r border-gray-100 flex-col hidden md:flex sticky top-0 h-screen z-50 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 tracking-wide flex items-center gap-2" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
            <div className="w-8 h-8 rounded-lg bg-[#0ea5e9] flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            Katalog
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Main Menu</p>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'dashboard'
                ? 'bg-[#0ea5e9]/10 text-[#0ea5e9]'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            <Home className="w-5 h-5" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'members'
                ? 'bg-[#0ea5e9]/10 text-[#0ea5e9]'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            <Users className="w-5 h-5" />
            Members
          </button>

          <button
            onClick={() => setActiveTab('invitations')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'invitations'
                ? 'bg-[#0ea5e9]/10 text-[#0ea5e9]'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            <Mail className="w-5 h-5" />
            Invitations
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'templates'
                ? 'bg-[#0ea5e9]/10 text-[#0ea5e9]'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            <FileText className="w-5 h-5" />
            Templates
          </button>

          <a
            href="/admin/parallax-editor"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          >
            <Layers className="w-5 h-5" />
            Editor 3D Parallax
          </a>

          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-8 mb-2">System</p>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'settings'
                ? 'bg-[#0ea5e9]/10 text-[#0ea5e9]'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            <Settings className="w-5 h-5" />
            Global Settings
          </button>

          <button
            onClick={() => setActiveTab('theme-config')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'theme-config'
                ? 'bg-[#0ea5e9]/10 text-[#0ea5e9]'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            <Layout className="w-5 h-5" />
            Theme Config
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            {/* Drawer panel */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white z-[70] shadow-2xl flex flex-col md:hidden"
            >
              {/* Brand header */}
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                  <div className="w-8 h-8 rounded-lg bg-[#0ea5e9] flex items-center justify-center">
                    <span className="text-white font-bold text-lg">K</span>
                  </div>
                  Katalog
                </h1>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation items */}
              <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                <p className="px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Main Menu</p>

                {([
                  { key: 'dashboard', label: 'Dashboard', icon: Home },
                  { key: 'members', label: 'Members', icon: Users },
                  { key: 'invitations', label: 'Undangan Saya', icon: Mail },
                  { key: 'templates', label: 'Templates', icon: FileText },
                ] as const).map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => { setActiveTab(key); setIsMobileSidebarOpen(false) }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm ${activeTab === key
                        ? 'bg-[#0ea5e9]/10 text-[#0ea5e9]'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </button>
                ))}

                <a
                  href="/admin/parallax-editor"
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <Layers className="w-5 h-5" />
                  Editor 3D Parallax
                </a>

                <p className="px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-2">System</p>

                {([
                  { key: 'settings', label: 'Global Settings', icon: Settings }
                ] as const).map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => { setActiveTab(key); setIsMobileSidebarOpen(false) }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm ${activeTab === key
                        ? 'bg-[#0ea5e9]/10 text-[#0ea5e9]'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Bottom logout */}
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-medium text-sm"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
          <div className="px-4 sm:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Hamburger menu button (mobile) */}
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-900 hidden sm:block" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Good morning, Admin</h2>
                <p className="text-sm text-gray-500 hidden sm:block">Here is what's happening with your platform today.</p>
                <h2 className="text-lg font-bold text-gray-900 sm:hidden" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Admin Panel</h2>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = '/admin/editor'}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-3 sm:px-4 py-2.5 text-sm font-semibold transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Buat Undangan</span>
              </motion.button>
              <div className="w-px h-8 bg-gray-200 hidden sm:block mx-1"></div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="hidden sm:flex items-center justify-center p-2.5 text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-8">

          {/* Dashboard Tab (Stats Cards & Overview) */}
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="space-y-6 sm:space-y-8 pb-10"
              >
                {/* 1. Welcome Header */}
                <div className="bg-gradient-to-r from-[#0ea5e9]/10 to-indigo-500/5 rounded-3xl p-6 sm:p-8 border border-[#0ea5e9]/10">
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="w-6 h-6 text-[#0ea5e9]" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                      Welcome back, Admin 👋
                    </h2>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600" style={{ fontFamily: "'Lato', sans-serif" }}>
                    Berikut adalah ringkasan aktivitas platform Katalog Anda hari ini.
                  </p>
                </div>

                {/* 2. Top Stats - 3 Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0f172a] rounded-3xl p-6 text-white shadow-xl shadow-[#0f172a]/10 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-5 transform group-hover:scale-110 transition-transform duration-500">
                      <Mail className="w-32 h-32" />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                      <div>
                        <p className="text-sm text-gray-400 font-medium mb-1">Total Undangan</p>
                        <p className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>{invitations.length}</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#0ea5e9] font-medium bg-[#0ea5e9]/10 w-fit px-3 py-1.5 rounded-lg border border-[#0ea5e9]/20">
                        <Activity className="w-3.5 h-3.5" />
                        <span>Active Invitations</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col h-full justify-between group hover:border-[#0ea5e9]/30 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-gray-500 font-medium">Total Member</p>
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                          <Users className="w-6 h-6" />
                        </div>
                      </div>
                      <p className="text-3xl sm:text-4xl font-bold text-gray-900" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>{members.length}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-50">
                      <p className="text-xs text-gray-400 flex items-center gap-1.5">
                        <UserPlus className="w-3.5 h-3.5" /> Registered users
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col h-full justify-between group hover:border-[#0ea5e9]/30 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-gray-500 font-medium">Total Template</p>
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                          <Palette className="w-6 h-6" />
                        </div>
                      </div>
                      <p className="text-3xl sm:text-4xl font-bold text-gray-900" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>{templates.length}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-50">
                      <p className="text-xs text-gray-400 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> Available themes
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* 3. Quick Actions */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 px-1" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Quick Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <button
                      onClick={() => setActiveTab('invitations')}
                      className="flex items-center gap-4 p-4 bg-white border border-[#0ea5e9]/20 rounded-2xl hover:bg-[#0ea5e9]/5 hover:border-[#0ea5e9] transition-all group text-left"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#0ea5e9] text-white flex items-center justify-center shadow-md shadow-[#0ea5e9]/20 group-hover:scale-105 transition-transform">
                        <Plus className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Buat Undangan Baru</p>
                        <p className="text-xs text-gray-500 mt-0.5">Mulai desain undangan</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveTab('members')}
                      className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all group text-left"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                        <UserPlus className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Tambah Member Baru</p>
                        <p className="text-xs text-gray-500 mt-0.5">Daftarkan user klien</p>
                      </div>
                    </button>


                  </div>
                </div>

                {/* 4. Split Layout: Recent Invitations & Newest Members */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                  {/* Left Column (Wider): Recent Invitations */}
                  <div className="lg:col-span-3 bg-white border border-gray-100 rounded-3xl p-5 sm:p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[#0ea5e9]" />
                        <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Undangan Terbaru</h3>
                      </div>
                      <button
                        onClick={() => setActiveTab('invitations')}
                        className="text-xs font-semibold text-[#0ea5e9] hover:text-[#0284c7] flex items-center gap-1"
                      >
                        Lihat Semua <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {invitations.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-sm text-gray-500">Belum ada undangan yang dibuat.</p>
                        </div>
                      ) : (
                        invitations.slice(0, 4).map((inv) => {
                          const template = TEMPLATE_OPTIONS.find(t => t.id === inv.templateId) || TEMPLATE_OPTIONS[0];

                          return (
                            <div key={inv.id} className="group flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${template.accent} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                                  <Palette className="w-5 h-5 text-white/90" />
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold text-gray-900 line-clamp-1" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>{inv.title}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[11px] font-medium text-[#0ea5e9] bg-[#0ea5e9]/10 px-2 py-0.5 rounded-full">{template.title}</span>
                                    <span className="text-xs text-gray-400 flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {inv.eventDate}</span>
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => setActiveTab('invitations')}
                                className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-400 flex items-center justify-center hover:text-[#0ea5e9] hover:border-[#0ea5e9] hover:shadow-sm transition-all opacity-0 group-hover:opacity-100"
                                title="Buka Detail"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Right Column (Narrower): Newest Members */}
                  <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-5 sm:p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-emerald-500" />
                        <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Member Baru</h3>
                      </div>
                      <button
                        onClick={() => setActiveTab('members')}
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                      >
                        Semua <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {members.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-sm text-gray-500">Belum ada member terdaftar.</p>
                        </div>
                      ) : (
                        members.slice(0, 4).map((member) => (
                          <div key={member.id} className="flex items-center justify-between p-3 rounded-2xl border border-gray-50 hover:border-emerald-100 hover:bg-emerald-50/30 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                                {member.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-gray-900 line-clamp-1" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>{member.name}</h4>
                                <p className="text-[11px] text-gray-500 truncate w-32 sm:w-40">{member.email}</p>
                              </div>
                            </div>
                            <span className={`text-[10px] px-2 py-1 rounded-md font-semibold border ${member.status === 'active'
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                : 'bg-gray-50 text-gray-500 border-gray-200'
                              }`}>
                              {member.status.toUpperCase()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Members Tab */}
          <AnimatePresence mode="wait">
            {activeTab === 'members' && (
              <motion.div
                key="members"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white border border-gray-100 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden"
              >
                <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/50">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Daftar Member</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddMemberModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-xl font-medium min-h-[44px] text-sm shadow-sm"
                    style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                  >
                    <Plus className="w-5 h-5" />
                    Tambah Member
                  </motion.button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Lato', sans-serif" }}>Nama</th>
                        <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Lato', sans-serif" }}>Email</th>
                        <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Lato', sans-serif" }}>WhatsApp</th>
                        <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Lato', sans-serif" }}>Credit Points</th>
                        <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Lato', sans-serif" }}>Status</th>
                        <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Lato', sans-serif" }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {members.map((member) => (
                        <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-gray-900 text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>{member.name}</td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-500 text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>{member.email}</td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-500 text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>{member.whatsapp}</td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <span className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-xs font-medium" style={{ fontFamily: "'Lato', sans-serif" }}>
                              {member.creditPoints} coin
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${member.status === 'active'
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                : 'bg-red-50 text-red-600 border-red-100'
                              }`} style={{ fontFamily: "'Lato', sans-serif" }}>
                              {member.status}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => openEditModal(member)}
                                className="p-2 text-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                                title="Edit Member"
                              >
                                <Edit className="w-5 h-5" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteMember(member.id)}
                                className="p-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                                title="Hapus Member"
                              >
                                <Trash2 className="w-5 h-5" />
                              </motion.button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {members.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 sm:px-6 py-8 sm:py-12 text-center text-gray-400 text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>
                            Belum ada member. Klik "Tambah Member" untuk menambah member baru.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Invitations Tab */}
            {activeTab === 'invitations' && (
              <motion.div
                key="invitations"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* Header with search + add button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Undangan Saya</h2>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowAddInvitationModal(true)}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-xl font-semibold text-sm shadow-sm transition-colors"
                    style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                  >
                    <Plus className="w-5 h-5" />
                    Buat Undangan Baru
                  </motion.button>
                </div>

                {/* Invitation cards list */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {invitations.map((invitation, index) => {
                    const template = TEMPLATE_OPTIONS.find(t => t.id === invitation.templateId)
                    const themeName = template?.title || 'Custom'
                    const accentGradient = template?.accent || 'from-gray-300 to-gray-400'
                    const eventDate = new Date(invitation.eventDate)
                    const dayName = eventDate.toLocaleDateString('id-ID', { weekday: 'long' })
                    const formattedDate = eventDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

                    let coverImage = null
                    try {
                      if (invitation.editorConfig) {
                        const configObj = typeof invitation.editorConfig === 'string' ? JSON.parse(invitation.editorConfig) : invitation.editorConfig
                        if (configObj?.ui?.backgroundImageUrl) {
                          coverImage = configObj.ui.backgroundImageUrl
                        }
                      }
                    } catch (e) { }

                    return (
                      <motion.div
                        key={invitation.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                        className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                      >
                        <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5">
                          {/* OG Icon / Template thumbnail */}
                          <div className={`flex-shrink-0 w-20 h-24 sm:w-24 sm:h-32 rounded-xl overflow-hidden bg-gradient-to-br ${accentGradient} flex items-center justify-center shadow-sm relative`}>
                            {coverImage ? (
                              <img src={coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                              <FileText className="w-8 h-8 text-white/90 relative z-10" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <h3 className="text-sm sm:text-base font-bold text-gray-900 truncate" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                                  {invitation.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-500 mt-0.5" style={{ fontFamily: "'Lato', sans-serif" }}>
                                  {dayName}, {formattedDate}
                                </p>
                              </div>

                              {/* Action buttons */}
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => {
                                    setPreviewIframeUrl(`/invitation/${invitation.id}`)
                                    setPreviewIframeTitle(invitation.title)
                                    setPreviewIframeDevice('mobile')
                                  }}
                                  className="p-2 text-[#0ea5e9] hover:bg-sky-50 rounded-lg transition-colors"
                                  title="Preview"
                                >
                                  <Eye className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => {
                                    window.location.href = `/admin/editor?id=${invitation.id}`
                                  }}
                                  className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDeleteInvitation(invitation.id)}
                                  className="p-2 text-red-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </div>

                            {/* Meta row: theme name tag */}
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-sky-50 text-sky-600 border border-sky-100">
                                <Palette className="w-3 h-3" />
                                {themeName}
                              </span>
                              <span className="text-[11px] text-gray-400" style={{ fontFamily: "'Lato', sans-serif" }}>
                                {invitation.assignedMember.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}

                  {invitations.length === 0 && (
                    <div className="bg-white border border-gray-100 rounded-2xl p-10 sm:p-16 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-7 h-7 text-gray-300" />
                      </div>
                      <p className="text-gray-500 text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>
                        Belum ada undangan. Klik <span className="font-semibold text-[#0ea5e9]">"Buat Undangan Baru"</span> untuk memulai.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white border border-gray-100 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden p-4 sm:p-6"
              >
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Global Settings</h2>

                <div className="bg-gray-50/50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-100 mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Tema Landing Page (Global)</h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6" style={{ fontFamily: "'Lato', sans-serif" }}>
                    Pilih tema yang akan diterapkan untuk halaman utama website (landing page public) bagi semua pengunjung.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <button
                      onClick={() => setGlobalThemeSetting('default')}
                      className={`py-3 sm:py-4 rounded-xl border-2 transition-all font-medium text-sm ${globalThemeSetting === 'default'
                          ? 'border-[#0ea5e9] bg-[#0ea5e9]/5 text-[#0ea5e9]'
                          : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                      style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                    >
                      <div className="font-bold mb-1">Default Theme</div>
                      <div className="text-xs opacity-70">(DearMyLove Dark/Green)</div>
                    </button>
                    <button
                      onClick={() => setGlobalThemeSetting('light')}
                      className={`py-3 sm:py-4 rounded-xl border-2 transition-all font-medium text-sm ${globalThemeSetting === 'light'
                          ? 'border-[#0ea5e9] bg-[#0ea5e9]/5 text-[#0ea5e9]'
                          : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                      style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                    >
                      <div className="font-bold mb-1">Light Theme</div>
                      <div className="text-xs opacity-70">(Neumorphism / Glass)</div>
                    </button>
                    <button
                      onClick={() => setGlobalThemeSetting('cleanapp' as any)}
                      className={`py-3 sm:py-4 rounded-xl border-2 transition-all font-medium text-sm ${globalThemeSetting === 'cleanapp'
                          ? 'border-[#0ea5e9] bg-[#0ea5e9]/5 text-[#0ea5e9]'
                          : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                      style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                    >
                      <div className="font-bold mb-1">CleanApp Theme</div>
                      <div className="text-xs opacity-70">(Modern Mobile App)</div>
                    </button>
                  </div>

                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Favicon URL / Upload</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-3" style={{ fontFamily: "'Lato', sans-serif" }}>
                      Gunakan URL gambar atau upload langsung dari komputer Anda. Mendukung SVG, PNG, dan ICO.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 mb-3">
                      <input
                        type="text"
                        value={globalFaviconSetting}
                        onChange={(e) => setGlobalFaviconSetting(e.target.value)}
                        placeholder="/favicon-rose.svg"
                        className="flex-1 px-4 py-2.5 sm:py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 text-sm transition-all"
                        style={{ fontFamily: "'Lato', sans-serif" }}
                      />
                      <label className="cursor-pointer px-4 sm:px-6 py-2.5 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-center whitespace-nowrap text-sm min-h-[44px] flex items-center justify-center transition-colors" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                        <span>Upload File</span>
                        <input type="file" className="hidden" accept=".svg,.png,.ico" onChange={handleFaviconUpload} />
                      </label>
                    </div>

                    {globalFaviconSetting && (
                      <div className="mt-2 flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500" style={{ fontFamily: "'Lato', sans-serif" }}>Preview:</span>
                          <img src={globalFaviconSetting} alt="Favicon Preview" className="w-8 h-8 object-contain rounded border border-gray-100 p-0.5 bg-gray-50" />
                        </div>
                        <button
                          onClick={resetFavicon}
                          className="text-xs text-red-500 hover:text-red-600 hover:underline font-medium"
                          style={{ fontFamily: "'Lato', sans-serif" }}
                        >
                          Reset ke Default
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Catalog Layout Setting */}
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Tampilan Katalog Tema</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-3" style={{ fontFamily: "'Lato', sans-serif" }}>
                      Pilih tampilan section katalog tema pada landing page.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => setCatalogLayout('grid')}
                        className={`py-3 sm:py-4 rounded-xl border-2 transition-all font-medium text-sm ${catalogLayout === 'grid'
                            ? 'border-[#0ea5e9] bg-[#0ea5e9]/5 text-[#0ea5e9]'
                            : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-300'
                          }`}
                        style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                      >
                        <div className="font-bold mb-1">Tema Katalog 1</div>
                        <div className="text-xs opacity-70">(Grid / Default)</div>
                      </button>
                      <button
                        onClick={() => setCatalogLayout('thumbnail')}
                        className={`py-3 sm:py-4 rounded-xl border-2 transition-all font-medium text-sm ${catalogLayout === 'thumbnail'
                            ? 'border-[#0ea5e9] bg-[#0ea5e9]/5 text-[#0ea5e9]'
                            : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-300'
                          }`}
                        style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                      >
                        <div className="font-bold mb-1">Tema Katalog 2</div>
                        <div className="text-xs opacity-70">(Thumbnail / Product Detail)</div>
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => saveGlobalTheme(globalThemeSetting)}
                      disabled={isSavingGlobalTheme}
                      className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-xl font-bold disabled:opacity-50 text-sm min-h-[44px] shadow-sm"
                      style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                    >
                      {isSavingGlobalTheme ? 'Menyimpan...' : 'Simpan Pengaturan'}
                    </motion.button>
                  </div>
                </div>

                {/* Open Graph Image Section */}
                <div className="bg-gray-50/50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-100 mt-4 sm:mt-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Open Graph Image</h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6" style={{ fontFamily: "'Lato', sans-serif" }}>
                    Upload gambar kustom untuk preview di media sosial (WhatsApp, Facebook, Twitter, LinkedIn). Gambar ini akan muncul ketika link website dibagikan.
                  </p>

                  <OGImageUploaderSection />
                </div>
              </motion.div>
            )}

          </AnimatePresence>
          {/* Templates Tab */}
          <AnimatePresence mode="wait">
            {activeTab === 'templates' && (
              <motion.div
                key="templates"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Katalog Template</h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5" style={{ fontFamily: "'Lato', sans-serif" }}>Kelola template undangan yang tersedia</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {templates.map((template, index) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                    >
                      <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5">
                        {/* OG Icon with gradient accent */}
                        <div className={`flex-shrink-0 w-20 h-24 sm:w-24 sm:h-32 rounded-xl bg-gradient-to-br ${template.accent} flex items-center justify-center shadow-sm`}>
                          <Palette className="w-8 h-8 text-white/90" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="text-sm sm:text-base font-bold text-gray-900 truncate" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                                {template.title}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 line-clamp-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                                {template.description}
                              </p>
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center gap-0.5 flex-shrink-0">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  // Find first invitation using this template to preview
                                  const sampleInv = invitations.find(inv => inv.templateId === template.id)
                                  if (sampleInv) {
                                    setPreviewIframeUrl(`/invitation/${sampleInv.id}`)
                                    setPreviewIframeTitle(template.title)
                                    setPreviewIframeDevice('mobile')
                                  } else {
                                    alert('Belum ada undangan yang menggunakan template ini. Buat undangan dengan template ini terlebih dahulu untuk preview.')
                                  }
                                }}
                                className="flex-shrink-0 p-2 text-[#0ea5e9] hover:bg-sky-50 rounded-lg transition-colors"
                                title="Preview Template"
                              >
                                <Eye className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => openEditTemplateModal(template)}
                                className="flex-shrink-0 p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="Edit Template"
                              >
                                <Edit className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>

                          {/* Meta row */}
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${template.category === 'Pernikahan'
                                ? 'bg-pink-50 text-pink-600 border border-pink-100'
                                : 'bg-blue-50 text-blue-600 border border-blue-100'
                              }`}>
                              {template.category}
                            </span>
                            <span className="text-[11px] text-gray-400" style={{ fontFamily: "'Lato', sans-serif" }}>
                              {template.heroLabel} · {template.heroLine}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Add Member Modal */}
      <AnimatePresence>
        {showAddMemberModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative bg-white backdrop-blur-md border border-gray-200 shadow-xl rounded-3xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto transition-all duration-300 ${editMemberActiveTab === 'theme' ? 'max-w-4xl' : 'max-w-md'}`}
            >
              <button
                type="button"
                onClick={() => setShowAddMemberModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                title="Batal"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Tambah Member Baru</h3>
              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Nama</label>
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Email</label>
                  <input
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>WhatsApp</label>
                  <input
                    type="text"
                    value={newMember.whatsapp}
                    onChange={(e) => setNewMember({ ...newMember, whatsapp: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Password</label>
                  <input
                    type="password"
                    value={newMember.password}
                    onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Credit Points Awal</label>
                  <input
                    type="number"
                    value={newMember.creditPoints}
                    onChange={(e) => setNewMember({ ...newMember, creditPoints: parseInt(e.target.value) || 0 })}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  />
                </div>
                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-xl bg-gray-50">
                    <input
                      type="checkbox"
                      checked={newMember.landingPageEnabled}
                      onChange={(e) => setNewMember({ ...newMember, landingPageEnabled: e.target.checked })}
                      className="w-5 h-5 rounded text-[#0ea5e9] focus:ring-[#0ea5e9] border-gray-300"
                    />
                    <span className="text-xs sm:text-sm font-medium text-gray-900" style={{ fontFamily: "'Lato', sans-serif" }}>Aktifkan Landing Page Custom u/ Member</span>
                  </label>
                </div>
                {newMember.landingPageEnabled && (
                  <>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Tema Landing Page</label>
                      <select
                        value={newMember.landingPageTheme}
                        onChange={(e) => setNewMember({ ...newMember, landingPageTheme: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 text-sm"
                        style={{ fontFamily: "'Lato', sans-serif" }}
                      >
                        <option value="default" className="bg-white text-gray-900">Default (Premium DearMyLove clone)</option>
                        <option value="neumorphism" className="bg-white text-gray-900">Neumorphism (Klasik)</option>
                        <option value="cleanapp" className="bg-white text-gray-900">CleanApp (Modern Mobile App)</option>
                      </select>
                    </div>
                    {/* Pricing Packages */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-900/80 mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>Paket Harga (Pricing)</label>
                      <div className="space-y-3">
                        {newMemberPricing.map((pkg, idx) => (
                          <div key={pkg.id} className={`border border-gray-200 rounded-xl p-3 space-y-2 transition-all bg-gray-50 ${!pkg.enabled ? 'opacity-50' : ''}`}>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-gray-900/80" style={{ fontFamily: "'Lato', sans-serif" }}>Paket {idx + 1}: {pkg.name}</span>
                              <button type="button" onClick={() => {
                                const updated = [...newMemberPricing]
                                updated[idx].enabled = !updated[idx].enabled
                                setNewMemberPricing(updated)
                              }} className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${pkg.enabled ? 'bg-[#0ea5e9]' : 'bg-gray-200'}`}>
                                <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${pkg.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                              </button>
                            </div>
                            <div className="flex gap-2">
                              <input type="text" placeholder="Nama" value={pkg.name} disabled={!pkg.enabled}
                                onChange={(e) => { const u = [...newMemberPricing]; u[idx].name = e.target.value; setNewMemberPricing(u) }}
                                className="flex-1 text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none bg-white text-gray-900 placeholder:text-gray-400" style={{ fontFamily: "'Lato', sans-serif" }} />
                              <input type="text" placeholder="Harga" value={pkg.price} disabled={!pkg.enabled}
                                onChange={(e) => { const u = [...newMemberPricing]; u[idx].price = e.target.value; setNewMemberPricing(u) }}
                                className="flex-1 text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none bg-white text-gray-900 placeholder:text-gray-400" style={{ fontFamily: "'Lato', sans-serif" }} />
                            </div>
                            <textarea placeholder="Fitur (pisahkan enter)" value={pkg.features} rows={2} disabled={!pkg.enabled}
                              onChange={(e) => { const u = [...newMemberPricing]; u[idx].features = e.target.value; setNewMemberPricing(u) }}
                              className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none resize-none bg-white text-gray-900 placeholder:text-gray-400" style={{ fontFamily: "'Lato', sans-serif" }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowAddMemberModal(false)}
                    className="flex-1 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 backdrop-blur-md border border-gray-200 rounded-xl font-medium text-gray-500 text-sm min-h-[44px]"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    Batal
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 py-2.5 sm:py-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-xl font-bold text-sm min-h-[44px]"
                    style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                  >
                    Simpan
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Member Modal */}
      <AnimatePresence>
        {showEditMemberModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white backdrop-blur-md border border-gray-200 shadow-xl rounded-3xl w-full max-w-md p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setShowEditMemberModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                title="Batal"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Edit Member</h3>

              {/* Tabs Navigation */}
              <div className="flex border-b border-gray-200 mb-6 mt-4 overflow-x-auto hide-scrollbar">
                <button
                  type="button"
                  onClick={() => setEditMemberActiveTab('profile')}
                  className={`flex-1 py-3 px-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${editMemberActiveTab === 'profile'
                      ? 'border-[#0ea5e9] text-[#0ea5e9]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                >
                  Profil Member
                </button>
                <button
                  type="button"
                  onClick={() => setEditMemberActiveTab('theme')}
                  className={`flex-1 py-3 px-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${editMemberActiveTab === 'theme'
                      ? 'border-[#0ea5e9] text-[#0ea5e9]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                >
                  Landing Page & Tema
                </button>
              </div>

              {editMemberActiveTab === 'profile' && (
                <form onSubmit={handleEditMember} className="space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Nama</label>
                    <input
                      type="text"
                      value={editMemberForm.name}
                      onChange={(e) => setEditMemberForm({ ...editMemberForm, name: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Email</label>
                    <input
                      type="email"
                      value={editMemberForm.email}
                      onChange={(e) => setEditMemberForm({ ...editMemberForm, email: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>WhatsApp</label>
                    <input
                      type="text"
                      value={editMemberForm.whatsapp}
                      onChange={(e) => setEditMemberForm({ ...editMemberForm, whatsapp: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Password Baru (Opsional)</label>
                    <input
                      type="password"
                      value={editMemberForm.password}
                      onChange={(e) => setEditMemberForm({ ...editMemberForm, password: e.target.value })}
                      placeholder="Biarkan kosong jika tidak ingin mengubah password"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Status</label>
                    <select
                      value={editMemberForm.status}
                      onChange={(e) => setEditMemberForm({ ...editMemberForm, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 text-sm"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      <option value="active" className="bg-white text-gray-900">Active</option>
                      <option value="inactive" className="bg-white text-gray-900">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Credit Points</label>
                    <input
                      type="number"
                      value={editMemberForm.creditPoints}
                      onChange={(e) => setEditMemberForm({ ...editMemberForm, creditPoints: parseInt(e.target.value) || 0 })}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    />
                  </div>
                  <div className="pt-2">
                    <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-xl bg-gray-50">
                      <input
                        type="checkbox"
                        checked={editMemberForm.landingPageEnabled}
                        onChange={(e) => setEditMemberForm({ ...editMemberForm, landingPageEnabled: e.target.checked })}
                        className="w-5 h-5 rounded text-[#0ea5e9] focus:ring-[#0ea5e9] border-gray-300"
                      />
                      <span className="text-xs sm:text-sm font-medium text-gray-900" style={{ fontFamily: "'Lato', sans-serif" }}>Aktifkan Landing Page Custom u/ Member</span>
                    </label>
                  </div>
                  {editMemberForm.landingPageEnabled && (
                    <>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Tema Landing Page</label>
                        <select
                          value={editMemberForm.landingPageTheme}
                          onChange={(e) => setEditMemberForm({ ...editMemberForm, landingPageTheme: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 text-sm"
                          style={{ fontFamily: "'Lato', sans-serif" }}
                        >
                          <option value="default" className="bg-white text-gray-900">Default (Premium DearMyLove clone)</option>
                          <option value="neumorphism" className="bg-white text-gray-900">Neumorphism (Klasik)</option>
                          <option value="cleanapp" className="bg-white text-gray-900">CleanApp (Modern Mobile App)</option>
                        </select>
                      </div>
                      {/* Pricing Packages */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-900/80 mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>Paket Harga (Pricing)</label>
                        <div className="space-y-3">
                          {editMemberPricing.map((pkg, idx) => (
                            <div key={pkg.id} className={`border border-gray-200 rounded-xl p-3 space-y-2 transition-all bg-gray-50 ${!pkg.enabled ? 'opacity-50' : ''}`}>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-900/80" style={{ fontFamily: "'Lato', sans-serif" }}>Paket {idx + 1}: {pkg.name}</span>
                                <button type="button" onClick={() => {
                                  const updated = [...editMemberPricing]
                                  updated[idx].enabled = !updated[idx].enabled
                                  setEditMemberPricing(updated)
                                }} className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${pkg.enabled ? 'bg-[#0ea5e9]' : 'bg-gray-200'}`}>
                                  <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${pkg.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                                </button>
                              </div>
                              <div className="flex gap-2">
                                <input type="text" placeholder="Nama" value={pkg.name} disabled={!pkg.enabled}
                                  onChange={(e) => { const u = [...editMemberPricing]; u[idx].name = e.target.value; setEditMemberPricing(u) }}
                                  className="flex-1 text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none bg-white text-gray-900 placeholder:text-gray-400" style={{ fontFamily: "'Lato', sans-serif" }} />
                                <input type="text" placeholder="Harga" value={pkg.price} disabled={!pkg.enabled}
                                  onChange={(e) => { const u = [...editMemberPricing]; u[idx].price = e.target.value; setEditMemberPricing(u) }}
                                  className="flex-1 text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none bg-white text-gray-900 placeholder:text-gray-400" style={{ fontFamily: "'Lato', sans-serif" }} />
                              </div>
                              <textarea placeholder="Fitur (pisahkan enter)" value={pkg.features} rows={2} disabled={!pkg.enabled}
                                onChange={(e) => { const u = [...editMemberPricing]; u[idx].features = e.target.value; setEditMemberPricing(u) }}
                                className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none resize-none bg-white text-gray-900 placeholder:text-gray-400" style={{ fontFamily: "'Lato', sans-serif" }} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  <div className="flex gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setShowEditMemberModal(false)}
                      className="flex-1 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 backdrop-blur-md border border-gray-200 rounded-xl font-medium text-gray-500 text-sm min-h-[44px]"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      Batal
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="flex-1 py-2.5 sm:py-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-xl font-bold text-sm min-h-[44px]"
                      style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                    >
                      Simpan Perubahan
                    </motion.button>
                  </div>
                </form>
              )}

              {editMemberActiveTab === 'theme' && (
                <div className="space-y-6">
                  {/* Base Landing Page Config */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-900" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Aktifkan Landing Page Custom u/ Member</span>
                      <button type="button" onClick={() => setEditMemberForm({ ...editMemberForm, landingPageEnabled: !editMemberForm.landingPageEnabled })} className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${editMemberForm.landingPageEnabled ? 'bg-[#0ea5e9]' : 'bg-gray-300'}`}>
                        <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${editMemberForm.landingPageEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                    {editMemberForm.landingPageEnabled && (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Tema Landing Page</label>
                        <select
                          value={editMemberForm.landingPageTheme}
                          onChange={(e) => setEditMemberForm({ ...editMemberForm, landingPageTheme: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:outline-none bg-white text-sm"
                        >
                          <option value="default">Default (Premium DearMyLove clone)</option>
                          <option value="neumorphism">Neumorphism (Klasik)</option>
                          <option value="cleanapp">CleanApp (Modern Mobile App)</option>
                        </select>
                      </div>
                    )}

                    {/* Move the original Pricing array logic here if they enable it */}
                    {editMemberForm.landingPageEnabled && (
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-900/80 mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>Paket Harga (Pricing)</label>
                        <div className="space-y-3">
                          {editMemberPricing.map((pkg, idx) => (
                            <div key={pkg.id} className={`border border-gray-200 rounded-xl p-3 space-y-2 transition-all bg-white ${!pkg.enabled ? 'opacity-50' : ''}`}>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-900/80" style={{ fontFamily: "'Lato', sans-serif" }}>Paket {idx + 1}: {pkg.name}</span>
                                <button type="button" onClick={() => {
                                  const updated = [...editMemberPricing]
                                  updated[idx].enabled = !updated[idx].enabled
                                  setEditMemberPricing(updated)
                                }} className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${pkg.enabled ? 'bg-[#0ea5e9]' : 'bg-gray-200'}`}>
                                  <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${pkg.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                                </button>
                              </div>
                              <div className="flex gap-2">
                                <input type="text" placeholder="Nama" value={pkg.name} disabled={!pkg.enabled}
                                  onChange={(e) => { const u = [...editMemberPricing]; u[idx].name = e.target.value; setEditMemberPricing(u) }}
                                  className="flex-1 text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none bg-white text-gray-900 placeholder:text-gray-400" style={{ fontFamily: "'Lato', sans-serif" }} />
                                <input type="text" placeholder="Harga" value={pkg.price} disabled={!pkg.enabled}
                                  onChange={(e) => { const u = [...editMemberPricing]; u[idx].price = e.target.value; setEditMemberPricing(u) }}
                                  className="flex-1 text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none bg-white text-gray-900 placeholder:text-gray-400" style={{ fontFamily: "'Lato', sans-serif" }} />
                              </div>
                              <textarea placeholder="Fitur (pisahkan enter)" value={pkg.features} rows={2} disabled={!pkg.enabled}
                                onChange={(e) => { const u = [...editMemberPricing]; u[idx].features = e.target.value; setEditMemberPricing(u) }}
                                className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none resize-none bg-white text-gray-900 placeholder:text-gray-400" style={{ fontFamily: "'Lato', sans-serif" }} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>


              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setShowEditMemberModal(false)} className="flex-1 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 backdrop-blur-md border border-gray-200 rounded-xl font-medium text-gray-500 text-sm min-h-[44px]">Batal</button>
                <button type="button" onClick={handleEditMember} className="flex-1 py-2.5 sm:py-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-xl font-bold text-sm min-h-[44px]">Simpan Semua Pengaturan</button>
              </div>
            </div>
              )}

          </motion.div>
          </motion.div>
        )}
          <AnimatePresence mode="wait">
            {activeTab === 'theme-config' && (
              <motion.div
                key="theme-config-main"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >

                        {/* Member Selection */}
                        <div className="mb-6 sm:mb-8">
                          <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>Pilih Member untuk Dikonfigurasi</label>
                          <select
                            value={selectedMemberForTheme || ''}
                            onChange={(e) => {
                              setSelectedMemberForTheme(e.target.value)
                            }}
                            className="w-full sm:w-auto min-w-[250px] px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 text-sm"
                            style={{ fontFamily: "'Lato', sans-serif" }}
                          >
                            <option value="">-- Pilih Member --</option>
                            {members.filter(m => m.landingPageEnabled && m.landingPageTheme === 'cleanapp').map(member => (
                              <option key={member.id} value={member.id}>
                                {member.name} ({member.email})
                              </option>
                            ))}
                          </select>
                        </div>
                      <motion.div
                        key="theme-config"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white border border-gray-100 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden p-4 sm:p-6"
                      >
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>CleanApp Theme Configuration</h2>

                        {/* Member Selection */}


                        <div className={`grid ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-6`}>
                          {/* Configuration Panel */}
                          <div>
                            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                              <button
                                onClick={() => setThemeConfigTab('text')}
                                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-xs sm:text-sm min-h-[44px] ${themeConfigTab === 'text'
                                    ? 'bg-[#0ea5e9] text-white shadow-sm'
                                    : 'bg-gray-100 border border-gray-200 text-gray-500 hover:bg-gray-200'
                                  }`}
                                style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                              >
                                Text
                              </button>
                              <button
                                onClick={() => setThemeConfigTab('images')}
                                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-xs sm:text-sm min-h-[44px] ${themeConfigTab === 'images'
                                    ? 'bg-[#0ea5e9] text-white shadow-sm'
                                    : 'bg-gray-100 border border-gray-200 text-gray-500 hover:bg-gray-200'
                                  }`}
                                style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                              >
                                Images
                              </button>
                              <button
                                onClick={() => setThemeConfigTab('colors')}
                                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-xs sm:text-sm min-h-[44px] ${themeConfigTab === 'colors'
                                    ? 'bg-[#0ea5e9] text-white shadow-sm'
                                    : 'bg-gray-100 border border-gray-200 text-gray-500 hover:bg-gray-200'
                                  }`}
                                style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                              >
                                Colors
                              </button>
                              <button
                                onClick={() => setThemeConfigTab('features')}
                                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-xs sm:text-sm min-h-[44px] ${themeConfigTab === 'features'
                                    ? 'bg-[#0ea5e9] text-white shadow-sm'
                                    : 'bg-gray-100 border border-gray-200 text-gray-500 hover:bg-gray-200'
                                  }`}
                                style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                              >
                                Features
                              </button>
                              <button
                                onClick={() => setThemeConfigTab('pricing')}
                                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-xs sm:text-sm min-h-[44px] ${themeConfigTab === 'pricing'
                                    ? 'bg-[#0ea5e9] text-white shadow-sm'
                                    : 'bg-gray-100 border border-gray-200 text-gray-500 hover:bg-gray-200'
                                  }`}
                                style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                              >
                                Pricing
                              </button>
                              <button
                                onClick={() => setThemeConfigTab('faq')}
                                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-xs sm:text-sm min-h-[44px] ${themeConfigTab === 'faq'
                                    ? 'bg-[#0ea5e9] text-white shadow-sm'
                                    : 'bg-gray-100 border border-gray-200 text-gray-500 hover:bg-gray-200'
                                  }`}
                                style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                              >
                                FAQ
                              </button>
                              <button
                                onClick={() => setThemeConfigTab('templates')}
                                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-xs sm:text-sm min-h-[44px] ${themeConfigTab === 'templates'
                                    ? 'bg-[#0ea5e9] text-white shadow-sm'
                                    : 'bg-gray-100 border border-gray-200 text-gray-500 hover:bg-gray-200'
                                  }`}
                                style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                              >
                                Templates
                              </button>
                            </div>

                            {/* Tab Content */}
                            <div className="bg-gray-50/50 p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-gray-100">
                              {isLoadingThemeConfig ? (
                                <div className="text-center py-12">
                                  <p className="text-gray-500" style={{ fontFamily: "'Lato', sans-serif" }}>Loading configuration...</p>
                                </div>
                              ) : !themeConfig ? (
                                <div className="text-center py-12">
                                  <p className="text-gray-500" style={{ fontFamily: "'Lato', sans-serif" }}>Select a member to configure their theme</p>
                                </div>
                              ) : (
                                <>
                                  {themeConfigTab === 'text' && (
                                    <div className="space-y-6">
                                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Text Content Configuration</h3>

                                      {/* Hero Section */}
                                      <div className="bg-white border border-gray-200 p-4 sm:p-6 rounded-xl shadow-sm">
                                        <h4 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Hero Section</h4>

                                        <div className="space-y-4">
                                          <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                                              Title <span className="text-xs text-gray-400">({themeConfig.hero?.title?.length || 0}/200)</span>
                                            </label>
                                            <input
                                              type="text"
                                              value={themeConfig.hero?.title || ''}
                                              onChange={(e) => setThemeConfig({
                                                ...themeConfig,
                                                hero: { ...themeConfig.hero, title: e.target.value }
                                              })}
                                              maxLength={200}
                                              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                                              style={{ fontFamily: "'Lato', sans-serif" }}
                                            />
                                          </div>

                                          <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                                              Subtitle <span className="text-xs text-gray-400">({themeConfig.hero?.subtitle?.length || 0}/500)</span>
                                            </label>
                                            <textarea
                                              value={themeConfig.hero?.subtitle || ''}
                                              onChange={(e) => setThemeConfig({
                                                ...themeConfig,
                                                hero: { ...themeConfig.hero, subtitle: e.target.value }
                                              })}
                                              maxLength={500}
                                              rows={3}
                                              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 resize-none text-sm"
                                              style={{ fontFamily: "'Lato', sans-serif" }}
                                            />
                                          </div>

                                          <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                                              CTA Button Text <span className="text-xs text-gray-400">({themeConfig.hero?.ctaText?.length || 0}/50)</span>
                                            </label>
                                            <input
                                              type="text"
                                              value={themeConfig.hero?.ctaText || ''}
                                              onChange={(e) => setThemeConfig({
                                                ...themeConfig,
                                                hero: { ...themeConfig.hero, ctaText: e.target.value }
                                              })}
                                              maxLength={50}
                                              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                                              style={{ fontFamily: "'Lato', sans-serif" }}
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      {/* Features Section */}
                                      <div className="bg-white border border-gray-200 p-4 sm:p-6 rounded-xl shadow-sm">
                                        <h4 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Features Section</h4>

                                        <div className="space-y-4">
                                          <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                                              Section Title <span className="text-xs text-gray-400">({themeConfig.features?.title?.length || 0}/200)</span>
                                            </label>
                                            <input
                                              type="text"
                                              value={themeConfig.features?.title || ''}
                                              onChange={(e) => setThemeConfig({
                                                ...themeConfig,
                                                features: { ...themeConfig.features, title: e.target.value }
                                              })}
                                              maxLength={200}
                                              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                                              style={{ fontFamily: "'Lato', sans-serif" }}
                                            />
                                          </div>

                                          {themeConfig.features?.items?.map((item: any, index: number) => (
                                            <div key={index} className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                                              <h5 className="text-xs sm:text-sm font-semibold text-gray-900/90 mb-3" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Feature {index + 1}</h5>

                                              <div className="space-y-3">
                                                <div>
                                                  <label className="block text-xs font-medium text-gray-500 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Icon (emoji)</label>
                                                  <input
                                                    type="text"
                                                    value={item.icon || ''}
                                                    onChange={(e) => {
                                                      const newItems = [...themeConfig.features.items]
                                                      newItems[index] = { ...newItems[index], icon: e.target.value }
                                                      setThemeConfig({
                                                        ...themeConfig,
                                                        features: { ...themeConfig.features, items: newItems }
                                                      })
                                                    }}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 text-sm"
                                                    style={{ fontFamily: "'Lato', sans-serif" }}
                                                  />
                                                </div>

                                                <div>
                                                  <label className="block text-xs font-medium text-gray-500 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                                                    Title <span className="text-xs text-gray-400">({item.title?.length || 0}/100)</span>
                                                  </label>
                                                  <input
                                                    type="text"
                                                    value={item.title || ''}
                                                    onChange={(e) => {
                                                      const newItems = [...themeConfig.features.items]
                                                      newItems[index] = { ...newItems[index], title: e.target.value }
                                                      setThemeConfig({
                                                        ...themeConfig,
                                                        features: { ...themeConfig.features, items: newItems }
                                                      })
                                                    }}
                                                    maxLength={100}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 text-sm"
                                                    style={{ fontFamily: "'Lato', sans-serif" }}
                                                  />
                                                </div>

                                                <div>
                                                  <label className="block text-xs font-medium text-gray-500 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                                                    Description <span className="text-xs text-gray-400">({item.description?.length || 0}/300)</span>
                                                  </label>
                                                  <textarea
                                                    value={item.description || ''}
                                                    onChange={(e) => {
                                                      const newItems = [...themeConfig.features.items]
                                                      newItems[index] = { ...newItems[index], description: e.target.value }
                                                      setThemeConfig({
                                                        ...themeConfig,
                                                        features: { ...themeConfig.features, items: newItems }
                                                      })
                                                    }}
                                                    maxLength={300}
                                                    rows={2}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 text-sm resize-none"
                                                    style={{ fontFamily: "'Lato', sans-serif" }}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Pricing Section */}
                                      <div className="bg-white border border-gray-200 p-4 sm:p-6 rounded-xl shadow-sm">
                                        <h4 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Pricing Section</h4>

                                        <div className="space-y-4">
                                          <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                                              Section Title <span className="text-xs text-gray-400">({themeConfig.pricing?.title?.length || 0}/200)</span>
                                            </label>
                                            <input
                                              type="text"
                                              value={themeConfig.pricing?.title || ''}
                                              onChange={(e) => setThemeConfig({
                                                ...themeConfig,
                                                pricing: { ...themeConfig.pricing, title: e.target.value }
                                              })}
                                              maxLength={200}
                                              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                                              style={{ fontFamily: "'Lato', sans-serif" }}
                                            />
                                          </div>

                                          {themeConfig.pricing?.tiers?.map((tier: any, index: number) => (
                                            <div key={index} className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                                              <h5 className="text-xs sm:text-sm font-semibold text-gray-900/90 mb-3" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Tier {index + 1}</h5>

                                              <div className="space-y-3">
                                                <div className="grid grid-cols-2 gap-3">
                                                  <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                                                      Name <span className="text-xs text-gray-400">({tier.name?.length || 0}/100)</span>
                                                    </label>
                                                    <input
                                                      type="text"
                                                      value={tier.name || ''}
                                                      onChange={(e) => {
                                                        const newTiers = [...themeConfig.pricing.tiers]
                                                        newTiers[index] = { ...newTiers[index], name: e.target.value }
                                                        setThemeConfig({
                                                          ...themeConfig,
                                                          pricing: { ...themeConfig.pricing, tiers: newTiers }
                                                        })
                                                      }}
                                                      maxLength={100}
                                                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 text-sm"
                                                      style={{ fontFamily: "'Lato', sans-serif" }}
                                                    />
                                                  </div>

                                                  <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                                                      Price <span className="text-xs text-gray-400">({tier.price?.length || 0}/50)</span>
                                                    </label>
                                                    <input
                                                      type="text"
                                                      value={tier.price || ''}
                                                      onChange={(e) => {
                                                        const newTiers = [...themeConfig.pricing.tiers]
                                                        newTiers[index] = { ...newTiers[index], price: e.target.value }
                                                        setThemeConfig({
                                                          ...themeConfig,
                                                          pricing: { ...themeConfig.pricing, tiers: newTiers }
                                                        })
                                                      }}
                                                      maxLength={50}
                                                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 text-sm"
                                                      style={{ fontFamily: "'Lato', sans-serif" }}
                                                    />
                                                  </div>
                                                </div>

                                                <div>
                                                  <label className="block text-xs font-medium text-gray-500 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                                                    CTA Text <span className="text-xs text-gray-400">({tier.ctaText?.length || 0}/50)</span>
                                                  </label>
                                                  <input
                                                    type="text"
                                                    value={tier.ctaText || ''}
                                                    onChange={(e) => {
                                                      const newTiers = [...themeConfig.pricing.tiers]
                                                      newTiers[index] = { ...newTiers[index], ctaText: e.target.value }
                                                      setThemeConfig({
                                                        ...themeConfig,
                                                        pricing: { ...themeConfig.pricing, tiers: newTiers }
                                                      })
                                                    }}
                                                    maxLength={50}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 text-sm"
                                                    style={{ fontFamily: "'Lato', sans-serif" }}
                                                  />
                                                </div>

                                                <div>
                                                  <label className="block text-xs font-medium text-gray-500 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Features (one per line)</label>
                                                  <textarea
                                                    value={tier.features?.join('\n') || ''}
                                                    onChange={(e) => {
                                                      const newTiers = [...themeConfig.pricing.tiers]
                                                      newTiers[index] = {
                                                        ...newTiers[index],
                                                        features: e.target.value.split('\n').filter(f => f.trim())
                                                      }
                                                      setThemeConfig({
                                                        ...themeConfig,
                                                        pricing: { ...themeConfig.pricing, tiers: newTiers }
                                                      })
                                                    }}
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 text-sm resize-none"
                                                    style={{ fontFamily: "'Lato', sans-serif" }}
                                                  />
                                                </div>

                                                <div>
                                                  <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                      type="checkbox"
                                                      checked={tier.recommended || false}
                                                      onChange={(e) => {
                                                        const newTiers = [...themeConfig.pricing.tiers]
                                                        newTiers[index] = { ...newTiers[index], recommended: e.target.checked }
                                                        setThemeConfig({
                                                          ...themeConfig,
                                                          pricing: { ...themeConfig.pricing, tiers: newTiers }
                                                        })
                                                      }}
                                                      className="w-4 h-4 rounded text-[#0ea5e9] focus:ring-[#0ea5e9] border-gray-300"
                                                    />
                                                    <span className="text-xs font-medium text-gray-900/80" style={{ fontFamily: "'Lato', sans-serif" }}>Recommended</span>
                                                  </label>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      {/* FAQ Section */}
                                      <div className="bg-white border border-gray-200 p-4 sm:p-6 rounded-xl shadow-sm">
                                        <h4 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>FAQ Section</h4>

                                        <div className="space-y-4">
                                          <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                                              Section Title <span className="text-xs text-gray-400">({themeConfig.faq?.title?.length || 0}/200)</span>
                                            </label>
                                            <input
                                              type="text"
                                              value={themeConfig.faq?.title || ''}
                                              onChange={(e) => setThemeConfig({
                                                ...themeConfig,
                                                faq: { ...themeConfig.faq, title: e.target.value }
                                              })}
                                              maxLength={200}
                                              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                                              style={{ fontFamily: "'Lato', sans-serif" }}
                                            />
                                          </div>

                                          {themeConfig.faq?.items?.map((item: any, index: number) => (
                                            <div key={index} className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                                              <h5 className="text-xs sm:text-sm font-semibold text-gray-900/90 mb-3" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>FAQ {index + 1}</h5>

                                              <div className="space-y-3">
                                                <div>
                                                  <label className="block text-xs font-medium text-gray-500 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                                                    Question <span className="text-xs text-gray-400">({item.question?.length || 0}/300)</span>
                                                  </label>
                                                  <input
                                                    type="text"
                                                    value={item.question || ''}
                                                    onChange={(e) => {
                                                      const newItems = [...themeConfig.faq.items]
                                                      newItems[index] = { ...newItems[index], question: e.target.value }
                                                      setThemeConfig({
                                                        ...themeConfig,
                                                        faq: { ...themeConfig.faq, items: newItems }
                                                      })
                                                    }}
                                                    maxLength={300}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 text-sm"
                                                    style={{ fontFamily: "'Lato', sans-serif" }}
                                                  />
                                                </div>

                                                <div>
                                                  <label className="block text-xs font-medium text-gray-500 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                                                    Answer <span className="text-xs text-gray-400">({item.answer?.length || 0}/1000)</span>
                                                  </label>
                                                  <textarea
                                                    value={item.answer || ''}
                                                    onChange={(e) => {
                                                      const newItems = [...themeConfig.faq.items]
                                                      newItems[index] = { ...newItems[index], answer: e.target.value }
                                                      setThemeConfig({
                                                        ...themeConfig,
                                                        faq: { ...themeConfig.faq, items: newItems }
                                                      })
                                                    }}
                                                    maxLength={1000}
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 text-sm resize-none"
                                                    style={{ fontFamily: "'Lato', sans-serif" }}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Footer Section */}
                                      <div className="bg-white border border-gray-200 p-4 sm:p-6 rounded-xl shadow-sm">
                                        <h4 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Footer Section</h4>

                                        <div className="space-y-4">
                                          <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                                              Footer Text <span className="text-xs text-gray-400">({themeConfig.footer?.text?.length || 0}/500)</span>
                                            </label>
                                            <textarea
                                              value={themeConfig.footer?.text || ''}
                                              onChange={(e) => setThemeConfig({
                                                ...themeConfig,
                                                footer: { ...themeConfig.footer, text: e.target.value }
                                              })}
                                              maxLength={500}
                                              rows={3}
                                              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 resize-none text-sm"
                                              style={{ fontFamily: "'Lato', sans-serif" }}
                                            />
                                          </div>

                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                              <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Contact Email</label>
                                              <input
                                                type="email"
                                                value={themeConfig.footer?.contactEmail || ''}
                                                onChange={(e) => setThemeConfig({
                                                  ...themeConfig,
                                                  footer: { ...themeConfig.footer, contactEmail: e.target.value }
                                                })}
                                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                                                style={{ fontFamily: "'Lato', sans-serif" }}
                                              />
                                            </div>

                                            <div>
                                              <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                                                Contact Phone <span className="text-xs text-gray-400">({themeConfig.footer?.contactPhone?.length || 0}/50)</span>
                                              </label>
                                              <input
                                                type="text"
                                                value={themeConfig.footer?.contactPhone || ''}
                                                onChange={(e) => setThemeConfig({
                                                  ...themeConfig,
                                                  footer: { ...themeConfig.footer, contactPhone: e.target.value }
                                                })}
                                                maxLength={50}
                                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                                                style={{ fontFamily: "'Lato', sans-serif" }}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Save and Reset Buttons */}
                                      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-4">
                                        <motion.button
                                          whileHover={{ scale: 1.02 }}
                                          whileTap={{ scale: 0.98 }}
                                          onClick={resetThemeConfig}
                                          disabled={isSavingThemeConfig}
                                          className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 backdrop-blur-md border border-gray-200 rounded-xl font-bold text-amber-300 disabled:opacity-50 text-sm min-h-[44px]"
                                          style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                                        >
                                          Reset to Default
                                        </motion.button>

                                        <motion.button
                                          whileHover={{ scale: 1.02 }}
                                          whileTap={{ scale: 0.98 }}
                                          onClick={saveThemeConfig}
                                          disabled={isSavingThemeConfig}
                                          className="px-6 sm:px-8 py-2.5 sm:py-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-xl font-bold disabled:opacity-50 text-sm min-h-[44px]"
                                          style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                                        >
                                          {isSavingThemeConfig ? 'Saving...' : 'Save Configuration'}
                                        </motion.button>
                                      </div>
                                    </div>
                                  )}

                                  {themeConfigTab === 'images' && (
                                    <div className="space-y-6">
                                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Image Configuration</h3>
                                      <p className="text-xs sm:text-sm text-gray-500 mb-6" style={{ fontFamily: "'Lato', sans-serif" }}>
                                        Upload and configure hero images, feature icons, and other visual elements. Supported formats: JPG, PNG, WebP, SVG. Max size: 5MB.
                                      </p>

                                      {/* Hero Images */}
                                      <div className="bg-white border border-gray-200 p-4 sm:p-6 rounded-xl shadow-sm">
                                        <h4 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Hero Section Images</h4>

                                        <div className="space-y-6">
                                          {/* Hero Image */}
                                          <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-900/80 mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                                              Hero Image
                                            </label>
                                            <div className="flex flex-col gap-3">
                                              {themeConfig.hero?.heroImage && (
                                                <div className="relative w-full h-48 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                                                  <img
                                                    src={themeConfig.hero.heroImage}
                                                    alt="Hero preview"
                                                    className="w-full h-full object-contain"
                                                  />
                                                  <button
                                                    onClick={() => setThemeConfig({
                                                      ...themeConfig,
                                                      hero: { ...themeConfig.hero, heroImage: '' }
                                                    })}
                                                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                                    title="Remove image"
                                                  >
                                                    <Trash2 className="w-4 h-4" />
                                                  </button>
                                                </div>
                                              )}
                                              <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                                                onChange={(e) => {
                                                  const file = e.target.files?.[0]
                                                  if (!file) return

                                                  // Validate file type
                                                  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
                                                  if (!validTypes.includes(file.type)) {
                                                    alert('Invalid file format. Please use JPG, PNG, WebP, or SVG.')
                                                    return
                                                  }

                                                  // Validate file size (5MB)
                                                  if (file.size > 5 * 1024 * 1024) {
                                                    alert('File size exceeds 5MB. Please use a smaller image.')
                                                    return
                                                  }

                                                  // Convert to base64
                                                  const reader = new FileReader()
                                                  reader.onload = (event) => {
                                                    if (event.target?.result) {
                                                      setThemeConfig({
                                                        ...themeConfig,
                                                        hero: { ...themeConfig.hero, heroImage: event.target.result as string }
                                                      })
                                                    }
                                                  }
                                                  reader.readAsDataURL(file)
                                                }}
                                                className="block w-full text-xs sm:text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-[#0ea5e9] file:text-white hover:file:bg-[#0284c7] cursor-pointer"
                                                style={{ fontFamily: "'Lato', sans-serif" }}
                                              />
                                            </div>
                                          </div>

                                          {/* Background Image */}
                                          <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-900/80 mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                                              Background Image
                                            </label>
                                            <div className="flex flex-col gap-3">
                                              {themeConfig.hero?.backgroundImage && (
                                                <div className="relative w-full h-48 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                                                  <img
                                                    src={themeConfig.hero.backgroundImage}
                                                    alt="Background preview"
                                                    className="w-full h-full object-cover"
                                                  />
                                                  <button
                                                    onClick={() => setThemeConfig({
                                                      ...themeConfig,
                                                      hero: { ...themeConfig.hero, backgroundImage: '' }
                                                    })}
                                                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                                    title="Remove image"
                                                  >
                                                    <Trash2 className="w-4 h-4" />
                                                  </button>
                                                </div>
                                              )}
                                              <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                                                onChange={(e) => {
                                                  const file = e.target.files?.[0]
                                                  if (!file) return

                                                  // Validate file type
                                                  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
                                                  if (!validTypes.includes(file.type)) {
                                                    alert('Invalid file format. Please use JPG, PNG, WebP, or SVG.')
                                                    return
                                                  }

                                                  // Validate file size (5MB)
                                                  if (file.size > 5 * 1024 * 1024) {
                                                    alert('File size exceeds 5MB. Please use a smaller image.')
                                                    return
                                                  }

                                                  // Convert to base64
                                                  const reader = new FileReader()
                                                  reader.onload = (event) => {
                                                    if (event.target?.result) {
                                                      setThemeConfig({
                                                        ...themeConfig,
                                                        hero: { ...themeConfig.hero, backgroundImage: event.target.result as string }
                                                      })
                                                    }
                                                  }
                                                  reader.readAsDataURL(file)
                                                }}
                                                className="block w-full text-xs sm:text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-[#0ea5e9] file:text-white hover:file:bg-[#0284c7] cursor-pointer"
                                                style={{ fontFamily: "'Lato', sans-serif" }}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Feature Icons */}
                                      <div className="bg-white border border-gray-200 p-4 sm:p-6 rounded-xl shadow-sm">
                                        <h4 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Feature Icons</h4>
                                        <p className="text-xs text-gray-500 mb-4" style={{ fontFamily: "'Lato', sans-serif" }}>
                                          You can use emoji icons (configured in the Text tab) or upload custom icon images here.
                                        </p>

                                        <div className="space-y-4">
                                          {themeConfig.features?.items?.map((item: any, index: number) => (
                                            <div key={index} className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                                              <h5 className="text-xs sm:text-sm font-semibold text-gray-900/90 mb-3" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                                                Feature {index + 1}: {item.title || 'Untitled'}
                                              </h5>

                                              <div className="flex flex-col gap-3">
                                                {item.iconImage && (
                                                  <div className="relative w-24 h-24 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                                                    <img
                                                      src={item.iconImage}
                                                      alt={`Feature ${index + 1} icon`}
                                                      className="w-full h-full object-contain"
                                                    />
                                                    <button
                                                      onClick={() => {
                                                        const newItems = [...themeConfig.features.items]
                                                        newItems[index] = { ...newItems[index], iconImage: '' }
                                                        setThemeConfig({
                                                          ...themeConfig,
                                                          features: { ...themeConfig.features, items: newItems }
                                                        })
                                                      }}
                                                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                                      title="Remove icon"
                                                    >
                                                      <Trash2 className="w-3 h-3" />
                                                    </button>
                                                  </div>
                                                )}
                                                <input
                                                  type="file"
                                                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                                                  onChange={(e) => {
                                                    const file = e.target.files?.[0]
                                                    if (!file) return

                                                    // Validate file type
                                                    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
                                                    if (!validTypes.includes(file.type)) {
                                                      alert('Invalid file format. Please use JPG, PNG, WebP, or SVG.')
                                                      return
                                                    }

                                                    // Validate file size (5MB)
                                                    if (file.size > 5 * 1024 * 1024) {
                                                      alert('File size exceeds 5MB. Please use a smaller image.')
                                                      return
                                                    }

                                                    // Convert to base64
                                                    const reader = new FileReader()
                                                    reader.onload = (event) => {
                                                      if (event.target?.result) {
                                                        const newItems = [...themeConfig.features.items]
                                                        newItems[index] = { ...newItems[index], iconImage: event.target.result as string }
                                                        setThemeConfig({
                                                          ...themeConfig,
                                                          features: { ...themeConfig.features, items: newItems }
                                                        })
                                                      }
                                                    }
                                                    reader.readAsDataURL(file)
                                                  }}
                                                  className="block w-full text-xs sm:text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-500/80 file:text-white hover:file:bg-blue-600 cursor-pointer"
                                                  style={{ fontFamily: "'Lato', sans-serif" }}
                                                />
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Template Preview Images */}
                                      <div className="bg-white border border-gray-200 p-4 sm:p-6 rounded-xl shadow-sm">
                                        <h4 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Template Preview Images</h4>
                                        <p className="text-xs text-gray-500 mb-4" style={{ fontFamily: "'Lato', sans-serif" }}>
                                          Upload custom preview images for your invitation templates. These will be displayed in the template grid.
                                        </p>

                                        <div className="space-y-4">
                                          {themeConfig.pricing?.tiers?.map((tier: any, index: number) => (
                                            <div key={index} className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                                              <h5 className="text-xs sm:text-sm font-semibold text-gray-900/90 mb-3" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                                                {tier.name || `Tier ${index + 1}`} Preview Image
                                              </h5>

                                              <div className="flex flex-col gap-3">
                                                {tier.previewImage && (
                                                  <div className="relative w-full h-48 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                                                    <img
                                                      src={tier.previewImage}
                                                      alt={`${tier.name} preview`}
                                                      className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                      onClick={() => {
                                                        const newTiers = [...themeConfig.pricing.tiers]
                                                        newTiers[index] = { ...newTiers[index], previewImage: '' }
                                                        setThemeConfig({
                                                          ...themeConfig,
                                                          pricing: { ...themeConfig.pricing, tiers: newTiers }
                                                        })
                                                      }}
                                                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                                      title="Remove image"
                                                    >
                                                      <Trash2 className="w-4 h-4" />
                                                    </button>
                                                  </div>
                                                )}
                                                <input
                                                  type="file"
                                                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                                                  onChange={(e) => {
                                                    const file = e.target.files?.[0]
                                                    if (!file) return

                                                    // Validate file type
                                                    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
                                                    if (!validTypes.includes(file.type)) {
                                                      alert('Invalid file format. Please use JPG, PNG, WebP, or SVG.')
                                                      return
                                                    }

                                                    // Validate file size (5MB)
                                                    if (file.size > 5 * 1024 * 1024) {
                                                      alert('File size exceeds 5MB. Please use a smaller image.')
                                                      return
                                                    }

                                                    // Convert to base64
                                                    const reader = new FileReader()
                                                    reader.onload = (event) => {
                                                      if (event.target?.result) {
                                                        const newTiers = [...themeConfig.pricing.tiers]
                                                        newTiers[index] = { ...newTiers[index], previewImage: event.target.result as string }
                                                        setThemeConfig({
                                                          ...themeConfig,
                                                          pricing: { ...themeConfig.pricing, tiers: newTiers }
                                                        })
                                                      }
                                                    }
                                                    reader.readAsDataURL(file)
                                                  }}
                                                  className="block w-full text-xs sm:text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-purple-500/80 file:text-white hover:file:bg-purple-600 cursor-pointer"
                                                  style={{ fontFamily: "'Lato', sans-serif" }}
                                                />
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Save and Reset Buttons */}
                                      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-4">
                                        <motion.button
                                          whileHover={{ scale: 1.02 }}
                                          whileTap={{ scale: 0.98 }}
                                          onClick={resetThemeConfig}
                                          disabled={isSavingThemeConfig}
                                          className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 backdrop-blur-md border border-gray-200 rounded-xl font-bold text-amber-300 disabled:opacity-50 text-sm min-h-[44px]"
                                          style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                                        >
                                          Reset to Default
                                        </motion.button>

                                        <motion.button
                                          whileHover={{ scale: 1.02 }}
                                          whileTap={{ scale: 0.98 }}
                                          onClick={saveThemeConfig}
                                          disabled={isSavingThemeConfig}
                                          className="px-6 sm:px-8 py-2.5 sm:py-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-xl font-bold disabled:opacity-50 text-sm min-h-[44px]"
                                          style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                                        >
                                          {isSavingThemeConfig ? 'Saving...' : 'Save Configuration'}
                                        </motion.button>
                                      </div>
                                    </div>
                                  )}

                                  {themeConfigTab === 'colors' && (
                                    <div className="space-y-6">
                                      <div>
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Color Palette Configuration</h3>
                                        <p className="text-xs sm:text-sm text-gray-500 mb-4" style={{ fontFamily: "'Lato', sans-serif" }}>
                                          Customize primary, secondary, accent, background, and text colors. All colors must be in hex format (e.g., #FF5733).
                                        </p>
                                        <p className="text-xs text-blue-300 p-3 bg-blue-500/20 rounded-lg border border-blue-500/30" style={{ fontFamily: "'Lato', sans-serif" }}>
                                          <strong>Accessibility Note:</strong> The system will validate color contrast ratios to ensure WCAG AA compliance (4.5:1 for normal text, 3:1 for large text).
                                        </p>
                                      </div>

                                      {/* Primary Colors */}
                                      <div className="bg-white border border-gray-200 p-4 sm:p-6 rounded-xl shadow-sm">
                                        <h4 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Primary Colors</h4>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                          {/* Primary Color */}
                                          <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-900/80 mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                                              Primary Color
                                            </label>
                                            <div className="flex gap-3 items-center">
                                              <input
                                                type="color"
                                                value={themeConfig.colors?.primary || '#FF6B9D'}
                                                onChange={(e) => setThemeConfig({
                                                  ...themeConfig,
                                                  colors: { ...themeConfig.colors, primary: e.target.value }
                                                })}
                                                className="w-16 h-16 rounded-lg border-2 border-white/30 cursor-pointer"
                                              />
                                              <div className="flex-1">
                                                <input
                                                  type="text"
                                                  value={themeConfig.colors?.primary || '#FF6B9D'}
                                                  onChange={(e) => {
                                                    const value = e.target.value
                                                    // Validate hex format
                                                    if (/^#[0-9A-Fa-f]{0,6}$/.test(value) || value === '') {
                                                      setThemeConfig({
                                                        ...themeConfig,
                                                        colors: { ...themeConfig.colors, primary: value }
                                                      })
                                                    }
                                                  }}
                                                  placeholder="#FF6B9D"
                                                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#0ea5e9] focus:outline-none bg-white text-gray-900 font-mono text-sm"
                                                  style={{ fontFamily: "'Lato', sans-serif" }}
                                                />
                                                <p className="text-xs text-gray-900/60 mt-1" style={{ fontFamily: "'Lato', sans-serif" }}>Used for buttons, links, and accents</p>
                                              </div>
                                              <div
                                                className="w-12 h-12 rounded-lg border-2 border-white/30 shadow-inner"
                                                style={{ backgroundColor: themeConfig.colors?.primary || '#FF6B9D' }}
                                                title="Color preview"
                                              />
                                            </div>
                                          </div>

                                          {/* Secondary Color */}
                                          <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-900/80 mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                                              Secondary Color
                                            </label>
                                            <div className="flex gap-3 items-center">
                                              <input
                                                type="color"
                                                value={themeConfig.colors?.secondary || '#C8E6F5'}
                                                onChange={(e) => setThemeConfig({
                                                  ...themeConfig,
                                                  colors: { ...themeConfig.colors, secondary: e.target.value }
                                                })}
                                                className="w-16 h-16 rounded-lg border-2 border-white/30 cursor-pointer"
                                              />
                                              <div className="flex-1">
                                                <input
                                                  type="text"
                                                  value={themeConfig.colors?.secondary || '#C8E6F5'}
                                                  onChange={(e) => {
                                                    const value = e.target.value
                                                    if (/^#[0-9A-Fa-f]{0,6}$/.test(value) || value === '') {
                                                      setThemeConfig({
                                                        ...themeConfig,
                                                        colors: { ...themeConfig.colors, secondary: value }
                                                      })
                                                    }
                                                  }}
                                                  placeholder="#C8E6F5"
                                                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#0ea5e9] focus:outline-none bg-white text-gray-900 font-mono text-sm"
                                                  style={{ fontFamily: "'Lato', sans-serif" }}
                                                />
                                                <p className="text-xs text-gray-900/60 mt-1" style={{ fontFamily: "'Lato', sans-serif" }}>Used for secondary elements</p>
                                              </div>
                                              <div
                                                className="w-12 h-12 rounded-lg border-2 border-white/30 shadow-inner"
                                                style={{ backgroundColor: themeConfig.colors?.secondary || '#C8E6F5' }}
                                                title="Color preview"
                                              />
                                            </div>
                                          </div>

                                          {/* Accent Color */}
                                          <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-900/80 mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                                              Accent Color
                                            </label>
                                            <div className="flex gap-3 items-center">
                                              <input
                                                type="color"
                                                value={themeConfig.colors?.accent || '#FFD700'}
                                                onChange={(e) => setThemeConfig({
                                                  ...themeConfig,
                                                  colors: { ...themeConfig.colors, accent: e.target.value }
                                                })}
                                                className="w-16 h-16 rounded-lg border-2 border-white/30 cursor-pointer"
                                              />
                                              <div className="flex-1">
                                                <input
                                                  type="text"
                                                  value={themeConfig.colors?.accent || '#FFD700'}
                                                  onChange={(e) => {
                                                    const value = e.target.value
                                                    if (/^#[0-9A-Fa-f]{0,6}$/.test(value) || value === '') {
                                                      setThemeConfig({
                                                        ...themeConfig,
                                                        colors: { ...themeConfig.colors, accent: value }
                                                      })
                                                    }
                                                  }}
                                                  placeholder="#FFD700"
                                                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#0ea5e9] focus:outline-none bg-white text-gray-900 font-mono text-sm"
                                                  style={{ fontFamily: "'Lato', sans-serif" }}
                                                />
                                                <p className="text-xs text-gray-900/60 mt-1" style={{ fontFamily: "'Lato', sans-serif" }}>Used for highlights and emphasis</p>
                                              </div>
                                              <div
                                                className="w-12 h-12 rounded-lg border-2 border-white/30 shadow-inner"
                                                style={{ backgroundColor: themeConfig.colors?.accent || '#FFD700' }}
                                                title="Color preview"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Background Colors */}
                                      <div className="bg-white border border-gray-200 p-4 sm:p-6 rounded-xl shadow-sm">
                                        <h4 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Background Colors</h4>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                          {/* Background Color */}
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                              Background Color
                                            </label>
                                            <div className="flex gap-3 items-center">
                                              <input
                                                type="color"
                                                value={themeConfig.colors?.background || '#FFF8F0'}
                                                onChange={(e) => setThemeConfig({
                                                  ...themeConfig,
                                                  colors: { ...themeConfig.colors, background: e.target.value }
                                                })}
                                                className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
                                              />
                                              <div className="flex-1">
                                                <input
                                                  type="text"
                                                  value={themeConfig.colors?.background || '#FFF8F0'}
                                                  onChange={(e) => {
                                                    const value = e.target.value
                                                    if (/^#[0-9A-Fa-f]{0,6}$/.test(value) || value === '') {
                                                      setThemeConfig({
                                                        ...themeConfig,
                                                        colors: { ...themeConfig.colors, background: value }
                                                      })
                                                    }
                                                  }}
                                                  placeholder="#FFF8F0"
                                                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-rose-400 focus:outline-none bg-white font-mono text-sm"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Main background color</p>
                                              </div>
                                              <div
                                                className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-inner"
                                                style={{ backgroundColor: themeConfig.colors?.background || '#FFF8F0' }}
                                                title="Color preview"
                                              />
                                            </div>
                                          </div>

                                          {/* Background Secondary Color */}
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                              Background Secondary Color
                                            </label>
                                            <div className="flex gap-3 items-center">
                                              <input
                                                type="color"
                                                value={themeConfig.colors?.backgroundSecondary || '#FFFFFF'}
                                                onChange={(e) => setThemeConfig({
                                                  ...themeConfig,
                                                  colors: { ...themeConfig.colors, backgroundSecondary: e.target.value }
                                                })}
                                                className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
                                              />
                                              <div className="flex-1">
                                                <input
                                                  type="text"
                                                  value={themeConfig.colors?.backgroundSecondary || '#FFFFFF'}
                                                  onChange={(e) => {
                                                    const value = e.target.value
                                                    if (/^#[0-9A-Fa-f]{0,6}$/.test(value) || value === '') {
                                                      setThemeConfig({
                                                        ...themeConfig,
                                                        colors: { ...themeConfig.colors, backgroundSecondary: value }
                                                      })
                                                    }
                                                  }}
                                                  placeholder="#FFFFFF"
                                                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-rose-400 focus:outline-none bg-white font-mono text-sm"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Used for cards and sections</p>
                                              </div>
                                              <div
                                                className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-inner"
                                                style={{ backgroundColor: themeConfig.colors?.backgroundSecondary || '#FFFFFF' }}
                                                title="Color preview"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Text Colors */}
                                      <div className="bg-[#e0e5ec] p-6 rounded-xl border border-[#d1d9e6]">
                                        <h4 className="font-semibold text-[#2d3748] mb-4">Text Colors</h4>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                          {/* Text Primary Color */}
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                              Text Primary Color
                                            </label>
                                            <div className="flex gap-3 items-center">
                                              <input
                                                type="color"
                                                value={themeConfig.colors?.textPrimary || '#2D3748'}
                                                onChange={(e) => setThemeConfig({
                                                  ...themeConfig,
                                                  colors: { ...themeConfig.colors, textPrimary: e.target.value }
                                                })}
                                                className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
                                              />
                                              <div className="flex-1">
                                                <input
                                                  type="text"
                                                  value={themeConfig.colors?.textPrimary || '#2D3748'}
                                                  onChange={(e) => {
                                                    const value = e.target.value
                                                    if (/^#[0-9A-Fa-f]{0,6}$/.test(value) || value === '') {
                                                      setThemeConfig({
                                                        ...themeConfig,
                                                        colors: { ...themeConfig.colors, textPrimary: value }
                                                      })
                                                    }
                                                  }}
                                                  placeholder="#2D3748"
                                                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-rose-400 focus:outline-none bg-white font-mono text-sm"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Main text color (headings, body)</p>
                                              </div>
                                              <div
                                                className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-inner"
                                                style={{ backgroundColor: themeConfig.colors?.textPrimary || '#2D3748' }}
                                                title="Color preview"
                                              />
                                            </div>
                                          </div>

                                          {/* Text Secondary Color */}
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                              Text Secondary Color
                                            </label>
                                            <div className="flex gap-3 items-center">
                                              <input
                                                type="color"
                                                value={themeConfig.colors?.textSecondary || '#718096'}
                                                onChange={(e) => setThemeConfig({
                                                  ...themeConfig,
                                                  colors: { ...themeConfig.colors, textSecondary: e.target.value }
                                                })}
                                                className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
                                              />
                                              <div className="flex-1">
                                                <input
                                                  type="text"
                                                  value={themeConfig.colors?.textSecondary || '#718096'}
                                                  onChange={(e) => {
                                                    const value = e.target.value
                                                    if (/^#[0-9A-Fa-f]{0,6}$/.test(value) || value === '') {
                                                      setThemeConfig({
                                                        ...themeConfig,
                                                        colors: { ...themeConfig.colors, textSecondary: value }
                                                      })
                                                    }
                                                  }}
                                                  placeholder="#718096"
                                                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-rose-400 focus:outline-none bg-white font-mono text-sm"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Secondary text (descriptions, captions)</p>
                                              </div>
                                              <div
                                                className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-inner"
                                                style={{ backgroundColor: themeConfig.colors?.textSecondary || '#718096' }}
                                                title="Color preview"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Color Contrast Validation */}
                                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
                                        <h4 className="font-semibold text-[#2d3748] mb-4 flex items-center gap-2">
                                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          Accessibility Contrast Check
                                        </h4>

                                        <div className="space-y-4">
                                          {/* Text on Background Contrast */}
                                          <div className="bg-white/70 p-4 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                              <span className="text-sm font-medium text-gray-700">Text Primary on Background</span>
                                              <span className={`text-xs font-bold px-3 py-1 rounded-full ${calculateContrastRatio(themeConfig.colors?.textPrimary || '#2D3748', themeConfig.colors?.background || '#FFF8F0') >= 4.5
                                                  ? 'bg-green-100 text-green-700'
                                                  : 'bg-red-100 text-red-700'
                                                }`}>
                                                {calculateContrastRatio(themeConfig.colors?.textPrimary || '#2D3748', themeConfig.colors?.background || '#FFF8F0').toFixed(2)}:1
                                              </span>
                                            </div>
                                            <div
                                              className="p-3 rounded border-2"
                                              style={{
                                                backgroundColor: themeConfig.colors?.background || '#FFF8F0',
                                                color: themeConfig.colors?.textPrimary || '#2D3748',
                                                borderColor: themeConfig.colors?.textPrimary || '#2D3748'
                                              }}
                                            >
                                              <p className="text-sm font-medium">Sample heading text</p>
                                              <p className="text-xs mt-1">Sample body text for readability testing</p>
                                            </div>
                                            <p className="text-xs text-gray-600 mt-2">
                                              {calculateContrastRatio(themeConfig.colors?.textPrimary || '#2D3748', themeConfig.colors?.background || '#FFF8F0') >= 4.5
                                                ? '✓ Passes WCAG AA (4.5:1 minimum for normal text)'
                                                : '✗ Fails WCAG AA - Increase contrast for better accessibility'}
                                            </p>
                                          </div>

                                          {/* Text Secondary on Background Contrast */}
                                          <div className="bg-white/70 p-4 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                              <span className="text-sm font-medium text-gray-700">Text Secondary on Background</span>
                                              <span className={`text-xs font-bold px-3 py-1 rounded-full ${calculateContrastRatio(themeConfig.colors?.textSecondary || '#718096', themeConfig.colors?.background || '#FFF8F0') >= 4.5
                                                  ? 'bg-green-100 text-green-700'
                                                  : 'bg-red-100 text-red-700'
                                                }`}>
                                                {calculateContrastRatio(themeConfig.colors?.textSecondary || '#718096', themeConfig.colors?.background || '#FFF8F0').toFixed(2)}:1
                                              </span>
                                            </div>
                                            <div
                                              className="p-3 rounded border-2"
                                              style={{
                                                backgroundColor: themeConfig.colors?.background || '#FFF8F0',
                                                color: themeConfig.colors?.textSecondary || '#718096',
                                                borderColor: themeConfig.colors?.textSecondary || '#718096'
                                              }}
                                            >
                                              <p className="text-xs">Sample secondary text for descriptions and captions</p>
                                            </div>
                                            <p className="text-xs text-gray-600 mt-2">
                                              {calculateContrastRatio(themeConfig.colors?.textSecondary || '#718096', themeConfig.colors?.background || '#FFF8F0') >= 4.5
                                                ? '✓ Passes WCAG AA (4.5:1 minimum for normal text)'
                                                : '✗ Fails WCAG AA - Increase contrast for better accessibility'}
                                            </p>
                                          </div>

                                          {/* Primary Color on Background (for buttons) */}
                                          <div className="bg-white/70 p-4 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                              <span className="text-sm font-medium text-gray-700">White Text on Primary Color (Buttons)</span>
                                              <span className={`text-xs font-bold px-3 py-1 rounded-full ${calculateContrastRatio('#FFFFFF', themeConfig.colors?.primary || '#FF6B9D') >= 3.0
                                                  ? 'bg-green-100 text-green-700'
                                                  : 'bg-red-100 text-red-700'
                                                }`}>
                                                {calculateContrastRatio('#FFFFFF', themeConfig.colors?.primary || '#FF6B9D').toFixed(2)}:1
                                              </span>
                                            </div>
                                            <div
                                              className="p-3 rounded-lg text-center font-semibold"
                                              style={{
                                                backgroundColor: themeConfig.colors?.primary || '#FF6B9D',
                                                color: '#FFFFFF'
                                              }}
                                            >
                                              Sample Button Text
                                            </div>
                                            <p className="text-xs text-gray-600 mt-2">
                                              {calculateContrastRatio('#FFFFFF', themeConfig.colors?.primary || '#FF6B9D') >= 3.0
                                                ? '✓ Passes WCAG AA for large text (3:1 minimum)'
                                                : '✗ Fails WCAG AA - Use a darker primary color or different text color'}
                                            </p>
                                          </div>
                                        </div>

                                        <div className="mt-4 p-3 bg-blue-100/50 rounded-lg border border-blue-300">
                                          <p className="text-xs text-blue-800">
                                            <strong>WCAG AA Standards:</strong> Normal text requires 4.5:1 contrast ratio. Large text (18pt+ or 14pt+ bold) requires 3:1 contrast ratio.
                                          </p>
                                        </div>
                                      </div>

                                      {/* Save and Reset Buttons */}
                                      <div className="flex justify-between items-center pt-4">
                                        <motion.button
                                          whileHover={{ scale: 1.02 }}
                                          whileTap={{ scale: 0.98 }}
                                          onClick={resetThemeConfig}
                                          disabled={isSavingThemeConfig}
                                          className="px-6 py-3 neu-btn rounded-xl font-bold text-amber-600 disabled:opacity-50"
                                        >
                                          Reset to Default
                                        </motion.button>

                                        <motion.button
                                          whileHover={{ scale: 1.02 }}
                                          whileTap={{ scale: 0.98 }}
                                          onClick={saveThemeConfig}
                                          disabled={isSavingThemeConfig}
                                          className="px-8 py-3 neu-btn rounded-xl font-bold text-rose-600 disabled:opacity-50"
                                        >
                                          {isSavingThemeConfig ? 'Saving...' : 'Save Configuration'}
                                        </motion.button>
                                      </div>
                                    </div>
                                  )}

                                  {themeConfigTab === 'features' && (
                                    <div>
                                      <h3 className="text-lg font-semibold text-[#2d3748] mb-4">Features Section Configuration</h3>
                                      <p className="text-sm text-[#6b7280]">
                                        Configure feature items (3-6 items) with icons, titles, and descriptions.
                                      </p>
                                      <p className="text-xs text-amber-600 mt-4 p-3 bg-amber-50 rounded-lg">
                                        Features configuration is available in the Text tab above.
                                      </p>
                                    </div>
                                  )}

                                  {themeConfigTab === 'pricing' && (
                                    <div>
                                      <h3 className="text-lg font-semibold text-[#2d3748] mb-4">Pricing Section Configuration</h3>
                                      <p className="text-sm text-[#6b7280]">
                                        Configure pricing tiers with names, prices, features, and recommended tier.
                                      </p>
                                      <p className="text-xs text-amber-600 mt-4 p-3 bg-amber-50 rounded-lg">
                                        Pricing configuration is available in the Text tab above.
                                      </p>
                                    </div>
                                  )}

                                  {themeConfigTab === 'faq' && (
                                    <div>
                                      <h3 className="text-lg font-semibold text-[#2d3748] mb-4">FAQ Section Configuration</h3>
                                      <p className="text-sm text-[#6b7280]">
                                        Configure FAQ items (3-10 items) with questions and answers.
                                      </p>
                                      <p className="text-xs text-amber-600 mt-4 p-3 bg-amber-50 rounded-lg">
                                        FAQ configuration is available in the Text tab above.
                                      </p>
                                    </div>
                                  )}

                                  {themeConfigTab === 'templates' && (
                                    <div className="space-y-6">
                                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Templates & Catalog Configuration</h3>

                                      <div className="bg-gray-100 backdrop-blur-md border border-gray-100 p-4 sm:p-6 rounded-xl space-y-6">
                                        {/* Global Toggle */}
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                          <div>
                                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Enable Templates Section</h4>
                                            <p className="text-xs text-gray-900/60">Show or hide the entire templates/catalog section on the landing page.</p>
                                          </div>
                                          <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                              type="checkbox"
                                              className="sr-only peer"
                                              checked={themeConfig.templates?.enabled !== false}
                                              onChange={(e) => setThemeConfig({
                                                ...themeConfig,
                                                templates: { ...themeConfig.templates, enabled: e.target.checked }
                                              })}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0ea5e9]"></div>
                                          </label>
                                        </div>

                                        {themeConfig.templates?.enabled !== false && (
                                          <>
                                            {/* Section Mode */}
                                            <div className="space-y-4">
                                              <h4 className="font-semibold text-gray-900 text-sm">Display Mode</h4>
                                              <div className="grid grid-cols-2 gap-4">
                                                <button
                                                  onClick={() => setThemeConfig({
                                                    ...themeConfig,
                                                    templates: { ...themeConfig.templates, useExternalCatalog: false }
                                                  })}
                                                  className={`p-4 rounded-xl border-2 transition-all text-left ${!themeConfig.templates?.useExternalCatalog
                                                      ? 'border-[#0ea5e9] bg-[#0ea5e9]/10'
                                                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                                                    }`}
                                                >
                                                  <div className="font-bold text-gray-900 text-sm mb-1">Local Template Grid</div>
                                                  <div className="text-xs text-gray-900/60">Show templates hosted on this platform.</div>
                                                </button>
                                                <button
                                                  onClick={() => setThemeConfig({
                                                    ...themeConfig,
                                                    templates: { ...themeConfig.templates, useExternalCatalog: true }
                                                  })}
                                                  className={`p-4 rounded-xl border-2 transition-all text-left ${themeConfig.templates?.useExternalCatalog
                                                      ? 'border-[#0ea5e9] bg-[#0ea5e9]/10'
                                                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                                                    }`}
                                                >
                                                  <div className="font-bold text-gray-900 text-sm mb-1">External Catalog</div>
                                                  <div className="text-xs text-gray-900/60">Link to akaInvitation or other external site.</div>
                                                </button>
                                              </div>
                                            </div>

                                            {/* Common Text Settings */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                              <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Section Title</label>
                                                <input
                                                  type="text"
                                                  value={themeConfig.templates?.title || ''}
                                                  onChange={(e) => setThemeConfig({
                                                    ...themeConfig,
                                                    templates: { ...themeConfig.templates, title: e.target.value }
                                                  })}
                                                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 text-sm"
                                                />
                                              </div>
                                              <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Section Subtitle</label>
                                                <input
                                                  type="text"
                                                  value={themeConfig.templates?.subtitle || ''}
                                                  onChange={(e) => setThemeConfig({
                                                    ...themeConfig,
                                                    templates: { ...themeConfig.templates, subtitle: e.target.value }
                                                  })}
                                                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 text-sm"
                                                />
                                              </div>
                                            </div>

                                            {themeConfig.templates?.useExternalCatalog && (
                                              <div className="pt-4 border-t border-gray-200 space-y-4">
                                                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                                                  <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-green-400">✓</span>
                                                    <h4 className="font-semibold text-green-400 text-sm">Terintegrasi dengan Katalog Akainvitation</h4>
                                                  </div>
                                                  <p className="text-xs text-gray-900/60">
                                                    Semua tema dari id.akainvitation.com/tema akan ditampilkan langsung di landing page Anda.
                                                  </p>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                  <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Preview Button Text</label>
                                                    <input
                                                      type="text"
                                                      value={themeConfig.templates?.previewButtonText || ''}
                                                      onChange={(e) => setThemeConfig({
                                                        ...themeConfig,
                                                        templates: { ...themeConfig.templates, previewButtonText: e.target.value }
                                                      })}
                                                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 text-sm"
                                                    />
                                                  </div>
                                                  <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Order Button Text (Optional)</label>
                                                    <input
                                                      type="text"
                                                      value={themeConfig.templates?.orderButtonText || ''}
                                                      onChange={(e) => setThemeConfig({
                                                        ...themeConfig,
                                                        templates: { ...themeConfig.templates, orderButtonText: e.target.value }
                                                      })}
                                                      placeholder="Leave empty to hide"
                                                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 text-sm"
                                                    />
                                                  </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                  <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-2">Button Color</label>
                                                    <div className="flex gap-3">
                                                      <input
                                                        type="color"
                                                        value={themeConfig.templates?.buttonColor || '#d4af37'}
                                                        onChange={(e) => setThemeConfig({
                                                          ...themeConfig,
                                                          templates: { ...themeConfig.templates, buttonColor: e.target.value }
                                                        })}
                                                        className="w-12 h-12 rounded-lg border border-gray-200 bg-gray-100 cursor-pointer"
                                                      />
                                                      <input
                                                        type="text"
                                                        value={themeConfig.templates?.buttonColor || '#d4af37'}
                                                        onChange={(e) => setThemeConfig({
                                                          ...themeConfig,
                                                          templates: { ...themeConfig.templates, buttonColor: e.target.value }
                                                        })}
                                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 text-sm font-mono"
                                                      />
                                                    </div>
                                                  </div>
                                                  <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-2">Button Text Color</label>
                                                    <div className="flex gap-3">
                                                      <input
                                                        type="color"
                                                        value={themeConfig.templates?.buttonTextColor || '#172a26'}
                                                        onChange={(e) => setThemeConfig({
                                                          ...themeConfig,
                                                          templates: { ...themeConfig.templates, buttonTextColor: e.target.value }
                                                        })}
                                                        className="w-12 h-12 rounded-lg border border-gray-200 bg-gray-100 cursor-pointer"
                                                      />
                                                      <input
                                                        type="text"
                                                        value={themeConfig.templates?.buttonTextColor || '#172a26'}
                                                        onChange={(e) => setThemeConfig({
                                                          ...themeConfig,
                                                          templates: { ...themeConfig.templates, buttonTextColor: e.target.value }
                                                        })}
                                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 text-sm font-mono"
                                                      />
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                          </>
                                        )}
                                      </div>

                                      {/* Save and Reset Buttons */}
                                      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-4">
                                        <motion.button
                                          whileHover={{ scale: 1.02 }}
                                          whileTap={{ scale: 0.98 }}
                                          onClick={resetThemeConfig}
                                          disabled={isSavingThemeConfig}
                                          className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 backdrop-blur-md border border-gray-200 rounded-xl font-bold text-amber-300 disabled:opacity-50 text-sm min-h-[44px]"
                                          style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                                        >
                                          Reset to Default
                                        </motion.button>

                                        <motion.button
                                          whileHover={{ scale: 1.02 }}
                                          whileTap={{ scale: 0.98 }}
                                          onClick={saveThemeConfig}
                                          disabled={isSavingThemeConfig}
                                          className="px-6 sm:px-8 py-2.5 sm:py-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-xl font-bold disabled:opacity-50 text-sm min-h-[44px]"
                                          style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                                        >
                                          {isSavingThemeConfig ? 'Saving...' : 'Save Configuration'}
                                        </motion.button>
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          {/* Live Preview Panel */}
                          {showPreview && (
                            <div className="lg:sticky lg:top-6 lg:self-start">
                              <div className="bg-white/30 p-4 rounded-2xl border border-[#d1d9e6]">
                                <div className="flex items-center justify-between mb-4">
                                  <h3 className="text-lg font-semibold text-[#2d3748]">Live Preview</h3>
                                  <div className="flex gap-2">
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => {
                                        const member = members.find(m => m.id === selectedMemberForTheme)
                                        if (member) {
                                          const slug = member.email?.split('@')[0] || 'preview'
                                          window.open(`/${slug}`, '_blank')
                                        }
                                      }}
                                      className="px-3 py-1 neu-btn rounded-lg text-xs font-medium text-blue-600"
                                      title="Open in new tab"
                                    >
                                      Open
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => setPreviewKey(prev => prev + 1)}
                                      className="px-3 py-1 neu-btn rounded-lg text-xs font-medium text-indigo-600"
                                      title="Refresh preview"
                                    >
                                      Refresh
                                    </motion.button>
                                  </div>
                                </div>

                                <div className="relative bg-white rounded-xl overflow-hidden border-2 border-gray-200" style={{ height: '600px' }}>
                                  {isLoadingThemeConfig ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                                      <div className="text-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
                                        <p className="text-sm text-gray-600">Loading preview...</p>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <iframe
                                        key={previewKey}
                                        src={`/${members.find(m => m.id === selectedMemberForTheme)?.email?.split('@')[0] || 'preview'}`}
                                        className="w-full h-full border-0"
                                        title="Theme Preview"
                                        sandbox="allow-scripts allow-same-origin allow-popups"
                                        onLoad={(e) => {
                                          // Send config to iframe after it loads
                                          const iframe = e.target as HTMLIFrameElement
                                          if (iframe.contentWindow && themeConfig) {
                                            try {
                                              iframe.contentWindow.postMessage({
                                                type: 'PREVIEW_CONFIG',
                                                config: themeConfig
                                              }, window.location.origin)
                                            } catch (err) {
                                              console.error('Failed to send config to preview:', err)
                                            }
                                          }
                                        }}
                                        onError={() => {
                                          console.error('Preview iframe failed to load')
                                        }}
                                      />
                                      <div className="absolute top-2 right-2 bg-amber-500/90 text-white px-2 py-1 rounded text-xs font-semibold">
                                        PREVIEW
                                      </div>
                                      </>
                                  )}
                                </div>

                                <p className="text-xs text-gray-500 mt-3 text-center">
                                  Click "Refresh" to update preview with latest changes
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                    </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
    </AnimatePresence>

      {/* Add Invitation Modal */ }
  <AnimatePresence>
    {showAddInvitationModal && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-white backdrop-blur-md border border-gray-200 shadow-xl rounded-3xl w-full max-w-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
        >
          <button
            type="button"
            onClick={() => setShowAddInvitationModal(false)}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            title="Batal"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Tambah Undangan Baru</h3>
          <form onSubmit={handleAddInvitation} className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Judul</label>
              <input
                type="text"
                value={newInvitation.title}
                onChange={(e) => setNewInvitation({ ...newInvitation, title: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                style={{ fontFamily: "'Lato', sans-serif" }}
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Nama Event</label>
              <input
                type="text"
                value={newInvitation.eventName}
                onChange={(e) => setNewInvitation({ ...newInvitation, eventName: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                style={{ fontFamily: "'Lato', sans-serif" }}
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Tanggal Event</label>
              <input
                type="date"
                value={newInvitation.eventDate}
                onChange={(e) => setNewInvitation({ ...newInvitation, eventDate: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                style={{ fontFamily: "'Lato', sans-serif" }}
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Lokasi</label>
              <input
                type="text"
                value={newInvitation.location}
                onChange={(e) => setNewInvitation({ ...newInvitation, location: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                style={{ fontFamily: "'Lato', sans-serif" }}
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Link Undangan</label>
              <input
                type="url"
                value={newInvitation.invitationLink}
                onChange={(e) => setNewInvitation({ ...newInvitation, invitationLink: e.target.value })}
                placeholder="https://satumomen.com/app/kirim/xxx atau https://id.akainvitation.com/xxx"
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                style={{ fontFamily: "'Lato', sans-serif" }}
              />
              <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: "'Lato', sans-serif" }}>Support: satumomen.com, id.akainvitation.com</p>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Cost Points</label>
              <input
                type="number"
                value={newInvitation.costPoints}
                onChange={(e) => setNewInvitation({ ...newInvitation, costPoints: parseInt(e.target.value) || 20 })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                style={{ fontFamily: "'Lato', sans-serif" }}
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Assign ke Member</label>
              <select
                value={newInvitation.assignedMemberId}
                onChange={(e) => setNewInvitation({ ...newInvitation, assignedMemberId: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 text-sm"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                <option value="" className="bg-white text-gray-900">Pilih Member</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id} className="bg-white text-gray-900">
                    {member.name} ({member.email}) - {member.creditPoints} coin
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Template Pesan Default</label>
              <textarea
                value={newInvitation.templateMessage}
                onChange={(e) => setNewInvitation({ ...newInvitation, templateMessage: e.target.value })}
                rows={6}
                placeholder="Kepada Yth. Bapak/Ibu/Saudara/i *{nama_tamu}* _di tempat_..."
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 resize-none text-sm"
                style={{ fontFamily: "'Lato', sans-serif" }}
              />
              <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: "'Lato', sans-serif" }}>Placeholder: {`{nama_tamu}, {link_undangan}, {event_name}, {event_date}, {location}`}</p>
            </div>
            <div className="flex gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setShowAddInvitationModal(false)}
                className="flex-1 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 backdrop-blur-md border border-gray-200 rounded-xl font-medium text-gray-500 text-sm min-h-[44px]"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                Batal
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex-1 py-2.5 sm:py-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-xl font-bold text-sm min-h-[44px]"
                style={{ fontFamily: "'Josefin Sans', sans-serif" }}
              >
                Simpan
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>


  {/* Edit Template Modal */ }
  <AnimatePresence>
    {showEditTemplateModal && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-white backdrop-blur-md border border-gray-200 shadow-xl rounded-3xl w-full max-w-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
        >
          <button
            type="button"
            onClick={() => setShowEditTemplateModal(false)}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            title="Batal"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Edit Template</h3>
          <form onSubmit={handleEditTemplate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Nama Template</label>
                <input
                  type="text"
                  value={editTemplateForm.title}
                  onChange={(e) => setEditTemplateForm({ ...editTemplateForm, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Kategori</label>
                <select
                  value={editTemplateForm.category}
                  onChange={(e) => setEditTemplateForm({ ...editTemplateForm, category: e.target.value as 'Pernikahan' | 'Ultah' })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 text-sm"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  <option value="Pernikahan" className="bg-white text-gray-900">Pernikahan</option>
                  <option value="Ultah" className="bg-white text-gray-900">Ultah</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Accent Color (Tailwind Classes)</label>
              <input
                type="text"
                value={editTemplateForm.accent}
                onChange={(e) => setEditTemplateForm({ ...editTemplateForm, accent: e.target.value })}
                placeholder="from-pink-300 to-yellow-200"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                style={{ fontFamily: "'Lato', sans-serif" }}
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Deskripsi</label>
              <textarea
                value={editTemplateForm.description}
                onChange={(e) => setEditTemplateForm({ ...editTemplateForm, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 resize-none text-sm"
                style={{ fontFamily: "'Lato', sans-serif" }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Hero Label</label>
                <input
                  type="text"
                  value={editTemplateForm.heroLabel}
                  onChange={(e) => setEditTemplateForm({ ...editTemplateForm, heroLabel: e.target.value })}
                  placeholder="Dengan Kebanggaan"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Hero Line</label>
                <input
                  type="text"
                  value={editTemplateForm.heroLine}
                  onChange={(e) => setEditTemplateForm({ ...editTemplateForm, heroLine: e.target.value })}
                  placeholder="Bersama segenap keluarga kami"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 text-sm"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Default Message</label>
              <textarea
                value={editTemplateForm.defaultMessage}
                onChange={(e) => setEditTemplateForm({ ...editTemplateForm, defaultMessage: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400 resize-none text-sm"
                style={{ fontFamily: "'Lato', sans-serif" }}
                placeholder="Kepada Yth. Bapak/Ibu/Saudara/i *{nama_tamu}*..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setShowEditTemplateModal(false)}
                className="flex-1 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 backdrop-blur-md border border-gray-200 rounded-xl font-medium text-gray-500 text-sm min-h-[44px]"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                Batal
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex-1 py-2.5 sm:py-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-xl font-bold text-sm min-h-[44px]"
                style={{ fontFamily: "'Josefin Sans', sans-serif" }}
              >
                Simpan Perubahan
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
  {/* Iframe Preview Modal */ }
  <AnimatePresence>
    {previewIframeUrl && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center"
        onClick={() => setPreviewIframeUrl(null)}
      >
        {/* Toolbar */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between gap-3 w-full max-w-2xl px-4 py-3 mb-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0ea5e9] flex items-center justify-center">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white truncate max-w-[180px] sm:max-w-xs" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>{previewIframeTitle}</h3>
              <p className="text-[11px] text-white/50">Live Preview</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Device Toggle */}
            <div className="flex items-center bg-white/10 rounded-xl p-1 gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); setPreviewIframeDevice('mobile') }}
                className={`p-2 rounded-lg text-xs font-medium transition-all ${previewIframeDevice === 'mobile'
                    ? 'bg-[#0ea5e9] text-white shadow-md'
                    : 'text-white/60 hover:text-white'
                  }`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setPreviewIframeDevice('desktop') }}
                className={`p-2 rounded-lg text-xs font-medium transition-all ${previewIframeDevice === 'desktop'
                    ? 'bg-[#0ea5e9] text-white shadow-md'
                    : 'text-white/60 hover:text-white'
                  }`}
                title="Desktop View"
              >
                <Layout className="w-4 h-4" />
              </button>
            </div>

            {/* Open in new tab */}
            <button
              onClick={(e) => { e.stopPropagation(); window.open(previewIframeUrl, '_blank') }}
              className="p-2 rounded-xl bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all"
              title="Buka di tab baru"
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={(e) => { e.stopPropagation(); setPreviewIframeUrl(null) }}
              className="p-2 rounded-xl bg-white/10 text-white/60 hover:text-red-400 hover:bg-red-500/20 transition-all"
              title="Tutup Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Iframe Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className={`bg-white rounded-3xl overflow-hidden shadow-2xl shadow-black/30 transition-all duration-500 ease-in-out ${previewIframeDevice === 'mobile'
              ? 'w-[375px] max-w-[95vw] h-[75vh] sm:h-[80vh]'
              : 'w-[90vw] max-w-5xl h-[75vh] sm:h-[80vh]'
            }`}
        >
          {/* Browser Chrome */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 border-b border-gray-200">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <div className="flex-1 mx-2">
              <div className="bg-white rounded-lg px-3 py-1 text-[11px] text-gray-400 border border-gray-200 truncate" style={{ fontFamily: "'Lato', sans-serif" }}>
                {previewIframeUrl}
              </div>
            </div>
          </div>
          {/* Iframe */}
          <iframe
            src={previewIframeUrl}
            className="w-full border-0"
            style={{ height: 'calc(100% - 40px)' }}
            title="Preview Undangan"
          />
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
    </div >
  )
}


// OG Image Uploader Section Component
function OGImageUploaderSection() {
  const [currentOgImage, setCurrentOgImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCurrentOgImage();
  }, []);

  const fetchCurrentOgImage = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/og-image');
      const data = await response.json();
      if (data.success && data.data) {
        setCurrentOgImage(data.data.ogImage);
      }
    } catch (error) {
      console.error('Error fetching OG image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = (imageUrl: string) => {
    setCurrentOgImage(imageUrl);
  };

  const handleDelete = () => {
    setCurrentOgImage(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-900/60">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {currentOgImage ? (
        <ImagePreview imageUrl={currentOgImage} onDelete={handleDelete} />
      ) : (
        <div className="text-center py-4 text-gray-900/60 text-sm mb-4">
          No custom OG image set. Using default image (/logo.png)
        </div>
      )}

      <OGImageUploader onUploadSuccess={handleUploadSuccess} currentImage={currentOgImage} />
    </div>
  );
}
