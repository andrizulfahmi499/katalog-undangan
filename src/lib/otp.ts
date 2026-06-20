import { db } from './db'

const OTP_LENGTH = 6
const OTP_EXPIRY_MINUTES = 5
const MAX_ATTEMPTS = 5

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function createOTPSession(endUserId: string, purpose: 'login' | 'register' = 'login') {
  // Invalidate any previous OTP for this user
  await db.oTPSession.updateMany({
    where: { endUserId, verified: false },
    data: { verified: true }, // Mark old ones as used
  })

  const code = generateOTP()
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)

  const otpSession = await db.oTPSession.create({
    data: {
      endUserId,
      code,
      purpose,
      expiresAt,
    },
  })

  // Send OTP via email
  await sendOTPEmail(endUserId, code, purpose)

  return { expiresAt, sessionId: otpSession.id }
}

export async function verifyOTP(endUserId: string, code: string): Promise<{ valid: boolean; error?: string }> {
  const latestSession = await db.oTPSession.findFirst({
    where: {
      endUserId,
      verified: false,
    },
    orderBy: { createdAt: 'desc' },
  })

  if (!latestSession) {
    return { valid: false, error: 'Kode OTP tidak ditemukan. Silakan minta kode baru.' }
  }

  // Check expiry
  if (new Date() > latestSession.expiresAt) {
    await db.oTPSession.update({
      where: { id: latestSession.id },
      data: { verified: true },
    })
    return { valid: false, error: 'Kode OTP sudah kedaluwarsa. Silakan minta kode baru.' }
  }

  // Check attempts
  if (latestSession.attempts >= MAX_ATTEMPTS) {
    await db.oTPSession.update({
      where: { id: latestSession.id },
      data: { verified: true },
    })
    return { valid: false, error: 'Terlalu banyak percobaan. Silakan minta kode baru.' }
  }

  // Increment attempts
  await db.oTPSession.update({
    where: { id: latestSession.id },
    data: { attempts: { increment: 1 } },
  })

  // Check code
  if (latestSession.code !== code) {
    return { valid: false, error: 'Kode OTP salah. Silakan coba lagi.' }
  }

  // Mark as verified
  await db.oTPSession.update({
    where: { id: latestSession.id },
    data: { verified: true },
  })

  return { valid: true }
}

async function sendOTPEmail(endUserId: string, code: string, purpose: string) {
  const user = await db.endUser.findUnique({
    where: { id: endUserId },
    select: { email: true, name: true },
  })

  if (!user) throw new Error('User not found')

  const subject = purpose === 'register'
    ? `Kode Verifikasi - Editor Undangan v2`
    : `Kode Masuk - Editor Undangan v2`

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #3A5A40; font-size: 24px; margin: 0;">Editor Undangan v2</h1>
        <p style="color: #888; font-size: 14px; margin: 4px 0 0;">Digital Wedding Invitation</p>
      </div>
      <div style="background: #F9F7F4; border-radius: 16px; padding: 32px; text-align: center;">
        <p style="color: #333; font-size: 16px; margin: 0 0 8px;">Selamat Datang${user.name ? ', ' + user.name : ''}!</p>
        <p style="color: #666; font-size: 14px; margin: 0 0 24px;">
          Silakan masukkan kode berikut untuk memverifikasi email Anda.
        </p>
        <div style="background: white; border: 2px solid #E8E0D8; border-radius: 12px; padding: 20px; margin: 0 auto 24px; max-width: 280px;">
          <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #3A5A40;">${code}</span>
        </div>
        <p style="color: #999; font-size: 13px; margin: 0;">
          Kode ini berlaku selama ${OTP_EXPIRY_MINUTES} menit.<br>
          Jangan bagikan kode ini kepada siapapun.
        </p>
      </div>
      <p style="color: #bbb; font-size: 12px; text-align: center; margin: 24px 0 0;">
        &copy; 2026 Editor Undangan v2. All rights reserved.
      </p>
    </div>
  `

  // Try Resend API if configured
  const resendApiKey = process.env.RESEND_API_KEY
  if (resendApiKey) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(resendApiKey)
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@katalog-undangan.com',
        to: user.email,
        subject,
        html,
      })
      return
    } catch (error) {
      console.error('Resend email send failed:', error)
      // Fall through to console log
    }
  }

  // Fallback: log OTP to console (development mode)
  console.log(`\n========================================`)
  console.log(`  OTP for ${user.email}: ${code}`)
  console.log(`  Purpose: ${purpose}`)
  console.log(`  Expires: ${new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000).toISOString()}`)
  console.log(`========================================\n`)
}
