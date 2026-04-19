'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Mail, CreditCard, LogOut, Plus, Edit, Trash2, ArrowLeft, Palette, FileText } from 'lucide-react'
import { TEMPLATE_OPTIONS, type TemplateOption } from '@/lib/invitationTemplates'

const ROSE_PATH = "M1431 5750c0,-651 0,-1302 0,-1954 -205,-447 -746,-551 -950,-512 -613,115 -279,-290 49,302 269,394 572,437 901,210 0,-300 0,-600 0,-900 226,-16 504,-84 555,-264 166,-514 319,-435 246,-367 -67,62 -192,66 -277,71 -175,2 -284,8 -435,75 -368,163 -72,305 -97,-131 -8,-140 -56,-244 -99,-348 -218,-530 324,-205 -238,-118 -392,60 -855,28 -1003,-404 -126,-386 130,-448 437,-302 233,111 471,263 708,358 114,46 239,82 362,50 297,-90 466,-207 464,-541 -1,-281 -201,-121 -337,-48 -282,150 -659,293 -940,63 -158,-133 -172,-263 -153,-454 9,-86 23,-170 -66,-215 -113,-38 -186,56 -232,146 -53,104 -75,280 -21,388 113,191 455,209 649,279 150,53 235,205 337,237 149,41 180,-159 34,-211 -259,-86 -557,-125 -647,-426 -82,-293 489,-36 599,45 211,163 366,434 657,442 173,-18 365,-211 414,-373 46,-155 -48,-191 -154,-301 -150,-153 -35,-471 -484,-313 -223,78 -397,349 -147,420 112,32 227,-5 256,-128 15,-63 -2,-120 -32,-175 -170,-271 -457,-314 -753,-291 -171,14 -320,172 -252,348 128,194 506,438 738,333 99,-52 152,-141 84,-243 -77,-116 -304,-161 -381,-33 -95,176 255,491 370,596 90,82 160,145 239,244 203,260 45,279 29,252 -22,-37 41,-89 65,-107 113,-77 272,-120 335,-251 34,-75 119,-353 242,-259 83,63 28,204 -21,271 -114,154 -312,266 -451,406 -125,128 -177,160 -346,216 -486,155 -767,-103 -1066,-439 -111,-125 -258,-304 -423,-354"

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
  const [activeTab, setActiveTab] = useState<'members' | 'invitations' | 'templates' | 'settings'>('members')
  const [members, setMembers] = useState<Member[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [globalThemeSetting, setGlobalThemeSetting] = useState<'default' | 'light'>('default')
  const [isSavingGlobalTheme, setIsSavingGlobalTheme] = useState(false)
  const [preloaderEnabled, setPreloaderEnabled] = useState(true)
  const [preloaderDuration, setPreloaderDuration] = useState(3200)
  const [preloaderLogoText, setPreloaderLogoText] = useState('AKA Invitation')
  const [preloaderBgColor, setPreloaderBgColor] = useState('#172a26')
  const [isSavingPreloader, setIsSavingPreloader] = useState(false)
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

  const fetchGlobalTheme = async () => {
    try {
      const res = await fetch('/api/admin/settings')
      const data = await res.json()
      if (data.success && data.data) {
        setGlobalThemeSetting(data.data.landingPageTheme || 'default')
        setPreloaderEnabled(data.data.preloaderEnabled ?? true)
        setPreloaderDuration(data.data.preloaderDuration ?? 3200)
        setPreloaderLogoText(data.data.preloaderLogoText || 'AKA Invitation')
        setPreloaderBgColor(data.data.preloaderBgColor || '#172a26')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const saveGlobalTheme = async (theme: 'default' | 'light') => {
    setIsSavingGlobalTheme(true)
    setGlobalThemeSetting(theme)
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ landingPageTheme: theme })
      })
      alert('Tema global landing page berhasil disimpan!')
    } catch (e) {
      alert('Gagal menyimpan tema global')
    } finally {
      setIsSavingGlobalTheme(false)
    }
  }

  const savePreloaderSettings = async () => {
    setIsSavingPreloader(true)
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preloaderEnabled,
          preloaderDuration,
          preloaderLogoText,
          preloaderBgColor,
        })
      })
      alert('Pengaturan preloader berhasil disimpan!')
    } catch (e) {
      alert('Gagal menyimpan pengaturan preloader')
    } finally {
      setIsSavingPreloader(false)
    }
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
    <div className="min-h-screen bg-[#e0e5ec] text-[#2d3748] font-sans pb-10">
      {/* Header */}
      <header className="neu-flat border-b border-[#d1d9e6] sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ x: -3 }}
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-2 text-[#6b7280] hover:text-[#2d3748] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium text-sm">Kembali</span>
              </motion.button>
              <h1 className="text-xl font-bold text-[#2d3748] tracking-wide">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = '/admin/editor'}
                className="inline-flex items-center gap-2 rounded-full neu-btn text-[#2d3748] px-4 py-2 text-sm font-semibold transition"
              >
                <Plus className="w-4 h-4" />
                Buat Undangan
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 neu-btn rounded-xl text-[#2d3748] transition-all text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="neu-raised-lg rounded-3xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-[#6b7280]">Total Member</p>
                <p className="text-3xl font-bold text-[#2d3748]">{members.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="neu-raised-lg rounded-3xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-[#6b7280]">Total Undangan</p>
                <p className="text-3xl font-bold text-[#2d3748]">{invitations.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="neu-raised-lg rounded-3xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <CreditCard className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-[#6b7280]">Total Credit Terpakai</p>
                <p className="text-3xl font-bold text-[#2d3748]">
                  {invitations.reduce((sum, inv) => sum + inv.costPoints, 0)} coin
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="neu-raised-lg rounded-3xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-[#6b7280]">Total Template</p>
                <p className="text-3xl font-bold text-[#2d3748]">{templates.length}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('members')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'members'
                ? 'neu-pressed text-purple-600'
                : 'neu-btn text-[#6b7280]'
            }`}
          >
            Members
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('invitations')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'invitations'
                ? 'neu-pressed text-pink-600'
                : 'neu-btn text-[#6b7280]'
            }`}
          >
            Invitations
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('templates')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'templates'
                ? 'neu-pressed text-teal-600'
                : 'neu-btn text-[#6b7280]'
            }`}
          >
            Templates
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'settings'
                ? 'neu-pressed text-amber-600'
                : 'neu-btn text-[#6b7280]'
            }`}
          >
            Settings
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
              className="neu-raised-lg rounded-3xl overflow-hidden"
            >
              <div className="p-6 border-b border-[#d1d9e6] flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#2d3748]">Daftar Member</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddMemberModal(true)}
                  className="flex items-center gap-2 px-4 py-2 neu-btn rounded-xl font-medium text-purple-600"
                >
                  <Plus className="w-5 h-5" />
                  Tambah Member
                </motion.button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#e0e5ec] border-b border-[#d1d9e6]">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Nama</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Email</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">WhatsApp</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Credit Points</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member) => (
                      <tr key={member.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-800">{member.name}</td>
                        <td className="px-6 py-4 text-gray-600">{member.email}</td>
                        <td className="px-6 py-4 text-gray-600">{member.whatsapp}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                            {member.creditPoints} coin
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            member.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {member.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openEditModal(member)}
                              className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Edit Member"
                            >
                              <Edit className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteMember(member.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
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
              className="neu-raised-lg rounded-3xl overflow-hidden"
            >
              <div className="p-6 border-b border-[#d1d9e6] flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#2d3748]">Daftar Undangan</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddInvitationModal(true)}
                  className="flex items-center gap-2 px-4 py-2 neu-btn rounded-xl font-medium text-pink-600"
                >
                  <Plus className="w-5 h-5" />
                  Tambah Undangan
                </motion.button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#e0e5ec] border-b border-[#d1d9e6]">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Judul</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Event</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Tanggal</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Link</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Member</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Points</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invitations.map((invitation) => (
                      <tr key={invitation.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-800">{invitation.title}</td>
                        <td className="px-6 py-4 text-gray-600">{invitation.eventName}</td>
                        <td className="px-6 py-4 text-gray-600">
                          {new Date(invitation.eventDate).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={invitation.invitationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:underline text-sm truncate block max-w-xs"
                          >
                            {invitation.invitationLink}
                          </a>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{invitation.assignedMember.name}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                            {invitation.costPoints} coin
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                window.location.href = `/admin/editor?id=${invitation.id}`
                              }}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Buka editor"
                            >
                              <Edit className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteInvitation(invitation.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
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
              className="neu-raised-lg rounded-3xl overflow-hidden p-6"
            >
              <h2 className="text-xl font-bold text-[#2d3748] mb-6">Global Settings</h2>
              
              <div className="bg-[#e0e5ec] p-6 rounded-2xl border border-[#d1d9e6] shadow-inner mb-6">
                <h3 className="text-lg font-semibold text-[#2d3748] mb-2">Tema Landing Page (Global)</h3>
                <p className="text-sm text-[#6b7280] mb-6">
                  Pilih tema yang akan diterapkan untuk halaman utama website (landing page public) bagi semua pengunjung.
                </p>
                
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={() => setGlobalThemeSetting('default')}
                    className={`flex-1 py-4 rounded-xl border-2 transition-all font-medium ${
                      globalThemeSetting === 'default'
                        ? 'border-indigo-500 neu-pressed text-indigo-600'
                        : 'border-transparent neu-btn text-[#6b7280]'
                    }`}
                  >
                    <div className="font-bold mb-1">Default Theme</div>
                    <div className="text-xs opacity-70">(DearMyLove Dark/Green)</div>
                  </button>
                  <button
                    onClick={() => setGlobalThemeSetting('light')}
                    className={`flex-1 py-4 rounded-xl border-2 transition-all font-medium ${
                      globalThemeSetting === 'light'
                        ? 'border-teal-500 neu-pressed text-teal-600'
                        : 'border-transparent neu-btn text-[#6b7280]'
                    }`}
                  >
                    <div className="font-bold mb-1">Light Theme</div>
                    <div className="text-xs opacity-70">(Neumorphism / Glass)</div>
                  </button>
                </div>
                
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => saveGlobalTheme(globalThemeSetting)}
                    disabled={isSavingGlobalTheme}
                    className="px-6 py-3 neu-btn rounded-xl font-bold text-indigo-600 disabled:opacity-50"
                  >
                    {isSavingGlobalTheme ? 'Menyimpan...' : 'Simpan Pengaturan'}
                  </motion.button>
                </div>
              </div>

              {/* Preloader Settings */}
              <div className="bg-[#e0e5ec] p-6 rounded-2xl border border-[#d1d9e6] shadow-inner">
                <h3 className="text-lg font-semibold text-[#2d3748] mb-2">Pengaturan Preloader</h3>
                <p className="text-sm text-[#6b7280] mb-6">
                  Atur animasi loading screen yang muncul saat pengunjung pertama kali membuka landing page.
                </p>

                {/* Enable/Disable Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 border border-[#d1d9e6] mb-4">
                  <div>
                    <p className="font-semibold text-[#2d3748] text-sm">Aktifkan Preloader</p>
                    <p className="text-xs text-[#6b7280] mt-0.5">Tampilkan animasi rose saat halaman dibuka</p>
                  </div>
                  <button
                    onClick={() => setPreloaderEnabled(!preloaderEnabled)}
                    className={`relative w-12 h-6 rounded-full transition-all ${preloaderEnabled ? 'bg-indigo-500' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${preloaderEnabled ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                {preloaderEnabled && (
                  <div className="space-y-4">
                    {/* Duration */}
                    <div>
                      <label className="block text-sm font-medium text-[#2d3748] mb-2">
                        Durasi Preloader: <span className="text-indigo-600 font-bold">{(preloaderDuration / 1000).toFixed(1)}s</span>
                      </label>
                      <input
                        type="range"
                        min={1000}
                        max={6000}
                        step={200}
                        value={preloaderDuration}
                        onChange={(e) => setPreloaderDuration(Number(e.target.value))}
                        className="w-full accent-indigo-500"
                      />
                      <div className="flex justify-between text-xs text-[#6b7280] mt-1">
                        <span>1s</span>
                        <span>6s</span>
                      </div>
                    </div>

                    {/* Logo Text */}
                    <div>
                      <label className="block text-sm font-medium text-[#2d3748] mb-2">Teks Logo Preloader</label>
                      <input
                        type="text"
                        value={preloaderLogoText}
                        onChange={(e) => setPreloaderLogoText(e.target.value)}
                        placeholder="AKA Invitation"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#d1d9e6] bg-white/70 text-[#2d3748] outline-none focus:border-indigo-400 text-sm"
                      />
                      <p className="text-xs text-[#6b7280] mt-1">Teks yang tampil di atas animasi rose</p>
                    </div>

                    {/* Background Color */}
                    <div>
                      <label className="block text-sm font-medium text-[#2d3748] mb-2">Warna Background Preloader</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={preloaderBgColor}
                          onChange={(e) => setPreloaderBgColor(e.target.value)}
                          className="w-12 h-10 rounded-lg cursor-pointer border border-[#d1d9e6]"
                        />
                        <input
                          type="text"
                          value={preloaderBgColor}
                          onChange={(e) => setPreloaderBgColor(e.target.value)}
                          placeholder="#172a26"
                          className="flex-1 px-4 py-2.5 rounded-xl border border-[#d1d9e6] bg-white/70 text-[#2d3748] outline-none focus:border-indigo-400 text-sm font-mono"
                        />
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="rounded-xl overflow-hidden border border-[#d1d9e6]">
                      <p className="text-xs font-semibold text-[#6b7280] px-3 py-2 bg-white/50 border-b border-[#d1d9e6]">Preview Preloader</p>
                      <div
                        className="flex flex-col items-center justify-center py-8 gap-4"
                        style={{ backgroundColor: preloaderBgColor }}
                      >
                        <p className="text-white/80 text-xs tracking-widest uppercase font-semibold" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                          {preloaderLogoText}
                        </p>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 2600 5800"
                          width="32"
                          height="72"
                          stroke="#ededed"
                          strokeWidth="50"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d={ROSE_PATH} strokeDasharray="8000" strokeDashoffset="0" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={savePreloaderSettings}
                    disabled={isSavingPreloader}
                    className="px-6 py-3 neu-btn rounded-xl font-bold text-indigo-600 disabled:opacity-50"
                  >
                    {isSavingPreloader ? 'Menyimpan...' : 'Simpan Preloader'}
                  </motion.button>
                </div>
              </div>
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
              className="bg-[#e0e5ec] neu-raised-lg rounded-3xl w-full max-w-md p-6 border border-[#d1d9e6]"
            >
              <h3 className="text-xl font-bold text-[#2d3748] mb-6">Tambah Member Baru</h3>
              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={newMember.whatsapp}
                    onChange={(e) => setNewMember({ ...newMember, whatsapp: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={newMember.password}
                    onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credit Points Awal</label>
                  <input
                    type="number"
                    value={newMember.creditPoints}
                    onChange={(e) => setNewMember({ ...newMember, creditPoints: parseInt(e.target.value) || 0 })}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none"
                  />
                </div>
                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer p-3 border border-purple-100 rounded-xl bg-purple-50/50">
                    <input
                      type="checkbox"
                      checked={newMember.landingPageEnabled}
                      onChange={(e) => setNewMember({ ...newMember, landingPageEnabled: e.target.checked })}
                      className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500 border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-700">Aktifkan Landing Page Custom u/ Member</span>
                  </label>
                </div>
                {newMember.landingPageEnabled && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tema Landing Page</label>
                      <select
                        value={newMember.landingPageTheme}
                        onChange={(e) => setNewMember({ ...newMember, landingPageTheme: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none"
                      >
                        <option value="default">Default (Premium DearMyLove clone)</option>
                        <option value="neumorphism">Neumorphism (Klasik)</option>
                      </select>
                    </div>
                    {/* Pricing Packages */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Paket Harga (Pricing)</label>
                      <div className="space-y-3">
                        {newMemberPricing.map((pkg, idx) => (
                          <div key={pkg.id} className={`border border-gray-200 rounded-xl p-3 space-y-2 transition-all ${!pkg.enabled ? 'opacity-50' : ''}`}>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-gray-600">Paket {idx + 1}: {pkg.name}</span>
                              <button type="button" onClick={() => {
                                const updated = [...newMemberPricing]
                                updated[idx].enabled = !updated[idx].enabled
                                setNewMemberPricing(updated)
                              }} className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${pkg.enabled ? 'bg-teal-500' : 'bg-gray-300'}`}>
                                <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${pkg.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                              </button>
                            </div>
                            <div className="flex gap-2">
                              <input type="text" placeholder="Nama" value={pkg.name} disabled={!pkg.enabled}
                                onChange={(e) => { const u=[...newMemberPricing]; u[idx].name=e.target.value; setNewMemberPricing(u) }}
                                className="flex-1 text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none" />
                              <input type="text" placeholder="Harga" value={pkg.price} disabled={!pkg.enabled}
                                onChange={(e) => { const u=[...newMemberPricing]; u[idx].price=e.target.value; setNewMemberPricing(u) }}
                                className="flex-1 text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none" />
                            </div>
                            <textarea placeholder="Fitur (pisahkan enter)" value={pkg.features} rows={2} disabled={!pkg.enabled}
                              onChange={(e) => { const u=[...newMemberPricing]; u[idx].features=e.target.value; setNewMemberPricing(u) }}
                              className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none resize-none" />
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
                    className="flex-1 py-3 neu-btn rounded-xl font-medium text-[#6b7280]"
                  >
                    Batal
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 py-3 neu-pressed text-purple-600 rounded-xl font-bold"
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
              className="bg-[#e0e5ec] neu-raised-lg rounded-3xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto border border-[#d1d9e6]"
            >
              <h3 className="text-xl font-bold text-[#2d3748] mb-6">Edit Member</h3>
              <form onSubmit={handleEditMember} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                  <input
                    type="text"
                    value={editMemberForm.name}
                    onChange={(e) => setEditMemberForm({ ...editMemberForm, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editMemberForm.email}
                    onChange={(e) => setEditMemberForm({ ...editMemberForm, email: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={editMemberForm.whatsapp}
                    onChange={(e) => setEditMemberForm({ ...editMemberForm, whatsapp: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru (Opsional)</label>
                  <input
                    type="password"
                    value={editMemberForm.password}
                    onChange={(e) => setEditMemberForm({ ...editMemberForm, password: e.target.value })}
                    placeholder="Biarkan kosong jika tidak ingin mengubah password"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editMemberForm.status}
                    onChange={(e) => setEditMemberForm({ ...editMemberForm, status: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credit Points</label>
                  <input
                    type="number"
                    value={editMemberForm.creditPoints}
                    onChange={(e) => setEditMemberForm({ ...editMemberForm, creditPoints: parseInt(e.target.value) || 0 })}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:outline-none"
                  />
                </div>
                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer p-3 border border-indigo-100 rounded-xl bg-indigo-50/50">
                    <input
                      type="checkbox"
                      checked={editMemberForm.landingPageEnabled}
                      onChange={(e) => setEditMemberForm({ ...editMemberForm, landingPageEnabled: e.target.checked })}
                      className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-700">Aktifkan Landing Page Custom u/ Member</span>
                  </label>
                </div>
                {editMemberForm.landingPageEnabled && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tema Landing Page</label>
                      <select
                        value={editMemberForm.landingPageTheme}
                        onChange={(e) => setEditMemberForm({ ...editMemberForm, landingPageTheme: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:outline-none"
                      >
                        <option value="default">Default (Premium DearMyLove clone)</option>
                        <option value="neumorphism">Neumorphism (Klasik)</option>
                      </select>
                    </div>
                    {/* Pricing Packages */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Paket Harga (Pricing)</label>
                      <div className="space-y-3">
                        {editMemberPricing.map((pkg, idx) => (
                          <div key={pkg.id} className={`border border-gray-200 rounded-xl p-3 space-y-2 transition-all ${!pkg.enabled ? 'opacity-50' : ''}`}>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-gray-600">Paket {idx + 1}: {pkg.name}</span>
                              <button type="button" onClick={() => {
                                const updated = [...editMemberPricing]
                                updated[idx].enabled = !updated[idx].enabled
                                setEditMemberPricing(updated)
                              }} className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${pkg.enabled ? 'bg-teal-500' : 'bg-gray-300'}`}>
                                <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${pkg.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                              </button>
                            </div>
                            <div className="flex gap-2">
                              <input type="text" placeholder="Nama" value={pkg.name} disabled={!pkg.enabled}
                                onChange={(e) => { const u=[...editMemberPricing]; u[idx].name=e.target.value; setEditMemberPricing(u) }}
                                className="flex-1 text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none" />
                              <input type="text" placeholder="Harga" value={pkg.price} disabled={!pkg.enabled}
                                onChange={(e) => { const u=[...editMemberPricing]; u[idx].price=e.target.value; setEditMemberPricing(u) }}
                                className="flex-1 text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none" />
                            </div>
                            <textarea placeholder="Fitur (pisahkan enter)" value={pkg.features} rows={2} disabled={!pkg.enabled}
                              onChange={(e) => { const u=[...editMemberPricing]; u[idx].features=e.target.value; setEditMemberPricing(u) }}
                              className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none resize-none" />
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
                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-700 transition-colors"
                  >
                    Batal
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-indigo-400 to-purple-500 text-white rounded-xl font-medium"
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
              className="bg-[#e0e5ec] neu-raised-lg rounded-3xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto border border-[#d1d9e6]"
            >
              <h3 className="text-xl font-bold text-[#2d3748] mb-6">Tambah Undangan Baru</h3>
              <form onSubmit={handleAddInvitation} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                  <input
                    type="text"
                    value={newInvitation.title}
                    onChange={(e) => setNewInvitation({ ...newInvitation, title: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Event</label>
                  <input
                    type="text"
                    value={newInvitation.eventName}
                    onChange={(e) => setNewInvitation({ ...newInvitation, eventName: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Event</label>
                  <input
                    type="date"
                    value={newInvitation.eventDate}
                    onChange={(e) => setNewInvitation({ ...newInvitation, eventDate: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                  <input
                    type="text"
                    value={newInvitation.location}
                    onChange={(e) => setNewInvitation({ ...newInvitation, location: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link Undangan</label>
                  <input
                    type="url"
                    value={newInvitation.invitationLink}
                    onChange={(e) => setNewInvitation({ ...newInvitation, invitationLink: e.target.value })}
                    placeholder="https://satumomen.com/app/kirim/xxx atau https://id.akainvitation.com/xxx"
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Support: satumomen.com, id.akainvitation.com</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost Points</label>
                  <input
                    type="number"
                    value={newInvitation.costPoints}
                    onChange={(e) => setNewInvitation({ ...newInvitation, costPoints: parseInt(e.target.value) || 20 })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign ke Member</label>
                  <select
                    value={newInvitation.assignedMemberId}
                    onChange={(e) => setNewInvitation({ ...newInvitation, assignedMemberId: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none"
                  >
                    <option value="">Pilih Member</option>
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} ({member.email}) - {member.creditPoints} coin
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Template Pesan Default</label>
                  <textarea
                    value={newInvitation.templateMessage}
                    onChange={(e) => setNewInvitation({ ...newInvitation, templateMessage: e.target.value })}
                    rows={6}
                    placeholder="Kepada Yth. Bapak/Ibu/Saudara/i *{nama_tamu}* _di tempat_..."
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Placeholder: {`{nama_tamu}, {link_undangan}, {event_name}, {event_date}, {location}`}</p>
                </div>
                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowAddInvitationModal(false)}
                    className="flex-1 py-3 neu-btn rounded-xl font-medium text-[#6b7280]"
                  >
                    Batal
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 py-3 neu-pressed text-pink-600 rounded-xl font-bold"
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
            className="neu-raised-lg rounded-3xl overflow-hidden"
          >
            <div className="p-6 border-b border-[#d1d9e6]">
              <h2 className="text-xl font-bold text-[#2d3748]">Kelola Template Undangan</h2>
              <p className="text-sm text-[#6b7280] mt-1">Edit template undangan yang tersedia untuk member</p>
            </div>
            <div className="p-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {templates.map((template) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="neu-btn rounded-2xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${template.accent} flex items-center justify-center`}>
                        <Palette className="w-6 h-6 text-white" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        template.category === 'Pernikahan'
                          ? 'bg-pink-100 text-pink-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {template.category}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-800 mb-2">{template.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="text-xs text-gray-500">
                        <strong>Hero Label:</strong> {template.heroLabel}
                      </div>
                      <div className="text-xs text-gray-500">
                        <strong>Hero Line:</strong> {template.heroLine}
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openEditTemplateModal(template)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 neu-pressed text-teal-600 rounded-xl font-bold"
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
              className="bg-[#e0e5ec] neu-raised-lg rounded-3xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto border border-[#d1d9e6]"
            >
              <h3 className="text-xl font-bold text-[#2d3748] mb-6">Edit Template</h3>
              <form onSubmit={handleEditTemplate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Template</label>
                    <input
                      type="text"
                      value={editTemplateForm.title}
                      onChange={(e) => setEditTemplateForm({ ...editTemplateForm, title: e.target.value })}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                    <select
                      value={editTemplateForm.category}
                      onChange={(e) => setEditTemplateForm({ ...editTemplateForm, category: e.target.value as 'Pernikahan' | 'Ultah' })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:outline-none"
                    >
                      <option value="Pernikahan">Pernikahan</option>
                      <option value="Ultah">Ultah</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Accent Color (Tailwind Classes)</label>
                  <input
                    type="text"
                    value={editTemplateForm.accent}
                    onChange={(e) => setEditTemplateForm({ ...editTemplateForm, accent: e.target.value })}
                    placeholder="from-pink-300 to-yellow-200"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <textarea
                    value={editTemplateForm.description}
                    onChange={(e) => setEditTemplateForm({ ...editTemplateForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hero Label</label>
                    <input
                      type="text"
                      value={editTemplateForm.heroLabel}
                      onChange={(e) => setEditTemplateForm({ ...editTemplateForm, heroLabel: e.target.value })}
                      placeholder="Dengan Kebanggaan"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hero Line</label>
                    <input
                      type="text"
                      value={editTemplateForm.heroLine}
                      onChange={(e) => setEditTemplateForm({ ...editTemplateForm, heroLine: e.target.value })}
                      placeholder="Bersama segenap keluarga kami"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default Message</label>
                  <textarea
                    value={editTemplateForm.defaultMessage}
                    onChange={(e) => setEditTemplateForm({ ...editTemplateForm, defaultMessage: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:outline-none resize-none"
                    placeholder="Kepada Yth. Bapak/Ibu/Saudara/i *{nama_tamu}*..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowEditTemplateModal(false)}
                    className="flex-1 py-3 neu-btn rounded-xl font-medium text-[#6b7280]"
                  >
                    Batal
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 py-3 neu-pressed text-teal-600 rounded-xl font-bold"
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
