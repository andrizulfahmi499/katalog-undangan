'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Shield, User, Mail, Lock, ArrowRight, CheckCircle, Heart, Sparkles } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

type LoginType = null | 'admin' | 'member' | 'customer'

// ─── Matching Botanical Floral (same as DearMyLoveClone) ─────────────────────
const FloralBotanical = ({ className = '', mirrored = false }: { className?: string; mirrored?: boolean }) => (
  <img
    src="/images/floral-bg.svg"
    alt="Floral Pattern"
    className={className}
    style={mirrored ? { transform: 'scaleX(-1)' } : {}}
  />
)

function LoginForm() {
  const searchParams = useSearchParams()
  const [loginType, setLoginType] = useState<LoginType>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const role = searchParams.get('role')
    if (role === 'admin' || role === 'member' || role === 'customer') {
      setLoginType(role as LoginType)
    }
  }, [searchParams])

  const handleBack = () => {
    setLoginType(null)
    setEmail('')
    setPassword('')
    setError('')
  }

  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      // Try login (sends OTP to email)
      const response = await fetch('/api/v2/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()
      if (!response.ok) {
        if (response.status === 404) {
          // User not found, redirect to register
          window.location.href = `/v2/register?email=${encodeURIComponent(email)}`
          return
        }
        throw new Error(data.error || 'Login gagal')
      }
      // OTP sent, redirect to verify
      window.location.href = `/v2/verify-otp?userId=${data.data.userId}&email=${encodeURIComponent(email)}&mode=login`
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat login')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Customer uses separate OTP flow
    if (loginType === 'customer') return handleCustomerLogin(e)

    try {
      const endpoint = loginType === 'admin' ? '/api/auth/admin/login' : '/api/auth/member/login'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login gagal')
      }

      if (data.success && data.data) {
        localStorage.setItem(loginType === 'admin' ? 'adminId' : 'memberId', data.data.id)
        localStorage.setItem(loginType === 'admin' ? 'adminName' : 'memberName', data.data.name)
        localStorage.setItem(loginType === 'admin' ? 'adminEmail' : 'memberEmail', data.data.email)
      }

      if (loginType === 'admin') {
        window.location.href = '/admin/dashboard'
      } else {
        window.location.href = '/member/dashboard'
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-b from-[#172a26] to-[#1e3630]">

      {/* ── Background Botanical Florals ─────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{ rotate: [-1.5, 1.5, -1.5], y: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 11, ease: 'easeInOut' }}
          className="absolute -left-16 -top-8 opacity-[0.15] w-[380px] h-[480px]"
        >
          <FloralBotanical className="w-full h-full" />
        </motion.div>
        <motion.div
          animate={{ rotate: [1.5, -1.5, 1.5], y: [5, -5, 5] }}
          transition={{ repeat: Infinity, duration: 13, ease: 'easeInOut' }}
          className="absolute -right-16 -top-8 opacity-[0.15] w-[380px] h-[480px]"
        >
          <FloralBotanical className="w-full h-full" mirrored />
        </motion.div>
        <motion.div
          animate={{ rotate: [-2, 2, -2], y: [-4, 4, -4] }}
          transition={{ repeat: Infinity, duration: 16, ease: 'easeInOut' }}
          className="absolute -left-10 bottom-10 opacity-[0.10] w-[260px] h-[340px]"
        >
          <FloralBotanical className="w-full h-full" />
        </motion.div>
        <motion.div
          animate={{ rotate: [2, -2, 2], y: [4, -4, 4] }}
          transition={{ repeat: Infinity, duration: 18, ease: 'easeInOut' }}
          className="absolute -right-10 bottom-10 opacity-[0.10] w-[260px] h-[340px]"
        >
          <FloralBotanical className="w-full h-full" mirrored />
        </motion.div>
      </div>

      {/* ── Back to Landing Button ─────────────────────────────── */}
      <Link href="/" className="absolute top-8 left-8 z-30 flex items-center gap-2 text-white/70 hover:text-white transition-colors group pointer-events-auto">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Beranda</span>
      </Link>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <div className="w-full max-w-4xl relative z-10 mt-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-[0.05em]">
            Selamat Datang
          </h1>
          <p className="text-white/50 text-sm tracking-widest uppercase">
            Pilih jenis akun untuk melanjutkan
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {loginType === null && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto px-4"
            >
              {/* Admin Card */}
              <motion.button
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setLoginType('admin')}
                className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-6 transition-all duration-300 text-left group hover:bg-white/15 hover:border-white/25"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20">
                    <Shield className="w-6 h-6 text-[#66d7ee]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Admin</h2>
                    <p className="text-xs text-white/50 font-medium">Portal Pengelola</p>
                  </div>
                </div>
                <p className="text-white/40 mb-4 text-xs leading-relaxed">
                  Kelola member, paket, transaksi, dan undangan
                </p>
                <div className="flex items-center text-white/70 font-semibold text-xs group-hover:translate-x-2 transition-all">
                  Login Admin <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </div>
              </motion.button>

              {/* Member Card */}
              <motion.button
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setLoginType('member')}
                className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-6 transition-all duration-300 text-left group hover:bg-white/15 hover:border-white/25"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20">
                    <User className="w-6 h-6 text-[#f4dc9c]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Member</h2>
                    <p className="text-xs text-white/50 font-medium">Reseller / Pengguna</p>
                  </div>
                </div>
                <p className="text-white/40 mb-4 text-xs leading-relaxed">
                  Kirim undangan digital dengan personalisasi pesan
                </p>
                <div className="flex items-center text-white/70 font-semibold text-xs group-hover:translate-x-2 transition-all">
                  Login Member <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </div>
              </motion.button>

              {/* Customer Card - NEW */}
              <motion.button
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setLoginType('customer')}
                className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-6 transition-all duration-300 text-left group hover:bg-white/15 hover:border-white/25 relative overflow-hidden"
              >
                <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Baru
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center border border-pink-400/20">
                    <Heart className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Customer</h2>
                    <p className="text-xs text-white/50 font-medium">Editor Undangan v2</p>
                  </div>
                </div>
                <p className="text-white/40 mb-4 text-xs leading-relaxed">
                  Buat undangan pernikahan digital tanpa ribet
                </p>
                <div className="flex items-center text-pink-300/80 font-semibold text-xs group-hover:translate-x-2 transition-all">
                  Login Customer <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </div>
              </motion.button>
            </motion.div>
          )}

          {loginType && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-md mx-auto relative px-4"
            >
              <div className="flex justify-start mb-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBack}
                  className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 border border-white/15 text-white/70 hover:bg-white/20 hover:text-white transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Login Card — DearMyLove style */}
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-[2rem] p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-white/15 border border-white/25">
                    {loginType === 'admin' && <Shield className="w-8 h-8 text-[#66d7ee]" />}
                    {loginType === 'member' && <User className="w-8 h-8 text-[#f4dc9c]" />}
                    {loginType === 'customer' && <Heart className="w-8 h-8 text-pink-400" />}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-1 tracking-wide">
                    {loginType === 'customer' ? 'Login Customer' : `Login ${loginType === 'admin' ? 'Admin' : 'Member'}`}
                  </h2>
                  <p className="text-white/40 text-xs tracking-widest uppercase">
                    {loginType === 'customer' ? 'Login dengan verifikasi email' : 'Masukkan kredensial Anda'}
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2 px-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Masukkan email..."
                        required
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all text-sm"
                      />
                    </div>
                  </div>

                  {/* Password - hidden for customer (uses OTP instead) */}
                  {loginType !== 'customer' && (
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2 px-1">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required={loginType !== 'customer' as any}
                          className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-500/15 border border-red-400/30 text-red-300 px-4 py-3 rounded-xl text-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    className={`mt-4 w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                      isLoading ? 'opacity-60 cursor-not-allowed' : ''
                    } bg-[#ededed] text-[#172a26] hover:bg-white`}
                  >
                    {isLoading ? 'Memproses...' : loginType === 'customer' ? 'Kirim Kode OTP' : 'Login Sekarang'}
                    {!isLoading && loginType === 'customer' ? <Sparkles className="w-5 h-5" /> : !isLoading ? <ArrowRight className="w-5 h-5" /> : null}
                  </motion.button>
                </form>

                {loginType === 'member' && (
                  <div className="mt-6 flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <CheckCircle className="w-4 h-4 text-[#ededed]/60 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-white/40">
                      <p className="font-semibold text-white/60 mb-0.5">Info Akun Member</p>
                      <p>Akun member harus dibuat terlebih dahulu oleh admin aplikasi.</p>
                    </div>
                  </div>
                )}

                {loginType === 'customer' && (
                  <div className="mt-6 flex items-start gap-3 p-4 rounded-2xl bg-pink-500/10 border border-pink-400/20">
                    <Heart className="w-4 h-4 text-pink-300 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-white/40">
                      <p className="font-semibold text-pink-200/80 mb-0.5">Login Customer</p>
                      <p>Cukup masukkan email, kode verifikasi (OTP) akan dikirim ke email Anda. Tidak perlu password.</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#172a26] flex items-center justify-center text-white">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
