'use client'

import { useState } from 'react'
import { parseEditorConfig, type InvitationEditorConfig } from '@/lib/invitationEditorConfig'
import DreamLandCover from './dreamland/DreamLandCover'
import DreamLandCouple from './dreamland/DreamLandCouple'
import DreamLandGallery from './dreamland/DreamLandGallery'
import DreamLandCountdown from './dreamland/DreamLandCountdown'
import DreamLandEvents from './dreamland/DreamLandEvents'
import DreamLandRsvp from './dreamland/DreamLandRsvp'
import DreamLandWishingWell from './dreamland/DreamLandWishingWell'
import DreamLandMusicPlayer from './dreamland/DreamLandMusicPlayer'

interface DreamLandTemplateProps {
  invitation: {
    id: string
    title: string
    eventName: string
    eventDate: string
    location: string
    invitationLink: string
    editorConfig?: unknown
    assignedMember?: { name: string; email: string }
    templateMessage: string
  }
  formattedDate: string
  editable?: boolean
}

function getSection(cfg: InvitationEditorConfig, idOrCategory: string) {
  return cfg.sections.find(s => s.id === idOrCategory || (s as any).category === idOrCategory)
}

function isSectionEnabled(cfg: InvitationEditorConfig, id: string) {
  const s = getSection(cfg, id)
  return s ? s.enabled : true
}

function getSectionContent(cfg: InvitationEditorConfig, id: string) {
  return getSection(cfg, id)?.content || {}
}

export default function DreamLandTemplate({ invitation, formattedDate, editable = false }: DreamLandTemplateProps) {
  const [isOpened, setIsOpened] = useState(false)
  const cfg = parseEditorConfig(invitation.editorConfig)

  const [groomName, brideName] = invitation.title.split(/\s*&\s*/).map(n => n.trim())

  const groomSection = getSectionContent(cfg, 'groom')
  const brideSection = getSectionContent(cfg, 'bride')

  const groom = {
    name: groomSection.name || groomName || 'Mempelai Pria',
    parents: groomSection.parents || 'Putra dari Bpk. & Ibu',
    instagram: groomSection.instagram || '',
  }

  const bride = {
    name: brideSection.name || brideName || 'Mempelai Wanita',
    parents: brideSection.parents || 'Putri dari Bpk. & Ibu',
    instagram: brideSection.instagram || '',
  }

  const eventSection = getSectionContent(cfg, 'event')
  const eventDate = new Date(invitation.eventDate)
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const mapsSection = getSectionContent(cfg, 'maps')

  const events = [{
    title: eventSection.eventTitle || invitation.eventName || 'Holy Matrimony',
    day: dayNames[eventDate.getDay()],
    month: monthNames[eventDate.getMonth()],
    date: String(eventDate.getDate()),
    year: String(eventDate.getFullYear()),
    time: eventSection.time || '10:00 WIB',
    venue: eventSection.venue || mapsSection.venueName || invitation.location,
    address: eventSection.address || mapsSection.address || '',
    mapsUrl: mapsSection.mapsUrl || '',
  }]

  const countdownSection = getSectionContent(cfg, 'countdown')
  const targetDate = countdownSection.targetDate || invitation.eventDate

  const giftSection = getSectionContent(cfg, 'gift')

  // Music: use editor config URL, or fallback to DearMyLove.org default
  const musicUrl = cfg.ui.musicUrl?.trim() || '/templates/dream-land/miracle-riley.mp3'

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#faf8f3]">
      {/* Cover */}
      <DreamLandCover
        isOpened={isOpened}
        onOpen={() => setIsOpened(true)}
        guestName={invitation.assignedMember?.name}
      />

      {/* Music Player - always active with default music */}
      {isOpened && (
        <DreamLandMusicPlayer musicUrl={musicUrl} autoPlay={true} />
      )}

      {/* Main content */}
      {isOpened && (
        <div className="lg:ml-[63%] lg:w-[37%] xl:ml-[65%] xl:w-[35%]">
          {/* Desktop left gallery */}
          <div className="hidden lg:fixed lg:left-0 lg:top-0 lg:block lg:h-screen lg:w-[63%] xl:w-[65%]">
            <div className="relative h-full w-full bg-black">
              <img alt="Gallery" className="absolute inset-0 w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80" />
            </div>
          </div>

          <div className="h-max w-full overflow-hidden">
            {/* Groom & Bride */}
            {(isSectionEnabled(cfg, 'groom') || isSectionEnabled(cfg, 'bride')) && (
              <DreamLandCouple groom={groom} bride={bride} invitationId={invitation.id} editable={editable} />
            )}

            {/* Gallery */}
            {isSectionEnabled(cfg, 'gallery') && (
              <DreamLandGallery 
                invitationId={invitation.id} 
                editable={editable} 
                photos={
                  Array.isArray(getSectionContent(cfg, 'gallery').images) 
                    ? getSectionContent(cfg, 'gallery').images.filter((img: any) => img.url).map((img: any) => img.url) 
                    : undefined
                }
              />
            )}

            {/* Countdown */}
            {isSectionEnabled(cfg, 'countdown') && (
              <DreamLandCountdown targetDate={targetDate} />
            )}

            {/* Events */}
            {isSectionEnabled(cfg, 'event') && (
              <DreamLandEvents events={events} />
            )}

            {/* RSVP */}
            {isSectionEnabled(cfg, 'rsvp') && (
              <DreamLandRsvp
                eventNames={events.map(e => e.title)}
                rsvpMessage={getSectionContent(cfg, 'rsvp').message}
              />
            )}

            {/* Wishing Well */}
            <DreamLandWishingWell />

            {/* Gift */}
            {isSectionEnabled(cfg, 'gift') && (
              <section className="relative z-50 flex h-max min-h-[60vh] w-full select-none flex-col items-center justify-center py-20"
                style={{ backgroundImage: `url(/templates/dream-land/bg-1.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <h2 className="font-michelia text-[52px] leading-[56px] text-[#775D34] text-center mb-4">Wedding Gift</h2>
                <p className="font-cormorant text-[#555] max-w-80 text-center mb-8">
                  Tanpa mengurangi rasa hormat, bagi Anda yang ingin mengirimkan hadiah digital.
                </p>
                <div className="bg-[#F6EAD3] rounded-[40px] p-8 shadow-lg max-w-sm w-full mx-6 text-center">
                  <p className="font-cormorantSemiBold text-xl text-[#775D34]">{giftSection.bankName || 'BANK BCA'}</p>
                  <p className="font-cormorant text-[#555] mt-1">a.n. {giftSection.accountName || `${groomName} & ${brideName}`}</p>
                  <div className="py-4 my-4 border-y border-[#d4c5a9]">
                    <p className="text-2xl font-mono tracking-wider font-bold text-[#775D34]">
                      {giftSection.accountNumber || '123 456 7890'}
                    </p>
                  </div>
                  <button onClick={() => navigator.clipboard?.writeText(giftSection.accountNumber || '1234567890')}
                    className="font-cormorantSemiBold text-[#775D34] tracking-widest text-sm hover:text-[#9f3b89] transition-colors">
                    📋 SALIN NO. REKENING
                  </button>
                </div>
              </section>
            )}

            {/* Thanks */}
            {isSectionEnabled(cfg, 'thanks') && (
              <section className="relative z-50 py-20 text-center"
                style={{ backgroundImage: `url(/templates/dream-land/bg-1.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <p className="font-cormorant text-[#555] max-w-md mx-auto italic mb-4">
                  {getSectionContent(cfg, 'thanks').message || "Atas kehadiran dan do'a restunya kami ucapkan terima kasih."}
                </p>
                <h3 className="font-michelia text-[38px] text-[#775D34]">
                  {groomName} & {brideName}
                </h3>
                <p className="mt-8 font-cormorant text-xs uppercase tracking-[0.3em] text-[#999]">
                  Katalog Undangan © {new Date().getFullYear()}
                </p>
              </section>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
