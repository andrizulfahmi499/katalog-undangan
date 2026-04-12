import { notFound } from 'next/navigation'
import { CalendarDays, MapPin, Heart, ArrowLeft, Sparkles, Eye } from 'lucide-react'
import CopyLinkButton from '@/components/CopyLinkButton'
import CountdownTimer from '@/components/CountdownTimer'
import DreamLandTemplate from '@/components/DreamLandTemplate'
import VerdantTemplate from '@/components/VerdantTemplate'
import ElgazeTemplate from '@/components/ElgazeTemplate'
import { db } from '@/lib/db'
import { getTemplateById, formatInvitationMessage } from '@/lib/invitationTemplates'

type InvitationPreviewPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function InvitationPreviewPage({ params }: InvitationPreviewPageProps) {
  const resolvedParams = await params
  console.error('InvitationPreviewPage params', resolvedParams)
  const invitationId = resolvedParams?.id
  if (!invitationId) {
    console.error('Missing invitation id param', resolvedParams)
    notFound()
  }

  const invitation = await db.invitations.findUnique({
    where: { id: invitationId },
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

  const [groomName, brideName] = invitation.title.split(/\s*&\s*/).map((name) => name.trim())
  const formattedDate = new Date(invitation.eventDate).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const previewMessage = formatInvitationMessage(
    invitation.templateMessage,
    invitation.invitationLink,
    invitation.eventName
  )

  // If Verdant template, render special layout
  if (invitation.templateId === 'verdant') {
    return <VerdantTemplate invitation={invitation} formattedDate={formattedDate} />
  }

  // If Dream Land template, render special layout
  if (invitation.templateId === 'dream-land') {
    return <DreamLandTemplate invitation={invitation} formattedDate={formattedDate} />
  }

  // If Elgaze template, render special layout
  if (invitation.templateId === 'elgaze') {
    return <ElgazeTemplate invitation={invitation} formattedDate={formattedDate} />
  }

  return (
    <div className="min-h-screen bg-[#f7efe7] text-slate-900">
      <div className="relative overflow-hidden py-10">
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(244,226,214,0.85),transparent_65%)]" />
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.32em] text-rose-600 font-semibold">Undangan Pernikahan</p>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">{invitation.title}</h1>
                <p className="max-w-2xl text-base leading-8 text-slate-700">{template.description}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                >
                  <ArrowLeft className="w-4 h-4" /> Kembali
                </a>
                <a
                  href={invitation.invitationLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-rose-700"
                >
                  <Sparkles className="w-4 h-4" /> Lihat Undangan
                </a>
              </div>
            </div>

            <section className="overflow-hidden rounded-[48px] border border-slate-200 bg-white shadow-2xl">
              <div className="relative h-[520px] overflow-hidden">
                <img src="/icons/bg.webp" alt="Background Undangan" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/0 to-slate-950/80" />
                <div className="relative z-10 flex h-full flex-col justify-end p-8 sm:p-12">
                  <div className="max-w-3xl rounded-[36px] bg-white/90 p-6 shadow-xl shadow-slate-950/10 backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-[0.32em] text-rose-600">{template.heroLabel}</p>
                    <h2 className="mt-4 text-4xl font-semibold text-slate-950 sm:text-5xl">{template.heroLine}</h2>
                    <p className="mt-4 text-sm leading-7 text-slate-700">{previewMessage}</p>
                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                      <div className="rounded-[28px] bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Acara</p>
                        <p className="mt-3 text-lg font-semibold text-slate-950">{invitation.eventName}</p>
                      </div>
                      <div className="rounded-[28px] bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Tanggal</p>
                        <p className="mt-3 text-lg font-semibold text-slate-950">{formattedDate}</p>
                      </div>
                      <div className="rounded-[28px] bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Lokasi</p>
                        <p className="mt-3 text-lg font-semibold text-slate-950">{invitation.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
              <div className="space-y-6">
                <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-xl">
                  <div className="flex items-center gap-3 text-slate-500 text-xs uppercase tracking-[0.28em]">
                    <Sparkles className="w-4 h-4" /> Undangan Khusus
                  </div>
                  <p className="mt-6 text-lg leading-8 text-slate-700 whitespace-pre-line">{previewMessage}</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="rounded-[36px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50">
                      <img src="/icons/frame-mempelai.webp" alt="The Groom" className="h-64 w-full object-cover" />
                    </div>
                    <div className="mt-6">
                      <p className="text-xs uppercase tracking-[0.3em] text-rose-600">The Groom</p>
                      <h3 className="mt-3 text-2xl font-semibold text-slate-950">{groomName || 'Mempelai Pria'}</h3>
                      <p className="mt-2 text-sm text-slate-600">Pendamping acara dan bagian dari kisah cinta kami.</p>
                    </div>
                  </div>
                  <div className="rounded-[36px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50">
                      <img src="/icons/frame-mempelai.webp" alt="The Bride" className="h-64 w-full object-cover" />
                    </div>
                    <div className="mt-6">
                      <p className="text-xs uppercase tracking-[0.3em] text-rose-600">The Bride</p>
                      <h3 className="mt-3 text-2xl font-semibold text-slate-950">{brideName || 'Mempelai Wanita'}</h3>
                      <p className="mt-2 text-sm text-slate-600">Dengan senyum dan doa, mengundang Anda ikut merayakan acara kami.</p>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="space-y-6">
                <div className="rounded-[36px] bg-slate-950 p-6 text-white shadow-2xl">
                  <p className="text-xs uppercase tracking-[0.28em] text-sky-300">Countdown</p>
                  <div className="mt-6 rounded-[28px] bg-white/10 p-5 border border-white/10">
                    <CountdownTimer targetDate={invitation.eventDate.toISOString()} />
                  </div>
                </div>

                <div className="rounded-[36px] bg-white p-6 shadow-xl border border-slate-200">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Bagikan</p>
                  <div className="mt-5 space-y-4">
                    <div className="rounded-[28px] bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">Link Undangan</p>
                      <a
                        href={invitation.invitationLink}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 block break-all text-sm font-semibold text-slate-900 hover:text-rose-600"
                      >
                        {invitation.invitationLink}
                      </a>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <CopyLinkButton link={invitation.invitationLink} />
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Halo, undangan Anda sudah siap: ${invitation.invitationLink}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        Kirim WA
                      </a>
                    </div>
                  </div>
                </div>
              </aside>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-xl">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Tanggal & Waktu</p>
                <p className="mt-4 text-2xl font-semibold text-slate-950">{formattedDate}</p>
                <p className="mt-3 text-sm text-slate-600">Silakan hadir tepat waktu dan ikuti undangan resmi kami.</p>
              </div>
              <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-xl">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Lokasi</p>
                <p className="mt-4 text-2xl font-semibold text-slate-950">{invitation.location}</p>
                <p className="mt-3 text-sm text-slate-600">Klik tombol bagikan untuk menyebarkan undangan kepada tamu.</p>
              </div>
              <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-xl">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Tamu Terundang</p>
                <p className="mt-4 text-2xl font-semibold text-slate-950">{invitation.assignedMember?.name || 'Tamu Istimewa'}</p>
                <p className="mt-3 text-sm text-slate-600">{invitation.assignedMember?.email || ''}</p>
              </div>
            </div>

            <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-xl">
              <div className="grid gap-6 lg:grid-cols-3">
                <img src="/icons/flowers.webp" alt="Dekorasi bunga" className="h-72 w-full rounded-[32px] object-cover" />
                <img src="/icons/bg-end.webp" alt="Dekorasi akhir" className="h-72 w-full rounded-[32px] object-cover" />
                <img src="/icons/right.webp" alt="Foto momen" className="h-72 w-full rounded-[32px] object-cover" />
              </div>
            </div>

            <div className="rounded-[40px] bg-rose-50 p-10 text-center shadow-xl border border-rose-100">
              <p className="text-sm uppercase tracking-[0.3em] text-rose-500">Terima Kasih</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-950">Kami menantikan kehadiran Anda</h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-700">Semoga doa dan restu dari Bapak/Ibu/Saudara/i menjadikan hari bahagia kami lebih bermakna.</p>
              <div className="mt-8 rounded-[32px] bg-white p-6 shadow-sm border border-slate-200">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Hormat kami</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">{invitation.title}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
