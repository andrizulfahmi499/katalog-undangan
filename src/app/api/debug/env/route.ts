import { NextResponse } from 'next/server'

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL || 'NOT_SET'

  // Mask password for security
  let maskedUrl = databaseUrl
  if (databaseUrl.includes('://')) {
    const url = new URL(databaseUrl)
    const password = url.password
    if (password) {
      url.password = password.substring(0, 2) + '***' + password.substring(password.length - 2)
    }
    maskedUrl = url.toString()
  }

  return NextResponse.json({
    databaseUrl: maskedUrl,
    isSet: !!databaseUrl && databaseUrl !== 'NOT_SET',
    hasSSL: databaseUrl.includes('sslmode=require'),
    provider: databaseUrl.includes('postgresql') ? 'postgresql' : 'unknown',
    hostname: databaseUrl.split('@')[1]?.split(':')[0] || 'unknown'
  })
}
