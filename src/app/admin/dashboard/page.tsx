'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Mail, CreditCard, LogOut, Plus, Edit, Trash2, ArrowLeft, Palette, FileText } from 'lucide-react'
import { TEMPLATE_OPTIONS, type TemplateOption } from '@/lib/invitationTemplates'

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
  assignedMember: {
    id: string
    name: string
    email: string
  }
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'members' | 'invitations' | 'templates' | 'settings' | 'theme-config'>('members')
  const [members, setMembers] = useState<Member[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [globalThemeSetting, setGlobalThemeSetting] = useState<'default' | 'light' | 'cleanapp'>('default')
  const [globalFaviconSetting, setGlobalFaviconSetting] = useState<string>('/favicon-rose.svg')
  const [isSavingGlobalTheme, setIsSavingGlobalTheme] = useState(false)
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [showAddInvitationModal, setShowAddInvitationModal] = useState(false)
  const [currentAdminId, setCurrentAdminId] = useState<string>('')
  const [showEditMemberModal, setShowEditMemberModal] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
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
  const [newMemberPricing, setNewMemberPricing] = useState(DEFAULT_PRICING_PACKAGES.map(p => ({...p})))

  // Pricing packages for edit member
  const [editMemberPricing, setEditMemberPricing] = useState(DEFAULT_PRICING_PACKAGES.map(p => ({...p})))

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
          landingPageFavicon: globalFaviconSetting 
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
        setNewMemberPricing(DEFAULT_PRICING_PACKAGES.map(p => ({...p})))
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
      setEditMemberPricing(DEFAULT_PRICING_PACKAGES.map(p => ({...p})))
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
    <div className="min-h-screen text-[#f4e4c1] pb-10" style={{ fontFamily: "'Lato', sans-serif", background: 'linear-gradient(160deg, #172a26 0%, #1a2f2a 60%, #1c352e 100%)' }}>
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4">
              <motion.button
                whileHover={{ x: -3 }}
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-1 sm:gap-2 text-[#f4e4c1]/70 hover:text-[#f4e4c1] transition-colors min-h-[44px] min-w-[44px] justify-center sm:justify-start"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-medium text-xs sm:text-sm hidden sm:inline" style={{ fontFamily: "'Lato', sans-serif" }}>Kembali</span>
              </motion.button>
              <h1 className="text-base sm:text-xl font-bold text-[#f4e4c1] tracking-wide" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = '/admin/editor'}
                className="inline-flex items-center gap-1 sm:gap-2 rounded-full bg-[#d4af37] hover:bg-[#c19b2a] text-[#172a26] px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition min-h-[44px]"
                style={{ fontFamily: "'Josefin Sans', sans-serif" }}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Buat Undangan</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 rounded-xl text-[#f4e4c1] transition-all text-xs sm:text-sm font-medium min-h-[44px]"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:bg-white/15 transition-all"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-[#f4e4c1]/70" style={{ fontFamily: "'Lato', sans-serif" }}>Total Member</p>
                <p className="text-2xl sm:text-3xl font-bold text-[#f4e4c1]" style={{ fontFamily: "'Arapey', Georgia, serif" }}>{members.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:bg-white/15 transition-all"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-[#f4e4c1]/70" style={{ fontFamily: "'Lato', sans-serif" }}>Total Undangan</p>
                <p className="text-2xl sm:text-3xl font-bold text-[#f4e4c1]" style={{ fontFamily: "'Arapey', Georgia, serif" }}>{invitations.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:bg-white/15 transition-all"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0">
                <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-[#f4e4c1]/70" style={{ fontFamily: "'Lato', sans-serif" }}>Total Credit Terpakai</p>
                <p className="text-2xl sm:text-3xl font-bold text-[#f4e4c1]" style={{ fontFamily: "'Arapey', Georgia, serif" }}>
                  {invitations.reduce((sum, inv) => sum + inv.costPoints, 0)} coin
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:bg-white/15 transition-all"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-[#f4e4c1]/70" style={{ fontFamily: "'Lato', sans-serif" }}>Total Template</p>
                <p className="text-2xl sm:text-3xl font-bold text-[#f4e4c1]" style={{ fontFamily: "'Arapey', Georgia, serif" }}>{templates.length}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('members')}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all min-h-[44px] text-xs sm:text-sm ${
              activeTab === 'members'
                ? 'bg-[#d4af37] text-[#172a26] shadow-lg'
                : 'bg-white/10 backdrop-blur-md border border-white/20 text-[#f4e4c1]/70 hover:bg-white/15'
            }`}
            style={{ fontFamily: "'Josefin Sans', sans-serif" }}
          >
            Members
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('invitations')}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all min-h-[44px] text-xs sm:text-sm ${
              activeTab === 'invitations'
                ? 'bg-[#d4af37] text-[#172a26] shadow-lg'
                : 'bg-white/10 backdrop-blur-md border border-white/20 text-[#f4e4c1]/70 hover:bg-white/15'
            }`}
            style={{ fontFamily: "'Josefin Sans', sans-serif" }}
          >
            Invitations
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('templates')}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all min-h-[44px] text-xs sm:text-sm ${
              activeTab === 'templates'
                ? 'bg-[#d4af37] text-[#172a26] shadow-lg'
                : 'bg-white/10 backdrop-blur-md border border-white/20 text-[#f4e4c1]/70 hover:bg-white/15'
            }`}
            style={{ fontFamily: "'Josefin Sans', sans-serif" }}
          >
            Templates
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('settings')}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all min-h-[44px] text-xs sm:text-sm ${
              activeTab === 'settings'
                ? 'bg-[#d4af37] text-[#172a26] shadow-lg'
                : 'bg-white/10 backdrop-blur-md border border-white/20 text-[#f4e4c1]/70 hover:bg-white/15'
            }`}
            style={{ fontFamily: "'Josefin Sans', sans-serif" }}
          >
            Settings
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('theme-config')}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all min-h-[44px] text-xs sm:text-sm ${
              activeTab === 'theme-config'
                ? 'bg-[#d4af37] text-[#172a26] shadow-lg'
                : 'bg-white/10 backdrop-blur-md border border-white/20 text-[#f4e4c1]/70 hover:bg-white/15'
            }`}
            style={{ fontFamily: "'Josefin Sans', sans-serif" }}
          >
            Theme Config
          </motion.button>
        </div>

        {/* Members Tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'members' && (
            <motion.div
              key="members"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl sm:rounded-3xl overflow-hidden"
            >
              <div className="p-4 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-lg sm:text-xl font-bold text-[#f4e4c1]" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Daftar Member</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddMemberModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#d4af37] hover:bg-[#c19b2a] text-[#172a26] rounded-xl font-medium min-h-[44px] text-sm"
                  style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                >
                  <Plus className="w-5 h-5" />
                  Tambah Member
                </motion.button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-[#f4e4c1]/80" style={{ fontFamily: "'Lato', sans-serif" }}>Nama</th>
                      <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-[#f4e4c1]/80" style={{ fontFamily: "'Lato', sans-serif" }}>Email</th>
                      <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-[#f4e4c1]/80" style={{ fontFamily: "'Lato', sans-serif" }}>WhatsApp</th>
                      <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-[#f4e4c1]/80" style={{ fontFamily: "'Lato', sans-serif" }}>Credit Points</th>
                      <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-[#f4e4c1]/80" style={{ fontFamily: "'Lato', sans-serif" }}>Status</th>
                      <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-[#f4e4c1]/80" style={{ fontFamily: "'Lato', sans-serif" }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member) => (
                      <tr key={member.id} className="border-t border-white/5 hover:bg-white/5">
                        <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-[#f4e4c1] text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>{member.name}</td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-[#f4e4c1]/70 text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>{member.email}</td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-[#f4e4c1]/70 text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>{member.whatsapp}</td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs sm:text-sm font-medium" style={{ fontFamily: "'Lato', sans-serif" }}>
                            {member.creditPoints} coin
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                            member.status === 'active'
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-red-500/20 text-red-300'
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
                              className="p-2 text-indigo-300 hover:bg-indigo-500/20 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                              title="Edit Member"
                            >
                              <Edit className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteMember(member.id)}
                              className="p-2 text-red-300 hover:bg-red-500/20 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
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
                        <td colSpan={6} className="px-4 sm:px-6 py-8 sm:py-12 text-center text-[#f4e4c1]/50 text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>
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
              className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl sm:rounded-3xl overflow-hidden"
            >
              <div className="p-4 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-lg sm:text-xl font-bold text-[#f4e4c1]" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Daftar Undangan</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddInvitationModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#d4af37] hover:bg-[#c19b2a] text-[#172a26] rounded-xl font-medium min-h-[44px] text-sm"
                  style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                >
                  <Plus className="w-5 h-5" />
                  Tambah Undangan
                </motion.button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-[#f4e4c1]/80" style={{ fontFamily: "'Lato', sans-serif" }}>Judul</th>
                      <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-[#f4e4c1]/80" style={{ fontFamily: "'Lato', sans-serif" }}>Event</th>
                      <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-[#f4e4c1]/80" style={{ fontFamily: "'Lato', sans-serif" }}>Tanggal</th>
                      <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-[#f4e4c1]/80" style={{ fontFamily: "'Lato', sans-serif" }}>Link</th>
                      <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-[#f4e4c1]/80" style={{ fontFamily: "'Lato', sans-serif" }}>Member</th>
                      <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-[#f4e4c1]/80" style={{ fontFamily: "'Lato', sans-serif" }}>Points</th>
                      <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-[#f4e4c1]/80" style={{ fontFamily: "'Lato', sans-serif" }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invitations.map((invitation) => (
                      <tr key={invitation.id} className="border-t border-white/5 hover:bg-white/5">
                        <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-[#f4e4c1] text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>{invitation.title}</td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-[#f4e4c1]/70 text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>{invitation.eventName}</td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-[#f4e4c1]/70 text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>
                          {new Date(invitation.eventDate).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <a
                            href={invitation.invitationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#d4af37] hover:underline text-sm truncate block max-w-xs"
                            style={{ fontFamily: "'Lato', sans-serif" }}
                          >
                            {invitation.invitationLink}
                          </a>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-[#f4e4c1]/70 text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>{invitation.assignedMember.name}</td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs sm:text-sm font-medium" style={{ fontFamily: "'Lato', sans-serif" }}>
                            {invitation.costPoints} coin
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                window.location.href = `/admin/editor?id=${invitation.id}`
                              }}
                              className="p-2 text-purple-300 hover:bg-purple-500/20 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                              title="Buka editor"
                            >
                              <Edit className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteInvitation(invitation.id)}
                              className="p-2 text-red-300 hover:bg-red-500/20 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                              title="Hapus Undangan"
                            >
                              <Trash2 className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {invitations.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 sm:px-6 py-8 sm:py-12 text-center text-[#f4e4c1]/50 text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>
                          Belum ada undangan. Klik "Tambah Undangan" untuk menambah undangan baru.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
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
              className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl sm:rounded-3xl overflow-hidden p-4 sm:p-6"
            >
              <h2 className="text-lg sm:text-xl font-bold text-[#f4e4c1] mb-4 sm:mb-6" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Global Settings</h2>
              
              <div className="bg-white/5 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/10 mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-[#f4e4c1] mb-2" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Tema Landing Page (Global)</h3>
                <p className="text-xs sm:text-sm text-[#f4e4c1]/70 mb-4 sm:mb-6" style={{ fontFamily: "'Lato', sans-serif" }}>
                  Pilih tema yang akan diterapkan untuk halaman utama website (landing page public) bagi semua pengunjung.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <button
                    onClick={() => setGlobalThemeSetting('default')}
                    className={`py-3 sm:py-4 rounded-xl border-2 transition-all font-medium text-sm ${
                      globalThemeSetting === 'default'
                        ? 'border-[#d4af37] bg-[#d4af37]/20 text-[#d4af37]'
                        : 'border-white/20 bg-white/5 text-[#f4e4c1]/70 hover:bg-white/10'
                    }`}
                    style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                  >
                    <div className="font-bold mb-1">Default Theme</div>
                    <div className="text-xs opacity-70">(DearMyLove Dark/Green)</div>
                  </button>
                  <button
                    onClick={() => setGlobalThemeSetting('light')}
                    className={`py-3 sm:py-4 rounded-xl border-2 transition-all font-medium text-sm ${
                      globalThemeSetting === 'light'
                        ? 'border-[#d4af37] bg-[#d4af37]/20 text-[#d4af37]'
                        : 'border-white/20 bg-white/5 text-[#f4e4c1]/70 hover:bg-white/10'
                    }`}
                    style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                  >
                    <div className="font-bold mb-1">Light Theme</div>
                    <div className="text-xs opacity-70">(Neumorphism / Glass)</div>
                  </button>
                  <button
                    onClick={() => setGlobalThemeSetting('cleanapp' as any)}
                    className={`py-3 sm:py-4 rounded-xl border-2 transition-all font-medium text-sm ${
                      globalThemeSetting === 'cleanapp'
                        ? 'border-[#d4af37] bg-[#d4af37]/20 text-[#d4af37]'
                        : 'border-white/20 bg-white/5 text-[#f4e4c1]/70 hover:bg-white/10'
                    }`}
                    style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                  >
                    <div className="font-bold mb-1">CleanApp Theme</div>
                    <div className="text-xs opacity-70">(Modern Mobile App)</div>
                  </button>
                </div>

                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-[#f4e4c1] mb-2" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Favicon URL / Upload</h3>
                  <p className="text-xs sm:text-sm text-[#f4e4c1]/70 mb-3" style={{ fontFamily: "'Lato', sans-serif" }}>
                    Gunakan URL gambar atau upload langsung dari komputer Anda. Mendukung SVG, PNG, dan ICO.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 mb-3">
                    <input
                      type="text"
                      value={globalFaviconSetting}
                      onChange={(e) => setGlobalFaviconSetting(e.target.value)}
                      placeholder="/favicon-rose.svg"
                      className="flex-1 px-4 py-2.5 sm:py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40 text-sm"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    />
                    <label className="cursor-pointer px-4 sm:px-6 py-2.5 sm:py-2 bg-[#d4af37] hover:bg-[#c19b2a] text-[#172a26] rounded-xl font-semibold text-center whitespace-nowrap text-sm min-h-[44px] flex items-center justify-center" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                      <span>Upload File</span>
                      <input type="file" className="hidden" accept=".svg,.png,.ico" onChange={handleFaviconUpload} />
                    </label>
                  </div>

                  {globalFaviconSetting && (
                    <div className="mt-2 flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[#f4e4c1]/70" style={{ fontFamily: "'Lato', sans-serif" }}>Preview:</span>
                        <img src={globalFaviconSetting} alt="Favicon Preview" className="w-8 h-8 object-contain rounded border border-white/20 p-0.5 bg-white/10" />
                      </div>
                      <button 
                        onClick={resetFavicon}
                        className="text-xs text-red-300 hover:text-red-200 hover:underline font-medium"
                        style={{ fontFamily: "'Lato', sans-serif" }}
                      >
                        Reset ke Default
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => saveGlobalTheme(globalThemeSetting)}
                    disabled={isSavingGlobalTheme}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#d4af37] hover:bg-[#c19b2a] text-[#172a26] rounded-xl font-bold disabled:opacity-50 text-sm min-h-[44px]"
                    style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                  >
                    {isSavingGlobalTheme ? 'Menyimpan...' : 'Simpan Pengaturan'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Theme Config Tab */}
          {activeTab === 'theme-config' && (
            <motion.div
              key="theme-config"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl sm:rounded-3xl overflow-hidden p-4 sm:p-6"
            >
              <h2 className="text-lg sm:text-xl font-bold text-[#f4e4c1] mb-4 sm:mb-6" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>CleanApp Theme Configuration</h2>
              
              {/* Member Selection */}
              <div className="bg-white/5 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/10 mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-[#f4e4c1] mb-2" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Select Member</h3>
                <p className="text-xs sm:text-sm text-[#f4e4c1]/70 mb-3 sm:mb-4" style={{ fontFamily: "'Lato', sans-serif" }}>
                  Choose a member to configure their CleanApp theme settings.
                </p>
                
                <select
                  value={selectedMemberForTheme}
                  onChange={(e) => setSelectedMemberForTheme(e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-3 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] text-sm"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  <option value="" className="bg-[#172a26] text-[#f4e4c1]">Select a member...</option>
                  {members
                    .filter(m => m.landingPageEnabled && m.landingPageTheme === 'cleanapp')
                    .map(member => (
                      <option key={member.id} value={member.id} className="bg-[#172a26] text-[#f4e4c1]">
                        {member.name} ({member.email})
                      </option>
                    ))}
                </select>
                
                {members.filter(m => m.landingPageEnabled && m.landingPageTheme === 'cleanapp').length === 0 && (
                  <p className="text-xs sm:text-sm text-amber-300 mt-3 p-3 bg-amber-500/20 rounded-lg border border-amber-500/30" style={{ fontFamily: "'Lato', sans-serif" }}>
                    No members have CleanApp theme enabled. Enable CleanApp theme for a member in the Members tab first.
                  </p>
                )}
              </div>

              {/* Configuration Tabs and Preview Layout */}
              {selectedMemberForTheme && (
                <>
                  {/* Toggle Preview Button */}
                  <div className="flex justify-end mb-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowPreview(!showPreview)}
                      className="px-4 py-2.5 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 rounded-lg font-medium text-sm text-[#f4e4c1] min-h-[44px]"
                      style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                    >
                      {showPreview ? 'Hide Preview' : 'Show Preview'}
                    </motion.button>
                  </div>

                  <div className={`grid ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-6`}>
                    {/* Configuration Panel */}
                    <div>
                      <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                        <button
                          onClick={() => setThemeConfigTab('text')}
                          className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-xs sm:text-sm min-h-[44px] ${
                            themeConfigTab === 'text'
                              ? 'bg-[#d4af37] text-[#172a26]'
                              : 'bg-white/10 border border-white/20 text-[#f4e4c1]/70 hover:bg-white/15'
                          }`}
                          style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                        >
                          Text
                        </button>
                        <button
                          onClick={() => setThemeConfigTab('images')}
                          className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-xs sm:text-sm min-h-[44px] ${
                            themeConfigTab === 'images'
                              ? 'bg-[#d4af37] text-[#172a26]'
                              : 'bg-white/10 border border-white/20 text-[#f4e4c1]/70 hover:bg-white/15'
                          }`}
                          style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                        >
                          Images
                        </button>
                        <button
                          onClick={() => setThemeConfigTab('colors')}
                          className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-xs sm:text-sm min-h-[44px] ${
                            themeConfigTab === 'colors'
                              ? 'bg-[#d4af37] text-[#172a26]'
                              : 'bg-white/10 border border-white/20 text-[#f4e4c1]/70 hover:bg-white/15'
                          }`}
                          style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                        >
                          Colors
                        </button>
                        <button
                          onClick={() => setThemeConfigTab('features')}
                          className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-xs sm:text-sm min-h-[44px] ${
                            themeConfigTab === 'features'
                              ? 'bg-[#d4af37] text-[#172a26]'
                              : 'bg-white/10 border border-white/20 text-[#f4e4c1]/70 hover:bg-white/15'
                          }`}
                          style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                        >
                          Features
                        </button>
                        <button
                          onClick={() => setThemeConfigTab('pricing')}
                          className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-xs sm:text-sm min-h-[44px] ${
                            themeConfigTab === 'pricing'
                              ? 'bg-[#d4af37] text-[#172a26]'
                              : 'bg-white/10 border border-white/20 text-[#f4e4c1]/70 hover:bg-white/15'
                          }`}
                          style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                        >
                          Pricing
                        </button>
                        <button
                          onClick={() => setThemeConfigTab('faq')}
                          className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-xs sm:text-sm min-h-[44px] ${
                            themeConfigTab === 'faq'
                              ? 'bg-[#d4af37] text-[#172a26]'
                              : 'bg-white/10 border border-white/20 text-[#f4e4c1]/70 hover:bg-white/15'
                          }`}
                          style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                        >
                          FAQ
                        </button>
                        <button
                          onClick={() => setThemeConfigTab('templates')}
                          className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-xs sm:text-sm min-h-[44px] ${
                            themeConfigTab === 'templates'
                              ? 'bg-[#d4af37] text-[#172a26]'
                              : 'bg-white/10 border border-white/20 text-[#f4e4c1]/70 hover:bg-white/15'
                          }`}
                          style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                        >
                          Templates
                        </button>
                      </div>

                  {/* Tab Content */}
                  <div className="bg-white/5 backdrop-blur-sm p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-white/10">
                    {isLoadingThemeConfig ? (
                      <div className="text-center py-12">
                        <p className="text-[#f4e4c1]/70" style={{ fontFamily: "'Lato', sans-serif" }}>Loading configuration...</p>
                      </div>
                    ) : !themeConfig ? (
                      <div className="text-center py-12">
                        <p className="text-[#f4e4c1]/70" style={{ fontFamily: "'Lato', sans-serif" }}>Select a member to configure their theme</p>
                      </div>
                    ) : (
                      <>
                        {themeConfigTab === 'text' && (
                          <div className="space-y-6">
                            <h3 className="text-base sm:text-lg font-semibold text-[#f4e4c1] mb-4" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Text Content Configuration</h3>
                            
                            {/* Hero Section */}
                            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 sm:p-6 rounded-xl">
                              <h4 className="font-semibold text-[#f4e4c1] mb-4 text-sm sm:text-base" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Hero Section</h4>
                              
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                                    Title <span className="text-xs text-[#f4e4c1]/50">({themeConfig.hero?.title?.length || 0}/200)</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={themeConfig.hero?.title || ''}
                                    onChange={(e) => setThemeConfig({
                                      ...themeConfig,
                                      hero: { ...themeConfig.hero, title: e.target.value }
                                    })}
                                    maxLength={200}
                                    className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40 text-sm"
                                    style={{ fontFamily: "'Lato', sans-serif" }}
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                                    Subtitle <span className="text-xs text-[#f4e4c1]/50">({themeConfig.hero?.subtitle?.length || 0}/500)</span>
                                  </label>
                                  <textarea
                                    value={themeConfig.hero?.subtitle || ''}
                                    onChange={(e) => setThemeConfig({
                                      ...themeConfig,
                                      hero: { ...themeConfig.hero, subtitle: e.target.value }
                                    })}
                                    maxLength={500}
                                    rows={3}
                                    className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40 resize-none text-sm"
                                    style={{ fontFamily: "'Lato', sans-serif" }}
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                                    CTA Button Text <span className="text-xs text-[#f4e4c1]/50">({themeConfig.hero?.ctaText?.length || 0}/50)</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={themeConfig.hero?.ctaText || ''}
                                    onChange={(e) => setThemeConfig({
                                      ...themeConfig,
                                      hero: { ...themeConfig.hero, ctaText: e.target.value }
                                    })}
                                    maxLength={50}
                                    className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40 text-sm"
                                    style={{ fontFamily: "'Lato', sans-serif" }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Features Section */}
                            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 sm:p-6 rounded-xl">
                              <h4 className="font-semibold text-[#f4e4c1] mb-4 text-sm sm:text-base" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Features Section</h4>
                              
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                                    Section Title <span className="text-xs text-[#f4e4c1]/50">({themeConfig.features?.title?.length || 0}/200)</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={themeConfig.features?.title || ''}
                                    onChange={(e) => setThemeConfig({
                                      ...themeConfig,
                                      features: { ...themeConfig.features, title: e.target.value }
                                    })}
                                    maxLength={200}
                                    className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40 text-sm"
                                    style={{ fontFamily: "'Lato', sans-serif" }}
                                  />
                                </div>
                                
                                {themeConfig.features?.items?.map((item: any, index: number) => (
                                  <div key={index} className="bg-white/5 p-3 sm:p-4 rounded-lg border border-white/10">
                                    <h5 className="text-xs sm:text-sm font-semibold text-[#f4e4c1]/90 mb-3" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Feature {index + 1}</h5>
                                    
                                    <div className="space-y-3">
                                      <div>
                                        <label className="block text-xs font-medium text-[#f4e4c1]/70 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Icon (emoji)</label>
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
                                          className="w-full px-3 py-2 border border-white/20 rounded-lg focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] text-sm"
                                          style={{ fontFamily: "'Lato', sans-serif" }}
                                        />
                                      </div>
                                      
                                      <div>
                                        <label className="block text-xs font-medium text-[#f4e4c1]/70 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                                          Title <span className="text-xs text-[#f4e4c1]/50">({item.title?.length || 0}/100)</span>
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
                                          className="w-full px-3 py-2 border border-white/20 rounded-lg focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] text-sm"
                                          style={{ fontFamily: "'Lato', sans-serif" }}
                                        />
                                      </div>
                                      
                                      <div>
                                        <label className="block text-xs font-medium text-[#f4e4c1]/70 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                                          Description <span className="text-xs text-[#f4e4c1]/50">({item.description?.length || 0}/300)</span>
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
                                          className="w-full px-3 py-2 border border-white/20 rounded-lg focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] text-sm resize-none"
                                          style={{ fontFamily: "'Lato', sans-serif" }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Pricing Section */}
                            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 sm:p-6 rounded-xl">
                              <h4 className="font-semibold text-[#f4e4c1] mb-4 text-sm sm:text-base" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Pricing Section</h4>
                              
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                                    Section Title <span className="text-xs text-[#f4e4c1]/50">({themeConfig.pricing?.title?.length || 0}/200)</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={themeConfig.pricing?.title || ''}
                                    onChange={(e) => setThemeConfig({
                                      ...themeConfig,
                                      pricing: { ...themeConfig.pricing, title: e.target.value }
                                    })}
                                    maxLength={200}
                                    className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40 text-sm"
                                    style={{ fontFamily: "'Lato', sans-serif" }}
                                  />
                                </div>
                                
                                {themeConfig.pricing?.tiers?.map((tier: any, index: number) => (
                                  <div key={index} className="bg-white/5 p-3 sm:p-4 rounded-lg border border-white/10">
                                    <h5 className="text-xs sm:text-sm font-semibold text-[#f4e4c1]/90 mb-3" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Tier {index + 1}</h5>
                                    
                                    <div className="space-y-3">
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <label className="block text-xs font-medium text-[#f4e4c1]/70 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                                            Name <span className="text-xs text-[#f4e4c1]/50">({tier.name?.length || 0}/100)</span>
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
                                            className="w-full px-3 py-2 border border-white/20 rounded-lg focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] text-sm"
                                            style={{ fontFamily: "'Lato', sans-serif" }}
                                          />
                                        </div>
                                        
                                        <div>
                                          <label className="block text-xs font-medium text-[#f4e4c1]/70 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                                            Price <span className="text-xs text-[#f4e4c1]/50">({tier.price?.length || 0}/50)</span>
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
                                            className="w-full px-3 py-2 border border-white/20 rounded-lg focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] text-sm"
                                            style={{ fontFamily: "'Lato', sans-serif" }}
                                          />
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <label className="block text-xs font-medium text-[#f4e4c1]/70 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                                          CTA Text <span className="text-xs text-[#f4e4c1]/50">({tier.ctaText?.length || 0}/50)</span>
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
                                          className="w-full px-3 py-2 border border-white/20 rounded-lg focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] text-sm"
                                          style={{ fontFamily: "'Lato', sans-serif" }}
                                        />
                                      </div>
                                      
                                      <div>
                                        <label className="block text-xs font-medium text-[#f4e4c1]/70 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Features (one per line)</label>
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
                                          className="w-full px-3 py-2 border border-white/20 rounded-lg focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] text-sm resize-none"
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
                                            className="w-4 h-4 rounded text-[#d4af37] focus:ring-[#d4af37] border-white/30"
                                          />
                                          <span className="text-xs font-medium text-[#f4e4c1]/80" style={{ fontFamily: "'Lato', sans-serif" }}>Recommended</span>
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* FAQ Section */}
                            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 sm:p-6 rounded-xl">
                              <h4 className="font-semibold text-[#f4e4c1] mb-4 text-sm sm:text-base" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>FAQ Section</h4>
                              
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                                    Section Title <span className="text-xs text-[#f4e4c1]/50">({themeConfig.faq?.title?.length || 0}/200)</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={themeConfig.faq?.title || ''}
                                    onChange={(e) => setThemeConfig({
                                      ...themeConfig,
                                      faq: { ...themeConfig.faq, title: e.target.value }
                                    })}
                                    maxLength={200}
                                    className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40 text-sm"
                                    style={{ fontFamily: "'Lato', sans-serif" }}
                                  />
                                </div>
                                
                                {themeConfig.faq?.items?.map((item: any, index: number) => (
                                  <div key={index} className="bg-white/5 p-3 sm:p-4 rounded-lg border border-white/10">
                                    <h5 className="text-xs sm:text-sm font-semibold text-[#f4e4c1]/90 mb-3" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>FAQ {index + 1}</h5>
                                    
                                    <div className="space-y-3">
                                      <div>
                                        <label className="block text-xs font-medium text-[#f4e4c1]/70 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                                          Question <span className="text-xs text-[#f4e4c1]/50">({item.question?.length || 0}/300)</span>
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
                                          className="w-full px-3 py-2 border border-white/20 rounded-lg focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] text-sm"
                                          style={{ fontFamily: "'Lato', sans-serif" }}
                                        />
                                      </div>
                                      
                                      <div>
                                        <label className="block text-xs font-medium text-[#f4e4c1]/70 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                                          Answer <span className="text-xs text-[#f4e4c1]/50">({item.answer?.length || 0}/1000)</span>
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
                                          className="w-full px-3 py-2 border border-white/20 rounded-lg focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] text-sm resize-none"
                                          style={{ fontFamily: "'Lato', sans-serif" }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Footer Section */}
                            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 sm:p-6 rounded-xl">
                              <h4 className="font-semibold text-[#f4e4c1] mb-4 text-sm sm:text-base" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Footer Section</h4>
                              
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                                    Footer Text <span className="text-xs text-[#f4e4c1]/50">({themeConfig.footer?.text?.length || 0}/500)</span>
                                  </label>
                                  <textarea
                                    value={themeConfig.footer?.text || ''}
                                    onChange={(e) => setThemeConfig({
                                      ...themeConfig,
                                      footer: { ...themeConfig.footer, text: e.target.value }
                                    })}
                                    maxLength={500}
                                    rows={3}
                                    className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40 resize-none text-sm"
                                    style={{ fontFamily: "'Lato', sans-serif" }}
                                  />
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Contact Email</label>
                                    <input
                                      type="email"
                                      value={themeConfig.footer?.contactEmail || ''}
                                      onChange={(e) => setThemeConfig({
                                        ...themeConfig,
                                        footer: { ...themeConfig.footer, contactEmail: e.target.value }
                                      })}
                                      className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40 text-sm"
                                      style={{ fontFamily: "'Lato', sans-serif" }}
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                                      Contact Phone <span className="text-xs text-[#f4e4c1]/50">({themeConfig.footer?.contactPhone?.length || 0}/50)</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={themeConfig.footer?.contactPhone || ''}
                                      onChange={(e) => setThemeConfig({
                                        ...themeConfig,
                                        footer: { ...themeConfig.footer, contactPhone: e.target.value }
                                      })}
                                      maxLength={50}
                                      className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40 text-sm"
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
                                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 rounded-xl font-bold text-amber-300 disabled:opacity-50 text-sm min-h-[44px]"
                                style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                              >
                                Reset to Default
                              </motion.button>
                              
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={saveThemeConfig}
                                disabled={isSavingThemeConfig}
                                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-[#d4af37] hover:bg-[#c19b2a] text-[#172a26] rounded-xl font-bold disabled:opacity-50 text-sm min-h-[44px]"
                                style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                              >
                                {isSavingThemeConfig ? 'Saving...' : 'Save Configuration'}
                              </motion.button>
                            </div>
                          </div>
                        )}
                        
                        {themeConfigTab === 'images' && (
                          <div className="space-y-6">
                            <h3 className="text-base sm:text-lg font-semibold text-[#f4e4c1] mb-2" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Image Configuration</h3>
                            <p className="text-xs sm:text-sm text-[#f4e4c1]/70 mb-6" style={{ fontFamily: "'Lato', sans-serif" }}>
                              Upload and configure hero images, feature icons, and other visual elements. Supported formats: JPG, PNG, WebP, SVG. Max size: 5MB.
                            </p>
                            
                            {/* Hero Images */}
                            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 sm:p-6 rounded-xl">
                              <h4 className="font-semibold text-[#f4e4c1] mb-4 text-sm sm:text-base" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Hero Section Images</h4>
                              
                              <div className="space-y-6">
                                {/* Hero Image */}
                                <div>
                                  <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                                    Hero Image
                                  </label>
                                  <div className="flex flex-col gap-3">
                                    {themeConfig.hero?.heroImage && (
                                      <div className="relative w-full h-48 bg-white/10 rounded-lg border-2 border-white/20 overflow-hidden">
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
                                      className="block w-full text-xs sm:text-sm text-[#f4e4c1]/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-[#d4af37] file:text-[#172a26] hover:file:bg-[#c19b2a] cursor-pointer"
                                      style={{ fontFamily: "'Lato', sans-serif" }}
                                    />
                                  </div>
                                </div>
                                
                                {/* Background Image */}
                                <div>
                                  <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                                    Background Image
                                  </label>
                                  <div className="flex flex-col gap-3">
                                    {themeConfig.hero?.backgroundImage && (
                                      <div className="relative w-full h-48 bg-white/10 rounded-lg border-2 border-white/20 overflow-hidden">
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
                                      className="block w-full text-xs sm:text-sm text-[#f4e4c1]/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-[#d4af37] file:text-[#172a26] hover:file:bg-[#c19b2a] cursor-pointer"
                                      style={{ fontFamily: "'Lato', sans-serif" }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Feature Icons */}
                            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 sm:p-6 rounded-xl">
                              <h4 className="font-semibold text-[#f4e4c1] mb-4 text-sm sm:text-base" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Feature Icons</h4>
                              <p className="text-xs text-[#f4e4c1]/70 mb-4" style={{ fontFamily: "'Lato', sans-serif" }}>
                                You can use emoji icons (configured in the Text tab) or upload custom icon images here.
                              </p>
                              
                              <div className="space-y-4">
                                {themeConfig.features?.items?.map((item: any, index: number) => (
                                  <div key={index} className="bg-white/5 p-3 sm:p-4 rounded-lg border border-white/10">
                                    <h5 className="text-xs sm:text-sm font-semibold text-[#f4e4c1]/90 mb-3" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                                      Feature {index + 1}: {item.title || 'Untitled'}
                                    </h5>
                                    
                                    <div className="flex flex-col gap-3">
                                      {item.iconImage && (
                                        <div className="relative w-24 h-24 bg-white/10 rounded-lg border-2 border-white/20 overflow-hidden">
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
                                        className="block w-full text-xs sm:text-sm text-[#f4e4c1]/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-500/80 file:text-white hover:file:bg-blue-600 cursor-pointer"
                                        style={{ fontFamily: "'Lato', sans-serif" }}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Template Preview Images */}
                            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 sm:p-6 rounded-xl">
                              <h4 className="font-semibold text-[#f4e4c1] mb-4 text-sm sm:text-base" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Template Preview Images</h4>
                              <p className="text-xs text-[#f4e4c1]/70 mb-4" style={{ fontFamily: "'Lato', sans-serif" }}>
                                Upload custom preview images for your invitation templates. These will be displayed in the template grid.
                              </p>
                              
                              <div className="space-y-4">
                                {themeConfig.pricing?.tiers?.map((tier: any, index: number) => (
                                  <div key={index} className="bg-white/5 p-3 sm:p-4 rounded-lg border border-white/10">
                                    <h5 className="text-xs sm:text-sm font-semibold text-[#f4e4c1]/90 mb-3" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                                      {tier.name || `Tier ${index + 1}`} Preview Image
                                    </h5>
                                    
                                    <div className="flex flex-col gap-3">
                                      {tier.previewImage && (
                                        <div className="relative w-full h-48 bg-white/10 rounded-lg border-2 border-white/20 overflow-hidden">
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
                                        className="block w-full text-xs sm:text-sm text-[#f4e4c1]/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-purple-500/80 file:text-white hover:file:bg-purple-600 cursor-pointer"
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
                                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 rounded-xl font-bold text-amber-300 disabled:opacity-50 text-sm min-h-[44px]"
                                style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                              >
                                Reset to Default
                              </motion.button>
                              
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={saveThemeConfig}
                                disabled={isSavingThemeConfig}
                                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-[#d4af37] hover:bg-[#c19b2a] text-[#172a26] rounded-xl font-bold disabled:opacity-50 text-sm min-h-[44px]"
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
                              <h3 className="text-base sm:text-lg font-semibold text-[#f4e4c1] mb-2" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Color Palette Configuration</h3>
                              <p className="text-xs sm:text-sm text-[#f4e4c1]/70 mb-4" style={{ fontFamily: "'Lato', sans-serif" }}>
                                Customize primary, secondary, accent, background, and text colors. All colors must be in hex format (e.g., #FF5733).
                              </p>
                              <p className="text-xs text-blue-300 p-3 bg-blue-500/20 rounded-lg border border-blue-500/30" style={{ fontFamily: "'Lato', sans-serif" }}>
                                <strong>Accessibility Note:</strong> The system will validate color contrast ratios to ensure WCAG AA compliance (4.5:1 for normal text, 3:1 for large text).
                              </p>
                            </div>
                            
                            {/* Primary Colors */}
                            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 sm:p-6 rounded-xl">
                              <h4 className="font-semibold text-[#f4e4c1] mb-4 text-sm sm:text-base" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Primary Colors</h4>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Primary Color */}
                                <div>
                                  <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
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
                                        className="w-full px-4 py-2 border-2 border-white/20 rounded-lg focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] font-mono text-sm"
                                        style={{ fontFamily: "'Lato', sans-serif" }}
                                      />
                                      <p className="text-xs text-[#f4e4c1]/60 mt-1" style={{ fontFamily: "'Lato', sans-serif" }}>Used for buttons, links, and accents</p>
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
                                  <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
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
                                        className="w-full px-4 py-2 border-2 border-white/20 rounded-lg focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] font-mono text-sm"
                                        style={{ fontFamily: "'Lato', sans-serif" }}
                                      />
                                      <p className="text-xs text-[#f4e4c1]/60 mt-1" style={{ fontFamily: "'Lato', sans-serif" }}>Used for secondary elements</p>
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
                                  <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
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
                                        className="w-full px-4 py-2 border-2 border-white/20 rounded-lg focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] font-mono text-sm"
                                        style={{ fontFamily: "'Lato', sans-serif" }}
                                      />
                                      <p className="text-xs text-[#f4e4c1]/60 mt-1" style={{ fontFamily: "'Lato', sans-serif" }}>Used for highlights and emphasis</p>
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
                            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 sm:p-6 rounded-xl">
                              <h4 className="font-semibold text-[#f4e4c1] mb-4 text-sm sm:text-base" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Background Colors</h4>
                              
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
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                      calculateContrastRatio(themeConfig.colors?.textPrimary || '#2D3748', themeConfig.colors?.background || '#FFF8F0') >= 4.5
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
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                      calculateContrastRatio(themeConfig.colors?.textSecondary || '#718096', themeConfig.colors?.background || '#FFF8F0') >= 4.5
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
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                      calculateContrastRatio('#FFFFFF', themeConfig.colors?.primary || '#FF6B9D') >= 3.0
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
                            <h3 className="text-base sm:text-lg font-semibold text-[#f4e4c1] mb-2" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Templates & Catalog Configuration</h3>
                            
                            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 sm:p-6 rounded-xl space-y-6">
                              {/* Global Toggle */}
                              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                                <div>
                                  <h4 className="font-semibold text-[#f4e4c1] text-sm sm:text-base">Enable Templates Section</h4>
                                  <p className="text-xs text-[#f4e4c1]/60">Show or hide the entire templates/catalog section on the landing page.</p>
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
                                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]"></div>
                                </label>
                              </div>

                              {themeConfig.templates?.enabled !== false && (
                                <>
                                  {/* Section Mode */}
                                  <div className="space-y-4">
                                    <h4 className="font-semibold text-[#f4e4c1] text-sm">Display Mode</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                      <button
                                        onClick={() => setThemeConfig({
                                          ...themeConfig,
                                          templates: { ...themeConfig.templates, useExternalCatalog: false }
                                        })}
                                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                                          !themeConfig.templates?.useExternalCatalog
                                            ? 'border-[#d4af37] bg-[#d4af37]/10'
                                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                                        }`}
                                      >
                                        <div className="font-bold text-[#f4e4c1] text-sm mb-1">Local Template Grid</div>
                                        <div className="text-xs text-[#f4e4c1]/60">Show templates hosted on this platform.</div>
                                      </button>
                                      <button
                                        onClick={() => setThemeConfig({
                                          ...themeConfig,
                                          templates: { ...themeConfig.templates, useExternalCatalog: true }
                                        })}
                                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                                          themeConfig.templates?.useExternalCatalog
                                            ? 'border-[#d4af37] bg-[#d4af37]/10'
                                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                                        }`}
                                      >
                                        <div className="font-bold text-[#f4e4c1] text-sm mb-1">External Catalog</div>
                                        <div className="text-xs text-[#f4e4c1]/60">Link to akaInvitation or other external site.</div>
                                      </button>
                                    </div>
                                  </div>

                                  {/* Common Text Settings */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-xs font-medium text-[#f4e4c1]/70 mb-1">Section Title</label>
                                      <input
                                        type="text"
                                        value={themeConfig.templates?.title || ''}
                                        onChange={(e) => setThemeConfig({
                                          ...themeConfig,
                                          templates: { ...themeConfig.templates, title: e.target.value }
                                        })}
                                        className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] text-sm"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-[#f4e4c1]/70 mb-1">Section Subtitle</label>
                                      <input
                                        type="text"
                                        value={themeConfig.templates?.subtitle || ''}
                                        onChange={(e) => setThemeConfig({
                                          ...themeConfig,
                                          templates: { ...themeConfig.templates, subtitle: e.target.value }
                                        })}
                                        className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] text-sm"
                                      />
                                    </div>
                                  </div>

                                  {themeConfig.templates?.useExternalCatalog && (
                                    <div className="pt-4 border-t border-white/10 space-y-4">
                                      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                                        <div className="flex items-center gap-2 mb-2">
                                          <span className="text-green-400">✓</span>
                                          <h4 className="font-semibold text-green-400 text-sm">Terintegrasi dengan Katalog Akainvitation</h4>
                                        </div>
                                        <p className="text-xs text-[#f4e4c1]/60">
                                          Semua tema dari id.akainvitation.com/tema akan ditampilkan langsung di landing page Anda.
                                        </p>
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <label className="block text-xs font-medium text-[#f4e4c1]/70 mb-1">Preview Button Text</label>
                                          <input
                                            type="text"
                                            value={themeConfig.templates?.previewButtonText || ''}
                                            onChange={(e) => setThemeConfig({
                                              ...themeConfig,
                                              templates: { ...themeConfig.templates, previewButtonText: e.target.value }
                                            })}
                                            className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] text-sm"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-xs font-medium text-[#f4e4c1]/70 mb-1">Order Button Text (Optional)</label>
                                          <input
                                            type="text"
                                            value={themeConfig.templates?.orderButtonText || ''}
                                            onChange={(e) => setThemeConfig({
                                              ...themeConfig,
                                              templates: { ...themeConfig.templates, orderButtonText: e.target.value }
                                            })}
                                            placeholder="Leave empty to hide"
                                            className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] text-sm"
                                          />
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <label className="block text-xs font-medium text-[#f4e4c1]/70 mb-2">Button Color</label>
                                          <div className="flex gap-3">
                                            <input
                                              type="color"
                                              value={themeConfig.templates?.buttonColor || '#d4af37'}
                                              onChange={(e) => setThemeConfig({
                                                ...themeConfig,
                                                templates: { ...themeConfig.templates, buttonColor: e.target.value }
                                              })}
                                              className="w-12 h-12 rounded-lg border-2 border-white/20 bg-white/10 cursor-pointer"
                                            />
                                            <input
                                              type="text"
                                              value={themeConfig.templates?.buttonColor || '#d4af37'}
                                              onChange={(e) => setThemeConfig({
                                                ...themeConfig,
                                                templates: { ...themeConfig.templates, buttonColor: e.target.value }
                                              })}
                                              className="flex-1 px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] text-sm font-mono"
                                            />
                                          </div>
                                        </div>
                                        <div>
                                          <label className="block text-xs font-medium text-[#f4e4c1]/70 mb-2">Button Text Color</label>
                                          <div className="flex gap-3">
                                            <input
                                              type="color"
                                              value={themeConfig.templates?.buttonTextColor || '#172a26'}
                                              onChange={(e) => setThemeConfig({
                                                ...themeConfig,
                                                templates: { ...themeConfig.templates, buttonTextColor: e.target.value }
                                              })}
                                              className="w-12 h-12 rounded-lg border-2 border-white/20 bg-white/10 cursor-pointer"
                                            />
                                            <input
                                              type="text"
                                              value={themeConfig.templates?.buttonTextColor || '#172a26'}
                                              onChange={(e) => setThemeConfig({
                                                ...themeConfig,
                                                templates: { ...themeConfig.templates, buttonTextColor: e.target.value }
                                              })}
                                              className="flex-1 px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] text-sm font-mono"
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
                                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 rounded-xl font-bold text-amber-300 disabled:opacity-50 text-sm min-h-[44px]"
                                style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                              >
                                Reset to Default
                              </motion.button>
                              
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={saveThemeConfig}
                                disabled={isSavingThemeConfig}
                                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-[#d4af37] hover:bg-[#c19b2a] text-[#172a26] rounded-xl font-bold disabled:opacity-50 text-sm min-h-[44px]"
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
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
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
              className="bg-[#1a2f2a]/95 backdrop-blur-md border border-white/20 rounded-2xl sm:rounded-3xl w-full max-w-md p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-lg sm:text-xl font-bold text-[#f4e4c1] mb-4 sm:mb-6" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Tambah Member Baru</h3>
              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Nama</label>
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40 text-sm"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Email</label>
                  <input
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40 text-sm"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>WhatsApp</label>
                  <input
                    type="text"
                    value={newMember.whatsapp}
                    onChange={(e) => setNewMember({ ...newMember, whatsapp: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40 text-sm"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Password</label>
                  <input
                    type="password"
                    value={newMember.password}
                    onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40 text-sm"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Credit Points Awal</label>
                  <input
                    type="number"
                    value={newMember.creditPoints}
                    onChange={(e) => setNewMember({ ...newMember, creditPoints: parseInt(e.target.value) || 0 })}
                    required
                    className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40 text-sm"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  />
                </div>
                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer p-3 border border-[#d4af37]/30 rounded-xl bg-[#d4af37]/10">
                    <input
                      type="checkbox"
                      checked={newMember.landingPageEnabled}
                      onChange={(e) => setNewMember({ ...newMember, landingPageEnabled: e.target.checked })}
                      className="w-5 h-5 rounded text-[#d4af37] focus:ring-[#d4af37] border-white/30"
                    />
                    <span className="text-xs sm:text-sm font-medium text-[#f4e4c1]" style={{ fontFamily: "'Lato', sans-serif" }}>Aktifkan Landing Page Custom u/ Member</span>
                  </label>
                </div>
                {newMember.landingPageEnabled && (
                  <>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Tema Landing Page</label>
                      <select
                        value={newMember.landingPageTheme}
                        onChange={(e) => setNewMember({ ...newMember, landingPageTheme: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] text-sm"
                        style={{ fontFamily: "'Lato', sans-serif" }}
                      >
                        <option value="default" className="bg-[#172a26] text-[#f4e4c1]">Default (Premium DearMyLove clone)</option>
                        <option value="neumorphism" className="bg-[#172a26] text-[#f4e4c1]">Neumorphism (Klasik)</option>
                        <option value="cleanapp" className="bg-[#172a26] text-[#f4e4c1]">CleanApp (Modern Mobile App)</option>
                      </select>
                    </div>
                    {/* Pricing Packages */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>Paket Harga (Pricing)</label>
                      <div className="space-y-3">
                        {newMemberPricing.map((pkg, idx) => (
                          <div key={pkg.id} className={`border border-white/20 rounded-xl p-3 space-y-2 transition-all bg-white/5 ${!pkg.enabled ? 'opacity-50' : ''}`}>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-[#f4e4c1]/80" style={{ fontFamily: "'Lato', sans-serif" }}>Paket {idx + 1}: {pkg.name}</span>
                              <button type="button" onClick={() => {
                                const updated = [...newMemberPricing]
                                updated[idx].enabled = !updated[idx].enabled
                                setNewMemberPricing(updated)
                              }} className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${pkg.enabled ? 'bg-[#d4af37]' : 'bg-white/20'}`}>
                                <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${pkg.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                              </button>
                            </div>
                            <div className="flex gap-2">
                              <input type="text" placeholder="Nama" value={pkg.name} disabled={!pkg.enabled}
                                onChange={(e) => { const u=[...newMemberPricing]; u[idx].name=e.target.value; setNewMemberPricing(u) }}
                                className="flex-1 text-xs px-2 py-1.5 border border-white/20 rounded-lg focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40" style={{ fontFamily: "'Lato', sans-serif" }} />
                              <input type="text" placeholder="Harga" value={pkg.price} disabled={!pkg.enabled}
                                onChange={(e) => { const u=[...newMemberPricing]; u[idx].price=e.target.value; setNewMemberPricing(u) }}
                                className="flex-1 text-xs px-2 py-1.5 border border-white/20 rounded-lg focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40" style={{ fontFamily: "'Lato', sans-serif" }} />
                            </div>
                            <textarea placeholder="Fitur (pisahkan enter)" value={pkg.features} rows={2} disabled={!pkg.enabled}
                              onChange={(e) => { const u=[...newMemberPricing]; u[idx].features=e.target.value; setNewMemberPricing(u) }}
                              className="w-full text-xs px-2 py-1.5 border border-white/20 rounded-lg focus:outline-none resize-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40" style={{ fontFamily: "'Lato', sans-serif" }} />
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
                    className="flex-1 py-2.5 sm:py-3 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 rounded-xl font-medium text-[#f4e4c1]/70 text-sm min-h-[44px]"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    Batal
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 py-2.5 sm:py-3 bg-[#d4af37] hover:bg-[#c19b2a] text-[#172a26] rounded-xl font-bold text-sm min-h-[44px]"
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
              className="bg-[#1a2f2a]/95 backdrop-blur-md border border-white/20 rounded-2xl sm:rounded-3xl w-full max-w-md p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-lg sm:text-xl font-bold text-[#f4e4c1] mb-4 sm:mb-6" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Edit Member</h3>
              <form onSubmit={handleEditMember} className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Nama</label>
                  <input
                    type="text"
                    value={editMemberForm.name}
                    onChange={(e) => setEditMemberForm({ ...editMemberForm, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40 text-sm"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Email</label>
                  <input
                    type="email"
                    value={editMemberForm.email}
                    onChange={(e) => setEditMemberForm({ ...editMemberForm, email: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40 text-sm"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>WhatsApp</label>
                  <input
                    type="text"
                    value={editMemberForm.whatsapp}
                    onChange={(e) => setEditMemberForm({ ...editMemberForm, whatsapp: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40 text-sm"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Password Baru (Opsional)</label>
                  <input
                    type="password"
                    value={editMemberForm.password}
                    onChange={(e) => setEditMemberForm({ ...editMemberForm, password: e.target.value })}
                    placeholder="Biarkan kosong jika tidak ingin mengubah password"
                    className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40 text-sm"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Status</label>
                  <select
                    value={editMemberForm.status}
                    onChange={(e) => setEditMemberForm({ ...editMemberForm, status: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] text-sm"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    <option value="active" className="bg-[#172a26] text-[#f4e4c1]">Active</option>
                    <option value="inactive" className="bg-[#172a26] text-[#f4e4c1]">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Credit Points</label>
                  <input
                    type="number"
                    value={editMemberForm.creditPoints}
                    onChange={(e) => setEditMemberForm({ ...editMemberForm, creditPoints: parseInt(e.target.value) || 0 })}
                    required
                    className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40 text-sm"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  />
                </div>
                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer p-3 border border-[#d4af37]/30 rounded-xl bg-[#d4af37]/10">
                    <input
                      type="checkbox"
                      checked={editMemberForm.landingPageEnabled}
                      onChange={(e) => setEditMemberForm({ ...editMemberForm, landingPageEnabled: e.target.checked })}
                      className="w-5 h-5 rounded text-[#d4af37] focus:ring-[#d4af37] border-white/30"
                    />
                    <span className="text-xs sm:text-sm font-medium text-[#f4e4c1]" style={{ fontFamily: "'Lato', sans-serif" }}>Aktifkan Landing Page Custom u/ Member</span>
                  </label>
                </div>
                {editMemberForm.landingPageEnabled && (
                  <>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Tema Landing Page</label>
                      <select
                        value={editMemberForm.landingPageTheme}
                        onChange={(e) => setEditMemberForm({ ...editMemberForm, landingPageTheme: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] text-sm"
                        style={{ fontFamily: "'Lato', sans-serif" }}
                      >
                        <option value="default" className="bg-[#172a26] text-[#f4e4c1]">Default (Premium DearMyLove clone)</option>
                        <option value="neumorphism" className="bg-[#172a26] text-[#f4e4c1]">Neumorphism (Klasik)</option>
                        <option value="cleanapp" className="bg-[#172a26] text-[#f4e4c1]">CleanApp (Modern Mobile App)</option>
                      </select>
                    </div>
                    {/* Pricing Packages */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>Paket Harga (Pricing)</label>
                      <div className="space-y-3">
                        {editMemberPricing.map((pkg, idx) => (
                          <div key={pkg.id} className={`border border-white/20 rounded-xl p-3 space-y-2 transition-all bg-white/5 ${!pkg.enabled ? 'opacity-50' : ''}`}>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-[#f4e4c1]/80" style={{ fontFamily: "'Lato', sans-serif" }}>Paket {idx + 1}: {pkg.name}</span>
                              <button type="button" onClick={() => {
                                const updated = [...editMemberPricing]
                                updated[idx].enabled = !updated[idx].enabled
                                setEditMemberPricing(updated)
                              }} className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${pkg.enabled ? 'bg-[#d4af37]' : 'bg-white/20'}`}>
                                <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${pkg.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                              </button>
                            </div>
                            <div className="flex gap-2">
                              <input type="text" placeholder="Nama" value={pkg.name} disabled={!pkg.enabled}
                                onChange={(e) => { const u=[...editMemberPricing]; u[idx].name=e.target.value; setEditMemberPricing(u) }}
                                className="flex-1 text-xs px-2 py-1.5 border border-white/20 rounded-lg focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40" style={{ fontFamily: "'Lato', sans-serif" }} />
                              <input type="text" placeholder="Harga" value={pkg.price} disabled={!pkg.enabled}
                                onChange={(e) => { const u=[...editMemberPricing]; u[idx].price=e.target.value; setEditMemberPricing(u) }}
                                className="flex-1 text-xs px-2 py-1.5 border border-white/20 rounded-lg focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40" style={{ fontFamily: "'Lato', sans-serif" }} />
                            </div>
                            <textarea placeholder="Fitur (pisahkan enter)" value={pkg.features} rows={2} disabled={!pkg.enabled}
                              onChange={(e) => { const u=[...editMemberPricing]; u[idx].features=e.target.value; setEditMemberPricing(u) }}
                              className="w-full text-xs px-2 py-1.5 border border-white/20 rounded-lg focus:outline-none resize-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40" style={{ fontFamily: "'Lato', sans-serif" }} />
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
                    className="flex-1 py-2.5 sm:py-3 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 rounded-xl font-medium text-[#f4e4c1]/70 text-sm min-h-[44px]"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    Batal
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 py-2.5 sm:py-3 bg-[#d4af37] hover:bg-[#c19b2a] text-[#172a26] rounded-xl font-bold text-sm min-h-[44px]"
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

      {/* Add Invitation Modal */}
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
              className="bg-[#1a2f2a]/95 backdrop-blur-md border border-white/20 rounded-2xl sm:rounded-3xl w-full max-w-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-lg sm:text-xl font-bold text-[#f4e4c1] mb-4 sm:mb-6" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Tambah Undangan Baru</h3>
              <form onSubmit={handleAddInvitation} className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Judul</label>
                  <input
                    type="text"
                    value={newInvitation.title}
                    onChange={(e) => setNewInvitation({ ...newInvitation, title: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40 text-sm"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Nama Event</label>
                  <input
                    type="text"
                    value={newInvitation.eventName}
                    onChange={(e) => setNewInvitation({ ...newInvitation, eventName: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40 text-sm"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Tanggal Event</label>
                  <input
                    type="date"
                    value={newInvitation.eventDate}
                    onChange={(e) => setNewInvitation({ ...newInvitation, eventDate: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40 text-sm"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Lokasi</label>
                  <input
                    type="text"
                    value={newInvitation.location}
                    onChange={(e) => setNewInvitation({ ...newInvitation, location: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40 text-sm"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Link Undangan</label>
                  <input
                    type="url"
                    value={newInvitation.invitationLink}
                    onChange={(e) => setNewInvitation({ ...newInvitation, invitationLink: e.target.value })}
                    placeholder="https://satumomen.com/app/kirim/xxx atau https://id.akainvitation.com/xxx"
                    required
                    className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40 text-sm"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  />
                  <p className="text-xs text-[#f4e4c1]/50 mt-1" style={{ fontFamily: "'Lato', sans-serif" }}>Support: satumomen.com, id.akainvitation.com</p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Cost Points</label>
                  <input
                    type="number"
                    value={newInvitation.costPoints}
                    onChange={(e) => setNewInvitation({ ...newInvitation, costPoints: parseInt(e.target.value) || 20 })}
                    className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40 text-sm"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Assign ke Member</label>
                  <select
                    value={newInvitation.assignedMemberId}
                    onChange={(e) => setNewInvitation({ ...newInvitation, assignedMemberId: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] text-sm"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    <option value="" className="bg-[#172a26] text-[#f4e4c1]">Pilih Member</option>
                    {members.map((member) => (
                      <option key={member.id} value={member.id} className="bg-[#172a26] text-[#f4e4c1]">
                        {member.name} ({member.email}) - {member.creditPoints} coin
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Template Pesan Default</label>
                  <textarea
                    value={newInvitation.templateMessage}
                    onChange={(e) => setNewInvitation({ ...newInvitation, templateMessage: e.target.value })}
                    rows={6}
                    placeholder="Kepada Yth. Bapak/Ibu/Saudara/i *{nama_tamu}* _di tempat_..."
                    className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40 resize-none text-sm"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  />
                  <p className="text-xs text-[#f4e4c1]/50 mt-1" style={{ fontFamily: "'Lato', sans-serif" }}>Placeholder: {`{nama_tamu}, {link_undangan}, {event_name}, {event_date}, {location}`}</p>
                </div>
                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowAddInvitationModal(false)}
                    className="flex-1 py-2.5 sm:py-3 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 rounded-xl font-medium text-[#f4e4c1]/70 text-sm min-h-[44px]"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    Batal
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 py-2.5 sm:py-3 bg-[#d4af37] hover:bg-[#c19b2a] text-[#172a26] rounded-xl font-bold text-sm min-h-[44px]"
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
      {/* Templates Tab */}
      <AnimatePresence mode="wait">
        {activeTab === 'templates' && (
          <motion.div
            key="templates"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl sm:rounded-3xl overflow-hidden"
          >
            <div className="p-4 sm:p-6 border-b border-white/10">
              <h2 className="text-lg sm:text-xl font-bold text-[#f4e4c1]" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Kelola Template Undangan</h2>
              <p className="text-xs sm:text-sm text-[#f4e4c1]/70 mt-1" style={{ fontFamily: "'Lato', sans-serif" }}>Edit template undangan yang tersedia untuk member</p>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                {templates.map((template) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/15 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${template.accent} flex items-center justify-center`}>
                        <Palette className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                        template.category === 'Pernikahan'
                          ? 'bg-pink-500/20 text-pink-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`} style={{ fontFamily: "'Lato', sans-serif" }}>
                        {template.category}
                      </span>
                    </div>

                    <h3 className="font-bold text-[#f4e4c1] mb-2 text-sm sm:text-base" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>{template.title}</h3>
                    <p className="text-xs sm:text-sm text-[#f4e4c1]/70 mb-4 line-clamp-2" style={{ fontFamily: "'Lato', sans-serif" }}>{template.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="text-xs text-[#f4e4c1]/60" style={{ fontFamily: "'Lato', sans-serif" }}>
                        <strong className="text-[#f4e4c1]/80">Hero Label:</strong> {template.heroLabel}
                      </div>
                      <div className="text-xs text-[#f4e4c1]/60" style={{ fontFamily: "'Lato', sans-serif" }}>
                        <strong className="text-[#f4e4c1]/80">Hero Line:</strong> {template.heroLine}
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openEditTemplateModal(template)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#d4af37] hover:bg-[#c19b2a] text-[#172a26] rounded-xl font-bold text-sm min-h-[44px]"
                      style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                    >
                      <Edit className="w-4 h-4" />
                      Edit Template
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Template Modal */}
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
              className="bg-[#1a2f2a]/95 backdrop-blur-md border border-white/20 rounded-2xl sm:rounded-3xl w-full max-w-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-lg sm:text-xl font-bold text-[#f4e4c1] mb-4 sm:mb-6" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Edit Template</h3>
              <form onSubmit={handleEditTemplate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Nama Template</label>
                    <input
                      type="text"
                      value={editTemplateForm.title}
                      onChange={(e) => setEditTemplateForm({ ...editTemplateForm, title: e.target.value })}
                      required
                      className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40 text-sm"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Kategori</label>
                    <select
                      value={editTemplateForm.category}
                      onChange={(e) => setEditTemplateForm({ ...editTemplateForm, category: e.target.value as 'Pernikahan' | 'Ultah' })}
                      className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] text-sm"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      <option value="Pernikahan" className="bg-[#172a26] text-[#f4e4c1]">Pernikahan</option>
                      <option value="Ultah" className="bg-[#172a26] text-[#f4e4c1]">Ultah</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Accent Color (Tailwind Classes)</label>
                  <input
                    type="text"
                    value={editTemplateForm.accent}
                    onChange={(e) => setEditTemplateForm({ ...editTemplateForm, accent: e.target.value })}
                    placeholder="from-pink-300 to-yellow-200"
                    className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40 text-sm"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Deskripsi</label>
                  <textarea
                    value={editTemplateForm.description}
                    onChange={(e) => setEditTemplateForm({ ...editTemplateForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40 resize-none text-sm"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Hero Label</label>
                    <input
                      type="text"
                      value={editTemplateForm.heroLabel}
                      onChange={(e) => setEditTemplateForm({ ...editTemplateForm, heroLabel: e.target.value })}
                      placeholder="Dengan Kebanggaan"
                      className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40 text-sm"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Hero Line</label>
                    <input
                      type="text"
                      value={editTemplateForm.heroLine}
                      onChange={(e) => setEditTemplateForm({ ...editTemplateForm, heroLine: e.target.value })}
                      placeholder="Bersama segenap keluarga kami"
                      className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40 text-sm"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#f4e4c1]/80 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>Default Message</label>
                  <textarea
                    value={editTemplateForm.defaultMessage}
                    onChange={(e) => setEditTemplateForm({ ...editTemplateForm, defaultMessage: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-2 border-2 border-white/20 rounded-xl focus:border-[#d4af37] focus:outline-none bg-white/10 text-[#f4e4c1] placeholder:text-[#f4e4c1]/40 resize-none text-sm"
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
                    className="flex-1 py-2.5 sm:py-3 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 rounded-xl font-medium text-[#f4e4c1]/70 text-sm min-h-[44px]"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    Batal
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 py-2.5 sm:py-3 bg-[#d4af37] hover:bg-[#c19b2a] text-[#172a26] rounded-xl font-bold text-sm min-h-[44px]"
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
    </div>
  )
}
