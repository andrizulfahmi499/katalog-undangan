'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Package, Users, Ticket, CreditCard, Plus, Pencil, Trash2,
  Loader2, Save, X, ArrowLeft, ToggleLeft, ToggleRight,
  CheckCircle, Star, Copy
} from 'lucide-react'

type Tab = 'packages' | 'coupons' | 'customers' | 'transactions'

export default function V2PackagesPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('packages')
  const [isLoading, setIsLoading] = useState(true)

  // Check admin auth
  useEffect(() => {
    const adminId = localStorage.getItem('adminId')
    if (!adminId) { router.push('/login'); return }
    setIsLoading(false)
  }, [])

  if (isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-gray-500" /></div>

  const tabs = [
    { id: 'packages' as Tab, label: 'Paket', icon: Package },
    { id: 'coupons' as Tab, label: 'Kupon', icon: Ticket },
    { id: 'customers' as Tab, label: 'Customer', icon: Users },
    { id: 'transactions' as Tab, label: 'Transaksi', icon: CreditCard },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => router.push('/admin/dashboard')} className="text-gray-500 hover:text-gray-800">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Paket & Transaksi v2</h1>
              <p className="text-sm text-gray-500">Kelola paket undangan, kupon, dan customer</p>
            </div>
          </div>
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === t.id ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {tab === 'packages' && <PackagesTab />}
        {tab === 'coupons' && <CouponsTab />}
        {tab === 'customers' && <CustomersTab />}
        {tab === 'transactions' && <TransactionsTab />}
      </div>
    </div>
  )
}

// ── Packages Tab ──────────────────────────────────────────────
function PackagesTab() {
  const [packages, setPackages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any>(null)
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => { load() }, [])

  const load = async () => {
    const res = await fetch('/api/admin/v2-packages')
    const data = await res.json()
    setPackages(data.data || [])
    setLoading(false)
  }

  const handleSave = async (pkg: any) => {
    const isNew = !pkg.id
    const res = await fetch('/api/admin/v2-packages', {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isNew ? pkg : { id: pkg.id, ...pkg }),
    })
    if (res.ok) {
      setEditing(null)
      setShowAdd(false)
      load()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus paket ini?')) return
    await fetch('/api/admin/v2-packages', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    load()
  }

  const toggleActive = async (pkg: any) => {
    await fetch('/api/admin/v2-packages', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: pkg.id, isActive: !pkg.isActive }),
    })
    load()
  }

  if (loading) return <Loader2 className="w-5 h-5 animate-spin" />

  const formatRp = (n: number) => `Rp ${new Intl.NumberFormat('id-ID').format(n)}`

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Daftar Paket</h2>
        <button onClick={() => setShowAdd(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-green-700">
          <Plus className="w-4 h-4" /> Tambah Paket
        </button>
      </div>

      <div className="grid gap-4">
        {packages.map(pkg => (
          <div key={pkg.id} className={`bg-white rounded-xl border p-5 ${!pkg.isActive ? 'opacity-50' : ''}`}>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">{pkg.name}</h3>
                  {pkg.popular && <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">Populer</span>}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${pkg.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {pkg.isActive ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-1">{pkg.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-gray-400 line-through text-sm">{formatRp(pkg.regularPrice)}</span>
                  <span className="text-green-700 font-bold text-lg">{formatRp(pkg.promoPrice)}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {(pkg.features as string[] || []).map((f: string, i: number) => (
                    <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{f}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleActive(pkg)} className="p-2 text-gray-400 hover:text-gray-600">
                  {pkg.isActive ? <ToggleRight className="w-5 h-5 text-green-600" /> : <ToggleLeft className="w-5 h-5" />}
                </button>
                <button onClick={() => setEditing(pkg)} className="p-2 text-gray-400 hover:text-blue-600"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(pkg.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {(showAdd || editing) && (
        <PackageForm
          initial={editing || { slug: '', name: '', description: '', regularPrice: 0, promoPrice: 0, features: [], popular: false, isActive: true, sortOrder: 0 }}
          onSave={handleSave}
          onClose={() => { setEditing(null); setShowAdd(false) }}
        />
      )}
    </div>
  )
}

function PackageForm({ initial, onSave, onClose }: { initial: any; onSave: (p: any) => void; onClose: () => void }) {
  const [pkg, setPkg] = useState(initial)
  const [featuresText, setFeaturesText] = useState((initial.features || []).join('\n'))

  const handleSave = () => {
    const features = featuresText.split('\n').filter((f: string) => f.trim())
    onSave({ ...pkg, features })
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">{pkg.id ? 'Edit Paket' : 'Tambah Paket'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700">Slug</label>
            <input value={pkg.slug} onChange={e => setPkg({...pkg, slug: e.target.value})} className="w-full border rounded-lg px-3 py-2 mt-1 text-sm" placeholder="e.g. premium" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Nama Paket</label>
            <input value={pkg.name} onChange={e => setPkg({...pkg, name: e.target.value})} className="w-full border rounded-lg px-3 py-2 mt-1 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Deskripsi</label>
            <textarea value={pkg.description || ''} onChange={e => setPkg({...pkg, description: e.target.value})} className="w-full border rounded-lg px-3 py-2 mt-1 text-sm" rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Harga Normal</label>
              <input type="number" value={pkg.regularPrice} onChange={e => setPkg({...pkg, regularPrice: +e.target.value})} className="w-full border rounded-lg px-3 py-2 mt-1 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Harga Promo</label>
              <input type="number" value={pkg.promoPrice} onChange={e => setPkg({...pkg, promoPrice: +e.target.value})} className="w-full border rounded-lg px-3 py-2 mt-1 text-sm" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Fitur (1 per baris)</label>
            <textarea value={featuresText} onChange={e => setFeaturesText(e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1 text-sm font-mono" rows={5} />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={pkg.popular} onChange={e => setPkg({...pkg, popular: e.target.checked})} /> Populer
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={pkg.isActive} onChange={e => setPkg({...pkg, isActive: e.target.checked})} /> Aktif
            </label>
            <div>
              <label className="text-sm font-medium text-gray-700">Urutan</label>
              <input type="number" value={pkg.sortOrder} onChange={e => setPkg({...pkg, sortOrder: +e.target.value})} className="w-16 border rounded-lg px-2 py-1 mt-1 text-sm" />
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={handleSave} className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-green-700"><Save className="w-4 h-4" /> Simpan</button>
          <button onClick={onClose} className="px-6 py-2.5 border rounded-lg text-gray-600 hover:bg-gray-50">Batal</button>
        </div>
      </div>
    </div>
  )
}

// ── Coupons Tab ───────────────────────────────────────────────
function CouponsTab() {
  const [coupons, setCoupons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ code: '', description: '', discountPercent: '', discountAmount: '', maxUses: '100', expiresAt: '' })

  useEffect(() => { load() }, [])

  const load = async () => {
    const res = await fetch('/api/admin/v2-coupons')
    const data = await res.json()
    setCoupons(data.data || [])
    setLoading(false)
  }

  const handleAdd = async () => {
    await fetch('/api/admin/v2-coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        discountPercent: form.discountPercent ? +form.discountPercent : null,
        discountAmount: form.discountAmount ? +form.discountAmount : null,
        maxUses: +form.maxUses,
        expiresAt: form.expiresAt || null,
      }),
    })
    setShowAdd(false)
    setForm({ code: '', description: '', discountPercent: '', discountAmount: '', maxUses: '100', expiresAt: '' })
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus kupon ini?')) return
    await fetch('/api/admin/v2-coupons', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  const toggleActive = async (c: any) => {
    await fetch('/api/admin/v2-coupons', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: c.id, isActive: !c.isActive }) })
    load()
  }

  if (loading) return <Loader2 className="w-5 h-5 animate-spin" />

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Kupon Diskon</h2>
        <button onClick={() => setShowAdd(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-green-700"><Plus className="w-4 h-4" /> Tambah Kupon</button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Kode</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Diskon</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Penggunaan</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Expired</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(c => (
              <tr key={c.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-mono font-bold">{c.code}</td>
                <td className="px-4 py-3">{c.discountPercent ? `${c.discountPercent}%` : `Rp ${new Intl.NumberFormat('id-ID').format(c.discountAmount || 0)}`}</td>
                <td className="px-4 py-3">{c.usedCount}/{c.maxUses}</td>
                <td className="px-4 py-3">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('id-ID') : '-'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{c.isActive ? 'Aktif' : 'Nonaktif'}</span>
                </td>
                <td className="px-4 py-3 flex gap-1 justify-end">
                  <button onClick={() => toggleActive(c)} className="p-1.5 text-gray-400 hover:text-gray-600">{c.isActive ? <ToggleRight className="w-4 h-4 text-green-600" /> : <ToggleLeft className="w-4 h-4" />}</button>
                  <button onClick={() => handleDelete(c.id)} className="p-1.5 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">Belum ada kupon</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Tambah Kupon</h3>
              <button onClick={() => setShowAdd(false)} className="text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Kode Kupon</label>
                <input value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} className="w-full border rounded-lg px-3 py-2 mt-1 text-sm font-mono uppercase" placeholder="NIKAH2025" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Deskripsi</label>
                <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border rounded-lg px-3 py-2 mt-1 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Diskon %</label>
                  <input type="number" value={form.discountPercent} onChange={e => setForm({...form, discountPercent: e.target.value})} className="w-full border rounded-lg px-3 py-2 mt-1 text-sm" placeholder="30" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Atau Nominal</label>
                  <input type="number" value={form.discountAmount} onChange={e => setForm({...form, discountAmount: e.target.value})} className="w-full border rounded-lg px-3 py-2 mt-1 text-sm" placeholder="50000" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Max Penggunaan</label>
                  <input type="number" value={form.maxUses} onChange={e => setForm({...form, maxUses: e.target.value})} className="w-full border rounded-lg px-3 py-2 mt-1 text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Expired</label>
                  <input type="date" value={form.expiresAt} onChange={e => setForm({...form, expiresAt: e.target.value})} className="w-full border rounded-lg px-3 py-2 mt-1 text-sm" />
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={handleAdd} className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700">Simpan</button>
              <button onClick={() => setShowAdd(false)} className="px-6 py-2.5 border rounded-lg text-gray-600">Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Customers Tab ─────────────────────────────────────────────
function CustomersTab() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activating, setActivating] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => { load() }, [])

  const load = async () => {
    const res = await fetch('/api/admin/v2-customers')
    const data = await res.json()
    setCustomers(data.data || [])
    setLoading(false)
  }

  const handleActivate = async (customerId: string, packageType: string) => {
    const adminId = localStorage.getItem('adminId')
    await fetch('/api/admin/v2-customers', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: customerId, packageType, packageStatus: 'paid', activatedBy: adminId, activationNote: 'Manual activation by admin' }),
    })
    setActivating(null)
    load()
  }

  if (loading) return <Loader2 className="w-5 h-5 animate-spin" />

  const filtered = customers.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Daftar Customer ({customers.length})</h2>
        <input value={search} onChange={e => setSearch(e.target.value)} className="border rounded-lg px-3 py-2 text-sm w-64" placeholder="Cari nama atau email..." />
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Nama</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Email</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Role</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Paket</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Undangan</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-gray-500">{c.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${c.role === 'admin' ? 'bg-purple-100 text-purple-700' : c.role === 'member' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{c.role}</span>
                </td>
                <td className="px-4 py-3">{c.packageType || '-'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${c.packageStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{c.packageStatus}</span>
                </td>
                <td className="px-4 py-3">{c._count?.invitations || 0}</td>
                <td className="px-4 py-3 text-right">
                  {c.packageStatus !== 'paid' && (
                    activating === c.id ? (
                      <div className="flex gap-1">
                        <button onClick={() => handleActivate(c.id, 'tanpa_foto')} className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">Tanpa Foto</button>
                        <button onClick={() => handleActivate(c.id, 'dengan_foto')} className="text-xs bg-green-700 text-white px-2 py-1 rounded hover:bg-green-800">Dengan Foto</button>
                        <button onClick={() => setActivating(null)} className="text-xs text-gray-400 px-1"><X className="w-3 h-3" /></button>
                      </div>
                    ) : (
                      <button onClick={() => setActivating(c.id)} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Aktivasi</button>
                    )
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">Belum ada customer</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Transactions Tab ──────────────────────────────────────────
function TransactionsTab() {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/v2-customers')
      .then(r => r.json())
      .then(data => {
        // For now just show customers with payment info
        setPayments(data.data || [])
        setLoading(false)
      })
  }, [])

  if (loading) return <Loader2 className="w-5 h-5 animate-spin" />

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Riwayat Transaksi</h2>
      <div className="bg-white rounded-xl border p-8 text-center text-gray-400">
        <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="text-sm">Transaksi akan muncul setelah customer melakukan pembayaran melalui Mayar.</p>
        <p className="text-xs mt-2">Integrasi Mayar webhook akan menampilkan data di sini secara otomatis.</p>
      </div>
    </div>
  )
}
