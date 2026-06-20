import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireSession } from '@/lib/v2Auth'

export async function GET(request: NextRequest) {
  try {
    const session = await requireSession()
    const paymentId = request.nextUrl.searchParams.get('id')

    if (!paymentId) {
      return NextResponse.json({ error: 'Payment ID required' }, { status: 400 })
    }

    const payment = await db.v2Payment.findFirst({
      where: { id: paymentId, endUserId: session.userId },
    })

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        packageType: payment.packageType,
        paymentMethod: payment.paymentMethod,
        paidAt: payment.paidAt,
        checkoutUrl: payment.checkoutUrl,
      },
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}
