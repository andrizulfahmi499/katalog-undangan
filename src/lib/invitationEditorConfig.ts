import { z } from 'zod'
import { TEMPLATE_OPTIONS } from '@/lib/invitationTemplates'

export type EditorSectionItem = {
  id: string
  label: string
  enabled: boolean
  expanded?: boolean
  content?: Record<string, string>
}

export type InvitationEditorConfig = {
  version: 1
  sections: EditorSectionItem[]
  ui: {
    primaryColor: string
    backgroundColor: string
    backgroundImageUrl: string
    musicUrl: string
    musicEnabled: boolean
  }
  isActive: boolean
  invitationType: 'scroll' | 'paged'
  luckyDraw: {
    enabled: boolean
    title: string
  }
}

const sectionItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  enabled: z.boolean(),
  expanded: z.boolean().optional(),
  content: z.record(z.string(), z.string()).optional(),
})

const editorConfigSchema = z.object({
  version: z.literal(1).optional(),
  sections: z.array(sectionItemSchema).optional(),
  ui: z
    .object({
      primaryColor: z.string(),
      backgroundColor: z.string(),
      backgroundImageUrl: z.string(),
      musicUrl: z.string(),
      musicEnabled: z.boolean(),
    })
    .partial()
    .optional(),
  isActive: z.boolean().optional(),
  invitationType: z.enum(['scroll', 'paged']).optional(),
  luckyDraw: z
    .object({
      enabled: z.boolean(),
      title: z.string().optional(),
    })
    .optional(),
})

export const DEFAULT_EDITOR_SECTIONS: EditorSectionItem[] = [
  {
    id: 'opening',
    label: 'Opening',
    enabled: true,
    content: {
      subtitle: 'The Wedding Of',
      title: 'Akbar & Madia',
      guest: 'Tamu Undangan',
      place: 'di Tempat',
    },
  },
  {
    id: 'quotes',
    label: 'Quotes',
    enabled: true,
    content: {
      verse:
        'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri...',
      source: '(QS Ar-Rum : 21)',
    },
  },
  {
    id: 'groom',
    label: 'Groom',
    enabled: true,
    content: {
      name: 'Ahmad Akbar',
      parents: 'Putra dari Bpk. Mansur Mading dan Ibu Ratnawati Baharuddin',
      instagram: 'https://instagram.com/',
    },
  },
  {
    id: 'bride',
    label: 'Bride',
    enabled: true,
    content: {
      name: 'Rahmadia',
      parents: 'Putri dari Bpk. Marwan Mahmud (Alm) dan Ibu Rapia Hasan L Karama',
      instagram: 'https://instagram.com/',
    },
  },
  {
    id: 'event',
    label: 'Event',
    enabled: true,
    content: {
      eventTitle: 'Mapparola',
      date: 'Kamis, 16 April 2026',
      time: '11.00 Wita - Selesai',
      venue: 'Dusun Silandar Desa Posona',
      address: 'Kec Kasimbar',
    },
  },
  {
    id: 'maps',
    label: 'Maps',
    enabled: false,
    content: {
      venueName: 'Grand Ballroom Hotel Labersa',
      address: 'Jl. Labersa, Tanah Merah, Kec. Siak Hulu',
      mapsUrl: '',
    },
  },
  {
    id: 'countdown',
    label: 'Countdown',
    enabled: true,
    content: { targetDate: '2026-04-16T11:00' },
  },
  {
    id: 'yangMengundang',
    label: 'Yang Mengundang',
    enabled: true,
    content: { families: 'Bpk. Mansur Mading - Hj. Ledeng / Ratnawati Baharuddin - Hayati' },
  },
  {
    id: 'turutMengundang',
    label: 'Turut Mengundang',
    enabled: true,
    content: {
      maleSide: 'Kel. Darmawan S. Hut (Kades Posona)',
      femaleSide: 'Kel. Iswandi Idris, S.IP (Kader Siney Tengah)',
    },
  },
  { id: 'gallery', label: 'Gallery', enabled: true, content: {} },
  {
    id: 'rsvp',
    label: 'RSVP',
    enabled: true,
    content: { message: 'Please help us prepare by confirming your attendance' },
  },
  {
    id: 'gift',
    label: 'Gift',
    enabled: true,
    content: {
      bankName: 'BCA',
      accountNumber: '12345678',
      accountName: 'Atas Nama Rekening',
      address: 'Jl. Wildan Sari 1 No 11 Banjarmasin Barat 70119',
    },
  },
  {
    id: 'thanks',
    label: 'Thanks',
    enabled: true,
    content: {
      groomName: 'Akbar',
      brideName: 'Madia',
      message: "Atas kehadiran dan do'a restunya kami ucapkan terima kasih.",
    },
  },
]

const defaultUi = (): InvitationEditorConfig['ui'] => ({
  primaryColor: '#6C5CE7',
  backgroundColor: '#FFFFFF',
  backgroundImageUrl: '',
  musicUrl: '',
  musicEnabled: false,
})

export function defaultEditorConfig(): InvitationEditorConfig {
  return {
    version: 1,
    sections: DEFAULT_EDITOR_SECTIONS.map((s) => ({
      ...s,
      content: s.content ? { ...s.content } : undefined,
    })),
    ui: defaultUi(),
    isActive: true,
    invitationType: 'scroll',
    luckyDraw: { enabled: false, title: 'Lucky Draw' },
  }
}

function mergeEditorConfig(parsed: z.infer<typeof editorConfigSchema>): InvitationEditorConfig {
  const base = defaultEditorConfig()
  const uiIn = parsed.ui ?? {}
  return {
    version: 1,
    sections:
      parsed.sections && parsed.sections.length > 0 ? parsed.sections : base.sections,
    ui: {
      primaryColor: uiIn.primaryColor ?? base.ui.primaryColor,
      backgroundColor: uiIn.backgroundColor ?? base.ui.backgroundColor,
      backgroundImageUrl: uiIn.backgroundImageUrl ?? base.ui.backgroundImageUrl,
      musicUrl: uiIn.musicUrl ?? base.ui.musicUrl,
      musicEnabled: uiIn.musicEnabled ?? base.ui.musicEnabled,
    },
    isActive: parsed.isActive ?? base.isActive,
    invitationType: parsed.invitationType ?? base.invitationType,
    luckyDraw: {
      enabled: parsed.luckyDraw?.enabled ?? base.luckyDraw.enabled,
      title: parsed.luckyDraw?.title ?? base.luckyDraw.title,
    },
  }
}

/** Parse stored JSON from DB; invalid or missing values fall back to defaults. */
export function parseEditorConfig(raw: unknown): InvitationEditorConfig {
  if (raw == null || typeof raw !== 'object') {
    return defaultEditorConfig()
  }
  const result = editorConfigSchema.safeParse(raw)
  if (!result.success) {
    return defaultEditorConfig()
  }
  return mergeEditorConfig(result.data)
}

export function editorConfigToJson(config: InvitationEditorConfig): object {
  return {
    version: 1,
    sections: config.sections,
    ui: config.ui,
    isActive: config.isActive,
    invitationType: config.invitationType,
    luckyDraw: config.luckyDraw,
  }
}

export function defaultTemplateId(): string {
  return TEMPLATE_OPTIONS[0]?.id ?? 'wedding-blue'
}
