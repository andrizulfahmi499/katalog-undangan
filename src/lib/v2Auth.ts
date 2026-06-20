import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { db } from './db'

const JWT_SECRET = new TextEncoder().encode(
  process.env.V2_JWT_SECRET || 'katalog-undangan-v2-secret-key-change-in-production'
)

const COOKIE_NAME = 'v2_session'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export interface V2Session {
  userId: string
  email: string
  name: string
}

export async function createSessionToken(session: V2Session): Promise<string> {
  return new SignJWT(session as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${COOKIE_MAX_AGE}s`)
    .sign(JWT_SECRET)
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getSession(): Promise<V2Session | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return null

    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as V2Session
  } catch {
    return null
  }
}

export async function requireSession(): Promise<V2Session> {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session
}

export async function getCurrentEndUser() {
  const session = await getSession()
  if (!session) return null

  const user = await db.endUser.findUnique({
    where: { id: session.userId },
    include: {
      invitations: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  })
  return user
}
