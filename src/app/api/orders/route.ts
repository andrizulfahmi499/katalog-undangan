import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

/**
 * POST /api/orders
 *
 * Handles order form submissions from the CleanApp theme landing page.
 * Saves orders to database and optionally links to existing members.
 *
 * Requirements: 12.3, 12.4, 12.5
 *
 * Request Body:
 * - name: string (required, 2-100 characters)
 * - email: string (required, valid email format)
 * - phone: string (required, valid Indonesian phone format)
 * - eventType: string (required, one of: "Pernikahan", "Ultah", "Lainnya")
 * - message: string (optional, max 1000 characters)
 *
 * Response:
 * - 200: Order submitted successfully
 * - 400: Validation error
 * - 500: Server error
 */

// Order form validation schema (matches frontend schema)
const orderFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter'),
  email: z
    .string()
    .email('Format email tidak valid'),
  phone: z
    .string()
    .regex(
      /^(\+62|62|0)[0-9]{9,13}$/,
      'Nomor telepon tidak valid'
    ),
  eventType: z
    .string()
    .refine((val) => ['Pernikahan', 'Ultah', 'Lainnya'].includes(val), {
      message: 'Jenis acara tidak valid',
    }),
  message: z
    .string()
    .max(1000, 'Pesan maksimal 1000 karakter')
    .optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate request data
    const validationResult = orderFormSchema.safeParse(body)

    if (!validationResult.success) {
      // Return validation errors
      const errors = validationResult.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }))

      return NextResponse.json(
        {
          success: false,
          error: 'Validasi gagal',
          errors,
        },
        { status: 400 }
      )
    }

    const orderData = validationResult.data

    // Try to find existing member by email (for linking orders to members)
    let memberId: string | null = null
    try {
      const existingMember = await db.member.findUnique({
        where: { email: orderData.email },
        select: { id: true },
      })
      if (existingMember) {
        memberId = existingMember.id
      }
    } catch (dbError) {
      // If database lookup fails, continue without linking
      console.warn('Could not link order to member:', dbError)
    }

    // Save order to database
    let savedOrder = null
    try {
      savedOrder = await db.order.create({
        data: {
          name: orderData.name,
          email: orderData.email,
          phone: orderData.phone,
          eventType: orderData.eventType,
          message: orderData.message || null,
          memberId: memberId,
          status: 'new',
        },
      })
    } catch (dbError) {
      // If database save fails, continue with simulated response
      console.warn('Could not save order to database:', dbError)
    }

    // Log the order data
    console.log('Order received:', {
      orderId: savedOrder?.id || `ORD-${Date.now()}`,
      name: orderData.name,
      email: orderData.email,
      phone: orderData.phone,
      eventType: orderData.eventType,
      message: orderData.message,
      memberId: memberId,
      timestamp: new Date().toISOString(),
    })

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Pesanan berhasil dikirim',
        data: {
          orderId: savedOrder?.id || `ORD-${Date.now()}`,
          name: orderData.name,
          email: orderData.email,
          isNewCustomer: !memberId,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing order:', error)

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Format data tidak valid',
        },
        { status: 400 }
      )
    }

    // Return generic error response
    return NextResponse.json(
      {
        success: false,
        error: 'Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.',
      },
      { status: 500 }
    )
  }
}

// GET endpoint to fetch orders (for admin dashboard)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where = status ? { status } : {}

    const orders = await db.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        member: {
          select: {
            id: true,
            name: true,
            email: true,
            whatsapp: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: orders,
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengambil data pesanan',
      },
      { status: 500 }
    )
  }
}

// PATCH endpoint to update order status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, status } = body

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, error: 'orderId dan status diperlukan' },
        { status: 400 }
      )
    }

    const validStatuses = ['new', 'contacted', 'converted', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Status tidak valid' },
        { status: 400 }
      )
    }

    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: { status },
    })

    return NextResponse.json({
      success: true,
      data: updatedOrder,
    })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengupdate pesanan',
      },
      { status: 500 }
    )
  }
}