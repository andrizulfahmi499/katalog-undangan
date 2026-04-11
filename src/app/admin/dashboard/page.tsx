'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Mail, CreditCard, LogOut, Plus, Edit, Trash2, ArrowLeft } from 'lucide-react'

type Member = {
  id: string
  name: string
  email: string
  whatsapp: string
  creditPoints: number
  status: string
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
  const [activeTab, setActiveTab] = useState<'members' | 'invitations'>('members')
  const [members, setMembers] = useState<Member[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [isLoading, setIsLoading] = useState(true)
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
    status: 'active'
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
  })

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
  }, [])

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
      const response = await fetch('/api/admin/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember),
      })

      const data = await response.json()

      if (data.success) {
        fetchMembers()
        setShowAddMemberModal(false)
        setNewMember({ name: '', email: '', whatsapp: '', password: '', creditPoints: 0 })
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
      status: member.status || 'active'
    })
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
        status: editMemberForm.status
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
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
              <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = '/admin/editor'}
                className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-200/50 transition hover:bg-sky-700"
              >
                <Plus className="w-4 h-4" />
                Buat Undangan
              </motion.button>
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
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Member</p>
                <p className="text-3xl font-bold text-gray-800">{members.length}</p>
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
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
                <Mail className="w-7 h-7 text-white" />
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
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-6 shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <CreditCard className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Credit Terpakai</p>
                <p className="text-3xl font-bold text-gray-800">
                  {invitations.reduce((sum, inv) => sum + inv.costPoints, 0)} coin
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('members')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'members'
                ? 'bg-gradient-to-r from-purple-400 to-indigo-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
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
                ? 'bg-gradient-to-r from-pink-400 to-rose-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Invitations
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
              className="bg-white rounded-3xl shadow-xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Daftar Member</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddMemberModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-400 to-indigo-500 text-white rounded-xl font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Tambah Member
                </motion.button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
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
              className="bg-white rounded-3xl shadow-xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Daftar Undangan</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddInvitationModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-400 to-rose-500 text-white rounded-xl font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Tambah Undangan
                </motion.button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
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
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteInvitation(invitation.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus Undangan"
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
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
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6">Tambah Member Baru</h3>
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
                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowAddMemberModal(false)}
                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-700 transition-colors"
                  >
                    Batal
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-purple-400 to-indigo-500 text-white rounded-xl font-medium"
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
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6">Edit Member</h3>
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
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6">Tambah Undangan Baru</h3>
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
                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-700 transition-colors"
                  >
                    Batal
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-pink-400 to-rose-500 text-white rounded-xl font-medium"
                  >
                    Simpan
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
