'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ScrollReveal } from './ScrollReveal'
import { Sparkles, User, Heart, Calendar, MapPin, Image, Music, Send, Upload, X, Check } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

export function OrderFormSection() {
  const { isLight } = useTheme()
  const [formData, setFormData] = useState({
    // Informasi Pemesan
    namaPemesan: '',
    noWhatsApp: '',
    
    // Data Mempelai
    namaPria: '',
    namaWanita: '',
    namaPanggilan: '',
    
    // Detail Acara
    tanggalAkad: '',
    tanggalResepsi: '',
    lokasiAkad: '',
    lokasiResepsi: '',
    linkMaps: '',
    
    // Tema
    temaPilihan: '',
    
    // Tambahan
    linkLagu: '',
    turutMengundang: '',
    catatanTambahan: '',
  })
  
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const MAX_PHOTOS = 15

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (uploadedPhotos.length + files.length > MAX_PHOTOS) {
      alert(`Maksimal ${MAX_PHOTOS} foto saja`)
      return
    }

    setUploadedPhotos(prev => [...prev, ...files])
    
    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrls(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index))
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Format pesan WhatsApp
    let message = `🎉 *FORM ORDER UNDANGAN DIGITAL*\n\n`

    message += `📋 *INFORMASI PEMESAN*\n`
    message += `Nama: ${formData.namaPemesan}\n`
    message += `No. WhatsApp: ${formData.noWhatsApp}\n\n`

    message += `💑 *DATA MEMPELAI*\n`
    message += `Nama Pria: ${formData.namaPria}\n`
    message += `Nama Wanita: ${formData.namaWanita}\n`
    message += `Nama Panggilan: ${formData.namaPanggilan}\n\n`

    message += `📅 *DETAIL ACARA*\n`
    message += `Tanggal Akad: ${formData.tanggalAkad}\n`
    message += `Tanggal Resepsi: ${formData.tanggalResepsi}\n`
    message += `Lokasi Akad: ${formData.lokasiAkad}\n`
    message += `Lokasi Resepsi: ${formData.lokasiResepsi}\n\n`

    if (formData.linkMaps) {
      message += `📍 *LINK MAPS*\n${formData.linkMaps}\n\n`
    }

    message += `🎨 *TEMA PILIHAN*\n${formData.temaPilihan || 'Belum dipilih'}\n\n`

    if (formData.linkLagu) {
      message += `🎵 *LINK LAGU*\n${formData.linkLagu}\n\n`
    }

    if (formData.turutMengundang) {
      message += `👨‍👩‍👧‍👦 *TURUT MENGUNDANG*\n${formData.turutMengundang}\n\n`
    }

    if (formData.catatanTambahan) {
      message += `📝 *CATATAN TAMBAHAN*\n${formData.catatanTambahan}\n\n`
    }

    message += `📸 *FOTO MEMPELAI*\n`
    if (uploadedPhotos.length > 0) {
      message += `Jumlah foto terupload: ${uploadedPhotos.length}\n`
      uploadedPhotos.forEach((file, index) => {
        message += `${index + 1}. ${file.name}\n`
      })
      message += `\nSaya gunakan tombol share untuk mengirim foto jika didukung oleh perangkat Anda.`
    } else {
      message += `Tidak ada foto terlampir.\n`
    }

    message += `\nMohon diproses segera. Terima kasih! 🙏`

    const phoneNumber = '6285299659458'
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

    const canShareFiles = typeof navigator !== 'undefined' && 'canShare' in navigator && navigator.canShare?.({ files: uploadedPhotos })

    if (canShareFiles && 'share' in navigator) {
      try {
        await navigator.share({
          title: 'Order Undangan Digital',
          text: message,
          files: uploadedPhotos,
        })
      } catch (error) {
        window.open(whatsappUrl, '_blank')
      }
    } else {
      window.open(whatsappUrl, '_blank')
    }

    setIsSubmitting(false)

    // Reset form
    setFormData({
      namaPemesan: '',
      noWhatsApp: '',
      namaPria: '',
      namaWanita: '',
      namaPanggilan: '',
      tanggalAkad: '',
      tanggalResepsi: '',
      lokasiAkad: '',
      lokasiResepsi: '',
      linkMaps: '',
      temaPilihan: '',
      linkLagu: '',
      turutMengundang: '',
      catatanTambahan: '',
    })
    setUploadedPhotos([])
    setPreviewUrls([])
  }

  return (
    <section id="order-form" className="relative py-10 overflow-hidden">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
        <ScrollReveal>
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="inline-block mb-6"
            >
              <div className="flex items-center justify-center gap-2">
                <Sparkles className={`w-6 h-6 ${isLight ? 'text-[#8b8fa3]' : 'text-[#aabbb2]'}`} />
                <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${isLight ? 'text-[#2d3748]' : 'text-white'}`}>
                  Form Order Undangan
                </h2>
                <Sparkles className={`w-6 h-6 ${isLight ? 'text-[#a0a4b8]' : 'text-[#ededed]'}`} />
              </div>
            </motion.div>
            <p className={`text-xl max-w-2xl mx-auto leading-relaxed ${isLight ? 'text-[#6b7280]' : 'text-gray-200/80'}`}>
              Lengkapi formulir di bawah ini untuk memesan undangan digital impian Anda
            </p>
          </div>
        </ScrollReveal>

        {/* Form Container */}
        <ScrollReveal delay={0.1}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <form onSubmit={handleSubmit} className={`rounded-3xl overflow-hidden ${isLight ? 'neu-raised-lg' : 'bg-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/15'}`}>
              {/* Informasi Pemesan */}
              <div className={`p-6 sm:p-8 ${isLight ? 'border-b border-[#d1d9e6]' : 'border-b border-white/10'}`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isLight ? 'neu-pressed text-[#8b8fa3]' : 'bg-white/15 border border-white/20'}`}>
                    <User className={`w-6 h-6 ${isLight ? '' : 'text-white/80'}`} />
                  </div>
                  <h3 className={`text-xl font-bold ${isLight ? 'text-[#2d3748]' : 'text-white'}`}>Informasi Pemesan</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-[#6b7280]' : 'text-gray-200'}`}>
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="namaPemesan"
                      value={formData.namaPemesan}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-2xl outline-none transition-all ${isLight ? 'neu-pressed-sm text-[#2d3748] placeholder-[#9ca3af] focus:shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff]' : 'border border-white/20 focus:border-white/50 focus:ring-2 focus:ring-white/10 bg-white/10 backdrop-blur-sm text-white placeholder-white/40'}`}}
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-[#6b7280]' : 'text-gray-200'}`}>
                      No. WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="noWhatsApp"
                      value={formData.noWhatsApp}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-2xl outline-none transition-all ${isLight ? 'neu-pressed-sm text-[#2d3748] placeholder-[#9ca3af] focus:shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff]' : 'border border-white/20 focus:border-white/50 focus:ring-2 focus:ring-white/10 bg-white/10 backdrop-blur-sm text-white placeholder-white/40'}`}}
                      placeholder="Contoh: 081234567890"
                    />
                  </div>
                </div>
              </div>

              {/* Data Mempelai */}
              <div className={`p-6 sm:p-8 ${isLight ? 'border-b border-[#d1d9e6]' : 'border-b border-white/10'}`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isLight ? 'neu-pressed text-[#8b8fa3]' : 'bg-white/15 border border-white/20'}`}>
                    <Heart className={`w-6 h-6 ${isLight ? '' : 'text-white/80'}`} />
                  </div>
                  <h3 className={`text-xl font-bold ${isLight ? 'text-[#2d3748]' : 'text-white'}`}>Data Mempelai</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-[#6b7280]' : 'text-gray-200'}`}>
                      Nama Lengkap Pria <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="namaPria"
                      value={formData.namaPria}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-2xl outline-none transition-all ${isLight ? 'neu-pressed-sm text-[#2d3748] placeholder-[#9ca3af]' : 'border border-white/20 focus:border-[#A5B4FC] focus:ring-2 focus:ring-[#A5B4FC]/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/40'}`}
                      placeholder="Nama lengkap mempelai pria"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-[#6b7280]' : 'text-gray-200'}`}>
                      Nama Lengkap Wanita <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="namaWanita"
                      value={formData.namaWanita}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-2xl outline-none transition-all ${isLight ? 'neu-pressed-sm text-[#2d3748] placeholder-[#9ca3af]' : 'border border-white/20 focus:border-[#A5B4FC] focus:ring-2 focus:ring-[#A5B4FC]/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/40'}`}
                      placeholder="Nama lengkap mempelai wanita"
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-[#6b7280]' : 'text-gray-200'}`}>
                    Nama Panggilan (Keduanya) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="namaPanggilan"
                    value={formData.namaPanggilan}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 rounded-2xl outline-none transition-all ${isLight ? 'neu-pressed-sm text-[#2d3748] placeholder-[#9ca3af]' : 'border border-white/20 focus:border-[#A5B4FC] focus:ring-2 focus:ring-[#A5B4FC]/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/40'}`}
                    placeholder="Contoh: Ahmad & Siti"
                  />
                </div>
              </div>

              {/* Detail Acara */}
              <div className={`p-6 sm:p-8 ${isLight ? 'border-b border-[#d1d9e6]' : 'border-b border-white/10'}`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isLight ? 'neu-pressed text-[#8b8fa3]' : 'bg-white/15 border border-white/20'}`}>
                    <Calendar className={`w-6 h-6 ${isLight ? '' : 'text-white/80'}`} />
                  </div>
                  <h3 className={`text-xl font-bold ${isLight ? 'text-[#2d3748]' : 'text-white'}`}>Detail Acara</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-[#6b7280]' : 'text-gray-200'}`}>
                      Tanggal Akad <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="tanggalAkad"
                      value={formData.tanggalAkad}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-2xl outline-none transition-all ${isLight ? 'neu-pressed-sm text-[#2d3748]' : 'border border-white/20 focus:border-[#A5B4FC] focus:ring-2 focus:ring-[#A5B4FC]/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/40'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-[#6b7280]' : 'text-gray-200'}`}>
                      Tanggal Resepsi
                    </label>
                    <input
                      type="date"
                      name="tanggalResepsi"
                      value={formData.tanggalResepsi}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-2xl outline-none transition-all ${isLight ? 'neu-pressed-sm text-[#2d3748]' : 'border border-white/20 focus:border-[#A5B4FC] focus:ring-2 focus:ring-[#A5B4FC]/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/40'}`}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-[#6b7280]' : 'text-gray-200'}`}>
                      Lokasi Akad <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lokasiAkad"
                      value={formData.lokasiAkad}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-2xl outline-none transition-all ${isLight ? 'neu-pressed-sm text-[#2d3748] placeholder-[#9ca3af]' : 'border border-white/20 focus:border-[#A5B4FC] focus:ring-2 focus:ring-[#A5B4FC]/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/40'}`}
                      placeholder="Nama gedung/lokasi akad"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-[#6b7280]' : 'text-gray-200'}`}>
                      Lokasi Resepsi
                    </label>
                    <input
                      type="text"
                      name="lokasiResepsi"
                      value={formData.lokasiResepsi}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-2xl outline-none transition-all ${isLight ? 'neu-pressed-sm text-[#2d3748] placeholder-[#9ca3af]' : 'border border-white/20 focus:border-[#A5B4FC] focus:ring-2 focus:ring-[#A5B4FC]/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/40'}`}
                      placeholder="Nama gedung/lokasi resepsi"
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-[#6b7280]' : 'text-gray-200'}`}>
                    Link Google Maps
                  </label>
                  <input
                    type="url"
                    name="linkMaps"
                    value={formData.linkMaps}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-2xl outline-none transition-all ${isLight ? 'neu-pressed-sm text-[#2d3748] placeholder-[#9ca3af]' : 'border border-white/20 focus:border-[#A5B4FC] focus:ring-2 focus:ring-[#A5B4FC]/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/40'}`}
                    placeholder="https://maps.google.com/..."
                  />
                </div>
              </div>

              {/* Tema Pilihan */}
              <div className={`p-6 sm:p-8 ${isLight ? 'border-b border-[#d1d9e6]' : 'border-b border-white/10'}`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isLight ? 'neu-pressed text-[#8b8fa3]' : 'bg-white/15 border border-white/20'}`}>
                    <Sparkles className={`w-6 h-6 ${isLight ? '' : 'text-white/80'}`} />
                  </div>
                  <h3 className={`text-xl font-bold ${isLight ? 'text-[#2d3748]' : 'text-white'}`}>Tema Pilihan</h3>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-[#6b7280]' : 'text-gray-200'}`}>
                    Pilih Tema
                  </label>
                  <input
                    type="text"
                    name="temaPilihan"
                    value={formData.temaPilihan}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-2xl outline-none transition-all ${isLight ? 'neu-pressed-sm text-[#2d3748] placeholder-[#9ca3af]' : 'border border-white/20 focus:border-[#A5B4FC] focus:ring-2 focus:ring-[#A5B4FC]/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/40'}`}
                    placeholder="Masukkan nama tema yang diinginkan"
                  />
                  <p className={`text-xs mt-2 ${isLight ? 'text-[#9ca3af]' : 'text-gray-300/60'}`}>
                    💡 Lihat katalog tema di atas untuk memilih
                  </p>
                </div>
              </div>

              {/* Upload Foto Mempelai */}
              <div className={`p-6 sm:p-8 ${isLight ? 'border-b border-[#d1d9e6]' : 'border-b border-white/10'}`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isLight ? 'neu-pressed text-[#8b8fa3]' : 'bg-white/15 border border-white/20'}`}>
                    <Image className={`w-6 h-6 ${isLight ? '' : 'text-white/80'}`} />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${isLight ? 'text-[#2d3748]' : 'text-white'}`}>Foto Mempelai</h3>
                    <p className={`text-xs ${isLight ? 'text-[#9ca3af]' : 'text-gray-300/60'}`}>Maksimal {MAX_PHOTOS} foto</p>
                  </div>
                </div>
                
                <div className={`border-2 border-dashed rounded-3xl p-8 text-center transition-colors ${isLight ? 'border-[#b8bec7] hover:border-[#8b8fa3]' : 'border-white/20 hover:border-white/40'}`}>
                  <input
                    type="file"
                    id="photoUpload"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={uploadedPhotos.length >= MAX_PHOTOS}
                  />
                  <label
                    htmlFor="photoUpload"
                    className={`cursor-pointer flex flex-col items-center ${uploadedPhotos.length >= MAX_PHOTOS ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isLight ? 'neu-pressed' : 'bg-white/10 border border-white/20'}`}>
                      <Upload className={`w-8 h-8 ${isLight ? 'text-[#8b8fa3]' : 'text-white/60'}`} />
                    </div>
                    <p className={`text-sm font-medium mb-1 ${isLight ? 'text-[#2d3748]' : 'text-white'}`}>
                      Klik untuk upload foto
                    </p>
                    <p className={`text-xs ${isLight ? 'text-[#9ca3af]' : 'text-gray-300/60'}`}>
                      {uploadedPhotos.length}/{MAX_PHOTOS} foto terupload
                    </p>
                  </label>
                </div>

                {/* Photo Preview Grid */}
                {previewUrls.length > 0 && (
                  <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-2xl shadow-md"
                        />
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removePhoto(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tambahan */}
              <div className={`p-6 sm:p-8 ${isLight ? 'border-b border-[#d1d9e6]' : 'border-b border-white/10'}`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isLight ? 'neu-pressed text-[#8b8fa3]' : 'bg-white/15 border border-white/20'}`}>
                    <Music className={`w-6 h-6 ${isLight ? '' : 'text-white/80'}`} />
                  </div>
                  <h3 className={`text-xl font-bold ${isLight ? 'text-[#2d3748]' : 'text-white'}`}>Tambahan</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-[#6b7280]' : 'text-gray-200'}`}>
                      Link Lagu (YouTube/Spotify)
                    </label>
                    <input
                      type="url"
                      name="linkLagu"
                      value={formData.linkLagu}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-2xl outline-none transition-all ${isLight ? 'neu-pressed-sm text-[#2d3748] placeholder-[#9ca3af]' : 'border border-white/20 focus:border-[#A5B4FC] focus:ring-2 focus:ring-[#A5B4FC]/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/40'}`}
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-[#6b7280]' : 'text-gray-200'}`}>
                      Turut Mengundang
                    </label>
                    <input
                      type="text"
                      name="turutMengundang"
                      value={formData.turutMengundang}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-2xl outline-none transition-all ${isLight ? 'neu-pressed-sm text-[#2d3748] placeholder-[#9ca3af]' : 'border border-white/20 focus:border-[#A5B4FC] focus:ring-2 focus:ring-[#A5B4FC]/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/40'}`}
                      placeholder="Keluarga besar, sahabat, dll"
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-[#6b7280]' : 'text-gray-200'}`}>
                    Catatan Tambahan
                  </label>
                  <textarea
                    name="catatanTambahan"
                    value={formData.catatanTambahan}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-2xl outline-none transition-all resize-none ${isLight ? 'neu-pressed-sm text-[#2d3748] placeholder-[#9ca3af]' : 'border border-white/20 focus:border-[#A5B4FC] focus:ring-2 focus:ring-[#A5B4FC]/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/40'}`}
                    placeholder="Tuliskan catatan atau permintaan khusus..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className={`p-6 sm:p-8 ${isLight ? '' : 'bg-white/5'}`}>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${isLight ? 'neu-btn text-[#2d3748] hover:shadow-[inset_2px_2px_4px_#b8bec7,inset_-2px_-2px_4px_#ffffff]' : 'bg-[#ededed] text-[#172a26] shadow-lg hover:bg-white'}`}}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Kirim Pesanan ke WhatsApp
                    </>
                  )}
                </motion.button>
                <p className={`text-center text-xs mt-4 ${isLight ? 'text-[#9ca3af]' : 'text-gray-300/60'}`}>
                  Anda akan diarahkan ke WhatsApp untuk mengirim pesanan
                </p>
              </div>
            </form>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  )
}
