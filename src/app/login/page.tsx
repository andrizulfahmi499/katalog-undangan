'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Shield, User, Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react'

type LoginType = null | 'admin' | 'member'

// Starry background component using pure CSS
function StarryBackground() {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number; duration: number }>>([])

  useEffect(() => {
    const generated = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 60, // stars only in top 60%
      size: Math.random() * 2.5 + 0.5,
      delay: Math.random() * 3,
      duration: Math.random() * 2 + 1.5,
    }))
    setStars(generated)
  }, [])

  return (
    <>
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
    </>
  )
}

export default function LoginPage() {
  const [loginType, setLoginType] = useState<LoginType>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleBack = () => {
    setLoginType(null)
    setEmail('')
    setPassword('')
    setError('')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const endpoint = loginType === 'admin' ? '/api/auth/admin/login' : '/api/auth/member/login'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login gagal')
      }

      // Store user data in localStorage
      if (data.success && data.data) {
        localStorage.setItem(loginType === 'admin' ? 'adminId' : 'memberId', data.data.id)
        localStorage.setItem(loginType === 'admin' ? 'adminName' : 'memberName', data.data.name)
        localStorage.setItem(loginType === 'admin' ? 'adminEmail' : 'memberEmail', data.data.email)
      }

      // Redirect to respective dashboard
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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* === CSS Keyframes === */}
      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
      `}</style>

      {/* === Background Layers === */}
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0221] via-[#2a0845] via-40% to-[#6b21a8]" />

      {/* Purple aurora / mountain glow */}
      <div
        className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px]"
        style={{
          background: 'radial-gradient(ellipse, rgba(168,85,247,0.5) 0%, rgba(107,33,168,0.2) 50%, transparent 70%)',
          animation: 'glow 4s ease-in-out infinite',
        }}
      />

      {/* Stars */}
      <StarryBackground />

      {/* Mountain / hill silhouettes */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 400" preserveAspectRatio="none" style={{ height: '45%' }}>
        {/* Far mountains - darkest purple */}
        <path d="M0,250 L100,180 L200,220 L350,120 L500,200 L650,100 L800,180 L950,90 L1100,170 L1250,110 L1350,190 L1440,150 L1440,400 L0,400Z" fill="#1a0533" opacity="0.9" />
        {/* Mid mountains */}
        <path d="M0,300 L150,230 L300,270 L450,180 L600,250 L750,170 L900,240 L1050,160 L1200,230 L1350,185 L1440,220 L1440,400 L0,400Z" fill="#2d1054" opacity="0.85" />
        {/* Near hills */}
        <path d="M0,340 L200,290 L400,320 L600,270 L800,310 L1000,260 L1200,300 L1440,280 L1440,400 L0,400Z" fill="#1e0a3c" opacity="0.95" />
      </svg>

      {/* Pine forest silhouettes - front */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 250" preserveAspectRatio="none" style={{ height: '30%' }}>
        {/* Tree row 1 - far */}
        <g fill="#120726" opacity="0.7">
          <polygon points="50,250 65,120 80,250" />
          <polygon points="100,250 118,90 136,250" />
          <polygon points="170,250 185,130 200,250" />
          <polygon points="230,250 248,100 266,250" />
          <polygon points="310,250 325,140 340,250" />
          <polygon points="380,250 398,80 416,250" />
          <polygon points="460,250 475,120 490,250" />
          <polygon points="530,250 548,95 566,250" />
          <polygon points="620,250 635,130 650,250" />
          <polygon points="700,250 718,85 736,250" />
          <polygon points="780,250 795,125 810,250" />
          <polygon points="860,250 878,100 896,250" />
          <polygon points="940,250 955,130 970,250" />
          <polygon points="1020,250 1038,90 1056,250" />
          <polygon points="1100,250 1115,120 1130,250" />
          <polygon points="1170,250 1188,105 1206,250" />
          <polygon points="1250,250 1265,130 1280,250" />
          <polygon points="1330,250 1348,85 1366,250" />
          <polygon points="1400,250 1418,115 1436,250" />
        </g>
        {/* Tree row 2 - closer, darker */}
        <g fill="#0a0318" opacity="0.9">
          <polygon points="20,250 40,150 60,250" />
          <polygon points="80,250 102,110 124,250" />
          <polygon points="140,250 160,160 180,250" />
          <polygon points="210,250 235,100 260,250" />
          <polygon points="280,250 300,145 320,250" />
          <polygon points="350,250 375,90 400,250" />
          <polygon points="420,250 440,140 460,250" />
          <polygon points="490,250 515,105 540,250" />
          <polygon points="560,250 580,150 600,250" />
          <polygon points="630,250 655,95 680,250" />
          <polygon points="710,250 730,135 750,250" />
          <polygon points="780,250 805,100 830,250" />
          <polygon points="850,250 870,150 890,250" />
          <polygon points="920,250 945,90 970,250" />
          <polygon points="1000,250 1020,140 1040,250" />
          <polygon points="1060,250 1085,100 1110,250" />
          <polygon points="1130,250 1150,145 1170,250" />
          <polygon points="1200,250 1225,95 1250,250" />
          <polygon points="1270,250 1290,135 1310,250" />
          <polygon points="1340,250 1365,105 1390,250" />
          <polygon points="1410,250 1430,130 1440,250" />
        </g>
      </svg>

      {/* === Content === */}
      <div className="w-full max-w-4xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-[0_2px_10px_rgba(168,85,247,0.5)]">
            Selamat Datang
          </h1>
          <p className="text-purple-200/90 text-lg font-medium">
            Pilih jenis akun untuk melanjutkan
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Selection Screen */}
          {loginType === null && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto"
            >
              {/* Admin Card */}
              <motion.button
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setLoginType('admin')}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-white/15 hover:border-white/30 transition-all duration-300 text-left group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Admin</h2>
                    <p className="text-sm text-purple-300">Portal Pengelola</p>
                  </div>
                </div>
                <p className="text-white/70 mb-5 text-sm leading-relaxed">
                  Kelola member, undangan, dan transaksi credit point
                </p>
                <div className="flex items-center text-purple-300 font-semibold text-sm group-hover:text-white group-hover:translate-x-2 transition-all">
                  Login sebagai Admin <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </motion.button>

              {/* Member Card */}
              <motion.button
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setLoginType('member')}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-white/15 hover:border-white/30 transition-all duration-300 text-left group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Member</h2>
                    <p className="text-sm text-pink-300">Portal Pengguna</p>
                  </div>
                </div>
                <p className="text-white/70 mb-5 text-sm leading-relaxed">
                  Kirim undangan digital dengan personalisasi pesan
                </p>
                <div className="flex items-center text-pink-300 font-semibold text-sm group-hover:text-white group-hover:translate-x-2 transition-all">
                  Login sebagai Member <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </motion.button>
            </motion.div>
          )}

          {/* Login Form */}
          {loginType && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-md mx-auto"
            >
              {/* Back Button */}
              <motion.button
                whileHover={{ x: -3 }}
                onClick={handleBack}
                className="flex items-center gap-2 text-purple-300 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Kembali
              </motion.button>

              {/* Glassmorphism Form Card */}
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center border border-white/20 ${
                    loginType === 'admin'
                      ? 'bg-purple-500/30 backdrop-blur-sm'
                      : 'bg-pink-500/30 backdrop-blur-sm'
                  }`}>
                    {loginType === 'admin' ? (
                      <Shield className="w-8 h-8 text-white" />
                    ) : (
                      <User className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Login {loginType === 'admin' ? 'Admin' : 'Member'}
                  </h2>
                  <p className="text-purple-200/80 text-sm">
                    {loginType === 'admin'
                      ? 'Masuk ke dashboard pengelolaan'
                      : 'Masuk ke dashboard pengiriman undangan'}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-5">
                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300/60" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Masukkan email anda"
                        required
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-purple-400 focus:bg-white/15 focus:outline-none transition-all backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300/60" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukkan password anda"
                        required
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-purple-400 focus:bg-white/15 focus:outline-none transition-all backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-xl text-sm backdrop-blur-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Submit Button - White pill */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    className={`w-full py-3.5 rounded-full font-semibold text-purple-900 bg-white hover:bg-purple-50 shadow-lg shadow-white/20 transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Memproses...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Login <ArrowRight className="w-5 h-5 ml-2" />
                      </span>
                    )}
                  </motion.button>
                </form>

                {/* Info */}
                {loginType === 'member' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-300 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-purple-200/80">
                        <p className="font-medium mb-1 text-purple-200">Akun Member</p>
                        <p>Akun member harus dibuat terlebih dahulu oleh admin. Hubungi admin untuk pendaftaran akun.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
