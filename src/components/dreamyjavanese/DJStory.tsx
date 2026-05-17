'use client'
import { motion } from 'framer-motion'

const ASSET = '/images/themes/dreamy-javanese'

interface StoryItem {
  date: string
  title: string
  description: string
  photo?: string
}

interface Props {
  stories?: StoryItem[]
}

const defaultStories: StoryItem[] = [
  { date: '1 Januari 2024', title: 'Pertama Bertemu', description: 'Kami pertama kali bertemu di sebuah acara keluarga.' },
  { date: '14 Februari 2024', title: 'Mulai Dekat', description: 'Seiring waktu, kami mulai saling mengenal lebih dalam.' },
  { date: '1 Januari 2025', title: 'Lamaran', description: 'Dengan restu kedua orang tua, kami memutuskan untuk melangkah ke jenjang pernikahan.' },
]

export default function DJStory({ stories }: Props) {
  const items = stories && stories.length > 0 ? stories : defaultStories

  return (
    <section className="relative w-full py-20 overflow-hidden" style={{ backgroundColor: '#2f2115' }}>
      <img src={`${ASSET}/paperize.png`} alt="" className="absolute inset-0 w-full h-full object-cover opacity-8 pointer-events-none" />

      {/* Crane bird decoration */}
      <img src={`${ASSET}/crane_bird.png`} alt="" className="absolute top-8 right-4 w-20 md:w-32 opacity-25 pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="font-dreamy-title text-[#d0ba96] tracking-[0.3em] uppercase text-xs mb-3">Our Journey</p>
          <h2 className="font-dreamy-display text-4xl md:text-5xl text-[#eedcbd]">Our Love Story</h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#d0ba96]/20 -translate-x-1/2" />

          {items.map((story, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`relative flex items-start gap-6 mb-12 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
            >
              {/* Content */}
              <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                <p className="font-dreamy-title text-[#d0ba96]/70 text-[10px] tracking-widest uppercase mb-1">{story.date}</p>
                <h3 className="font-dreamy-title text-[#eedcbd] text-sm mb-2">{story.title}</h3>
                <p className="font-dreamy-body text-[#d0ba96]/80 text-xs leading-relaxed">{story.description}</p>
              </div>

              {/* Dot */}
              <div className="relative flex-shrink-0">
                <div className="w-3 h-3 rounded-full bg-[#d0ba96] border-2 border-[#2f2115]" />
              </div>

              {/* Photo or spacer */}
              <div className="flex-1">
                {story.photo && (
                  <img src={story.photo} alt="" className="w-full h-24 object-cover rounded-lg opacity-80" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
