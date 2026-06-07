'use client'

import React, { useState, useEffect } from 'react'
import { Save, Plus, Trash2 } from 'lucide-react'
import { PAGE_CATEGORIES } from '@/lib/pageCategories'
import type { PageItem } from './PageManagerSidebar'

type Props = { 
  page: PageItem
  onSave?: (id: string, content: any) => void 
  onContentChange?: (content: any) => void
  hideSaveButton?: boolean
}

const Input = ({ label, name, value, onChange, placeholder = '', type = 'text' }: any) => (
  <div>
    <label className="text-sm font-medium text-slate-700 block mb-1.5">{label}</label>
    <input type={type} name={name} value={value || ''} onChange={onChange} placeholder={placeholder}
      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 outline-none text-sm" />
  </div>
)

const Textarea = ({ label, name, value, onChange, placeholder = '', rows = 3 }: any) => (
  <div>
    <label className="text-sm font-medium text-slate-700 block mb-1.5">{label}</label>
    <textarea name={name} value={value || ''} onChange={onChange} placeholder={placeholder} rows={rows}
      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 outline-none text-sm resize-none" />
  </div>
)

export default function PageContentEditor({ page, onSave, onContentChange, hideSaveButton }: Props) {
  const [content, setContent] = useState<any>(page.content || {})
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => { setContent(page.content || {}) }, [page.id, page.content])

  useEffect(() => {
    if (onContentChange) {
      onContentChange(content)
    }
  }, [content, onContentChange])

  const categoryInfo = PAGE_CATEGORIES.find(c => c.id === page.category)
  const layoutInfo = categoryInfo?.layouts.find(l => l.id === page.layoutId)

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setContent((p: any) => ({ ...p, [e.target.name]: e.target.value }))

  const setField = (key: string, val: any) => setContent((p: any) => ({ ...p, [key]: val }))

  const handleSave = async () => { 
    if (!onSave) return
    setIsSaving(true)
    await onSave(page.id, content)
    setIsSaving(false) 
  }

  // ── Array helpers ──────────────────────────────────────────────────────────
  const addItem = (key: string, template: object) =>
    setField(key, [...(content[key] || []), { id: String(Date.now()), ...template }])

  const updateItem = (key: string, id: string, field: string, val: string) =>
    setField(key, (content[key] || []).map((it: any) => it.id === id ? { ...it, [field]: val } : it))

  const removeItem = (key: string, id: string) =>
    setField(key, (content[key] || []).filter((it: any) => it.id !== id))

  const ArrayItemRow = ({ aKey, item, fields }: { aKey: string; item: any; fields: { name: string; label: string; type?: string }[] }) => (
    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 relative group">
      {fields.map(f => {
        if (f.type === 'image') {
          return (
            <div key={f.name} className="flex flex-col gap-1">
              <label className="text-xs text-slate-500">{f.label}</label>
              <div className="flex items-center gap-2">
                {item[f.name] && (
                  <img src={item[f.name]} alt="preview" className="w-10 h-10 object-cover rounded shadow-sm border border-slate-200" />
                )}
                <label className="flex-1 cursor-pointer bg-white border border-slate-200 border-dashed rounded-lg py-1.5 flex flex-col items-center justify-center text-slate-400 hover:text-pink-500 hover:bg-pink-50 transition-colors">
                  <span className="text-[10px] font-medium">+ Pilih File</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = () => updateItem(aKey, item.id, f.name, reader.result as string)
                      reader.readAsDataURL(file)
                    }
                  }} />
                </label>
              </div>
            </div>
          )
        }
        return (
          <div key={f.name}>
            <label className="text-xs text-slate-500">{f.label}</label>
            <input type={f.type || 'text'} value={item[f.name] || ''} placeholder={f.label}
              onChange={e => updateItem(aKey, item.id, f.name, e.target.value)}
              className="w-full mt-0.5 px-3 py-1.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-pink-500" />
          </div>
        )
      })}
      <button onClick={() => removeItem(aKey, item.id)} className="absolute top-2 right-2 text-xs bg-red-100 text-red-500 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white">
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  )

  const renderForm = () => {
    switch (page.category) {
      case 'opening':
        return (
          <div className="space-y-4">
            <Input label="Judul Sampul" name="title" value={content.title} onChange={set} placeholder="The Wedding Of" />
            <Input label="Nama Pasangan" name="coupleNames" value={content.coupleNames} onChange={set} placeholder="Akbar & Madia" />
            <Input label="Teks Kepada Tamu" name="guestLabel" value={content.guestLabel} onChange={set} placeholder="Kepada Yth." />
            <Input label="Label Tombol Buka" name="buttonLabel" value={content.buttonLabel} onChange={set} placeholder="Buka Undangan" />
            <Input label="URL Foto (opsional)" name="photoUrl" value={content.photoUrl} onChange={set} placeholder="https://..." />
          </div>
        )

      case 'loveStory':
        return (
          <div className="space-y-4">
            <Input label="Judul Seksi" name="sectionTitle" value={content.sectionTitle} onChange={set} placeholder="Love Story" />
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">Cerita Cinta</label>
                <button onClick={() => addItem('stories', { year: '', title: '', description: '', photoUrl: '' })}
                  className="text-xs text-pink-600 flex items-center gap-1 hover:text-pink-700">
                  <Plus className="w-3 h-3" /> Tambah Cerita
                </button>
              </div>
              <div className="space-y-3">
                {(content.stories || []).map((s: any) => (
                  <ArrayItemRow key={s.id} aKey="stories" item={s} fields={[
                    { name: 'year', label: 'Tahun' }, { name: 'title', label: 'Judul' },
                    { name: 'description', label: 'Cerita' }, { name: 'photoUrl', label: 'URL Foto (opsional)' }
                  ]} />
                ))}
              </div>
            </div>
          </div>
        )

      case 'quotes':
        return (
          <div className="space-y-4">
            <Textarea label="Teks Arab (opsional)" name="arabicText" value={content.arabicText} onChange={set} rows={2} />
            <Textarea label="Kutipan / Ayat" name="quote" value={content.quote} onChange={set} rows={4} placeholder="Dan di antara tanda-tanda kekuasaan-Nya..." />
            <Input label="Sumber" name="source" value={content.source} onChange={set} placeholder="(QS. Ar-Rum: 21)" />
          </div>
        )

      case 'profil':
      case 'mempelai':
        return (
          <div className="space-y-5">
            <div className="p-4 bg-blue-50 rounded-xl space-y-3">
              <h4 className="font-semibold text-blue-700 text-sm">Mempelai Pria</h4>
              <Input label="Nama Lengkap" name="groomName" value={content.groomName} onChange={set} placeholder="Ahmad Akbar S.T." />
              <Input label="Nama Panggilan" name="groomNickname" value={content.groomNickname} onChange={set} placeholder="Akbar" />
              <Textarea label="Info Orang Tua" name="groomParents" value={content.groomParents} onChange={set} rows={2} placeholder="Putra dari Bapak... & Ibu..." />
              <Input label="Instagram (opsional)" name="groomInstagram" value={content.groomInstagram} onChange={set} placeholder="@username" />
              <Input label="URL Foto (opsional)" name="groomPhotoUrl" value={content.groomPhotoUrl} onChange={set} placeholder="https://..." />
            </div>
            <div className="p-4 bg-pink-50 rounded-xl space-y-3">
              <h4 className="font-semibold text-pink-700 text-sm">Mempelai Wanita</h4>
              <Input label="Nama Lengkap" name="brideName" value={content.brideName} onChange={set} placeholder="Rahmadia S.Pd." />
              <Input label="Nama Panggilan" name="brideNickname" value={content.brideNickname} onChange={set} placeholder="Madia" />
              <Textarea label="Info Orang Tua" name="brideParents" value={content.brideParents} onChange={set} rows={2} placeholder="Putri dari Bapak... & Ibu..." />
              <Input label="Instagram (opsional)" name="brideInstagram" value={content.brideInstagram} onChange={set} placeholder="@username" />
              <Input label="URL Foto (opsional)" name="bridePhotoUrl" value={content.bridePhotoUrl} onChange={set} placeholder="https://..." />
            </div>
          </div>
        )

      case 'salam':
        return (
          <div className="space-y-4">
            <Input label="Salam Pembuka (Arab, opsional)" name="arabicGreeting" value={content.arabicGreeting} onChange={set} />
            <Input label="Salam Pembuka" name="greeting" value={content.greeting} onChange={set} placeholder="Assalamualaikum..." />
            <Textarea label="Isi Pesan" name="message" value={content.message} onChange={set} rows={4} />
            <Input label="Salam Penutup (opsional)" name="closingGreeting" value={content.closingGreeting} onChange={set} />
            <Input label="Nama Pengirim" name="senderName" value={content.senderName} onChange={set} placeholder="Akbar & Madia" />
          </div>
        )

      case 'acara':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Daftar Acara</label>
              <button onClick={() => addItem('events', { name: '', date: '', time: '', venue: '', address: '' })}
                className="text-xs text-pink-600 flex items-center gap-1 hover:text-pink-700">
                <Plus className="w-3 h-3" /> Tambah Acara
              </button>
            </div>
            <div className="space-y-3">
              {(content.events || []).map((ev: any) => (
                <ArrayItemRow key={ev.id} aKey="events" item={ev} fields={[
                  { name: 'name', label: 'Nama Acara' }, { name: 'date', label: 'Tanggal', type: 'date' },
                  { name: 'time', label: 'Waktu' }, { name: 'venue', label: 'Tempat / Venue' }, { name: 'address', label: 'Alamat' }
                ]} />
              ))}
            </div>
          </div>
        )

      case 'maps':
        return (
          <div className="space-y-4">
            <Input label="Nama Venue" name="venueName" value={content.venueName} onChange={set} />
            <Textarea label="Alamat Lengkap" name="address" value={content.address} onChange={set} rows={2} />
            <Textarea label="URL Embed Google Maps" name="mapsEmbedUrl" value={content.mapsEmbedUrl} onChange={set} rows={2} placeholder="https://maps.google.com/maps?..." />
            <Input label="URL Arah Google Maps" name="mapsDirectionUrl" value={content.mapsDirectionUrl} onChange={set} placeholder="https://goo.gl/maps/..." />
            <Input label="URL Waze (opsional)" name="wazeUrl" value={content.wazeUrl} onChange={set} placeholder="https://waze.com/ul/..." />
            <Input label="Label Tombol" name="buttonLabel" value={content.buttonLabel} onChange={set} placeholder="Buka Google Maps" />
          </div>
        )

      case 'rundown':
        return (
          <div className="space-y-4">
            <Input label="Judul Seksi" name="sectionTitle" value={content.sectionTitle} onChange={set} placeholder="Susunan Acara" />
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Jadwal</label>
              <button onClick={() => addItem('items', { time: '', title: '', description: '' })}
                className="text-xs text-pink-600 flex items-center gap-1 hover:text-pink-700">
                <Plus className="w-3 h-3" /> Tambah Jadwal
              </button>
            </div>
            <div className="space-y-3">
              {(content.items || []).map((it: any) => (
                <ArrayItemRow key={it.id} aKey="items" item={it} fields={[
                  { name: 'time', label: 'Waktu (cth: 09:00)' }, { name: 'title', label: 'Nama Kegiatan' }, { name: 'description', label: 'Keterangan (opsional)' }
                ]} />
              ))}
            </div>
          </div>
        )

      case 'filter':
        return (
          <div className="space-y-4">
            <Input label="Judul Seksi" name="sectionTitle" value={content.sectionTitle} onChange={set} placeholder="Filter Undangan" />
            <Input label="Nama Filter" name="filterName" value={content.filterName} onChange={set} />
            <Input label="URL Filter" name="filterUrl" value={content.filterUrl} onChange={set} placeholder="https://www.instagram.com/ar/..." />
            <Input label="URL Gambar Preview Filter" name="previewImageUrl" value={content.previewImageUrl} onChange={set} placeholder="https://..." />
            <Textarea label="Instruksi Penggunaan" name="instruction" value={content.instruction} onChange={set} rows={2} />
          </div>
        )

      case 'live':
        return (
          <div className="space-y-4">
            <Input label="Judul Seksi" name="sectionTitle" value={content.sectionTitle} onChange={set} placeholder="Live Streaming" />
            <Input label="URL Stream / Meeting" name="streamUrl" value={content.streamUrl || content.meetingUrl} onChange={e => { set(e); setField('meetingUrl', e.target.value) }} placeholder="https://youtube.com/live/..." />
            <Input label="Tanggal Mulai" name="startDate" value={content.startDate} onChange={set} type="date" />
            <Input label="Jam Mulai" name="startTime" value={content.startTime} onChange={set} placeholder="09:00 WITA" />
            <Textarea label="Deskripsi" name="description" value={content.description} onChange={set} rows={2} />
            <Input label="Label Tombol" name="buttonLabel" value={content.buttonLabel} onChange={set} placeholder="Tonton Live" />
            {page.layoutId === 'live-zoom' && (
              <>
                <Input label="Zoom Meeting ID" name="meetingId" value={content.meetingId} onChange={set} />
                <Input label="Zoom Password" name="meetingPassword" value={content.meetingPassword} onChange={set} />
              </>
            )}
          </div>
        )

      case 'gallery':
        return (
          <div className="space-y-4">
            <Input label="Judul Seksi" name="sectionTitle" value={content.sectionTitle} onChange={set} placeholder="Gallery" />
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Daftar Foto</label>
              <button onClick={() => addItem('images', { url: '', caption: '' })}
                className="text-xs text-pink-600 flex items-center gap-1 hover:text-pink-700">
                <Plus className="w-3 h-3" /> Tambah Foto
              </button>
            </div>
            <div className="space-y-3">
              {(content.images || []).map((img: any) => (
                <ArrayItemRow key={img.id} aKey="images" item={img} fields={[
                  { name: 'url', label: 'Upload Foto', type: 'image' }, { name: 'caption', label: 'Keterangan (opsional)' }
                ]} />
              ))}
            </div>
          </div>
        )

      case 'gift':
        return (
          <div className="space-y-4">
            <Input label="Judul Seksi" name="sectionTitle" value={content.sectionTitle} onChange={set} placeholder="Hadiah Pernikahan" />
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Rekening Bank</label>
              <button onClick={() => addItem('accounts', { bankName: '', accountNumber: '', accountName: '' })}
                className="text-xs text-pink-600 flex items-center gap-1 hover:text-pink-700">
                <Plus className="w-3 h-3" /> Tambah Rekening
              </button>
            </div>
            <div className="space-y-3">
              {(content.accounts || []).map((ac: any) => (
                <ArrayItemRow key={ac.id} aKey="accounts" item={ac} fields={[
                  { name: 'bankName', label: 'Nama Bank' }, { name: 'accountNumber', label: 'Nomor Rekening' }, { name: 'accountName', label: 'Atas Nama' }
                ]} />
              ))}
            </div>
            <Input label="URL QRIS (opsional)" name="qrisImageUrl" value={content.qrisImageUrl} onChange={set} placeholder="https://..." />
            <Textarea label="Alamat Kirim Kado Fisik (opsional)" name="physicalGiftAddress" value={content.physicalGiftAddress} onChange={set} rows={2} />
          </div>
        )

      case 'contact':
        return (
          <div className="space-y-4">
            <Input label="Judul Seksi" name="sectionTitle" value={content.sectionTitle} onChange={set} placeholder="Hubungi Kami" />
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Kontak Person</label>
              <button onClick={() => addItem('contacts', { name: '', role: '', phone: '', whatsapp: '' })}
                className="text-xs text-pink-600 flex items-center gap-1 hover:text-pink-700">
                <Plus className="w-3 h-3" /> Tambah Kontak
              </button>
            </div>
            <div className="space-y-3">
              {(content.contacts || []).map((c: any) => (
                <ArrayItemRow key={c.id} aKey="contacts" item={c} fields={[
                  { name: 'name', label: 'Nama' }, { name: 'role', label: 'Peran / Hubungan' },
                  { name: 'phone', label: 'No. Telepon' }, { name: 'whatsapp', label: 'No. WhatsApp' }
                ]} />
              ))}
            </div>
          </div>
        )

      case 'video':
        return (
          <div className="space-y-4">
            <Input label="Judul Seksi" name="sectionTitle" value={content.sectionTitle} onChange={set} placeholder="Prewedding Video" />
            <Input label="URL Video (YouTube/Vimeo)" name="videoUrl" value={content.videoUrl} onChange={set} placeholder="https://youtube.com/embed/..." />
            <Input label="URL Thumbnail (opsional)" name="thumbnailUrl" value={content.thumbnailUrl} onChange={set} />
            <Textarea label="Deskripsi (opsional)" name="description" value={content.description} onChange={set} rows={2} />
          </div>
        )

      case 'rsvp':
        return (
          <div className="space-y-4">
            <Input label="Judul Seksi" name="sectionTitle" value={content.sectionTitle} onChange={set} placeholder="Konfirmasi Kehadiran" />
            <Textarea label="Deskripsi" name="description" value={content.description} onChange={set} rows={2} />
            <Input label="Label Tombol Kirim" name="submitButtonLabel" value={content.submitButtonLabel} onChange={set} placeholder="Konfirmasi Kehadiran" />
          </div>
        )

      case 'dresscode':
        return (
          <div className="space-y-4">
            <Input label="Judul Seksi" name="sectionTitle" value={content.sectionTitle} onChange={set} placeholder="Dresscode" />
            <Textarea label="Instruksi" name="instruction" value={content.instruction} onChange={set} rows={2} />
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Palet Warna</label>
              <button onClick={() => addItem('colors', { name: '', hex: '#FFFFFF', note: '' })}
                className="text-xs text-pink-600 flex items-center gap-1 hover:text-pink-700">
                <Plus className="w-3 h-3" /> Tambah Warna
              </button>
            </div>
            <div className="space-y-3">
              {(content.colors || []).map((c: any) => (
                <div key={c.id} className="p-3 bg-slate-50 rounded-xl border flex items-start gap-3">
                  <div>
                    <label className="text-xs text-slate-500">Warna</label>
                    <input type="color" value={c.hex || '#ffffff'} onChange={e => updateItem('colors', c.id, 'hex', e.target.value)}
                      className="block w-10 h-8 rounded cursor-pointer" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <input placeholder="Nama warna" value={c.name || ''} onChange={e => updateItem('colors', c.id, 'name', e.target.value)}
                      className="w-full px-2 py-1 text-xs border rounded-lg outline-none" />
                    <input placeholder="Catatan (opsional)" value={c.note || ''} onChange={e => updateItem('colors', c.id, 'note', e.target.value)}
                      className="w-full px-2 py-1 text-xs border rounded-lg outline-none" />
                  </div>
                  <button onClick={() => removeItem('colors', c.id)} className="text-red-400 hover:text-red-600 mt-4">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <Textarea label="Warna yang Dihindari" name="avoidColors" value={content.avoidColors} onChange={set} rows={2} />
            <Textarea label="Catatan Tambahan" name="note" value={content.note} onChange={set} rows={2} />
          </div>
        )

      case 'mengundang':
        return (
          <div className="space-y-4">
            <Input label="Judul Seksi" name="sectionTitle" value={content.sectionTitle} onChange={set} placeholder="Turut Mengundang" />
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Daftar Keluarga</label>
              <button onClick={() => addItem('families', { name: '', role: '' })}
                className="text-xs text-pink-600 flex items-center gap-1 hover:text-pink-700">
                <Plus className="w-3 h-3" /> Tambah Keluarga
              </button>
            </div>
            <div className="space-y-3">
              {(content.families || []).map((f: any) => (
                <ArrayItemRow key={f.id} aKey="families" item={f} fields={[
                  { name: 'name', label: 'Nama Keluarga' }, { name: 'role', label: 'Jabatan / Keterangan' }
                ]} />
              ))}
            </div>
            <Textarea label="Catatan (opsional)" name="note" value={content.note} onChange={set} rows={2} />
          </div>
        )

      case 'protokol':
        return (
          <div className="space-y-4">
            <Input label="Judul Seksi" name="sectionTitle" value={content.sectionTitle} onChange={set} placeholder="Protokol Kesehatan" />
            <Textarea label="Pembuka" name="introduction" value={content.introduction} onChange={set} rows={2} />
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Poin Protokol</label>
              <button onClick={() => addItem('items', { text: '' })}
                className="text-xs text-pink-600 flex items-center gap-1 hover:text-pink-700">
                <Plus className="w-3 h-3" /> Tambah Poin
              </button>
            </div>
            <div className="space-y-2">
              {(content.items || []).map((it: any) => (
                <div key={it.id} className="flex items-center gap-2">
                  <input value={it.text || ''} onChange={e => updateItem('items', it.id, 'text', e.target.value)}
                    placeholder="Isi protokol..." className="flex-1 px-3 py-2 text-sm border rounded-xl outline-none focus:border-pink-500" />
                  <button onClick={() => removeItem('items', it.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <Textarea label="Penutup (opsional)" name="closing" value={content.closing} onChange={set} rows={2} />
          </div>
        )

      default:
        return <p className="text-slate-500 text-sm text-center py-8">Pilih halaman untuk mengedit konten.</p>
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div>
          <h2 className="text-lg font-bold text-slate-800">{categoryInfo?.name || 'Edit Halaman'}</h2>
          <p className="text-xs text-slate-500 mt-0.5">Layout: {layoutInfo?.name || page.layoutId}</p>
        </div>
        {!hideSaveButton && (
          <button onClick={handleSave} disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-50">
            <Save className="w-4 h-4" /> {isSaving ? 'Menyimpan...' : 'Simpan'}
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-xl mx-auto">
          {renderForm()}
        </div>
      </div>
    </div>
  )
}
