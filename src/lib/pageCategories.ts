export type LayoutPreset = {
  id: string
  name: string
  thumbnail: string // SVG string or URL
  isPremium: boolean
  defaultContent: Record<string, any>
}

export type PageCategory = {
  id: string
  name: string
  icon: string
  description: string
  layouts: LayoutPreset[]
}

export const PAGE_CATEGORIES: PageCategory[] = [
  // ─── OPENING ────────────────────────────────────────────────────────────────
  {
    id: 'opening',
    name: 'Opening',
    icon: 'sparkles',
    description: 'Halaman pembuka dengan nama tamu',
    layouts: [
      {
        id: 'opening-classic',
        name: 'Classic Centered',
        thumbnail: '',
        isPremium: false,
        defaultContent: {
          title: 'The Wedding Of',
          coupleNames: 'Akbar & Madia',
          guestLabel: 'Kepada Yth.',
          buttonLabel: 'Buka Undangan',
          eventDate: '',
        },
      },
      {
        id: 'opening-arch',
        name: 'Arch Photo',
        thumbnail: '',
        isPremium: false,
        defaultContent: {
          title: 'The Wedding Of',
          coupleNames: 'Akbar & Madia',
          guestLabel: 'Kepada Yth.',
          buttonLabel: 'Buka Undangan',
          photoUrl: '',
          eventDate: '',
        },
      },
      {
        id: 'opening-oval-text',
        name: 'Oval Elegant',
        thumbnail: '',
        isPremium: true,
        defaultContent: {
          title: 'You Are Invited To',
          coupleNames: 'Akbar & Madia',
          guestLabel: 'Kepada Yth.',
          buttonLabel: 'Buka Undangan',
          eventDate: '',
        },
      },
      {
        id: 'opening-modern',
        name: 'Modern Fullscreen (Premium)',
        thumbnail: '',
        isPremium: true,
        defaultContent: {
          subtitle: 'The Wedding Of',
          title: 'Akbar & Madia',
          guestLabel: 'Kepada Yth. Bapak/Ibu/Saudara/i',
          buttonLabel: 'Buka Undangan',
          photoUrl: '',
          eventDate: '',
        },
      },
    ],
  },

  // ─── LOVE STORY ─────────────────────────────────────────────────────────────
  {
    id: 'loveStory',
    name: 'Love Story',
    icon: 'heart',
    description: 'Cerita perjalanan cinta pasangan',
    layouts: [
      {
        id: 'lovestory-timeline',
        name: 'Timeline Vertikal',
        thumbnail: '',
        isPremium: false,
        defaultContent: {
          sectionTitle: 'Love Story',
          stories: [
            { id: '1', year: '2020', title: 'Pertama Bertemu', description: 'Kami pertama bertemu di...', photoUrl: '' },
            { id: '2', year: '2022', title: 'Resmi Berpacaran', description: 'Ia mengungkapkan perasaannya...', photoUrl: '' },
            { id: '3', year: '2024', title: 'Lamaran', description: 'Momen tak terlupakan ketika...', photoUrl: '' },
          ],
        },
      },
      {
        id: 'lovestory-cards',
        name: 'Photo Cards',
        thumbnail: '',
        isPremium: true,
        defaultContent: {
          sectionTitle: 'Our Journey',
          stories: [
            { id: '1', year: '2020', title: 'Pertama Bertemu', description: 'Kami pertama bertemu di...', photoUrl: '' },
            { id: '2', year: '2022', title: 'Resmi Berpacaran', description: 'Ia mengungkapkan perasaannya...', photoUrl: '' },
          ],
        },
      },
    ],
  },

  // ─── QUOTES ─────────────────────────────────────────────────────────────────
  {
    id: 'quotes',
    name: 'Quotes',
    icon: 'quote',
    description: 'Kutipan atau ayat suci',
    layouts: [
      {
        id: 'quotes-centered',
        name: 'Centered Text',
        thumbnail: '',
        isPremium: false,
        defaultContent: {
          quote: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya...',
          source: '(QS. Ar-Rum: 21)',
        },
      },
      {
        id: 'quotes-verse',
        name: 'Ayat Suci Bergambar',
        thumbnail: '',
        isPremium: false,
        defaultContent: {
          arabicText: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم...',
          quote: 'Dan di antara tanda-tanda kekuasaan-Nya...',
          source: '(QS. Ar-Rum: 21)',
        },
      },
    ],
  },

  // ─── PROFIL ─────────────────────────────────────────────────────────────────
  {
    id: 'profil',
    name: 'Profil',
    icon: 'user',
    description: 'Biodata singkat mempelai',
    layouts: [
      {
        id: 'profil-split',
        name: 'Split Side by Side',
        thumbnail: '',
        isPremium: false,
        defaultContent: {
          groomNickname: 'Akbar',
          groomFullName: 'Ahmad Akbar S.T.',
          groomParents: 'Putra dari Bapak Mansur & Ibu Ratnawati',
          groomInstagram: '',
          groomPhotoUrl: '',
          brideNickname: 'Madia',
          brideFullName: 'Rahmadia S.Pd.',
          brideParents: 'Putri dari Bapak Marwan & Ibu Rapia',
          brideInstagram: '',
          bridePhotoUrl: '',
        },
      },
      {
        id: 'profil-stacked',
        name: 'Stacked Vertical',
        thumbnail: '',
        isPremium: false,
        defaultContent: {
          groomNickname: 'Akbar',
          groomFullName: 'Ahmad Akbar S.T.',
          groomParents: 'Putra dari Bapak Mansur & Ibu Ratnawati',
          groomPhotoUrl: '',
          brideNickname: 'Madia',
          brideFullName: 'Rahmadia S.Pd.',
          brideParents: 'Putri dari Bapak Marwan & Ibu Rapia',
          bridePhotoUrl: '',
        },
      },
    ],
  },

  // ─── SALAM ──────────────────────────────────────────────────────────────────
  {
    id: 'salam',
    name: 'Salam',
    icon: 'message-circle',
    description: 'Salam pembuka dari pasangan',
    layouts: [
      {
        id: 'salam-bismi',
        name: 'Bismillah Opening',
        thumbnail: '',
        isPremium: false,
        defaultContent: {
          arabicGreeting: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
          greeting: 'Assalamualaikum Warahmatullahi Wabarakatuh',
          message: 'Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di hari bahagia kami.',
          closingGreeting: 'Wassalamualaikum Warahmatullahi Wabarakatuh',
          senderName: 'Ahmad Akbar & Rahmadia',
        },
      },
      {
        id: 'salam-simple',
        name: 'Salam Minimalis',
        thumbnail: '',
        isPremium: false,
        defaultContent: {
          greeting: 'Assalamualaikum Wr. Wb.',
          message: 'Dengan penuh rasa syukur dan kerendahan hati, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri resepsi pernikahan kami.',
          senderName: 'Akbar & Madia',
        },
      },
    ],
  },

  // ─── MEMPELAI ───────────────────────────────────────────────────────────────
  {
    id: 'mempelai',
    name: 'Mempelai',
    icon: 'users',
    description: 'Detail gabungan pasangan',
    layouts: [
      {
        id: 'mempelai-minimalist',
        name: 'Minimalis',
        thumbnail: '',
        isPremium: false,
        defaultContent: {
          groomName: 'Ahmad Akbar S.T.',
          groomNickname: 'Akbar',
          groomParents: 'Putra ke-1 dari\nBapak Mansur & Ibu Ratnawati',
          groomInstagram: '',
          groomPhotoUrl: '',
          brideName: 'Rahmadia S.Pd.',
          brideNickname: 'Madia',
          brideParents: 'Putri ke-2 dari\nBapak Marwan & Ibu Rapia',
          brideInstagram: '',
          bridePhotoUrl: '',
          ampersandStyle: '&',
        },
      },
      {
        id: 'mempelai-elegant',
        name: 'Elegant Side',
        thumbnail: '',
        isPremium: true,
        defaultContent: {
          groomName: 'Ahmad Akbar S.T.',
          groomNickname: 'Akbar',
          groomParents: 'Putra ke-1 dari\nBapak Mansur & Ibu Ratnawati',
          groomPhotoUrl: '',
          brideName: 'Rahmadia S.Pd.',
          brideNickname: 'Madia',
          brideParents: 'Putri ke-2 dari\nBapak Marwan & Ibu Rapia',
          bridePhotoUrl: '',
        },
      },
    ],
  },

  // ─── ACARA ──────────────────────────────────────────────────────────────────
  {
    id: 'acara',
    name: 'Acara',
    icon: 'calendar',
    description: 'Informasi penyelenggaraan acara',
    layouts: [
      {
        id: 'acara-card',
        name: 'Card Vertikal',
        thumbnail: '',
        isPremium: false,
        defaultContent: {
          events: [
            { id: '1', name: 'Akad Nikah', date: '2026-08-20', time: '09:00 WITA - Selesai', venue: 'Masjid Agung', address: 'Jl. Jenderal Sudirman No 1' },
            { id: '2', name: 'Resepsi', date: '2026-08-20', time: '12:00 WITA - Selesai', venue: 'Gedung Serbaguna', address: 'Jl. Jenderal Sudirman No 1' },
          ],
        },
      },
      {
        id: 'acara-horizontal',
        name: 'Card Horizontal',
        thumbnail: '',
        isPremium: false,
        defaultContent: {
          events: [
            { id: '1', name: 'Akad Nikah', date: '2026-08-20', time: '09:00 WITA - Selesai', venue: 'Masjid Agung', address: 'Jl. Jenderal Sudirman No 1' },
          ],
        },
      },
    ],
  },

  // ─── MAPS ───────────────────────────────────────────────────────────────────
  {
    id: 'maps',
    name: 'Maps',
    icon: 'map-pin',
    description: 'Peta lokasi interaktif',
    layouts: [
      {
        id: 'maps-embed',
        name: 'Google Maps Embed',
        thumbnail: '',
        isPremium: false,
        defaultContent: {
          venueName: 'Masjid Agung',
          address: 'Jl. Jenderal Sudirman No 1, Kota Palu',
          mapsEmbedUrl: '',
          mapsDirectionUrl: '',
          buttonLabel: 'Buka Google Maps',
        },
      },
      {
        id: 'maps-waze',
        name: 'Multi-Navigation',
        thumbnail: '',
        isPremium: false,
        defaultContent: {
          venueName: 'Masjid Agung',
          address: 'Jl. Jenderal Sudirman No 1',
          mapsEmbedUrl: '',
          mapsDirectionUrl: '',
          wazeUrl: '',
          showWaze: true,
          showGoogleMaps: true,
        },
      },
    ],
  },

  // ─── RUNDOWN ────────────────────────────────────────────────────────────────
  {
    id: 'rundown',
    name: 'Rundown',
    icon: 'list-ordered',
    description: 'Susunan acara / jadwal pernikahan',
    layouts: [
      {
        id: 'rundown-timeline',
        name: 'Timeline Jadwal',
        thumbnail: '',
        isPremium: false,
        defaultContent: {
          sectionTitle: 'Susunan Acara',
          items: [
            { id: '1', time: '08:00', title: 'Registrasi Tamu', description: '' },
            { id: '2', time: '09:00', title: 'Akad Nikah', description: '' },
            { id: '3', time: '11:00', title: 'Resepsi & Sesi Foto', description: '' },
            { id: '4', time: '13:00', title: 'Hiburan & Doorprize', description: '' },
            { id: '5', time: '15:00', title: 'Penutup', description: '' },
          ],
        },
      },
    ],
  },

  // ─── FILTER ─────────────────────────────────────────────────────────────────
  {
    id: 'filter',
    name: 'Filter',
    icon: 'sliders',
    description: 'Instagram / TikTok filter AR undangan',
    layouts: [
      {
        id: 'filter-instagram',
        name: 'Instagram Filter',
        thumbnail: '',
        isPremium: false,
        defaultContent: {
          sectionTitle: 'Filter Undangan',
          filterName: 'Akbar & Madia Wedding Filter',
          filterUrl: '',
          platform: 'instagram',
          previewImageUrl: '',
          instruction: 'Gunakan filter spesial hari bahagia kami! Tap tombol di bawah untuk mencoba filter.',
        },
      },
      {
        id: 'filter-tiktok',
        name: 'TikTok Filter',
        thumbnail: '',
        isPremium: false,
        defaultContent: {
          sectionTitle: 'Filter TikTok',
          filterName: 'Akbar & Madia Wedding Filter',
          filterUrl: '',
          platform: 'tiktok',
          previewImageUrl: '',
          instruction: 'Coba filter pernikahan kami di TikTok!',
        },
      },
    ],
  },

  // ─── LIVE ───────────────────────────────────────────────────────────────────
  {
    id: 'live',
    name: 'Live',
    icon: 'video',
    description: 'Live streaming acara pernikahan',
    layouts: [
      {
        id: 'live-youtube',
        name: 'YouTube Live',
        thumbnail: '',
        isPremium: false,
        defaultContent: {
          sectionTitle: 'Live Streaming',
          platform: 'youtube',
          streamUrl: '',
          startDate: '',
          startTime: '',
          description: 'Saksikan momen bahagia kami secara langsung!',
          buttonLabel: 'Tonton Live',
        },
      },
      {
        id: 'live-zoom',
        name: 'Zoom Meeting',
        thumbnail: '',
        isPremium: false,
        defaultContent: {
          sectionTitle: 'Zoom Wedding',
          platform: 'zoom',
          meetingId: '',
          meetingPassword: '',
          meetingUrl: '',
          startDate: '',
          startTime: '',
          description: 'Bergabunglah bersama kami via Zoom!',
          buttonLabel: 'Join Zoom',
        },
      },
    ],
  },

  // ─── GALLERY ────────────────────────────────────────────────────────────────
  {
    id: 'gallery',
    name: 'Gallery',
    icon: 'image',
    description: 'Album foto prewedding',
    layouts: [
      {
        id: 'gallery-grid',
        name: 'Grid 9-Kotak',
        thumbnail: '',
        isPremium: false,
        defaultContent: {
          sectionTitle: 'Gallery',
          images: [],
          columns: 3,
        },
      },
      {
        id: 'gallery-masonry',
        name: 'Masonry Premium',
        thumbnail: '',
        isPremium: true,
        defaultContent: {
          sectionTitle: 'Our Moments',
          images: [],
        },
      },
      {
        id: 'gallery-slideshow',
        name: 'Slideshow / Carousel',
        thumbnail: '',
        isPremium: false,
        defaultContent: {
          sectionTitle: 'Gallery',
          images: [],
          autoPlay: true,
          interval: 3000,
        },
      },
    ],
  },

  // ─── GIFT ───────────────────────────────────────────────────────────────────
  {
    id: 'gift',
    name: 'Gift',
    icon: 'gift',
    description: 'Angpao digital atau kado fisik',
    layouts: [
      {
        id: 'gift-bank',
        name: 'Transfer Bank',
        thumbnail: '',
        isPremium: false,
        defaultContent: {
          sectionTitle: 'Hadiah Pernikahan',
          accounts: [
            { id: '1', bankName: 'BCA', accountNumber: '12345678', accountName: 'Ahmad Akbar', logoUrl: '' },
          ],
          physicalGiftAddress: '',
          showPhysicalAddress: false,
        },
      },
      {
        id: 'gift-qris',
        name: 'QRIS Popup',
        thumbnail: '',
        isPremium: true,
        defaultContent: {
          sectionTitle: 'Hadiah Digital',
          qrisImageUrl: '',
          accounts: [],
          physicalGiftAddress: '',
        },
      },
    ],
  },

  // ─── CONTACT ────────────────────────────────────────────────────────────────
  {
    id: 'contact',
    name: 'Contact',
    icon: 'phone',
    description: 'Kontak person panitia/keluarga',
    layouts: [
      {
        id: 'contact-cards',
        name: 'Contact Cards',
        thumbnail: '',
        isPremium: false,
        defaultContent: {
          sectionTitle: 'Info & Konfirmasi',
          contacts: [
            { id: '1', name: 'Bapak Mansur', role: 'Ayah Mempelai Pria', phone: '08123456789', whatsapp: '08123456789' },
            { id: '2', name: 'Ibu Ratnawati', role: 'Ibu Mempelai Pria', phone: '08198765432', whatsapp: '08198765432' },
          ],
        },
      },
    ],
  },

  // ─── VIDEO ──────────────────────────────────────────────────────────────────
  {
    id: 'video',
    name: 'Video',
    icon: 'play-circle',
    description: 'Video prewedding / sinematik',
    layouts: [
      {
        id: 'video-youtube',
        name: 'YouTube Embed',
        thumbnail: '',
        isPremium: false,
        defaultContent: {
          sectionTitle: 'Prewedding Video',
          videoUrl: '',
          thumbnailUrl: '',
          description: '',
        },
      },
    ],
  },

  // ─── RSVP ───────────────────────────────────────────────────────────────────
  {
    id: 'rsvp',
    name: 'RSVP',
    icon: 'message-square',
    description: 'Formulir konfirmasi kehadiran',
    layouts: [
      {
        id: 'rsvp-clean',
        name: 'Clean Card',
        thumbnail: '',
        isPremium: false,
        defaultContent: {
          sectionTitle: 'Konfirmasi Kehadiran',
          description: 'Mohon isi formulir di bawah ini untuk membantu kami mempersiapkan acara.',
          showComments: true,
          submitButtonLabel: 'Konfirmasi Kehadiran',
        },
      },
      {
        id: 'rsvp-gradient',
        name: 'Gradient Modern',
        thumbnail: '',
        isPremium: true,
        defaultContent: {
          sectionTitle: 'Konfirmasi Kehadiran',
          description: 'Kehadiran Anda adalah kebahagiaan bagi kami.',
          showComments: true,
          submitButtonLabel: 'Kirim Konfirmasi',
        },
      },
    ],
  },

  // ─── DRESSCODE ──────────────────────────────────────────────────────────────
  {
    id: 'dresscode',
    name: 'Dresscode',
    icon: 'shirt',
    description: 'Aturan berpakaian tamu undangan',
    layouts: [
      {
        id: 'dresscode-palette',
        name: 'Palet Warna',
        thumbnail: '',
        isPremium: false,
        defaultContent: {
          sectionTitle: 'Dresscode',
          instruction: 'Untuk kelancaran acara, kami mengharapkan kehadiran tamu dengan busana:',
          colors: [
            { id: '1', name: 'Sage Green', hex: '#87A878', note: 'Warna utama' },
            { id: '2', name: 'Dusty Rose', hex: '#C4A4A4', note: 'Warna pendamping' },
            { id: '3', name: 'Cream / Off White', hex: '#FAF3E0', note: '' },
          ],
          avoidColors: 'Hindari warna hitam pekat dan merah terang.',
          note: 'Harap kenakan busana formal / semi formal.',
        },
      },
    ],
  },

  // ─── MENGUNDANG ─────────────────────────────────────────────────────────────
  {
    id: 'mengundang',
    name: 'Mengundang',
    icon: 'users-2',
    description: 'Pihak yang turut mengundang',
    layouts: [
      {
        id: 'mengundang-list',
        name: 'Daftar Keluarga',
        thumbnail: '',
        isPremium: false,
        defaultContent: {
          sectionTitle: 'Turut Mengundang',
          families: [
            { id: '1', name: 'Kel. Darmawan S. Hut', role: 'Kades Posona' },
            { id: '2', name: 'Kel. Iswandi Idris, S.IP', role: 'Kader Siney Tengah' },
          ],
          note: '',
        },
      },
    ],
  },

  // ─── PROTOKOL ───────────────────────────────────────────────────────────────
  {
    id: 'protokol',
    name: 'Protokol',
    icon: 'shield-check',
    description: 'Protokol kesehatan & aturan acara',
    layouts: [
      {
        id: 'protokol-health',
        name: 'Protokol Kesehatan',
        thumbnail: '',
        isPremium: false,
        defaultContent: {
          sectionTitle: 'Protokol Kesehatan',
          introduction: 'Demi kenyamanan dan keselamatan bersama, kami memohon kepada seluruh tamu undangan untuk mengikuti protokol berikut:',
          items: [
            { id: '1', icon: 'mask', text: 'Wajib menggunakan masker' },
            { id: '2', icon: 'hand-sanitizer', text: 'Mencuci tangan sebelum masuk' },
            { id: '3', icon: 'distance', text: 'Menjaga jarak minimal 1 meter' },
            { id: '4', icon: 'thermometer', text: 'Wajib cek suhu tubuh' },
            { id: '5', icon: 'time', text: 'Hadir sesuai sesi undangan' },
          ],
          closing: 'Terima kasih atas pengertian dan kerja samanya.',
        },
      },
      {
        id: 'protokol-rules',
        name: 'Aturan Acara',
        thumbnail: '',
        isPremium: false,
        defaultContent: {
          sectionTitle: 'Aturan & Tata Tertib',
          introduction: 'Untuk kelancaran acara, kami memohon perhatian tamu undangan:',
          items: [
            { id: '1', icon: 'camera', text: 'Diizinkan mengambil foto & video' },
            { id: '2', icon: 'mobile', text: 'Mohon silent / mode getar HP' },
            { id: '3', icon: 'car', text: 'Parkir tersedia di halaman gedung' },
          ],
          closing: '',
        },
      },
    ],
  },
]
