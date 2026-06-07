'use client'

import { useState } from 'react'
import { parseEditorConfig, type InvitationEditorConfig } from '@/lib/invitationEditorConfig'
import DJCover from './dreamyjavanese/DJCover'
import DJHero from './dreamyjavanese/DJHero'
import DJQuote from './dreamyjavanese/DJQuote'
import DJCouple from './dreamyjavanese/DJCouple'
import DJStory from './dreamyjavanese/DJStory'
import DJEvents from './dreamyjavanese/DJEvents'
import DJGallery from './dreamyjavanese/DJGallery'
import DJRsvp from './dreamyjavanese/DJRsvp'
import DJGift from './dreamyjavanese/DJGift'
import DJWishes from './dreamyjavanese/DJWishes'

interface DreamyJavaneseTemplateProps {
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

export default function DreamyJavaneseTemplate({ invitation, formattedDate }: DreamyJavaneseTemplateProps) {
  const [isOpened, setIsOpened] = useState(false)
  const cfg = parseEditorConfig(invitation.editorConfig)

  const [groomName, brideName] = invitation.title.split(/\s*&\s*/).map(n => n.trim())

  const groomSection = getSectionContent(cfg, 'groom')
  const brideSection = getSectionContent(cfg, 'bride')
  const quotesSection = getSectionContent(cfg, 'quotes')
  const eventSection = getSectionContent(cfg, 'event')
  const mapsSection = getSectionContent(cfg, 'maps')
  const giftSection = getSectionContent(cfg, 'gift')
  const thanksSection = getSectionContent(cfg, 'thanks')
  const countdownSection = getSectionContent(cfg, 'countdown')

  const groom = {
    name: groomSection.name || groomName || 'Putra',
    parents: groomSection.parents || 'Putra dari Bapak & Ibu',
    instagram: groomSection.instagram || '',
    photo: groomSection.photo || '',
  }

  const bride = {
    name: brideSection.name || brideName || 'Putri',
    parents: brideSection.parents || 'Putri dari Bapak & Ibu',
    instagram: brideSection.instagram || '',
    photo: brideSection.photo || '',
  }

  const eventDate = new Date(invitation.eventDate)
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

  const events = [{
    title: eventSection.eventTitle || invitation.eventName || 'Resepsi Pernikahan',
    day: dayNames[eventDate.getDay()],
    month: monthNames[eventDate.getMonth()],
    date: String(eventDate.getDate()),
    year: String(eventDate.getFullYear()),
    time: eventSection.time || '10:00 WIB',
    venue: eventSection.venue || mapsSection.venueName || invitation.location,
    address: eventSection.address || mapsSection.address || '',
    mapsUrl: mapsSection.mapsUrl || '',
  }]

  const targetDate = countdownSection.targetDate || invitation.eventDate

  return (
    <div className="relative w-full overflow-hidden" style={{ backgroundColor: '#2f2115', color: '#d0ba96' }}>
      {/* Global fonts & sparkle animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Great+Vibes&display=swap');
        .font-dreamy-title { font-family: 'Cinzel', serif; }
        .font-dreamy-body { font-family: 'Playfair Display', serif; }
        .font-dreamy-display { font-family: 'Great Vibes', cursive; }
        
        .dj-sparkles {
          position: absolute; inset: 0; pointer-events: none; z-index: 5;
          background-image:
            radial-gradient(1px 1px at 10% 20%, rgba(238,220,189,0.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 30% 50%, rgba(208,186,150,0.4) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 50% 10%, rgba(238,220,189,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 70% 60%, rgba(208,186,150,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 90% 30%, rgba(238,220,189,0.4) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 20% 80%, rgba(208,186,150,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 60% 90%, rgba(238,220,189,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 80% 70%, rgba(208,186,150,0.4) 0%, transparent 100%);
          animation: sparkleFloat 8s ease-in-out infinite alternate;
        }
        @keyframes sparkleFloat {
          0% { opacity: 0.4; transform: translateY(0); }
          50% { opacity: 0.8; }
          100% { opacity: 0.4; transform: translateY(-20px); }
        }
        
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(208,186,150,0.2); border-radius: 2px; }
      `}} />

      {/* Cover */}
      <DJCover
        groomName={groom.name}
        brideName={bride.name}
        isOpened={isOpened}
        onOpen={() => setIsOpened(true)}
      />

      {/* Main content */}
      <div className={`transition-opacity duration-1000 ${isOpened ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Sparkle overlay for entire page */}
        <div className="dj-sparkles fixed inset-0 z-[5]" />

        {/* Hero / Inner Cover */}
        <DJHero groomName={groom.name} brideName={bride.name} formattedDate={formattedDate} />

        {/* Quote */}
        {isSectionEnabled(cfg, 'quotes') && (
          <DJQuote verse={quotesSection.verse} source={quotesSection.source} />
        )}

        {/* Couple */}
        {(isSectionEnabled(cfg, 'groom') || isSectionEnabled(cfg, 'bride')) && (
          <DJCouple groom={groom} bride={bride} />
        )}

        {/* Love Story */}
        <DJStory />

        {/* Events + Countdown */}
        {isSectionEnabled(cfg, 'event') && (
          <DJEvents events={events} targetDate={targetDate} />
        )}

        {/* Gallery */}
        {isSectionEnabled(cfg, 'gallery') && (
          <DJGallery 
            photos={
              Array.isArray(getSectionContent(cfg, 'gallery').images) 
                ? getSectionContent(cfg, 'gallery').images.filter((img: any) => img.url).map((img: any) => img.url) 
                : undefined
            }
          />
        )}

        {/* RSVP */}
        {isSectionEnabled(cfg, 'rsvp') && (
          <DJRsvp invitationId={invitation.id} />
        )}

        {/* Digital Gift */}
        {isSectionEnabled(cfg, 'gift') && (
          <DJGift
            bankName={giftSection.bankName}
            accountNumber={giftSection.accountNumber}
            accountName={giftSection.accountName}
            address={giftSection.address}
          />
        )}

        {/* Wishes + Closing */}
        <DJWishes
          invitationId={invitation.id}
          groomName={groom.name}
          brideName={bride.name}
          closingMessage={thanksSection.message}
        />

        {/* Footer */}
        <div className="relative py-8 text-center" style={{ backgroundColor: '#1a1008' }}>
          <p className="font-dreamy-body text-[#d0ba96]/30 text-xs">Powered by Katalog Undanganku</p>
        </div>
      </div>
    </div>
  )
}
