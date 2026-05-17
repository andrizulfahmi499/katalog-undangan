import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { X, Upload, Loader2, Plus, Trash2, Link as LinkIcon, Gift } from 'lucide-react'

interface AngpaoData {
  bankName: string
  accountNumber: string
  accountName: string
  qrisImageBase64: string | null
  deliveryAddress: string
}

interface GiftData {
  id: string
  itemName: string
  itemImageBase64: string | null
  buyUrl: string | null
  isClaimed: boolean
  claimedByGuest?: { name: string } | null
}

interface Props {
  invitationId: string
  onClose: () => void
}

export default function QRISGiftModal({ invitationId, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'qris' | 'gift'>('qris')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Angpao State
  const [angpao, setAngpao] = useState<AngpaoData>({
    bankName: '', accountNumber: '', accountName: '', qrisImageBase64: null, deliveryAddress: ''
  })

  // Gift State
  const [gifts, setGifts] = useState<GiftData[]>([])
  const [newGift, setNewGift] = useState({ itemName: '', buyUrl: '', itemImageBase64: '' })
  const [isAddingGift, setIsAddingGift] = useState(false)

  const qrisInputRef = useRef<HTMLInputElement>(null)
  const giftInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [angpaoRes, giftsRes] = await Promise.all([
          fetch(`/api/member/angpao?invitationId=${invitationId}`),
          fetch(`/api/member/gifts?invitationId=${invitationId}`)
        ])
        
        const angpaoData = await angpaoRes.json()
        if (angpaoData.success && angpaoData.data) {
          setAngpao({
            bankName: angpaoData.data.bankName || '',
            accountNumber: angpaoData.data.accountNumber || '',
            accountName: angpaoData.data.accountName || '',
            qrisImageBase64: angpaoData.data.qrisImageBase64 || null,
            deliveryAddress: angpaoData.data.deliveryAddress || ''
          })
        }

        const giftsData = await giftsRes.json()
        if (giftsData.success) {
          setGifts(giftsData.data)
        }
      } catch (error) {
        console.error('Error fetching QRIS/Gifts:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [invitationId])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'qris' | 'gift') => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      if (type === 'qris') {
        setAngpao(prev => ({ ...prev, qrisImageBase64: base64String }))
      } else {
        setNewGift(prev => ({ ...prev, itemImageBase64: base64String }))
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSaveAngpao = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/member/angpao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationId, ...angpao })
      })
      const data = await res.json()
      if (data.success) {
        alert('Pengaturan Angpao Digital berhasil disimpan!')
      } else {
        alert('Gagal: ' + data.error)
      }
    } catch (error) {
      console.error(error)
      alert('Terjadi kesalahan jaringan')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddGift = async () => {
    if (!newGift.itemName) return alert('Nama barang wajib diisi')
    
    setIsSaving(true)
    try {
      const res = await fetch('/api/member/gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationId, ...newGift })
      })
      const data = await res.json()
      if (data.success) {
        setGifts([data.data, ...gifts])
        setIsAddingGift(false)
        setNewGift({ itemName: '', buyUrl: '', itemImageBase64: '' })
      } else {
        alert('Gagal menambah kado: ' + data.error)
      }
    } catch (error) {
      console.error(error)
      alert('Terjadi kesalahan')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteGift = async (id: string) => {
    if (!confirm('Hapus barang ini dari wishlist?')) return
    try {
      const res = await fetch(`/api/member/gifts?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setGifts(gifts.filter(g => g.id !== id))
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl p-6 w-full max-w-3xl shadow-xl max-h-[90vh] flex flex-col"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl text-slate-800">QRIS & Gift Registry</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
        </div>

        {/* Dual Tabs */}
        <div className="flex gap-4 border-b border-slate-200 mb-6">
          <button 
            onClick={() => setActiveTab('qris')}
            className={`pb-3 text-sm font-semibold transition-colors ${activeTab === 'qris' ? 'border-b-2 border-pink-500 text-pink-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Digital Angpao & QRIS
          </button>
          <button 
            onClick={() => setActiveTab('gift')}
            className={`pb-3 text-sm font-semibold transition-colors ${activeTab === 'gift' ? 'border-b-2 border-pink-500 text-pink-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Gift Registry (Wishlist)
          </button>
        </div>

        <div className="overflow-y-auto flex-1 pr-2">
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 text-pink-500 animate-spin" /></div>
          ) : activeTab === 'qris' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Rekening Info */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Nama Bank / E-Wallet</label>
                    <input 
                      type="text" value={angpao.bankName} onChange={e => setAngpao({...angpao, bankName: e.target.value})}
                      className="mt-1 w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-pink-500" placeholder="Cth: BCA / GoPay"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Nomor Rekening</label>
                    <input 
                      type="text" value={angpao.accountNumber} onChange={e => setAngpao({...angpao, accountNumber: e.target.value})}
                      className="mt-1 w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-pink-500" placeholder="Cth: 1234567890"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Nama Pemilik Rekening</label>
                    <input 
                      type="text" value={angpao.accountName} onChange={e => setAngpao({...angpao, accountName: e.target.value})}
                      className="mt-1 w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-pink-500" placeholder="Cth: Ahmad Fulan"
                    />
                  </div>
                </div>

                {/* QRIS Upload */}
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Gambar QRIS Statis</label>
                  <div 
                    onClick={() => qrisInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 rounded-2xl h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors overflow-hidden"
                  >
                    {angpao.qrisImageBase64 ? (
                      <img src={angpao.qrisImageBase64} alt="QRIS" className="h-full object-contain" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-slate-400 mb-2" />
                        <span className="text-sm text-slate-500">Klik untuk upload QRIS</span>
                      </>
                    )}
                  </div>
                  <input type="file" ref={qrisInputRef} onChange={e => handleImageUpload(e, 'qris')} accept="image/*" className="hidden" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Alamat Pengiriman Kado Fisik</label>
                <textarea 
                  rows={3} value={angpao.deliveryAddress} onChange={e => setAngpao({...angpao, deliveryAddress: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-pink-500" 
                  placeholder="Isi alamat lengkap tempat penerimaan kado fisik..."
                />
              </div>

              <div className="flex justify-end pt-4">
                <button onClick={handleSaveAngpao} disabled={isSaving} className="px-6 py-2.5 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 disabled:opacity-50 flex items-center gap-2">
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />} Simpan Info Angpao
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {!isAddingGift ? (
                <button 
                  onClick={() => setIsAddingGift(true)}
                  className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-medium hover:text-pink-500 hover:border-pink-300 flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" /> Tambah Barang Wishlist
                </button>
              ) : (
                <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-sm">Barang Wishlist Baru</h4>
                    <button onClick={() => setIsAddingGift(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4"/></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase">Nama Barang</label>
                      <input type="text" value={newGift.itemName} onChange={e => setNewGift({...newGift, itemName: e.target.value})} className="mt-1 w-full px-3 py-2 border rounded-xl outline-none focus:border-pink-500" placeholder="Cth: Robot Vacuum" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase">Link Pembelian (Opsional)</label>
                      <input type="url" value={newGift.buyUrl} onChange={e => setNewGift({...newGift, buyUrl: e.target.value})} className="mt-1 w-full px-3 py-2 border rounded-xl outline-none focus:border-pink-500" placeholder="https://shopee.co.id/..." />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Foto Referensi (Opsional)</label>
                    <div className="flex items-center gap-4">
                      {newGift.itemImageBase64 && <img src={newGift.itemImageBase64} className="w-16 h-16 rounded-xl object-cover border" alt="preview" />}
                      <button onClick={() => giftInputRef.current?.click()} className="px-4 py-2 border rounded-xl text-sm font-medium hover:bg-slate-100 flex items-center gap-2">
                        <Upload className="w-4 h-4" /> Upload Foto
                      </button>
                      <input type="file" ref={giftInputRef} onChange={e => handleImageUpload(e, 'gift')} accept="image/*" className="hidden" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button onClick={() => setIsAddingGift(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-xl">Batal</button>
                    <button onClick={handleAddGift} disabled={isSaving} className="px-4 py-2 text-sm text-white bg-slate-900 hover:bg-slate-800 rounded-xl">{isSaving ? 'Menyimpan...' : 'Simpan Barang'}</button>
                  </div>
                </div>
              )}

              {/* Gift List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {gifts.map(gift => (
                  <div key={gift.id} className="border border-slate-200 rounded-2xl p-4 flex gap-4 bg-white relative group">
                    <button onClick={() => handleDeleteGift(gift.id)} className="absolute top-2 right-2 p-1.5 bg-white shadow-sm rounded-lg text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-rose-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <div className="w-20 h-20 rounded-xl bg-slate-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {gift.itemImageBase64 ? (
                        <img src={gift.itemImageBase64} className="w-full h-full object-cover" alt={gift.itemName} />
                      ) : (
                        <Gift className="w-8 h-8 text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="font-bold text-slate-800 line-clamp-1">{gift.itemName}</h4>
                      {gift.buyUrl && (
                        <a href={gift.buyUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-0.5">
                          <LinkIcon className="w-3 h-3" /> Cek Marketplace
                        </a>
                      )}
                      <div className="mt-2">
                        {gift.isClaimed ? (
                          <span className="inline-flex px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase rounded-md">
                            Diklaim oleh {gift.claimedByGuest?.name || 'Tamu'}
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase rounded-md border border-emerald-100">
                            Tersedia
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {gifts.length === 0 && !isAddingGift && (
                <div className="text-center py-10 text-slate-500 text-sm">
                  Belum ada daftar barang wishlist. Tambahkan barang agar tamu bisa membelikan kado fisik.
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
