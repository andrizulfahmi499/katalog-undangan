import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireSession } from '@/lib/v2Auth'

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession()
    const { packageType, couponCode } = await request.json()

    if (!packageType) {
      return NextResponse.json({ error: 'Paket harus dipilih' }, { status: 400 })
    }

    const user = await db.endUser.findUnique({ where: { id: session.userId } })
    if (!user) return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
    if (user.packageStatus === 'paid') return NextResponse.json({ error: 'Paket sudah aktif' }, { status: 400 })

    // Find package from DB
    const pkg = await db.v2Package.findFirst({ where: { OR: [{ slug: packageType }, { id: packageType }], isActive: true } })
    if (!pkg) return NextResponse.json({ error: 'Paket tidak ditemukan' }, { status: 404 })

    let amount = pkg.promoPrice
    let discountAmount = 0
    let couponId: string | null = null

    // Apply coupon if provided
    if (couponCode) {
      const coupon = await db.v2Coupon.findFirst({
        where: { code: couponCode.toUpperCase(), isActive: true, usedCount: { lt: db.v2Coupon.fields.maxUses } },
      })
      if (coupon) {
        // Check expiry
        if (!coupon.expiresAt || coupon.expiresAt > new Date()) {
          // Check min purchase
          if (amount >= coupon.minPurchase) {
            if (coupon.discountPercent) {
              discountAmount = Math.round(amount * coupon.discountPercent / 100)
            } else if (coupon.discountAmount) {
              discountAmount = coupon.discountAmount
            }
            amount = Math.max(0, amount - discountAmount)
            couponId = coupon.id

            // Increment usage
            await db.v2Coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } })
          }
        }
      }
    }

    // Admin/Member linked users get free access
    if (user.role === 'admin' || (user.role === 'member' && user.linkedMemberId)) {
      amount = 0
    }

    // Create payment record
    const payment = await db.v2Payment.create({
      data: {
        endUserId: user.id,
        packageId: pkg.id,
        packageType: pkg.slug,
        amount: pkg.promoPrice,
        discountAmount,
        finalAmount: amount,
        status: amount === 0 ? 'paid' : 'pending',
        couponId,
        paidAt: amount === 0 ? new Date() : null,
      },
    })

    // If free (admin/member or 100% coupon), activate immediately
    if (amount === 0) {
      await db.endUser.update({
        where: { id: user.id },
        data: { packageType: pkg.slug, packageStatus: 'paid' },
      })
      // Set all invitations online
      await db.endUserInvitation.updateMany({
        where: { endUserId: user.id },
        data: { isOnline: true },
      })

      return NextResponse.json({
        success: true,
        data: { paymentId: payment.id, checkoutUrl: '/v2/dashboard?payment=success', amount: 0, activated: true },
      })
    }

    // Mayar integration for paid packages
    const mayarApiKey = process.env.MAYAR_API_KEY
    let checkoutUrl = ''

    if (mayarApiKey) {
      try {
        const response = await fetch('https://api.mayar.id/v1/payment-requests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mayarApiKey}`,
          },
          body: JSON.stringify({
            externalId: payment.id,
            amount,
            title: `Editor Undangan v2 - ${pkg.name}`,
            description: pkg.description || 'Pembayaran undangan digital pernikahan',
            customerName: user.name,
            customerEmail: user.email,
            successRedirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/v2/dashboard?payment=success`,
            failedRedirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/v2/packages?payment=failed`,
            paymentMethods: ['DA', 'BA', 'QRIS', 'SP', 'OP'],
          }),
        })

        if (response.ok) {
          const mayarData = await response.json()
          checkoutUrl = mayarData.data?.paymentUrl || mayarData.data?.checkoutUrl || ''
          await db.v2Payment.update({
            where: { id: payment.id },
            data: { externalId: mayarData.data?.id || payment.id, checkoutUrl },
          })
        }
      } catch (err) { console.error('Mayar API error:', err) }
    }

    if (!checkoutUrl) {
      checkoutUrl = `/v2/payment/mock/${payment.id}`
      await db.v2Payment.update({ where: { id: payment.id }, data: { checkoutUrl } })
    }

    await db.endUser.update({ where: { id: user.id }, data: { packageType: pkg.slug } })

    return NextResponse.json({
      success: true,
      data: { paymentId: payment.id, checkoutUrl, amount, discountAmount },
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Silakan login terlebih dahulu' }, { status: 401 })
    console.error('Create payment error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}
