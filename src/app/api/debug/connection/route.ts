import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    // Test bcrypt directly (without database)
    const testHash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
    const bcryptTest = await bcrypt.compare('admin123', testHash)
    
    // Create a new hash to test if bcrypt works
    const newHash = await bcrypt.hash('test123', 10)
    const newHashTest = await bcrypt.compare('test123', newHash)
    
    // Try to connect to database
    const admin = await db.admin.findUnique({
      where: { email: 'admin@undanganku.com' },
    })
    
    let dbPasswordTest = null
    if (admin) {
      const isValid = await bcrypt.compare('admin123', admin.password)
      dbPasswordTest = {
        email: admin.email,
        passwordPrefix: admin.password.substring(0, 15),
        passwordLength: admin.password.length,
        passwordMatch: isValid,
        message: isValid ? '✓ Password admin123 is CORRECT!' : '✗ Password admin123 is INCORRECT!'
      }
    }

    return NextResponse.json({
      success: true,
      bcryptDirectTest: {
        hash: testHash.substring(0, 20) + '...',
        passwordMatch: bcryptTest,
        message: bcryptTest ? '✓ Bcrypt works correctly!' : '✗ Bcrypt NOT working!'
      },
      bcryptNewHashTest: {
        createdHash: newHash.substring(0, 20) + '...',
        passwordMatch: newHashTest,
        message: newHashTest ? '✓ Bcrypt hash & verify works!' : '✗ Bcrypt hash & verify FAILED!'
      },
      dbPasswordTest,
      message: 'All tests completed'
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      errorType: error.constructor.name,
      stack: error.stack
    }, { status: 500 })
  }
}
