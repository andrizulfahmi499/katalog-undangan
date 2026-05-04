import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
    // Timeout koneksi 10 detik agar tidak hang selamanya
    datasourceUrl: process.env.DATABASE_URL
      ? `${process.env.DATABASE_URL}${process.env.DATABASE_URL.includes('?') ? '&' : '?'}connect_timeout=10`
      : undefined,
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
