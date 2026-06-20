import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-mayar-signature') || ''

    // Verify webhook signature if Mayar webhook secret is configured
    const webhookSecret = process.env.MAYAR_WEBHOOK_SECRET
    if (webhookSecret) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex')

      if (signature !== expectedSignature) {
        console.error('Invalid webhook signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const payload = JSON.parse(body)
    const { status, externalId, paymentMethod } = payload

    // Find payment record
    const payment = await db.v2Payment.findFirst({
      where: {
        OR: [
          { externalId: externalId },
          { id: externalId },
        ],
      },
    })

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    // Update payment status
    if (status === 'PAID' || status === 'COMPLETED' || status === 'SETTLED') {
      await db.v2Payment.update({
        where: { id: payment.id },
        data: {
          status: 'paid',
          paymentMethod: paymentMethod || null,
          paidAt: new Date(),
          webhookPayload: payload,
        },
      })

      // Activate user package
      await db.endUser.update({
        where: { id: payment.endUserId },
        data: {
          packageStatus: 'paid',
          packageType: payment.packageType,
        },
      })

      // Activate all user invitations (set online)
      await db.endUserInvitation.updateMany({
        where: { endUserId: payment.endUserId },
        data: { isOnline: true },
      })
    } else if (status === 'FAILED' || status === 'EXPIRED') {
      await db.v2Payment.update({
        where: { id: payment.id },
        data: {
          status: 'failed',
          webhookPayload: payload,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
