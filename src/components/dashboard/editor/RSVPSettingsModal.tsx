'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ToggleLeft, ToggleRight, Pencil, Trash2, Plus, Check, ChevronDown, Phone } from 'lucide-react'

type RSVPField = {
  id: string
  label: string
  enabled: boolean
  required: boolean
  editable: boolean
}

type CustomField = {
  id: string
  label: string
  type: 'text' | 'select'
  options?: string[]
  enabled: boolean
}

type RSVPConfig = {
  isActive: boolean
  whoCanFill: string
  showPublicComments: boolean
  enableReconfirm: boolean
  enableQRDownload: boolean
  defaultCountryCode: string
  fields: RSVPField[]
  customFields: CustomField[]
}

type RSVPSettingsModalProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (config: RSVPConfig) => void
  initialConfig?: Partial<RSVPConfig>
}

const DEFAULT_FIELDS: RSVPField[] = [
  { id: 'name', label: 'Nama', enabled: true, required: true, editable: false },
  { id: 'group', label: 'Grup / Rombongan', enabled: true, required: false, editable: true },
  { id: 'whatsapp', label: 'No. WhatsApp', enabled: true, required: false, editable: true },
  { id: 'attendance', label: 'Kehadiran', enabled: true, required: true, editable: true },
  { id: 'guestCount', label: 'Jumlah Tamu', enabled: true, required: false, editable: true },
  { id: 'message', label: 'Komentar atau Ucapan', enabled: true, required: false, editable: true },
]

export default function RSVPSettingsModal({ isOpen, onClose, onSave, initialConfig }: RSVPSettingsModalProps) {
  const [config, setConfig] = useState<RSVPConfig>({
    isActive: initialConfig?.isActive ?? true,
    whoCanFill: initialConfig?.whoCanFill ?? 'all',
    showPublicComments: initialConfig?.showPublicComments ?? true,
    enableReconfirm: initialConfig?.enableReconfirm ?? false,
    enableQRDownload: initialConfig?.enableQRDownload ?? false,
    defaultCountryCode: initialConfig?.defaultCountryCode ?? '+62',
    fields: initialConfig?.fields ?? DEFAULT_FIELDS,
    customFields: initialConfig?.customFields ?? [],
  })

  const [editingFieldId, setEditingFieldId] = useState<string | null>(null)
  const [editingLabel, setEditingLabel] = useState('')
  const [newCustomLabel, setNewCustomLabel] = useState('')
  const [showAddCustom, setShowAddCustom] = useState(false)

  if (!isOpen) return null

  const updateConfig = (key: keyof RSVPConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const toggleField = (id: string) => {
    setConfig(prev => ({
      ...prev,
      fields: prev.fields.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f)
    }))
  }

  const startEditLabel = (field: RSVPField) => {
    setEditingFieldId(field.id)
    setEditingLabel(field.label)
  }

  const saveEditLabel = (id: string) => {
    setConfig(prev => ({
      ...prev,
      fields: prev.fields.map(f => f.id === id ? { ...f, label: editingLabel } : f)
    }))
    setEditingFieldId(null)
  }

  const addCustomField = () => {
    if (!newCustomLabel.trim()) return
    const newField: CustomField = {
      id: `custom-${Date.now()}`,
      label: newCustomLabel.trim(),
      type: 'text',
      enabled: true,
    }
    setConfig(prev => ({ ...prev, customFields: [...prev.customFields, newField] }))
    setNewCustomLabel('')
    setShowAddCustom(false)
  }

  const removeCustomField = (id: string) => {
    setConfig(prev => ({ ...prev, customFields: prev.customFields.filter(f => f.id !== id) }))
  }

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-pink-500' : 'bg-slate-200'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${checked ? 'left-6' : 'left-1'}`} />
    </button>
  )

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Pengaturan RSVP</h2>
              <p className="text-sm text-slate-500 mt-1">Kelola formulir kehadiran dan privasi tamu undangan.</p>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50">
            
            {/* Status & Visibilitas */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Status & Visibilitas</h3>

              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div>
                  <p className="font-medium text-slate-700 text-sm">Fitur RSVP Aktif</p>
                  <p className="text-xs text-slate-500 mt-0.5">Tampilkan formulir kehadiran di undangan</p>
                </div>
                <ToggleSwitch checked={config.isActive} onChange={() => updateConfig('isActive', !config.isActive)} />
              </div>

              <div className={`space-y-4 transition-opacity ${!config.isActive ? 'opacity-40 pointer-events-none' : ''}`}>
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <div>
                    <p className="font-medium text-slate-700 text-sm">Tampilkan Komentar ke Publik</p>
                    <p className="text-xs text-slate-500 mt-0.5">Ucapan tamu bisa dibaca oleh tamu lain</p>
                  </div>
                  <ToggleSwitch checked={config.showPublicComments} onChange={() => updateConfig('showPublicComments', !config.showPublicComments)} />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <div>
                    <p className="font-medium text-slate-700 text-sm">Tombol Konfirmasi Ulang</p>
                    <p className="text-xs text-slate-500 mt-0.5">Tamu bisa konfirmasi ulang kehadiran di venue</p>
                  </div>
                  <ToggleSwitch checked={config.enableReconfirm} onChange={() => updateConfig('enableReconfirm', !config.enableReconfirm)} />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <div>
                    <p className="font-medium text-slate-700 text-sm">Download QR Code Tamu</p>
                    <p className="text-xs text-slate-500 mt-0.5">Tamu bisa download QR untuk check-in di venue</p>
                  </div>
                  <ToggleSwitch checked={config.enableQRDownload} onChange={() => updateConfig('enableQRDownload', !config.enableQRDownload)} />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">Siapa yang Bisa Mengisi</label>
                  <div className="relative">
                    <select
                      value={config.whoCanFill}
                      onChange={(e) => updateConfig('whoCanFill', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-200 outline-none appearance-none bg-white"
                    >
                      <option value="all">Semua tamu undangan</option>
                      <option value="registered">Hanya tamu terdaftar</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">Kode Negara Default</label>
                  <div className="relative">
                    <select
                      value={config.defaultCountryCode}
                      onChange={(e) => updateConfig('defaultCountryCode', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-200 outline-none appearance-none bg-white"
                    >
                      <option value="+62">Indonesia +62</option>
                      <option value="+60">Malaysia +60</option>
                      <option value="+65">Singapura +65</option>
                      <option value="+1">Amerika +1</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Kustomisasi Field */}
            <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3 transition-opacity ${!config.isActive ? 'opacity-40 pointer-events-none' : ''}`}>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Kustomisasi Field Formulir</h3>

              {config.fields.map((field) => (
                <div key={field.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <ToggleSwitch
                    checked={field.enabled}
                    onChange={() => !field.required && toggleField(field.id)}
                  />
                  <div className="flex-1 min-w-0">
                    {editingFieldId === field.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingLabel}
                          onChange={(e) => setEditingLabel(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-pink-300 text-sm outline-none focus:ring-1 focus:ring-pink-200"
                          autoFocus
                        />
                        <button
                          onClick={() => saveEditLabel(field.id)}
                          className="p-1.5 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <p className={`text-sm font-medium ${!field.enabled ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                        {field.label}
                        {field.required && <span className="ml-1 text-xs text-pink-500 font-semibold">(Wajib)</span>}
                      </p>
                    )}
                  </div>
                  {field.editable && editingFieldId !== field.id && (
                    <button
                      onClick={() => startEditLabel(field)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}

              {/* Custom Fields */}
              {config.customFields.map((field) => (
                <div key={field.id} className="flex items-center gap-3 p-3 rounded-xl bg-pink-50 border border-pink-100">
                  <ToggleSwitch checked={field.enabled} onChange={() =>
                    setConfig(prev => ({
                      ...prev,
                      customFields: prev.customFields.map(f => f.id === field.id ? { ...f, enabled: !f.enabled } : f)
                    }))
                  } />
                  <p className="flex-1 text-sm font-medium text-slate-700">{field.label}</p>
                  <span className="text-xs text-pink-500 font-medium px-2 py-0.5 bg-pink-100 rounded-full">Kustom</span>
                  <button
                    onClick={() => removeCustomField(field.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Add Custom Field */}
              {showAddCustom ? (
                <div className="flex items-center gap-2 p-3 rounded-xl border-2 border-dashed border-pink-300 bg-pink-50/50">
                  <input
                    type="text"
                    value={newCustomLabel}
                    onChange={(e) => setNewCustomLabel(e.target.value)}
                    placeholder="Contoh: Pilih Menu Makanan"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-pink-500"
                    onKeyDown={(e) => e.key === 'Enter' && addCustomField()}
                    autoFocus
                  />
                  <button onClick={addCustomField} className="p-1.5 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => setShowAddCustom(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddCustom(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm font-medium text-slate-500 hover:border-pink-300 hover:text-pink-600 hover:bg-pink-50/50 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Tambah Inputan Kustom
                </button>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-slate-100 bg-white flex justify-end gap-3">
            <button onClick={onClose} className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors">
              Batal
            </button>
            <button
              onClick={() => onSave(config)}
              className="px-8 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-pink-500/20"
            >
              Simpan Perubahan
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
