import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import InvitationRenderer from '@/components/templates/InvitationRenderer'
import NishaTemplate from '@/components/NishaTemplate'

interface Props {
  params: Promise<{ subdomain: string }>
  searchParams: Promise<{ preview?: string }>
}

export default async function LiveInvitationPage({ params, searchParams }: Props) {
  const { subdomain } = await params
  const { preview } = await searchParams

  const invitation = await db.endUserInvitation.findUnique({
    where: { subdomain },
    include: {
      events: { orderBy: { createdAt: 'asc' } },
      bankAccounts: true,
      giftItems: true,
      endUser: { select: { packageStatus: true, role: true } },
    },
  })

  if (!invitation) return notFound()

  // If not preview mode and not online, show offline page
  if (!preview && !invitation.isOnline) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[#3A5A40]/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#3A5A40]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[#2D2D2D] mb-2">Undangan Belum Aktif</h1>
          <p className="text-sm text-[#8B7E6F]">Undangan ini belum dipublikasikan</p>
        </div>
      </div>
    )
  }

  const config = typeof invitation.editorConfig === 'string'
    ? JSON.parse(invitation.editorConfig as string)
    : invitation.editorConfig as any

  // Watermark logic:
  // - Admin: no watermark
  // - Member (reseller): show watermark (incentive to upgrade)
  // - Customer with unpaid status: show watermark
  // - Customer with paid status: no watermark
  const endUserRole = invitation.endUser?.role || 'customer'
  const packageStatus = invitation.endUser?.packageStatus || 'unpaid'

  let showWatermark = true
  if (endUserRole === 'admin') {
    showWatermark = false
  } else if (endUserRole === 'customer' && packageStatus === 'paid') {
    showWatermark = false
  }
  // Members always show watermark unless they upgrade to paid customer

  const invitationData = {
    ...invitation,
    editorConfig: config,
    showWatermark,
    endUser: {
      role: endUserRole,
      packageStatus,
    },
  }

  // Template-specific renderers
  if (invitation.templateSlug === 'nisha') {
    return <NishaTemplate invitation={invitationData} />
  }

  return (
    <InvitationRenderer
      invitation={invitationData}
    />
  )
}
