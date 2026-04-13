'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, LogOut, Send, MessageCircle, Users, CreditCard, Clock, CheckCircle, XCircle, Copy, Link as LinkIcon, Phone } from 'lucide-react'

type Invitation = {
  id: string
  title: string
  eventName: string
  eventDate: string
  location: string
  invitationLink: string
  invitationDomain: string
  templateMessage: string
  costPoints: number
  status: string
  invitationMessages: Array<{
    id: string
    messageTemplate: string
  }>
  invitationSends: Array<{
    id: string
    guestName: string
    sentAt: string
    status: string
  }>
}

type Guest = {
  name: string
  whatsapp?: string
  email?: string
}

export default function MemberDashboard() {
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null)
  const [customMessage, setCustomMessage] = useState('')
  const [guests, setGuests] = useState<Guest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sendResults, setSendResults] = useState<any[]>([])
  const [showSendModal, setShowSendModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'invitations' | 'history' | 'landing_page'>('invitations')
  const [copiedLinks, setCopiedLinks] = useState<Record<number, boolean>>({})
  const [memberProfile, setMemberProfile] = useState<any>(null)
  
  // Landing Page Settings State
  const [lpSlug, setLpSlug] = useState('')
  const [lpConfig, setLpConfig] = useState<any>({
    logoUrl: '',
    address: '',
    whatsappNumber: '',
    socialMedia: '',
    themeColor: 'pink',
    pricingPackages: [
      { id: 1, name: 'Basic', price: '150.000', features: 'Masa aktif selamanya\nTanpa Batas Tamu\nGallery Foto Bebas' },
      { id: 2, name: 'Premium', price: '300.000', features: 'Masa aktif selamanya\nTanpa Batas Tamu\nVideo Undangan Lengkap\nFilter Instagram' },
      { id: 3, name: 'Exclusive', price: '500.000', features: 'Masa aktif selamanya\nBebas Custom\nCustom Domain Pilihan\nDesain Sesuai Keinginan' }
    ]
  })
  const [isSavingLp, setIsSavingLp] = useState(false)

  // Get member ID from localStorage
  const [memberId, setMemberId] = useState<string>('')

  useEffect(() => {
    // Get member ID from localStorage
    const storedMemberId = localStorage.getItem('memberId')
    if (storedMemberId) {
      setMemberId(storedMemberId)
    } else {
      // Redirect to login if no member ID found
      window.location.href = '/login'
    }
  }, [])

  useEffect(() => {
    if (memberId) {
      fetchInvitations()
      fetchProfile()
    }
  }, [memberId])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/member/profile?memberId=${memberId}&_t=${Date.now()}`)
      const data = await response.json()
      if (data.success) {
        setMemberProfile(data.data)
        if (data.data.landingPageConfig) {
          setLpConfig(data.data.landingPageConfig)
        }
        if (data.data.customSlug) {
          setLpSlug(data.data.customSlug)
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const handleSaveLandingPage = async () => {
    setIsSavingLp(true)
    try {
      const response = await fetch('/api/member/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId,
          customSlug: lpSlug,
          landingPageConfig: lpConfig
        })
      })
      const data = await response.json()
      if (data.success) {
        alert('Pengaturan Landing Page berhasil disimpan!')
        fetchProfile()
      } else {
        alert(data.error || 'Gagal menyimpan pengaturan')
      }
    } catch (error) {
      console.error('Error saving landing page:', error)
      alert('Terjadi kesalahan')
    } finally {
      setIsSavingLp(false)
    }
  }

  const fetchInvitations = async () => {
    try {
      const response = await fetch(`/api/member/invitations?memberId=${memberId}&_t=${Date.now()}`, {
        cache: 'no-store',
      })
      const data = await response.json()
      if (data.success) {
        setInvitations(data.data)
      }
    } catch (error) {
      console.error('Error fetching invitations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectInvitation = (invitation: Invitation) => {
    setSelectedInvitation(invitation)
    setCustomMessage(
      invitation.invitationMessages[0]?.messageTemplate || invitation.templateMessage
    )
    setGuests([])
    setShowSendModal(true)
  }

  const handleSaveCustomMessage = async () => {
    if (!selectedInvitation) return

    try {
      const response = await fetch('/api/member/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId,
          invitationId: selectedInvitation.id,
          messageTemplate: customMessage,
        }),
      })

      if (response.ok) {
        alert('Template pesan berhasil disimpan!')
        fetchInvitations()
      }
    } catch (error) {
      console.error('Error saving message template:', error)
      alert('Gagal menyimpan template pesan')
    }
  }

  const handleAddGuest = () => {
    setGuests([...guests, { name: '' }])
  }

  const handleGuestChange = (index: number, field: keyof Guest, value: string) => {
    const updated = [...guests]
    updated[index][field] = value
    setGuests(updated)
  }

  const handleRemoveGuest = (index: number) => {
    setGuests(guests.filter((_, i) => i !== index))
  }

  // Generate invitation link with guest name
  const generateGuestLink = (guestName: string, invitationLink: string): string => {
    if (!guestName.trim()) return invitationLink

    const normalizedLink = invitationLink.startsWith('/') ? `${window.location.origin}${invitationLink}` : invitationLink
    const paramName = invitationLink.includes('satumomen.com') ? 'guest' : 'to'
    const separator = normalizedLink.includes('?') ? '&' : '?'
    const encodedName = encodeURIComponent(guestName.trim())

    return `${normalizedLink}${separator}${paramName}=${encodedName}`
  }

  // Copy link to clipboard
  const handleCopyLink = async (guestIndex: number, link: string) => {
    try {
      await navigator.clipboard.writeText(link)
      setCopiedLinks({ ...copiedLinks, [guestIndex]: true })
      setTimeout(() => {
        setCopiedLinks({ ...copiedLinks, [guestIndex]: false })
      }, 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
      alert('Gagal menyalin link. Silakan coba lagi.')
    }
  }

  // Generate message with placeholders replaced
  const generateWhatsAppMessage = (guestName: string, invitationLink: string): string => {
    const guestLink = generateGuestLink(guestName, invitationLink)
    const eventDate = selectedInvitation
      ? new Date(selectedInvitation.eventDate).toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : ''

    let message = customMessage
      .replace(/{nama_tamu}/gi, guestName.trim())
      .replace(/{link_undangan}/gi, guestLink)
      .replace(/{event_name}/gi, selectedInvitation?.eventName || '')
      .replace(/{event_date}/gi, eventDate)
      .replace(/{location}/gi, selectedInvitation?.location || '')

    return message
  }

  // Send via WhatsApp - redirect to WhatsApp API
  const handleSendWhatsApp = (guestIndex: number) => {
    const guest = guests[guestIndex]
    if (!guest || !guest.name.trim()) {
      alert('Mohon isi nama tamu terlebih dahulu')
      return
    }

    if (!selectedInvitation) {
      alert('Undangan tidak ditemukan')
      return
    }

    let phoneNumber = guest.whatsapp?.trim() || ''

    // Format phone number to international format
    if (phoneNumber) {
      // Remove all non-numeric characters
      phoneNumber = phoneNumber.replace(/\D/g, '')

      // If starts with 0, replace with 62
      if (phoneNumber.startsWith('0')) {
        phoneNumber = '62' + phoneNumber.slice(1)
      }

      // If doesn't start with 62, add 62
      if (!phoneNumber.startsWith('62')) {
        phoneNumber = '62' + phoneNumber
      }
    } else {
      alert('Mohon isi nomor WhatsApp tamu')
      return
    }

    const message = generateWhatsAppMessage(guest.name, selectedInvitation.invitationLink)
    const encodedMessage = encodeURIComponent(message)

    // Redirect to WhatsApp API
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  const handleLogout = () => {
    // Clear member data from localStorage
    localStorage.removeItem('memberId')
    localStorage.removeItem('memberName')
    localStorage.removeItem('memberEmail')
    window.location.href = '/login'
  }

  const totalSent = invitations.reduce((sum, inv) => sum + inv.invitationSends.length, 0)
  const totalCreditUsed = invitations.reduce((sum, inv) => sum + inv.costPoints, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ x: -3 }}
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Kembali</span>
              </motion.button>
              <h1 className="text-2xl font-bold text-gray-800">Member Dashboard</h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-gray-700 font-medium"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </motion.button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Undangan</p>
                <p className="text-3xl font-bold text-gray-800">{invitations.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-6 shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center">
                <Send className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Dikirim</p>
                <p className="text-3xl font-bold text-gray-800">{totalSent}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-6 shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <CreditCard className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Credit Terpakai</p>
                <p className="text-3xl font-bold text-gray-800">{totalCreditUsed} coin</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('invitations')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'invitations'
                ? 'bg-gradient-to-r from-pink-400 to-rose-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Undangan
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-purple-400 to-indigo-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Riwayat Pengiriman
          </motion.button>
          {memberProfile?.landingPageEnabled && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('landing_page')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'landing_page'
                  ? 'bg-gradient-to-r from-teal-400 to-emerald-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Pengaturan Landing Page
            </motion.button>
          )}
        </div>

        {/* Invitations Tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'invitations' && (
            <motion.div
              key="invitations"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {isLoading ? (
                <div className="bg-white rounded-3xl p-12 text-center text-gray-500">
                  Memuat data...
                </div>
              ) : invitations.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center text-gray-500">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">Belum ada undangan yang di-assign ke Anda.</p>
                  <p className="text-sm mt-2">Hubungi admin untuk mendapatkan undangan.</p>
                </div>
              ) : (
                invitations.map((invitation) => (
                  <motion.div
                    key={invitation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-6 shadow-xl"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{invitation.title}</h3>
                        <div className="space-y-1 text-gray-600">
                          <p><span className="font-medium">Event:</span> {invitation.eventName}</p>
                          <p><span className="font-medium">Tanggal:</span> {new Date(invitation.eventDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          <p><span className="font-medium">Lokasi:</span> {invitation.location}</p>
                          <p>
                            <span className="font-medium">Link:</span>{' '}
                            <a
                              href={invitation.invitationLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-pink-600 hover:underline"
                            >
                              {invitation.invitationLink}
                            </a>
                          </p>
                          <p>
                            <span className="font-medium">Status:</span>{' '}
                            <span className={`px-2 py-1 rounded-full text-sm ${
                              invitation.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {invitation.status}
                            </span>
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSelectInvitation(invitation)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-400 to-rose-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                      >
                        <Send className="w-5 h-5" />
                        Kirim Undangan
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">Riwayat Pengiriman</h2>
              </div>
              {totalSent === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">Belum ada riwayat pengiriman.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Nama Tamu</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Undangan</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Tanggal Kirim</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invitations.flatMap((inv) =>
                        inv.invitationSends.map((send) => (
                          <tr key={send.id} className="border-t border-gray-100 hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-800">{send.guestName}</td>
                            <td className="px-6 py-4 text-gray-600">{inv.title}</td>
                            <td className="px-6 py-4 text-gray-600">
                              {new Date(send.sentAt).toLocaleString('id-ID')}
                            </td>
                            <td className="px-6 py-4">
                              {send.status === 'sent' ? (
                                <span className="flex items-center gap-2 text-green-600">
                                  <CheckCircle className="w-4 h-4" />
                                  Terkirim
                                </span>
                              ) : (
                                <span className="flex items-center gap-2 text-red-600">
                                  <XCircle className="w-4 h-4" />
                                  Gagal
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {/* Landing Page Settings Tab */}
          {activeTab === 'landing_page' && memberProfile?.landingPageEnabled && (
            <motion.div
              key="landing_page"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden p-6"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-6">Pengaturan Custom Landing Page</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Custom Slug Profil (URL)</label>
                    <div className="flex items-center gap-2">
                       <span className="text-gray-500 bg-gray-100 px-3 py-2 rounded-xl text-sm border border-gray-200">
                         {typeof window !== 'undefined' ? window.location.host : '...'} /
                       </span>
                       <input 
                         type="text" 
                         value={lpSlug}
                         onChange={(e) => setLpSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                         placeholder="nama-kamu"
                         className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-teal-400 focus:outline-none"
                       />
                    </div>
                    {lpSlug && (
                      <p className="text-xs text-green-600 mt-2">
                        Landing page Anda dapat diakses di: <a href={`/${lpSlug}`} target="_blank" rel="noreferrer" className="underline font-bold">/{lpSlug}</a>
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL (opsional)</label>
                    <input 
                      type="text" 
                      value={lpConfig.logoUrl}
                      onChange={(e) => setLpConfig({...lpConfig, logoUrl: e.target.value})}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-teal-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Warna Tema</label>
                    <select 
                      value={lpConfig.themeColor}
                      onChange={(e) => setLpConfig({...lpConfig, themeColor: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-teal-400 focus:outline-none"
                    >
                      <option value="pink">Pink (Default)</option>
                      <option value="purple">Purple</option>
                      <option value="indigo">Indigo</option>
                      <option value="teal">Teal</option>
                      <option value="amber">Gold / Amber</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nomor WhatsApp Bisnis</label>
                    <input 
                      type="text" 
                      value={lpConfig.whatsappNumber}
                      onChange={(e) => setLpConfig({...lpConfig, whatsappNumber: e.target.value})}
                      placeholder="62812345678"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-teal-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi / Alamat Lengkap</label>
                    <textarea 
                      value={lpConfig.address}
                      onChange={(e) => setLpConfig({...lpConfig, address: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-teal-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Link Sosial Media (Instagram/dll)</label>
                    <input 
                      type="text" 
                      value={lpConfig.socialMedia}
                      onChange={(e) => setLpConfig({...lpConfig, socialMedia: e.target.value})}
                      placeholder="https://instagram.com/akun"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-teal-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                   <h3 className="text-lg font-semibold text-gray-800">Paket Harga (Pricing)</h3>
                   <p className="text-sm text-gray-600 mb-4">Ubah nama paket, harga, dan fitur (pisahkan dengan baris baru / Enter).</p>
                   {lpConfig.pricingPackages?.map((pkg: any, index: number) => (
                     <div key={pkg.id} className="bg-gray-50 border border-gray-200 p-4 rounded-2xl space-y-3">
                        <div className="flex gap-2">
                           <div className="flex-1">
                             <label className="text-xs font-semibold text-gray-500">Nama Paket</label>
                             <input type="text" value={pkg.name} onChange={(e) => {
                               const newPkgs = [...lpConfig.pricingPackages];
                               newPkgs[index].name = e.target.value;
                               setLpConfig({...lpConfig, pricingPackages: newPkgs});
                             }} className="w-full text-sm py-1 px-2 border border-gray-300 rounded" />
                           </div>
                           <div className="flex-1">
                             <label className="text-xs font-semibold text-gray-500">Harga (Rp)</label>
                             <input type="text" value={pkg.price} onChange={(e) => {
                               const newPkgs = [...lpConfig.pricingPackages];
                               newPkgs[index].price = e.target.value;
                               setLpConfig({...lpConfig, pricingPackages: newPkgs});
                             }} className="w-full text-sm py-1 px-2 border border-gray-300 rounded" />
                           </div>
                        </div>
                        <div>
                           <label className="text-xs font-semibold text-gray-500">Fitur (pisahkan enter)</label>
                           <textarea value={pkg.features} rows={3} onChange={(e) => {
                               const newPkgs = [...lpConfig.pricingPackages];
                               newPkgs[index].features = e.target.value;
                               setLpConfig({...lpConfig, pricingPackages: newPkgs});
                           }} className="w-full text-sm py-1 px-2 border border-gray-300 rounded text-xs" />
                        </div>
                     </div>
                   ))}

                   <motion.button
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     onClick={handleSaveLandingPage}
                     disabled={isSavingLp}
                     className="w-full py-4 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-bold shadow-lg disabled:opacity-70 transition-colors"
                   >
                     {isSavingLp ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}
                   </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Send Modal */}
      <AnimatePresence>
        {showSendModal && selectedInvitation && (
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
              className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6">Kirim Undangan</h3>

              {/* Invitation Info */}
              <div className="bg-pink-50 rounded-2xl p-4 mb-6">
                <h4 className="font-bold text-gray-800">{selectedInvitation.title}</h4>
                <p className="text-sm text-gray-600">{selectedInvitation.eventName} • {new Date(selectedInvitation.eventDate).toLocaleDateString('id-ID')}</p>
                <p className="text-xs text-gray-500 mt-1">{selectedInvitation.invitationLink}</p>
              </div>

              {/* Custom Message Template */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Edit Template Pesan</label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">Placeholder: {`{nama_tamu}, {link_undangan}, {event_name}, {event_date}, {location}`}</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveCustomMessage}
                  className="mt-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl font-medium text-sm transition-colors"
                >
                  Simpan Template
                </motion.button>
              </div>

              {/* Guest List */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Daftar Tamu</label>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddGuest}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-400 to-rose-500 text-white rounded-xl font-medium text-sm"
                  >
                    <Users className="w-4 h-4" />
                    Tambah Tamu
                  </motion.button>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {guests.map((guest, index) => {
                    const guestLink = selectedInvitation
                      ? generateGuestLink(guest.name, selectedInvitation.invitationLink)
                      : ''
                    const isLinkGenerated = guest.name.trim() && guestLink !== selectedInvitation?.invitationLink

                    return (
                      <div key={index} className="bg-gray-50 rounded-2xl p-4 space-y-3">
                        {/* Guest Name & WhatsApp */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Nama Tamu</label>
                            <input
                              type="text"
                              value={guest.name}
                              onChange={(e) => handleGuestChange(index, 'name', e.target.value)}
                              placeholder="Masukkan nama tamu"
                              className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">WhatsApp *</label>
                            <input
                              type="text"
                              value={guest.whatsapp || ''}
                              onChange={(e) => handleGuestChange(index, 'whatsapp', e.target.value)}
                              placeholder="08xxxxxxxxxx"
                              className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none text-sm"
                            />
                          </div>
                        </div>

                        {/* Generated Link */}
                        {isLinkGenerated && (
                          <div className="bg-white rounded-xl p-3 border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                              <LinkIcon className="w-4 h-4 text-pink-500" />
                              <span className="text-xs font-medium text-gray-700">Link Undangan dengan Nama:</span>
                            </div>
                            <div className="flex gap-2">
                              <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-600 break-all">
                                {guestLink}
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleCopyLink(index, guestLink)}
                                className="px-3 py-2 bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                              >
                                {copiedLinks[index] ? (
                                  <>
                                    <CheckCircle className="w-3 h-3" />
                                    Disalin!
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    Salin
                                  </>
                                )}
                              </motion.button>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSendWhatsApp(index)}
                            disabled={!guest.name.trim() || !guest.whatsapp?.trim()}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Phone className="w-4 h-4" />
                            Kirim ke WhatsApp
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleRemoveGuest(index)}
                            className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <XCircle className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </div>
                    )
                  })}
                  {guests.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-2xl">
                      <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm text-gray-500">Belum ada tamu. Klik "Tambah Tamu" untuk menambah.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowSendModal(false)
                    setSelectedInvitation(null)
                    setGuests([])
                    setCopiedLinks({})
                  }}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-700 transition-colors"
                >
                  Tutup
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
