'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Mail, Phone, ArrowRight, Heart } from 'lucide-react'

function StepIndicator({ current }: { current: number }) {
  const steps = ['Akun', 'Paket', 'Editor']
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              i + 1 <= current
                ? 'bg-[#3A5A40] text-white'
                : 'bg-[#D4C9B8] text-[#8B7E6F]'
            }`}>
              {i + 1}
            </div>
            <span className={`text-sm font-medium ${
              i + 1 <= current ? 'text-[#3A5A40]' : 'text-[#8B7E6F]'
            }`}>{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-12 h-[2px] mx-3 ${
              i + 1 < current ? 'bg-[#3A5A40]' : 'bg-[#D4C9B8]'
            }`} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/v2/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, whatsapp }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 409) {
          // User exists, redirect to login OTP
          const loginRes = await fetch('/api/v2/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          })
          const loginData = await loginRes.json()
          if (loginRes.ok) {
            router.push(`/v2/verify-otp?userId=${loginData.data.userId}&email=${encodeURIComponent(email)}&mode=login`)
          } else {
            setError(loginData.error || 'Gagal mengirim OTP')
          }
        } else {
          setError(data.error || 'Registrasi gagal')
        }
        return
      }

      router.push(`/v2/verify-otp?userId=${data.data.userId}&email=${encodeURIComponent(email)}&mode=register`)
    } catch (err: any) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#E8E0D4] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#3A5A40] hover:text-[#2D4732] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Kembali</span>
          </Link>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#3A5A40] fill-[#3A5A40]" />
            <span className="font-bold text-[#3A5A40] text-lg">Editor Undangan</span>
          </div>
          <div className="w-24" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <StepIndicator current={1} />

          <div className="bg-white rounded-2xl border border-[#E8E0D4] shadow-sm p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-[#2D2D2D] mb-2">Buat Akun Baru</h1>
              <p className="text-sm text-[#8B7E6F]">Mulai buat undangan pernikahan digitalmu</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B0A898]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan nama lengkap..."
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D4C9B8] bg-[#FAFAF8] text-[#2D2D2D] placeholder-[#B0A898] focus:outline-none focus:border-[#3A5A40] focus:ring-1 focus:ring-[#3A5A40]/20 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B0A898]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@contoh.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D4C9B8] bg-[#FAFAF8] text-[#2D2D2D] placeholder-[#B0A898] focus:outline-none focus:border-[#3A5A40] focus:ring-1 focus:ring-[#3A5A40]/20 transition-all text-sm"
                  />
                </div>
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">WhatsApp <span className="text-[#B0A898]">(opsional)</span></label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B0A898]" />
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D4C9B8] bg-[#FAFAF8] text-[#2D2D2D] placeholder-[#B0A898] focus:outline-none focus:border-[#3A5A40] focus:ring-1 focus:ring-[#3A5A40]/20 transition-all text-sm"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                  isLoading
                    ? 'bg-[#3A5A40]/60 cursor-not-allowed'
                    : 'bg-[#3A5A40] hover:bg-[#2D4732] active:scale-[0.98]'
                } text-white`}
              >
                {isLoading ? 'Memproses...' : 'Daftar & Kirim OTP'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <p className="text-center text-xs text-[#8B7E6F] mt-6">
              Sudah punya akun?{' '}
              <Link href="/v2/verify-otp?mode=login" className="text-[#3A5A40] font-semibold hover:underline">
                Login di sini
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-[#B0A898] mt-6">
            Dengan mendaftar, kamu menyetujui Syarat & Ketentuan kami
          </p>
        </div>
      </main>
    </div>
  )
}
