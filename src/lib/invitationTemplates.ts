export type TemplateOption = {
  id: string
  title: string
  category: 'Pernikahan' | 'Ultah'
  accent: string
  description: string
  heroLabel: string
  heroLine: string
  defaultMessage: string
}

export const TEMPLATE_OPTIONS: TemplateOption[] = [
  {
    id: 'wedding-blue',
    title: 'Minimalis Pernikahan',
    category: 'Pernikahan',
    accent: 'from-sky-500 to-cyan-500',
    description: 'Desain modern dengan nuansa biru yang lembut dan elegan.',
    heroLabel: 'Undangan Pernikahan',
    heroLine: 'Bersama keluarga besar kami',
    defaultMessage:
      'Kepada Yth. Bapak/Ibu/Saudara/i *{nama_tamu}*\n\nDengan hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.\n\nInfo lengkap dan undangan dapat dibuka melalui link berikut:\n{link_undangan}\n\nTerima kasih atas kehadiran dan doanya.',
  },
  {
    id: 'wedding-sunset',
    title: 'Pernikahan Sunset',
    category: 'Pernikahan',
    accent: 'from-orange-400 to-amber-500',
    description: 'Tema hangat orange dengan aksen premium dan karakter modern.',
    heroLabel: 'Save the Date',
    heroLine: 'Cinta yang tak lekang waktu',
    defaultMessage:
      'Kepada Yth. Bapak/Ibu/Saudara/i *{nama_tamu}*\n\nDengan penuh rasa syukur kami mengundang Bapak/Ibu/Saudara/i untuk menyaksikan pernikahan kami.\n\nSilakan buka link undangan untuk informasi lengkap:\n{link_undangan}\n\nKami tunggu kehadiran Anda.',
  },
  {
    id: 'birthday-sky',
    title: 'Ultah Biru',
    category: 'Ultah',
    accent: 'from-sky-500 to-blue-600',
    description: 'Gaya ulang tahun yang segar dan minimalis dengan nuansa biru.',
    heroLabel: 'Selamat Ulang Tahun',
    heroLine: 'Rayakan momen spesial bersama',
    defaultMessage:
      'Halo *{nama_tamu}*\n\nMari rayakan ulang tahun kami bersama di acara yang penuh kebahagiaan dan warna.\n\nDetail lengkap dapat dilihat di link berikut:\n{link_undangan}\n\nSampai jumpa di hari spesial!',
  },
  {
    id: 'birthday-orange',
    title: 'Ultah Orange',
    category: 'Ultah',
    accent: 'from-orange-500 to-amber-500',
    description: 'Tampilan meriah dengan sentuhan orange dan detail modern.',
    heroLabel: 'Ayo Rayakan',
    heroLine: 'Pesta ulang tahun spesial',
    defaultMessage:
      'Hai *{nama_tamu}*\n\nKami mengundangmu untuk datang ke perayaan ulang tahun kami.\n\nBuka link undangan untuk informasi lengkap:\n{link_undangan}\n\nJangan lupa hadir ya!',
  },
  {
    id: 'dream-land',
    title: 'Dream Land',
    category: 'Pernikahan',
    accent: 'from-pink-300 to-yellow-200',
    description: 'Tema elegan dengan dekorasi floral dan layout premium seperti dearmylove.org. Fitur lengkap: countdown, gallery, video, RSVP, wishing well.',
    heroLabel: 'Dengan Kebanggaan',
    heroLine: 'Bersama segenap keluarga kami',
    defaultMessage:
      'Kepada Yth. Bapak/Ibu/Saudara/i *{nama_tamu}* _di tempat_\n\nDengan penuh kebahagiaan kami mengundang Bapak/Ibu/Saudara/i untuk memeriahkan acara pernikahan kami.\n\nMerupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i dapat hadir untuk memberi doa dan restu.\n\nLink undangan:\n{link_undangan}\n\nTerima kasih dan sampai jumpa!',
  },
  {
    id: 'verdant',
    title: 'Verdant Elegance',
    category: 'Pernikahan',
    accent: 'from-green-500 to-emerald-600',
    description: 'Tema hijau segar dan elegan seperti dearmylove.org template Verdant. Fitur lengkap: countdown timer, photo gallery, RSVP form, wishing well, dan wedding gift info.',
    heroLabel: 'The Wedding Of',
    heroLine: 'My Love',
    defaultMessage:
      'Kepada Yth. Bapak/Ibu/Saudara/i *{nama_tamu}*\n\nDengan penuh kebahagiaan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.\n\nAcara akan dilaksanakan pada:\n- Akad Nikah: {tanggal_akad} pukul {waktu_akad} WIB\n- Resepsi: {tanggal_resepsi} pukul {waktu_resepsi} WIB\n- Lokasi: {lokasi}\n\nLink undangan lengkap:\n{link_undangan}\n\nKehadiran dan doa restu Bapak/Ibu/Saudara/i merupakan karunia terbesar bagi kami.',
  },
  {
    id: 'corelia',
    title: 'Corelia',
    category: 'Pernikahan',
    accent: 'from-stone-100 to-amber-50',
    description: 'Template elegan dengan nuansa cream dan tipografi mewah. Dilengkapi gallery foto, countdown, RSVP, dan wedding gift.',
    heroLabel: 'The Wedding Of',
    heroLine: 'Together Forever',
    defaultMessage: 'Kepada Yth. Bapak/Ibu/Saudara/i *{nama_tamu}*\n\nDengan penuh kebahagiaan kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.\n\nLink undangan:\n{link_undangan}\n\nTerima kasih atas kehadiran dan doanya.',
  },
  {
    id: 'elgaze',
    title: 'Elgaze Luxury',
    category: 'Pernikahan',
    accent: 'from-stone-900 to-amber-900',
    description: 'Template premium dengan tema Dark Luxury, layout cinematic split-screen, dan transisi elegan.',
    heroLabel: 'The Grand Wedding',
    heroLine: 'A Journey of Love',
    defaultMessage:
      'Kepada Yth. Bapak/Ibu/Saudara/i *{nama_tamu}*\n\nMenjadi suatu kehormatan bagi kami untuk mengundang Anda merayakan persatuan cinta kami.\n\nDetail lengkap undangan dapat dilihat di:\n{link_undangan}\n\nTerima kasih atas doa dan kehadirannya.',
  },
]

export function getTemplateById(id: string) {
  return TEMPLATE_OPTIONS.find((template) => template.id === id)
}

export function formatInvitationMessage(templateMessage: string, invitationLink: string, eventName: string) {
  return templateMessage
    .replace(/{link_undangan}/g, invitationLink)
    .replace(/{nama_tamu}/g, 'Nama Tamu')
    .replace(/{event_name}/g, eventName)
}
