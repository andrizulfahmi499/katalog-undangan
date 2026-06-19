'use client'

import { useState } from 'react'
import { parseEditorConfig, type InvitationEditorConfig } from '@/lib/invitationEditorConfig'
import EdenPurpleCover from './edenpurple/EdenPurpleCover'
import EdenPurpleCouple from './edenpurple/EdenPurpleCouple'
import EdenPurpleEvents from './edenpurple/EdenPurpleEvents'
import EdenPurpleQuote from './edenpurple/EdenPurpleQuote'
import EdenPurpleGallery from './edenpurple/EdenPurpleGallery'
import EdenPurpleCountdown from './edenpurple/EdenPurpleCountdown'
import EdenPurpleRsvp from './edenpurple/EdenPurpleRsvp'
import EdenPurpleGift from './edenpurple/EdenPurpleGift'
import EdenPurpleWishes from './edenpurple/EdenPurpleWishes'
import EdenPurpleMusicPlayer from './edenpurple/EdenPurpleMusicPlayer'

const P = '/templates/eden/images'

interface EdenPurpleTemplateProps {
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

export default function EdenPurpleTemplate({ invitation, formattedDate, editable = false }: EdenPurpleTemplateProps) {
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

  // Events
  const eventSection = getSectionContent(cfg, 'event')
  const eventDate = new Date(invitation.eventDate)
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  const mapsSection = getSectionContent(cfg, 'maps')

  const events = [{
    title: eventSection.eventTitle || invitation.eventName || 'Pemberkatan Nikah',
    day: dayNames[eventDate.getDay()],
    month: monthNames[eventDate.getMonth()],
    date: String(eventDate.getDate()),
    year: String(eventDate.getFullYear()),
    time: eventSection.time || '10:00 WIB',
    venue: eventSection.venue || mapsSection.venueName || invitation.location,
    address: eventSection.address || mapsSection.address || '',
    mapsUrl: mapsSection.mapsUrl || '',
  }]

  // Countdown
  const countdownSection = getSectionContent(cfg, 'countdown')
  const targetDate = countdownSection.targetDate || invitation.eventDate

  // Gift
  const giftSection = getSectionContent(cfg, 'gift')

  // Quote
  const quoteSection = getSectionContent(cfg, 'quote')

  // Dresscode
  const dresscodeSection = getSectionContent(cfg, 'dresscode')

  // Thanks
  const thanksSection = getSectionContent(cfg, 'thanks')

  // Music
  const musicUrl = cfg.ui.musicUrl?.trim() || '/templates/eden/audio.mp3'

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ fontFamily: "'Urbanist', sans-serif" }}>
      {/* Fonts preload */}
      <style jsx global>{`
        @font-face {
          font-family: 'Urbanist';
          src: url('/templates/eden/fonts/urbanist-variable.woff2') format('woff2');
          font-weight: 100 900;
          font-display: swap;
        }
        @font-face {
          font-family: 'Cormorant Garamond';
          src: url('/templates/eden/fonts/cormorant-garamond.woff2') format('woff2');
          font-weight: 400;
          font-display: swap;
        }
        @font-face {
          font-family: 'Cormorant Garamond';
          src: url('/templates/eden/fonts/cormorant-garamond-italic.woff2') format('woff2');
          font-weight: 400;
          font-style: italic;
          font-display: swap;
        }
      `}</style>

      {/* Cover */}
      <EdenPurpleCover
        isOpened={isOpened}
        onOpen={() => setIsOpened(true)}
        guestName={invitation.assignedMember?.name}
        groomName={groom.name}
        brideName={bride.name}
      />

      {/* Music Player */}
      {isOpened && (
        <EdenPurpleMusicPlayer musicUrl={musicUrl} autoPlay={true} />
      )}

      {/* Main content */}
      {isOpened && (
        <div className="w-full">
          {/* Groom & Bride */}
          {(isSectionEnabled(cfg, 'groom') || isSectionEnabled(cfg, 'bride')) && (
            <EdenPurpleCouple groom={groom} bride={bride} />
          )}

          {/* Quote */}
          {isSectionEnabled(cfg, 'quote') && (
            <EdenPurpleQuote
              quote={quoteSection.text || '"Love is patient, love is kind. It does not envy, it does not boast, it is not proud."'}
              source={quoteSection.source || '1 Corinthians 13:4'}
            />
          )}

          {/* Events */}
          {isSectionEnabled(cfg, 'event') && (
            <EdenPurpleEvents
              events={events}
              dresscodeText={dresscodeSection.text || 'Batik / Formal Attire'}
              dresscodeColors={dresscodeSection.colors || ['#5b3a8c', '#7c5cbf', '#e8dff5', '#ffffff']}
            />
          )}

          {/* Gallery */}
          {isSectionEnabled(cfg, 'gallery') && (
            <EdenPurpleGallery
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
            <EdenPurpleCountdown targetDate={targetDate} />
          )}

          {/* RSVP */}
          {isSectionEnabled(cfg, 'rsvp') && (
            <EdenPurpleRsvp
              eventNames={events.map(e => e.title)}
              rsvpMessage={getSectionContent(cfg, 'rsvp').message}
              invitationId={invitation.id}
            />
          )}

          {/* Wishes */}
          {isSectionEnabled(cfg, 'wishes') && (
            <EdenPurpleWishes invitationId={invitation.id} />
          )}

          {/* Gift */}
          {isSectionEnabled(cfg, 'gift') && (
            <EdenPurpleGift
              bankName={giftSection.bankName}
              accountName={giftSection.accountName || `${groomName} & ${brideName}`}
              accountNumber={giftSection.accountNumber}
              hashtag={giftSection.hashtag || `#${groomName}${brideName}Wedding`}
            />
          )}

          {/* Thanks / Footer */}
          {isSectionEnabled(cfg, 'thanks') && (
            <section
              className="relative w-full overflow-hidden flex flex-col items-center justify-center py-20"
              style={{ background: 'linear-gradient(180deg, #ede4f7 0%, #5b3a8c 100%)' }}
            >
              <img src={`${P}/portal.jpg`} alt="" className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] pointer-events-none select-none z-10" />
              <img src={`${P}/garden.jpg`} alt="" className="absolute bottom-0 left-0 w-[200px] md:w-[300px] pointer-events-none select-none z-10" />
              <img src={`${P}/garden.jpg`} alt="" className="absolute bottom-0 right-0 w-[200px] md:w-[300px] pointer-events-none select-none z-10" style={{ transform: 'scaleX(-1)' }} />
              <img src={`${P}/bush-left.jpg`} alt="" className="absolute bottom-0 left-0 w-[160px] md:w-[220px] pointer-events-none select-none z-10" />
              <img src={`${P}/bush-right.jpg`} alt="" className="absolute bottom-0 right-0 w-[160px] md:w-[220px] pointer-events-none select-none z-10" />

              <div className="relative z-30 flex flex-col items-center gap-4 px-6 text-center">
                <p
                  className="text-white/80 text-sm italic max-w-md leading-relaxed"
                  style={{ fontFamily: "'Urbanist', sans-serif" }}
                >
                  {thanksSection.message || "Atas kehadiran dan do'a restunya kami ucapkan terima kasih."}
                </p>
                <h3
                  className="text-white text-3xl md:text-4xl font-bold"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {groomName} & {brideName}
                </h3>
                <p className="mt-8 text-white/50 text-xs uppercase tracking-[0.3em]">
                  Katalog Undangan © {new Date().getFullYear()}
                </p>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
