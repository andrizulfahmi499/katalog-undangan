'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Heart, Mail, RefreshCw, ArrowRight, CheckCircle } from 'lucide-react'

function StepIndicator({ current }: { current: number }) {
  const steps = ['Akun', 'Paket', 'Editor']
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              i + 1 <= current ? 'bg-[#3A5A40] text-white' : 'bg-[#D4C9B8] text-[#8B7E6F]'
            }`}>{i + 1}</div>
            <span className={`text-sm font-medium ${i + 1 <= current ? 'text-[#3A5A40]' : 'text-[#8B7E6F]'}`}>{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-12 h-[2px] mx-3 ${i + 1 < current ? 'bg-[#3A5A40]' : 'bg-[#D4C9B8]'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function OTPVerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId') || ''
  const email = searchParams.get('email') || ''
  const mode = searchParams.get('mode') || 'register'

  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(300) // 5 minutes
  const [loginEmail, setLoginEmail] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // If login mode without userId, show email input first
  const isLoginNoUser = mode === 'login' && !userId

  useEffect(() => {
    if (userId && countdown > 0) {
      const timer = setInterval(() => setCountdown(c => c - 1), 1000)
      return () => clearInterval(timer)
    }
  }, [userId, countdown])

  // Auto focus first input
  useEffect(() => {
    if (!isLoginNoUser && inputRefs.current[0]) {
      inputRefs.current[0]?.focus()
    }
  }, [isLoginNoUser])

  const handleDigitChange = (index: number, value: string) => {
    // Only allow single digits
    const digit = value.replace(/[^0-9]/g, '').slice(-1)
    const newCode = [...code]
    newCode[index] = digit
    setCode(newCode)
    setError('')

    // Auto focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6)
    if (pasted.length > 0) {
      const newCode = [...code]
      for (let i = 0; i < pasted.length; i++) {
        newCode[i] = pasted[i]
      }
      setCode(newCode)
      const focusIndex = Math.min(pasted.length, 5)
      inputRefs.current[focusIndex]?.focus()
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    const fullCode = code.join('')
    if (fullCode.length !== 6) {
      setError('Masukkan 6 digit kode OTP')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/v2/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code: fullCode }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Verifikasi gagal')

      // On success, check package status
      if (data.data.packageStatus === 'paid') {
        router.push('/v2/dashboard')
      } else if (data.data.packageType) {
        router.push('/v2/dashboard')
      } else {
        router.push('/v2/packages')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    setError('')

    try {
      const res = await fetch('/api/v2/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal mengirim ulang OTP')
      setCountdown(300)
      setCode(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsResending(false)
    }
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginEmail) return

    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/v2/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Email tidak ditemukan')

      // Navigate with userId
      router.push(`/v2/verify-otp?userId=${data.data.userId}&email=${encodeURIComponent(loginEmail)}&mode=login`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#E8E0D4] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/v2/register" className="flex items-center gap-2 text-[#3A5A40] hover:text-[#2D4732] transition-colors">
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

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <StepIndicator current={1} />

          <div className="bg-white rounded-2xl border border-[#E8E0D4] shadow-sm p-8">
            {isLoginNoUser ? (
              /* Login - Step 1: Enter email */
              <>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-full bg-[#3A5A40]/10 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-[#3A5A40]" />
                  </div>
                  <h1 className="text-2xl font-bold text-[#2D2D2D] mb-2">Login</h1>
                  <p className="text-sm text-[#8B7E6F]">Masukkan email untuk menerima kode OTP</p>
                </div>
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-2">Email</label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="email@contoh.com"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#D4C9B8] bg-[#FAFAF8] text-[#2D2D2D] placeholder-[#B0A898] focus:outline-none focus:border-[#3A5A40] focus:ring-1 focus:ring-[#3A5A40]/20 transition-all text-sm"
                    />
                  </div>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>
                  )}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                      isLoading ? 'bg-[#3A5A40]/60 cursor-not-allowed' : 'bg-[#3A5A40] hover:bg-[#2D4732]'
                    } text-white`}
                  >
                    {isLoading ? 'Memproses...' : 'Kirim OTP'}
                    {!isLoading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>
              </>
            ) : (
              /* Verify OTP */
              <>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-full bg-[#3A5A40]/10 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-[#3A5A40]" />
                  </div>
                  <h1 className="text-2xl font-bold text-[#2D2D2D] mb-2">Verifikasi Email</h1>
                  <p className="text-sm text-[#8B7E6F]">
                    Masukkan 6 digit kode yang dikirim ke
                  </p>
                  <p className="text-sm font-semibold text-[#3A5A40] mt-1">{decodeURIComponent(email)}</p>
                </div>

                <form onSubmit={handleVerify} className="space-y-5">
                  {/* OTP Inputs */}
                  <div className="flex justify-center gap-2" onPaste={handlePaste}>
                    {code.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { inputRefs.current[i] = el }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleDigitChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-[#D4C9B8] bg-[#FAFAF8] text-[#2D2D2D] focus:outline-none focus:border-[#3A5A40] focus:ring-2 focus:ring-[#3A5A40]/20 transition-all"
                      />
                    ))}
                  </div>

                  {/* Countdown & Resend */}
                  <div className="text-center">
                    {countdown > 0 ? (
                      <p className="text-sm text-[#8B7E6F]">
                        Kode berlaku selama <span className="font-semibold text-[#3A5A40]">{formatTime(countdown)}</span>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={isResending}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3A5A40] hover:text-[#2D4732] disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                        {isResending ? 'Mengirim...' : 'Kirim Ulang OTP'}
                      </button>
                    )}
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || code.join('').length !== 6}
                    className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                      isLoading || code.join('').length !== 6
                        ? 'bg-[#3A5A40]/60 cursor-not-allowed'
                        : 'bg-[#3A5A40] hover:bg-[#2D4732] active:scale-[0.98]'
                    } text-white`}
                  >
                    {isLoading ? 'Memverifikasi...' : 'Verifikasi'}
                    {!isLoading && <CheckCircle className="w-4 h-4" />}
                  </button>
                </form>
              </>
            )}

            <p className="text-center text-xs text-[#8B7E6F] mt-6">
              Belum punya akun?{' '}
              <Link href="/v2/register" className="text-[#3A5A40] font-semibold hover:underline">
                Daftar di sini
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center text-[#8B7E6F]">Loading...</div>}>
      <OTPVerifyContent />
    </Suspense>
  )
}
