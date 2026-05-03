'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCleanAppConfig } from '@/context/CleanAppConfigContext'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'

/**
 * CleanAppOrderForm Component
 * 
 * Order form for the CleanApp theme featuring:
 * - Input fields for name, email, phone, event type, and message
 * - Form validation using react-hook-form and Zod
 * - Form submission to backend API
 * - Success and error message display
 * - Appropriate input types for mobile optimization
 * - Touch-friendly input sizing (min 44px height)
 * - Proper ARIA labels for accessibility
 * 
 * Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6
 * 
 * Form Fields:
 * - Name (text, required)
 * - Email (email, required, validated)
 * - Phone (tel, required, validated)
 * - Event Type (select, required, options: "Pernikahan", "Ultah", "Lainnya")
 * - Message (textarea, optional)
 */

// Order form validation schema
const orderFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Nama wajib diisi')
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter'),
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
  phone: z
    .string()
    .min(1, 'Nomor telepon wajib diisi')
    .regex(
      /^(\+62|62|0)[0-9]{9,13}$/,
      'Nomor telepon tidak valid (contoh: 081234567890 atau +6281234567890)'
    ),
  eventType: z
    .string()
    .min(1, 'Jenis acara wajib dipilih'),
  message: z
    .string()
    .max(1000, 'Pesan maksimal 1000 karakter')
    .optional(),
})

type OrderFormData = z.infer<typeof orderFormSchema>

/**
 * CleanAppOrderForm Component
 * 
 * Renders an order form with validation and submission handling.
 * Uses react-hook-form for form state management and Zod for validation.
 * 
 * Features:
 * - Real-time validation with user-friendly error messages
 * - Loading state during submission
 * - Success message with form reset
 * - Error handling with actionable guidance
 * - Mobile-optimized input types (email, tel, textarea)
 * - Touch-friendly sizing (min 44px height for inputs)
 * - Accessible with proper ARIA labels
 */
export function CleanAppOrderForm() {
  const { config } = useCleanAppConfig()
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
  })

  const onSubmit = async (data: OrderFormData) => {
    setIsLoading(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      // Submit form data to backend API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.error || 
          errorData.message || 
          'Gagal mengirim pesanan. Silakan coba lagi.'
        )
      }

      // Show success state
      setSubmitSuccess(true)
      
      // Reset form after successful submission
      reset()

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 5000)
    } catch (error) {
      // Handle submission errors
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat mengirim pesanan. Silakan coba lagi atau hubungi kami melalui WhatsApp.'
      setSubmitError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section
      id="order"
      className="py-20 px-4"
      style={{ backgroundColor: config.colors.background }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Section Title */}
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-4"
          style={{ color: config.colors.textPrimary }}
        >
          Pesan Sekarang
        </h2>
        <p
          className="text-center mb-12 text-lg"
          style={{ color: config.colors.textSecondary }}
        >
          Isi formulir di bawah ini dan kami akan segera menghubungi Anda
        </p>

        {/* Order Form */}
        <div
          className="p-6 md:p-8 rounded-2xl shadow-lg"
          style={{ backgroundColor: config.colors.backgroundSecondary || '#FFFFFF' }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-semibold"
                style={{ color: config.colors.textPrimary }}
              >
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                placeholder="Masukkan nama lengkap Anda"
                disabled={isLoading || submitSuccess}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                className="w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                style={{
                  borderColor: errors.name
                    ? '#EF4444'
                    : config.colors.textSecondary + '40',
                  backgroundColor: '#FFFFFF',
                  color: config.colors.textPrimary,
                }}
                {...register('name')}
              />
              {errors.name && (
                <p
                  id="name-error"
                  className="text-sm text-red-500 flex items-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold"
                style={{ color: config.colors.textPrimary }}
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                inputMode="email"
                placeholder="contoh@email.com"
                autoComplete="email"
                disabled={isLoading || submitSuccess}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className="w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                style={{
                  borderColor: errors.email
                    ? '#EF4444'
                    : config.colors.textSecondary + '40',
                  backgroundColor: '#FFFFFF',
                  color: config.colors.textPrimary,
                }}
                {...register('email')}
              />
              {errors.email && (
                <p
                  id="email-error"
                  className="text-sm text-red-500 flex items-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="block text-sm font-semibold"
                style={{ color: config.colors.textPrimary }}
              >
                Nomor Telepon <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                placeholder="081234567890"
                autoComplete="tel"
                disabled={isLoading || submitSuccess}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
                className="w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                style={{
                  borderColor: errors.phone
                    ? '#EF4444'
                    : config.colors.textSecondary + '40',
                  backgroundColor: '#FFFFFF',
                  color: config.colors.textPrimary,
                }}
                {...register('phone')}
              />
              {errors.phone && (
                <p
                  id="phone-error"
                  className="text-sm text-red-500 flex items-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Event Type Field */}
            <div className="space-y-2">
              <label
                htmlFor="eventType"
                className="block text-sm font-semibold"
                style={{ color: config.colors.textPrimary }}
              >
                Jenis Acara <span className="text-red-500">*</span>
              </label>
              <select
                id="eventType"
                disabled={isLoading || submitSuccess}
                aria-invalid={!!errors.eventType}
                aria-describedby={errors.eventType ? 'eventType-error' : undefined}
                className="w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                style={{
                  borderColor: errors.eventType
                    ? '#EF4444'
                    : config.colors.textSecondary + '40',
                  backgroundColor: '#FFFFFF',
                  color: config.colors.textPrimary,
                }}
                {...register('eventType')}
              >
                <option value="">Pilih jenis acara</option>
                <option value="Pernikahan">Pernikahan</option>
                <option value="Ultah">Ulang Tahun</option>
                <option value="Lainnya">Lainnya</option>
              </select>
              {errors.eventType && (
                <p
                  id="eventType-error"
                  className="text-sm text-red-500 flex items-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.eventType.message}
                </p>
              )}
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <label
                htmlFor="message"
                className="block text-sm font-semibold"
                style={{ color: config.colors.textPrimary }}
              >
                Pesan (Opsional)
              </label>
              <textarea
                id="message"
                rows={4}
                placeholder="Ceritakan lebih detail tentang acara Anda..."
                disabled={isLoading || submitSuccess}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'message-error' : undefined}
                className="w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                style={{
                  borderColor: errors.message
                    ? '#EF4444'
                    : config.colors.textSecondary + '40',
                  backgroundColor: '#FFFFFF',
                  color: config.colors.textPrimary,
                }}
                {...register('message')}
              />
              {errors.message && (
                <p
                  id="message-error"
                  className="text-sm text-red-500 flex items-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Error Message */}
            {submitError && (
              <div
                className="p-4 rounded-lg flex items-start gap-3 bg-red-50 border border-red-200"
                role="alert"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">
                    Gagal Mengirim Pesanan
                  </p>
                  <p className="text-sm text-red-700 mt-1">{submitError}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {submitSuccess && (
              <div
                className="p-4 rounded-lg flex items-start gap-3 bg-green-50 border border-green-200"
                role="status"
              >
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">
                    Pesanan Berhasil Dikirim!
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    Terima kasih! Kami akan segera menghubungi Anda melalui email atau WhatsApp.
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || submitSuccess}
              className="w-full py-4 rounded-full font-semibold text-white text-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 min-h-[56px] flex items-center justify-center gap-2"
              style={{
                backgroundColor: config.colors.primary,
                boxShadow: `0 10px 30px ${config.colors.primary}40`,
              }}
              aria-label={isLoading ? 'Mengirim pesanan...' : 'Kirim pesanan'}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Mengirim...
                </>
              ) : submitSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Terkirim!
                </>
              ) : (
                'Kirim Pesanan'
              )}
            </button>

            {/* Required Fields Note */}
            <p
              className="text-sm text-center"
              style={{ color: config.colors.textSecondary }}
            >
              <span className="text-red-500">*</span> Wajib diisi
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
