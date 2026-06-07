'use client'

import { useState } from 'react'
import { parseEditorConfig, type InvitationEditorConfig } from '@/lib/invitationEditorConfig'
import RoyalGardenCover from './royalgarden/RoyalGardenCover'
import RoyalGardenCouple from './royalgarden/RoyalGardenCouple'
import RoyalGardenQuote from './royalgarden/RoyalGardenQuote'
import RoyalGardenCountdown from './royalgarden/RoyalGardenCountdown'
import RoyalGardenEvents from './royalgarden/RoyalGardenEvents'
import RoyalGardenStory from './royalgarden/RoyalGardenStory'
import RoyalGardenAttire from './royalgarden/RoyalGardenAttire'
import RoyalGardenGallery from './royalgarden/RoyalGardenGallery'
import RoyalGardenStreaming from './royalgarden/RoyalGardenStreaming'
import RoyalGardenRsvp from './royalgarden/RoyalGardenRsvp'
import RoyalGardenGift from './royalgarden/RoyalGardenGift'
import RoyalGardenClosing from './royalgarden/RoyalGardenClosing'
import RoyalGardenMusicPlayer from './royalgarden/RoyalGardenMusicPlayer'
import RoyalGardenFloatingElements from './royalgarden/RoyalGardenFloatingElements'

interface RoyalGardenTemplateProps {
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

export default function RoyalGardenTemplate({ invitation, formattedDate }: RoyalGardenTemplateProps) {
  const [isOpened, setIsOpened] = useState(false)
  const cfg = parseEditorConfig(invitation.editorConfig)

  const [groomName, brideName] = invitation.title.split(/\s*&\s*/).map(n => n.trim())

  const groomSection = getSectionContent(cfg, 'groom')
  const brideSection = getSectionContent(cfg, 'bride')

  const groom = {
    name: groomSection.name || groomName || 'Mempelai Pria',
    parents: groomSection.parents || 'Son of Mr. & Mrs.',
    instagram: groomSection.instagram || '',
  }

  const bride = {
    name: brideSection.name || brideName || 'Mempelai Wanita',
    parents: brideSection.parents || 'Daughter of Mr. & Mrs.',
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
    mapsUrl: mapsSection.mapsUrl || 'https://goo.gl/maps/zzJP5uBsuxGEjGV98',
  }]

  const countdownSection = getSectionContent(cfg, 'countdown')
  const targetDate = countdownSection.targetDate || invitation.eventDate

  const giftSection = getSectionContent(cfg, 'gift')
  const quotesSection = getSectionContent(cfg, 'quotes')

  const musicUrl = cfg.ui.musicUrl?.trim() || '/templates/dream-land/miracle-riley.mp3'

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#faf6ef]">
      {/* Cover */}
      <RoyalGardenCover
        isOpened={isOpened}
        onOpen={() => setIsOpened(true)}
        guestName={invitation.assignedMember?.name}
        groomName={groom.name}
        brideName={bride.name}
        eventDate={formattedDate}
      />

      {/* Music Player */}
      {isOpened && <RoyalGardenMusicPlayer musicUrl={musicUrl} autoPlay={true} />}

      {/* Floating petals & butterflies */}
      {isOpened && <RoyalGardenFloatingElements />}

      {/* Main content */}
      {isOpened && (
        <div className="relative z-10">
          {/* Quote */}
          {isSectionEnabled(cfg, 'quotes') && (
            <RoyalGardenQuote verse={quotesSection.verse} source={quotesSection.source} />
          )}

          {/* Couple */}
          {(isSectionEnabled(cfg, 'groom') || isSectionEnabled(cfg, 'bride')) && (
            <RoyalGardenCouple groom={groom} bride={bride} />
          )}

          {/* Story */}
          <RoyalGardenStory />

          {/* Countdown */}
          {isSectionEnabled(cfg, 'countdown') && (
            <RoyalGardenCountdown targetDate={targetDate} eventDateFormatted={formattedDate} />
          )}

          {/* Events */}
          {isSectionEnabled(cfg, 'event') && <RoyalGardenEvents events={events} />}

          {/* Attire */}
          <RoyalGardenAttire />

          {/* Gallery */}
          {isSectionEnabled(cfg, 'gallery') && (
            <RoyalGardenGallery 
              photos={
                Array.isArray(getSectionContent(cfg, 'gallery').images) 
                  ? getSectionContent(cfg, 'gallery').images.filter((img: any) => img.url).map((img: any) => img.url) 
                  : undefined
              }
            />
          )}

          {/* Streaming */}
          <RoyalGardenStreaming />

          {/* RSVP */}
          {isSectionEnabled(cfg, 'rsvp') && (
            <RoyalGardenRsvp
              eventNames={events.map(e => e.title)}
              rsvpMessage={getSectionContent(cfg, 'rsvp').message}
            />
          )}

          {/* Gift */}
          {isSectionEnabled(cfg, 'gift') && (
            <RoyalGardenGift
              accounts={giftSection.bankName ? [{
                bankName: giftSection.bankName,
                accountNumber: giftSection.accountNumber || '',
                accountName: giftSection.accountName || `${groomName} & ${brideName}`,
              }] : undefined}
              address={giftSection.address}
            />
          )}

          {/* Closing */}
          {isSectionEnabled(cfg, 'thanks') && (
            <RoyalGardenClosing
              groomName={groom.name}
              brideName={bride.name}
              thankYouMessage={getSectionContent(cfg, 'thanks').message}
            />
          )}
        </div>
      )}
    </div>
  )
}
