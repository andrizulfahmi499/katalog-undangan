'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Globe, Share2, Calendar, MapPin, Camera, Image as ImageIcon } from 'lucide-react'

type GlobalSettingsModalProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (settings: any) => void
  initialData?: any
}

export default function GlobalSettingsModal({ isOpen, onClose, onSave, initialData }: GlobalSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'general'|'seo'|'event'>('general')
  const [formData, setFormData] = useState({
    language: initialData?.language || 'id',
    slug: initialData?.slug || '',
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
    metaImage: initialData?.metaImage || '',
    eventDate: initialData?.eventDate || '',
    eventTime: initialData?.eventTime || '',
    timezone: initialData?.timezone || 'WIB',
    eventAddress: initialData?.eventAddress || '',
  })

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Pengaturan Umum Undangan</h2>
              <p className="text-sm text-slate-500 mt-1">Konfigurasi domain, bahasa, SEO, dan data utama acara.</p>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Tabs Sidebar */}
            <div className="w-48 bg-slate-50 border-r border-slate-100 p-4 space-y-1">
              <button 
                onClick={() => setActiveTab('general')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === 'general' ? 'bg-pink-100 text-pink-700' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <Globe className="w-4 h-4" /> Dasar
              </button>
              <button 
                onClick={() => setActiveTab('seo')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === 'seo' ? 'bg-pink-100 text-pink-700' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <Share2 className="w-4 h-4" /> SEO & Share
              </button>
              <button 
                onClick={() => setActiveTab('event')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === 'event' ? 'bg-pink-100 text-pink-700' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <Calendar className="w-4 h-4" /> Data Acara
              </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Pengaturan Dasar</h3>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1.5">Bahasa Utama</label>
                    <select name="language" value={formData.language} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-200 outline-none">
                      <option value="id">Indonesia</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1.5">Link Undangan (Slug)</label>
                    <div className="flex items-center">
                      <span className="px-4 py-2.5 bg-slate-50 border border-r-0 border-slate-200 rounded-l-xl text-slate-500 text-sm">domain.com/</span>
                      <input type="text" name="slug" value={formData.slug} onChange={handleChange} placeholder="romeo-dan-juliet" className="flex-1 px-4 py-2.5 rounded-r-xl border border-slate-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-200 outline-none" />
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5">Tautan unik untuk undangan Anda. Gunakan huruf kecil dan strip (-).</p>
                  </div>
                </div>
              )}

              {activeTab === 'seo' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">SEO & Pratinjau Bagikan</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-slate-700 block mb-1.5">Judul (Meta Title)</label>
                        <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} placeholder="The Wedding of Romeo & Juliet" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-200 outline-none" />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-slate-700 block mb-1.5">Deskripsi Singkat (Meta Description)</label>
                        <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} rows={3} placeholder="Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu untuk hadir..." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-200 outline-none" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-slate-700 block mb-1.5">WhatsApp Share Preview</label>
                      <div className="border border-slate-200 rounded-xl overflow-hidden bg-[#f0f2f5] p-3 max-w-[300px]">
                        <div className="bg-[#e1f5c4] rounded-lg overflow-hidden shadow-sm">
                          <div className="aspect-[1.91/1] bg-slate-200 relative flex items-center justify-center">
                            {formData.metaImage ? (
                              <img src={formData.metaImage} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-8 h-8 text-slate-400" />
                            )}
                            <button className="absolute bottom-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors">
                              <Camera className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="p-3">
                            <h4 className="font-semibold text-slate-800 text-[13px] leading-tight line-clamp-1">{formData.metaTitle || 'Judul Undangan'}</h4>
                            <p className="text-slate-500 text-[11px] mt-1 line-clamp-2">{formData.metaDescription || 'Deskripsi singkat akan muncul di sini saat dibagikan ke WhatsApp...'}</p>
                            <p className="text-slate-400 text-[10px] mt-1.5">domain.com</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'event' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Data Acara Utama</h3>
                  <p className="text-sm text-slate-500">Data ini digunakan untuk Countdown Timer utama dan pengaturan zona waktu.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 block mb-1.5">Tanggal Acara Utama</label>
                      <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-200 outline-none" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 block mb-1.5">Waktu Dimulai</label>
                      <input type="time" name="eventTime" value={formData.eventTime} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-200 outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1.5">Zona Waktu</label>
                    <select name="timezone" value={formData.timezone} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-200 outline-none">
                      <option value="WIB">Waktu Indonesia Barat (WIB)</option>
                      <option value="WITA">Waktu Indonesia Tengah (WITA)</option>
                      <option value="WIT">Waktu Indonesia Timur (WIT)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1.5">Alamat Lengkap</label>
                    <textarea name="eventAddress" value={formData.eventAddress} onChange={handleChange} rows={3} placeholder="Gedung XYZ, Jl. Merdeka No 123..." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-200 outline-none" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-slate-100 bg-white flex justify-end gap-3">
            <button onClick={onClose} className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors">
              Batal
            </button>
            <button 
              onClick={() => onSave(formData)}
              className="px-8 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-pink-500/20"
            >
              Simpan Pengaturan
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
