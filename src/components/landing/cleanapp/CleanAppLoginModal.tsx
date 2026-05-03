'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCleanAppConfig } from '@/context/CleanAppConfigContext'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'

/**
 * CleanAppLoginModal Component
 * 
 * Modal dialog with authentication form for the CleanApp theme.
 * 
 * Features:
 * - Form validation using react-hook-form and Zod
 * - Error handling with user-friendly messages
 * - Loading states during authentication
 * - Success state handling
 * - Responsive design for mobile and desktop
 * 
 * Requirements: 9.3, 9.4, 9.5
 * 
 * @param isOpen - Controls modal visibility
 * @param onClose - Callback when modal is closed
 * @param onSuccess - Callback when authentication succeeds
 */

// Login form validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

interface CleanAppLoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CleanAppLoginModal({
  isOpen,
  onClose,
  onSuccess,
}: CleanAppLoginModalProps) {
  const { config } = useCleanAppConfig()
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [authSuccess, setAuthSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const handleClose = () => {
    // Reset form and states when closing
    reset()
    setAuthError(null)
    setAuthSuccess(false)
    setIsLoading(false)
    onClose()
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setAuthError(null)
    setAuthSuccess(false)

    try {
      // Call actual member login API
      const response = await fetch('/api/auth/member/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Login gagal. Silakan coba lagi.')
      }

      // Store member data in localStorage for persistence
      localStorage.setItem('memberToken', JSON.stringify(result.data))
      localStorage.setItem('memberId', result.data.id)

      console.log('Login successful:', { email: data.email, memberId: result.data.id })

      // Show success state
      setAuthSuccess(true)

      // Wait a moment to show success message, then close
      setTimeout(() => {
        reset()
        onSuccess()
      }, 1000)
    } catch (error) {
      // Handle authentication errors
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Login gagal. Silakan periksa kembali email dan password Anda.'
      setAuthError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-md"
        style={{
          backgroundColor: config.colors.backgroundSecondary || '#FFFFFF',
        }}
      >
        <DialogHeader>
          <DialogTitle
            className="text-2xl font-bold text-center"
            style={{ color: config.colors.textPrimary }}
          >
            Welcome Back
          </DialogTitle>
          <DialogDescription
            className="text-center"
            style={{ color: config.colors.textSecondary }}
          >
            Sign in to access your account and manage your invitations
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              style={{ color: config.colors.textPrimary }}
            >
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              disabled={isLoading || authSuccess}
              aria-invalid={!!errors.email}
              {...register('email')}
              style={{
                borderColor: errors.email
                  ? '#EF4444'
                  : config.colors.textSecondary + '40',
              }}
            />
            {errors.email && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              style={{ color: config.colors.textPrimary }}
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={isLoading || authSuccess}
              aria-invalid={!!errors.password}
              {...register('password')}
              style={{
                borderColor: errors.password
                  ? '#EF4444'
                  : config.colors.textSecondary + '40',
              }}
            />
            {errors.password && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Error Message */}
          {authError && (
            <div
              className="p-3 rounded-lg flex items-start gap-2 bg-red-50 border border-red-200"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">
                  Authentication Failed
                </p>
                <p className="text-sm text-red-700 mt-1">{authError}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {authSuccess && (
            <div
              className="p-3 rounded-lg flex items-center gap-2 bg-green-50 border border-green-200"
              role="status"
            >
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <p className="text-sm font-medium text-green-800">
                Login successful! Redirecting...
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold"
            disabled={isLoading || authSuccess}
            style={{
              backgroundColor: config.colors.primary,
              color: '#FFFFFF',
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : authSuccess ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Success!
              </>
            ) : (
              'Sign In'
            )}
          </Button>

          {/* Forgot Password Link */}
          <div className="text-center">
            <button
              type="button"
              className="text-sm hover:underline focus:outline-none focus:underline min-h-[44px] px-4"
              style={{ color: config.colors.primary }}
              disabled={isLoading || authSuccess}
              onClick={() => {
                // TODO: Implement forgot password functionality
                console.log('Forgot password clicked')
              }}
            >
              Forgot your password?
            </button>
          </div>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 pt-6 border-t text-center">
          <p style={{ color: config.colors.textSecondary }} className="text-sm">
            Don't have an account?{' '}
            <button
              type="button"
              className="font-semibold hover:underline focus:outline-none focus:underline min-h-[44px] inline-flex items-center px-2"
              style={{ color: config.colors.primary }}
              disabled={isLoading || authSuccess}
              onClick={() => {
                // TODO: Implement sign up functionality
                console.log('Sign up clicked')
              }}
            >
              Sign up
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
