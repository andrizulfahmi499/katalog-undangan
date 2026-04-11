import { notFound } from 'next/navigation'
import { CalendarDays, MapPin, Heart, ArrowLeft } from 'lucide-react'
import CopyLinkButton from '@/components/CopyLinkButton'
import { db } from '@/lib/db'
import { getTemplateById, formatInvitationMessage } from '@/lib/invitationTemplates'

type InvitationPreviewPageProps = {
  params: {
    id: string
  }
}

export default async function InvitationPreviewPage({ params }: InvitationPreviewPageProps) {
  const invitation = await db.invitations.findUnique({
    where: { id: params.id },
    include: {
      assignedMember: true,
    },
  })

  if (!invitation) {
    notFound()
  }

  const template =
    getTemplateById(invitation.templateId || '') || {
      id: 'custom',
      title: 'Undangan Digital',
      category: 'Pernikahan',
      accent: 'from-slate-500 to-slate-700',
      description: 'Undangan yang dibuat dari editor admin.',
      heroLabel: 'Undangan',
      heroLine: 'Sampai jumpa di acara spesial',
      defaultMessage: invitation.templateMessage,
    }

  const previewMessage = formatInvitationMessage(
    invitation.templateMessage,
    invitation.invitationLink,
    invitation.eventName
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.28em] text-sky-600 font-semibold">Undangan Digital</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">{invitation.title}</h1>
            <p className="mt-4 text-base leading-7 text-slate-600">{template.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali
            </a>
            <button
              type="button"
              onClick={() => window.open(invitation.invitationLink, '_blank')}
              className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-sky-200 transition hover:bg-sky-700"
            >
              <Eye className="w-4 h-4" /> Buka Undangan
            </button>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.3fr_0.9fr]">
          <div className="rounded-[40px] border border-slate-200 bg-white shadow-xl overflow-hidden">
            <div className={`relative overflow-hidden bg-gradient-to-br ${template.accent} px-8 py-12 sm:px-12 sm:py-16`}>
              <div className="absolute -right-20 top-10 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -left-16 bottom-0 h-28 w-28 rounded-full bg-white/10 blur-3xl" />
              <div className="relative z-10">
                <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/90">{template.heroLabel}</span>
                <h2 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">{template.heroLine}</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/90">{template.description}</p>
              </div>
            </div>

            <div className="p-8 sm:p-10">
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Acara</p>
                  <p className="mt-3 text-lg font-semibold text-slate-950">{invitation.eventName}</p>
                </div>
                <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Tanggal</p>
                  <p className="mt-3 text-lg font-semibold text-slate-950">{new Date(invitation.eventDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Lokasi</p>
                  <p className="mt-3 text-lg font-semibold text-slate-950">{invitation.location}</p>
                </div>
              </div>

              <div className="mt-8 rounded-[32px] border border-slate-200 bg-slate-50 p-8 shadow-sm">
                <div className="flex items-center gap-3 text-slate-500 text-xs uppercase tracking-[0.28em]">
                  <Heart className="w-4 h-4" /> Undangan khusus
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-700 whitespace-pre-line">{previewMessage}</p>
                <div className="mt-8 rounded-[28px] bg-white p-5 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Undangan untuk</p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">{invitation.assignedMember?.name || 'Tamu Istimewa'}</p>
                  {invitation.assignedMember?.email && (
                    <p className="mt-1 text-sm text-slate-500">{invitation.assignedMember.email}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[36px] bg-slate-950 p-6 text-white shadow-2xl">
              <p className="text-xs uppercase tracking-[0.28em] text-sky-300">Link Undangan</p>
              <div className="mt-5 rounded-[28px] bg-white/10 p-5 border border-white/10">
                <p className="text-sm text-slate-200">Bagikan langsung ke tamu dengan link ini.</p>
                <a href={invitation.invitationLink} target="_blank" rel="noreferrer" className="mt-3 block break-all text-sm font-semibold text-white hover:text-sky-200">
                  {invitation.invitationLink}
                </a>
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <CopyLinkButton link={invitation.invitationLink} />
                <button
                  type="button"
                  onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Halo, undangan Anda sudah siap: ${invitation.invitationLink}`)}`, '_blank')}
                  className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Kirim WA
                </button>
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Ringkasan</p>
              <div className="mt-4 space-y-4">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Status</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{invitation.status}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Template</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{template.title}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Jenis</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{template.category}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
